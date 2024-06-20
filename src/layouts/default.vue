<template>
  <el-config-provider :locale="zhCn">
    <el-container direction="vertical">
      <!-- header -->
      <Header />
      <!-- main -->
      <el-main style="min-height: calc(100vh - 8rem)">
        <slot />
      </el-main>
      <!-- footer -->
      <Footer />
    </el-container>
  </el-config-provider>
</template>
<script lang="ts" setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
