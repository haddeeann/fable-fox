<template>
  <div>
    <base-card class="about-brand-card">
      <img class="about-brand" :src="fableFoxLockup" alt="FableFox — a bespectacled fox reading and writing" />
      <p>
        FableFox is a quirky, cozy publishing home for short stories, handmade zines,
        pocket-sized comics, and all the curious work that lives between them.
      </p>
    </base-card>
    <base-card>
      <p>
        I'm a software developer with two dogs who loves hiking and nature. I started building websites in 2010 with a passion for blogging and designing my own online spaces. Over the years, that passion has grown into a career creating small utility software products and games.
      </p>
      <p>
        I build and share my projects under the name <strong>Yellow Umbrella</strong>, a tiny indie software studio focused on joyful, helpful digital tools.
      </p>
    </base-card>
    <base-card title="About FableFox">
      <p>
        FableFox gives writers and artists a warm place to shape an idea, share it on its
        own, or gather it into a themed issue alongside other storytellers.
      </p>
    </base-card>
    <base-card title="What You Can Make">
      <ul>
        <li>Write, revise, and submit short stories or zines</li>
        <li>Collect quick sparks in a private notebook</li>
        <li>Browse published issues and their contributors</li>
        <li>Give every issue its own visual personality</li>
      </ul>
    </base-card>
    <base-card id="contact" title="Contact">
      <p>Have a curious idea, a tiny masterpiece, or a question? Send a note to the FableFox Press.</p>
    </base-card>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'
import fableFoxLockup from '@/assets/fablefox-lockup.png'
</script>

<style scoped>
.about-brand-card {
  text-align: center;
}

.about-brand {
  width: min(100%, 22rem);
  margin: 0 auto 1rem;
}
</style>
