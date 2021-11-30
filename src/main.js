import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入设置基准值包
import 'amfe-flexible'
// 引入全局样式
import './assets/scss/index.scss'
// 引入懒加载插件
import lazyPlugin from 'vue3-lazy'

createApp(App).use(store).use(router).use(lazyPlugin, {
  loading: require('./assets/images/default.png')
}).mount('#app')
