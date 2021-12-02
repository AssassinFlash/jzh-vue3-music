<template>
  <div class="singer" v-loading="loading">
    <!-- 歌手列表，监听派发的select事件，对应回调 -->
    <IndexList :data="singers" @select="selectSinger"/>
    <!-- 二级路由，是singer路由的子路由的出口 -->
    <router-view v-slot="{ Component }">
      <transition name="slide" appear>
        <component :is="Component" :singer="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/index-list/index-list'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'SingerIndex',
  components: {
    IndexList
  },
  data () {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  computed: {
    loading () {
      return !this.singers.length
    }
  },
  async created () {
    const result = await getSingerList()
    this.singers = result.singers
  },
  methods: {
    // 监听select事件派发，在回调处理中获取singer
    selectSinger (singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push({
        name: 'SingerDetail',
        params: { id: singer.mid }
      })
    },
    // 缓存singer对象
    cacheSinger (singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
