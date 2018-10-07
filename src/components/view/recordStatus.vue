<template>
<view class="record-status" v-if="recordStatus && recordStatus!='idle'">
  <block v-if="recordStatus=='inRecording'">
    <view class="weui-flex" style="width: 300rpx">
      <view class="weui-flex__item">
        <i class="icon iconfont icon-translation_fill" style="color: white;"></i>
      </view>
    </view>
    <view>
      <text>
        {{cancelText}}
      </text>
    </view>
  </block>
  <block v-else>
    <view>
      <i class="icon iconfont icon-undo"></i>
    </view>
    <text class="warn-color light ">
      松开手指，取消发送
    </text>
  </block>
</view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      recordStatus: state => state.recordStatus.status,
      cancelText: state => state.recordStatus.cancelText
    })
  }
}
</script>

<style lang="less">
@import "../../../static/base.less";
.record-status {
  position: fixed;
  top: 300rpx;
  left: 225rpx;
  width: 300rpx;
  height: 375rpx;
  background-color: rgba(0 , 0, 0, 0.5);
  text-align: center;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-content: center;
  color: white;
  z-index: 100;
}

.record-status .iconfont {
  font-size: 200rpx;
}

.record-status text {
  font-size: @font-size-small;
}

.icon-translation_fill{
  animation: recording infinite 1s;
}

@keyframes recording
{
  0%   {opacity: 1;}
  50%  {opacity: 0;}
  100% {opacity: 1;}
}

@-webkit-keyframes  recording
{
  0%   {opacity: 1;}
  50%  {opacity: 0;}
  100% {opacity: 1;}
}

</style>