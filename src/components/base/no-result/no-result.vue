<template>
  <!-- 做没有结果的边界处理 -->
  <div class="no-result">
    <div class="no-result-content">
      <div class="icon"></div>
      <p class="text">{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoResult',
  data () {
    return {
      title: '抱歉，没有结果'
    }
  },
  methods: {
    setTitle: function (title) {
      this.title = title
    }
  }
}
</script>

<style lang="scss" scoped>
.no-result {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .no-result-content {
    text-align: center;

    .icon {
      width: 86px;
      height: 90px;
      margin: 0 auto;
      @include bg-image('no-result');
      background-size: 86px 90px;
    }

    .text {
      margin-top: 30px;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
}
</style>
