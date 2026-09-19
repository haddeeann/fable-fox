<template>
  <component
    :is="componentTag"
    :class="[
      baseClasses,
      sizeClasses,
      { 'border': isBordered, 'hover:shadow-lg': isHoverable }
    ]"
  >
    <!-- Title prop or header slot -->
    <header v-if="props.title || $slots.header" class="mb-2">
      <slot name="header">
        <template v-if="typeof props.title === 'function'">
          <component :is="props.title" />
        </template>
        <template v-else>
          {{ props.title }}
        </template>
      </slot>
    </header>

    <!-- Main content prop or default slot -->
    <section class="mb-4">
      <slot>
        <template v-if="typeof props.content === 'function'">
          <component :is="props.content" />
        </template>
        <template v-else>
          {{ props.content }}
        </template>
      </slot>
    </section>

    <!-- Footer prop or footer slot -->
    <footer v-if="props.footer || $slots.footer" class="mt-2">
      <slot name="footer">
        <template v-if="typeof props.footer === 'function'">
          <component :is="props.footer" />
        </template>
        <template v-else>
          {{ props.footer }}
        </template>
      </slot>
    </footer>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VNodeChild } from 'vue'
defineOptions({ name: 'BaseCard' })

// Define the props to mirror essential naive-ui Card behavior
const props = defineProps<{
  title?: string | (() => VNodeChild)
  content?: string | (() => VNodeChild)
  footer?: string | (() => VNodeChild)
  tag?: keyof HTMLElementTagNameMap
  size?: 'small' | 'medium' | 'large' | 'huge'
  bordered?: boolean
  hoverable?: boolean
}>()

// Apply defaults
const componentTag = props.tag ?? 'div'
const componentSize = props.size ?? 'medium'
const isBordered = props.bordered ?? true
const isHoverable = props.hoverable ?? false

// Base styling
const baseClasses = 'dz-card my-6 mx-auto'

// Size-based padding & font-size
const sizeClasses = computed(() => {
  switch (componentSize) {
    case 'small': return 'p-2 text-sm'
    case 'large': return 'p-6 text-lg'
    case 'huge': return 'p-8 text-xl'
    default: return 'p-4 text-base'
  }
})
</script>
