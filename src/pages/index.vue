<template>
  <div
    class="flex justify-center items-center font-black text-5xl flex-col"
    style="height: calc(100vh - 10rem)"
  >
    Hello World!
    <div class="flex gap-4 mt-4">
      <el-button v-for="item in data" :key="item.id">
        {{ item.name }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CategoryList } from '~/types'
const supabase = useSupabaseClient<CategoryList>()

const { data } = await supabase.from('ds_categorys').select()
</script>
