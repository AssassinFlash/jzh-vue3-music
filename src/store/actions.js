// 当点击歌曲列表时，就相当于是给播放器添加了一个歌曲列表，选择了某个歌曲
// 在vuex中，actions就相当于是mutations的一层封装
import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

// actions的第一个参数是content，第二个参数是payload
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
