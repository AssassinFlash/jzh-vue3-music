<template>
  <div class="singer" v-loading="loading">
    <!-- 歌手列表 -->
    <IndexList :data="singers"/>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/index-list/index-list'

export default {
  name: 'SingerIndex',
  components: {
    IndexList
  },
  data () {
    return {
      singers: []
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
