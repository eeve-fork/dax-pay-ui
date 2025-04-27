<template>
  <basic-modal
    title="聚合被扫配置"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="750"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item"
        ref="formRef"
        :model="form"
        :rules="rules"
        :validate-trigger="['blur', 'change']"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="付款码类型" validate-first name="barPayType">
          <a-select
            style="width: 15.625vw"
            v-model:value="form.barPayType"
            :disabled="showable"
            :options="aggregateCodeTypeList"
            allow-clear
            placeholder="请选择聚合支付类型"
          />
        </a-form-item>
        <a-form-item label="支付通道" name="channel">
          <a-select
            style="width: 15.625vw"
            v-model:value="form.channel"
            :disabled="showable"
            :options="channelList"
            allow-clear
            placeholder="请选择支付通道"
          />
        </a-form-item>
        <a-form-item label="支付方式" name="payMethod">
          <a-select
            style="width: 15.625vw"
            v-model:value="form.payMethod"
            :disabled="showable"
            :options="methodList"
            allow-clear
            placeholder="请选择支付方式"
            @change="changePayMethod"
          />
        </a-form-item>
        <a-form-item label="其他支付方式" name="otherMethod" v-if="form.payMethod == 'other'">
          <a-input
            allowClear
            style="width: 15.625vw"
            placeholder="请输入其他支付方式"
            v-model:value="form.otherMethod"
          />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button
          v-if="!showable"
          key="forward"
          :loading="confirmLoading"
          type="primary"
          @click="handleOk"
          >保存</a-button
        >
      </a-space>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import { BasicModal } from '@/components/Modal'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { FormEditType } from '@/enums/formTypeEnum'
  import {
    saveAggregatePayCodeConfig,
    updateAggregatePayCodeConfig,
    getAggregatePayCodeConfig,
    existsAggregatePayCodeConfig,
    existsAggregatePayCodeConfigNotId,
    AggregatePayCodeConfig,
  } from './Aggregate.api'
  import { computed, nextTick, onMounted, ref, unref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '@/hooks/bootx/useDict'

  const props = defineProps({
    appId: String,
  })

  const { dictDropDown } = useDict()

  const {
    handleCancel,
    initFormEditType,
    formEditType,
    confirmLoading,
    visible,
    showable,
    labelCol,
    wrapperCol,
  } = useFormEdit()

  const aggregateCodeTypeList = ref<LabeledValue[]>([])
  const channelList = ref<LabeledValue[]>([])
  const methodList = ref<LabeledValue[]>([])

  const formRef = ref<FormInstance>()

  let form = ref<AggregatePayCodeConfig>({})
  // 校验
  const rules = computed(() => {
    return {
      barPayType: [
        { required: true, message: '请选择付款码类型' },
        { validator: validateCode, trigger: 'blur' },
      ],
      channel: [{ required: true, message: '请选择支付通道类型' }],
      payMethod: [{ required: true, message: '请选择支付方式' }],
      otherMethod: [{ required: form.value.payMethod == 'other', message: '请输入其他支付方式' }],
    } as Record<string, Rule[]>
  })

  // 事件
  const emits = defineEmits(['ok'])

  //支付方式发生改变(只要切换，就将其他支付方式置空)
  function changePayMethod() {
    form.value.otherMethod = ''
  }

  onMounted(() => {
    initData()
  })

  /**
   * 入口
   */
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
    form.value.appId = props.appId
    form.value.id = id
  }

  /**
   * 初始化数据
   */
  async function initData() {
    aggregateCodeTypeList.value = await dictDropDown('aggregate_bar_pay_type')
    channelList.value = await dictDropDown('channel')
    methodList.value = await dictDropDown('pay_method')
  }

  /**
   * 获取信息
   */
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      getAggregatePayCodeConfig(id).then(({ data }) => {
        form.value = data
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }

  /**
   * 保存
   */
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await saveAggregatePayCodeConfig(unref(form)).finally(() => (confirmLoading.value = false))
      } else if (formEditType.value === FormEditType.Edit) {
        await updateAggregatePayCodeConfig(unref(form)).finally(
          () => (confirmLoading.value = false),
        )
      }
      handleCancel()
      emits('ok')
    })
  }

  /**
   * 校验编码重复
   */
  async function validateCode() {
    const { appId, barPayType, id } = form.value
    if (id) {
      const res = await existsAggregatePayCodeConfigNotId(appId, barPayType, id)
      return res.data ? Promise.reject('该聚合支付类型已存在') : Promise.resolve()
    } else {
      const res = await existsAggregatePayCodeConfig(appId, barPayType)
      return res.data ? Promise.reject('该聚合支付类型已存在') : Promise.resolve()
    }
  }

  // 重置表单的校验
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }
  defineExpose({ init })
</script>

<style scoped lang="less"></style>
