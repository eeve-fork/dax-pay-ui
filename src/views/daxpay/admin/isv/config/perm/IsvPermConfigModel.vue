<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    title="服务商API接口权限"
    width="65%"
    :open="visible"
    @close="handleCancel"
  >
    <div>
      <vxe-toolbar ref="xToolbar" custom refresh :refresh-options="{ queryMethod: refreshData }" />
      <vxe-table
        :row-config="{ keyField: 'code' }"
        ref="xTable"
        :data="tableData"
        :loading="loading"
      >
        <vxe-column type="checkbox" width="60" />
        <vxe-column field="name" title="名称" :min-width="150" />
        <vxe-column field="code" title="编码" :min-width="150" />
        <vxe-column field="api" title="路径" :min-width="200" />
      </vxe-table>
    </div>
    <template #footer>
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="saveSelection">保存</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicDrawer } from '@/components/Drawer'
  import { apiList, ChannelConst } from '@/views/daxpay/common/constant/ApiConst.api'
  import { getConfig, updateConfig } from './IsvPermConfig.api'

  const currentIsvNo = ref('')
  const visible = ref(false)
  // 表格数据
  const loading = ref(false)
  const tableData = ref<ChannelConst[]>([])
  const checkedKeys = ref<string[]>([])

  // 表格实例
  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()

  const { createMessage } = useMessage()

  onMounted(() => {
    xTable.value?.connectToolbar(xToolbar.value as VxeToolbarInstance)
  })

  /**
   * 入口
   */
  function init(isvNo) {
    currentIsvNo.value = isvNo
    visible.value = true
    initData()
  }

  /**
   * 初始化数据
   */
  async function initData() {
    loading.value = true
    // 查询API数据
    await apiList().then(({ data }) => {
      tableData.value = data
    })
    // 查询已经有的权限
    await getConfig(currentIsvNo.value).then(({ data }) => {
      checkedKeys.value = data?.availableApi || []
      xTable.value?.setCheckboxRowKey(checkedKeys.value, true)
    })
    loading.value = false
  }

  /**
   * 刷新数据
   */
  function refreshData() {
    initData()
    return Promise.resolve()
  }

  /**
   * 保存选择
   */
  function saveSelection() {
    const selectedKeys = xTable.value?.getCheckboxRecords().map((record) => record.code)
    updateConfig({
      isvNo: currentIsvNo.value,
      availableApi: selectedKeys,
    })
    visible.value = false
    createMessage.success('保存成功')
  }

  /**
   * 关闭
   */
  function handleCancel() {
    visible.value = false
  }

  // 对外暴露方法
  defineExpose({
    init,
  })
</script>

<style scoped lang="less">
  .h-65vh {
    height: 65vh;
    overflow: auto;
  }
</style>
