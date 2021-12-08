// 切换cd层和歌词层的实现逻辑
import { ref } from 'vue'

export default function useMiddleInteractive () {
  // data
  const currentShow = ref('cd') // 当前显示层
  const middleLStyle = ref(null) // 拿到cd和歌词层的DOM
  const middleRStyle = ref(null)
  const touch = {} // 手指按下对象，用于记录坐标
  let currentView = 'cd'

  // methods
  function onMiddleTouchStart (e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }

  function onMiddleTouchMove (e) {
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }
    if (touch.directionLocked === 'v') {
      return
    }

    const left = currentView === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.min(0, Math.max(left + deltaX, -window.innerWidth))
    touch.percent = Math.abs(offsetWidth / window.innerWidth)
    if (currentView === 'cd') {
      // 偏移百分比超过20%
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }
    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms'
    }
    middleRStyle.value = {
      transform: `translateX(${offsetWidth}px)`,
      transitionDuration: '0ms'
    }
  }

  function onMiddleTouchEnd (e) {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }
    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translateX(${offsetWidth}px)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    // data
    middleLStyle,
    middleRStyle,
    currentShow,
    // methods
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
