<template>
  <view class="primary-color dark title-bar">
    <device-top-padding></device-top-padding>
    <view class="weui-flex title-wrapper">
      <view style="width: 174rpx;" >
        <view class="return-button">
          <return-button/>
        </view>
      </view>
      <view class="title">
        {{title}}
      </view>
      <view style="width: 174rpx;">
      </view>
    </view>
  </view>
</template>

<script>
import deviceTopPadding from '@/components/view/deviceTopPadding'
import returnButton from '@/components/widget/returnButton'
export default {

  props: {
    title: {
      type: String,
      default: '  '
    }
  },
  components: {
    deviceTopPadding,
    returnButton
  }
}
</script>

<style lang="less" scoped>
@import "~@/../static/base.less";
.title-bar {
  padding-bottom: 25rpx;
}

.title-wrapper {
  align-items: center;
}

.title-bar .iconfont {
  font-size: @font-size-big ;
  font-weight: bold;
  display: block;
}

.title {
  flex: 1;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: @font-size-middle + 8;
}

.weui-flex {
  padding-top: 15rpx;
}

.return-button {
  min-height: 76rpx;
}
</style>
