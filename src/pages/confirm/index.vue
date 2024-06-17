<script setup lang="ts">
const user = useSupabaseUser()

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo('https://dream-site.cn/')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <p class="u-text-black">正在登录...</p>
  </div>
</template>
