<template>
  <div>
    <div class="p-3">
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
          <a-button type="primary" @click="add">新增</a-button>
        </template>
      </vxe-toolbar>
      <div class="h-60vh">
        <vxe-table
          height="auto"
          key-field="id"
          ref="xTable"
          :data="pagination.records"
          :loading="loading"
          :sort-config="{ remote: true, trigger: 'cell' }"
          @sort-change="sortChange"
        >
          <vxe-column type="seq" title="序号" width="60" />
          <vxe-column field="receiverNo" title="编号" :min-width="180">
            <template #default="{ row }">
              <a-link @click="show(row)">{{ row.receiverNo }}</a-link>
            </template>
          </vxe-column>
          <vxe-column field="receiverName" title="名称" :min-width="180" />
          <vxe-column field="receiverAccount" title="接收方账号" :min-width="230" />
          <vxe-column field="channel" title="所属通道" :min-width="170" align="center">
            <template #default="{ row }">
              <a-tag>{{ dictConvert('channel', row.channel) }}</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="receiverType" title="接收方类型" :min-width="100" align="center">
            <template #default="{ row }">
              <a-tag>{{ dictConvert('alloc_receiver_type', row.receiverType) }}</a-tag>
            </template>
          </vxe-column>
          <vxe-column fixed="right" width="130" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a-link @click="edit(row)">编辑</a-link>
              <a-divider type="vertical" />
              <a-link danger @click="remove(row)">删除</a-link>
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
    <AllocationReceiverEdit ref="allocationReceiverEdit" @ok="queryPage" :appId="appId" />
    <AllocationReceiverSelect ref="allocationReceiverSelect" @next="next" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { AllocReceiver, del, findChannels, page } from './AllocationReceiver.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useDict } from '@/hooks/bootx/useDict'
  import ALink from '/@/components/Link/Link.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import AllocationReceiverEdit from './AllocationReceiverEdit.vue'
  import { FormEditType } from '@/enums/formTypeEnum'
  import AllocationReceiverSelect from './AllocationReceiverSelect.vue'

  const { appId } = defineProps<{ appId: string }>()

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    pagination,
    sortChange,
    sortParam,
    pages,
    model,
    loading,
  } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const allocationReceiverEdit = ref<any>()
  const allocationReceiverSelect = ref<any>()

  let payChannelList = ref<LabeledValue[]>([])
  let relationTypeList = ref<LabeledValue[]>([])
  let receiverTypeList = ref<LabeledValue[]>([])

  const fields = computed(() => {
    return [
      { field: 'receiverNo', type: STRING, name: '编号', placeholder: '请输入接收方编号' },
      { field: 'receiverName', type: STRING, name: '名称', placeholder: '请输入接收方名称' },
      { field: 'receiverAccount', type: STRING, name: '账号', placeholder: '请输入接收方账号' },
      {
        field: 'channel',
        type: LIST,
        name: '通道',
        placeholder: '请选择接收方所属通道',
        selectList: payChannelList.value,
      },
      {
        field: 'receiverType',
        type: LIST,
        name: '接收方类型',
        placeholder: '请选择接收方类型',
        selectList: receiverTypeList.value,
      },
    ] as QueryField[]
  })
  onMounted(() => {
    vxeBind()
    initData()
    queryPage()
  })

  /**
   * 绑定
   */
  function vxeBind() {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    findChannels().then(({ data }) => (payChannelList.value = data))
    relationTypeList.value = await dictDropDown('alloc_relation_type')
    receiverTypeList.value = await dictDropDown('alloc_receiver_type')
  }

  /**
   * 新增
   */
  function add() {
    allocationReceiverSelect.value.init()
  }
  /**
   * 新增
   */
  function next(channel) {
    allocationReceiverEdit.value.add(channel)
  }
  /**
   * 编辑
   */
  function edit(row: any) {
    allocationReceiverEdit.value.init(row, FormEditType.Edit)
  }
  /**
   * 查看
   */
  function show(row: any) {
    allocationReceiverEdit.value.init(row, FormEditType.Show)
  }
  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      appId,
      ...pages,
      ...sortParam,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }

  /**
   * 删除
   */
  function remove(record: AllocReceiver) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否确认删除该条数据?',
      onOk: () => {
        loading.value = true
        del(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
</script>

<style scoped lang="less"></style>
