<template>
  <div class="singer-detail">
    <MusicList
      :songs="songs"
      :pic="pic"
      :title="title"
      :loading="loading"
    />
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/songs'
import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'SingerDetail',
  components: {
    MusicList
  },
  props: {
    singer: Object
  },
  data () {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    // 判断singer是从歌手列表传来的还是sessionStorage获取的
    computedSinger () {
      let ret = null
      const singer = this.singer

      // 如果是从歌手列表点进来的
      if (singer) {
        ret = singer
      } else {
        // 否则就从sessionStorage获取
        const cachedSinger = storage.session.get(SINGER_KEY)
        // 比对缓存的singer和路径的mid
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          // 相同则表示是从当前页面刷新的
          ret = cachedSinger
        }
      }
      return ret
    },
    pic () {
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title () {
      const singer = this.computedSinger
      return singer && singer.name
    }
  },
  async created () {
    if (!this.computedSinger) {
      // 没有歌手就退回到1级路由
      const path = this.$route.matched[0].path
      this.$router.push({
        path
      })
      return
    }
    const result = await getSingerDetail(this.computedSinger)
    this.songs = await processSongs(result.songs)
    // 加载完数据变更加载状态
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
// 设置fixed的position，将大小铺满整个视口，并设置z-index，否则路由跳转过来也会被其他路由覆盖住
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
