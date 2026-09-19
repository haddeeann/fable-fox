<template>
  <BaseCard>
    <form class="mt-4 space-y-4" @submit.prevent="save(false)">
      <div><label for="post-title" class="block text-sm font-medium">Title</label><input id="post-title" v-model="title" required class="mt-1 block w-full rounded border border-gray-300 p-2" /></div>
      <div><label for="post-content" class="block text-sm font-medium">Content</label><TextEditor id="post-content" v-model="content" class="mt-1 block w-full rounded border border-gray-300" /></div>
      <template v-if="isEditor">
        <div><label for="post-status">Status</label><select id="post-status" v-model="status" class="ml-2 rounded border p-2"><option value="submitted">Submitted</option><option value="in_review">In review</option><option value="approved">Approved</option><option value="published">Published</option></select></div>
        <div><label for="post-issue">Issue</label><select id="post-issue" v-model="issue" class="ml-2 rounded border p-2"><option :value="null">Unassigned</option><option v-for="item in issues.issues" :key="item.id" :value="item.id">#{{ item.number }} — {{ item.title }}</option></select></div>
      </template>
      <div class="flex justify-end gap-2">
        <RouterLink to="/posts"><BaseButton type="secondary">Cancel</BaseButton></RouterLink>
        <BaseButton type="primary" native-type="submit" :disabled="!title || !content">{{ isEditor ? 'Create piece' : 'Save draft' }}</BaseButton>
        <BaseButton v-if="!isEditor" type="success" :disabled="!title || !content" @click="save(true)">Submit for review</BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createPost, submitPost } from '@/api/posts'
import { useStoreAuth } from '@/stores/storeAuth'
import { useStoreIssues } from '@/stores/storeIssues'
import TextEditor from '@/components/TextEditor.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const auth = useStoreAuth()
const issues = useStoreIssues()
const title = ref('')
const content = ref('')
const status = ref<'submitted' | 'in_review' | 'approved' | 'published'>('submitted')
const issue = ref<number | null>(null)
const isEditor = computed(() => ['admin', 'editor'].includes(auth.user?.role || ''))

async function save(submit: boolean) {
  if (!title.value.trim() || !content.value.trim()) return
  const post = await createPost(title.value, content.value, isEditor.value ? { status: status.value, issue: issue.value } : {})
  if (submit) await submitPost(post.id)
  await router.push('/posts')
}

onMounted(() => { if (isEditor.value) issues.getIssues() })
</script>
