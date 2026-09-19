<template>
  <main class="page-uploader">
    <header class="page-uploader__header">
      <div>
        <p class="page-uploader__kicker">ZINE PAGES</p>
        <h1>{{ zine?.title || 'Page workshop' }}</h1>
        <p>Upload image pages, arrange them in reading order, then save the sequence.</p>
      </div>
      <RouterLink v-if="zine" :to="`/posts/${zine.id}/edit`">Back to edit</RouterLink>
    </header>

    <label
      class="page-uploader__dropzone"
      :class="{ 'page-uploader__dropzone--active': isDraggingFiles }"
      @dragenter.prevent="isDraggingFiles = true"
      @dragover.prevent="isDraggingFiles = true"
      @dragleave.prevent="isDraggingFiles = false"
      @drop.prevent="onFileDrop"
    >
      <input ref="fileInput" type="file" accept="image/*" multiple @change="onFileSelect" />
      <span class="page-uploader__drop-title">Drop page images here</span>
      <span>or click to browse — PNG, WebP, and other images are normalized to JPEG</span>
    </label>

    <div v-if="items.length" class="page-uploader__actions">
      <BaseButton type="primary" :disabled="isUploading || !pendingItems.length" @click="uploadPending">
        {{ isUploading ? 'Uploading…' : `Upload ${pendingItems.length || ''} page${pendingItems.length === 1 ? '' : 's'}` }}
      </BaseButton>
      <BaseButton type="secondary" :disabled="isSavingOrder || !orderDirty || !uploadedItems.length" @click="saveOrder">
        {{ isSavingOrder ? 'Saving…' : 'Save order' }}
      </BaseButton>
    </div>

    <p v-if="message" class="page-uploader__message">{{ message }}</p>

    <div v-if="items.length" class="page-uploader__grid" aria-label="Zine page order">
      <article
        v-for="(item, index) in items"
        :key="item.key"
        class="page-preview"
        :class="{ 'page-preview--dragging': draggedIndex === index }"
        draggable="true"
        @dragstart="startItemDrag(index)"
        @dragover.prevent
        @drop.prevent="dropItem(index)"
        @dragend="draggedIndex = null"
      >
        <div class="page-preview__number">{{ index + 1 }}</div>
        <img :src="item.preview" :alt="`Preview of ${item.name}`" />
        <div class="page-preview__meta">
          <strong>{{ item.name }}</strong>
          <span v-if="item.page">{{ item.page.width }} × {{ item.page.height }} px</span>
          <span v-else-if="item.uploading">Normalizing and uploading…</span>
          <span v-else>Ready to upload</span>
        </div>
        <p v-if="item.error" class="page-preview__error">{{ item.error }}</p>
        <button type="button" class="page-preview__remove" @click="removeItem(index)">
          Remove
        </button>
      </article>
    </div>

    <p v-else class="page-uploader__empty">No pages yet. Drop in a stack of images to begin.</p>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { bulkUpload, deletePage, reorder, type ZinePage } from '@/api/pages'
import { fetchPostById } from '@/api/posts'
import BaseButton from '@/components/BaseButton.vue'
import type { Post } from '@/stores/storePosts'

type PreviewItem = {
  key: string
  name: string
  preview: string
  file?: File
  page?: ZinePage
  error?: string
  uploading?: boolean
}

const route = useRoute()
const zineId = Number(route.params.id)
const zine = ref<Post | null>(null)
const items = ref<PreviewItem[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const isDraggingFiles = ref(false)
const isUploading = ref(false)
const isSavingOrder = ref(false)
const orderDirty = ref(false)
const draggedIndex = ref<number | null>(null)
const message = ref('')

const pendingItems = computed(() => items.value.filter((item) => item.file && !item.page))
const uploadedItems = computed(() => items.value.filter((item) => item.page))

function addFiles(files: File[]) {
  const images = files.filter((file) => file.type.startsWith('image/'))
  for (const file of images) {
    items.value.push({
      key: `local-${crypto.randomUUID()}`,
      name: file.name,
      preview: URL.createObjectURL(file),
      file,
    })
  }
  if (images.length !== files.length) message.value = 'Only image files were added.'
}

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  addFiles(Array.from(input.files || []))
  input.value = ''
}

function onFileDrop(event: DragEvent) {
  isDraggingFiles.value = false
  addFiles(Array.from(event.dataTransfer?.files || []))
}

function startItemDrag(index: number) {
  draggedIndex.value = index
}

function dropItem(targetIndex: number) {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return
  const [moved] = items.value.splice(draggedIndex.value, 1)
  if (moved) items.value.splice(targetIndex, 0, moved)
  draggedIndex.value = null
  orderDirty.value = true
}

