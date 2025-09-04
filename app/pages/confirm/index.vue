<script setup lang="ts">
const user = useSupabaseUser();

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/");
    }
  },
  { immediate: true }
);

definePageMeta({
  title: "登录确认",
});
</script>

<template>
  <div class="flex justify-center items-center flex-col min-h-[inherit]">
    <p class="text-2xl font-black">正在登录...</p>
  </div>
</template>
