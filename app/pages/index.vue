<template>
  <div class="container mx-auto flex flex-col gap-6">
    <template v-if="categoryStatus === 'pending'">
      <USkeleton class="h-20 w-full" v-for="i in 3" :key="i" />
    </template>
    <template v-else>
      <div v-for="item in categoryList?.data?.list || []" :key="item.id">
        <div class="flex items-center gap-2">
          <UIcon :name="item.icon || 'ri:menu-5-line'" class="!size-6" />
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
            :distance="15"
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
                  <SiteImage :url="child.logo" :color="child.color" loading="lazy" />
                  <div class="flex flex-col gap-0.5">
                    <div class="flex gap-1 items-center">
                      <div class="text-lg font-semibold">{{ child.name }}</div>
                      <template v-if="child.vpn">
                        <UTooltip text="访问需要开启 VPN 服务">
                          <UIcon name="ri:error-warning-line" class="text-slate-400" />
                        </UTooltip>
                      </template>
                    </div>
                    <div class="flex gap-1 items-center text-xs text-slate-400 font-thin">
                      <template v-for="(tag, index) in child.tags" :key="index">
                        <UBadge color="neutral" variant="soft" class="rounded-full" size="sm">{{ tag }}</UBadge>
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
                <UBadge variant="soft" v-if="child.pinned" size="sm">置顶</UBadge>
                <!-- 是否推荐 -->
                <UBadge color="secondary" variant="soft" v-if="child.recommend" size="sm">推荐</UBadge>
              </div>
            </div>
          </AnimatedContent>
        </div>
        <div v-else class="flex justify-center items-center flex-col">
          <UAlert
            color="neutral"
            variant="subtle"
            title="此分类暂无站点!"
            description="请前往后台添加数据."
            icon="i-lucide-terminal"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { track } from "@vercel/analytics";
import type { PageResponse, CategoryList, Response, WebsiteList } from "~/lib/type";
const client = useSupabaseClient<WebsiteList>();
const toast = useToast();

defineOgImageComponent("Nuxt", {
  headline: "Greetings",
  title: `${process.env.NUXT_SITE_NAME} 👋`,
  description: "A beautiful personal site navigation!",
});

// 请求分类列表
const { data: categoryList, status: categoryStatus } = await useFetch<Response<PageResponse<CategoryList>>>(
  "/api/categorys",
  {
    query: { current: 1, pageSize: 999 },
    onRequestError: ({ error }) => {
      toast.add({
        title: "请求失败.",
        description: error.message,
      });
    },
  }
);

// 点击卡片回调
const handleClick = async (record: WebsiteList) => {
  try {
    window.open(record.url);
    umTrackEvent(record.name, record);
    track(record.name);
    await client.rpc("increment_visit_count", {
      row_id: record.id,
      increment_value: Math.floor(Math.random() * 100) + 1,
    });
  } catch {
    toast.add({
      title: "更新访问次数失败",
      color: "error",
    });
  }
};

definePageMeta({
  title: "一个简约、精美、现代化的个人站点导航！",
});
</script>
