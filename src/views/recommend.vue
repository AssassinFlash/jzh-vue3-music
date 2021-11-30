<template>
  <div class="recommend">
    <!--
      由于Better-Scroll只作用父元素的第一个子元素，scroll组件已经默认渲染了一个div作为父元素，
      且scroll组件使用了插槽的方式，所以要明确哪些是要滚动的内容，将滚动的内容传给scroll组件
      给scroll组件加样式就相当于给scroll组件默认渲染的div(滚动容器)加样式
     -->
    <scroll class="recommend-content" v-loading="loading">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <Slider v-if="sliders.length" :sliders="sliders"/>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in albums" :key="item.id">
              <div class="icon">
                <img v-lazy="item.pic" width="60" height="60" alt=""/>
              </div>
              <div class="text">
                <h2 class="name">{{ item.username }}</h2>
                <p class="title">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend'
import Slider from '@/components/base/slider/slider'
import Scroll from '@/components/base/scroll/scroll'

export default {
  name: 'RecommendIndex',
  components: {
    Slider,
    Scroll
  },
  data () {
    return {
      sliders: [],
      albums: []
    }
  },
  computed: {
    // 通过计算属性动态改变loading值，从而动态插入删除loading组件
    loading () {
      return !this.sliders.length && !this.albums.length
    }
  },
  // 获取轮播图
  async created () {
    const result = await getRecommend()
    console.log(result)
    this.sliders = result.sliders
    this.albums = result.albums
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    // 规定好容器的高度，这样滚动内容大于容器高度即可产生滚动
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      // 当宽度设置为100%后，想让高度为宽度的指定比例的值
      // 把高度设置为指定宽度的40%了，这个比例可以根据轮播图的实际高宽比来设置
      height: 0;
      padding-top: 40%;
      overflow: hidden;

      .slider-content {
        // 定好滚动容器的大小，因为better-scroll的滚动原理就是滚动内容大于滚动容器才产生滚动
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          width: 60px;
          margin-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            @include no-wrap();
            margin-bottom: 10px;
            color: $color-text;
          }

          .title {
            @include no-wrap();
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>
