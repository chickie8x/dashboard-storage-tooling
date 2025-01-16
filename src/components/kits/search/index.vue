<template>
  <div
    class="flex items-center px-2 border border-gray-300 rounded-md text-sm group focus-within:ring-1 focus-within:ring-blue-500 duration-100"
  >
    <input type="text" v-model="model" placeholder="Search" class="w-full p-2 outline-none" />
    <MagnifyingGlassIcon class="w-4 h-4 group-hover:text-blue-500 duration-300" />
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'

const model = defineModel()
</script>
