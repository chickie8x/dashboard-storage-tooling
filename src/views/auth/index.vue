<template>
  <div class="flex items-center justify-center h-screen text-sm">
    <div class="flex flex-col p-4 rounded-md max-w-md flex-1 mx-4 bg-slate-200 shadow-md">
      <h1 class="text-2xl font-bold uppercase text-slate-700 text-center">Đăng nhập</h1>
      <label for="email" class="text-sm text-slate-700 font-semibold">Email</label>
      <input
        v-model="email"
        class="px-4 py-2 outline-none border border-slate-300 rounded-md shadow-sm"
        placeholder="Email"
      />
      <label for="password" class="text-sm text-slate-700 font-semibold mt-4">Mật khẩu</label>
      <input
        v-model="password"
        type="password"
        class="px-4 py-2 outline-none border border-slate-300 rounded-md shadow-sm"
        placeholder="Mật khẩu"
      />
      <div class="flex justify-end mb-8 mt-2">
        <span class="text-sm text-blue-500 cursor-pointer hover:underline" @click="router.push('/')">Trở về trang chủ</span>
      </div>
      <Button variant="primary" size="md" @click="login">Đăng nhập</Button>
    </div>
  </div>
</template>

<script setup>
import Button from '@/components/kits/button/index.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  if (!email.value || !password.value) {
    return
  }
  const data = {
    email: email.value,
    password: password.value,
  }
  await axios
    .post('http://14.225.27.121/api/login', data)
    .then((res) => {
      localStorage.setItem('token', res.data.token)
      router.go(-1)
    })
    .catch((err) => {
      alert(err.response ? err.response.data.message : err.message)
    })
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/')
  }
})
</script>
