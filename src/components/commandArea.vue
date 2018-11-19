<template>
  <form report-submit="true" @submit="saveFormId" class="footer" style="width: 100vw;display: block">
    <trmpModal content="点击➕号，查看我的更多本领"/>
    <view class="weui-flex primary-color light">
      <view class="placeholder" @click="hideBottomBox">
        <button class="input-widget form-control primary-color" size="small" @click="changeToVoiceMode" v-if="!voiceMode">
          <i class="icon iconfont icon-translation"></i>
        </button>
        <button class="input-widget form-control primary-color" size="small" @click="voiceMode=false" v-else>
          <i class="icon iconfont .icon-keyboard"></i>
        </button>
      </view>
      <block>
        <view class="weui-flex__item"  v-if="!voiceMode">
          <input class="word-textarea primary-color revert textarea-style-2"  adjust-position="true" :value="currentMessage" :cursorSpacing="0"
          :maxlength="textLength" :placeholder="placehodlerText" :type="textType"
          confirm-type="send" confirm-hold="true"
          @input="valueInput" @confirm="confirm" @focus="textFocus" @blur="textBlur"/>

        </view>
        <view class="weui-flex__item" v-else>
          <record-button @msgSendStatus="msgSendStatus"></record-button>
        </view>
      </block>
    <view class="placeholder">
      <!--<button class="input-widget form-control secondary-color buttonSend" size="small" formType="submit" :disabled="(currentMessage=='') && !items.length">-->
        <!--<i class="icon iconfont icon-arrows"></i>-->
      <!--</button>-->
      <button class="input-widget form-control buttonSend primary-color" size="small" formType="submit" @click.stop="showBottomBox">
        <i v-if="!showBottomBar" class="icon iconfont icon-add"></i>
        <i v-else class="icon iconfont icon-close"></i>
      </button>
    </view>
    </view>
    <view class="foot-bottom-bar" :style="{height: keyBoardHeight}">
      <swiper :indicator-dots="bottomContainer.length > 1? true : false">
        <block v-for="(item, index) in bottomContainer" :key="index">
          <swiper-item class="swiper-container">
            <view class="swiper-item" v-for="(it, ix) in item" :key="ix" @click="selectItem(it)">
              <button class="icon-button-box" formType="submit">
                <view class="icon-skill">
                  <image :src="it.src"></image>
                </view>
                <text class="skill-name">{{it.value}}</text>
              </button>
            </view>
          </swiper-item>
        </block>
      </swiper>
    </view>
    <device-padding></device-padding>
  </form>
</template>
<script>
import { mapState } from 'vuex'
import recordButton from './widget/recordButton'
import devicePadding from './view/devicePadding'
import trmpModal from './tempModal'
import formId from '@/utils/formId'

function getRecordAuth (showToast) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success (res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success () {
              resolve()
            },
            fail (err) {
              if (showToast) {
                wx.hideLoading()
                wx.showToast({
                  title: '请在设置页面打开“录音功能”',
                  icon: 'none'
                })
              }
              reject(err)
            }
          })
        } else {
          resolve()
        }
      }
    })
  })
}

