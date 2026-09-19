<template>
  <main class="landing-page">
    <section class="landing-hero">
      <!-- Temporary Stitch artwork: replace with licensed or commissioned art before production. -->
      <img
        class="landing-hero__art"
        :src="heroArtwork"
        alt="A hand-drawn zine cover with a winding path through a strange monochrome landscape"
      />

      <svg class="landing-hero__splatter" viewBox="0 0 170 150" aria-hidden="true">
        <path d="M87 49c12-28 22-32 26-8 3 19 29-7 34 4 5 10-21 22-7 30 20 12 8 26-8 23-13-2-8 27-22 22-9-3-7-23-21-10-18 17-31 4-17-12 12-15-16-24-2-33 8-5 22 12 29-6 8-20 22-14 18 8Z" />
        <circle cx="29" cy="45" r="5" />
        <circle cx="142" cy="122" r="7" />
        <circle cx="63" cy="131" r="3" />
      </svg>

      <div class="landing-hero__inner">
        <div class="landing-hero__copy">
          <p class="landing-hero__kicker">AN INDEPENDENT PRESS</p>
          <h1>
            <span>Publish something</span>
            <Transition name="word-fade" mode="out-in">
              <span
                :key="currentWord"
                class="landing-hero__word"
                :style="{ transform: `rotate(${currentRotation})` }"
              >{{ currentWord }}</span>
            </Transition>
          </h1>

          <p class="landing-hero__subheadline">Write it, doodle it, and send it into the world.</p>

          <RouterLink class="landing-hero__cta" :to="storeAuth.isLoggedIn ? '/posts/new' : '/auth'">
            Start writing
          </RouterLink>

          <figure class="landing-hero__quote">
            <blockquote>
              “We don't need another polished portfolio platform. We need weird, restless,
              risky zines — late-night poetry and half-baked genius.”
            </blockquote>
            <figcaption>— THE DOODLE ZINES PRESS</figcaption>
          </figure>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useStoreAuth } from '@/stores/storeAuth'
import { useStorePosts } from '@/stores/storePosts'
import heroArtwork from '@/assets/doodle-zines-hero.png'

const storeAuth = useStoreAuth()
const storePosts = useStorePosts()
const words = ['unhinged', 'creative', 'spooky', 'weird', 'horny', 'odd','rebellious', 'classy', 'classic', 'suspicious', 'adorable']
const rotations = ['-1.5deg', '1deg', '-1deg', '0.7deg', '-0.8deg', '1.1deg']
const wordIndex = ref(0)
const currentWord = computed(() => words[wordIndex.value])
const currentRotation = computed(() => rotations[wordIndex.value])
let wordTimer: ReturnType<typeof setInterval> | undefined

onMounted(async () => {
  wordTimer = setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % words.length
  }, 2500)

  await storePosts.getPublishedPosts()
})

onUnmounted(() => {
  if (wordTimer) clearInterval(wordTimer)
})
</script>

<style scoped>
.landing-page {
  min-height: 100%;
  background: var(--color-ink);
}

.landing-hero {
  position: relative;
  min-height: clamp(710px, calc(100vh - 82px), 900px);
  overflow: hidden;
  background: var(--color-ink);
}

.landing-hero__art {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  width: min(52vw, 700px);
  height: 100%;
  object-fit: cover;
  object-position: 20% 30%;
  filter: grayscale(45%);
  mask-image: linear-gradient(to left, black 60%, transparent 100%);
  opacity: 0.9;
}

.landing-hero__inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  width: min(100%, 1440px);
  min-height: inherit;
  margin: 0 auto;
  padding: clamp(4rem, 8vh, 6.5rem) clamp(1.25rem, 6vw, 5.5rem);
}

.landing-hero__copy {
  width: min(100%, 680px);
}

.landing-hero__kicker {
  margin: 0 0 1.15rem;
  color: var(--color-teal);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 3px;
}

.landing-hero h1 {
  margin: 0;
  color: var(--color-paper);
  font-family: var(--font-display);
  font-size: clamp(3.3rem, 6vw, 4.45rem);
  font-weight: 400;
  line-height: 1.03;
  letter-spacing: -0.02em;
}

.landing-hero h1 > span:first-child {
  display: block;
}

.landing-hero__word {
  display: block;
  width: fit-content;
  min-height: 1.08em;
  color: rgba(46, 196, 182, 0.85);
  transform-origin: left center;
}

.landing-hero__subheadline {
  margin: 1.65rem 0 0;
  color: #bcb7ac;
  font-size: 1.125rem;
  line-height: 1.6;
}

.landing-hero__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2.2rem;
  padding: 0.88rem 1.5rem;
  border: 2px solid var(--color-marigold);
  border-radius: var(--radius-wobbly);
  background: var(--color-marigold);
  box-shadow: var(--shadow-hard-teal);
  color: var(--color-ink);
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.landing-hero__cta:hover,
.landing-hero__cta:focus-visible {
  transform: translate(-2px, -2px) rotate(-0.4deg);
  box-shadow: 8px 8px 0 rgba(46, 196, 182, 0.45);
}

.landing-hero__cta:focus-visible {
  outline: 3px solid var(--color-paper);
  outline-offset: 4px;
}

.landing-hero__quote {
  width: min(100%, 650px);
  margin: 3.5rem 0 0;
  padding-top: 1.8rem;
  border-top: 1px solid var(--color-rule);
}

.landing-hero__quote blockquote {
  margin: 0;
  color: #d8d2c4;
  font-size: 1rem;
  font-style: italic;
  line-height: 1.65;
}

.landing-hero__quote figcaption {
  margin-top: 0.85rem;
  color: var(--color-teal);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.landing-hero__splatter {
  position: absolute;
  z-index: 1;
  right: 43%;
  bottom: 5%;
  width: 130px;
  fill: var(--color-teal);
  opacity: 0.08;
  transform: rotate(18deg);
}

.word-fade-enter-active,
.word-fade-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.word-fade-enter-from,
.word-fade-leave-to {
  opacity: 0;
}

@media (max-width: 850px) {
  .landing-hero::after {
    position: absolute;
    z-index: 1;
    inset: 0;
    background: linear-gradient(90deg, rgba(21, 21, 21, 0.98) 0%, rgba(21, 21, 21, 0.83) 58%, rgba(21, 21, 21, 0.48) 100%);
    content: '';
  }

  .landing-hero__art {
    width: 72vw;
    opacity: 0.52;
  }
}

@media (max-width: 600px) {
  .landing-hero {
    min-height: 710px;
  }

  .landing-hero__inner {
    align-items: flex-start;
    padding-block: 4rem;
  }

  .landing-hero__art {
    width: 100%;
    opacity: 0.32;
    mask-image: linear-gradient(to top, transparent 0%, black 62%);
  }

  .landing-hero h1 {
    font-size: clamp(2.75rem, 14vw, 3.8rem);
  }

  .landing-hero__quote {
    margin-top: 3rem;
  }
}
</style>
