<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div ref="cdRef" class="cd-wrapper">
        <div class="cd">
          <img ref="cdImageRef" :class="cdCls" width="40" height="40"
               :src="currentSong.pic" alt="">
        </div>
      </div>
      <div
        class="slider-wrapper"
        ref="sliderWrapperRef"
      >
        <div class="slider-group">
          <div
            class="slider-page"
            v-for="song in playlist"
            :key="song.id"
          >
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <!--
            由于此层div处于 mini-player的div的包裹中
            而mini-player的div具有点击事件，为了不让点击此处的div触发了父级的div，使用stop阻止事件冒泡
           -->
          <i class="icon-mini" :class="miniPlayIcon"
             @click.stop="togglePlay"></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"/>
      </div>
      <Playlist ref="playlistRef"></Playlist>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import ProgressCircle from './progress-circle'
import Playlist from './playlist'
import useCd from './use-cd'
import useMiniSlider from './use-mini-slider'

export default {
  name: 'MiniPlayer',
  components: {
    ProgressCircle,
    Playlist
  },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function
  },
  setup () {
    // vuex
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    const playlist = computed(() => store.state.playlist)

    // data
    const playlistRef = ref(null)
    const {
      cdCls,
      cdRef,
      cdImageRef
    } = useCd()

    const { sliderWrapperRef } = useMiniSlider()

    // computed
    const miniPlayIcon = computed(() => {
      return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
    })

    // methods
    function showNormalPlayer () {
      store.commit('setFullscreen', true)
    }

    function showPlaylist () {
      playlistRef.value.show()
    }

    return {
      // vuex
      fullScreen,
      currentSong,
      playlist,
      // data
      cdCls,
      cdRef,
      cdImageRef,
      sliderWrapperRef,
      playlistRef,
      // computed
      miniPlayIcon,
      // methods
      showNormalPlayer,
      showPlaylist
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  padding: 0 10px;
  background: $color-highlight-background;

  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;

    .cd {
      width: 100%;
      height: 100%;

      img {
        border-radius: 50%;

        &.playing {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }

  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    margin-left: 20px;
    overflow: hidden;

    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;

      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;

        .name {
          margin-bottom: 3px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }

        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }

  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    margin: 0 10px;

    &:first-of-type {
      margin-right: 0;
    }

    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }

    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }

  &.mini-enter-active, &.mini-leave-active {
    transition: all .4s cubic-bezier(0.45, 0, 0.55, 1);
  }

  &.mini-enter-from, &.mini-leave-to {
    opacity: 0;
    transform: translateY(100%);
  }
}
</style>
