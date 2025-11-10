<template>
  <basic-modal
    title="代理商码牌分拨"
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
        <a-form-item label="代理商" name="agentNo">
          <a-select
            style="width: 100%"
            v-model:value="form.agentNo"
            :options="agentOptions"
            allow-clear
            placeholder="请选择要划拨的代理商"
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
          >划拨</a-button
        >
      </a-space>
    </template>
  </basic-modal>
</template>
<script setup lang="ts">
  import BasicModal from '@/components/Modal/src/BasicModal.vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { computed, nextTick, ref } from 'vue'
  import { Rule } from 'ant-design-vue/lib/form'
  import { dropdown as agentDropdown } from '@/views/daxpay/common/assist/basic/AgentQuery.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useMessage } from '@/hooks/web/useMessage'
  import { assignAgent } from '@/views/daxpay/common/device/qrcode/CashierCode.api'
  import type { FormInstance } from 'ant-design-vue'

  const { createConfirm, createMessage } = useMessage()
  const { handleCancel, confirmLoading, visible, showable, labelCol, wrapperCol } = useFormEdit()
  const form = ref({
    agentNo: undefined,
    ids: [] as string[],
  })
  const formRef = ref<FormInstance>()
  const agentOptions = ref<LabeledValue[]>([])
  const emits = defineEmits(['ok'])

  // 校验
  const rules = computed(() => {
    return {
      agentNo: [{ required: true, message: '请选择要划拨的代理商' }],
    } as Record<string, Rule[]>
  })

  /**
   * 初始化
   */
  function init(ids: string[]) {
    initData()
    visible.value = true
    nextTick(() => formRef.value?.resetFields())
    form.value.ids = ids
  }

  function initData() {
    // 初始化所属代理商列表
    agentDropdown().then(({ data }) => (agentOptions.value = data))
  }

  /**
   * 保存
   */
  function handleOk() {
    formRef.value?.validate().then(() => {
      createConfirm({
        iconType: 'warning',
        title: '警告',
        content: '是否将选中的码牌划拨给该代理商',
        onOk: () => {
          return assignAgent(form.value).then(() => {
            createMessage.success('划拨成功')
            handleCancel()
            emits('ok')
          })
        },
      })
    })
  }

  defineExpose({
    init,
  })
</script>
<style scoped lang="less"></style>
