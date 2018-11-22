<template>
  <block>
    <view class="skill-list-header" v-if="skillListShow">
      <i class="icon iconfont icon-close" @click="closeSkillList"></i>
    </view>
    <view class="content" style="flex-direction: column;position: relative">
      <!--<view class="voice-container" @click="setTalk">-->
        <!--<image v-if="canTalk" class="icon-voice-btn" src="https://xiaodamp.com/imbot/image/1156bcc0-e951-11e8-b6e5-79c4537af773.png"></image>-->
        <!--<image v-else class="icon-voice-btn" src="https://xiaodamp.com/imbot/image/154f6e30-e951-11e8-b6e5-79c4537af773.png"></image>-->
      <!--</view>-->
      <videoplayer :src="videoSrc" v-if="videoPlay" @videoEnded="videoPlay=false"></videoplayer>
      <scroll-view scroll-y='true' :scroll-into-view="scrollToView" style="height: 100%" v-show="!skillListShow">
        <view class="message-list">
          <block v-for="(conversation, i) in messageList" :key="conversation">
            <view class="conversation" :id="'bottom'+i" :class="{'last-child':i==(messageList.length-1), 'focus-input': keyboardInput}">
              <view style="height: 20px;" v-if="i==(messageList.length-1) || i == 0" />
              <view style="z-index: 1" v-for="(messages, j) in conversation" :key="j">
                <message-item :survey="survey" :lastBotMsg="i==(messageList.length-1)&&messages.to!==undefined"
                          :messages="messages" :userAuthed="userAuthed"
                          @renderComplete="renderComplete"
                          @renderUpdate="renderUpdate"
                          @itemLoad="scollToBottom"
                          @previewImage="$store.commit('setPreviewFalse')"
                          @buttonListEvent="action"
                          @videoPlay="playVideo"
                          @exhibitionClick="exhibitionClick"/>
              </view>
              <block v-if="i==(messageList.length-1)" >
                <view v-if="localMsgSending" id="localMsgSending">
                  <user-say-sending/>
                </view>
                <view class="record-area" v-if="recordAuthed">
                  <record-widget @msgSendStatus="handleMsgSendStatus"/>
                </view>
                <block v-if="conversation.length == 1">
                  <view class="weui-flex bot-message">
                    <view class="left-item">
                      <!--<view class="avatar-wrapper">-->
                        <!--<bot-avatar size="30"/>-->
                      <!--</view>-->
                      <view class="content">
                        <bot-say-receiving/>
                      </view>
                    </view>
                  </view>
                </block>
              </block>
            </view>
          </block>
        </view>
        <view id="bottomMaxBottom"></view>
      </scroll-view>
      <scroll-view scroll-y="true" :scroll-top="skillPosition" v-if="skillListShow" style="height: 100%" id="skill-list">
        <view class="skill-list-wrapper">

          <skill-list :skillList="activeSkillList.items" @requestClick="requestClick" @skillActive="skillActive">
          </skill-list>
          <!-- <view class="skill-list-footer">
          </view> -->
        </view>
      </scroll-view>
    </view>
    <view class="footer">
      <record-status/>
      <select-box v-if="displayFinish" :messageAction="activeBoxMsg" @donateclick="donateclick"/>
      <command-area @msgSendStatus="handleMsgSendStatus"
          :inputPromt="activeInputPromtMsg" :bottomContainer="footSkillArr"
          :displayFinish="displayFinish" @keyboardUp="keyboardUp" @keyboardDown="keyboardDown" @scollToBottom="scrollToBottom1"
          :needFocus="messageList.length>5"/>
    </view>
    <donate v-if="inDonating" @closeDonate="closeDonate"/>
  </block>
</template>

<script>
import commandArea from '@/components/commandArea'
import selectBox from '@/components/selectBox'
import userSaySending from '@/components/userSay/sending'
import videoplayer from '@/components/widget/videoplayer'
import recordWidget from '@/components/chatPage/recordWidget'
import donate from '@/components/donate'
import audioReply from '@/utils/audioReply'
import { mapState } from 'vuex'

const urlMaping = {
  'edit-survey': '/pages/surveySubjects/main',
  'bot-creator': '/pages/index/main',
  'test-survey': '/pages/surveyChat/main',
  'show-survey': '/pages/display/main',
  'publish-survey': '/pages/publish/main',
  'show-survey-result': '/pages/detail/main',
  'course-skill': '/pages/course/main',
  'dictation': '/pages/dictation/main',
  'do-survey': '/pages/surveyChat/main',
  'xiaoai-speaker': '/pages/phone/main',
  'xiaodu-speaker': '/pages/bindXiaodu/main',
  'xiaoai-no-screen': '/pages/bindXiaomi/main',
  'dueros-no-screen': '/pages/bindXiaodu/main',
  'dueros-has-screen': '/pages/xiaoduhelp/main',
  'dingdong-no-screen': '/pages/jdSkillList/main',
  'huawei-no-screen': '/pages/bindHuawei/main',
  'lucky-draw': '/pages/lottery/main'
}

