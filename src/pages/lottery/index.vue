<template>
<view class="page">
  <title-bar title="幸运大抽奖"/>
  <view class='lottery-content'>
    <view class="score-wrapper">
      <view class="desc">你的积分:</view>
      <text class="score">{{remainScore}}</text>
    </view>
    <view class="score-decl" @click="scoreDecl">
      积分说明
    </view>
    <view canvas-id='bgCanvas' id='canvas-bg' class='canvasII' :style="'transform:rotate('+lightDeg*30+'deg)'">
      <image src="../../static/image/lottery-bottom.svg" mode="scaleToFill"
        lazy-load="false"></image>
    </view>
    <view class='canvasI' :style="rotateDeg?'transform:rotate('+rotateDeg+'deg)':''" @>
      <view canvas-id='canvasI' id="canvas-one" class='canvasI' >
        <image src="../../static/image/lottery-disk.svg" mode="scaleToFill"
          lazy-load="false"/>
      </view>
    </view>
    <view class='start'  @click='start'>
      <image class='start' src='../../static/image/lottery-button.svg' mode="scaleToFill"
          lazy-load="false"/>
    </view>
  </view>

  <view class='lottery-desc'>
    <view class='title'>活动奖品</view>
    <view class='prize'>
      <view class='level'>一等奖</view>
      <view class='desc'>小度在家音箱</view>
    </view>
    <view class='prize'>
      <view class='level'>二等奖</view>
      <view class='desc'>小度智能音箱</view>
    </view>
    <view class='prize'>
      <view class='level'>三等奖</view>
      <view class='desc'>100积分</view>
    </view>
  </view>
  <view class='prize-list'>
    <view class='prize' @click="prizeClicked">
      <text>你的奖品</text>
    </view>
  </view>
  <view class="modal-mask class-mask" :class="modalVisible ? 'modal-mask-show' : ''" @click="modalVisible=false"/>
  <view class="modal" :class="modalVisible ? 'modal-show' : ''">
    <view class="modal-main">
      <view class="con-wrapper" v-if="true">
        <view class="con-title">
          <image src="../../static/image/congratulation.svg" mode="scaleToFill"
            lazy-load="false"/>          
        </view>
        <view class="con-content">
          <view class="text">{{conText}}</view>
        </view>
        <block v-if="grade == 1 || grade == 2">
          <input class="con-input" :value="phone" type="number" title="联系电话" placeholder="请输入手机号" @input="phoneChange"/>
          <view class="tip">
            <text>输入手机号，工作人员随后会联系你</text>
          </view>
          <view class="con-footer">
            <button class="button cancel" @click="modalVisible=false">取消</button>
            <button class="button confirm" :disabled="phone.length !== 11" @click="prizeUser">提交</button>
          </view>
        </block>
        <block v-else>
          <view class="con-footer">
            <button class="button cancel" @click="modalVisible=false">再逛逛</button>
          </view>          
        </block>
      </view>
    </view>
  </view>
</view>
</template>

<script>
import { mapState } from 'vuex'

var mytime = ''

