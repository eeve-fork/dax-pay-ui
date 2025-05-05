<template>
  <basic-drawer
    destroyOnClose
    v-bind="$attrs"
    width="75%"
    title="收银台配置"
    :mask-closable="true"
    :open="visible"
    @close="handleCancel"
  >
    <a-tabs v-model:activeKey="activeKey" type="card">
      <a-tab-pane :key="1" tab="公共配置">
        <Gateway-config-edit :appId="currentAppId" />
      </a-tab-pane>
      <a-tab-pane :key="2" tab="PC收银配置">
        <Cashier-group-config-list :appId="currentAppId" type="pc" />
      </a-tab-pane>
      <a-tab-pane :key="3" tab="H5收银配置">
        <Cashier-group-config-list :appId="currentAppId" type="h5" />
      </a-tab-pane>
      <a-tab-pane :key="4" tab="聚合支付配置">
        <Aggregate-config-list :appId="currentAppId" />
      </a-tab-pane>
      <a-tab-pane :key="5" tab="付款码支付配置">
        <Aggregate-code-list :appId="currentAppId" />
      </a-tab-pane>
      <a-tab-pane :key="6" tab="收款码牌配置">
        <CodeCardConfigList :appId="currentAppId" />
      </a-tab-pane>
    </a-tabs>
  </basic-drawer>
</template>
<script setup lang="ts">
  import { BasicDrawer } from '@/components/Drawer'
  import { ref } from 'vue'
  import GatewayConfigEdit from './GatewayConfigEdit.vue'
  import CashierGroupConfigList from './cashier/CashierGroupConfigList.vue'
  import AggregateConfigList from './aggregate/AggregateConfigList.vue'
  import AggregateCodeList from './aggregate/AggregateCodeList.vue'
  import CodeCardConfigList from './codeCard/CodeCardConfigList.vue'

  const visible = ref(false)
  const activeKey = ref(1)
  const currentAppId = ref('')

  /**
   * 入口
   */
  function init(appId: string) {
    visible.value = true
    activeKey.value = 1
    currentAppId.value = appId
  }

  /**
   * 关闭页面
   */
  function handleCancel() {
    visible.value = false
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>
