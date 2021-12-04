import { PLAY_MODE } from '@/assets/js/constant'

const state = {
  sequenceList: [], // 歌曲顺序列表
  playlist: [], // 歌曲播放列表
  playing: false, // 播放状态
  playMode: PLAY_MODE.sequence, // 默认顺序播放
  currentIndex: 0, // 当前播放哪首歌
  fullScreen: false, // 全屏显示还是收缩
  favoriteList: [] // 收藏歌曲列表
}
export default state
