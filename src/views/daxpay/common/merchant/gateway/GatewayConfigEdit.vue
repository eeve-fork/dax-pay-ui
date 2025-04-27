<template>
  <a-spin :spinning="confirmLoading">
    <a-form
      class="small-from-item"
      :model="form"
      ref="formRef"
      :validate-trigger="['blur', 'change']"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <!--      <a-form-item label="收银台名称" name="name">-->
      <!--        <a-input v-model:value="form.name" :disabled="!edit" placeholder="请输入收银台名称" />-->
      <!--      </a-form-item>-->
      <a-form-item label="同时显示聚合收银码" name="aggregateShow">
        <a-radio-group v-model:value="form.aggregateShow" :disabled="!edit" button-style="solid">
          <a-radio-button :value="false">不显示</a-radio-button>
          <a-radio-button :value="true">显示</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <!--      <a-form-item label="同时显示聚合条码支付" name="barPayShow">-->
      <!--        <a-radio-group v-model:value="form.barPayShow" :disabled="!edit" button-style="solid">-->
      <!--          <a-radio-button :value="false">不显示</a-radio-button>-->
      <!--          <a-radio-button :value="true">显示</a-radio-button>-->
      <!--        </a-radio-group>-->
      <!--      </a-form-item>-->
      <a-form-item label="H5收银台自动升级聚合支付" name="h5AutoUpgrade">
        <a-radio-group v-model:value="form.h5AutoUpgrade" :disabled="!edit" button-style="solid">
          <a-radio-button :value="false">不升级</a-radio-button>
          <a-radio-button :value="true">升级</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="小程序快捷收银开启分账" name="miniAppAllocation">
        <a-radio-group
          v-model:value="form.miniAppAllocation"
          :disabled="!edit"
          button-style="solid"
        >
          <a-radio-button :value="false">关闭</a-radio-button>
          <a-radio-button :value="true">开启</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="小程序快捷收银自动分账" name="miniAppAutoAllocation">
        <a-radio-group
          v-model:value="form.miniAppAutoAllocation"
          :disabled="!edit"
          button-style="solid"
        >
          <a-radio-button :value="false">关闭</a-radio-button>
          <a-radio-button :value="true">开启</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="小程序快捷收银限制用户支付类型" name="limitPay">
        <a-select
          style="width: 250px"
          allow-clear
          :disabled="!edit"
          v-model:value="form.miniAppLimitPay"
          :options="[{ label: '信用卡支付', value: 'no_credit' }]"
          placeholder="请选择限制用户支付的类型"
        />
      </a-form-item>
      <a-form-item name="miniAppTerminalNo">
        <template #label>
          <basic-title
            helpMessage="部分通道付款码支付的时候要求上送终端设备信息, 所以需要选择默认的收款终端设备"
            >小程序关联终端号</basic-title
          >
        </template>
        <a-select
          style="width: 250px"
          allow-clear
          :disabled="!edit"
          v-model:value="form.miniAppTerminalNo"
          :options="terminalOptions"
          placeholder="请选择限制用户支付的类型"
        />
      </a-form-item>
    </a-form>
    <a-space :size="55" class="flex justify-center">
      <a-button v-if="edit" @click="initData">取消</a-button>
      <a-button v-if="edit" type="primary" @click="update"
        >{{ form.id ? '更新' : '保存' }}
      </a-button>
      <a-button v-if="!edit" @click="edit = true">编辑信息</a-button>
    </a-space>
  </a-spin>
</template>

<script setup lang="ts">
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { onMounted, ref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { GatewayConfig, getConfig, saveConfig, updateConfig } from './GatewayConfig.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicTitle } from '@/components/Basic'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { dropdown } from '@/views/daxpay/common/assist/terminal/TerminalDevice.api'

  const { labelCol, wrapperCol, confirmLoading, showable } = useFormEdit()
  const { createMessage } = useMessage()

  const edit = ref<boolean>(false)

  const props = defineProps({
    appId: String,
  })

  onMounted(() => {
    initData()
  })

  const terminalOptions = ref<LabeledValue[]>([])
  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<GatewayConfig>({
    aggregateShow: false,
    barPayShow: false,
    h5AutoUpgrade: false,
    miniAppAllocation: false,
    miniAppAutoAllocation: false,
  })

  const rules = {
    aggregateShow: [{ required: true, message: '是否显示显示聚合收银码必选' }],
    h5AutoUpgrade: [{ required: true, message: 'H5收银台自动升级聚合支付必选' }],
    barPayShow: [{ required: true, message: '是否显示聚合条码支付必选' }],
    miniAppAllocation: [{ required: true, message: '小程序是否分账必选' }],
    miniAppAutoAllocation: [{ required: true, message: '小程序是否自动分账必选' }],
  } as Record<string, Rule[]>

  /**
   * 重置信息
   */
  function initData() {
    confirmLoading.value = true
    edit.value = false
    // 配置
    getConfig(props.appId).then(({ data }) => {
      form.value = data
      confirmLoading.value = false
      form.value.appId = props.appId
    })
    // 终端下拉
    dropdown(props.appId).then(({ data }) => {
      terminalOptions.value = data
    })
  }

  /**
   * 更新配置
   */
  function update() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      if (form.value.id) {
        updateConfig(form.value)
          .then(() => {
            edit.value = false
            createMessage.success('更新成功')
          })
          .finally(() => (confirmLoading.value = false))
      } else {
        saveConfig(form.value)
          .then(() => {
            createMessage.success('保存成功')
            initData()
          })
          .finally(() => (confirmLoading.value = false))
      }
    })
  }
</script>

<style scoped lang="less"></style>
