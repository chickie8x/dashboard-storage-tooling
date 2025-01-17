import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue'),
    },

    {
      path: '/session/:id',
      name: 'detail',
      component: () => import('../views/detail/index.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/auth/index.vue'),
    },
    {
      path: '/tracking',
      name: 'tracking',
      component: () => import('../views/tracking/index.vue'),
    },
  ],
})

export default router
