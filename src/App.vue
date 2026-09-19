<template>
  <div>
    <header>
      <div>
        <NavBar />
      </div>
    </header>
    <div class="mx-4">
      <RouterView />
    </div>

  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>
