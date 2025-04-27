<template>
  <div class="md:flex">
    <Card size="small" title="支付订单" :loading="loading" class="md:w-1/2 !md:mt-0 mr-5">
      <div class="py-1 px-4 flex justify-between items-center">
        <span class="text-16px">订单数量</span>
        <CountTo :startVal="0" :endVal="payData.tradeCount || 0" class="text-24px" />
      </div>
      <div class="py-1 px-4 flex justify-between items-center">
        <span class="text-16px">订单金额(元)</span>
        <a-statistic :value="payData.tradeAmount || 0" :precision="2" class="text-20px" />
      </div>
      <div class="py-1 px-4 flex justify-between items-center">
        <span class="text-16px">平均单笔金额(元)</span>
        <a-statistic :value="payData.avgAmount || 0" :precision="2" class="text-20px" />
      </div>
      <div class="py-1 px-4 flex justify-between items-center">
        <span class="text-16px">最大单笔金额(元)</span>
        <a-statistic :value="payData.maxAmount || 0" :precision="2" class="text-20px" />
      </div>
    </Card>
    <Card size="small" title="退款订单" :loading="loading" class="md:w-1/2 !md:mt-0 mr-5">
      <div class="py-1 px-4 flex justify-between items-center">
        <span class="text-16px">订单数量</span>
        <CountTo :startVal="0" :endVal="refundData.tradeCount || 0" class="text-24px" />
      </div>
      <div class="py-1 px-4 flex justify-between items-center">
        <span class="text-16px">订单金额(元)</span>
        <a-statistic :value="refundData.tradeAmount || 0" :precision="2" class="text-20px" />
      </div>
      <div class="py-1 px-4 flex justify-between items-center">
        <span class="text-16px">平均单笔金额(元)</span>
        <a-statistic :value="refundData.avgAmount || 0" :precision="2" class="text-20px" />
      </div>
      <div class="py-1 px-4 flex justify-between items-center">
        <span class="text-16px">最大单笔金额(元)</span>
        <a-statistic :value="refundData.maxAmount || 0" :precision="2" class="text-20px" />
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { CountTo } from '@/components/CountTo'
  import { Card } from 'ant-design-vue'
  import { onMounted, reactive, ref } from 'vue'
  import { toDateString } from 'xe-utils'
  import { payTradeReport, rfdTradeReport, TradeReportResult } from '../IndexRepot.api'

  const query = reactive({
    startDate: '',
    endDate: '',
  })

  const loading = ref(false)
  const payData = ref<TradeReportResult>({})
  const refundData = ref<TradeReportResult>({})

  onMounted(() => initData())

  /**
   * 初始化数据
   */
  function initData() {
    // 生成开始日期和结束日期
    query.startDate = toDateString(new Date(), 'yyyy-MM-dd')
    query.endDate = toDateString(new Date(), 'yyyy-MM-dd')
    // 支付订单
    payTradeReport(query).then(({ data }) => {
      payData.value = data
    })
    // 退款订单
    rfdTradeReport(query).then(({ data }) => {
      refundData.value = data
    })
  }
</script>
