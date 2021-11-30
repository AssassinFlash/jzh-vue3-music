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
    click: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const rootRef = ref(null)
    useScroll(rootRef, props)
    return {
      rootRef
    }
  }
}
</script>
