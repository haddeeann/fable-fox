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
    const baseClasses = 'dz-button inline-flex items-center justify-center my-4 cursor-pointer'

    const typeClasses = computed(() => {
      switch (props.type) {
        case 'primary': return 'dz-button--primary'
        case 'secondary': return 'dz-button--secondary'
        case 'success': return 'dz-button--success'
        case 'warning': return 'dz-button--warning'
        case 'error':   return 'dz-button--error'
        default:        return 'dz-button--default'
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
