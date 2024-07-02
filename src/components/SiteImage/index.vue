<template>
  <NuxtImg v-if="isValidImageUrl(url)" :src="url" alt="logo" :width="size" :height="size" />
  <Icon v-else :name="url" :size="String(size)" :color="color" />
</template>

<script setup lang="ts">
type Props = {
  url: string // 图标
  size?: number // 图片大小，宽高同比
  color?: string // 颜色
}

// 父组件传递参数
withDefaults(defineProps<Props>(), {
  size: 40,
  color: ''
})

// 判断地址是否是合法的图片地址
const isValidImageUrl = (url: string) => {
  const urlPattern = /^(https?:\/\/)[\da-z.-]+\.([a-z.]{2,6})([/\w .-]*\.(jpg|jpeg|png|gif|svg))$/i
  return urlPattern.test(url)
}
</script>
