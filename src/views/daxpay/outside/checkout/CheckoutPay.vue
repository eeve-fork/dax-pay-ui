<template>
<div>
  <div class="page paydemo">
    <div class="blog-container" id="container">
      <a-spin :spinning="loading">
        <div class="content" style="padding-top: 70px">
          <div style="width: 100%">
            <div class="paydemo-type-content" style="display: flex;height: 300px">
              <div style="width: 50%;">
                <div class="paydemo-type-name">支付信息</div>
                <a-form>
                  <div class="paydemo-form-item">
                    <label>标题：</label>
                    <span>
                      {{ orderAndConfig.order.title }}
                    </span>
                  </div>
                  <div class="paydemo-form-item">
                    <label>商户订单号：</label>
                    <span>
                      {{ orderAndConfig.order.bizOrderNo }}
                    </span>
                  </div>
                  <div class="paydemo-form-item">
                    <label>订单号：</label>
                    <span>
                      {{ orderAndConfig.order.orderNo }}
                    </span>
                  </div>
                  <div class="paydemo-form-item">
                    <label>描述：</label>
                    <span>
                      {{ orderAndConfig.order.description }}
                    </span>
                  </div>


                </a-form>
              </div>
              <div style="width: 50%;display: flex;flex-direction:column;align-items: center" v-if="aggregateUrl">
                <a-alert message="请使用支付宝、微信等应用扫码支付" type="info" style="width: 250px;margin-bottom: 10px"/>
                <a-qrcode :value="aggregateUrl" :size="200" />
              </div>
            </div>
            <div class="paydemo-type-content" style="height: 350px">
              <a-tabs v-model:activeKey="activeKey" type="card">
                <a-tab-pane v-for="group in orderAndConfig.groupConfigs" :key="group.id" :tab="group.name">
                  <div class="paydemo-type-body">
                    <div @click="()=>currentItem=config" v-for="config in group.items" :key="config.id">
                      <div :class="config.id === currentItem.id ? 'colorChange' : 'paydemoType'">
                        <span class="color-change">{{ config.name }}</span>
                      </div>
                    </div>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
            <div style="margin-top: 20px; text-align: right">
                <span style="color: #fd482c; font-size: 18px; padding-right: 10px">{{ '¥ ' +  orderAndConfig.order.amount }} 元</span>
                <a-button type="primary" :disabled="!currentItem" @click="pay">立即支付</a-button>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
  </div>

</div>
</template>

<script setup lang="ts">


import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {
  CheckoutItemConfigResult,
  CheckoutOrderAndConfigResult, checkoutPay, CheckoutPayParam, getCheckoutUrl,
  getOrderAndConfig
} from "./CheckoutPay.api";
import {CheckoutCallTypeEnum, CheckoutTypeEnum,} from "@/enums/daxpay/channelEnum";
import {useMessage} from "@/hooks/web/useMessage";

const route = useRoute()

const { orderNo } = route.params

const activeKey = ref<string>()

const { createMessage } = useMessage()

let payForm = ref<string>()
const aggregateUrl = ref('1')

// 当前选择支付渠道和方式
let currentItem = ref<CheckoutItemConfigResult>({})


const loading = ref(false)
const orderAndConfig = ref<CheckoutOrderAndConfigResult>({
  order: {},
  config: {},
  groupConfigs: [],
})

/**
 * 初始化
 */
onMounted(() => {
  initData()
})

/**
 * 初始化数据
 */
async function initData() {
  // 获取收银台配置
  await getOrderAndConfig(orderNo, CheckoutTypeEnum.PC).then(({ data }) => {
    orderAndConfig.value = data
    activeKey.value = orderAndConfig.value.groupConfigs?.[0].id
    currentItem.value = orderAndConfig.value.groupConfigs?.[0].items?.[0] as CheckoutItemConfigResult
  })
  // 是否同时显示聚合支付码
  if (orderAndConfig.value.config.aggregateShow){
    getCheckoutUrl(orderNo, CheckoutTypeEnum.AGGREGATE).then(({data})=>{
      aggregateUrl.value = data
    })
  }
}

/**
 * 发起支付
 */
function pay() {
  // 条码支付
  if (CheckoutCallTypeEnum.BAR_CODE === currentItem.value.callType){

  }

  // 支付调起类型
  switch (currentItem.value.callType){
    case CheckoutCallTypeEnum.LINK:{
      break;
    }
    case CheckoutCallTypeEnum.FROM:{
      break;

    }
    case CheckoutCallTypeEnum.QR_CODE:{
      break;
    }
    case CheckoutCallTypeEnum.BAR_CODE:{
      break;
    }
    default:{
      createMessage.warning('暂不支持该支付方式')
    }
  }

  loading.value = true
  const from = {
    orderNo,
    itemId: currentItem.value.id,
  } as CheckoutPayParam
  checkoutPay(from).then(({ data }) => {
    loading.value = false
    // 跳转到支付页面
    location.replace(data.payBody as string)
  })
}

</script>


<style scoped lang="less">
@import 'style.less';
</style>
