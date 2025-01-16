<template>
  <div>
    <div>
      <h1>Detail</h1>
      <div>
        <Table :headers="transportCodeHeaders" :data="data" />
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

const fetchData = async () => {
  await axios
    .get(`http://localhost:3000/session-transport/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      data.value = res.data
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

onMounted(() => {
  fetchData()
})
</script>
