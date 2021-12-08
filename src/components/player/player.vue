<template>
  <!--
    播放组件，它应当在任意地方都能打开，因此把它放到App.vue中
    通过全局变量fullScreen控制播放组件是否显示
   -->
  <div class="player" v-show="playlist.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" alt="">
        </div>
        <!-- 标题栏 -->
        <div class="top">
          <div class="back" @click="hideFullScreen">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <!-- 中间cd图片和歌词 -->
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <!-- cd图片 -->
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div ref="cdRef" class="cd">
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                  :src="currentSong.pic"
                  alt=""
                >
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <!-- 歌词 -->
          <!--
            better-scroll 默认渲染了一个父层div，对scroll定义class就是对父层div定义class
            父层div滚动容器必须要规定好高度，滚动内容自动计算高度，这样才能产生滚动
           -->
          <scroll
            ref="lyricScrollRef"
            class="middle-r"
            :style="middleRStyle"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  v-for="(line,index) in currentLyric.lines"
                  :key="line.num"
                  :class="{ 'current' : currentLineNum === index }"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot"
                  :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <!-- 监听进度条拖动的派发事件，回调修改歌曲播放进度 -->
              <progress-bar
                ref="barRef"
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
    </transition>
    <MiniPlayer :progress="progress" :toggle-play="togglePlay"/>
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
import useCd from './use-cd'
import useLyric from './use-lyric'
import useMiddleInteractive from './use-middle-interactive'
import useAnimation from './use-animation'
import ProgressBar from './progress-bar.vue'
import MiniPlayer from './mini-player'
import Scroll from '../base/scroll/scroll'
import { formatTime } from '@/assets/js/util'
import { nextTick, ref, watch } from 'vue'

export default {
  name: 'Player',
  components: {
    ProgressBar,
    MiniPlayer,
    Scroll
  },
  setup () {
    const barRef = ref(null)
    // hooks
    let {
      // data
      audioRef,
      songReady,
      currentTime,
      progressChanging,
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

    const {
      cdRef,
      cdImageRef,
      cdCls
    } = useCd()

    const {
      // data
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,
      // methods
      playLyric,
      stopLyric
    } = useLyric({
      songReady,
      currentTime
    })

    // 重写ready方法，当歌曲准备状态完毕时添加播放歌词
    ready = function () {
      if (songReady.value) {
        return
      }
      songReady.value = true
      playLyric()
    }
    // 监听播放状态，当新变化的播放状态为暂停时添加暂停播放歌词
    watch(playing, newPlaying => {
      if (!songReady.value) {
        return
      }
      if (newPlaying) {
        playLyric()
      } else {
        stopLyric()
      }
    })
    watch(fullScreen, async newFullScreen => {
      if (newFullScreen) {
        // vue的数据更改到dom的变化需要隔一个nextTick
        // 隔了一个nextTick才能正确获取到DOM
        await nextTick()
        barRef.value.setOffset(progress.value)
      }
    })
    // 重写进度条拖动的处理逻辑，当拖动进度条的时候先调用播放歌词，再停止播放歌词，以同步改变的歌曲播放时间
    onProgressChanging = function (progress) {
      progressChanging.value = true
      currentTime.value = currentSong.value.duration * progress
      audioRef.value.currentTime = currentTime.value
      playLyric()
      stopLyric()
    }
    onProgressChanged = function (progress) {
      currentTime.value = currentSong.value.duration * progress
      audioRef.value.currentTime = currentTime.value
      // 修改完音频组件后再把标记改为false
      progressChanging.value = false
      if (playing.value) {
        playLyric()
      }
    }

    const {
      currentShow,
      middleRStyle,
      middleLStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    } = useMiddleInteractive()

    const {
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave
    } = useAnimation()

    return {
      // data
      audioRef,
      barRef,
      songReady,
      currentTime,
      cdRef,
      cdImageRef,
      cdWrapperRef,
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,
      currentShow,
      middleLStyle,
      middleRStyle,
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
      cdCls,
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
      toggleFavorite,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      enter,
      afterEnter,
      leave,
      afterLeave
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

    // 中间CD图片旋转层
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        // 宽高比10比8
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          box-sizing: border-box;
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            img {
              box-sizing: border-box;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          transition: all 0.3s ease;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-ll;
          }
        }
      }

      // 歌词列表
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            transition: all 0.3s ease;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    // 底部播放操作栏
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          transition: all .3s ease;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

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

    &.normal-enter-active, &.normal-leave-active {
      transition: all .3s;

      .top, .bottom {
        transition: all .3s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }

    &.normal-enter-from, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
