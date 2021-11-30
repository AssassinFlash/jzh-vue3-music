<template>
  <div class="loading">
    <div class="loading-content">
      <img src="loading.gif" alt="" width="30" height="30">
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {
      title: '正在载入...'
    }
  },
  methods: {
    setTitle (title) {
      this.title = title
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  // 设置绝对定位，作用到视口的中间
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  .loading-content {
    text-align: center;

    .desc {
      line-height: 20px;
      font-size: $font-size-medium;
      color: $color-text-l;
    }
  }
}
</style>
