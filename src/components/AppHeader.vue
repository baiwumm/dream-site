<template>
  <header
    class="static top-0 h-14 shadow-md dark:shadow-white-500/50 backdrop-blur dark:bg-transparent transition-all py-3 px-4 md:px-8 lg:px-32"
  >
    <nav class="flex gap-4 justify-between items-center">
      <!-- 左侧 logo -->
      <HeaderLogo />
      <!-- 右侧 社交图标 -->
      <HeaderSocial />
    </nav>
  </header>
</template>

<style scoped>
.dark header {
  box-shadow:
    0 4px 6px -1px rgb(255 255 255 / 0.1),
    0 2px 4px -2px rgb(255 255 255 / 0.1);
}
</style>
