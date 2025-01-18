<template>
  <div class="w-full h-full">
    <div class="max-w-7xl mx-auto p-8 h-full flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Chi tiết phiên</h1>
      <div>
        <Table :headers="transportCodeHeaders" :data="data" :isLoading="isLoading"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Table from '@/components/kits/table/index.vue'
import { transportCodeHeaders } from '@/components/kits/table/index.js'

const route = useRoute()
const id = route.params.id
const data = ref([])
const token = localStorage.getItem('token')
const isLoading = ref(true)

const fetchData = async () => {
  await axios
    .get(`http://14.225.27.121/api/session-transport/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      data.value = res.data
      isLoading.value = false
    })
    .catch((err) => {
      isLoading.value = false
      alert(err.response?.data?.message || err.message)
    })
}

onMounted(() => {
  fetchData()
})
</script>
