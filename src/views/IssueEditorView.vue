<template>
  <main v-if="issue" class="issue-editor">
    <header><p>Issue {{ issue.number }}</p><h1>Edit {{ issue.title }}</h1></header>
    <form class="issue-form" @submit.prevent="saveIssue">
      <label>Title <input v-model="form.title" required /></label>
      <label>Number <input v-model.number="form.number" type="number" min="1" required /></label>
      <label>Theme
        <select v-model="form.theme"><option value="default">Default</option><option value="riso">Riso</option><option value="newsprint">Newsprint</option></select>
      </label>
      <label>Cover image <input type="file" accept="image/*" @change="uploadCover" /></label>
      <label>Editor’s letter <textarea v-model="form.editors_letter" rows="10" /></label>
      <label>Status <select v-model="form.status"><option value="draft">Draft</option><option value="published">Published</option></select></label>
      <button class="primary-action" type="submit" :disabled="saving">{{ saving ? 'Saving…' : 'Save issue' }}</button>
    </form>

    <section class="pieces-editor">
      <h2>Pieces</h2>
      <p>Use the controls to set publication state and reading order. Assign additional pieces from their edit page.</p>
      <ol>
        <li v-for="(piece, index) in pieces" :key="piece.id">
          <strong>{{ piece.title }}</strong><span>{{ piece.author.full_name || piece.author.username }}</span>
          <select v-model="piece.status" @change="savePieceStatus(piece)">
            <option value="submitted">Submitted</option><option value="in_review">In review</option><option value="approved">Approved</option><option value="published">Published</option>
          </select>
          <button type="button" :disabled="index === 0" @click="move(index, -1)" aria-label="Move up">↑</button>
          <button type="button" :disabled="index === pieces.length - 1" @click="move(index, 1)" aria-label="Move down">↓</button>
        </li>
      </ol>
    </section>
  </main>
  <main v-else class="issue-editor">Loading issue…</main>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/api/axios'
import { updatePost } from '@/api/posts'
import { useStoreIssues, type IssueStatus, type IssueTheme } from '@/stores/storeIssues'
import type { Post } from '@/stores/storePosts'

const route = useRoute()
const router = useRouter()
const store = useStoreIssues()
const issue = ref(store.currentIssue)
const pieces = ref<Post[]>([])
const saving = ref(false)
const form = reactive({ title: '', number: 1, editors_letter: '', status: 'draft' as IssueStatus, theme: 'default' as IssueTheme, cover_image: null as string | null })

function syncForm() {
  if (!issue.value) return
  Object.assign(form, { title: issue.value.title, number: issue.value.number, editors_letter: issue.value.editors_letter, status: issue.value.status, theme: issue.value.theme, cover_image: issue.value.cover_image })
  pieces.value = [...issue.value.pieces].sort((a, b) => a.order - b.order)
}

async function uploadCover(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const body = new FormData()
  body.append('image', file)
  const { data } = await axios.post('/api/media/images/', body, { headers: { 'Content-Type': 'multipart/form-data' } })
  form.cover_image = data.id
}

async function saveIssue() {
  if (!issue.value) return
  saving.value = true
  try {
    issue.value = await store.saveIssue(issue.value.id, { ...form })
    await router.push(`/issues/${issue.value.id}`)
  } finally { saving.value = false }
}

async function savePieceStatus(piece: Post) {
  await updatePost(piece.id, { status: piece.status })
}

async function move(index: number, direction: number) {
  if (!issue.value) return
  const destination = index + direction
  if (destination < 0 || destination >= pieces.value.length) return
  ;[pieces.value[index], pieces.value[destination]] = [pieces.value[destination], pieces.value[index]]
  pieces.value = [...pieces.value]
  const updated = await store.reorder(issue.value.id, pieces.value.map((piece, order) => ({ id: piece.id, order })))
  issue.value = updated
  pieces.value = [...updated.pieces].sort((a, b) => a.order - b.order)
}

onMounted(async () => {
  issue.value = await store.getIssue(Number(route.params.id))
  syncForm()
})
</script>

<style scoped>
.issue-editor { max-width: var(--page-width); margin: 0 auto; padding: calc(var(--grid-gap) * 2) var(--grid-gap); background: var(--color-bg); color: var(--color-text); font-family: var(--font-body); }
.issue-editor h1, .issue-editor h2 { font-family: var(--font-heading); }
.issue-editor header p { color: var(--color-accent); }
.issue-form { display: grid; gap: var(--grid-gap); padding: var(--grid-gap); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); }
.issue-form label { display: grid; gap: .35rem; }
.issue-form input, .issue-form textarea, .issue-form select, .pieces-editor select { background: var(--color-bg); color: var(--color-text); border: 1px solid var(--color-border); border-radius: var(--radius); padding: .55rem; font: inherit; }
.primary-action { justify-self: start; background: var(--color-accent); color: var(--color-accent-contrast); border: 0; border-radius: var(--radius); padding: .7rem 1.1rem; }
.pieces-editor { margin-top: calc(var(--grid-gap) * 2); }
.pieces-editor > p { color: var(--color-muted); }
.pieces-editor ol { display: grid; gap: .6rem; padding: 0; list-style: none; }
.pieces-editor li { display: grid; grid-template-columns: 2fr 1fr auto auto auto; gap: .6rem; align-items: center; padding: .7rem; background: var(--color-surface); border: 1px solid var(--color-border); }
.pieces-editor button { background: var(--color-accent); color: var(--color-accent-contrast); border: 0; border-radius: var(--radius); padding: .5rem; }
.pieces-editor button:disabled, .primary-action:disabled { opacity: .5; }
@media (max-width: 48rem) { .pieces-editor li { grid-template-columns: 1fr auto auto; } .pieces-editor li span, .pieces-editor li select { grid-column: 1 / -1; } }
</style>
