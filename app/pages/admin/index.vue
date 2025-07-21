<template>
  <UTabs :items="items" class="w-full" />
</template>

<script lang="ts" setup>
import type { TabsItem } from "@nuxt/ui";
import Categorys from "./_components/categorys/index.vue";
import Websites from "./_components/websites/index.vue";

const activeName = ref("categorys");

const items = ref<TabsItem[]>([
  {
    label: "网站分类",
    icon: "ri:menu-5-line",
    content: "This is the account content.",
  },
  {
    label: "分类站点",
    icon: "ri:planet-line",
    content: "This is the password content.",
  },
]);

definePageMeta({
  title: "后台管理",
});
</script>
