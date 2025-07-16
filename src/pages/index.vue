<template>
  <div class="container mx-auto flex flex-col gap-6">
    <div
      v-for="item in categoryList?.data?.list || []"
      :key="item.id"
      v-loading="categoryStatus === 'pending'"
    >
      <div class="flex items-center gap-2">
        <Icon :name="item.icon || 'ri:menu-5-line'" class="h-6 w-6" />
        <h2 class="text-xl font-semibold">{{ item.name }}</h2>
      </div>
      <div
        v-if="item.ds_websites?.length"
        class="grid gap-5 w-full justify-center grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] mt-2"
      >
        <AnimatedContent
          :distance="50"
          direction="vertical"
          :reverse="false"
          :duration="1.2"
          ease="power3.out"
          :initial-opacity="0"
          :animate-opacity="true"
          :scale="0.9"
          :threshold="0.1"
          :delay="0"
          v-for="child in item.ds_websites"
          :key="child.id"
        >
          <WebsiteCard :website-info="child" />
        </AnimatedContent>
      </div>
      <div v-else class="flex justify-center items-center flex-col">
        <el-empty description="此分类暂无站点，请前往后台添加数据！" :image-size="100" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PageResponse, CategoryList, Response } from '~/types'

// 请求分类列表
const { data: categoryList, status: categoryStatus } = await useFetch<
  Response<PageResponse<CategoryList>>
>('/api/categorys', {
  query: { current: 1, pageSize: 999 }
})

definePageMeta({
  title: '白雾茫茫丶'
})
</script>
