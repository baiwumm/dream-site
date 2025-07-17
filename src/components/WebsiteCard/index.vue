<template>
  <div
    v-umami="{ name: websiteInfo.name, url: websiteInfo.url }"
    class="relative h-full cursor-pointer card-base animated-border animate-fade after:border-green-500/50 dark:after:border-green-400/50 shadow-md dark:shadow-[0_4px_6px_-1px_rgb(255,255,255,0.1)]"
    shadow="hover"
    @click="handleClick"
    @mouseenter="$event.target?.classList.add('hovered')"
  >
    <div class="flex flex-col gap-3">
      <div class="flex gap-2 items-center">
        <SiteImage :url="websiteInfo.logo" :color="websiteInfo.color" />
        <div class="flex flex-col gap-0.5">
          <div class="flex gap-1 items-center">
            <div class="text-lg font-semibold">{{ websiteInfo.name }}</div>
            <template v-if="websiteInfo.vpn">
              <el-tooltip effect="dark" content="访问需要开启 VPN 服务" placement="bottom">
                <Icon name="ri:error-warning-line" class="text-slate-400" />
              </el-tooltip>
            </template>
          </div>
          <div class="flex gap-1 items-center text-xs text-slate-400 font-thin">
            <template v-for="(tag, index) in websiteInfo.tags" :key="index">
              <el-tag effect="light" type="success" size="small" round>{{ tag }}</el-tag>
            </template>
          </div>
        </div>
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-6">
        {{ websiteInfo.desc }}
      </div>
    </div>
    <div class="flex gap-1 absolute top-2 right-2">
      <!-- 置顶标签 -->
      <template v-if="websiteInfo.pinned">
        <el-tag type="success" effect="dark" size="small"> 置顶 </el-tag>
      </template>
      <!-- 是否推荐 -->
      <template v-if="websiteInfo.recommend">
        <el-tag type="info" effect="dark" size="small"> 推荐 </el-tag>
      </template>
    </div>
  </div>
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
<style lang="scss" scoped></style>
