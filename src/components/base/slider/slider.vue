<template>
  <!--
    BetterScroll作用的是外层的slider容器，滚动的是里层的slider-group
    BetterScroll默认处理容器的第一个子元素，也就是处理slider-group
   -->
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <!-- 滚动内容 -->
      <div
        class="slider-page"
        v-for="item in sliders"
        :key="item.id"
      >
        <a :href="item.link">
          <img :src="item.pic" alt="" />
        </a>
      </div>
    </div>
    <!-- 指示器 -->
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item, index) in sliders"
        :key="item.id"
        :class="{ 'active' : currentPageIndex === index }"
      >
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import useSlider from './use-slider'
export default {
  name: 'Slider',
  props: {
    sliders: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup () {
    const rootRef = ref(null)
    const { currentPageIndex } = useSlider(rootRef)
    return {
      rootRef,
      currentPageIndex
    }
  }
}
</script>

<style lang="scss" scoped>
.slider {
  min-height: 1px;
  // 因为display:inline-block;行内块元素，换行会被解释成是空格，由此消除行内块元素之间的空隙
  font-size: 0;
  // 触摸输入触发默认行为
  touch-action: pan-y;

  .slider-group {
    // BetterScroll 实现横向滚动，要保证滚动容器不换行，并且滚动内容的display是inline-block
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-page {
      display: inline-block;
      transform: translate3d(0,0,0);
      backface-visibility: hidden;

      a {
        display: block;
        width: 100%;

        img {
          display: block;
          width: 100%;
        }
      }
    }
  }

  .dots-wrapper {
    position: absolute;
    left: 50%;
    bottom: 12px;
    transform: translateX(-50%);
    line-height: 12px;

    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin: 0 4px;
      background: $color-text-l;
      transition: all .1s ease;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