async function uploadPending() {
  const pending = pendingItems.value
  if (!pending.length) return
  isUploading.value = true
  message.value = ''
  pending.forEach((item) => {
    item.uploading = true
    item.error = ''
  })

  try {
    const results = await bulkUpload(zineId, pending.map((item) => item.file as File))
    for (const result of results) {
      const item = pending[result.index]
      if (!item) continue
      item.uploading = false
      if (result.success && result.page) {
        URL.revokeObjectURL(item.preview)
        item.preview = result.page.image_url
        item.page = result.page
        item.file = undefined
        item.key = `page-${result.page.id}`
      } else {
        item.error = result.error || 'This page could not be uploaded.'
      }
    }
    orderDirty.value = uploadedItems.value.length > 1
    message.value = results.some((result) => !result.success)
      ? 'Some pages need attention; the others uploaded successfully.'
      : 'Pages uploaded. Save the order when everything looks right.'
  } catch {
    pending.forEach((item) => {
      item.uploading = false
      item.error = 'The upload request failed. Please try again.'
    })
  } finally {
    isUploading.value = false
  }
}

async function saveOrder() {
  isSavingOrder.value = true
  try {
    const pages = await reorder(
      zineId,
      items.value
        .filter((item): item is PreviewItem & { page: ZinePage } => Boolean(item.page))
        .map((item, order) => ({ page_id: item.page.id, order })),
    )
    const pageById = new Map(pages.map((page) => [page.id, page]))
    items.value.forEach((item) => {
      if (item.page) item.page = pageById.get(item.page.id) || item.page
    })
    orderDirty.value = false
    message.value = 'Page order saved.'
  } finally {
    isSavingOrder.value = false
  }
}

async function removeItem(index: number) {
  const item = items.value[index]
  if (!item) return
  if (item.page) {
    if (!window.confirm(`Remove ${item.name} from this zine?`)) return
    await deletePage(zineId, item.page.id)
  }
  if (item.file) URL.revokeObjectURL(item.preview)
  items.value.splice(index, 1)
  orderDirty.value = uploadedItems.value.length > 1
}

onMounted(async () => {
  const loadedZine = await fetchPostById(zineId) as Post
  zine.value = loadedZine
  items.value = [...(loadedZine.pages || [])]
    .sort((a, b) => a.order - b.order)
    .map((page) => ({
      key: `page-${page.id}`,
      name: `Page ${page.order + 1}`,
      preview: page.image_url,
      page,
    }))
})

onBeforeUnmount(() => {
  items.value.forEach((item) => {
    if (item.file) URL.revokeObjectURL(item.preview)
  })
})
</script>

<style scoped>
.page-uploader {
  width: min(100%, 78rem);
  min-height: 70vh;
  margin: 0 auto;
  padding: 3rem clamp(0rem, 3vw, 2rem) 5rem;
}

.page-uploader__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.page-uploader__header h1 {
  margin: 0.2rem 0 0.5rem;
  font-family: var(--font-display);
  font-size: clamp(2.3rem, 5vw, 4rem);
  font-weight: 400;
}

.page-uploader__header p {
  margin: 0;
  color: var(--color-muted);
}

.page-uploader__header a,
.page-uploader__kicker {
  color: var(--color-teal) !important;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.page-uploader__dropzone {
  display: grid;
  min-height: 11rem;
  place-content: center;
  padding: 2rem;
  border: 2px dashed var(--color-teal);
  border-radius: var(--radius-wobbly);
  background: rgba(46, 196, 182, 0.06);
  color: var(--color-muted);
  cursor: pointer;
  text-align: center;
  transition: background 150ms ease, transform 150ms ease;
}

.page-uploader__dropzone--active {
  background: rgba(46, 196, 182, 0.16);
  transform: rotate(-0.3deg);
}

.page-uploader__dropzone input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.page-uploader__drop-title {
  color: var(--color-paper);
  font-family: var(--font-display);
  font-size: 1.65rem;
}

.page-uploader__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-uploader__message {
  color: var(--color-teal);
}

.page-uploader__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 1.4rem;
  margin-top: 1rem;
}

.page-preview {
  position: relative;
  padding: 0.75rem;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-wobbly);
  background: var(--color-paper);
  box-shadow: 5px 5px 0 rgba(242, 84, 45, 0.35);
  color: var(--color-ink);
  cursor: grab;
}

.page-preview--dragging {
  opacity: 0.5;
}

.page-preview img {
  width: 100%;
  aspect-ratio: 2 / 3;
  border: 1px solid var(--color-ink);
  object-fit: cover;
}

.page-preview__number {
  position: absolute;
  z-index: 1;
  top: 0.3rem;
  left: 0.3rem;
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 50% 45% 52% 43%;
  background: var(--color-marigold);
  font-weight: 700;
}

.page-preview__meta {
  display: grid;
  gap: 0.25rem;
  margin-top: 0.6rem;
  font-size: 0.78rem;
}

.page-preview__meta strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-preview__error {
  color: #a3260d;
  font-size: 0.78rem;
}

.page-preview__remove {
  margin-top: 0.7rem;
  border: 0;
  background: transparent;
  color: #a3260d;
  cursor: pointer;
  font-weight: 700;
  text-decoration: underline;
}

.page-uploader__empty {
  color: var(--color-muted);
  text-align: center;
}

@media (max-width: 600px) {
  .page-uploader {
    padding-top: 2rem;
  }

  .page-uploader__header {
    flex-direction: column;
  }
}
</style>
