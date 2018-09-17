<template>

<view class="weui-flex">
  <view class="weui-flex__item">
    <view class="outgoing right-item">
      <view class="box small-font-size">
        <view class="loader-13 s-color">
        </view>
      </view>  
    </view>
  </view>
  <view class="user-avatar" v-if="userAuthed">
    <open-data type="userAvatarUrl" />
  </view>
</view>
</template>

<script>
import { mapState } from 'vuex'
export default {

  computed: {
    ...mapState({
      userAuthed: state => state.userProfile.authed
    })
  }
}
</script>

<style scoped>
.outgoing {
  width: 60rpx;
  float: right;
  padding:20rpx;
  border:solid #19a1a8 1rpx;
  border-radius:30rpx 30rpx 0 30rpx;
  background-color:#19a1a8 !important;
  color:#ffffff !important;
  font-size:28rpx;
  margin-right:10rpx;
  text-align:left;
  position:relative;

}
.user-avatar {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  overflow:hidden;  
  display: block;
}

.box {
  display: block;
  width: 50rpx;
  height: 30rpx;
  position: relative;
  -webkit-transition: .3s color, .3s border, .3s transform, .3s opacity;
  transition: .3s color, .3s border, .3s transform, .3s opacity;
}

.loader-13:before,
.loader-13:after,
.loader-13 {
  display: block;
  width: 24rpx;
  height: 24rpx;
  color: inherit;

  pointer-events: none;
  border-radius: 50%;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: loader-13 1.8s infinite ease-in-out;
  animation: loader-13 1.8s infinite ease-in-out;
}

.loader-13 {
  position: relative;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
  top: -1em;
}

.loader-13:before {
  right: 100%;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.loader-13:after {
  left: 100%;
}

.loader-13:before,
.loader-13:after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  width: inherit;
  height: inherit;
}

@-webkit-keyframes loader-13 {
  0%,
  80%,
  100% {
    box-shadow: 0 1em 0 -1em;
  }
  40% {
    box-shadow: 0 1em 0 -.2em;
  }
}

@keyframes loader-13 {
  0%,
  80%,
  100% {
    box-shadow: 0 1em 0 -1em;
  }
  40% {
    box-shadow: 0 1em 0 -.2em;
  }
}
</style>
