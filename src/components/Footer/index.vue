<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-30 13:52:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-31 08:41:09
 * @Description: 底部布局
-->
<template>
  <el-footer>
    <el-divider style="margin: 12px 0">
      <NuxtImg
        src="/logo.svg"
        alt="logo"
        class="w-5"
      />
    </el-divider>
    <div class="flex justify-between items-center max-sm:flex-col">
      <div class="flex items-center gap-0.5 max-sm:flex-col">
        <el-button
          v-for="({ icon, url, tip }, index) in FooterRecord"
          :key="index"
          :href="url"
          target="_blank"
          link
          tag="a"
          size="small"
        >
          <div class="flex items-center gap-2">
            <NuxtImg
              :src="`/${icon}`"
              :alt="tip"
              class="w-4"
            />
            {{ tip }}
          </div>
        </el-button>
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
  </el-footer>
</template>
<script setup lang="ts">
import { FooterSocial, FooterRecord } from '@/const'
</script>
