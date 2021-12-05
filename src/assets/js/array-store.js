// 封装存储数组到本地存储的逻辑
import storage from 'good-storage'

// 保存数组到本地存储
// 判断新传来的歌曲是否在歌曲收藏数组中，判断逻辑封装成insertArray函数
// compare比较逻辑是自定义函数，比如：
// arr.findIndex(x=>{return x.id === song.id})这个findIndex括号里的都是比较逻辑
// 因此compare函数已经包含了传来的歌曲信息，就无需再传
export function save (item, key, compare, maxLen) {
  const itemArr = storage.get(key, []) // 默认为空数组
  insertArray(itemArr, item, compare, maxLen)
  storage.set(key, itemArr)
  return itemArr
}

export function remove (key, compare) {
  const itemArr = storage.get(key, [])
  deleteFromArray(itemArr, compare)
  storage.set(key, itemArr)
  return itemArr
}

// 从本地加载数组
export function load (key) {
  return storage.get(key, [])
}

function insertArray (arr, item, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    return
  }
  arr.unshift(item)
  // 超出了最大长度限制就把数组第一个元素删掉
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (itemArr, compare) {
  const index = itemArr.findIndex(compare)
  if (index > -1) {
    itemArr.splice(index, 1)
  }
}
