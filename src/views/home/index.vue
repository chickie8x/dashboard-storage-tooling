<template>
  <div class="h-screen">
    <div class="flex justify-center items-center h-full relative">
      <img src="/images/bgg.jpg" alt="" class="absolute top-0 left-0 w-full h-full object-cover" />
      <div
        class="bg-black bg-opacity-50 space-y-6 rounded-md p-4 absolute top-0 left-0 w-full h-full flex flex-col lg:flex-row items-center justify-center lg:space-x-6 lg:space-y-0"
      >
        <button
          @click="goToDashboard"
          class="min-w-56 py-2 bg-orange-500 text-white text-2xl font-semibold rounded-md duration-300 hover:bg-orange-400 flex items-center justify-center"
        >
          <HomeIcon class="w-6 h-6 mr-2" />
          Dashboard
        </button>
        <a
          href="/pda?version=now"
          class="min-w-56 py-2 bg-orange-500 text-white text-2xl font-semibold rounded-md duration-300 hover:bg-orange-400 flex items-center justify-center"
        >
          <QrCodeIcon class="w-6 h-6 mr-2" />
          Scan
        </a>
        <button
          @click="goToTracking"
          class="min-w-56 py-2 bg-orange-500 text-white text-2xl font-semibold rounded-md duration-300 hover:bg-orange-400 flex items-center justify-center"
        >
          <MagnifyingGlassIcon class="w-6 h-6 mr-2" />
          Tracking
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { MagnifyingGlassIcon, QrCodeIcon, HomeIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const goToDashboard = () => {
  router.push('/dashboard')
}

const goToTracking = () => {
  router.push('/tracking')
}
</script>
