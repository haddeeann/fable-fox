<template>
  <BaseCard>
    <h1 class="text-2xl font-bold">Edit Story or Zine</h1>
    <form @submit.prevent="save">
      <label for="title" class="block">Title</label><input id="title" v-model="title" class="w-full rounded border p-2" />
      <template v-if="isEditor">
        <div class="my-3"><label for="status">Status</label><select id="status" v-model="status" class="ml-2 rounded border p-2"><option value="submitted">Submitted</option><option value="in_review">In review</option><option value="approved">Approved</option><option value="published">Published</option></select></div>
        <div class="my-3"><label for="issue">Issue</label><select id="issue" v-model="issue" class="ml-2 rounded border p-2"><option :value="null">Unassigned</option><option v-for="item in issues.issues" :key="item.id" :value="item.id">#{{ item.number }} — {{ item.title }}</option></select></div>
      </template>
      <p v-else class="my-3">Status: {{ status.replace('_', ' ') }}</p>
      <div class="my-2"><label for="tags">Tags</label><BaseTags v-model="tags" /></div>
      <TextEditor v-model="content" />
      <div class="flex justify-end gap-2 mt-4">
        <RouterLink to="/posts"><BaseButton type="warning">Cancel</BaseButton></RouterLink>
        <BaseButton type="primary" native-type="submit" :disabled="!title || !content">Update piece</BaseButton>
        <BaseButton v-if="!isEditor && status === 'submitted'" type="success" @click="submit">Submit for review</BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPostById, submitPost, updatePost } from '@/api/posts'
import { useStoreAuth } from '@/stores/storeAuth'
import { useStoreIssues } from '@/stores/storeIssues'
import TextEditor from '@/components/TextEditor.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseTags from '@/components/BaseTags.vue'
import BaseButton from '@/components/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const auth = useStoreAuth()
const issues = useStoreIssues()
const title = ref('')
const content = ref('')
const status = ref<'submitted' | 'in_review' | 'approved' | 'published'>('submitted')
const issue = ref<number | null>(null)
const tags = ref<string[]>([])
const isEditor = computed(() => ['admin', 'editor'].includes(auth.user?.role || ''))

async function save() {
  await updatePost(Number(route.params.id), { title: title.value, content: content.value, tags: tags.value, ...(isEditor.value ? { status: status.value, issue: issue.value } : {}) })
  await router.push('/posts')
}
async function submit() {
  const id = Number(route.params.id)
  await updatePost(id, { title: title.value, content: content.value, tags: tags.value })
  await submitPost(id)
  await router.push('/posts')
}

onMounted(async () => {
  if (isEditor.value) await issues.getIssues()
  const post = await fetchPostById(Number(route.params.id))
  title.value = post.title
  content.value = post.content
  status.value = post.status
  issue.value = post.issue
  tags.value = post.tags
})
</script>