export default {
  data: {
    rotateDeg: 0,
    lightDeg: 0,
    prizeList: [],
    modalVisible: false,
    grade: 1,
    phone: '',
    inRotate: false,
    rotateTimer: {}
  },
  computed: {
    conText () {
      const texts = ['很遗憾，你没有中奖，下次再来吧', '你获得了一台小度在家音箱', '你获得了一台小度智能音箱', '你获得了三等奖']
      return texts[this.grade]
    },
    ...mapState({
      remainScore: state => state.lottery.remainScore,
      drawTimes: state => state.lottery.drawTimes
    })
  },
  methods: {
    updateRotate () {
      let num = 0
      if (this.grade === 0) {
        num = (parseInt(Math.random() * 1000) % 3) * 2
      } else if (this.grade === 1) {
        num = 5
      } else if (this.grade === 2) {
        num = 3
      } else if (this.grade === 3) {
        num = 1
      } else {
        num = 0
      }

      let rotateCircle = parseInt(this.rotateDeg / 360)
      this.rotateDeg = rotateCircle * 360 + 1440 + num * 60
    },
    start () {
      if (this.inRotate) {
        return
      }
      if (this.drawTimes > 0) {
        let that = this
        clearTimeout(this.rotateTimer)

        this.$store.dispatch('luckyDraw').then((result) => {
          that.grade = result.grand
          that.updateRotate()
          if (this.grade > 0) {
            this.inRotate = true
            this.rotateTimer = setTimeout(() => {
              this.modalVisible = true
              this.inRotate = false
            }, 3500)
          }
        })
      } else {
        wx.showToast({
          title: '你目前的积分不足，\n快点去攒积分吧',
          icon: 'none',
          duration: 2000,
          mask: false
        })
      }
    },
    light () { // 跑马灯绘制
      this.lightDeg = this.lightDeg === 0 ? 1 : 0
    },
    scoreDecl () {
      console.log('scoreDecl')
    },
    prizeClicked () {
      if (this.prizeList.length === 0) {
        wx.showToast({
          title: '你还没有抽到奖，赶快开始抽奖吧',
          icon: 'none',
          duration: 3000,
          mask: false
        })
      } else {
        wx.navigateTo({
          url: '/pages/prizeList/main'
        })
      }
    },
    phoneChange (e) {
      let phone = e.mp.detail.value
      this.phone = phone
    },
    prizeUser () {
      this.modalVisible = false
      this.$store.dispatch('prizeuser', {grand: this.grade, phone: this.phone})
    }
  },

  onShow (option) {
    mytime = setInterval(this.light, 1000)
  },

  onLoad () {
    this.$store.dispatch('getScore')
  },

  onUnload () {
    clearInterval(mytime)
  },

  onShareAppMessage: function () {
    return {
      title: '',
      path: '/pages/index/main'
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  background: #fac55c
}
.lottery-content{
  width: 90%;
  height: 600rpx;
  margin: 0 auto;
  margin-top: 50rpx;
  position: relative;
}

.score-wrapper {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: -30rpx;
}

.score-decl {
  position: absolute;
  right: 0;
  top: -30rpx;
  background: white;
  padding: 2rpx 10rpx;
  box-shadow: 2px 2px 1px #888888;
}

.score-decl:active {
  box-shadow: none;
}

.score-wrapper .score {
  font-weight: bold;
}

.canvasI{
  width: 500rpx;
  height: 500rpx;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto auto;
  transition:all 3s ease;
}
.canvasII{
  width: 600rpx;
  height: 600rpx;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto auto;
}
.start{
  position: absolute;
  width: 120rpx;
  height: 155rpx;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto auto;
  display: block;
  overflow: auto;
  visibility: visible;
}

.lottery-desc {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 100rpx 100rpx 0 100rpx;
  background: white;
  border-radius: 40rpx;
  padding: 50rpx 0;
}

.prize {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
}

.lottery-desc .title {
  font-size: 32rpx;
  border-radius: 50rpx;
  background: #DF1E14;
  position: absolute;
  text-align: center;
  top: -40rpx;
  vertical-align: middle;
  color: white;
  width: 200rpx;
  height: 80rpx;
  font-weight: bold;
  line-height: 80rpx;
}

.prize-list {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 100rpx;
}

image {
  width: 100%;
  height: 100%;
}

.prize-list .prize {
  background: #DF1E14;
  border-radius: 5rpx;
  width: 300rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: white;
  text-align: center;
  box-shadow: 2px 2px 1px #888888;
  display: flex;
  justify-content: center;
  animation:myfirst 2s infinite;
}

@keyframes myfirst
{
  0%   {color:white;}
  25%  {color:yellow;}
  50%  {color:white;}
  100% {color:yellow;}
}

.prize-list .prize:active{
  animation: none;
  box-shadow: none;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .7);
  z-index: 1000;
  transition: all .2s ease-in-out;
  opacity: 0;
  visibility: hidden
}

.modal-mask-show {
  opacity: 1;
  visibility: visible
}

.modal {
  position: fixed;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  z-index: 1000;
  display: flex;
  outline: 0;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  transform: translateZ(1px);
  opacity: 0;
  visibility: hidden
}

.modal-show {
  visibility: visible;
  opacity: 1
}

.modal-main {
  width: 270px;
  position: relative
}

.con-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  position: relative;
  background: #f2f2f2;
  border-radius: 30rpx;
  padding: 45px 30rpx 20rpx 30rpx;
}

.con-title {
  width: 246px;
  height: 90px;
  position: absolute;
  top: -45px;
}

.con-content .text {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 32rpx;
  color: #0c5053;
}

.con-wrapper .con-input {
  margin-top: 20rpx;
  width: 450rpx;
  border-bottom: #888888 1rpx solid;
}

.con-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 20rpx;
}

.con-footer .button {
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  white-space: nowrap;
  user-select: none;
  font-size: 14px;
  border-radius: 15px;
  border: 0 !important;
  position: relative;
  text-decoration: none;
  height: 30px;
  line-height: 30px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .1);
  color: #fff !important;
  background: #f7f7f7 !important;
  color: #495060 !important;
  margin: 10px;
  border:3rpx solid #19a1a8!important;
  color:#19a1a8!important;

}

.con-footer .button.confirm {
  background: #19a1a8
}
</style>
