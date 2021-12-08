import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { getLyric } from '@/service/songs'
import Lyric from 'lyric-parser'

export default function useLyric ({
  songReady,
  currentTime
}) {
  // data
  const currentLyric = ref(null) // 歌词封装
  const currentLineNum = ref(0) // 当前歌词行号
  const lyricScrollRef = ref(null) // 拿到滚动组件DOM
  const lyricListRef = ref(null)
  const pureMusicLyric = ref('') // 歌词为纯音乐
  const playingLyric = ref('') // cd层下面正在播放的歌词

  // vuex
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  // watch
  // 监听当前歌曲的变化，包括一开始传进来，一变化就调用歌词接口获取这首歌的歌词
  // 拿到歌词后就将歌词缓存到歌曲中，并在之后判断歌曲是否已存在歌词，这样可以减少每次切换都要发送歌词请求的次数
  /*
  * 存在问题：不止有一个发送请求的异步过程
  *         在音频组件准备歌曲的时候，songReady从false变成true这段时间也是一个异步过程
  *         这会导致由于歌曲未准备好而下面获取当前歌曲等的逻辑无法执行，导致歌词播放会出现一些bug
  * 解决思路：引入songReady，判断songReady之后才开始播放歌词
  * */
  watch(currentSong, async newSong => {
    if (!newSong.url || !newSong.id) {
      return
    }
    // 切换歌曲的时候要对缓存的歌词变量做清空
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = null
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })
    // 由于请求歌词是异步的，万一切换歌曲速度过快，还没拿到歌词就切到下一首歌了
    // 这时候其实获取歌词之后进行的操作也不必要再去执行了，这时候首要工作是要再去获取新歌曲的歌词
    if (currentSong.value.lyric !== lyric) {
      return
    }
    // 通过Lyric插件对歌词进行封装，变成lyric对象，其中有lines数组
    currentLyric.value = new Lyric(lyric, handleLyric)
    // 如果有歌词
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  // methods
  // 每一行歌词走完切换都会自动调用handleLyric，可拿到当前行歌词的行号
  // 拿到滚动容器DOM和滚动内容DOM，拿到滚动对象，实现根据歌词滚动到中间
  function handleLyric ({
    lineNum,
    txt
  }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    // 如果没有歌词列表，就没有必要同步滚动
    if (!listEl) {
      return
    }
    if (lineNum > 5) {
      // 拿到第一行的歌词位置DOM，让滚动对象向上滚动这个lineEl的高度
      const lineEl = listEl.children[lineNum - 5]
      console.log(lineEl)
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  // 播放歌词
  /*
  * 存在问题：当歌曲暂停时歌词并没有暂停，这是前面调整了之后，让歌曲songReady为true了才开始播放歌词
  *         歌词和歌曲播放之间并没有产生联动
  * 解决思路：当歌曲暂停的时候，歌词也要相应的去暂停
  * */
  function playLyric () {
    const currentLyricVal = currentLyric.value
    // 通过Lyric插件封装后的lyric对象具有.seek()方法，它的参数是时间偏移量
    // 也就是说传入当前播放时间，.seek就会找到这个时间对应的歌词line
    // 所以需要引入当前播放时间，然后，currentLyric对象就会根据时间来播放歌词
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  // 暂停歌词
  function stopLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      // 通过Lyric第三方插件的封装之后，currentLyric对象具有stop方法
      // 调用这个方法后，currentLyric对象不会再继续根据时间来找到歌词进行滚动
      currentLyricVal.stop()
    }
  }

  return {
    // data
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    pureMusicLyric,
    playingLyric,
    // methods
    playLyric,
    stopLyric
  }
}
