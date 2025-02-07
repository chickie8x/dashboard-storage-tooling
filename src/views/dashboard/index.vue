<template>
  <div class="max-w-7xl mx-auto p-8 h-full flex flex-col">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Danh sách phiên</h1>
      <div class="flex items-center gap-2">
        <UserIcon class="text-slate-700" />
        <span class="text-sm text-slate-700">{{ user }}</span>
        <button @click="handleLogout" class="text-blue-500 text-sm underline px-2 py-1 rounded-sm">
          Đăng xuất
        </button>
      </div>
    </div>
    <div class="flex items-center justify-between w-full mt-8">
      <div class="flex gap-2 items-center">
        <!-- <Search v-model="search" class="w-96 max-w-md" />
        <Button variant="secondary" size="md">Tìm kiếm</Button> -->
      </div>
      <div class="flex items-center gap-2">
        <Button variant="primary" size="md" class="flex items-center" @click="handleExport">
          <ArrowDownTrayIcon v-if="!isExporting" class="w-4 h-4 mr-2" />
          <Loading v-else class="w-4 h-4 animate-spin" />
          {{ isExporting ? 'Đang xuất dữ liệu...' : 'Xuất dữ liệu' }}
        </Button>
      </div>
    </div>
    <div class="mt-4 flex items-center gap-2">
      <InformationCircleIcon class="w-5 h-5 text-orange-600" />
      <span class="text-sm text-orange-500"
        >Lưu ý, trỏ chuột vào ô chi chú để xem đầy đủ nội dung ghi chú</span
      >
    </div>
    <div class="w-full flex-grow mt-1">
      <Table
        :headers="sessionTableHeaders"
        :data="data"
        :isLoading="isLoading"
        @selectRow="handleSelectRow"
        ref="tableRef"
      />
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
import { ArrowDownTrayIcon, InformationCircleIcon } from '@heroicons/vue/24/solid'
import { exportExcel, preprocessData } from '@/utils'
import Loading from '@/components/icons/loading.vue'
import UserIcon from '@/components/icons/user.vue'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()
const search = ref('')
const data = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPage = ref(1)
const selectedRows = ref([])
const token = localStorage.getItem('token')
const tableRef = ref(null)
const isExporting = ref(false)
const user = ref('')
const isLoading = ref(false)

const fetchData = async () => {
  data.value = []
  isLoading.value = true
  await axios
    .get('http://171.244.62.54/api/session-transport', {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((res) => {
      data.value = res.data.sessionTransport
      selectedRows.value = new Array(res.data.sessionTransport.length).fill(false)
      totalPage.value = res.data.total
      isLoading.value = false
    })
    .catch((err) => {
      alert(err.response?.data?.message || err.message)
      isLoading.value = false
    })
}

const handlePage = (page) => {
  currentPage.value = page
  fetchData()
  tableRef.value.refreshCheckbox()
}

const handleSelectRow = (rows) => {
  selectedRows.value = [...rows]
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
  isExporting.value = true
  axios
    .post(
      'http://171.244.62.54/api/export',
      { ids },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((res) => {
      exportExcel(preprocessData(res.data))
      isExporting.value = false
    })
    .catch((err) => {
      alert(err.response?.data?.message || err.message)
      isExporting.value = false
    })
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/auth')
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/auth')
  } else {
    fetchData()
    const decoded = jwtDecode(token)
    user.value = decoded.name
  }
})
</script>
