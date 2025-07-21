<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-06 18:00:33
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-21 14:36:43
 * @Description: 注销用户
-->
<template>
  <client-only>
    <UTooltip text="注销用户">
      <UButton
        v-if="user"
        icon="ri:logout-box-r-line"
        size="lg"
        color="neutral"
        variant="ghost"
        class="cursor-pointer"
        @click="logout"
        :loading="loading"
      />
    </UTooltip>
  </client-only>
</template>
<script setup lang="ts">
const client = useSupabaseClient();
const user = useSupabaseUser();

const loading = ref(false);

// 注销用户
const logout = async () => {
  loading.value = true;
  await client.auth.signOut().then(() => {
    loading.value = false;
    navigateTo("/");
  });
};
</script>
