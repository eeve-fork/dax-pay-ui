<template>
  <basic-modal
    v-bind="$attrs"
    :width="modalWidth"
    title="添加分账接收方"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form
      class="small-from-item"
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="接收方通道" name="channel">
        <a-select
          style="width: 100%"
          v-model:value="form.channel"
          :options="channels"
          placeholder="请选择接收方通道"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" type="primary" @click="handleOk">下一步</a-button>
    </template>
  </basic-modal>
</template>
<script setup lang="ts">
  import { BasicModal } from '@/components/Modal'
  import { nextTick, reactive, ref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '@/hooks/bootx/useDict'

  const { handleCancel, labelCol, wrapperCol, modalWidth, visible, showable } = useFormEdit()

  const { dictDropDown } = useDict()
  const form = reactive<any>({})

  const rules = {
    channel: [{ required: true, message: '请选择进件通道' }],
  } as Record<string, Rule[]>

  const channels = ref<LabeledValue[]>([])

  const formRef = ref<FormInstance>()

  const emits = defineEmits(['next'])

  /**
   * 初始化数据
   */
  async function initData() {
    channels.value = await dictDropDown('channel')
  }

  /**
   * 入口
   */
  function init() {
    visible.value = true
    resetForm()
    initData()
  }

  /**
   * 提交保存并跳转到编辑页面
   */
  async function handleOk() {
    formRef.value?.validate().then(async () => {
      emits('next', form.channel)
      handleCancel()
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
  defineExpose({ init })
</script>
<style scoped lang="less"></style>
