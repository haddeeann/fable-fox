<template>
  <base-card :title="formatDate(note.date)" class="mb-4 shadow-sm">
    <div class="text-base pb-4 whitespace-pre-wrap">
      {{ note.content }}
    </div>

    <div class="flex justify-between items-center text-sm text-gray-500 mb-2">
      <span>{{ characterLength }}</span>
    </div>

    <template #action>
      <div class="flex space-x-2">
        <RouterLink :to="`/editNote/${note.id}`">
          <button>Edit</button>
        </RouterLink>
        <button @click="storeNotes.deleteNote(note.id)">
          Delete
        </button>
      </div>
    </template>
  </base-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreNotes } from '@/stores/storeNotes'
import BaseCard from '@/components/BaseCard.vue'

const storeNotes = useStoreNotes()

const props = defineProps({
  note: {
    type: Object,
    required: true,
  },
})

const characterLength = computed(() => {
  const description = props.note.content.length === 1 ? 'character' : 'characters'
  return `${props.note.content.length} ${description}`
})

const formatDate = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp))
  return date.toLocaleString()
}
</script>
