<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-06 17:53:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-06-07 09:10:05
 * @Description: 当前登录用户头像
-->
<template>
  <client-only>
    <el-button v-if="user" circle text>
      <el-avatar :src="user.user_metadata.avatar_url" :size="20" />
    </el-button>
  </client-only>
</template>
<script setup lang="ts">
const user = useSupabaseUser()
</script>
