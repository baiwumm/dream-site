<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-30 13:52:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-21 12:10:32
 * @Description: 底部布局
-->
<template>
  <footer class="p-4">
    <USeparator
      :avatar="{
        src: '/logo.svg',
      }"
    />
    <div class="flex justify-between items-center max-sm:flex-col">
      <div class="flex items-center max-sm:flex-col">
        <UButton
          v-for="({ icon, url, tip }, index) in FooterRecord"
          :key="index"
          :to="url"
          target="_blank"
          variant="link"
          size="sm"
          color="neutral"
        >
          <div class="flex items-center gap-2">
            <NuxtImg :src="`/${icon}`" :alt="tip" class="w-4" />
            {{ tip }}
          </div>
        </UButton>
      </div>
      <!-- 社交图标 -->
      <div class="max-sm:order-first">
        <!-- 社交图标 -->
        <SocialIcon
          v-for="({ icon, url, tip }, index) in FooterSocial"
          :key="index"
          :icon="icon"
          :url="url"
          :tip="tip"
        />
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
import { FooterSocial, FooterRecord } from "~/lib/constant";
</script>
