<template>
  <div>
    <!-- 首页加载全屏动画 -->
    <FullLoading v-if="isFullLoading" />
    <UApp>
      <NuxtLayout>
        <!-- 在页面导航之间显示一个进度条 -->
        <NuxtLoadingIndicator />
        <NuxtPage />
      </NuxtLayout>
    </UApp>
    <!-- 鼠标特效 -->
    <SplashCursor
      :SIM_RESOLUTION="128"
      :DYE_RESOLUTION="1440"
      :CAPTURE_RESOLUTION="512"
      :DENSITY_DISSIPATION="3.5"
      :VELOCITY_DISSIPATION="2"
      :PRESSURE="0.1"
      :PRESSURE_ITERATIONS="20"
      :CURL="3"
      :SPLAT_RADIUS="0.2"
      :SPLAT_FORCE="6000"
      :SHADING="true"
      :COLOR_UPDATE_SPEED="10"
      :BACK_COLOR="{ r: 0.5, g: 0, b: 0 }"
      :TRANSPARENT="true"
    />
    <!-- 背景动画 -->
    <div class="fixed top-0 left-0 w-full h-full -z-[1]">
      <Squares
        direction="diagonal"
        :speed="0.2"
        :squareSize="40"
        :borderColor="$colorMode.value === 'dark' ? '#1F1F1F' : '#E8EAED'"
        hoverFillColor="#F3F4F6"
      />
    </div>
    <!-- 回到顶部按钮 -->
    <BackTop />
    <!-- Vercel 统计 -->
    <Analytics />
  </div>
</template>
<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";

const nuxtApp = useNuxtApp();
const colorMode = useColorMode();

// 是否首次加载
const isFullLoading = ref(true);

nuxtApp.hook("page:start", () => {
  isFullLoading.value = true;
});

nuxtApp.hook("page:finish", () => {
  isFullLoading.value = false;
});

useHead({
  link: [{ rel: "icon", type: "image/x-icon", href: "favicon.ico" }],
  meta: [
    { name: "keywords", content: "Nuxt.js,导航,网站,白雾茫茫丶,谜叶象限" },
    { name: "description", content: "一个简约、精美、现代化的个人站点导航！" },
  ],
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
