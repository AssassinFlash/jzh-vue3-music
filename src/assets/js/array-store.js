// 存储数组到localStorage的封装
import storage from 'good-storage'

export function save (item, key, compare, maxLen) {
  // 首先从localStorage中取出收藏歌曲数组，若没有就默认空数组
  const items = storage.get(key, [])
  // 把新加入收藏的歌曲加入到收藏歌曲数组中
  // 判断：如果新传来的歌曲已经在收藏歌曲数组中，就不需要再插入了
  insertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export function remove (key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

// 封装判断逻辑的函数，传过来比较的逻辑，进行数组插入
// 比较逻辑中已经包含了新传来的歌曲的数据，所以不需要额外传
function insertArray (arr, val, compare, maxLen) {
  // 查找收藏歌曲数组中是否已存在新传来的歌曲
  const index = arr.findIndex(compare)
  if (index > -1) {
    return
  }
  // 数组传参，对数组进行修改是对原数组进行了修改，所以不用返回数组
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 封装判断逻辑，传过来比较的逻辑，进行数组删除
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
