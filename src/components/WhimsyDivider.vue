<template>
  <div class="whimsy-divider" aria-hidden="true">
    <span class="whimsy-divider__line"></span>
    <svg viewBox="0 0 126 38">
      <path class="whimsy-divider__swirl" d="M4 24c13-12 24 8 10 9-8 1-8-12 2-18" />
      <path class="whimsy-divider__star" d="m38 18 3-8 3 8 8 3-8 3-3 8-3-8-8-3Z" />
      <g class="whimsy-divider__paw" transform="translate(57 6) rotate(-8)">
        <ellipse cx="12" cy="18" rx="8" ry="6" />
        <circle cx="3" cy="10" r="3" />
        <circle cx="10" cy="6" r="3" />
        <circle cx="18" cy="8" r="3" />
        <circle cx="23" cy="14" r="3" />
      </g>
      <path class="whimsy-divider__star whimsy-divider__star--small" d="m96 15 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" />
      <path class="whimsy-divider__swirl" d="M109 14c14-10 20 7 9 12-7 3-12-4-8-10" />
    </svg>
    <span class="whimsy-divider__line"></span>
  </div>
</template>

<style scoped>
.whimsy-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: min(100%, 34rem);
  color: var(--color-teal);
}

.whimsy-divider svg {
  width: 126px;
  flex: none;
  overflow: visible;
}

.whimsy-divider__line {
  width: 100%;
  height: 1px;
  background: var(--color-rule);
}

.whimsy-divider__swirl {
  fill: none;
  stroke: var(--color-teal);
  stroke-linecap: round;
  stroke-width: 2;
}

.whimsy-divider__star {
  fill: var(--color-marigold);
}

.whimsy-divider__star--small {
  fill: var(--color-paper);
}

.whimsy-divider__paw {
  fill: var(--color-teal);
}
</style>
