<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    title="代理商默认权限配置"
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
            :model="formState"
            :label-col="{ span: 12 }"
            :wrapper-col="{ span: 12 }"
            autocomplete="off"
          >
            <a-row>
              <a-col :span="12">
                <a-form-item label="API接口能力" name="agentApi">
                  <a-radio-group v-model:value="formState.agentApi">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <!--              <a-col :span="12">-->
              <!--                <a-form-item label="查询商户订单(后台)" name="queryOrder">-->
              <!--                  <a-radio-group v-model:value="formState.queryOrder">-->
              <!--                    <a-radio :value="true">是</a-radio>-->
              <!--                    <a-radio :value="false">否</a-radio>-->
              <!--                  </a-radio-group>-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
              <!--              <a-col :span="12">-->
              <!--                <a-form-item label="代商户退款(后台)" name="refund">-->
              <!--                  <a-radio-group v-model:value="formState.refund">-->
              <!--                    <a-radio :value="true">是</a-radio>-->
              <!--                    <a-radio :value="false">否</a-radio>-->
              <!--                  </a-radio-group>-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
              <!--              <a-col :span="12">-->
              <!--                <a-form-item label="创建商户交易(后台)" name="createOrder">-->
              <!--                  <a-radio-group v-model:value="formState.createOrder">-->
              <!--                    <a-radio :value="true">是</a-radio>-->
              <!--                    <a-radio :value="false">否</a-radio>-->
              <!--                  </a-radio-group>-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
              <a-col :span="12">
                <a-form-item label="创建进件商户(后台)" name="createOnbMch">
                  <a-radio-group v-model:value="formState.createOnbMch">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="创建商户交易(API)" name="tradeApi">
                  <a-radio-group v-model:value="formState.tradeApi">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item label="设置商户结算类型(进件)" name="settleCycle">
                  <a-radio-group v-model:value="formState.settleCycle">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <!--              <a-col :span="12">-->
              <!--                <a-form-item label="设置商户应用(后台)" name="setupMchApp">-->
              <!--                  <a-radio-group v-model:value="formState.setupMchApp">-->
              <!--                    <a-radio :value="true">是</a-radio>-->
              <!--                    <a-radio :value="false">否</a-radio>-->
              <!--                  </a-radio-group>-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
              <a-col :span="12">
                <a-form-item label="设置商户分账规则(后台)" name="setupMchProfit">
                  <a-radio-group v-model:value="formState.setupMchProfit">
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
          <vxe-toolbar
            ref="channelToolbar"
            custom
            refresh
            :refresh-options="{ queryMethod: refreshChannelData }"
          />
          <div class="h-65vh">
            <vxe-table
              :row-config="{ keyField: 'value' }"
              :checkbox-config="{ checkRowKeys: formState.availableChannel }"
              ref="channelTable"
              :data="channelTableData"
              :loading="channelLoading"
            >
              <vxe-column type="checkbox" width="60" />
              <vxe-column field="label" title="名称" :min-width="150" />
              <vxe-column field="value" title="编码" :min-width="150" />
            </vxe-table>
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
            />
            <div class="h-65vh">
              <vxe-table
                :row-config="{ keyField: 'code' }"
                :checkbox-config="{ checkRowKeys: formState.availableApi }"
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
  import { apiList, ChannelConst } from '@/views/daxpay/common/constant/ApiConst.api'
  import { dropdownByEnable } from '@/views/daxpay/common/constant/channel/ChannelConst.api'
  import { getConfig, updateConfig, IsvDefaultPermConfig } from './IsvDefaultPermConfig.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'

  const visible = ref(false)
  const loading = ref(false)
  const currentIsvNo = ref('')
  const formRef = ref()
  const { createMessage } = useMessage()
  const activeTab = ref('basic')

  // 表单数据
  const formState = reactive<IsvDefaultPermConfig>({})

  // 通道表格相关
  const channelLoading = ref(false)
  const channelTableData = ref<LabeledValue[]>([])
  const channelTable = ref<VxeTableInstance>()
  const channelToolbar = ref<VxeToolbarInstance>()

  // API表格相关
  const apiLoading = ref(false)
  const apiTableData = ref<ChannelConst[]>([])
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
  function init(isvNo) {
    currentIsvNo.value = isvNo
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
      apiTable.value?.clearCheckboxRow()
      // 加载配置数据
      await getConfig(currentIsvNo.value).then(({ data }) => {
        Object.assign(formState, data)
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
      await dropdownByEnable().then(({ data }) => {
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
      await apiList().then(({ data }) => {
        apiTableData.value = data
      })
    } finally {
      apiLoading.value = false
    }
  }

  /**
   * 刷新通道数据
   */
  function refreshChannelData() {
    loadChannelData()
    return Promise.resolve()
  }

  /**
   * 刷新API数据
   */
  function refreshApiData() {
    loadApiData()
    return Promise.resolve()
  }

  /**
   * 提交表单
   */
  async function handleSubmit() {
    loading.value = true
    try {
      // 获取选中的通道
      const selectedChannels = channelTable.value
        ?.getCheckboxRecords()
        .map((record: any) => record.value)

      // 获取选中的API
      const selectedApis = apiTable.value?.getCheckboxRecords().map((record: any) => record.code)

      // 设置服务商号和选中的通道、API
      const submitData = {
        ...formState,
        isvNo: currentIsvNo.value,
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
