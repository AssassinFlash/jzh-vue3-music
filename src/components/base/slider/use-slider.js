import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { ref, onMounted, onUnmounted } from 'vue'
BScroll.use(Slide)

export default function useSlider (wrapperRef) {
  // 在mounted之后才能通过this.$refs获取滚动容器DOM对象
  const slider = ref(null)
  const currentPageIndex = ref(0)
  onMounted(() => {
    // 获取滚动对象
    slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true, // 横向滚动
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true // 滚动功能
    })
    // 监听slider的change事件，更改指示器索引值
    slider.value.on('slideWillChange', (page) => {
      // console.log(page)
      currentPageIndex.value = page.pageX
    })
  })
  // 销毁滚动对象
  onUnmounted(() => {
    slider.value.destroy()
  })
  // 返回这个滚动对象
  return {
    slider,
    currentPageIndex
  }
}
