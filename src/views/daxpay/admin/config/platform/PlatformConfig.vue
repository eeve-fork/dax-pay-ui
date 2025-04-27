<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <div class="flex justify-center" style="flex-wrap: wrap">
        <a-spin :spinning="confirmLoading">
          <a-form
            class="small-from-item w-40vw"
            ref="formRef"
            :model="form"
            :rules="rules"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 18 }"
            :validate-trigger="['blur', 'change']"
          >
            <a-form-item name="gatewayServiceUrl">
              <template #label>
                <basic-title
                  helpMessage="所部署的支付网关的访问地址，主要用于用于生成接收各种回调请求地址"
                >
                  网关后台地址
                </basic-title>
              </template>
              <a-input
                :disabled="!edit"
                v-model:value="form.gatewayServiceUrl"
                placeholder="请输入网关服务地址"
              />
            </a-form-item>
            <a-form-item name="gatewayMobileUrl">
              <template #label>
                <basic-title
                  helpMessage="支付网关配套的前端项目，在生成收银台、聚合支付、用户认证信息获取等功能时会用到"
                >
                  网关前端地址
                </basic-title>
              </template>
              <a-input
                :disabled="!edit"
                v-model:value="form.gatewayMobileUrl"
                placeholder="请输入网关前端端地址"
              />
            </a-form-item>
            <a-form-item name="limitAmount">
              <template #label>
                <basic-title
                  helpMessage="每次发起支付的金额不能超过该值，如果同时配置了其他支付限额，则以额度低的为准"
                >
                  全局支付限额(元)
                </basic-title>
              </template>
              <a-input-number
                :precision="2"
                :min="0.01"
                :max="999999.99"
                :disabled="!edit"
                v-model:value="form.limitAmount"
                placeholder="请输入全局支付限额(元)"
              />
            </a-form-item>
          </a-form>
          <div class="flex justify-center">
            <a-button v-if="edit" @click="initData">取消</a-button>
            <a-button v-if="edit" style="margin-left: 50px" type="primary" @click="updateConfig"
              >更新</a-button
            >
            <a-button v-if="!edit" @click="edit = true">编辑信息</a-button>
          </div>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { onMounted, ref } from 'vue'
  import { get, PlatformConfig, update } from './PlatformConfig.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import BasicTitle from '@/components/Basic/src/BasicTitle.vue'

  const { createMessage } = useMessage()
  const confirmLoading = ref(false)
  const formRef = ref<FormInstance>()
  const form = ref<PlatformConfig>({})
  const edit = ref<boolean>(false)
  const rules = {} as Record<string, Rule[]>

  onMounted(() => {
    initData()
  })

  /**
   * 获取配置
   */
  function initData() {
    confirmLoading.value = true
    edit.value = false
    get().then(({ data }) => {
      form.value = data
      confirmLoading.value = false
    })
  }

  /**
   * 更新
   */
  function updateConfig() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      update(form.value)
        .then(() => {
          createMessage.success('更新成功')
          initData()
        })
        .finally(() => (confirmLoading.value = false))
    })
  }
</script>

<style scoped lang="less"></style>
