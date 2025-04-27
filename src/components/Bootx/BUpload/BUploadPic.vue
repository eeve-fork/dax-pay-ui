<template>
  <a-upload
    v-if="!picUrl"
    accept="image/*"
    :disabled="showable"
    list-type="picture-card"
    name="file"
    :multiple="false"
    :action="uploadAction"
    :headers="tokenHeader"
    :showUploadList="false"
    @change="uploadChange"
  >
    <div>
      <plus-outlined />
      <div class="ant-upload-text">上传图片</div>
    </div>
  </a-upload>
  <div class="img-div" v-else>
    <a-image :preview="false" :height="100" :width="100" :src="getFileUrl(picUrl as string)" />
    <div
      class="ant-image-mask"
      v-if="!showable"
      @click="
        () => {
          picUrl = undefined
          picId = undefined
        }
      "
    >
      <div>删除</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PlusOutlined } from '@ant-design/icons-vue'
  import { useUpload } from '@/hooks/bootx/useUpload'
  import { useFilePlatform } from '@/hooks/bootx/useFilePlatform'
  import { useMessage } from '@/hooks/web/useMessage'

  const { createMessage } = useMessage()

  const { showable = false } = defineProps<{ showable: boolean }>()

  const picUrl = defineModel('picUrl')
  const picId = defineModel('picId')
  const emit = defineEmits(['uploadChange'])

  const { tokenHeader, uploadAction } = useUpload('/file/upload')
  const { getFileUrl } = useFilePlatform()

  /**
   * 文件上传
   */
  function uploadChange(info) {
    emit('uploadChange', info)
    // 上传完毕
    if (info.file.status === 'done') {
      const res = info.file.response
      if (!res.code) {
        picUrl.value = res.data.url
        createMessage.success(`${info.file.name} 上传成功!`)
      } else {
        createMessage.error(`${res.msg}`)
      }
    } else if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }
</script>

<style scoped lang="less">
  .img-size {
    width: 100px;
    height: 100px;
  }
  .img-div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 102px;
    height: 102px;
    margin-inline-end: 8px;
    margin-bottom: 8px;
    text-align: center;
    vertical-align: top;
    background-color: rgba(0, 0, 0, 0.02);
    border: 1px dashed rgba(217, 217, 217, 0);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.3s;
  }
  .ant-image-mask {
    width: 100px;
    height: 100px;
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s;
    &:hover {
      opacity: 1;
    }
  }
</style>
