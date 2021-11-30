// 封装通用的DOM操作
export function addClass (el, className) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export function removeClass (el, className) {
  el.classList.remove(className)
}
