<template>
  <div>
    <!-- header -->
    <Header />
    <!-- main -->
    <main style="min-height: calc(100vh - 9rem)" class="!overflow-y-hidden p-4">
      <slot />
    </main>
    <!-- footer -->
    <Footer />
  </div>
</template>
