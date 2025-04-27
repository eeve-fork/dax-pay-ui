<template>
  <div class="p-4">
    <!--  支付/退款/商户/服务商信息 -->
    <GrowCard :loading="loading" class="enter-y" />
    <!--  支付通道 支付方式 退款通道 数量占比   -->
    <VisitSource class="md:flex enter-y mt-5" :loading="loading" />
    <!-- 支付/退款通道/支付方式 金额/最大金额/平均金额    -->
<!--    <SiteAnalysis class="!my-4 enter-y" :loading="loading" />-->
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import GrowCard from './components/GrowCard.vue'
  import VisitSource from './components/VisitSource.vue'

  const loading = ref(true)

  setTimeout(() => {
    loading.value = false
  }, 1500)
</script>
