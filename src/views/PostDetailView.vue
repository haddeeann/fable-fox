<template>
  <main>
    <base-card v-if="post">
      <h1>{{ post.title }}</h1>
      <base-tag class="mb-4" :type="post.status === 'published' ? 'success' : 'warning'" size="small" round>
        {{ post.status.replace('_', ' ') }}
      </base-tag>
      <base-button
        type="primary"
        v-if="isLoggedIn && post.author_id === storeAuth.user?.id"
        @click="goToBlogEdit()"
      >
        Edit zine
      </base-button>
      <div
        class="prose max-w-none text-gray-800"
        v-html="sanitize(post.content)"
      />
    </base-card>
    <div v-else>Opening this zine…</div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DOMPurify from 'dompurify'
import { fetchPostById } from '@/api/posts'
import { useStoreAuth } from '@/stores/storeAuth'
import BaseTag from '@/components/BaseTag.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'

interface Post {
  id: number
  title: string
  content: string,
  status: 'submitted' | 'in_review' | 'approved' | 'published'
  author_id: number,
  tags: Array<string>
}

const router = useRouter()
const route = useRoute()
const post = ref<Post | null>(null)

const storeAuth = useStoreAuth()
const isLoggedIn = computed(() => storeAuth.user !== null)


function sanitize(content: string) {
  return DOMPurify.sanitize(content)
}

function goToBlogEdit() {
  router.push({ name: 'PostEdit', params: { id: post.value?.id }})
}

onMounted(async () => {
  const id = Number(route.params.id)
  post.value = await fetchPostById(id)
})
</script>
