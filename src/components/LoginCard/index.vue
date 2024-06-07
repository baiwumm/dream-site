<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <div class="u-bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div>
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <el-divider>登录账户</el-divider>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
