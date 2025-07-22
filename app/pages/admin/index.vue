<template>
  <UCard variant="subtle">
    <UTabs :items="items" class="w-full" color="neutral" :unmount-on-hide="false">
      <template #categorys>
        <Categorys />
      </template>
      <template #websites>
        <Websites />
      </template>
    </UTabs>
  </UCard>
</template>

<script lang="ts" setup>
import type { TabsItem } from "@nuxt/ui";
import Categorys from "./_components/categorys/index.vue";
import Websites from "./_components/websites/index.vue";

const items = ref<TabsItem[]>([
  {
    label: "网站分类",
    icon: "ri:menu-5-line",
    slot: "categorys" as const,
  },
  {
    label: "分类站点",
    icon: "ri:planet-line",
    slot: "websites" as const,
  },
]);

definePageMeta({
  title: "后台管理",
});
</script>
