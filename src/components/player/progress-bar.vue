<template>
  <!-- 总进度条 -->
  <div
    class="progress-bar"
    ref="progressBar"
    @click="onClick"
  >
    <div class="bar-inner">
      <!-- current进度条 -->
      <div
        class="progress"
        ref="progress"
        :style="progressStyle"
      ></div>
      <!-- 小圆点 -->
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16
export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: ['progress-changing', 'progress-changed'],
  data () {
    return {
      offset: 0
    }
  },
  computed: {
    // 实时进度条宽度
    progressStyle () {
      return {
        width: `${this.offset}px`
      }
    },
    // 小圆点根据实时进度而偏移
    btnStyle () {
      return {
        transform: `translateX(${this.offset}px)`
      }
    }
  },
  // 进度条是不断变化的，进度是外部传来的，进度是0到1
  // 监听进度，计算得实时播放进度条
  // $el：获取Vue实例挂载的DOM元素，这里是获取progressBar
  // 实时进度条宽度 = （progressBar总宽度 - btn宽度）* 进度
  // 不适用computed的原因：$el是mounted才有的，使用computed很可能得不到宽度
  watch: {
    progress (newProgress) {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      this.offset = newProgress * barWidth
    }
  },
  created () {
    // 在这里定义是因为这个数据不需要在模板中使用，只是为了函数方便共享
    this.touch = {}
  },
  methods: {
    // 刚开始点击小圆点时获取此时小圆点的横坐标，获取实时进度条宽度
    // clientX：鼠标相对于浏览器（这里说的是浏览器的有效区域）x轴的位置
    // clientWidth：DOM宽度+padding
    onTouchStart (e) {
      this.touch.x1 = e.touches[0].clientX
      this.touch.beginWidth = this.$refs.progress.clientWidth
    },
    // 获取鼠标相对于初始位置的偏移量
    // 获取位移之后实时进度条应该的宽度
    // 获取更改后的进度
    onTouchMove (e) {
      const delta = e.touches[0].clientX - this.touch.x1
      const tempWidth = this.touch.beginWidth + delta
      // 进度条总宽度
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      // delta有可能是负数，而progress限定为0到1
      const progress = Math.min(Math.max(0, tempWidth / barWidth), 1)
      this.offset = progress * barWidth
      // 派发自定义事件，通知播放控件修改音频当前播放时间
      this.$emit('progress-changing', progress)
    },
    // 手指离开后，获取偏移后的实时进度条宽度
    onTouchEnd (e) {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const movedWidth = this.$refs.progress.clientWidth
      const progress = movedWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    // 点击进度条的任意一个位置，更改进度
    // 新进度 = 拿到点击的位置的宽度 / 进度条总宽度
    onClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      // 点击位置和页面最左边之间的距离 - 进度条最左边到页面最左边的距离
      const offsetWidth = e.pageX - rect.left
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const progress = offsetWidth / barWidth
      this.$emit('progress-changed', progress)
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: $color-background-d;

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        box-sizing: border-box;
        position: relative;
        top: 7px;
        left: 7px;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
