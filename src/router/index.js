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
    component: () => import('../views/singer.vue'),
    children: [
      {
        path: ':id', // 动态参数，路由跳转使用params传参
        name: 'SingerDetail',
        component: () => import('@/views/singer-detail')
      }
    ]
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
