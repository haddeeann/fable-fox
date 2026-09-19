<template>
  <RouterLink to="/" class="brand-mark" :class="{ 'brand-mark--compact': compact }" aria-label="Doodle Zines home">
    <svg class="brand-mark__nib" viewBox="0 0 32 42" aria-hidden="true">
      <path d="M16 2.5 29 15 20.5 35.5 10 39 3 31.5 7.5 10Z" />
      <path class="brand-mark__line" d="m7.5 10 15.5 2.5-7 10.5M16 23l-6 16M16 23l4.5 12.5" />
      <circle cx="16" cy="23" r="2.4" />
    </svg>
    <span class="brand-mark__wordmark">Doodle Zines</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

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

.brand-mark__nib {
  width: 28px;
  height: 37px;
  flex: none;
  fill: color-mix(in srgb, var(--color-marigold) 22%, transparent);
  stroke: var(--color-marigold);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  transform: rotate(-6deg);
}

.brand-mark__line {
  fill: none;
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

.brand-mark--compact .brand-mark__nib {
  width: 22px;
  height: 30px;
}

.brand-mark--compact .brand-mark__wordmark {
  font-size: 1.2rem;
}
</style>
