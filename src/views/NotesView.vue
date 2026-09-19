<template>
  <div>
    <base-card>
      <textarea
        v-model="newNote"
        type="textarea"
        placeholder="Write your note here..."
        ref="noteInput"
      />
      <div class="flex justify-end mt-4">
        <base-button
          type="primary"
          :disabled="!newNote"
          @click="addNote"
        >
          Add Note
        </base-button>
      </div>
    </base-card>

    <div>
      <Note
        v-for="note in storeNotes.notes"
        :key="note.id"
        :note="note"
      />
      <div v-if="storeNotes.notes.length === 0">
        Your notebook is all clean paper—jot down the first spark above.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Note from '@/components/Note.vue'
import { useStoreNotes } from '@/stores/storeNotes'
import { useWatchCharacters } from '@/use/useWatchCharacters'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'

const storeNotes = useStoreNotes()
const newNote = ref('')
const noteInput = ref<HTMLTextAreaElement | null>(null)

const addNote = () => {
  storeNotes.addNote(newNote.value)
  newNote.value = ''
  noteInput.value?.focus()
}

onMounted(() => {
  storeNotes.getNotes()
})

useWatchCharacters(newNote, 200)
</script>
