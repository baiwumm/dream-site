<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-11 09:28:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-23 08:49:00
 * @Description: 跳转登录界面
-->
<template>
  <client-only>
    <template v-if="user">
      <UTooltip text="进入管理后台">
        <NuxtLink to="/admin">
          <UButton
            icon="ri:apps-fill"
            size="lg"
            color="neutral"
            variant="ghost"
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
