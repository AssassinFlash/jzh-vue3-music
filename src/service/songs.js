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
