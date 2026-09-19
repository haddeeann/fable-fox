<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__brand">
        <BrandMark compact />
        <p>Small press. Big doodles.</p>
      </div>

      <nav class="site-footer__nav" aria-label="Footer navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/issues">Issues</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/about#contact">Contact</RouterLink>
      </nav>

      <p class="site-footer__copyright">© {{ currentYear }} Doodle Zines Press</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BrandMark from '@/components/BrandMark.vue'

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  border-top: 2px solid var(--color-rule);
  background: var(--color-ink);
}

.site-footer__inner {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto minmax(220px, 1fr);
  align-items: center;
  gap: 2rem;
  width: min(100%, 1440px);
  min-height: 116px;
  margin: 0 auto;
  padding: 1.5rem clamp(1.25rem, 5vw, 4.5rem);
}

.site-footer__brand p,
.site-footer__copyright {
  margin: 0.45rem 0 0;
  color: var(--color-muted);
  font-size: 0.75rem;
}

.site-footer__nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.site-footer__nav a {
  color: #d8d2c4;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
}

.site-footer__nav a:hover,
.site-footer__nav a:focus-visible {
  color: var(--color-marigold);
}

.site-footer__copyright {
  justify-self: end;
  margin-top: 0;
  text-align: right;
}

@media (max-width: 800px) {
  .site-footer__inner {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 1.35rem;
    padding-block: 2rem;
    text-align: center;
  }

  .site-footer__copyright {
    justify-self: center;
    text-align: center;
  }
}
</style>
