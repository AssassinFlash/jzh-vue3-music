<template>
  <!--
    存在问题：该二级路由是由歌手列表点击获取歌手信息传递过来的，一刷新就没了
    解决方法：使用sessionStorage：它即使刷新页面，缓存的数据还在，只是关闭页面才没有
  -->
  <!--
    滚动效果的实现：
    1.在列表往上滚时，修改图片层级，让列表不会盖住歌手名
      因此要知道列表滚动的位置，在特定位置来修改图片层级，故要监听列表派发的滚动事件
    2.在列表向下拉时，让图片跟着列表下拉而放大，使用scale来完成
      具体放大比例为下拉坐标 / 图片高度
    3.在列表往上滚时，还有一个图片模糊的效果，通过修改图片覆盖层filter来实现
      具体为使用backdropFilter:blur(px)，模糊px根据往上拉的坐标来增加
   -->
  <div class="music-list">
    <div class="back" @click="$router.back()">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div
      class="bg-image"
      :style="bgImageStyle"
      ref="bgImage"
    >
      <div class="filter" :style="filterStyle"></div>
      <div
        class="play-btn-wrapper"
        :style="playBtnStyle"
        @click="random"
      >
        <div class="play-btn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <!--
      歌曲列表
      数据是异步获取后传过来的，所以设置v-loading也可以设置成props
    -->
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      :probe-type="3"
      @scroll="onScroll"
      v-no-result:[noResultText]="noResult"
    >
      <div class="song-list-wrapper">
        <!-- 监听歌曲列表的自定义select事件，若有派发则在回调函数中处理 -->
        <SongList :songs="songs" @select="selectItem"/>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from '../base/song-list/song-list'
import Scroll from '../base/scroll/scroll'
import { mapActions } from 'vuex'

const RESERVED_HEIGHT = 40 // 列表滚动的特定位置
export default {
  name: 'MusicList',
  components: {
    SongList,
    Scroll
  },
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    title: String,
    pic: String,
    loading: Boolean,
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲'
    }
  },
  data () {
    return {
      imageHeight: 0, // 图片高度
      scrollY: 0, // 列表滚动距离
      maxTranslateY: 0 // 列表可滚动的最大距离
    }
  },
  computed: {
    bgImageStyle () {
      const scrollY = this.scrollY
      const maxTranslateY = this.maxTranslateY
      const imageHeight = this.imageHeight
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let scale = 1
      let translateZ = 0 // 做苹果端兼容

      // 当列表滚动到最大距离时就修改图片层级，不让列表盖住图片
      // 同时要修改图片高度固定为40，因为图片是有paddingTop撑开的，会固定宽高比为10比7，会显得列表被图片给挤下去了
      if (scrollY > maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }

      // 当列表向下拉时，让图片放大
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / imageHeight)
      }

      return {
        backgroundImage: `url(${this.pic})`,
        zIndex,
        paddingTop,
        height,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    },
    scrollStyle () {
      return {
        top: `${this.imageHeight}px`
      }
    },
    filterStyle () {
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      const maxTranslateY = this.maxTranslateY
      const maxBlur = maxTranslateY / imageHeight
      let blur = 0

      // 当列表往上滚时，增加模糊px
      if (scrollY > 0) {
        blur = Math.min(maxBlur, scrollY / imageHeight) * 20
      }

      return {
        backdropFilter: `blur(${blur}px)`
      }
    },
    playBtnStyle () {
      // 当歌曲列表往上滚动到最大值时，设置随机播放按钮不可显示
      let display = ''
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none'
      }
      return {
        display: `${display}`
      }
    },
    noResult () {
      // loading结束，结果为空，返回true
      if (!this.loading && !this.songs.length) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    // 在挂载后即可通过DOM操作拿到图片高度，这样即可动态给歌曲列表添加top值，规定好滚动容器高度
    // 拿到图片高度即可知道列表可滚动的最大距离：图片高度 - 40
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
  },
  methods: {
    ...mapActions(['selectPlay', 'randomPlay']),
    // 监听滚动列表派发的滚动事件，获取到实时的滚动位置
    onScroll (pos) {
      this.scrollY = -pos.y
    },
    // 监听歌曲列表的自定义select事件，获取点击的歌曲和索引
    // 随后调用actions，给全局变量赋值
    selectItem ({
      song,
      index
    }) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    // 点击随机播放按钮
    random () {
      this.randomPlay(this.songs)
    }
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;

  .back {
    position: absolute;
    left: 6px;
    top: 0;
    z-index: 20;
    // 给苹果设备做兼容
    transform: translateZ(2px);

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    left: 10%;
    top: 0;
    width: 80%;
    line-height: 40px;
    text-align: center;
    font-size: $font-size-large;
    color: $color-text;
    @include no-wrap();
    transform: translateZ(2px);
    z-index: 20;
  }

  .bg-image {
    position: relative;
    width: 100%;
    background-size: cover;
    transform-origin: top;

    .filter {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }

    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 7px 20px;
      height: 20px;
      line-height: 20px;
      border: 1px solid $color-theme;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .play-btn {
        color: $color-theme;

        .icon-play {
          margin-right: 10px;
          vertical-align: middle;
          font-size: $font-size-large;
        }

        .text {
          font-size: $font-size-medium;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }

  // 滚动容器
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;

    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
