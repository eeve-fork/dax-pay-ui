<template>
  <basic-drawer
    v-bind="$attrs"
    width="70%"
    title="收款码牌配置项管理"
    :mask-closable="true"
    :open="visible"
    @close="handleCancel"
  >
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
      <template #buttons>
        <a-space>
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table ey-field="id" ref="xTable" :data="records" :loading="loading">
      <vxe-column type="seq" width="60" />
      <vxe-column field="type" title="码牌类型" align="center" :min-width="150">
        <template #default="{ row }">
          {{ dictConvert('cashier_code_type', row.type) }}
        </template>
      </vxe-column>
      <vxe-column field="channel" title="支付通道" align="center" :min-width="150">
        <template #default="{ row }">
          {{ dictConvert('channel', row.channel) }}
        </template>
      </vxe-column>
      <vxe-column field="payMethod" title="支付方式" align="center" :min-width="150">
        <template #default="{ row }">
          {{ dictConvert('pay_method', row.payMethod) }}
        </template>
      </vxe-column>
      <vxe-column field="needOpenId" title="获取OpenId" align="center" :min-width="150">
        <template #default="{ row }">
          <a-tag :color="row.needOpenId ? 'green' : 'red'">
            {{ row.needOpenId ? '需要' : '不需要' }}
          </a-tag>
        </template>
      </vxe-column>
      <vxe-column field="callType" title="调用类型" align="center" :min-width="150">
        <template #default="{ row }">
          {{ dictConvert('gateway_call_type', row.callType) }}
        </template>
      </vxe-column>
      <vxe-column field="createTime" title="创建时间" :min-width="170" />
      <vxe-column fixed="right" :width="150" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:" style="color: red" @click="del(row)">删除</a>
        </template>
      </vxe-column>
    </vxe-table>
    <CodeCardTypeConfigEdit ref="codeCardsTypeConfigEdit" @ok="queryPage" :appId="props.appId" />
  </basic-drawer>
</template>
<script setup lang="ts">
  import { BasicDrawer } from '@/components/Drawer'
  import { ref } from 'vue'
  import {
    delCodeCardTypeConfig,
    getCodeCardTypeList,
    CodeCardConfigType,
  } from './CodeCard.api'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useDict } from '@/hooks/bootx/useDict'
  import CodeCardTypeConfigEdit from './CodeCardTypeConfigEdit.vue'

  const props = defineProps({
    appId: String,
  })

  const { createConfirm, createMessage } = useMessage()
  const { dictConvert } = useDict()

  const currentConfigId = ref<string>('')
  const loading = ref(false)
  const visible = ref(false)
  const records = ref<CodeCardConfigType[]>([])

  const codeCardsTypeConfigEdit = ref<any>()
  /**
   * 初始化并展示
   */
  async function init(codeId) {
    visible.value = true
    loading.value = false
    currentConfigId.value = codeId
    queryPage()
  }

  /**
   * 查询
   */
  function queryPage() {
    // 列表信息
    loading.value = true
    getCodeCardTypeList(currentConfigId.value).then(({ data }) => {
      records.value = data
      loading.value = false
    })
  }

  /**
   * 关闭页面
   */
  function handleCancel() {
    visible.value = false
  }

  /**
   * 新增
   */
  function add() {
    codeCardsTypeConfigEdit.value.init(null, FormEditType.Add, currentConfigId.value)
  }
  /**
   * 编辑
   */
  function edit(record) {
    codeCardsTypeConfigEdit.value.init(record.id, FormEditType.Edit, currentConfigId.value)
  }
  /**
   * 查看
   */
  function show(record) {
    codeCardsTypeConfigEdit.value.init(record.id, FormEditType.Show, currentConfigId.value)
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
        delCodeCardTypeConfig(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
  defineExpose({
    init,
  })
</script>
<style scoped lang="less"></style>
