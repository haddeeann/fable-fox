<template>
  <main v-if="issue" class="issue-detail">
    <header class="issue-hero">
      <img v-if="issue.cover_image_url" :src="issue.cover_image_url" :alt="`Cover of ${issue.title}`" />
      <div>
        <p class="issue-kicker">Issue {{ issue.number }}</p>
        <h1>{{ issue.title }}</h1>
        <RouterLink v-if="canEdit" :to="`/issues/${issue.id}/edit`" class="issue-action">Edit issue</RouterLink>
      </div>
    </header>

    <section v-if="issue.editors_letter" class="editors-letter">
      <h2>Editor’s letter</h2>
      <p>{{ issue.editors_letter }}</p>
    </section>

    <section v-for="section in sections" :key="section.name" class="piece-section">
      <h2>{{ section.name }}</h2>
      <div class="piece-grid">
        <ZinePieceCard v-for="piece in section.pieces" :key="piece.id" :piece="piece" />
      </div>
    </section>
    <p v-if="!issue.pieces.length">This issue is still gathering its doodles. Check back after the ink dries.</p>
  </main>
  <main v-else class="issue-detail">Loading issue…</main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ZinePieceCard from '@/components/ZinePieceCard.vue'
import { useTheme } from '@/composables/useTheme'
import { useStoreAuth } from '@/stores/storeAuth'
import { useStoreIssues } from '@/stores/storeIssues'
import type { Post } from '@/stores/storePosts'

const route = useRoute()
const auth = useStoreAuth()
const store = useStoreIssues()
const issue = computed(() => store.currentIssue)
const canEdit = computed(() => ['admin', 'editor'].includes(auth.user?.role || ''))
const sections = computed(() => {
  const groups = new Map<string, Post[]>()
  for (const piece of issue.value?.pieces || []) {
    const name = piece.tags[0] || 'Features'
    groups.set(name, [...(groups.get(name) || []), piece])
  }
  return [...groups].map(([name, pieces]) => ({ name, pieces }))
})

useTheme(computed(() => issue.value?.theme))
onMounted(() => store.getIssue(Number(route.params.id)))
</script>

<style scoped>
.issue-detail { max-width: var(--page-width); margin: 0 auto; padding: calc(var(--grid-gap) * 2) var(--grid-gap); min-height: 75vh; background: var(--color-bg); color: var(--color-text); font-family: var(--font-body); }
.issue-detail h1, .issue-detail h2 { font-family: var(--font-heading); }
.issue-hero { display: grid; grid-template-columns: minmax(12rem, 24rem) 1fr; align-items: center; gap: calc(var(--grid-gap) * 2); }
.issue-hero img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border: 1px solid var(--color-border); border-radius: var(--radius); box-shadow: var(--shadow); }
.issue-hero h1 { font-size: clamp(2.5rem, 8vw, 6rem); line-height: .95; margin: .25rem 0 1rem; }
.issue-kicker { color: var(--color-accent); text-transform: uppercase; letter-spacing: .15em; }
.issue-action { display: inline-block; color: var(--color-accent-contrast); background: var(--color-accent); border-radius: var(--radius); padding: .6rem 1rem; text-decoration: none; }
.editors-letter { margin: calc(var(--grid-gap) * 2) 0; padding: var(--grid-gap); background: var(--color-surface); border-left: .35rem solid var(--color-accent); }
.editors-letter p { white-space: pre-wrap; max-width: 70ch; }
.piece-section { margin-top: calc(var(--grid-gap) * 2); }
.piece-section > h2 { color: var(--color-accent); border-bottom: 1px solid var(--color-border); padding-bottom: .5rem; }
.piece-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr)); gap: var(--grid-gap); }
@media (max-width: 42rem) { .issue-hero { grid-template-columns: 1fr; } }
</style>
