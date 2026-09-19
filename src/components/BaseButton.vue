<template>
  <button
    :type="nativeType || 'button'"
    :class="[
      baseClasses,
      typeClasses,
      sizeClasses,
      { 'w-full': block, 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'BaseButton',
  props: {
    type: {
      type: String as PropType<'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'>,
      default: 'default'
    },
    nativeType: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button'
    },
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'medium'
    },
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded my-4 cursor-pointer transition-colors duration-200'

    const typeClasses = computed(() => {
      switch (props.type) {
        case 'primary': return 'bg-blue-500 text-white hover:bg-blue-700'
        case 'secondary': return 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        case 'success': return 'bg-green-600 text-white hover:bg-green-700'
        case 'warning': return 'bg-yellow-500 text-white hover:bg-yellow-600'
        case 'error':   return 'bg-red-600 text-white hover:bg-red-700'
        default:        return 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }
    })
    const sizeClasses = computed(() => {
      switch (props.size) {
        case 'small':  return 'px-3 py-1 text-sm'
        case 'large':  return 'px-6 py-3 text-lg'
        default:       return 'px-4 py-2 text-base'
      }
    })

    function handleClick(event: MouseEvent) {
      if (!props.disabled) {
        emit('click', event)
      }
    }

    return {
      baseClasses,
      typeClasses,
      sizeClasses,
      handleClick
    }
  }
})
</script>
