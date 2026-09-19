<template>
  <article class="piece-card">
    <div class="piece-card__meta">
      <img v-if="piece.author.avatar_url" class="piece-card__avatar" :src="piece.author.avatar_url" :alt="`${authorName}'s avatar`" />
      <div>
        <strong>{{ authorName }}</strong>
        <p v-if="piece.author.bio">{{ piece.author.bio }}</p>
      </div>
    </div>
    <h3><RouterLink :to="`/posts/${piece.id}`">{{ piece.title }}</RouterLink></h3>
    <div class="piece-card__tags">
      <span v-for="tag in piece.tags" :key="tag">{{ tag }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/stores/storePosts'

const props = defineProps<{ piece: Post }>()
const authorName = computed(() => props.piece.author.full_name || props.piece.author.username)
</script>

<style scoped>
.piece-card { background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); border-radius: var(--radius); box-shadow: var(--shadow); padding: var(--grid-gap); font-family: var(--font-body); }
.piece-card h3 { margin: 1rem 0 .5rem; font: 700 1.5rem/1.1 var(--font-heading); }
.piece-card h3 a { color: var(--color-text); text-decoration-color: var(--color-accent); }
.piece-card__meta { display: flex; gap: .75rem; align-items: center; color: var(--color-muted); }
.piece-card__meta p { margin: .2rem 0 0; }
.piece-card__avatar { width: 3rem; height: 3rem; border-radius: 50%; object-fit: cover; border: 1px solid var(--color-border); }
.piece-card__tags { display: flex; gap: .4rem; flex-wrap: wrap; }
.piece-card__tags span { color: var(--color-accent); border: 1px solid var(--color-accent); border-radius: var(--radius); padding: .15rem .45rem; }
</style>
