// 顺序播放、随机播放这两种模式的切换
import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

export default function useMode () {
  // vuex
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  // computed
  // 模式图标切换
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    if (playModeVal === PLAY_MODE.sequence) {
      return 'icon-sequence'
    } else if (playModeVal === PLAY_MODE.random) {
      return 'icon-random'
    } else {
      return 'icon-loop'
    }
  })

  const modeText = computed(() => {
    const playModeVal = playMode.value
    if (playModeVal === PLAY_MODE.sequence) {
      return '顺序播放'
    } else if (playModeVal === PLAY_MODE.random) {
      return '随机播放'
    } else {
      return '单曲循环'
    }
  })

  // methods
  // 切换播放模式
  async function changeMode () {
    const mode = (playMode.value + 1) % 3
    await store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    changeMode,
    modeText
  }
}
