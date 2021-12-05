// 算法相关函数
export function shuffle (source) {
  // arr.slice()相当于重新开拓了一个内存空间复制了一个新的数组
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr

  // 向下取整随机数
  function getRandomInt (max) {
    // Math.random是取得0到1这个区间的随机数，max+1再通过Math.floor向下取整
    return Math.floor(Math.random() * (max + 1))
  }

  // 交换
  function swap (arr, i, j) {
    const t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
  }
}

// 时间格式化函数
export function formatTime (interval) {
  // 向下取整
  interval = interval | 0
  // .padStart：字符串补全，限定字符串长度为2位，不够就向前补0
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = (interval % 60 + '').padStart(2, '0')
  return `${minute}:${second}`
}
