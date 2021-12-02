// 通过播放列表和当前播放索引得到当前播放歌曲
const currentSong = state => {
  return state.playlist[state.currentIndex] || {}
}
export { currentSong }
