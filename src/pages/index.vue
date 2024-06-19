<template>
  <div class="flex flex-col gap-2 px-4" style="min-height: calc(100vh - 10rem)">
    <ClientOnly>
      <template #fallback>
        <PageLoading />
      </template>
      <el-button-group v-loading="categoryStatus === 'pending'">
        <el-button text :bg="!category_id" @click="category_id = ''">全部</el-button>
        <el-button
          v-for="item in categoryList?.data?.list || []"
          :key="item.id"
          text
          :bg="category_id === item.id"
          @click="category_id = item.id"
        >{{ item.name }}</el-button>
      </el-button-group>
      <div
        v-loading="websiteStatus === 'pending'"
        class="grid gap-5 w-full justify-center"
        style="grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr))"
      >
        <template v-if="websiteList?.data?.list?.length">
          <WebsiteCard
            v-for="item in websiteList?.data?.list || []"
            :key="item.id"
            :website-info="item"
          />
        </template>
        <el-empty v-else description="此分类暂无站点，请前往后台添加数据!" />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { PageResponse, CategoryList, Response, WebsiteList } from '~/types'

const category_id = ref('')

// 请求站点列表
const { data: websiteList, status: websiteStatus } = await useFetch<
  Response<PageResponse<WebsiteList>>
>('/api/websites', {
  query: { current: 1, pageSize: 999, category_id }
})

// 请求分类列表
const { data: categoryList, status: categoryStatus } = await useFetch<
  Response<PageResponse<CategoryList>>
>('/api/categorys', {
  query: { current: 1, pageSize: 999 }
})
</script>
