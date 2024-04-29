<script setup lang="ts">
defineProps<{
  icon: string // 图标
  url: string // 跳转地址
  tip: string // tip 文案
}>()
</script>

<template>
  <UTooltip :text="tip">
    <UButton
      :to="url"
      target="_blank"
      color="gray"
      variant="ghost"
    >
      <Icon
        :name="icon"
        class="h-5 w-5"
      />
    </UButton>
  </UTooltip>
</template>
