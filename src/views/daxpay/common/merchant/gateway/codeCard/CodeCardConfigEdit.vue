<template>
  <basic-modal
    title="收款码牌配置"
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
        <a-form-item label="码牌编码" name="code" v-if="addOrEdit === 'edit'">
          <a-input v-model:value="form.code" :disabled="true" />
        </a-form-item>
        <a-form-item label="码牌名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入码牌名称" />
        </a-form-item>
        <a-form-item label="是否启用" name="enable">
          <a-switch
            :disabled="showable"
            v-model:checked="form.enable"
            checked-children="是"
            un-checked-children="否"
          />
        </a-form-item>
        <a-form-item label="分账" name="allocation">
          <a-switch
            :disabled="showable"
            v-model:checked="form.allocation"
            checked-children="是"
            un-checked-children="否"
          />
        </a-form-item>
        <a-form-item label="自动分账" name="autoAllocation">
          <a-switch
            :disabled="showable"
            v-model:checked="form.autoAllocation"
            checked-children="是"
            un-checked-children="否"
          />
        </a-form-item>
        <a-form-item label="限制用户支付类型" name="limitPay">
          <a-select
            allow-clear
            :disabled="showable"
            v-model:value="form.limitPay"
            :options="[{ label: '信用卡支付', value: 'no_credit' }]"
            placeholder="请选择限制用户支付的类型"
          />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea
            :rows="3"
            v-model:value="form.remark"
            :disabled="showable"
            placeholder="请输入备注"
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
    saveCodeCardConfig,
    editCodeCardConfig,
    CodeCardConfig,
    getCodeCardListById,
  } from './CodeCard.api'
  import { nextTick, ref, unref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'

  const props = defineProps({
    appId: String,
  })

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
  const addOrEdit = ref('')
  const formRef = ref<FormInstance>()

  let form = ref<CodeCardConfig>({
    enable: true,
    allocation: false,
    autoAllocation: false,
  })
  // 校验
  const rules = {
    code: [{ required: true, message: '' }],
    name: [{ required: true, message: '请输入码牌名称' }],
    enable: [{ required: true, message: '请选择码牌是否启用' }],
    allocation: [{ required: true, message: '请选择是否开启分账' }],
    autoAllocation: [{ required: true, message: '请选择是否自动分账' }],
  } as Record<string, Rule[]>

  // 事件
  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }

  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      addOrEdit.value = 'edit'
      confirmLoading.value = true
      getCodeCardListById(id).then(({ data }) => {
        form.value = data
        confirmLoading.value = false
      })
    } else {
      addOrEdit.value = 'add'
      confirmLoading.value = false
    }
  }

  /**
   * 保存
   */
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      form.value.appId = props.appId
      if (formEditType.value === FormEditType.Add) {
        await saveCodeCardConfig(unref(form)).finally(() => (confirmLoading.value = false))
      } else if (formEditType.value === FormEditType.Edit) {
        await editCodeCardConfig(unref(form)).finally(() => (confirmLoading.value = false))
      }
      handleCancel()
      emits('ok')
    })
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
