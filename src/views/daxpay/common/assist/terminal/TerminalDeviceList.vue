<template>
  <basic-drawer
    v-bind="$attrs"
    width="70%"
    title="终端设备管理"
    :mask-closable="true"
    :open="visible"
    @close="visible = false"
  >
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :fields="fields"
        :default-item-count="3"
        :sort-config="{ remote: true, trigger: 'cell' }"
        @query="queryPage"
        @reset="resetQueryParams"
        @sort-change="sortChange"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add()"
            >新建</a-button
          >
        </template>
      </vxe-toolbar>
      <div class="h-65vh">
        <vxe-table
          height="auto"
          key-field="id"
          ref="xTable"
          :data="pagination.records"
          :loading="loading"
          @sort-change="sortChange"
        >
          <vxe-column type="seq" title="序号" width="60" />
          <vxe-column field="terminalNo" title="终端编码" :min-width="230">
            <template #default="{ row }">
              <a @click="show(row)">
                {{ row.terminalNo }}
              </a>
            </template>
          </vxe-column>
          <vxe-column field="name" title="终端名称" :min-width="160" />
          <vxe-column field="type" title="终端类型" :min-width="160">
            <template #default="{ row }">
              {{ dictConvert('terminal_device_type', row.type) }}
            </template>
          </vxe-column>
          <vxe-column field="serialNum" title="终端序列号" :min-width="160" />
          <vxe-column field="gps" title="定位功能" :min-width="110" align="center">
            <template #default="{ row }">
              <a-tag :color="row.gps ? 'green' : 'red'">{{ row.gps ? '支持' : '不支持' }}</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="putDate" title="发放日期" :min-width="120" />
          <vxe-column field="createTime" title="创建时间" sortable :min-width="230" />
          <vxe-column fixed="right" width="220" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a-link @click="edit(row)">编辑</a-link>
              <a-divider type="vertical" />
              <a-link @click="showChannels(row)">通道报送</a-link>
              <a-divider type="vertical" />
              <a-link danger @click="del(row)">删除</a-link>
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
    <TerminalDeviceEdit :app-id="currentAppId" ref="terminalDeviceEdit" @ok="queryPage" />
    <ChannelTerminalList ref="channelTerminalList" />
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { page, remove } from './TerminalDevice.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbar, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { useDict } from '@/hooks/bootx/useDict'
  import ALink from '@/components/Link/Link.vue'
  import { BasicDrawer } from '@/components/Drawer'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import TerminalDeviceEdit from './TerminalDeviceEdit.vue'
  import ChannelTerminalList from './channel/ChannelTerminalList.vue'

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    sortChange,
    sortParam,
    pagination,
    pages,
    model,
    loading,
  } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  const currentAppId = ref<string>()
  const visible = ref(false)
  const terminalDeviceTypes = ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'name', type: STRING, name: '终端名称', placeholder: '请输入终端名称' },
      { field: 'terminalNo', type: STRING, name: '终端编码', placeholder: '请输入终端编码' },
      {
        field: 'type',
        type: LIST,
        name: '终端类型',
        placeholder: '请选择终端类型',
        selectList: terminalDeviceTypes.value,
      },
    ] as QueryField[]
  })

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const terminalDeviceEdit = ref<any>()
  const channelTerminalList = ref<any>()

  onMounted(() => {
    vxeBind()
    initData()
  })

  function vxeBind() {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    terminalDeviceTypes.value = await dictDropDown('terminal_device_type')
  }

  /**
   * 入口
   */
  async function init(appId) {
    visible.value = true
    currentAppId.value = appId
    queryPage()
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
      ...sortParam,
      appId: currentAppId.value,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }

  /**
   * 新增
   */
  function add() {
    terminalDeviceEdit.value.init(null, FormEditType.Add, currentAppId)
  }

  /**
   * 编辑
   */
  function edit(record) {
    terminalDeviceEdit.value.init(record.id, FormEditType.Edit)
  }

  /**
   * 查看
   */
  function show(record) {
    terminalDeviceEdit.value.init(record.id, FormEditType.Show)
  }

  /**
   * 通道列表
   */
  function showChannels(record) {
    channelTerminalList.value.init(record.id)
  }

  /**
   * 删除
   */
  function del(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '请确定要删除当前终端设备！',
      onOk: () => {
        loading.value = true
        remove(record.id).then(() => {
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

<style lang="less" scoped></style>
