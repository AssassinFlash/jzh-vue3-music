<template>
  <ul class="song-list">
    <li
      class="item"
      v-for="(song,index) in songs"
      :key="song.id"
      @click="selectItem(song,index)"
    >
      <div class="content">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  emits: ['select'],
  methods: {
    getDesc (song) {
      return `${song.singer} - ${song.name}`
    },
    // 当点击了歌曲列表的某个歌曲的时候，派发自定义select事件，传递song和index参数
    selectItem (song, index) {
      this.$emit('select', {
        song,
        index
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    box-sizing: border-box;
    height: 64px;
    display: flex;
    align-items: center;
    font-size: $font-size-medium;

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        @include no-wrap();
        color: $color-text;
      }

      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
