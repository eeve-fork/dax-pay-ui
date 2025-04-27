<template>
  <alipay-alloc-receiver-edit ref="alipay" @ok="ok" :appId="appId" />
  <wechat-alloc-receiver-edit ref="wechat" @ok="ok" :appId="appId" />
</template>
<script setup lang="ts">
  import { useMessage } from '@/hooks/web/useMessage'
  import { ref } from 'vue'
  import { ChannelEnum } from '@/enums/daxpay/daxpayEnum'
  import { FormEditType } from '@/enums/formTypeEnum'
  import AlipayAllocReceiverEdit from '@/views/daxpay/common/channel/alipay/receiver/AlipayAllocReceiverEdit.vue'
  import WechatAllocReceiverEdit from '@/views/daxpay/common/channel/wechat/receiver/WechatAllocReceiverEdit.vue'
  import { AllocReceiver } from '@/views/daxpay/common/allocation/receiver/AllocationReceiver.api'

  const { appId } = defineProps<{ appId: string }>()

  const { createMessage } = useMessage()
  const alipay = ref<any>()
  const wechat = ref<any>()
  const leshua = ref<any>()
  const vbill = ref<any>()
  const adapay = ref<any>()

  // 事件
  const emits = defineEmits(['ok'])

  /**
   * 编辑或查看
   */
  function init(record: AllocReceiver, editType: FormEditType) {
    show(record.id, editType, record.channel as ChannelEnum)
  }

  /**
   * 新建
   */
  function add(channel: ChannelEnum) {
    show(null, FormEditType.Add, channel)
  }

  /**
   * 显示编辑页面
   */
  function show(id, editType: FormEditType, channel: ChannelEnum) {
    switch (channel) {
      case ChannelEnum.ALI: {
        alipay.value.init(id, editType, false)
        break
      }
      case ChannelEnum.ALI_ISV: {
        alipay.value.init(id, editType, true)
        break
      }
      case ChannelEnum.WECHAT: {
        wechat.value.init(id, editType, false)
        break
      }
      case ChannelEnum.WECHAT_ISV: {
        wechat.value.init(id, editType, true)
        break
      }
      case ChannelEnum.LESHUA_PAY: {
        leshua.value.init(id, editType)
        break
      }
      case ChannelEnum.VBILL_PAY: {
        vbill.value.init(id, editType)
        break
      }
      case ChannelEnum.ADA_PAY: {
        adapay.value.init(id, editType)
        break
      }
      default: {
        createMessage.info('暂未支持, 请期待...')
      }
    }
  }

  /**
   * 操作完成回调
   */
  function ok() {
    emits('ok')
  }

  defineExpose({ add, init })
</script>

<style scoped lang="less"></style>
