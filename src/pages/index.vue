<template>
  <div class="flex flex-col gap-2">
    <ClientOnly>
      <el-button-group v-loading="categoryStatus === 'pending'">
        <el-button text :bg="!category_id" @click="category_id = ''">
          <el-space :size="5">
            <Icon name="ri:menu-5-line" class="h-4 w-4" />
            <span>全部</span>
          </el-space>
        </el-button>
        <el-button
          v-for="item in categoryList?.data?.list || []"
          :key="item.id"
          text
          :bg="category_id === item.id"
          @click="category_id = item.id"
        >
          <el-space :size="5">
            <Icon :name="item.icon || 'ri:menu-5-line'" class="h-4 w-4" />
            <span>{{ item.name }}</span>
          </el-space>
        </el-button>
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
      </div>
      <div
        v-if="!websiteList?.data?.list?.length"
        class="flex justify-center items-center flex-col"
      >
        <el-empty description="此分类暂无站点，请前往后台添加数据！" />
        <NuxtLink to="/admin">
          <el-button color="#626aef" plain :dark="colorMode.value === 'dark'">前往后台</el-button>
        </NuxtLink>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { PageResponse, CategoryList, Response, WebsiteList } from '~/types'

const colorMode = useColorMode()

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

definePageMeta({
  title: '程序员的梦中情站'
})
</script>
