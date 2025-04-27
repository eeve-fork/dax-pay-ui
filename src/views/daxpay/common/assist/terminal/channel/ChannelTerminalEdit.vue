<template>
  <channel-terminal-comm-edit ref="comm" @ok="ok" />
</template>

<script setup lang="ts">
  import { ChannelTerminal } from './ChannelTerminal.api'
  import ChannelTerminalCommEdit from './ChannelTerminalCommEdit.vue'
  import { ref } from 'vue'
  import { ChannelEnum } from '@/enums/daxpay/daxpayEnum'
  import { FormEditType } from '@/enums/formTypeEnum'
  // 事件
  const emits = defineEmits(['ok'])

  const adapay = ref<any>()
  const comm = ref<any>()
  /**
   * 入口
   */
  function init(record: ChannelTerminal, editType: FormEditType) {
    switch (record.channel) {
      case ChannelEnum.ADA_PAY: {
        adapay.value.init(record.id, editType)
        break
      }
      default: {
        comm.value.init(record.id, editType)
      }
    }
  }

  /**
   * 操作完成回调
   */
  function ok() {
    emits('ok')
  }

  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
