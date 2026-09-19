<template>
  <main class="issue-archive">
    <header><p>Archive</p><h1>Issues</h1></header>
    <div v-if="loading">Loading issues…</div>
    <div v-else-if="!store.issues.length">The archive is waiting for its first splash of ink.</div>
    <div v-else class="issue-grid">
      <RouterLink v-for="issue in store.issues" :key="issue.id" :to="`/issues/${issue.id}`" class="issue-cover">
        <img v-if="issue.cover_image_url" :src="issue.cover_image_url" :alt="`Cover of ${issue.title}`" />
        <div v-else class="issue-cover__placeholder">Cover coming soon</div>
        <p>Issue {{ issue.number }}</p>
        <h2>{{ issue.title }}</h2>
      </RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStoreIssues } from '@/stores/storeIssues'

const store = useStoreIssues()
const loading = ref(true)
onMounted(async () => {
  try { await store.getIssues() } finally { loading.value = false }
})
</script>

<style scoped>
.issue-archive { max-width: var(--page-width); margin: 0 auto; padding: calc(var(--grid-gap) * 2) var(--grid-gap); background: var(--color-bg); color: var(--color-text); font-family: var(--font-body); min-height: 70vh; }
.issue-archive h1, .issue-cover h2 { font-family: var(--font-heading); }
.issue-archive header p { color: var(--color-accent); text-transform: uppercase; letter-spacing: .15em; }
.issue-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 20rem)); gap: var(--grid-gap); justify-content: start; }
.issue-cover { color: var(--color-text); text-decoration: none; }
.issue-cover img, .issue-cover__placeholder { width: 100%; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); box-shadow: var(--shadow); }
.issue-cover img { aspect-ratio: 3/4; object-fit: cover; }
.issue-cover__placeholder { display: grid; min-height: clamp(10rem, 24vh, 14rem); place-items: center; color: var(--color-muted); }
.issue-cover p { color: var(--color-accent); margin-bottom: 0; }
.issue-cover h2 { margin-top: .25rem; }
</style>
