const mutations = {
  setPlayingState (state, playing) {
    state.playing = playing
  },
  setSequenceList (state, sequenceList) {
    state.sequenceList = sequenceList
  },
  setPlaylist (state, playlist) {
    state.playlist = playlist
  },
  setPlayMode (state, mode) {
    state.playMode = mode
  },
  setCurrentIndex (state, index) {
    state.currentIndex = index
  },
  setFullscreen (state, fullScreen) {
    state.fullScreen = fullScreen
  },
  setFavoriteList (state, list) {
    state.favoriteList = list
  },
  addSongLyric (state, {
    song,
    lyric
  }) {
    state.sequenceList.map(item => {
      // 在顺序列表中找到这首歌，赋值歌词
      if (item.mid === song.mid) {
        item.lyric = lyric
      }
      return item
    })
  }
}
export default mutations
