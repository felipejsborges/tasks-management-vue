<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <Navbar />

  <main class="content">
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
.content {
  background: $background;
  padding: 8rem 16rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 4rem);
  /* 4rem is the height of the navbar */
}
</style>
