<template>
  <basic-drawer
    v-bind="$attrs"
    width="70%"
    title="分账组配置"
    :mask-closable="true"
    :open="visible"
    @close="visible = false"
  >
    <a-tabs v-model:activeKey="activeKey" type="card">
      <a-tab-pane :key="1" tab="分账配置">
      </a-tab-pane>
      <a-tab-pane :key="2" tab="分账接收方">
        <AllocationReceiverList ref="allocationReceiverList" :appId="appId"/>
      </a-tab-pane>
      <a-tab-pane :key="3" tab="分账组">
        <AllocationGroupList ref="allocationGroupList" :appId="appId" />
      </a-tab-pane>
    </a-tabs>
  </basic-drawer>
</template>

<script setup lang="ts">
  import AllocationReceiverList from '@/views/daxpay/common/allocation/receiver/AllocationReceiverList.vue'
  import AllocationGroupList from '@/views/daxpay/common/allocation/group/AllocationGroupList.vue'
  import { ref } from 'vue'
  import { BasicDrawer } from '@/components/Drawer'

  const allocationReceiverList = ref<any>()
  const allocationGroupList = ref<any>()

  const visible = ref(false)
  const activeKey = ref(2)
  const appId = ref('')

  /**
   * 入口
   * @param appid
   */
  function init(appid: string) {
    visible.value = true
    appId.value = appid
  }


  defineExpose({ init })
</script>

<style scoped lang="less"></style>
