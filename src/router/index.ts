import { createRouter, createWebHistory } from 'vue-router'
import MainPage from "@/views/MainPage.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },{
      path: '/login',
      name: 'login',
      component: Login,
      meta: {title: '登录'}
    },{
      path: '/register',
      name: 'register',
      component: Register,
      meta: {title: '注册'}
    },
  ],
})

export default router
