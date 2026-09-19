<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="computedId"
      class="mb-1 block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>

    <div class="relative">
      <!-- optional leading slot (e.g., icon) -->
      <span v-if="$slots.leading" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <slot name="leading" />
      </span>

      <input
        :id="computedId"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :required="required"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        v-bind="attrs"
        :class="[
          // base
          'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none',
          // ring/focus colors
          error ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          // spacing when there’s a leading slot
          $slots.leading ? 'pl-10' : '',
          // disabled styles
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white',
          // allow consumers to add more via prop
          inputClass
        ]"
        :aria-invalid="!!error || undefined"
        :aria-describedby="describedBy"
      />

      <!-- optional trailing slot (e.g., show/hide btn) -->
      <span v-if="$slots.trailing" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <slot name="trailing" />
      </span>
    </div>

    <p v-if="hint && !error" :id="hintId" class="mt-1 text-xs text-gray-500">
      {{ hint }}
    </p>
    <p v-if="error" :id="errorId" class="mt-1 text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ name: 'BaseInput' })

type Props = {
  modelValue: string | number | null
  label?: string
  id?: string
  type?: string
  placeholder?: string
  autocomplete?: string
  disabled?: boolean
  required?: boolean
  hint?: string
  error?: string
  inputClass?: string // extra classes to tack onto the <input>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  autocomplete: 'off',
  disabled: false,
  required: false,
  hint: '',
  error: '',
  inputClass: ''
})

defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const attrs = useAttrs()

const computedId = computed(() => props.id || `bi-${Math.random().toString(36).slice(2, 9)}`)
const hintId = computed(() => `${computedId.value}-hint`)
const errorId = computed(() => `${computedId.value}-error`)
const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})
</script>
