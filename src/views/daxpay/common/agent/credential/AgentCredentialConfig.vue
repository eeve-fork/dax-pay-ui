<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    :width="840"
    title="代理商接口对接配置"
    :mask-closable="showable"
    :open="visible"
    @close="handleCancel"
    :loading="confirmLoading"
    @cancel="handleCancel"
  >
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
        <a-form-item label="代理商号" name="agentNo" required>
          <a-input v-model:value="form.agentNo" :disabled="true" />
        </a-form-item>
        <a-form-item
          label="平台公钥"
          required
          tooltip="客户可以使用平台公钥对接口返回参数、回调数据等数据进行验签，格式为RSA-SHA256"
        >
          <a-textarea
            v-model:value="form.platformPublicKey"
            placeholder="平台公钥不存在，请联系管理员处理"
            :rows="8"
            readonly
            disabled
          />
          <a-button type="link" @click="copyText(form.platformPublicKey as string)">复制</a-button>
        </a-form-item>
        <a-form-item
          label="代理商公钥"
          name="publicKey"
          tooltip="用户持有私钥，对数据进行签名，公钥配置给系统用于验签使用"
        >
          <a-textarea
            v-model:value="form.publicKey"
            :disabled="showable"
            placeholder="请输入代理商公钥（RSA-SHA256）"
            :rows="8"
          />
        </a-form-item>
        <a-form-item label="通信密钥" name="secretKey">
          <a-input
            v-model:value="form.secretKey"
            :disabled="showable"
            placeholder="请输入通信密钥"
          />
          <a-button v-if="!showable" type="link" @click="genSecretKey">生成密钥</a-button>
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
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { reactive, ref, nextTick } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import {
    AgentCredentialConfig,
    get,
    getAgent,
    update,
    updateAgent,
  } from './AgentCredentialConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { buildUUID } from '@/utils/uuid'
  import BasicDrawer from '@/components/Drawer/src/BasicDrawer.vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { isAgent } from '@/utils/env'
  import { copyText } from '@/utils/copyTextToClipboard'

  const { handleCancel, diffForm, labelCol, wrapperCol, confirmLoading, visible, showable } =
    useFormEdit()
  const { createConfirm, createMessage } = useMessage()

  // 事件
  const emits = defineEmits(['ok'])

  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<AgentCredentialConfig>({})
  const rawForm = ref<AgentCredentialConfig>({})

  // 校验
  const rules = reactive({
    agentNo: [{ required: true, message: '' }],
    publicKey: [{ required: true, message: '请输入代理商公钥' }],
    secretKey: [{ required: true, message: '请输入通信密钥' }],
  } as Record<string, Rule[]>)
  /**
   * 入口
   */
  function init(agentNo) {
    visible.value = true
    resetForm()
    getInfo(agentNo)
  }

  /**
   * 重置表单
   */
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }

  /**
   * 获取信息
   */
  function getInfo(agentNo) {
    confirmLoading.value = true
    if (isAgent()) {
      getAgent().then(({ data }) => {
        form.value = data
        Object.assign(rawForm.value, data)
        confirmLoading.value = false
      })
    } else {
      get(agentNo).then(({ data }) => {
        form.value = data
        Object.assign(rawForm.value, data)
        confirmLoading.value = false
      })
    }
  }

  // 保存
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      try {
        const updateData = {
          ...form.value,
          ...diffForm(rawForm.value, form.value, 'publicKey', 'secretKey'),
        }
        if (isAgent()) {
          await updateAgent(updateData)
        } else {
          await update(updateData)
        }
        createMessage.success('保存成功')
        handleCancel()
        emits('ok')
      } finally {
        confirmLoading.value = false
      }
    })
  }

  /**
   * 生成密钥
   */
  function genSecretKey() {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '请确认是否生成通信密钥？',
      onOk: () => {
        form.value.secretKey = buildUUID() + buildUUID()
      },
    })
  }

  // 对外暴露方法
  defineExpose({
    init,
  })
</script>

<style scoped lang="less">
  .small-from-item {
    :deep(.ant-form-item) {
      margin-bottom: 16px;
    }
  }
</style>
