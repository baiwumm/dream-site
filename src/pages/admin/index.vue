<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane name="categorys">
      <template #label>
        <div class="flex items-center justify-center gap-1">
          <Icon name="ri:menu-5-line" class="h-5 w-5" />
          <span>网站分类</span>
        </div>
      </template>
      <template v-if="activeName === 'categorys'">
        <Categorys />
      </template>
    </el-tab-pane>
    <el-tab-pane name="websites">
      <template #label>
        <div class="flex items-center justify-center gap-1">
          <Icon name="ri:planet-line" class="h-5 w-5" />
          <span>分类站点</span>
        </div>
      </template>
      <template v-if="activeName === 'websites'">
        <Websites />
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import Categorys from './_components/categorys/index.vue'
import Websites from './_components/websites/index.vue'

const activeName = ref('categorys')
</script>
