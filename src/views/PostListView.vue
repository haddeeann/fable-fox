<template>
  <main>
    <base-card
      v-for="post in storePosts.userPosts"
      :key="post.id"
      :title="post.title"
    >
      <base-tag class="mb-4" :type="post.status === 'published' ? 'success' : 'warning'" size="small" round>
        {{ post.status.replace('_', ' ') }}
      </base-tag>
      <div class="my-2">
        <base-tag type="info" size="small" round v-for="(tag, idx) in post.tags" :key="idx" class="mr-2 mb-2">{{ tag }}</base-tag>
      </div>
      <div class="text-gray-700 cursor-pointer mb-4" @click="goToBlogDetail(post.id)">
        <div>{{ getExcerpt(post.content) }}</div>
        <div>Created: {{formatDate(post.created_at)}}</div>
        <div>Author: {{ post.author.full_name || post.author.username }}</div>
      </div>
      <div class="flex space-x-2">
        <div>
          <base-button type="primary" @click="goToBlogEdit(post.id)">Edit</base-button>
        </div>
        <div>
          <base-button type="warning" @click="() => handleDeleteClicked(post.id)">
            Delete
          </base-button>
        </div>
      </div>
    </base-card>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useStorePosts } from '@/stores/storePosts'
import { useRouter } from 'vue-router'
import DOMPurify from 'dompurify'
import { formatDate } from '@/utils/prettyText'
import BaseCard from '@/components/BaseCard.vue'
import BaseTag from '@/components/BaseTag.vue'
import BaseButton from '@/components/BaseButton.vue'

const storePosts = useStorePosts()
const router = useRouter()

const goToBlogDetail = (postId: number) => {
  router.push({ name: 'PostDetail', params: { id: postId } })
}

const goToBlogEdit = (postId: number) => {
  router.push({ name: 'PostEdit', params: { id: postId } })
}

function getExcerpt(content: string, length = 100) {
  // Strip all tags
  const clean = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] })
  // Truncate to length
  return clean.length > length ? clean.slice(0, length) + '…' : clean
}

const handleDeleteClicked = async (id: number) => {
  await storePosts.deletePost(Number(id))
}

onMounted(async () => {
  await storePosts.getUserPosts()
})
</script>
