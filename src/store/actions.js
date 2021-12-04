// 当点击歌曲列表时，就相当于是给播放器添加了一个歌曲列表，选择了某个歌曲
// 在vuex中，actions就相当于是mutations的一层封装
import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

// actions的第一个参数是content，第二个参数是payload
// 点击播放
export function selectPlay ({
  commit
}, {
  list,
  index
}) {
  commit('setPlayMode', PLAY_MODE.sequence) // 设置为顺序播放
  commit('setSequenceList', list) // 添加歌曲顺序列表
  commit('setPlayingState', true) // 设置播放状态为true
  commit('setFullscreen', true) // 设置播放组件全屏显示
  commit('setPlaylist', list) // 由于是顺序播放，所以播放列表和歌曲顺序列表一致
  commit('setCurrentIndex', index) // 获取当前播放歌曲的索引
}

// 点击随机播放，更改为随机播放，打乱歌曲播放列表
export function randomPlay ({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullscreen', true)
  commit('setPlaylist', shuffle(list))
  commit('setCurrentIndex', 0) // 直接播放随机播放列表的第一首歌曲
}

// 切换播放模式，如果是随机播放模式就把歌曲顺序列表打乱再赋给歌曲播放列表
// 由于当前播放歌曲是依赖于歌曲播放列表计算而来的，
// 因此更改了播放模式就会更改歌曲播放列表，因此更改了当前播放歌曲
// 理想的方式是更改了播放模式且不会更改当前播放歌曲
// 解决方法是更改模式之前先拿到当前播放歌曲，然后找到打乱后的歌曲播放列表中这个歌曲的索引，这样歌曲就不会改变了
export function changeMode ({
  commit,
  state,
  getters
}, mode) {
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }
  const index = state.playlist.findIndex(song => {
    return song.id === currentId
  })
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}
