<template>
  <basic-drawer
    forceRender
    :showFooter="!showable"
    v-bind="$attrs"
    title="支付宝分账接收方"
    :width="750"
    :open="visible"
    @close="handleCancel"
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
          <a-input v-model:value="form.id" />
        </a-form-item>
        <a-form-item label="接收方名称" name="receiverName">
          <a-input
            v-model:value="form.receiverName"
            :disabled="showable"
            placeholder="请输入接收方名称"
          />
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
        <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk"
          >保存</a-button
        >
      </a-space>
    </template>
  </basic-drawer>
</template>

<script setup lang="ts">
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { useMessage } from '@/hooks/web/useMessage'
  import { computed, nextTick, ref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { saveOrUpdate, get, AlipayAllocReceiver } from './AlipayAllocReceiver.api'
  import BasicDrawer from '@/components/Drawer/src/BasicDrawer.vue'
  import { AllocReceiver } from '@/views/daxpay/common/allocation/receiver/AllocationReceiver.api'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { useDict } from '@/hooks/bootx/useDict'
  import { AllocRelationTypeEnum } from '@/enums/daxpay/daxpayEnum'

  const { appId } = defineProps<{ appId: string }>()

  const {
    initFormEditType,
    handleCancel,
    diffForm,
    showable,
    labelCol,
    wrapperCol,
    confirmLoading,
    visible,
  } = useFormEdit()
  const { createMessage } = useMessage()
  const { dictDropDown } = useDict()

  const formRef = ref<FormInstance>()
  const isv = ref<boolean>(false)
  const isvOptions = ref<LabeledValue[]>([])
  const relationTypeList = ref<LabeledValue[]>([])
  const receiverTypeList = ref<LabeledValue[]>([])

  const form = ref<AlipayAllocReceiver>({})
  let rawForm: any = {}
  // 校验
  const rules = computed(() => {
    return {
      receiverName: [{ required: true, message: '接收方名称不能为空' }],
      receiverType: [{ required: true, message: '接收方类型不能为空' }],
      receiverAccount: [{ required: true, message: '接收方账号不能为空' }],
      relationType: [{ required: true, message: '分账关系类型不能为空' }],
      relationName: [
        {
          required: form.value.relationType === AllocRelationTypeEnum.CUSTOM,
          message: '分账关系名称不能为空',
        },
      ],
    } as Record<string, Rule[]>
  })
  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 入口
   */
  function init(id: AllocReceiver, editType: FormEditType, isIsv: boolean) {
    isv.value = isIsv
    initFormEditType(editType)
    initData()
    resetForm()
    visible.value = true
    getInfo(id)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    dropdownByEnable().then(({ data }) => {
      isvOptions.value = data
    })
    relationTypeList.value = await dictDropDown('alloc_relation_type')
    receiverTypeList.value = await dictDropDown('alloc_receiver_type')
  }
  /**
   * 获取信息
   */
  function getInfo(id) {
    if (id) {
      get(id).then(({ data }) => {
        confirmLoading.value = true
        rawForm = { ...data }
        form.value = data
        confirmLoading.value = false
      })
    }
  }
  /**
   * 更新
   */
  function handleOk() {
    formRef.value?.validate().then(() => {
      confirmLoading.value = true
      saveOrUpdate({
        ...form.value,
        ...diffForm(rawForm, form.value),
        appId,
        isv: isv.value,
      })
        .then(() => {
          createMessage.success('保存成功')
          handleCancel()
          emits('ok')
        })
        .finally(() => {
          confirmLoading.value = false
        })
    })
  }

  /**
   * 重置表单
   */
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
