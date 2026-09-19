<template>
  <RouterLink to="/" class="brand-mark" :class="{ 'brand-mark--compact': compact }" aria-label="FableFox home">
    <img class="brand-mark__fox" :src="foxMark" alt="" aria-hidden="true" />
    <span class="brand-mark__wordmark">FableFox</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const foxMark = `${import.meta.env.BASE_URL}favicon.svg`

withDefaults(defineProps<{ compact?: boolean }>(), {
  compact: false,
})
</script>

<style scoped>
.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--color-paper);
  text-decoration: none;
  white-space: nowrap;
}

.brand-mark__fox {
  width: 44px;
  height: 44px;
  flex: none;
  object-fit: contain;
  transform: rotate(-2deg);
}

.brand-mark__wordmark {
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.2vw, 1.8rem);
  line-height: 1;
  transform: rotate(-1.5deg);
  transform-origin: left center;
}

.brand-mark--compact {
  gap: 0.5rem;
}

.brand-mark--compact .brand-mark__fox {
  width: 40px;
  height: 40px;
}

.brand-mark--compact .brand-mark__wordmark {
  font-size: 1.2rem;
}
</style>
