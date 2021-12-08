import { get } from './base'

export function processSongs (songs) {
  if (!songs.length) {
    // 这里因为axios返回值是个Promise，所以即使歌曲列表为空也要返回resolve
    return Promise.resolve(songs)
  }
  return get('/api/getSongsUrl', {
    mid: songs.map(song => {
      return song.mid
    })
  }).then(result => {
    const map = result.map
    return songs.map(song => {
      song.url = map[song.mid]
      return song
    }).filter(song => {
      return song.url.indexOf('vkey') > -1
    })
  })
}

// 获取歌词
// 有时候有些歌曲可能本身还未做修改，但是它已经有歌词了，这时候再添加一个lyricMap的key,value值
// key就是歌曲mid，value就是歌词，保证能确定这首歌是否有歌词
const lyricMap = {}

export function getLyric (song) {
  // 若歌曲有歌词了，就不发送请求，直接返回原歌曲的歌词
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', {
    mid
  }).then(result => {
    // 有可能歌词为空，因此要做判断
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
