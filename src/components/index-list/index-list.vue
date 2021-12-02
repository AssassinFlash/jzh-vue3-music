<template>
  <!-- 滚动容器 为了监听滚动坐标，需要设置probeType=3 且监听自定义派发事件 -->
  <scroll
    class="index-list"
    ref="scrollRef"
    :probe-type="3"
    @scroll="onScroll"
  >
    <!-- 滚动内容 -->
    <ul ref="groupRef">
      <li
        class="group"
        v-for="group in data"
        :key="group.title"
      >
        <!-- 分类标题 -->
        <h2 class="title">{{ group.title }}</h2>
        <!-- 分类列表 -->
        <ul>
          <li
            class="item"
            v-for="item in group.list"
            :key="item.id"
            @click="onItemClick(item)"
          >
            <img class="avatar" v-lazy="item.pic" alt="">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--
      分类标题在滚动过程中固定
      实现思路：分类列表有一个区间，监听滚动时的Y值，看Y落到哪个区间
              然后把该区间对应分类列表的标题赋值给固定div
    -->
    <div class="fixed" :style="fixedStyle" v-show="fixedTitle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <!--
      分类标题导航
      绑定自定义属性data-index为index即可让touch事件的event对象通过event.target拿到index对应的li
      监听触摸开始事件，回调做处理
      监听触摸移动事件，回调做处理
     -->
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          class="item"
          v-for="(item,index) in shortcutList"
          :key="index"
          :data-index="index"
          :class="{ 'current' : currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from '../base/scroll/scroll'
import useFixed from './use-fixed'
import useShortCut from '@/components/index-list/use-shortcut'

export default {
  name: 'IndexList',
  components: {
    Scroll
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  emit: ['select'],
  setup (props, { emit }) {
    const onItemClick = function (item) {
      // 派发自定义事件
      emit('select', item)
    }

    const {
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle,
      currentIndex
    } = useFixed(props)

    const {
      shortcutList,
      onShortcutTouchStart,
      scrollRef,
      onShortcutTouchMove
    } = useShortCut(props, groupRef)
    return {
      onItemClick,
      // fixed
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle,
      currentIndex,
      // shortcut
      shortcutList,
      onShortcutTouchStart,
      scrollRef,
      onShortcutTouchMove
    }
  }
}
</script>

<style lang="scss" scoped>
.index-list {
  // 规定好滚动容器的高度，这样滚动内容大于滚动容器高度时才能产生滚动
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .group {
    padding-bottom: 30px;

    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }
}
</style>
