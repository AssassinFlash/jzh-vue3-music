import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { PLAY_MODE } from '@/assets/js/constant'

export default function usePlay () {
  // data
  const audioRef = ref(null) // 拿到音频组件DOM
  const songReady = ref(false) // 歌曲准备状态
  const currentTime = ref(0) // 歌曲播放时长
  const progressChanging = ref(false) // 进度条是否正在被拖动

  // vuex
  const store = useStore()
  // 使用计算属性使得变量依赖于全局变量的修改而响应变化
  const fullScreen = computed(() => store.state.fullScreen) // 控制播放组件全屏显示
  const playlist = computed(() => store.state.playlist) // 歌曲播放列表
  const currentSong = computed(() => store.getters.currentSong) // 当前播放歌曲对象
  const currentIndex = computed(() => store.state.currentIndex) // 当前播放歌曲索引
  const playing = computed(() => store.state.playing) // 当前歌曲播放状态
  const playMode = computed(() => store.state.playMode) // 播放模式

  // computed
  // 当歌曲准备状态还未完毕时给播放控件添加禁止样式
  const disableCls = computed(() => {
    return songReady.value ? '' : 'disable'
  })
  // 控制播放图标是播放还是暂停的样式
  const playIcon = computed(() => {
    return playing.value ? 'icon-pause' : 'icon-play'
  })
  // 进度 = 播放时间 / 歌曲总时间
  const progress = computed(() => {
    return currentTime.value / currentSong.value.duration
  })

  // watch
  // 监听当前歌曲，若歌曲变化了就把新歌曲的url赋给音频组件，并开始播放
  watch(currentSong, (newSong) => {
    if (!newSong.id || !newSong.url) {
      return
    }
    const audioEl = audioRef.value
    songReady.value = false
    currentTime.value = 0
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

  // 歌曲播放时会更新当前播放时间
  /*
  * 存在问题：进度条正在拖动的时候，虽然修改了歌曲播放时间，但是音频组件的当前播放时间未修改
  *         而音频组件自带timeupdate派发事件，会自动调用updateTime，重新给歌曲播放时间设置成了音频组件中音乐的当前播放时间
  *         因此进度条拖动修改的歌曲播放时间会被覆盖，导致拖动后也无法修改音频当前播放时间
  * 解决思路：添加一个标记，当进度条被拖动时标记为true，拖动结束后标记更改为false
  *         在updateTime中添加判断，若该标记为true表示进度条正在拖动，拖动的过程中修改的歌曲播放时间不可被updateTime修改
  *         这样当拖动结束后，由于先触发了onProgressCHanged的事件，修改了音频组件的当前播放时间，
  *         这样再调用updateTime时就从修改后的音频当前播放时间开始重新计算
  * */
  function updateTime (e) {
    if (progressChanging.value) {
      return
    }
    currentTime.value = e.target.currentTime
  }

  // 进度条拖动过程中更改歌曲播放时间
  function onProgressChanging (progress) {
    // 监听的自定义派发事件会传来更新后的进度
    progressChanging.value = true
    currentTime.value = currentSong.value.duration * progress
  }

  // 进度条拖动结束后更改歌曲当前播放时间
  function onProgressChanged (progress) {
    currentTime.value = currentSong.value.duration * progress
    audioRef.value.currentTime = currentTime.value
    // 修改完音频组件后再把标记改为false
    progressChanging.value = false
  }

  // 当歌曲播放完成，音频组件会派发end事件，监听后在end函数做处理
  // 此时根据播放模式（顺序、随机、循环）进行歌曲的下一首播放
  function end () {
    currentTime.value = 0
    if (playMode.value === PLAY_MODE.loop) {
      loop()
    } else {
      next()
    }
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
    currentTime,
    // vuex
    fullScreen,
    playlist,
    currentSong,
    currentIndex,
    playing,
    // computed
    disableCls,
    playIcon,
    progress,
    // methods
    ready,
    updateTime,
    onProgressChanging,
    onProgressChanged,
    end,
    error,
    hideFullScreen,
    togglePlay,
    pause,
    prev,
    next
  }
}
