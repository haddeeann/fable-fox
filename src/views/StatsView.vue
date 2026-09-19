<template>
  <div>
    <base-card>
      <table class="mb-6">
        <thead>
        <tr>
          <th>Statistic</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Total Notes</td>
          <td>{{ storeNotes.totalNotesCount }}</td>
        </tr>
        <tr>
          <td>Total Characters Across Notes</td>
          <td>{{ storeNotes.totalCharactersCount }}</td>
        </tr>
        </tbody>
      </table>

      <input
        v-model="loveTakeNote"
        placeholder="What are you doodling today?"
        autofocus
      />
      <div class="block mt-2 text-sm italic">
        Go ahead—make a little noise on the page. We’ll count the characters as you type.
      </div>
    </base-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStoreNotes } from '@/stores/storeNotes'
import { useWatchCharacters } from '@/use/useWatchCharacters'
import BaseCard from '@/components/BaseCard.vue'

const storeNotes = useStoreNotes()
const loveTakeNote = ref('')
useWatchCharacters(loveTakeNote, 20)
</script>
