// 播放组件中间CD旋转层的逻辑
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd () {
  // data
  // 拿到包裹cd图片的div的DOM和cd图片的DOM
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  // vuex
  const store = useStore()
  const playing = computed(() => store.state.playing) // 拿到playing状态

  // computed
  // 根据playing状态决定CD旋转样式
  /*
  * 存在问题：当暂停播放时CD旋转角度会重置为0
  * 解决思路：记录CD旋转的角度，让外层包裹图片的div也跟着旋转同样的角度
  *         这样旋转角度重置为0也是相对于外层的div而言的，类似于相对运动
  *         需要注意的是，当再次暂停后，由于外层div已经旋转了一定的角度，设为y
  *         而cd旋转是相对于外层div再次从0计算的，假设第三次暂停cd旋转了x，
  *         因此再次赋值给外层div的时候由于是直接重新赋值，如果只赋值x，那外层div就丢失了y角度，导致图片又回退了一点
  *         所以再次赋值给外层div的时候需要赋的值应该是 x + y
  * */
  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  // watch
  // 监听播放状态变化，播放状态为暂停时就让外层div旋转
  watch(playing, newPlaying => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  // methods
  // 两个DOM同步旋转角度
  function syncTransform (wrapper, inner) {
    const innerTransform = window.getComputedStyle(inner).transform
    console.log(innerTransform)
    const wrapperTransform = window.getComputedStyle(wrapper).transform
    // 判断是否一开始，因为一开始的时候外层div没有旋转值
    if (wrapperTransform === 'none') {
      wrapper.style.transform = innerTransform
    } else {
      wrapper.style.transform = wrapperTransform + innerTransform
    }
  }

  return {
    // data
    cdRef,
    cdImageRef,
    // computed
    cdCls
  }
}
