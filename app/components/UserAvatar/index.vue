<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-06 17:53:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-06-11 09:22:58
 * @Description: 当前登录用户头像
-->
<template>
  <client-only>
    <template v-if="user">
      <el-button circle text>
        <el-avatar :src="user.user_metadata.avatar_url" :size="20" />
      </el-button>
    </template>
    <template v-else>
      <el-tooltip content="登录">
        <NuxtLink to="/login">
          <el-button circle text>
            <Icon name="ri:user-3-line" class="h-5 w-5" />
          </el-button>
        </NuxtLink>
      </el-tooltip>
    </template>
  </client-only>
</template>
<script setup lang="ts">
const user = useSupabaseUser()
</script>
