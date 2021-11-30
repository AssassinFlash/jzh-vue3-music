import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('../views/recommend.vue')
  },
  {
    path: '/singer',
    name: 'Singer',
    component: () => import('../views/singer.vue')
  },
  {
    path: '/top-list',
    name: 'TopList',
    component: () => import('../views/top-list.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/search.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
