<script setup lang="ts">
const nuxtApp = useNuxtApp()

// 是否首次加载
const isFullLoading = ref(true)

nuxtApp.hook('page:start', () => {
  isFullLoading.value = true
})

nuxtApp.hook('page:finish', () => {
  isFullLoading.value = false
})
</script>

<template>
  <div>
    <!-- 首页加载全屏动画 -->
    <FullLoading v-if="isFullLoading" />
    <NuxtLayout>
      <!-- 在页面导航之间显示一个进度条 -->
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.blur-enter-active,
.blur-leave-active {
  transition: all 0.4s;
}
.blur-enter-from,
.blur-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
