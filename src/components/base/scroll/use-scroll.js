import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted } from 'vue'
// ObserveDOM专门用来解决数据异步获取DOM元素没有更新的问题
// 由于数据异步获取速度较慢，DOM元素计算完有可能是高度为0，这会导致滚动失效
// ObserveDOM观察到数据更新后重新计算DOM，也就是执行refresh方法
// 这样DOM的高度就一定是内容的高度，就可产生滚动
BScroll.use(ObserveDOM)
// 组件传来的DOM元素和相关配置参数
export default function useScroll (wrapperRef, options) {
  // 同样是在mounted钩子中获取滚动的DOM元素
  const scroll = ref(null)
  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
  })
  onUnmounted(() => {
    scroll.value.destroy()
  })
}
