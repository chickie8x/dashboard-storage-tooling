<template>
  <div class="p-1 md:p-4">
    <div class="p-4 max-w-7xl mx-auto text-slate-700">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <h1 class="text-2xl font-bold text-center md:text-left">
          {{ lang === 'cn' ? '查询运单号状态' : 'Tra cứu thông tin vận đơn' }}
        </h1>
        <div class="flex items-center gap-2 mt-4 md:mt-0">
          <span class="font-semibold text-slate-700">{{
            lang === 'cn' ? '语言' : 'Chọn ngôn ngữ'
          }}</span>
          <Select
            v-model="lang"
            :options="languageOptions"
            class="border border-slate-400 rounded-md px-2 py-1"
            @change="handleChangeLanguage"
          />
          <component :is="flag" />
        </div>
      </div>
      <div class="flex flex-col md:flex-row items-end gap-2 mt-8 border-b border-slate-200 pb-4">
        <div class="w-full max-w-md">
          <span class="text-lg font-semibold">{{
            lang === 'cn' ? '输入运单号' : 'Nhập mã vận đơn'
          }}</span>
          <Search v-model="tracking" class="w-full" />
        </div>
        <Button
          @click="handleSearch"
          :variant="'primary'"
          size="md"
          class="w-full mt-2 md:w-auto min-w-24 md:mt-4 flex items-center justify-center"
          :disabled="isLoading"
        >
          <Loading v-if="isLoading" class="w-4 h-4 mr-0" />
          {{ isLoading ? '' : lang === 'cn' ? '查询' : 'Tìm kiếm' }}
        </Button>
      </div>
      <div class="mt-4">
        <div class="flex flex-col">
          <span class="text-2xl font-semibold"
            >{{ lang === 'cn' ? '查询结果' : 'Kết quả tìm kiếm' }}</span
          >
        </div>
        <div v-if="isFound" class="flex items-center gap-x-8 mt-4">
          <div>
            <span class="text-slate-700">{{ lang === 'cn' ? '订单总数: ' : 'Tổng số vận đơn: ' }}</span>
            <span class="text-blue-600 font-bold">{{ data.totalCodes }}</span>
          </div>
          <div>
            <span class="text-slate-700">{{ lang === 'cn' ? '找到的数量: ' : 'Tìm thấy: ' }}</span>
            <span class="text-green-500 font-bold">{{ data.totalFoundCodes }}</span>
          </div>
          <div>
            <span class="text-slate-700">{{ lang === 'cn' ? '未找到: ' : 'Không tìm thấy: ' }}</span>
            <span class="text-red-500 font-bold">{{ data.totalNotFoundCodes }}</span>
          </div>
        </div>
        <div v-if="data.totalNotFoundCodes > 0" class="mt-2 w-full overflow-auto">
          <span class="font-semibold text-slate-700">{{ lang === 'cn' ? '未找到的运单号: ' : 'Mã vận đơn không tìm thấy: ' }}</span>
          <ul class="list-disc list-inside flex gap-x-4 flex-wrap">
            <li v-for="code in data.notFoundCodes" :key="code">{{ code }}</li>
          </ul>
        </div>
        <div v-if="isFound" class="mt-4 w-full overflow-auto">
          <span class=" font-semibold text-slate-700">{{ lang === 'cn' ? '订单详情' : 'Mã vận đơn tìm thấy' }}</span>
          <Table :headers="headers" :data="data.transport" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Search from '@/components/kits/search/index.vue'
import Button from '@/components/kits/button/index.vue'
import { transportCodeHeaders } from '@/components/kits/table/index.js'
import Table from '@/components/kits/table/index.vue'
import Select from '@/components/kits/select/index.vue'
import ChinaFlag from '@/components/icons/chinaFlag.vue'
import VietnamFlag from '@/components/icons/vietnamFlag.vue'
import Loading from '@/components/icons/loading.vue'
import axios from 'axios'

const tracking = ref('')
const data = ref([])
const isFound = ref(false)
const isLoading = ref(false)
const languageOptions = ref([
  { label: 'Tiếng Việt', value: 'vi', icon: VietnamFlag },
  { label: '中文', value: 'cn', icon: ChinaFlag },
])
const lang = ref(languageOptions.value[0].value)
const flag = computed(() => {
  if (lang.value === 'vi') {
    return VietnamFlag
  } else {
    return ChinaFlag
  }
})

const message = ref('')

const headers = computed(() => {
  if (lang.value === 'vi') {
    return transportCodeHeaders
  } else {
    return [
      { label: '运单号', value: 'code' },
      { label: '末端派送', value: 'transporter' },
      { label: '货物状态', value: 'goodsStatus' },
      { label: '入库日期', value: 'createdAt' },
      { label: '备注', value: 'note' },
    ]
  }
})

const handleSearch = () => {
  if (tracking.value.length === 0) {
    return
  }
  if(!navigator.onLine) {
    alert(lang.value === 'cn' ? '请检查网络连接' : 'Vui lòng kiểm tra kết nối mạng')
    return
  }
  isLoading.value = true
  const s = [...new Set(tracking.value.trim().split(' '))]
  const codes = s.filter(code => code.trim() !== '')
  axios
    .post(`http://171.244.143.152/api/tracking-transport`, { codes })
    .then((res) => {
      if (res.data) {
        data.value = res.data
        isFound.value = true
      } else {
        isFound.value = false
      }
    })
    .catch((err) => {
      alert(lang.value === 'cn' ? `错误: ${err.response?.data?.message || err.message}` : `Lỗi: ${err.response?.data?.message || err.message}`)
      isFound.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

const handleChangeLanguage = () => {
  message.value = ''
  data.value = []
  isFound.value = false
  tracking.value = ''
}
</script>
