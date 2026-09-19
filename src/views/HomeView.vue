<template>
  <main class="landing-page">
    <section class="landing-hero">
      <img
        class="landing-hero__art"
        :src="heroArtwork"
        alt="A hand-drawn tower of crooked buildings and spiral staircases"
      />

      <svg class="landing-hero__flourish" viewBox="0 0 180 150" aria-hidden="true">
        <path class="landing-hero__swirl" d="M12 92c18-43 67-15 44 14-13 17-42 5-34-16 9-26 53-40 83-14 22 19 22 49-1 61" />
        <path class="landing-hero__star" d="m119 30 5-14 5 14 14 5-14 5-5 14-5-14-14-5Z" />
        <g class="landing-hero__paw" transform="translate(143 79) rotate(13)">
          <ellipse cx="12" cy="18" rx="8" ry="6" />
          <circle cx="3" cy="10" r="3" />
          <circle cx="10" cy="6" r="3" />
          <circle cx="18" cy="8" r="3" />
          <circle cx="23" cy="14" r="3" />
        </g>
      </svg>

      <div class="landing-hero__inner">
        <div class="landing-hero__copy">
          <p class="landing-hero__kicker">AN INDEPENDENT STORY PRESS</p>
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

          <p class="landing-hero__subheadline">Write a short story, doodle a zine, and send it into the world.</p>

          <RouterLink class="landing-hero__cta" :to="storeAuth.isLoggedIn ? '/posts/new' : '/auth'">
            Start creating
          </RouterLink>

          <WhimsyDivider class="landing-hero__divider" />

          <div class="landing-hero__manifesto">
            <img
              class="landing-hero__fox"
              :src="detailedFox"
              alt="A bespectacled fox reading a book and holding a quill"
            />
            <figure class="landing-hero__quote">
              <blockquote>
                “The best stories feel like finding a handwritten note tucked inside an old
                library book — curious, personal, and meant to be shared.”
              </blockquote>
              <figcaption>— THE FABLEFOX PRESS</figcaption>
            </figure>
          </div>
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
import WhimsyDivider from '@/components/WhimsyDivider.vue'
import heroArtwork from '@/assets/fablefox-tower-hero.png'
import detailedFox from '@/assets/fablefox-mark.png'

const storeAuth = useStoreAuth()
const storePosts = useStorePosts()
const words = ['quirky', 'creative', 'spooky', 'wonderfully odd', 'cozy', 'curious', 'unexpected', 'adorable']
const rotations = ['-1.5deg', '1deg', '-1deg', '0.7deg', '-0.8deg', '1.1deg', '-0.5deg', '0.9deg']
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
  filter: saturate(78%) contrast(102%);
  mask-image: linear-gradient(to left, black 60%, transparent 100%);
  opacity: 0.9;
}

.landing-hero__inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: inherit;
  padding: clamp(4rem, 8vh, 6.5rem) clamp(3rem, 4vw, 4rem);
}

.landing-hero__copy {
  width: min(100%, 760px);
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
  width: min(100%, 540px);
  margin: 0;
}

.landing-hero__divider {
  margin-top: 3.5rem;
}

.landing-hero__manifesto {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2.5vw, 2rem);
  margin-top: 1rem;
}

.landing-hero__fox {
  width: clamp(145px, 13vw, 190px);
  height: auto;
  flex: none;
  filter: drop-shadow(5px 5px 0 rgba(242, 84, 45, 0.2));
  transform: rotate(-2deg);
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

.landing-hero__flourish {
  position: absolute;
  z-index: 1;
  right: 42%;
  bottom: 6%;
  width: 145px;
  opacity: 0.16;
  transform: rotate(-8deg);
}

.landing-hero__swirl {
  fill: none;
  stroke: var(--color-teal);
  stroke-linecap: round;
  stroke-width: 4;
}

.landing-hero__star {
  fill: var(--color-marigold);
}

.landing-hero__paw {
  fill: var(--color-paper);
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
    padding: 4rem 1rem;
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
    width: 100%;
  }

  .landing-hero__manifesto {
    align-items: flex-start;
    gap: 0.75rem;
  }

  .landing-hero__fox {
    width: 112px;
  }
}
</style>
