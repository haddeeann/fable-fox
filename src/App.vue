<template>
  <div class="app-shell">
    <NavBar />
    <div class="app-view" :class="{ 'app-view--padded': route.name !== 'home' }">
      <RouterView />
    </div>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'

const route = useRoute()
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: var(--color-ink);
}

.app-view {
  flex: 1;
}

.app-view--padded {
  padding-inline: 1rem;
}
</style>
