<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-11 09:28:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-06-11 15:35:47
 * @Description: 跳转登录界面
-->
<template>
  <client-only>
    <template v-if="user">
      <el-tooltip content="进入管理后台" placement="bottom">
        <NuxtLink to="/admin">
          <el-button circle text>
            <Icon name="ri:apps-fill" class="h-5 w-5" />
          </el-button>
        </NuxtLink>
      </el-tooltip>
    </template>
  </client-only>
</template>
<script setup lang="ts">
const user = useSupabaseUser()
</script>
