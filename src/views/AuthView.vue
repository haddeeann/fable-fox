<template>
  <div>
    <base-card title="Tiny Wordsmith">
      <form @submit.prevent="onSubmit" class="mt-4 space-y-4">
        <BaseInput
          id="username"
          label="Username"
          v-model="credentials.username"
          type="text"
          placeholder="you@example.com"
          autocomplete="username"
        />

        <BaseInput
          id="password"
          label="Password"
          v-model="credentials.password"
          type="password"
          placeholder="Enter your password"
          autocomplete="current-password"
          :error="passwordError"
        />

        <base-button :disabled="loading" type="primary" @click="onSubmit">
          {{ loading ? 'Logging in…' : 'Login' }}
        </base-button>
      </form>
    </base-card>
  </div>
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

const passwordError = computed(() =>
  credentials.password.length === 0 ? '' :
    credentials.password.length < 8 ? 'Password must be at least 8 characters.' : ''
)

const onSubmit = async () => {
  if (!credentials.username || !credentials.password) {
    alert('Please enter an email and password')
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
