<template>
  <el-card
    v-umami="{ name: websiteInfo.name, url: websiteInfo.url }"
    class="relative cursor-pointer"
    shadow="hover"
    @click="handleClick"
  >
    <div class="flex flex-col gap-3">
      <div class="flex gap-2 items-center">
        <SiteImage :url="websiteInfo.logo" :color="websiteInfo.color" />
        <div class="flex flex-col gap-0.5">
          <div class="flex gap-1 items-center">
            <div class="text-base">{{ websiteInfo.name }}</div>
            <template v-if="websiteInfo.vpn">
              <el-tooltip effect="dark" content="访问需要开启 VPN 服务" placement="bottom">
                <Icon name="ri:error-warning-line" class="text-slate-400" />
              </el-tooltip>
            </template>
          </div>
          <div class="flex gap-1 items-center text-xs text-slate-400 font-thin">
            <template v-for="(tag, index) in websiteInfo.tags" :key="index">
              <span class="line-clamp-1">
                {{ tag }}
              </span>
              <template v-if="index !== websiteInfo.tags.length - 1">
                <el-divider direction="vertical" />
              </template>
            </template>
          </div>
        </div>
      </div>
      <div class="text-sm text-slate-500 font-medium line-clamp-2">{{ websiteInfo.desc }}</div>
    </div>
    <div class="absolute top-1 right-1.5">
      <!-- 置顶标签 -->
      <template v-if="websiteInfo.pinned">
        <el-tag type="success" effect="light"> 置顶 </el-tag>
      </template>
      <!-- 是否推荐 -->
      <template v-if="websiteInfo.recommend">
        <el-tag type="info" effect="light"> 推荐 </el-tag>
      </template>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import type { WebsiteList } from '~/types'
// 父组件传递参数
const props = defineProps<{
  websiteInfo: WebsiteList
}>()

// 点击卡片回调
const handleClick = () => {
  window.open(props.websiteInfo.url)
}
</script>
<style lang="scss" scoped>
:deep(.el-avatar) {
  background-color: transparent;
}
:deep(.el-divider--vertical) {
  margin: 0 4px;
}
</style>
