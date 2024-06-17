<script setup lang="ts">
const colorMode = useColorMode()
const user = useSupabaseUser()
const { auth } = useSupabaseClient()

const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`

watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <h2 class="my-6 text-center text-3xl font-extrabold u-text-white">登录您的账户</h2>
    <el-card class="sm:mx-auto sm:w-full sm:max-w-md">
      <el-divider>请选择</el-divider>
      <el-button
        type="primary"
        size="large"
        :dark="colorMode.value === 'dark'"
        class="w-full"
        @click="
          auth.signInWithOAuth({
            provider: 'github',
            options: { redirectTo }
          })
        "
      >
        <Icon name="i-simple-icons-github" class="h-5 w-5 mr-2" />
        Github
      </el-button>
    </el-card>
  </div>
</template>
