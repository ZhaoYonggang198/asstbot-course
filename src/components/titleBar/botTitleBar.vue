<template>
  <view style="position: relative">
    <view class="title-bg-color">
      <device-top-padding></device-top-padding>
    </view>
    <image src="../../static/image/bot-title-bar.png" class="background"/>
    <view class="logo">
      <da-logo />
    </view>
    <view class="avatar-wrapper">
      <view class="avatar">
        <bod-avatar :url="avatarUrl" size="40"></bod-avatar>
      </view>
    </view>
  </view>
</template>

<script>
import returnButton from '@/components/widget/returnButton'
import deviceTopPadding from '@/components/view/deviceTopPadding'
export default {
  props: {
    avatarUrl: {
      type: String,
      default: '../../static/image/avatar.png'
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    displayUrl () {
      return this.avatarUrl || this.avatarUrl !== null ? this.avatarUrl : '../../static/image/avatar.png'
    }
  },
  components: {
    returnButton,
    deviceTopPadding
  }
}
</script>

<style lang="less" scoped>
@import "../../../static/base.less";
.logo {
  position: absolute;
  left: 10px;
  bottom: 5px;
  width: 80px;
  height: 35px;
  /*height: 84rpx;*/
}

.background {
  display: block;
  font-size: 0;
  /*height: 146rpx;*/
  height: 45px;
  background: #2b3343;
  width: 750rpx;
}

.avatar-wrapper {
  position: absolute;
  /*width: 112rpx;*/
  /*height: 112rpx;*/
  right: 81rpx;
  /*bottom: -78rpx;*/
  background-color: @background-color;
  border-radius: 50%;
  /*padding: 12rpx;*/
  z-index: 500;

  width:40px;
  height:40px;
  padding:0;
  bottom: 3px;
  left:50%;
  margin-left:-17px;


}

.avatar {
  /*width: 100rpx;*/
  /*height: 100rpx;*/
  border-radius: 50%;
  /*border: solid #25CEC2 6rpx;*/
  width: 100%;
  height: 100%;

}

.title {
  width: 400rpx;
  left: 130rpx;
  bottom: 80rpx;
  position:absolute;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title {
  flex: 1;
  text-align: center;
}

</style>
