<template>
  <div class="max-w-7xl mx-auto p-8 h-full flex flex-col">
    <h1 class="text-2xl font-bold">Danh sách phiên</h1>
    <div class="flex items-center justify-between w-full mt-8">
      <div class="flex gap-2 items-center">
        <Search v-model="search" class="w-96 max-w-md" />
        <Button variant="secondary" size="md">Tìm kiếm</Button>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="primary" size="md" class="flex items-center gap-2" @click="handleExport">
          <ArrowDownTrayIcon class="w-4 h-4" />
          Xuất dữ liệu
        </Button>
      </div>
    </div>
    <div class="w-full flex-grow mt-4">
      <Table :headers="sessionTableHeaders" :data="data" @selectRow="handleSelectRow" />
    </div>
    <div class="mt-4 gap-4 flex items-center justify-center w-full">
      <span class="text-gray-500">Trang :</span>
      <span
        v-if="currentPage > 1"
        :class="{
          'text-gray-500': currentPage === 1,
          'text-blue-500 cursor-pointer': currentPage !== 1,
        }"
        @click="handlePage(1)"
        >Đầu</span
      >
      <span
        v-if="currentPage > 1"
        @click="handlePage(currentPage - 1)"
        :class="{
          'text-gray-500': currentPage === 1,
          'text-blue-500 cursor-pointer': currentPage !== 1,
        }"
        >Trang trước</span
      >
      <span
        class="font-bold text-white bg-gray-600 px-2 py-1 rounded-full w-6 h-6 flex items-center justify-center"
        >{{ currentPage }}</span
      >
      <span
        v-if="currentPage < totalPage"
        @click="handlePage(currentPage + 1)"
        :class="{
          'text-gray-500': currentPage === totalPage,
          'text-blue-500 cursor-pointer': currentPage !== totalPage,
        }"
        >Trang sau</span
      >
      <span
        v-if="currentPage < totalPage"
        :class="{
          'text-gray-500': currentPage === totalPage,
          'text-blue-500 cursor-pointer': currentPage !== totalPage,
        }"
        @click="handlePage(totalPage)"
        >Cuối</span
      >
    </div>
  </div>
</template>

<script setup>
import Table from '@/components/kits/table/index.vue'
import Button from '@/components/kits/button/index.vue'
import { ref } from 'vue'
import Search from '@/components/kits/search/index.vue'
import { sessionTableHeaders } from '@/components/kits/table'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/solid'
import { exportExcel, preprocessData } from '@/utils'
const router = useRouter()
const search = ref('')
const data = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPage = ref(1)
const selectedRows = ref([])
const token = localStorage.getItem('token')

const fetchData = async () => {
  await axios
    .get('http://localhost:3000/session-transport', {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((res) => {
      console.log(res.data)
      data.value = res.data.sessionTransport
      selectedRows.value = new Array(res.data.sessionTransport.length).fill(false)
      totalPage.value = res.data.total
    })
    .catch((err) => {
      console.log(err)
    })
}

const handlePage = (page) => {
  currentPage.value = page
  fetchData()
}

const handleSelectRow = (rows) => {
  selectedRows.value = [...rows]
  console.log(selectedRows.value)
}

const handleExport = () => {
  const ids = []
  selectedRows.value.forEach((item, idx) => {
    if (item) {
      ids.push(data.value[idx].id)
    }
  })
  if (ids.length === 0) {
    return
  }
  axios
    .post(
      'http://localhost:3000/export',
      { ids },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((res) => {
      console.log(res.data)
      exportExcel(preprocessData(res.data))
    })
    .catch((err) => {
      alert(err.response?.data?.message || err.message)
    })
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/auth')
  } else {
    fetchData()
  }
})
</script>
