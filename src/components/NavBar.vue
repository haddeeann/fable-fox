<template>
  <header class="site-header">
    <div class="site-header__inner">
      <BrandMark />

      <nav class="site-header__nav" aria-label="Primary navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/issues">Issues</RouterLink>
        <RouterLink to="/about">About</RouterLink>

        <template v-if="storeAuth.user">
          <RouterLink class="site-header__member-link" to="/posts">My Library</RouterLink>
          <RouterLink class="site-header__member-link" to="/posts/new">New Piece</RouterLink>
          <button class="site-header__sign-in" type="button" @click="storeAuth.logOutUser">
            Log out
          </button>
        </template>
        <RouterLink v-else class="site-header__sign-in" to="/auth">Sign In</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useStoreAuth } from '@/stores/storeAuth'
import BrandMark from '@/components/BrandMark.vue'

const storeAuth = useStoreAuth()
</script>

<style scoped>
.site-header {
  position: sticky;
  z-index: 100;
  top: 0;
  width: 100%;
  border-bottom: 2px solid var(--color-rule);
  background: var(--color-ink);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
  min-height: 82px;
  padding: 1rem clamp(3rem, 4vw, 4rem);
}

.site-header__nav {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2.4vw, 2.2rem);
}

.site-header__nav a,
.site-header__nav button {
  color: var(--color-paper);
  font-family: var(--font-body);
  font-size: 0.94rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 150ms ease, transform 150ms ease;
}

.site-header__nav a:hover,
.site-header__nav a:focus-visible,
.site-header__nav a.router-link-exact-active:not(.site-header__sign-in) {
  color: var(--color-marigold);
}

.site-header__sign-in {
  min-width: 82px;
  padding: 0.58rem 1rem;
  border: 2px solid var(--color-marigold);
  border-radius: var(--radius-wobbly);
  background: transparent;
  color: var(--color-marigold) !important;
  cursor: pointer;
  text-align: center;
}

.site-header__sign-in:hover,
.site-header__sign-in:focus-visible {
  transform: rotate(-0.75deg);
}

@media (max-width: 760px) {
  .site-header__inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .site-header__nav {
    width: 100%;
    justify-content: space-between;
    gap: 0.7rem;
  }

  .site-header__member-link {
    display: none;
  }
}

@media (max-width: 420px) {
  .site-header__nav a,
  .site-header__nav button {
    font-size: 0.82rem;
  }

  .site-header__sign-in {
    min-width: 68px;
    padding-inline: 0.65rem;
  }
}
</style>
