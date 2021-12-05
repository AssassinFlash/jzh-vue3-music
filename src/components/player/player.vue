<template>
  <!--
    播放组件，它应当在任意地方都能打开，因此把它放到App.vue中
    通过全局变量fullScreen控制播放组件是否显示
   -->
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" alt="">
      </div>
      <div class="top">
        <div class="back" @click="hideFullScreen">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <!-- 监听进度条拖动的派发事件，回调修改歌曲播放进度 -->
            <progress-bar
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            />
          </div>
          <span class="time time-r">
            {{ formatTime(currentSong.duration) }}
          </span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon"/>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i
              @click="prev"
              class="icon-prev"
            />
          </div>
          <div class="icon i-center" :class="disableCls">
            <i
              @click="togglePlay"
              :class="playIcon"
            />
          </div>
          <div class="icon i-right" :class="disableCls">
            <i
              @click="next"
              class="icon-next"
            />
          </div>
          <div class="icon i-right">
            <i
              :class="getFavoriteIcon(currentSong)"
              @click="toggleFavorite(currentSong)"
            />
          </div>
        </div>
      </div>
    </div>
    <!--
      音频组件自带pause自定义事件，监听它然后更改播放状态
      音频组件还自带了缓冲播放时间canplay，在存在问题"快速点击切换歌曲"时会报错
      原因是更换src到播放这一段时间音频组件需要有一个缓冲的过程，
      因此监听canplay事件，等到歌曲准备好了才能开始播放，这样就不会报错了
      音频组件还自带了Url播放错误的自定义事件error，这里也要监听，以防Url出错，歌曲准备状态一直为false，就会无法切换
      音频组件自带了timeupdate自定义事件，它会不断更新歌曲当前播放时间
      音频组件自带了ended自定义事件，当歌曲播放事件走完就会派发
     -->
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    />
  </div>
</template>

<script>
import usePlay from './use-play'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import ProgressBar from './progress-bar.vue'
import { formatTime } from '@/assets/js/util'

export default {
  name: 'Player',
  components: {
    ProgressBar
  },
  setup () {
    // hooks
    const {
      // data
      audioRef,
      songReady,
      currentTime,
      // vuex
      fullScreen,
      playlist,
      currentSong,
      currentIndex,
      playing,
      // computed
      disableCls,
      playIcon,
      progress,
      // methods
      ready,
      updateTime,
      onProgressChanging,
      onProgressChanged,
      end,
      error,
      hideFullScreen,
      togglePlay,
      pause,
      prev,
      next
    } = usePlay()

    const {
      modeIcon,
      changeMode
    } = useMode()

    const {
      getFavoriteIcon,
      toggleFavorite
    } = useFavorite()
    return {
      // data
      audioRef,
      songReady,
      currentTime,
      // vuex
      fullScreen,
      playlist,
      currentSong,
      currentIndex,
      playing,
      // computed
      disableCls,
      playIcon,
      progress,
      modeIcon,
      // methods
      ready,
      updateTime,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      end,
      error,
      hideFullScreen,
      togglePlay,
      pause,
      prev,
      next,
      changeMode,
      getFavoriteIcon,
      toggleFavorite
    }
  }
}
</script>

<style lang="scss" scoped>
// 全屏覆盖
.player {
  .normal-player {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: $color-background;
    z-index: 150;
    // 背景图片全屏覆盖
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    // 标题栏
    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        left: 6px;
        top: 0;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 10px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg)
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text-ll;
      }
    }

    // 底部播放操作栏
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 85%;
        margin: 0 auto;
        padding: 10px 0;

        .time {
          // flex: flex-grow | flex-shrink | flex-basis
          // flex-grow: 这个属性规定了 flex-grow 项在 flex 容器中分配剩余空间的相对比例;
          // flex-shrink: 指定了 flex 元素的收缩规则，收缩大小根据收缩因子的值
          // flex-basis: 指定了 flex 元素在主轴方向上的初始大小
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          font-size: $font-size-small;
          color: $color-text;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
