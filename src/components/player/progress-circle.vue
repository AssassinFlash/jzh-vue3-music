<template>
  <div class="progress-circle">
    <!-- viewBox表示填满整个画布的宽高，也可理解成直径到x点100和y点100 -->
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- r表示半径，cx和cy表示圆心，x点50和y点50 -->
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <!--
        stroke表示填充边框
        stroke-dasharray 表示虚线，若只给一个值表示虚线和间隔长度相同
        stroke-dashoffset 表示虚线偏移量，正值表示向反方向偏移
        举个例子：虚线给图标长度，那整个图标只能看到虚线，
          然后再给偏移量等于图标长度，那整个图标只能看到间隔而虚线向左偏移
       -->
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'ProgressCircle',
  props: {
    // 半径
    radius: {
      type: Number,
      default: 100
    },
    // 歌曲播放进度
    progress: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    // 反方向偏移量随这播放进度增加而减少，视觉上显示就是虚线慢慢向正方向填充
    dashOffset () {
      return (1 - this.progress) * this.dashArray
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-circle {
  position: relative;

  circle {
    stroke-width: 8px;
    transform-origin: center;

    &.progress.background {
      transform: scale(0.9);
      stroke: $color-theme-d;
    }

    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
    }
  }
}
</style>
