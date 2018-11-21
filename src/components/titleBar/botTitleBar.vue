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
        <bod-avatar :url="avatarUrl" size="50"></bod-avatar>
      </view>
    </view>
    <view class="voice-container" @click="setTalk">
      <image v-if="canTalk" class="icon-voice-btn" src="https://xiaodamp.cn/asst/resource/v1/sound.png"></image>
      <image v-else class="icon-voice-btn" src="https://xiaodamp.cn/asst/resource/v1/mute.png"></image>
    </view>
  </view>
</template>

<script>
import returnButton from '@/components/widget/returnButton'
import deviceTopPadding from '@/components/view/deviceTopPadding'
import { mapState } from 'vuex'
import stop from '../../utils/audioReply'
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
    ...mapState({
      canTalk: state => state.messages.canTalk
    }),
    displayUrl () {
      return this.avatarUrl || this.avatarUrl !== null ? this.avatarUrl : '../../static/image/avatar.png'
    }
  },
  components: {
    returnButton,
    deviceTopPadding
  },
  methods: {
    setTalk () {
      if (this.canTalk) {
        stop.stop()
      }
      this.$store.commit('setCanTalk', !this.canTalk)
      this.$store.dispatch('updateTalkTts', {tts: this.canTalk})
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../static/base.less";
.logo {
  position: absolute;
  left: 10px;
  bottom: 10px;
  width: 97px;
  height: 42px;
}

.background {
  display: block;
  font-size: 0;
  height: 70px;
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

  width:50px;
  height:50px;
  padding:0;
  bottom: 10px;
  left:50%;
  margin-left:-25px;


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
.voice-container{
  position: absolute;
  z-index: 1000;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(51,51,51,.3);
  right: 10px;
  bottom: -100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-voice-btn{
  width: 60%;
  height: 60%;
}

</style>
