<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-04-10 16:25:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-22 16:58:08
 * @Description: 顶部布局
-->
<template>
  <header
    class="flex gap-4 justify-between items-center sticky top-0 h-14 shadow-md dark:shadow-white-500/50 backdrop-blur transition-all w-full dark:shadow-[0_4px_6px_-1px_rgb(255,255,255,0.1)] z-50 px-6"
  >
    <!-- logo -->
    <NuxtLink to="/">
      <div class="flex gap-4 items-center">
        <!-- logo -->
        <NuxtImg src="/logo.svg" alt="logo" class="w-8 h-8" />
        <SplitText
          :text="$config.public.siteTitle"
          class-name="text-lg font-semibold md:text-2xl"
          :delay="100"
          :duration="0.6"
          ease="power3.out"
          split-type="chars"
          :from="{ opacity: 0, y: 40 }"
          :to="{ opacity: 1, y: 0 }"
          :threshold="0.1"
          root-margin="-100px"
          text-align="center"
        />
      </div>
    </NuxtLink>
    <!-- 右侧 社交图标 -->
    <div class="flex items-center">
      <!-- 夜间模式 -->
      <ColorMode />
      <!-- github -->
      <SocialIcon url="https://github.com/baiwumm/dream-site" tip="Github" icon="i-simple-icons-github" />
      <!-- 登录用户头像 -->
      <user-avatar />
      <!-- 跳转管理界面 -->
      <JumpAdmin />
      <!-- 注销用户按钮 -->
      <Logout />
    </div>
  </header>
</template>
<script setup lang="ts">
const colorMode = useColorMode();

// 判断是否暗色模式
const isDark = colorMode.preference === "dark";
</script>
