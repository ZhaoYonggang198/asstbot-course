<template>
  <block >
    <view class="return-button" @click="navigateBack">
      <i class="icon iconfont icon-return"></i>
      <view class="desc"><text>返回</text></view>
    </view>
  </block>
</template>

<script>
export default {
  data () {
    return {
      canReturn: false
    }
  },
  methods: {
    navigateBack () {
      if (this.canReturn) {
        wx.navigateBack()
      } else {
        wx.reLaunch({
          url: '../index/main?scene=relaunchFrom'
        })
      }
    }
  },
  onLoad () {
    this.canReturn = getCurrentPages().length > 1
  }
}
</script>

<style lang="less" scoped>
@import '~@/../static/base';
.return-button {
  padding-left: 20rpx;
  display: flex;
  flex-direction: row;
  color: @text-on-p-color;
}

.icon-return {
  font-size: 50rpx;
}

.return-button:active {
  background-color: @p-color;
}

.return-button  .desc{
  line-height: @font-size-big;
  vertical-align: middle;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}


</style>
