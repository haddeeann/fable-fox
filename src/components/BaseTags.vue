<template>
  <span
    :class="[
      'inline-flex items-center',
      typeClasses,
      sizeClasses,
      { 'rounded-full': round, 'rounded': !round }
    ]"
  >
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'BaseTag',
  props: {
    type: {
      type: String as PropType<'default' | 'primary' | 'success' | 'info' | 'warning' | 'error'>,
      default: 'default'
    },
    size: {
      type: String as PropType<'tiny' | 'small' | 'medium' | 'large'>,
      default: 'medium'
    },
    round: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const typeClasses = computed(() => {
      switch (props.type) {
        case 'primary': return 'bg-blue-100 text-blue-800'
        case 'success': return 'bg-green-100 text-green-800'
        case 'info':    return 'bg-teal-100 text-teal-800'
        case 'warning': return 'bg-yellow-100 text-yellow-800'
        case 'error':   return 'bg-red-100 text-red-800'
        default:        return 'bg-gray-100 text-gray-800'
      }
    })

    const sizeClasses = computed(() => {
      switch (props.size) {
        case 'tiny':  return 'px-1 py-0.5 text-xs'
        case 'small': return 'px-2 py-1 text-sm'
        case 'large': return 'px-4 py-2 text-lg'
        default:      return 'px-3 py-1.5 text-base'
      }
    })

    return {
      typeClasses,
      sizeClasses,
      round: props.round
    }
  }
})
</script>
