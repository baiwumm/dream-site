<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-04-11 08:40:47
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-21 11:06:10
 * @Description: 主题模式切换
-->
<script setup lang="ts">
const colorMode = useColorMode();

// 切换模式
const setColorMode = () => {
  colorMode.value = colorMode.value === "dark" ? "light" : "dark";
};

// 判断是否支持 startViewTransition API
const enableTransitions = () =>
  "startViewTransition" in document && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

// 切换动画
async function toggleDark({ clientX: x, clientY: y }: MouseEvent) {
  const isDark = colorMode.value === "dark";

  if (!enableTransitions()) {
    setColorMode();
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`,
  ];

  await document.startViewTransition(async () => {
    setColorMode();
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: !isDark ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: `::view-transition-${!isDark ? "old" : "new"}(root)`,
    }
  );
}
</script>

<template>
  <UTooltip :text="`切换${$colorMode.value === 'dark' ? '白天' : '黑夜'}模式`">
    <UButton
      :icon="$colorMode.value === 'dark' ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'"
      size="lg"
      color="neutral"
      variant="ghost"
      @click="toggleDark"
      class="cursor-pointer"
    />
  </UTooltip>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}
</style>
