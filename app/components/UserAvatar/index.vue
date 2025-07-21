<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-06 17:53:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-21 11:19:06
 * @Description: 当前登录用户头像
-->
<template>
  <client-only>
    <template v-if="user">
      <UButton
        :avatar="{
          src: user.user_metadata.avatar_url,
        }"
        color="neutral"
        variant="ghost"
        size="lg"
      />
    </template>
    <template v-else>
      <UTooltip text="登录">
        <NuxtLink to="/login">
          <UButton icon="ri:user-3-line" color="neutral" variant="ghost" size="lg" class="cursor-pointer" />
        </NuxtLink>
      </UTooltip>
    </template>
  </client-only>
</template>
<script setup lang="ts">
const user = useSupabaseUser();
</script>
