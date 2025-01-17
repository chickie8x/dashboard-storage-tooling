<template>
  <div class="p-4">
        <div class="p-4 max-w-7xl mx-auto text-slate-700">
          <h1 class="text-2xl font-bold">Tra cứu thông tin vận đơn</h1>
          <div class="flex items-end gap-2 mt-8 border-b border-slate-200 pb-4">
              <div class="w-full max-w-md">
                  <span class="text-lg font-semibold">Nhập mã vận đơn</span>
                  <Search v-model="tracking" class="w-full" />
              </div>
            <Button @click="handleSearch" :variant="'primary'" size="md">Tìm kiếm</Button>
          </div>
          <div class="mt-4">
            <span class="text-2xl">{{ message }}</span>
            <Table :headers="transportCodeHeaders" :data="data" v-if="isFound" class="mt-4"/>
          </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Search from '@/components/kits/search/index.vue'
import Button from '@/components/kits/button/index.vue'
import { transportCodeHeaders } from '@/components/kits/table/index.js'
import Table from '@/components/kits/table/index.vue'
import axios from 'axios'

const tracking = ref('')
const data = ref([])
const message = ref('Kết quả tìm kiếm')
const isFound = ref(false)
const handleSearch = () => {
    if (tracking.value.length === 0) {
        return
    }
    axios.get(`http://14.225.27.121/api/tracking-transport/${tracking.value.trim()}`).then((res) => {
        if (res.data.length > 0) {
            data.value = res.data
            message.value = `Kết quả tìm kiếm cho mã vận đơn: ${tracking.value}`
            isFound.value = true
        } else {
            message.value = `Không tìm thấy kết quả cho mã vận đơn: ${tracking.value}`
            isFound.value = false
        }
    }).catch((err) => {
        message.value = `Lỗi: ${err.response?.data?.message || err.message}`
        isFound.value = false
    })
}
</script>

