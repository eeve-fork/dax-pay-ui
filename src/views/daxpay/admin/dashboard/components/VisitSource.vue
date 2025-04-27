<template>
  <div class="md:flex">
    <Card title="支付通道" :loading="loading" class="md:w-1/3 mr-5">
      <div ref="payChannel" :style="{ width: '100%', height: '300px' }"></div>
    </Card>
    <Card title="支付方式" :loading="loading" class="md:w-1/3 mr-5">
      <div ref="payMethod" :style="{ width: '100%', height: '300px' }"></div>
    </Card>
    <Card title="退款通道" :loading="loading" class="md:w-1/3">
      <div ref="refundChannel" :style="{ width: '100%', height: '300px' }"></div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, Ref, ref } from 'vue'
  import { Card } from 'ant-design-vue'
  import { useECharts } from '@/hooks/web/useECharts'
  import { toDateString } from 'xe-utils'
  import {
    payChannelReport,
    payMethodReport,
    refundChannelReport,
    TradeReportResult
  } from '../IndexRepot.api'

  const payChannel = ref<HTMLDivElement | null>(null)
  const refundChannel = ref<HTMLDivElement | null>(null)
  const payMethod = ref<HTMLDivElement | null>(null)
  const loading = ref(false)

  const query = reactive({
    startDate: '',
    endDate: '',
  })

  const chartData = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: '1%',
      left: 'center',
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '12',
            fontWeight: 'bold',
          },
        },
        data: [],
        animationType: 'scale',
        animationEasing: 'exponentialInOut',
      },
    ],
  }

  const payChannelChart = useECharts(payChannel as Ref<HTMLDivElement>)
  const refundChannelChart = useECharts(refundChannel as Ref<HTMLDivElement>)
  const payMethodChart = useECharts(payMethod as Ref<HTMLDivElement>)

  onMounted(() => initData())

  /**
   * 初始化数据
   */
  function initData() {
    // 生成开始日期和结束日期
    query.startDate = toDateString(new Date(), 'yyyy-MM-dd')
    query.endDate = toDateString(new Date(), 'yyyy-MM-dd')
    payChannelReport(query).then(({ data }) => {
      const options = JSON.parse(JSON.stringify(chartData))
      options.series[0].name = '支付通道'
      options.series[0].data = data.map((item: TradeReportResult) => {
        return {
          name: item.title,
          value: item.tradeAmount,
        }
      })
      payChannelChart.setOptions(options as any)
    })
    refundChannelReport(query).then(({ data }) => {
      const options = JSON.parse(JSON.stringify(chartData))
      options.series[0].name = '退款通道'
      options.series[0].data = data.map((item: TradeReportResult) => {
        return {
          name: item.title,
          value: item.tradeAmount,
        }
      })
      refundChannelChart.setOptions(options as any)
    })
    payMethodReport(query).then(({ data }) => {
      const options = JSON.parse(JSON.stringify(chartData))
      options.series[0].name = '支付方式'
      options.series[0].data = data.map((item: TradeReportResult) => {
        return {
          name: item.title,
          value: item.tradeAmount,
        }
      })
      payMethodChart.setOptions(options as any)
    })
  }
</script>
