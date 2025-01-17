<template>
  <div class="flex flex-col items-center justify-center h-screen text-sm">
    <div class="flex flex-col gap-4 p-4 rounded-md w-96 bg-slate-200 shadow-md">
      <h1 class="text-2xl font-bold uppercase text-slate-700 text-center">Đăng nhập</h1>
      <input
        v-model="username"
        class="px-4 py-2 outline-none border border-slate-300 rounded-md shadow-sm"
        placeholder="Tên đăng nhập"
      />
      <input
        v-model="password"
        type="password"
        class="px-4 py-2 outline-none border border-slate-300 rounded-md shadow-sm"
        placeholder="Mật khẩu"
      />
      <Button variant="primary" size="md" @click="login">Đăng nhập</Button>
    </div>
  </div>
</template>

<script setup>
import Button from '@/components/kits/button/index.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  if (!username.value || !password.value) {
    return
  }
  const data = {
    email: username.value,
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
  console.log(token)
  if (token) {
    router.push('/')
  }
})
</script>
