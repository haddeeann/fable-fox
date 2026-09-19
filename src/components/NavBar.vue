<template>
  <div class="p-4 bg-white shadow flex justify-between items-center">
    <div class="flex space-x-4" >
      <div>
        <RouterLink to="/" active-class="text-primary font-bold">Home</RouterLink>
        <span class="px-1">|</span>
        <RouterLink to="/issues" active-class="text-primary font-bold">Issues</RouterLink>
        <span v-if="storeAuth.user">
          <span class="px-1">|</span>
          <RouterLink to="/posts" active-class="text-primary font-bold">My Zines</RouterLink>
          <span class="px-1">|</span>
          <RouterLink to="/posts/new" active-class="text-primary font-bold">New Zine</RouterLink>
          <span class="px-1">|</span>
          <RouterLink to="/notes" active-class="text-primary font-bold">Notes</RouterLink>
          <span class="px-1">|</span>
          <RouterLink to="/stats" active-class="text-primary font-bold">Stats</RouterLink>
        </span>
        <span class="px-1">|</span>
        <RouterLink to="/about" active-class="text-primary font-bold">About</RouterLink>
      </div>
    </div>

    <div class="flex items-center space-x-4">
      <div v-if="storeAuth.user">
        Hey, {{ storeAuth.user.username }}!
      </div>
      <base-button
        type="primary"
        v-if="storeAuth.user"
        @click="storeAuth.logOutUser">
        Log out
      </base-button>
      <RouterLink v-else to="/auth">
        <base-button
          type="primary"
        >
          Login
        </base-button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useStoreAuth } from '@/stores/storeAuth'
import BaseButton from '@/components/BaseButton.vue'

const storeAuth = useStoreAuth()
</script>
