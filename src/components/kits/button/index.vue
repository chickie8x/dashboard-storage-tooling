<template>
  <button class="px-2 py-1 rounded-md text-sm duration-300" :class="styles">
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'sm',
  },
})

const styles = computed(() => {
  return {
    'bg-blue-500 text-white hover:bg-blue-600 duration-300': props.variant === 'primary',
    'bg-white text-indigo-500 border border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 duration-300':
      props.variant === 'secondary',
    'px-2 py-1': props.size === 'sm',
    'px-4 py-2': props.size === 'md',
    'px-6 py-3': props.size === 'lg',
  }
})
</script>
