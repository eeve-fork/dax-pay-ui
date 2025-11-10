<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    title="商户默认权限配置"
    width="65%"
    :open="visible"
    @close="handleCancel"
  >
    <a-spin :spinning="loading">
      <a-tabs v-model:activeKey="activeTab">
        <!-- 基本权限 Tab -->
        <a-tab-pane key="basic" tab="基本权限">
          <a-form
            ref="formRef"
            :model="form"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
          >
            <a-row>
              <a-col :span="12">
                <a-form-item label="API接口" name="hasApi">
                  <a-radio-group v-model:value="form.hasApi">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="进件申请" name="applyMch">
                  <a-radio-group v-model:value="form.applyMch">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item label="设置分账规则" name="setupMchProfit">
                  <a-radio-group v-model:value="form.setupMchProfit">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>

        <!-- 可用通道 Tab -->
        <a-tab-pane key="channel" tab="可用通道">
          <div>
            <vxe-toolbar
              ref="channelToolbar"
              custom
              refresh
              :refresh-options="{ queryMethod: refreshChannelData }"
            >
              <template #buttons>
                <a-button
                  danger
                  v-if="form.availableChannel?.length"
                  @click="
                    () => {
                      channelTable?.clearCheckboxRow()
                      form.availableChannel = []
                    }
                  "
                  >清空权限(保存报错时使用)</a-button
                >
              </template>
            </vxe-toolbar>
            <div class="h-65vh">
              <vxe-table
                :row-config="{ keyField: 'code' }"
                :checkbox-config="{ checkRowKeys: form.availableChannel }"
                ref="channelTable"
                height="auto"
                :data="channelTableData"
                :loading="channelLoading"
              >
                <vxe-column type="checkbox" width="60" />
                <vxe-column field="name" title="名称" :min-width="150" />
                <vxe-column field="code" title="编码" :min-width="150" />
              </vxe-table>
            </div>
          </div>
        </a-tab-pane>

        <!-- 可用接口 Tab -->
        <a-tab-pane key="api" tab="可用接口">
          <div>
            <vxe-toolbar
              ref="apiToolbar"
              custom
              refresh
              :refresh-options="{ queryMethod: refreshApiData }"
            >
              <template #buttons>
                <a-button
                  danger
                  v-if="form.availableApi?.length"
                  @click="
                    () => {
                      apiTable?.clearCheckboxRow()
                      form.availableApi = []
                    }
                  "
                  >清空权限(保存报错时使用)</a-button
                >
              </template>
            </vxe-toolbar>
            <div class="h-65vh">
              <vxe-table
                :row-config="{ keyField: 'code' }"
                :checkbox-config="{ checkRowKeys: form.availableApi }"
                ref="apiTable"
                height="auto"
                :data="apiTableData"
                :loading="apiLoading"
              >
                <vxe-column type="checkbox" width="60" />
                <vxe-column field="name" title="名称" :min-width="150" />
                <vxe-column field="code" title="编码" :width="150" />
                <vxe-column field="api" title="路径" :min-width="200" />
              </vxe-table>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicDrawer } from '@/components/Drawer'
  import {
    getConfig,
    updateConfig,
    apiPermList,
    channelPermList,
    AgentDefaultPermConfigResult,
    ApiConstResult,
    ChannelConstResult,
  } from './AgentDefaultPermConfig.api'

  const visible = ref(false)
  const loading = ref(false)
  const currentAgentNo = ref('')
  const formRef = ref()
  const { createMessage, createConfirm } = useMessage()
  const activeTab = ref('basic')

  // 表单数据
  const form = reactive<AgentDefaultPermConfigResult>({})

  // 通道表格相关
  const channelLoading = ref(false)
  const channelTableData = ref<ChannelConstResult[]>([])
  const channelTable = ref<VxeTableInstance>()
  const channelToolbar = ref<VxeToolbarInstance>()

  // API表格相关
  const apiLoading = ref(false)
  const apiTableData = ref<ApiConstResult[]>([])
  const apiTable = ref<VxeTableInstance>()
  const apiToolbar = ref<VxeToolbarInstance>()

  onMounted(() => {
    // 连接表格和工具栏
    channelTable.value?.connectToolbar(channelToolbar.value as VxeToolbarInstance)
    apiTable.value?.connectToolbar(apiToolbar.value as VxeToolbarInstance)
  })

  /**
   * 初始化
   */
  function init(agentNo: string) {
    currentAgentNo.value = agentNo
    activeTab.value = 'basic'
    visible.value = true
    loadData()
  }

  /**
   * 加载数据
   */
  async function loadData() {
    loading.value = true
    try {
      await loadChannelData()
      await loadApiData()
      // 加载配置数据
      await getConfig(currentAgentNo.value).then(({ data }) => {
        if (data) {
          Object.assign(form, data)
        }
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载通道数据
   */
  async function loadChannelData() {
    channelLoading.value = true
    try {
      // 加载通道选项
      await channelPermList(currentAgentNo.value).then(({ data }) => {
        channelTableData.value = data
      })
    } finally {
      channelLoading.value = false
    }
  }

  /**
   * 加载API数据
   */
  async function loadApiData() {
    apiLoading.value = true
    try {
      // 加载API选项
      await apiPermList(currentAgentNo.value).then(({ data }) => {
        apiTableData.value = data
      })
    } finally {
      apiLoading.value = false
    }
  }

  /**
   * 刷新通道数据
   */
  async function refreshChannelData() {
    await loadChannelData()
  }

  /**
   * 刷新API数据
   */
  async function refreshApiData() {
    await loadApiData()
  }

  /**
   * 提交表单
   */
  async function handleSubmit() {
    createConfirm({
      iconType: 'warning',
      title: '确认保存',
      content: '您确定要保存当前配置吗？',
      onOk: async () => {
        loading.value = true
        try {
          // 获取选中的通道
          const selectedChannels = channelTable.value
            ?.getCheckboxRecords()
            .map((record: any) => record.value)

          // 获取选中的API
          const selectedApis = apiTable.value?.getCheckboxRecords().map((record: any) => record.code)

          // 设置代理商号和选中的通道、API
          const submitData = {
            ...form,
            agentNo: currentAgentNo.value,
            availableChannel: selectedChannels,
            availableApi: selectedApis,
          }

          // 提交表单
          await updateConfig(submitData)
          createMessage.success('保存成功')
          handleCancel()
        } finally {
          loading.value = false
        }
      }
    })
  }

  /**
   * 取消
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
