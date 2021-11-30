import { ref, watch, nextTick, computed } from 'vue'
/*
* 实现思路：
*   1.首先拿到所有分类列表，把每个分类列表的高度算出来，记录到高度数组中
*   2.监听自定义滚动事件，出现派发则通过回调函数获取滚动值，判断当前滚动值处于哪个高度区间，
*     高度区间的i值即当前分类列表的索引值，若当前滚动值处于某区间，即可通过i值得到当前高度区间对应的分类列表
*   3.找到这个分类列表，把这个分类列表的title赋值给固定标题
* */
export default function useFixed (props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)
  const listHeights = ref([]) // 高度数组，记录每个分类列表的高度
  const scrollY = ref(0) // 滚动值
  const currentIndex = ref(0) // 分类列表的索引
  const distance = ref(0)
  // 拿到分类列表的索引，就可以根据这个索引找到该分类列表，把这个分类列表的title赋值给固定标题
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translateY(${diff}px)`
    }
  })

  // 求解分类列表的高度
  // 首先拿到所有分类列表的DOM
  // 然后把每个分类列表的高度算出来，push到一个高度数组中
  // 这个获取高度的方法是.clientHeight
  // 调用这个函数的时机是数据获取到之后，因此要用watch观测数据发生变化
  // 但是数据获取是异步的，获取数据的同时有可能DOM已经渲染完毕，因此要在DOM重新计算的时候进行调用函数
  // 这样获取DOM的高度就一定没有问题了
  function calculate () {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    // 初始高度数组的高度为0，这是因为第一个标题就在高度为0处
    let height = 0
    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  // 监听数据获取，调用高度计算函数
  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })

  // 监听scroll组件的自定义派发事件scroll，出现派发则调用回调函数onScroll，获取滚动值
  function onScroll (pos) {
    scrollY.value = -pos.y
  }

  // 监听滚动值的变化，判断当前滚动值处于高度数组的哪个区间
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      // 获取高度区间（底部减顶部）
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      // 当前滚动值落在这个区间内，当前i值就是这个分类列表的索引
      // 把i值赋值给分类列表索引，表示找到了当前滚动值处于哪个分类列表中
      if (newY >= heightTop && newY < heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle
  }
}
