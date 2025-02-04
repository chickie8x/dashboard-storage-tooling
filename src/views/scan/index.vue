<template>
  <div class="flex flex-col gap-2 p-4 text-sm h-screen">
    <div class="flex items-center justify-between gap-2">
      <Select
        v-model="sessionType"
        :options="typeOptions"
        class="flex-1 border border-gray-300 rounded-sm h-10 px-4 bg-gray-100 outline-indigo-500"
      />
      <div
        class="flex flex-1 items-center justify-center gap-1 border border-gray-300 rounded-sm h-10 px-1 bg-gray-100"
      >
        <UserIcon class="text-slate-700" />
        <button @click="handleLogout" class="text-blue-500 text-sm underline px-2 py-1 rounded-sm">
          Đăng xuất
        </button>
      </div>
    </div>
    <div>
      <input
        v-model="code"
        @input="handleAddItem"
        placeholder="Chạm vào đây để quét"
        class="w-full border border-gray-300 rounded-sm h-10 px-4 bg-gray-100 outline-indigo-500"
      />
    </div>
    <div class="flex-grow overflow-y-auto">
      <ListItem :items="listItems" :contentType="sessionType" />
    </div>
    <div class="flex flex-row gap-1">
      <Select
        v-model="transport"
        :options="transportOptions"
        class="flex-1 border border-gray-300 rounded-sm h-10 px-4 bg-gray-100 outline-indigo-500"
      />
      <Select
        v-model="goodsStatus"
        :options="goodsStatusOptions"
        class="flex-1 border border-gray-300 rounded-sm h-10 px-4 bg-gray-100 outline-indigo-500"
      />
    </div>
    <div>
      <textarea
        v-model="note"
        placeholder="Nhập ghi chú"
        class="w-full border border-gray-300 rounded-sm h-10 px-4 py-2 bg-gray-100 outline-indigo-500 resize-none"
      />
    </div>
    <div class="flex items-center justify-center gap-2">
      <button
        @click="handleReset"
        class="bg-yellow-500 focus:bg-yellow-400 text-white px-4 py-2 rounded-sm flex-1"
      >
        Làm lại
      </button>
      <button
        @click="handleCloseSession"
        class="bg-red-500 focus:bg-red-400 text-white px-4 py-2 rounded-sm flex-1"
      >
        Đóng phiên
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Select from '@/components/kits/select/index.vue'
import ListItem from '@/components/kits/list/index.vue'
import { typeOptions, transportOptions, goodsStatusOptions } from '.'
import UserIcon from '@/components/icons/user.vue'

const sessionType = ref(typeOptions[0].value)
const code = ref('')
const listItems = ref([])
const transport = ref(transportOptions[0].value)
const goodsStatus = ref(goodsStatusOptions[0].value)
const note = ref('')
const timeout = ref(null)
const token = ref(null)
const router = useRouter()

const handleReset = () => {
  listItems.value = []
  code.value = ''
  transport.value = transportOptions[0].value
  goodsStatus.value = goodsStatusOptions[0].value
  note.value = ''
}

const handleCloseSession = () => {
  if (!token.value) {
    console.log('Not authenticated')
    return
  }
  if (listItems.value.length === 0) {
    return
  }
  const sessionCode = `LC_${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`
  let data = {
    sessionCode: sessionCode,
    sessionType: sessionType.value,
    transportCode: listItems.value,
    note: note.value,
    goodsStatus: goodsStatus.value,
    transporter: transport.value,
    transportCodeQuantity: listItems.value.length,
  }
  axios
    .post('http://14.225.27.121/api/session-transport/create', data, {
      headers: {
        authorization: `Bearer ${token.value}`,
      },
    })
    .then((res) => {
      handleReset()
      alert('Lưu phiên thành công')
    })
    .catch((err) => {
      alert(err.response ? err.response.data.message : err.message)
    })
}

const handleAddItem = () => {
  clearTimeout(timeout.value)
  timeout.value = setTimeout(() => {
    if (code.value.trim()) {
      listItems.value.unshift({
        code: code.value,
        transporter: transport.value,
        goodsStatus: goodsStatus.value,
      })
      code.value = ''
    }
  }, 500)
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

onMounted(() => {
  token.value = localStorage.getItem('token')
  if (!token.value) {
    router.push('/auth')
  }
})
</script>
