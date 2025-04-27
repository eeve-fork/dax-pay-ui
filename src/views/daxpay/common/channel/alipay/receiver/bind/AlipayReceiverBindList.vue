<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :fields="fields"
        :default-item-count="3"
        @query="queryPage"
        @reset="resetQueryParams"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add"
              >新建绑定</a-button
            >
          </a-space>
        </template>
      </vxe-toolbar>
      <div class="h-65vh">
        <vxe-table
          height="auto"
          ref="xTable"
          key-field="id"
          :data="pagination.records"
          :loading="loading"
        >
          <vxe-column type="seq" width="60" />
          <vxe-column field="receiverAccount" title="接收方账号" :min-width="230">
            <template #default="{ row }">
              <a-link @click="show(row.id)">{{ row.receiverAccount }}</a-link>
            </template>
          </vxe-column>
          <vxe-column field="receiverName" title="接收方名称" :min-width="170" />
          <vxe-column field="receiverType" title="接收方类型" :min-width="120">
            <template #default="{ row }">
              {{ dictConvert('alloc_receiver_type', row.receiverType) }}
            </template>
          </vxe-column>
          <vxe-column field="isv" title="通道类型" :min-width="120" align="center">
            <template #default="{ row }">
              <a-tag v-if="row.isv" color="orange">服务商</a-tag>
              <a-tag v-else color="green">直联</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="bind" title="是否绑定" :min-width="120" align="center">
            <template #default="{ row }">
              <a-tag v-if="row.bind" color="green"
                ><a-link danger @click="unbindReceiver(row.id)">解绑</a-link></a-tag
              >
              <a-tag v-else color="red"><a-link @click="bindReceiver(row.id)">绑定</a-link></a-tag>
            </template>
          </vxe-column>
          <vxe-column field="relationType" title="分账关系" :min-width="170">
            <template #default="{ row }">
              <template v-if="row.relationType === AllocRelationTypeEnum.CUSTOM">
                {{ row.relationName }}
              </template>
              <template v-else>
                {{ dictConvert('alloc_relation_type', row.relationType) }}
              </template>
            </template>
          </vxe-column>
          <vxe-column field="errorMsg" title="错误提示" :min-width="220" />
          <vxe-column field="createTime" title="创建时间" :min-width="170" />
          <vxe-column field="appName" title="应用" :min-width="170" />
          <vxe-column fixed="right" :width="120" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a-link :disabled="row.bind" @click="edit(row.id)">编辑</a-link>
              <a-divider type="vertical" />
              <a-link danger @click="remove(row.id)">删除</a-link>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <vxe-pager
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
    </div>
    <AlipayReceiverBindEdit ref="alipayReceiverBindEdit" @ok="queryPage" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { del, page, bind, unbind } from './AlipayReceiverBind.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { useMessage } from '@/hooks/web/useMessage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import ALink from '@/components/Link/Link.vue'
  import AlipayReceiverBindEdit from './AlipayReceiverBindEdit.vue'
  import { useDict } from '@/hooks/bootx/useDict'
  import { AllocRelationTypeEnum } from '@/enums/daxpay/daxpayEnum'

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    pagination,
    pages,
    model,
    loading,
  } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()
  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'name', type: STRING, name: '名称', placeholder: '请输入进件申请单名称' },
    ] as QueryField[]
  })
  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const alipayReceiverBindEdit = ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })

  function vxeBind() {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
  }

  // 分页查询
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }
  /**
   * 新增
   */
  function add() {
    alipayReceiverBindEdit.value.init(null, FormEditType.Add)
  }
  /**
   * 新增
   */
  function edit(id) {
    alipayReceiverBindEdit.value.init(id, FormEditType.Edit)
  }
  /**
   * 查看
   */
  function show(id) {
    alipayReceiverBindEdit.value.init(id, FormEditType.Show)
  }

  /**
   * 绑定
   */
  function bindReceiver(id) {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '是否绑定接收方',
      onOk: () => {
        bind(id).then(() => {
          createMessage.success('绑定成功')
          queryPage()
        })
      },
    })
  }
  /**
   * 绑定
   */
  function unbindReceiver(id) {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '是否取消绑定接收方',
      onOk: () => {
        unbind(id).then(() => {
          createMessage.success('解绑成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 删除
   */
  function remove(id) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否删除该条数据',
      onOk: () => {
        del(id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
