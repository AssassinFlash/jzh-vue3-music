// 把创建自定义指令抽象出来，通过传入不同的组件就能创建不同的指令
import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'
// 传入组件
export default function createDirective (Comp) {
  // 返回的是处理逻辑
  return {
    mounted (el, binding) {
      // 1.使用createApp把组件挂载到动态创建的div上，获取组件实例
      // 2.将组件实例挂载到被指令绑定的DOM对象上
      // 3.根据指令传来的值的变化判断是挂载组件实例还是删除组件实例
      const app = createApp(Comp)
      const instance = app.mount(document.createElement('div'))
      /*
      * 存在问题：如果loading指令和noResult指令都绑定到同一个DOM上，那么el.instance指令的指向会指向最后的那个指令
      *         举个例子，比如loading先绑，noResult后绑，那么el.instance就指向noResult实例
      *         此时如果数据获取完毕想要删除loading实例，就因为el.instance指向问题而无法删除loading实例了
      * 解决方法：给el.instance多指向一个属性name，这个name为组件名，通过name找到不同的实例即可做删除处理了
      * */
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance

      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }

      if (binding.value) {
        append(el)
      }
    },
    updated (el, binding) {
      const name = Comp.name
      if (binding.value !== binding.oldValue) {
        if (binding.value) {
          const title = binding.arg
          if (typeof title !== 'undefined') {
            el[name].instance.setTitle(title)
          }
          append(el)
        } else {
          remove(el)
        }
      }
    }
  }

  function append (el) {
    const name = Comp.name
    const style = window.getComputedStyle(el)
    if (!['relative', 'absolute', 'fixed'].includes(style.position)) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }

  function remove (el) {
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
