<template>
  <movable-view class="move-btn" inertia='true' damping='10' friction='5' :x="370" :y="600"  animation="true" direction="all" @click="toHome">
      <image class="image" :src="imageUrl"></image>
  </movable-view>
</template>

<script>
const device = wx.getSystemInfoSync()
const width = device.windowWidth - 100
const height = device.windowHeight - 100
export default {
  data () {
    return {
      imageUrl: '../../static/image/avatar.png',
      width: width,
      height: height
    }
  },
  props: ['text'],
  methods: {
    toHome () {
      wx.reLaunch({
        url: '../index/main?scene=relaunchFrom'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../static/base.less";
.card {
  padding: 10px;
}
  .move-btn{
    width: 100rpx;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    border-radius: 50%;
    color: #fff;
    z-index: @home-button-z-index;
    box-shadow:0 0 20rpx #25CEC2;
    overflow: hidden;
    background: #fff;
    border: 1rpx solid #25cec2;
    position: fixed!important;
  }
  .image{
    width: 100%;
    height: 100%;
  }
</style>
