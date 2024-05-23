<template>
  <div
    class="flex justify-center items-center font-black text-5xl flex-col"
    style="height: calc(100vh - 8rem)"
  >
    Hello World!
    <div class="flex gap-4 mt-4">
      <UButton
        v-for="item in data"
        :key="item.id"
        :label="item.name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CategoryList } from '~/types'
const supabase = useSupabaseClient<CategoryList>()

const { data } = await supabase.from('site_category').select()
</script>
