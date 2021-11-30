<template>
  <div class="header">
    <span class="icon"></span>
    <h1 class="text">Jzh Music</h1>
  </div>
</template>

<script>
export default {
  name: 'MHeader'
}
</script>

<style lang="scss" scoped>
.header {
  height: 44px;
  color: $color-theme;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
    @include bg-image('logo');
    background-size: 32px;
  }

  .text {
    line-height: 44px;
    font-size: $font-size-large;
  }
}
</style>