export default {
  data () {
    return {
      displayFinish: false,
      localMsgSending: false,
      scrollToView: 'bottom',
      videoPlay: false,
      videoSrc: '',
      keyboardInput: false,
      ttsPlaying: false,
      inDonating: false,
      skillListShow: false,
      skillPosition: 0
    }
  },
  props: {
    messageSource: {
      type: String,
      default: 'creator'
    },
    survey: {
      type: Object,
      default: {}
    }
  },
  watch: {
    messageList: function (val) {
      this.msgDisplayBegin()
      this.scrollToView = `bottom${val.length - 1}`
    },
    activeTtsMsg: function (val) {
      if (val.length === 0) {
        audioReply.stop()
      } else {
        audioReply.play(val, () => {})
      }
    },
    recordStatus: function (val) {
      if (val !== 'idle') {
        audioReply.stop()
        this.ttsPlaying = false
        this.toDoRedirect()
      }
    },
    localMsgSending: function (val) {
      if (val) {
        this.scrollToView = ''
        this.scrollToView = 'localMsgSending'
      }
    },
    activeSkillList: function (val) {
      if (!val.items) {
        this.skillListShow = false
        this.skillPosition = 0
      }
    }
  },
  computed: {
    ...mapState({
      userAuthed: state => state.userProfile.authed,
      recordAuthed: state => state.recordStatus.authed,
      recordStatus: state => state.recordStatus.status,
      footSkillArr: state => state.skillBox.boxItemArr
    }),

    messageList () {
      if (this.messageSource === 'creator') {
        return this.$store.state.messages.creatorBotMsg
      } else {
        return this.$store.state.messages.surveybotMsg
      }
    },
    activeMsg () {
      if (!this.messageList) {
        return undefined
      }
      const lastConversation = this.messageList[this.messageList.length - 1]
      if (!lastConversation) {
        return undefined
      }
      let lastmsg = [...lastConversation].slice(-1)[0]
      if (!lastmsg || !lastmsg.to || !lastmsg.msgs || lastmsg.msgs.length === 0) {
        return undefined
      }
      return lastmsg
    },

    activeRedirectMsg () {
      return this.activeSomeKindOfMsg(['redirect', 'reLaunch'])
    },
    activeBoxMsg () {
      return this.activeSomeKindOfMsg(['radio', 'checkbox', 'imageUploader'])
    },
    activeInputPromtMsg () {
      return this.activeSomeKindOfMsg(['input-prompt'])
    },
    activeSkillList () {
      return this.activeSomeKindOfMsg(['activeSkillList'])
    },
    activeSystemMsg () {
      const msg = this.activeSomeKindOfMsg(['system-update'])
      if (msg.type) {
        this.$store.commit('setCanTalk', msg.tts)
      }
      return msg
    },
    activeTtsMsg () {
      if (!this.activeMsg) {
        return []
      }
      return this.activeMsg.msgs.filter((msg) => {
        return msg.tts !== undefined && msg.tts !== ''
      }).map((msg) => {
        return msg.tts
      })
    }
  },
  methods: {
    action (event) {
      let buttonList = event.mp.detail.buttonList
      let item = event.mp.detail.item
      if (buttonList.reflex) {
        this.$store.commit('appendUserMessage', item.value ? item.value : item.caption)
      }
      this.$store.dispatch('sendGenericRequest', {
        type: 'event',
        data:
        {
          name: item.event,
          ...item.data
        }
      })
    },
    activeSomeKindOfMsg (array) {
      if (!this.activeMsg) {
        return {}
      }
      let message = this.activeMsg.msgs.filter((msg) => {
        return array.indexOf(msg.type) !== -1
      })
      if (message.length >= 1) {
        this.$store.dispatch('initBoxItem', message[0].items)
        return message[0]
      } else {
        return {}
      }
    },
    msgDisplayBegin () {
      this.displayFinish = false
    },
    msgDisplayFinish () {
      this.displayFinish = true
      if (this.activeSkillList.items !== undefined && this.activeSkillList.items.length !== 0) {
        this.skillListShow = true
        this.skillPosition = 0
      }
      this.toDoRedirect()
    },
    toDoRedirect () {
      if (this.displayFinish && !this.ttsPlaying) {
        let lastMsg = this.activeRedirectMsg
        if (lastMsg) {
          this.doRedirect(lastMsg)
        }
      }
    },
    doRedirect (lastmsg) {
      let redirectUrl = urlMaping[lastmsg.url]
      let headerParas = this.buildHeaderParas(lastmsg.option)
      let urlWithParas = redirectUrl + headerParas

      if (lastmsg.type === 'redirect') {
        this.delayRedirectTo(lastmsg, urlWithParas)
      } else if (lastmsg.type === 'reLaunch') {
        this.delayRelaunch(`${urlWithParas}?scene='relaunchFromBot'`)
      }
    },
    buildHeaderParas (option) {
      if (!option) {
        return ''
      }
      let ret = '?'
      for (let key in option) {
        let para = key + '=' + option[key]
        ret += (ret === '?') ? para : '&' + para
      }
      // console.log('build para is', ret)
      return ret
    },
    delayRedirectTo (scene, url) {
      let that = this
      setTimeout(function () {
        that.$emit('redirectTo', scene)
        wx.navigateTo({url})
      }, 500)
    },
    delayRelaunch (url) {
      setTimeout(function () {
        wx.reLaunch({url})
      }, 500)
    },
    handleMsgSendStatus (event) {
      console.log('handleMsgSendStatus')
      this.localMsgSending = (event === 'start')
      // this.scollToBottom()
    },
    renderComplete () {
      this.msgDisplayFinish()
      this.scollToBottom()
    },
    renderUpdate () {
      this.scollToBottom()
    },
    scrollToBottom1 () {
      console.log(12121212)
      const that = this
      this.scrollToView = ''
      that.scrollToView = 'bottomMaxBottom'
      setTimeout(function () {
        that.scrollToView = ''
        that.scrollToView = 'bottomMaxBottom'
      }, 200)
    },
    scollToBottom () {
      const that = this
      this.scrollToView = ''
      that.scrollToView = `bottom${this.messageList.length - 1}`
      setTimeout(function () {
        that.scrollToView = ''
        that.scrollToView = `bottom${that.messageList.length - 1}`
      }, 200)
    },
    playVideo (event) {
      this.videoPlay = true
      this.videoSrc = event.mp.detail
    },
    exhibitionClick (event) {
      console.log(event)
      this.$store.dispatch('sendGenericRequest', {
        type: 'event',
        data: event.mp.detail
      })
    },
    keyboardUp () {
      console.error('keyboardUp')
      this.keyboardInput = true
    },
    keyboardDown () {
      this.keyboardInput = false
      setTimeout(() => {
        this.scrollToView = ''
        this.scrollToView = `bottom${this.messageList.length - 1}`
      }, 200)
    },
    donateclick () {
      console.log('donateClick')
      this.inDonating = true
    },
    closeDonate () {
      this.inDonating = false
    },
    requestClick (event) {
      this.$store.dispatch('sendQuery', event.mp.detail.value)
      this.closeSkillList()
    },
    closeSkillList () {
      console.log('closeSkillList')
      this.skillListShow = false
      setTimeout(() => {
        this.scrollToView = ''
        this.scrollToView = `bottom${this.messageList.length - 1}`
      }, 0)
    },
    skillActive (event) {
      const query = wx.createSelectorQuery()
      query.select('#skill-list').boundingClientRect()
      query.select('#skill-list').scrollOffset()
      query.exec(res => {
        console.log(res[0])
        console.log(res[1].scrollTop)
        if (event.mp.detail.value > 400) {
          this.skillPosition = res[1].scrollTop + 100
        } else if (event.mp.detail.value > 500) {
          this.skillPosition = res[1].scrollTop + 200
        }
      })
    }
  },

  onLoad () {
    this.inDonating = false
  },
  components: {
    commandArea,
    selectBox,
    userSaySending,
    videoplayer,
    recordWidget,
    donate
  }
}
</script>

<style>
  .footer{
    position: relative;
  }
  .pulldown-box{
    /*transition: height 1s;*/
  }
  .message-list,  .conversation.last-child {
    height: 100%;
  }

   .conversation.last-child  {
     height: 100%;
   }

  .conversation.last-child {
    z-index: 1;
    position: relative;
  }

  .message-list .record-area {
    position: absolute;
    left: 0px;
    bottom: 0px;
    height: 100%;
    width: 100%;
    z-index: -1;
  }

  .conversation.last-child.focus-input{
    height: auto;
  }

  .conversation.last-child.focus-input .record-area {
    height: 0;
    overflow: hidden;
  }

  .skill-list-wrapper {
    height: 100%;
  }

  .skill-list-header {
    padding: 0rpx 20rpx;
  }
  .skill-list-footer {
    height: 100rpx;
  }
  .icon-voice-btn{
    width: 60%;
    height: 60%;
  }
</style>
