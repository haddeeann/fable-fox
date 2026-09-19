<template>
  <div>
    <base-card>
      <p>
        I'm a software developer with two dogs who loves hiking and nature. I started building websites in 2010 with a passion for blogging and designing my own online spaces. Over the years, that passion has grown into a career creating small utility software products and games.
      </p>
      <p>
        I build and share my projects under the name <strong>Yellow Umbrella</strong>, a tiny indie software studio focused on joyful, helpful digital tools.
      </p>
    </base-card>
    <base-card title="About This App">
      <p>
        This project is a lightweight starter app designed for other developers. It provides a clean foundation for building full-stack Vue apps using Firebase, Pinia, and modern UI components.
      </p>
    </base-card>
    <base-card title="Features">
      <ul>
        <li>User authentication with Firebase</li>
        <li>Note-taking with live Firestore sync</li>
        <li>Pinia for state management</li>
        <li>Router-based navigation with protected routes</li>
        <li>Responsive layout with Tailwind and Naive UI</li>
        <li>Easy to extend and customize</li>
      </ul>
    </base-card>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'
</script>
