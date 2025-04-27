<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    title="分账接收方绑定"
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
        <a-form-item label="通道类型" name="isv">
          <a-radio-group v-model:value="form.isv" :disabled="!addable" button-style="solid">
            <a-radio-button :value="false">直联</a-radio-button>
            <a-radio-button :value="true">服务商</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="应用号" name="appId">
          <a-select
            v-if="addable"
            :filter-option="search"
            :options="mchAppOptions"
            v-model:value="form.appId"
            placeholder="请选择商户应用"
          />
          <a-tag v-else color="orange">{{ form.appName }}</a-tag>
        </a-form-item>
        <a-form-item label="接收方类型" name="receiverType">
          <a-select
            style="width: 100%"
            v-model:value="form.receiverType"
            :disabled="showable"
            :options="receiverTypeList"
            placeholder="请选择接收方类型"
          />
        </a-form-item>
        <a-form-item label="接收方账号" name="receiverAccount">
          <a-input
            v-model:value="form.receiverAccount"
            :disabled="showable"
            placeholder="请输入接收方账号"
          />
        </a-form-item>
        <a-form-item label="接收方名称" name="receiverName">
          <a-input
            v-model:value="form.receiverName"
            :disabled="showable"
            placeholder="请输入接收方名称"
          />
        </a-form-item>
        <a-form-item label="分账关系类型" name="relationType">
          <a-select
            style="width: 100%"
            v-model:value="form.relationType"
            :disabled="showable"
            :options="relationTypeList"
            placeholder="请选择分账关系类型"
          />
        </a-form-item>
        <a-form-item
          v-if="form.relationType === AllocRelationTypeEnum.CUSTOM"
          label="分账关系名称"
          name="relationName"
        >
          <a-input
            v-model:value="form.relationName"
            :disabled="showable"
            placeholder="请输入接收者关系名称"
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
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { computed, nextTick, ref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { get, add, update, AlipayReceiverBind } from './AlipayReceiverBind.api'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicModal } from '@/components/Modal'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { mchAppDropdownByEnable } from '@/views/daxpay/admin/merchant/app/MchAppAdmin.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import { AllocReceiverTypeEnum, AllocRelationTypeEnum } from '@/enums/daxpay/daxpayEnum'
  import { useDict } from '@/hooks/bootx/useDict'

  const { dictDropDown } = useDict()
  const {
    initFormEditType,
    handleCancel,
    labelCol,
    wrapperCol,
    modalWidth,
    confirmLoading,
    formEditType,
    visible,
    search,
    showable,
    addable,
  } = useFormEdit()

  const { createMessage } = useMessage()

  const fileList = ref<any>([])
  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<AlipayReceiverBind>({
    isv: false,
  })
  const mchAppOptions = ref<LabeledValue[]>([])
  const relationTypeList = ref<LabeledValue[]>([])
  const receiverTypeList = ref<LabeledValue[]>([
    { value: 'user_id', label: '用户ID' },
    { value: 'open_id', label: 'OpenId' },
    { value: 'login_name', label: '登录账号' },
  ])
  // 校验
  const rules = computed(() => {
    return {
      isv: [{ required: true, message: '支付宝通道类型不可为空' }],
      appId: [{ required: true, message: '应用号不可为空' }],
      receiverType: [{ required: true, message: '接收方类型不能为空' }],
      receiverAccount: [{ required: true, message: '接收方账号不能为空' }],
      receiverName: [
        {
          required: form.value.receiverType === AllocReceiverTypeEnum.LOGIN_NAME,
          message: '接收方名称不能为空',
        },
      ],
      relationType: [{ required: true, message: '分账关系类型不能为空' }],
      relationName: [
        {
          required: form.value.relationType === AllocRelationTypeEnum.CUSTOM,
          message: '分账关系名称不能为空',
        },
      ],
    } as Record<string, Rule[]>
  })

  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    initData()
    getInfo(id, editType)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    mchAppDropdownByEnable().then(({ data }) => {
      mchAppOptions.value = data
    })
    relationTypeList.value = await dictDropDown('alloc_relation_type')
  }

  /**
   * 获取信息
   */
  async function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Show, FormEditType.Edit].includes(editType)) {
      confirmLoading.value = true
      await get(id).then(({ data }) => (form.value = data))
    }
    confirmLoading.value = false
  }

  /**
   * 保存
   */
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      try {
        if (formEditType.value === FormEditType.Add) {
          await add(form.value)
        } else if (formEditType.value === FormEditType.Edit) {
          await update(form.value)
        }
        emits('ok')
        createMessage.success('保存成功')
        handleCancel()
      } catch (error) {
        confirmLoading.value = false
      }
    })
  }

  /**
   * 重置表单
   */
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
      fileList.value = []
    })
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
