<template>
  <main class="flipbook-reader">
    <header class="flipbook-reader__header">
      <p>FABLEFOX READER</p>
      <h1>{{ zine?.title || 'Opening your zine…' }}</h1>
      <RouterLink v-if="zine" :to="`/posts/${zine.id}`">Back to story</RouterLink>
    </header>

    <div v-if="loading" class="flipbook-reader__state" role="status">
      <span class="flipbook-reader__spinner" aria-hidden="true"></span>
      Preloading illustrated pages…
    </div>
    <div v-else-if="error" class="flipbook-reader__state flipbook-reader__state--error">
      {{ error }}
    </div>
    <div v-else-if="!pages.length" class="flipbook-reader__state">
      This zine does not have any illustrated pages yet.
    </div>
    <template v-else>
      <div class="flipbook-reader__controls" aria-label="Flipbook controls">
        <button type="button" @click="pageFlip?.flipPrev()">← Previous</button>
        <span>Drag a corner or use the arrow keys</span>
        <button type="button" @click="pageFlip?.flipNext()">Next →</button>
      </div>
      <div class="flipbook-stage">
        <div ref="bookRoot" class="flipbook-book" aria-label="Interactive zine pages"></div>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { PageFlip } from 'page-flip'
import { fetchZineBySlug } from '@/api/pages'
import type { Post } from '@/stores/storePosts'

const route = useRoute()
const zine = ref<Post | null>(null)
const bookRoot = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref('')
let pageFlip: PageFlip | null = null

const pages = computed(() =>
  [...(zine.value?.pages || [])].sort((first, second) => first.order - second.order),
)

function preloadImage(url: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => reject(new Error(`Unable to load ${url}`))
    image.src = url
  })
}

async function initializeReader() {
  zine.value = await fetchZineBySlug(String(route.params.slug))
  if (!pages.value.length) {
    loading.value = false
    return
  }

  const firstPage = pages.value[0]
  if (!firstPage) return

  // Size the book from normalized API dimensions instead of waiting for DOM image measurements.
  const pageWidth = Math.min(550, firstPage.width)
  const pageHeight = Math.round(pageWidth * firstPage.height / firstPage.width)
  await Promise.all(pages.value.map((page) => preloadImage(page.image_url)))
  await nextTick()
  if (!bookRoot.value) return

  pageFlip = new PageFlip(bookRoot.value, {
    width: pageWidth,
    height: pageHeight,
    size: 'stretch',
    minWidth: Math.min(360, pageWidth),
    maxWidth: pageWidth,
    minHeight: Math.round(Math.min(360, pageWidth) * firstPage.height / firstPage.width),
    maxHeight: pageHeight,
    showCover: false,
    usePortrait: true,
    autoSize: true,
    drawShadow: true,
    maxShadowOpacity: 0.35,
    mobileScrollSupport: true,
    flippingTime: 650,
  })
  pageFlip.loadFromImages(pages.value.map((page) => page.image_url))
  loading.value = false
}

function onKeyDown(event: KeyboardEvent) {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    pageFlip?.flipPrev()
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    pageFlip?.flipNext()
  }
}

onMounted(async () => {
  window.addEventListener('keydown', onKeyDown)
  try {
    await initializeReader()
  } catch (readerError) {
    const requestError = readerError as {
      message?: string
      config?: { url?: string }
      response?: { status?: number; data?: unknown }
    }
    console.error('Unable to initialize zine reader', JSON.stringify({
      message: requestError.message,
      url: requestError.config?.url,
      status: requestError.response?.status,
    }))
    error.value = 'The illustrated pages could not be loaded. Please try again.'
    loading.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  pageFlip?.destroy()
  pageFlip = null
})
</script>

<style scoped>
.flipbook-reader {
  min-height: 78vh;
  padding: 2.5rem 0 5rem;
  text-align: center;
}

.flipbook-reader__header p {
  margin: 0;
  color: var(--color-teal);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.flipbook-reader__header h1 {
  margin: 0.3rem 0;
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 400;
}

.flipbook-reader__header a {
  color: var(--color-marigold);
}

.flipbook-reader__state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  min-height: 24rem;
  color: var(--color-muted);
}

.flipbook-reader__state--error {
  color: var(--color-marigold);
}

.flipbook-reader__spinner {
  width: 1.6rem;
  height: 1.6rem;
  border: 3px solid var(--color-rule);
  border-top-color: var(--color-teal);
  border-radius: 50%;
  animation: reader-spin 700ms linear infinite;
}

.flipbook-reader__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.flipbook-reader__controls button {
  padding: 0.6rem 0.9rem;
  border: 2px solid var(--color-marigold);
  border-radius: var(--radius-wobbly);
  background: transparent;
  color: var(--color-marigold);
  cursor: pointer;
  font-weight: 700;
}

.flipbook-reader__controls span {
  color: var(--color-muted);
  font-size: 0.85rem;
}

.flipbook-stage {
  width: min(100%, 76rem);
  margin: 0 auto;
  overflow: hidden;
}

.flipbook-book {
  margin: 0 auto;
}

@keyframes reader-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .flipbook-reader {
    padding-top: 1.5rem;
  }

  .flipbook-reader__controls {
    justify-content: space-between;
  }

  .flipbook-reader__controls span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
}
</style>
