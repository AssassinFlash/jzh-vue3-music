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
     -->
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
    />
  </div>
</template>

<script>
import usePlay from './use-play'
import useMode from './use-mode'
import useFavorite from './use-favorite'

export default {
  name: 'Player',
  setup () {
    // hooks
    const {
      // data
      audioRef,
      songReady,
      // vuex
      fullScreen,
      playlist,
      currentSong,
      currentIndex,
      playing,
      // computed
      disableCls,
      playIcon,
      // methods
      ready,
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
      // vuex
      fullScreen,
      playlist,
      currentSong,
      currentIndex,
      playing,
      // computed
      disableCls,
      playIcon,
      modeIcon,
      // methods
      ready,
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
