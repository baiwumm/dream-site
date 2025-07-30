<template>
  <Transition name="fade">
    <div v-if="isVisible">
      <UButton
        icon="i-heroicons-arrow-up-20-solid"
        color="primary"
        size="xl"
        square
        variant="solid"
        class="fixed bottom-14 right-8 z-50 shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer rounded-full"
        @click="scrollToTop"
        :ui="{
          leadingIcon: '!size-5',
        }"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps({
  showAfter: {
    type: Number,
    default: 100, // 默认滚动100px后显示
    validator: (value: number) => value >= 0, // 确保是正数
  },
});

const isVisible = ref(false);

const handleScroll = () => {
  isVisible.value = window.scrollY > props.showAfter;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
