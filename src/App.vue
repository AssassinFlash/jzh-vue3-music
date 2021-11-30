<template>
  <MHeader />
  <Tab />
  <!-- 一级路由出口 -->
  <router-view />
</template>
<script>
import MHeader from '@/components/header/header'
import Tab from '@/components/tab/tab'
export default {
  components: {
    MHeader,
    Tab
  }
}
</script>
<style lang="scss">
</style>
