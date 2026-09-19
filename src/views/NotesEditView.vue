<template>
  <div class="min-h-screen flex items-start justify-center p-4 bg-gray-50">
    <base-card title="Edit Note">
      <form>
        {{ noteContent }}
        <label for="noteContent">Note Content</label>
        <textarea
          v-model="noteContent"
          placeholder="Update your note..."
        />
        <div class="flex justify-end gap-2 mt-4">
          <router-link to="/notes">
            <button>Cancel</button>
          </router-link>
          <button
            :disabled="!noteContent"
            @click="handleSaveClicked"
          >
            Update Note
          </button>
        </div>
      </form>
    </base-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStoreNotes } from '@/stores/storeNotes'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'

const route = useRoute()
const router = useRouter()
const storeNotes = useStoreNotes()
const noteContent = ref('')

if (typeof route.params.id === 'string') {
  noteContent.value = storeNotes.getNoteContent(route.params.id)
  console.log(noteContent.value)
}

const handleSaveClicked = () => {
  if (typeof route.params.id === 'string') {
    storeNotes.updateNote(route.params.id, noteContent.value)
    router.push('/notes')
  }
}
</script>
