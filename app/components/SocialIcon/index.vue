<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-30 13:54:54
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-23 08:47:05
 * @Description: 社交图标
-->
<script setup lang="ts">
import type { Social } from "~/lib/type";

defineProps<Social>();
</script>

<template>
  <UTooltip :text="tip">
    <UButton
      :icon="icon"
      size="lg"
      color="neutral"
      variant="ghost"
      class="cursor-pointer"
      :to="url"
      target="_blank"
      :ui="{
        leadingIcon: '!size-5',
      }"
    />
  </UTooltip>
</template>
