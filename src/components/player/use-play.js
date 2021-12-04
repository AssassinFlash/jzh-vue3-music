import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default function usePlay () {
  // data
  const audioRef = ref(null) // 拿到音频组件DOM
  const songReady = ref(false) // 歌曲准备状态

  // vuex
  const store = useStore()
  // 使用计算属性使得变量依赖于全局变量的修改而响应变化
  const fullScreen = computed(() => store.state.fullScreen) // 控制播放组件全屏显示
  const playlist = computed(() => store.state.playlist) // 歌曲播放列表
  const currentSong = computed(() => store.getters.currentSong) // 当前播放歌曲对象
  const currentIndex = computed(() => store.state.currentIndex) // 当前播放歌曲索引
  const playing = computed(() => store.state.playing) // 当前歌曲播放状态

  // computed
  // 当歌曲准备状态还未完毕时给播放控件添加禁止样式
  const disableCls = computed(() => {
    return songReady.value ? '' : 'disable'
  })
  // 控制播放图标是播放还是暂停的样式
  const playIcon = computed(() => {
    return playing.value ? 'icon-pause' : 'icon-play'
  })

  // watch
  // 监听当前歌曲，若歌曲变化了就把新歌曲的url赋给音频组件，并开始播放
  watch(currentSong, (newSong) => {
    if (!newSong.id || !newSong.url) {
      return
    }
    const audioEl = audioRef.value
    songReady.value = false
    audioEl.src = newSong.url
    audioEl.play()
    store.commit('setPlayingState', true)
  })
  // 监听播放状态，与音频组件做联动，实现当播放状态变化时音频的播放暂停方法就会调用
  watch(playing, (newPlaying) => {
    if (!songReady.value) {
      return
    }
    const audioEl = audioRef.value
    if (newPlaying) {
      audioEl.play()
    } else {
      audioEl.pause()
    }
  })

  // methods
  // 当歌曲准备好之后会自动派发canplay事件，监听这个事件的回调函数做处理
  function ready () {
    if (songReady.value) {
      return
    }
    songReady.value = true
  }

  // 当歌曲本身有问题(url失效等)，要保证其他根据歌曲状态判断的逻辑能够正常进行
  function error () {
    songReady.value = true
  }

  // 点击收缩按钮
  function hideFullScreen () {
    store.commit('setFullscreen', false)
  }

  // 点击播放按钮
  function togglePlay () {
    if (songReady.value) {
      store.commit('setPlayingState', !playing.value)
    }
  }

  // 点击暂停按钮
  function pause () {
    store.commit('setPlayingState', false)
  }

  // 点击上一首按钮
  function prev () {
    const list = playlist.value
    if (songReady.value && list.length) {
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
      }
    }
  }

  // 点击下一首按钮
  function next () {
    const list = playlist.value
    if (songReady.value && list.length) {
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        if (index === list.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
      }
    }
  }

  // 循环播放
  function loop () {
    const audioEl = audioRef.value
    audioEl.currentTime = 0
    audioEl.play()
    store.commit('setPlayingState', true)
  }

  return {
    // data
    audioRef,
    songReady,
    // vuex
    fullScreen,
    playlist,
    currentSong,
    currentIndex,
    playing,
    // computed
    disableCls,
    playIcon,
    // methods
    ready,
    error,
    hideFullScreen,
    togglePlay,
    pause,
    prev,
    next
  }
}
