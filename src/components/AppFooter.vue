<template>
  <footer class="fixed bottom-0 w-full">
    <UDivider :avatar="{ src: '/logo.svg' }" />
    <div
      class="flex justify-between items-center px-4 md:px-8 lg:px-32 py-3 max-sm:flex-col -mt-2.5"
    >
      <!-- icp 备案 -->
      <ULink
        to="https://beian.miit.gov.cn/#/Integrated/index"
        target="_blank"
        active-class="text-primary"
        inactive-class="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <div class="flex items-center gap-2">
          <NuxtImg
            src="/icp.png"
            alt="粤ICP备2023007649号-3"
            class="w-4"
          />
          粤ICP备2023007649号-3
        </div>
      </ULink>
      <!-- 社交图标 -->
      <div class="max-sm:order-first">
        <!-- github -->
        <SocialButton
          icon="i-ri-github-line"
          url="https://github.com/baiwumm"
          tip="Github"
        />
        <!-- 微信 -->
        <SocialButton
          icon="i-ri-wechat-line"
          url="https://wechat.baiwumm.com/"
          tip="微信"
        />
        <!-- 电子邮箱 -->
        <SocialButton
          icon="i-ri-mail-line"
          url="mailto:baiwumm@foxmail.com"
          tip="Email"
        />
        <!-- 博客 -->
        <SocialButton
          icon="i-ri-quill-pen-line"
          url="https://baiwumm.com"
          tip="博客"
        />
      </div>
    </div>
  </footer>
</template>
