<template>
  <MHeader/>
  <Tab/>
  <!-- 一级路由出口 -->
  <router-view/>
  <Player/>
</template>
<script>
import MHeader from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'

export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>
<style lang="scss">
</style>
