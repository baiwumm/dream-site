<template>
  <div class="w-screen h-screen flex justify-around items-center">
    <UButton>Button</UButton>
    <UBreadcrumb :links="links" />
    <Icon
      name="uil:github"
      size="48"
    />
  </div>
</template>
<script setup lang="ts">
const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home'
  },
  {
    label: 'Navigation',
    icon: 'i-heroicons-square-3-stack-3d'
  },
  {
    label: 'Breadcrumb',
    icon: 'i-heroicons-link'
  }
]
</script>
