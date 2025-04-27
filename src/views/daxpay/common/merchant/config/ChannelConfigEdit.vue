<template>
  <alipay-config-edit ref="alipay" @ok="ok" />
  <wechat-pay-config-edit ref="wechat" @ok="ok" />
  <union-pay-config-edit ref="union" @ok="ok" />
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { ChannelEnum, MerchantTypeEnum } from '@/enums/daxpay/daxpayEnum'
  import { ChannelConfig } from './ChannelConfig.api'
  import AlipayConfigEdit from '@/views/daxpay/common/channel/alipay/config/payment/AlipayConfigEdit.vue'
  import WechatPayConfigEdit from '@/views/daxpay/common/channel/wechat/config/payment/WechatPayConfigEdit.vue'
  import UnionPayConfigEdit from '@/views/daxpay/common/channel/union/config/UnionPayConfigEdit.vue'
  import { MchApp } from '@/views/daxpay/admin/merchant/app/MchAppAdmin.api'

  const props = withDefaults(
    defineProps<{
      app: MchApp
    }>(),
    {},
  )

  const { createMessage } = useMessage()

  const alipay = ref<any>()
  const alipaySub = ref<any>()
  const wechat = ref<any>()
  const wechatSub = ref<any>()
  const union = ref<any>()
  const leshua = ref<any>()
  const leshuaSub = ref<any>()
  const vbill = ref<any>()
  const vbillSub = ref<any>()
  const adapay = ref<any>()

  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 打开
   */
  function show(record: ChannelConfig) {
      showCommon(record)
  }

  /**
   * 普通商户
   */
  function showCommon(record: ChannelConfig) {
    switch (record.channel) {
      case ChannelEnum.ALI: {
        alipay.value.init(record, false)
        break
      }
      case ChannelEnum.WECHAT: {
        wechat.value.init(record, false)
        break
      }
      case ChannelEnum.UNION_PAY: {
        union.value.init(record)
        break
      }
      case ChannelEnum.ALI_ISV: {
        alipay.value.init(record, true)
        break
      }
      case ChannelEnum.WECHAT_ISV: {
        wechat.value.init(record, true)
        break
      }
      default: {
        createMessage.info('付费扩展, 请期待...')
      }
    }
  }

  /**
   * 操作完成回调
   */
  function ok() {
    emits('ok')
  }

  defineExpose({ show })
</script>

<style scoped lang="less"></style>
