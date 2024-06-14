<template>
  <el-tabs type="card">
    <el-tab-pane>
      <template #label>
        <div class="flex items-center justify-center gap-1">
          <Icon name="ri:list-indefinite" class="h-5 w-5" />
          <span>网站分类</span>
        </div>
      </template>
      <Categorys />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import Categorys from './_components/categorys/index.vue'
</script>
