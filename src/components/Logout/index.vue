<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-06 18:00:33
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-06-07 08:59:59
 * @Description: 注销用户
-->
<template>
  <client-only>
    <el-tooltip content="注销用户">
      <el-button v-if="user" circle text @click="logout">
        <Icon name="ri:logout-box-r-line" class="h-5 w-5" />
      </el-button>
    </el-tooltip>
  </client-only>
</template>
<script setup lang="ts">
import { ElMessageBox } from 'element-plus'

const client = useSupabaseClient()
const user = useSupabaseUser()

// 注销用户
const logout = async () => {
  ElMessageBox.alert('确认注销当前用户吗？', '温馨提示', {
    confirmButtonText: '确定',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        await client.auth.signOut().then(() => {
          done()
          instance.confirmButtonLoading = false
          navigateTo('/')
        })
      }
      if (action === 'cancel') {
        done()
      }
    }
  })
}
</script>
