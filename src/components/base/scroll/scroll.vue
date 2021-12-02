<template>
  <!-- 外层可作为滚动内容的父元素，因为Better-Scroll是作用于父元素的第一个子元素的 -->
  <div ref="rootRef">
    <!-- scroll组件，同样适用了Better-Scroll插件，滚动的内容部分直接塞进插槽 -->
    <slot></slot>
  </div>
</template>

<script>
import { ref } from 'vue'
import useScroll from './use-scroll'

export default {
  name: 'scroll',
  // 默认列表是不能点击的，但是作为封装的组件，应该是要能接收组件传来的配置参数进行配置
  props: {
    // 是否可以点击列表
    click: {
      type: Boolean,
      default: true
    },
    // 为0不会派发scroll事件，为3则可派发scroll，从而监听滚动坐标值
    probeType: {
      type: Number,
      default: 0
    }
  },
  // 自定义派发事件
  emits: ['scroll'],
  setup (props, { emit }) {
    const rootRef = ref(null)
    const scroll = useScroll(rootRef, props, emit)
    return {
      rootRef,
      scroll
    }
  }
}
</script>
