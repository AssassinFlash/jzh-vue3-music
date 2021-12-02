// 自定义指令loading，通过指令对DOM进行操作，一般是添加、删除
// 通过指令loading 动态(判断loading值是true还是false)插入实例到被指令绑定的DOM对象上
// 插入的实例就是loading组件
// 为了让loading组件变成实例，首先要先将它挂载，这个方法是通过 createApp 来实现的
// import { createApp } from 'vue'
// import Loading from './loading'
// import { addClass, removeClass } from '@/assets/js/dom'
//
// const relativeCls = 'g-relative'
//
// const loadingDirective = {
//   // 被指令绑定的元素挂载到DOM时
//   /*
//   * 指令钩子的默认参数：
//   * el：被指令所绑定的元素，可用于直接操作DOM
//   * binding：包含以下property属性：
//   *   instance：使用指令的组件实例
//   *   value：传递给指令的值
//   *   oldValue：先前传递给指令的值，仅在updated中可使用，表示传递值的更改
//   *   arg：传递给指令的参数
//   * */
//   mounted (el, binding) {
//     const app = createApp(Loading)
//     // 通过挂载到一个div中，拿到loading组件的实例
//     // 这个挂载操作由于是没有挂载到body中，而是动态创建一个div供挂载的，
//     // 因此这个操作只是为了能拿到loading组件实例，并没有改变实际上的挂载树
//     // 拿到这个loading实例，就能将这个实例挂载到被指令绑定的DOM上，实现动态插入Loading组件
//     // 同时为了方便函数操作，直接让实例赋予被指令绑定的DOM对象的instance属性
//     el.instance = app.mount(document.createElement('div'))
//     const title = binding.arg
//     if (typeof title !== 'undefined') {
//       el.instance.setTitle(title)
//     }
//     if (binding.value) {
//       append(el)
//     }
//   },
//   // 当传给指令的值发生变化
//   updated (el, binding) {
//     const title = binding.arg
//     if (title !== undefined) {
//       el.instance.setTitle(title)
//     }
//     if (binding.value !== binding.oldValue) {
//       binding.value ? append(el) : remove(el)
//     }
//   }
// }
//
// function append (el) {
//   // 将实例挂载到el中
//   // 确保被指令绑定的DOM对象是具有定位的，这样loading组件的绝对定位才能发挥作用
//   // 获取样式可通过window.getComputedStyle方法
//   const style = getComputedStyle(el)
//   if (!['absolute', 'fixed', 'relative'].includes(style.position)) {
//     addClass(el, relativeCls)
//   }
//   el.appendChild(el.instance.$el)
// }
//
// function remove (el) {
//   removeClass(el, relativeCls)
//   el.removeChild(el.instance.$el)
// }

import Loading from './loading'
import createDirective
from '@/assets/js/create-directive'

const loadingDirective = createDirective(Loading)
export default loadingDirective
