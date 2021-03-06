<template>
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="playlist"
        v-show="visible && playlist.length"
        @click="hide"
      >
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i
                class="icon"
                :class="modeIcon"
                @click="changeMode"
              />
              <span class="text">{{ modeText }}</span>
            </h1>
          </div>
          <scroll
            ref="scrollRef"
            class="list-content"
          >
            <ul ref="listRef">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"/>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"/>
                </span>
              </li>
            </ul>
          </scroll>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'

export default {
  name: 'Playlist',
  components: {
    Scroll
  },
  setup () {
    // data
    const visible = ref(false)
    const scrollRef = ref(null)
    const listRef = ref(null)

    const {
      modeIcon,
      changeMode,
      modeText
    } = useMode()

    const {
      getFavoriteIcon,
      toggleFavorite
    } = useFavorite()

    // vuex
    const store = useStore()
    const playlist = computed(() => store.state.playlist)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    // watch
    watch(currentSong, async () => {
      if (!visible.value) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })

    // methods
    function hide () {
      visible.value = false
    }

    async function show () {
      visible.value = true
      // 数据变了，DOM要经过一个nextTick才会更新，
      // 所以要计算DOM高度就要等待nextTick之后才能获取更新后的DOM
      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }

    function getCurrentIcon (song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    function refreshScroll () {
      scrollRef.value.scroll.refresh()
    }

    function scrollToCurrent () {
      // 先拿到索引，然后根据索引拿到这首歌对应渲染的DOM的位置
      const index = sequenceList.value.findIndex(song => {
        return currentSong.value.id === song.id
      })
      const target = listRef.value.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }

    function selectItem (song) {
      // 从播放列表中找到索引，这是因为currentSong是根据播放列表算出来的
      const index = playlist.value.findIndex(item => {
        return song.id === item.id
      })
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }

    return {
      // data
      visible,
      modeIcon,
      modeText,
      scrollRef,
      listRef,
      // vuex
      playlist,
      sequenceList,
      // methods
      changeMode,
      getFavoriteIcon,
      toggleFavorite,
      hide,
      show,
      getCurrentIcon,
      selectItem
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: all 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter-from, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .clear {
          @include extend-click();

          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }

    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
