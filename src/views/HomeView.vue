<template>
  <main>
    <header class="my-6">
      <h1 class="text-3xl font-bold">Doodle Zines</h1>
      <p class="text-gray-600">Small publications, bright ideas, and creative messes.</p>
    </header>
    <p v-if="storePosts.publishedPosts.length === 0" class="my-6 text-gray-600">
      Nothing fresh from the sketchbook yet. The first zine is waiting to be made.
    </p>
    <base-card
      v-for="post in storePosts.publishedPosts"
      :key="post.id"
      :title="post.title"
      class="shadow-md cursor-pointer"
      @click="goToBlog(post.id)"
    >
      <div class="text-gray-700">
        <div class="my-2">
          <base-tag type="info" size="small" round v-for="(tag, idx) in post.tags" :key="idx" class="mr-2 mb-2">{{ tag }}</base-tag>
        </div>
        <div>{{ getExcerpt(post.content) }}</div>
        <div>Created: {{formatDate(post.created_at)}}</div>
        <div>Author: {{ post.author.full_name || post.author.username }}</div>
      </div>
    </base-card>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useStorePosts } from '@/stores/storePosts'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/prettyText'
import DOMPurify from 'dompurify'
import BaseCard from '@/components/BaseCard.vue'
import BaseTag from '@/components/BaseTag.vue'

const storePosts = useStorePosts()
const router = useRouter()

const goToBlog = (postId: number) => {
  router.push({ name: 'PostDetail', params: { id: postId } })
}

function getExcerpt(content: string, length = 100) {
  // Strip all tags
  const clean = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] })
  // Truncate to length
  return clean.length > length ? clean.slice(0, length) + '…' : clean
}


onMounted(async () => {
  await storePosts.getPublishedPosts()
})
</script>