export default {
  data () {
    return {
      currentMessage: '',
      voiceMode: false,
      pullUp: false,
      showBottomBar: false,
      keyBoardHeight: '0px'
    }
  },
  computed: {
    ...mapState({
      userAuthed: state => state.userProfile.authed,
      items: state => {
        return state.inputValue.items
      },
      event: state => {
        return state.inputValue.event
      },
      globalShow: state => state.inputValue.globalShow
    }),
    displayText () {
      if (!this.items) {
        return ''
      }
      return this.items.filter(item => item.caption && item.caption.length > 1)
        .map((item) => item.caption).join(',')
    },
    textAreaFocus () {
      return this.needFocus && this.inputPromt.type && this.inputPromt.type === 'input-prompt'
    },
    textType () {
      return this.inputPromt.keyboard ? this.inputPromt.keyboard : 'text'
    },
    textLength () {
      return this.inputPromt.length ? this.inputPromt.length : 140
    },
    placehodlerText () {
      return this.inputPromt.prompt ? this.inputPromt.prompt : ' '
    }
  },
  props: {
    inputPromt: {
      type: Object,
      default: {}
    },
    needFocus: {
      type: Boolean,
      default: true
    },
    displayFinish: {
      type: Boolean,
      default: false
    },
    bottomContainer: {
      type: Array,
      default: []
    }
  },
  watch: {
    displayText: function (newVal, oldVal) {
      this.currentMessage = newVal
    }
  },
  components: {
    recordButton,
    devicePadding,
    trmpModal
  },
  methods: {
    valueInput (ev) {
      this.currentMessage = ev.mp.detail.value
    },
    valueChange (ev) {
      this.currentMessage = ev.mp.detail.value
    },
    sendMessage (ev) {
      formId.save(ev.mp.detail.formId)
      if (this.currentMessage && this.currentMessage !== this.displayText) {
        this.$store.dispatch('sendQuery', this.currentMessage).then(res => {
          this.$store.commit('clearState')
        })
        this.currentMessage = ''
      } else if (this.items.length !== 0) {
        this.$store.dispatch('sentCheckBoxReply', {items: this.items, event: this.event}).then(res => {
          this.$store.commit('clearState')
        })
      } else {
        this.$store.commit('clearState')
      }
    },
    saveFormId (ev) {
      formId.save(ev.mp.detail.formId)
    },
    confirm (e) {
      if (e.mp.detail.value) {
        this.$store.dispatch('sendQuery', e.mp.detail.value)
        this.currentMessage = ''
      }
    },
    setGlobalShow () {
      if (this.globalShow) {
        this.$store.commit('setGlobalFalse')
      } else {
        this.$store.commit('setGlobalTrue')
      }
    },
    msgSendStatus (event) {
      this.$emit('msgSendStatus', event)
    },
    textFocus (e) {
      if (e.mp.detail.height > 0) {
        this.$emit('keyboardUp', e.mp.detail.height)
      }
      this.showBottomBar = false
      // const that = this
      // wx.getSystemInfo({
      //   success: function (res) {
      //     let dom = wx.createSelectorQuery().select('#bottom').boundingClientRect()
      //     dom.exec(function (resp) {
      //       if (res.screenHeight - resp[0].bottom - 40 > e.mp.detail.height) {
      //         that.pullUp = false
      //         that.$emit('keyBoardUp', e.mp.detail.height * 2 + 'rpx')
      //       } else {
      //         that.pullUp = true
      //         that.$emit('keyBoardUp', '0rpx')
      //       }
      //     })
      //   }
      // })
    },
    textBlur (e) {
      this.pullUp = false
      this.$emit('keyboardDown')
      this.showBottomBar = this.keyBoardHeight !== '0px'
      this.keyBoardHeight = this.keyBoardHeight === '0px' ? '0px' : '170px'
      console.log(this.showBottomBar)
    },
    changeToVoiceMode () {
      getRecordAuth(true).then(() => {
        wx.showToast({
          title: '在聊天窗口空白处\n长按可以使用语音功能',
          icon: 'none',
          duration: 3000,
          mask: false
        })
        this.voiceMode = true
      })
    },
    changeVoiceMode (showToast) {
      getRecordAuth(showToast)
        .then(() => {
          this.voiceMode = true
          this.$store.commit('initAuthStatus', true)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    showBottomBox () {
      this.showBottomBar = !this.showBottomBar
      this.keyBoardHeight = this.showBottomBar ? '170px' : '0px'
      // setTimeout(() => {
      //   this.$emit('scollToBottom')
      // }, 500)
    },
    hideBottomBox () {
      this.showBottomBar = false
      this.keyBoardHeight = '0px'
      // setTimeout(() => {
      //   this.$emit('scollToBottom')
      // }, 500)
    },
    selectItem (obj) {
      this.$store.dispatch('sentRadioReply', {...obj, value: obj.value ? obj.value : obj.caption})
      this.showBottomBar = false
      this.keyBoardHeight = '0px'
    }
  },
  onLoad () {
    this.changeVoiceMode(false)
  }
}
</script>

<style lang="less" scoped>
@import "../../static/base.less";

.input-widget {
  margin: 0!important;
  height: 100%;
  max-height: 80rpx;
  line-height: 80rpx;
  box-sizing: border-box;
  border-radius: 0;
}
.input-widget:disabled{
  padding-left: 20px;
  border-radius: 0;
}
  .height-line-height{
    /*height: 80rpx;*/
    line-height: 80rpx;
    box-sizing: border-box;
  }
  .container-box{
    align-items: flex-end;
    display: flex!important;
    background: #ccc;
  }
  .word-break{
    /*word-wrap: normal;*/
    word-break: break-word;
  }
  .word-textarea{
    height: auto;
    background: #fff;
    padding-left: 10rpx;
  }
  .buttonSend[disabled]{
    background: #999!important;
  }

   .default-widget {
    background: #999!important;
   }

   .button-talk-pressed {
     background-color: #FFF!important;
     color: #666!important;
   }

  .command-box{
    padding: 4rpx 8rpx;
  }
  .command-text{
    border: 1rpx solid #dadada;
    box-sizing: border-box;
    width:100%;
    height:100%;
  }

  .input-widget .iconfont{
    font-size: 40rpx!important;
  }

.word-textarea{
  /*height: auto;*/
  min-height: 74rpx;
  padding-left: 10rpx;
  line-height: 74rpx;
  word-break: break-word;
  border: 1rpx solid #dadada;
  box-sizing: border-box;
  width:100%;
  margin-top: 3rpx;
  /*height:100%;*/
  height: 80rpx;
}

.input-widget .iconfont{
  font-size: @font-size-big!important;
}
  .placeholder{
    display: flex;
    align-items: flex-end;
    border: none;
    border-radius: 0;
  }
  .textarea-style-2{
    line-height: 40rpx;
  }
  .textarea-style-1{
    line-height: 80rpx;
  }
  button::after {
    border-radius: 0;
  }
  .foot-bottom-bar{
    transition: height .5s;
    height: 0px;
    overflow: hidden;
    width: 100%;
    background: @background-color;
  }
  .foot-bottom-bar-active{
    height: 170px;
  }
  .swiper-container{
    display: flex;
    flex-wrap: wrap;
    padding:10px 0;
  }
  .swiper-item{
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .icon-skill{
    /*border:1px solid #d8d8d8;*/
    border-radius:50%;
    width:40px;
    height:40px;
    line-height:40px;
    text-align:center;
  }
  .skill-name{
    font-size: 12px;
    color: #999;
    margin-top: 5px;
  }
  .icon-button-box{
    display: flex;
    flex-direction: column;
    align-items: center;
    background: none;
    margin: 0;
    padding: 0;
  }
.icon-button-box:after{
  border: none;
}

</style>
