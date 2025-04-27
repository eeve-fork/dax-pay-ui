<template>
  <div>
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
      <template #buttons>
        <a-space>
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table ey-field="id" ref="xTable" :data="records" :loading="loading">
      <vxe-column type="seq" width="60" />
      <vxe-column field="name" title="码牌名称" :min-width="150">
        <template #default="{ row }">
          <a href="javascript:" @click="show(row)">{{ row.name }}</a>
        </template>
      </vxe-column>
      <vxe-column field="code" title="码牌编号" :min-width="220" />
      <vxe-column field="enable" title="是否启用" align="center" :min-width="150">
        <template #default="{ row }">
          <a-tag :color="row.enable ? 'green' : 'red'">
            {{ row.enable ? '开启' : '关闭' }}
          </a-tag>
        </template>
      </vxe-column>
      <vxe-column field="allocation" title="分账" align="center" :min-width="150">
        <template #default="{ row }">
          <a-tag :color="row.allocation ? 'green' : 'red'">
            {{ row.allocation ? '开启' : '关闭' }}
          </a-tag>
        </template>
      </vxe-column>
      <vxe-column field="autoAllocation" title="自动分账" align="center" :min-width="150">
        <template #default="{ row }">
          <a-tag :color="row.autoAllocation ? 'green' : 'red'">
            {{ row.autoAllocation ? '开启' : '关闭' }}
          </a-tag>
        </template>
      </vxe-column>
      <vxe-column field="remark" title="备注" :min-width="150" />
      <vxe-column field="createTime" title="创建时间" :min-width="150" />
      <vxe-column fixed="right" :width="280" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="typeConfig(row)">类型配置</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="getCode(row)">获取码牌</a>
          <a-divider type="vertical" />
          <a href="javascript:" style="color: red" @click="del(row)">删除</a>
        </template>
      </vxe-column>
    </vxe-table>
    <a-modal
      title="商户收款码牌"
      :loading="modelLoading"
      :width="500"
      :open="modelVisible"
      :mask-closable="false"
      :footer="null"
      @cancel="() => (modelVisible = false)"
    >
      <div class="flex justify-center" style="padding: 30px 0">
        <a-qrcode
          ref="qrcodeCanvasRef"
          :status="modelLoading ? 'loading' : 'active'"
          :size="350"
          :value="qrUrl"
          :error-level="'Q'"
          color="black"
          bg-color="white"
        />
      </div>
      <div class="flex justify-center" style="margin-bottom: 20px">
        <a-button type="primary" @click="download">保存码牌</a-button>
        <a-button style="margin-left: 25px" @click="copy">复制地址</a-button>
      </div>
    </a-modal>
    <CodeCardTypeConfigList ref="codeCardsTypeConfigList" :appId="props.appId" />
    <CodeCardConfigEdit ref="codeCardsConfigEdit" :appId="props.appId" @ok="queryPage" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import {
    CodeCardConfig,
    delCodeCardConfig,
    getCodeCardList,
    getCodeCardUrl,
  } from './CodeCard.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import CodeCardTypeConfigList from './CodeCardTypeConfigList.vue'
  import CodeCardConfigEdit from './CodeCardConfigEdit.vue'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { copyText } from '@/utils/copyTextToClipboard'

  const { createMessage, createConfirm } = useMessage()

  const loading = ref(false)
  const records = ref<CodeCardConfig[]>([])

  // 获取码牌模块
  const modelLoading = ref(false)
  const modelVisible = ref(false)
  const qrUrl = ref<string>('') // 码牌地址

  const codeCardsTypeConfigList = ref<any>() //配置弹窗
  const codeCardsConfigEdit = ref<any>() //新增编辑弹窗
  const qrcodeCanvasRef = ref<any>()

  const props = defineProps({
    appId: String,
  })

  onMounted(() => queryPage())

  /**
   * 查询列表
   */
  function queryPage() {
    loading.value = true
    getCodeCardList(props.appId).then(({ data }) => {
      records.value = data
      loading.value = false
    })
  }

  /**
   * 新增
   */
  function add() {
    codeCardsConfigEdit.value.init(null, FormEditType.Add)
  }

  /**
   * 编辑
   */
  function edit(record) {
    codeCardsConfigEdit.value.init(record.id, FormEditType.Edit)
  }
  /**
   * 查看
   */
  function show(record) {
    codeCardsConfigEdit.value.init(record.id, FormEditType.Show)
  }
  /**
   * 类型配置
   */
  function typeConfig(record) {
    codeCardsTypeConfigList.value.init(record.id)
  }
  /**获取码牌
   * 类型配置
   */
  function getCode(record) {
    modelVisible.value = true
    modelLoading.value = true
    getCodeCardUrl(record.id)
      .then(({ data }) => {
        qrUrl.value = data
        modelLoading.value = false
      })
      .catch(() => {
        createMessage.error('获取码牌地址失败')
      })
  }
  /**
   * 删除
   */
  function del(record) {
    createConfirm({
      iconType: 'warning',
      title: '删除',
      content: '是否删除该数据',
      onOk: () => {
        loading.value = true
        delCodeCardConfig(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
  /**
   * 复制
   */
  function copy() {
    copyText(qrUrl.value)
  }

  /**
   * 下载
   */
  async function download() {
    const url = qrcodeCanvasRef.value.toDataURL()
    const a = document.createElement('a')
    a.download = 'QRCode.png'
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
</script>

<style scoped lang="less"></style>
