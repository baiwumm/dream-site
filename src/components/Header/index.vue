<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-04-10 16:25:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-06-07 08:53:30
 * @Description: 顶部布局
-->
<template>
  <el-header
    class="flex gap-4 justify-between items-center sticky top-0 h-14 shadow-md dark:shadow-white-500/50 backdrop-blur transition-all w-full dark:shadow-[0_4px_6px_-1px_rgb(255,255,255,0.1)]"
  >
    <!-- logo -->
    <a href="/" class="flex gap-4 items-center">
      <!-- logo -->
      <NuxtImg src="/logo.svg" alt="logo" class="w-8 h-8" />
      <ColorModeSvg light-fill="#000" dark-fill="#fff" name="dream-site" class-name="h-6" />
    </a>
    <!-- 右侧 社交图标 -->
    <div class="flex">
      <!-- 夜间模式 -->
      <ColorMode />
      <!-- github -->
      <SocialIcon
        url="https://github.com/baiwumm/dream-site"
        tip="Github"
        icon="i-simple-icons-github"
      />
      <!-- 登录用户头像 -->
      <user-avatar />
      <!-- 注销用户按钮 -->
      <Logout />
    </div>
  </el-header>
</template>
