import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider () {
  // data
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  // vuex
  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playlist = computed(() => store.state.playlist)
  const currentIndex = computed(() => store.state.currentIndex)

  const sliderShow = computed(() => {
    return !fullScreen.value && playlist.value.length > 0
  })

  onMounted(() => {
    let sliderVal
    watch(sliderShow, async newSliderShow => {
      // 当全屏状态为false和歌曲列表>0时，初始化slider插件
      // 同样的，数据获取到DOM更新之间隔了一个nextTick
      await nextTick()
      if (newSliderShow) {
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          // 监听歌曲切换，拿到新的索引并更新新的索引，从而与歌曲列表联动，改变歌曲
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
            store.commit('setPlayingState', true)
          })
        }
      } else {
        sliderVal.refresh()
      }
      // 横向滚动到对应索引的page
      sliderVal.goToPage(currentIndex.value, 0, 0)
    })

    watch(currentIndex, newIndex => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return {
    sliderWrapperRef,
    slider
  }
}
