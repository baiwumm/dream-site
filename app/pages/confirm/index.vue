<script setup lang="ts">
const user = useSupabaseUser()

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo('/')
    }
  },
  { immediate: true }
)

definePageMeta({
  title: '登录确认'
})
</script>

<template>
  <div>
    <p class="u-text-black">正在登录...</p>
  </div>
</template>
