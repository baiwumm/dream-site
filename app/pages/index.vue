<template>
  <div class="container mx-auto flex flex-col gap-6">
    <div v-for="item in categoryList?.data?.list || []" :key="item.id" v-loading="categoryStatus === 'pending'">
      <div class="flex items-center gap-2">
        <Icon :name="item.icon || 'ri:menu-5-line'" class="h-6 w-6" />
        <BlurText
          :text="item.name"
          :delay="200"
          class-name="text-xl font-semibold"
          animate-by="letters"
          direction="top"
          :threshold="0.1"
          root-margin="0px"
          :step-duration="0.35"
        />
      </div>
      <div
        v-if="item.ds_websites?.length"
        class="grid gap-5 w-full justify-center grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] mt-2"
      >
        <AnimatedContent
          :distance="20"
          direction="vertical"
          :reverse="false"
          :duration="1.2"
          ease="power3.out"
          :initial-opacity="0"
          :animate-opacity="true"
          :scale="0.9"
          :threshold="0.1"
          :delay="0"
          v-for="child in item.ds_websites || []"
          :key="child.id"
        >
          <div
            class="relative h-full cursor-pointer card-base animated-border animate-fade after:border-green-500/50 dark:after:border-green-400/50 shadow-md dark:shadow-[0_4px_6px_-1px_rgb(255,255,255,0.1)]"
            shadow="hover"
            @click="handleClick(child)"
            @mouseenter="($event.target as HTMLElement)?.classList?.add('hovered')"
          >
            <div class="flex flex-col gap-3">
              <div class="flex gap-2 items-center">
                <SiteImage :url="child.logo" :color="child.color" />
                <div class="flex flex-col gap-0.5">
                  <div class="flex gap-1 items-center">
                    <div class="text-lg font-semibold">{{ child.name }}</div>
                    <template v-if="child.vpn">
                      <el-tooltip effect="dark" content="访问需要开启 VPN 服务" placement="bottom">
                        <Icon name="ri:error-warning-line" class="text-slate-400" />
                      </el-tooltip>
                    </template>
                  </div>
                  <div class="flex gap-1 items-center text-xs text-slate-400 font-thin">
                    <template v-for="(tag, index) in child.tags" :key="index">
                      <el-tag effect="light" type="success" size="small" round>{{ tag }}</el-tag>
                    </template>
                  </div>
                </div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-6">
                {{ child.desc }}
              </div>
            </div>
            <div class="flex gap-1 absolute top-2 right-2">
              <!-- 置顶标签 -->
              <template v-if="child.pinned">
                <el-tag type="success" effect="dark" size="small"> 置顶 </el-tag>
              </template>
              <!-- 是否推荐 -->
              <template v-if="child.recommend">
                <el-tag type="info" effect="dark" size="small"> 推荐 </el-tag>
              </template>
            </div>
          </div>
        </AnimatedContent>
      </div>
      <div v-else class="flex justify-center items-center flex-col">
        <el-empty description="此分类暂无站点，请前往后台添加数据！" :image-size="100" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PageResponse, CategoryList, Response, WebsiteList } from "~/lib/type";
const client = useSupabaseClient<WebsiteList>();

// 请求分类列表
const { data: categoryList, status: categoryStatus } = await useFetch<Response<PageResponse<CategoryList>>>(
  "/api/categorys",
  {
    query: { current: 1, pageSize: 999 },
  }
);

// 点击卡片回调
const handleClick = async (record: WebsiteList) => {
  window.open(record.url);
  umTrackEvent(record.name, record);
  await client.rpc("increment_visit_count", {
    row_id: record.id,
    increment_value: Math.floor(Math.random() * 100) + 1,
  });
};

definePageMeta({
  title: "一个精美的个人站点导航！",
});
</script>
