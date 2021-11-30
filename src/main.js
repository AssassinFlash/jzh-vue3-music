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
// 引入自定义的loadingDirective自定义指令loading
import loadingDirective from '@/components/base/loading/directive'

createApp(App).use(store).use(router).use(lazyPlugin, {
  loading: require('./assets/images/default.png')
}).directive('loading', loadingDirective).mount('#app')
