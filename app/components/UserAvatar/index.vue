<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-06 17:53:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-24 09:15:43
 * @Description: 当前登录用户头像
-->
<template>
  <client-only>
    <template v-if="user">
      <UButton
        v-if="user.user_metadata.avatar_url"
        :avatar="{
          src: user.user_metadata.avatar_url,
        }"
        color="neutral"
        variant="ghost"
        size="lg"
        :ui="{
          leadingAvatarSize: 'xs',
        }"
      />
      <UButton
        v-else
        icon="ri:user-3-line"
        color="neutral"
        variant="ghost"
        size="lg"
        :ui="{
          leadingIcon: '!size-5',
        }"
      />
    </template>
    <template v-else>
      <UTooltip text="登录">
        <NuxtLink to="/login">
          <UButton
            icon="ri:user-3-line"
            color="neutral"
            variant="ghost"
            size="lg"
            class="cursor-pointer"
            :ui="{
              leadingIcon: '!size-5',
            }"
          />
        </NuxtLink>
      </UTooltip>
    </template>
  </client-only>
</template>
<script setup lang="ts">
const user = useSupabaseUser();
</script>
