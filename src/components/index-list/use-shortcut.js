import { ref, computed } from 'vue'

export default function useShortCut (props, groupRef) {
  const ANCHOR_HEIGHT = 18
  // 拿到滚动对象DOM，并且由scroll组件返回了scroll对象，即可通过滚动对象DOM访问到scroll对象
  const scrollRef = ref(null)
  // 分类标题导航数组
  const shortcutList = computed(() => {
    return props.data.map(group => {
      return group.title
    })
  })

  const touch = {}

  // 由于前面绑定了data-index，即可通过e.target.dataset拿到index
  // 然后通过这个index拿到对应的分类标题的DOM，
  // 最后通过scrollToElement让滚动对象滚动到这个分类标题中，实现分类标题导航
  function onShortcutTouchStart (e) {
    // 拿到点击的li对应的索引
    const anchorIndex = parseInt(e.target.dataset.index)
    // 记录该点纵坐标作为起点
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }

  // 当手指移动时，监听滚动的纵坐标
  // 纵坐标和开始记录的纵坐标的差 / 单位分类标题的高度 = 偏移了多少个分类标题
  // 最后拿初始索引值 + 偏移标题数 = 应该偏移到的位置
  function onShortcutTouchMove (e) {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    // 拿到目标索引
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  function scrollTo (index) {
    // 确保index在分类标题之间
    if (isNaN(index)) return
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    // 拿到li的DOM
    const targetEl = groupRef.value.children[index]
    // 访问scroll组件拿到scroll滚动对象，进行滚动
    scrollRef.value.scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
