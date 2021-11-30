import { get } from './base.js'

export function getSingerList () {
  return get('/api/getSingerList')
}
