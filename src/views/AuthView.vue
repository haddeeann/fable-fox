<template>
  <main class="auth-view">
    <base-card title="Welcome back to FableFox">
      <form @submit.prevent="onSubmit" class="mt-4 space-y-4">
        <BaseInput
          id="username"
          label="Username"
          v-model="credentials.username"
          type="text"
          placeholder="Enter your username"
          autocomplete="username"
        />

        <BaseInput
          id="password"
          label="Password"
          v-model="credentials.password"
          :type="passwordVisible ? 'text' : 'password'"
          placeholder="Enter your password"
          autocomplete="current-password"
          :error="passwordError"
          required
        >
          <template #trailing>
            <button
              type="button"
              class="rounded p-1 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :aria-pressed="passwordVisible"
              :aria-label="passwordVisible ? 'Hide password' : 'Reveal password'"
              :title="passwordVisible ? 'Hide password' : 'Reveal password'"
              aria-controls="password"
              @click="passwordVisible = !passwordVisible"
            >
              <svg
                v-if="passwordVisible"
                aria-hidden="true"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 3l18 18" />
                <path d="M10.6 10.7a2 2 0 002.7 2.7" />
                <path d="M9.9 4.2A10.7 10.7 0 0112 4c5.5 0 9 5 9 5a18.5 18.5 0 01-3.1 3.8" />
                <path d="M6.6 6.6C4.3 8.1 3 10 3 10s3.5 5 9 5a9.8 9.8 0 004.2-.9" />
              </svg>
              <svg
                v-else
                aria-hidden="true"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5z" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </button>
          </template>
        </BaseInput>

        <base-button native-type="submit" :disabled="loading" type="primary">
          {{ loading ? 'Logging in…' : 'Login' }}
        </base-button>
      </form>
    </base-card>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useStoreAuth } from '@/stores/storeAuth'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'

const credentials = reactive({
  username: '',
  password: ''
})

const storeAuth = useStoreAuth()
const loading = ref(false)
const passwordVisible = ref(false)

const passwordError = computed(() =>
  credentials.password.length === 0 ? '' :
    credentials.password.length < 8 ? 'Password must be at least 8 characters.' : ''
)

const onSubmit = async () => {
  if (!credentials.username || !credentials.password) {
    alert('Please enter a username and password')
    return
  }
  loading.value = true
  try {
    await storeAuth.logInUser(credentials)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-view {
  width: 100%;
  max-width: 42rem;
  margin-inline: auto;
  padding-block: clamp(3rem, 8vh, 6rem);
}
</style>
