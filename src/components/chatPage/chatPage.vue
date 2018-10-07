<template>
  <block>
    <view class="content" style="flex-direction: column">
      <videoplayer :src="videoSrc" v-if="videoPlay" @videoEnded="videoPlay=false"></videoplayer>
      <scroll-view scroll-y='true' :scroll-into-view="scrollToView" style="height: 100%">
        <view class="message-list">
          <block v-for="(conversation, i) in messageList" :key="conversation">
            <view class="conversation" :id="'bottom'+i" :class="{'last-child':i==(messageList.length-1), 'focus-input': keyboardInput}">
              <view style="height: 80rpx;" v-if="i==(messageList.length-1)" />
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
              <block v-if="localMsgSending && i==(messageList.length-1)">
                <user-say-sending/>
              </block>
              <view class="record-area" v-if="i==(messageList.length-1)">
                <record-widget @msgSendStatus="handleMsgSendStatus"/>
              </view>
            </view>
          </block>
        </view>
      </scroll-view>
      <!-- <message-list :messagesList="messageList" :survey="survey" :localmsgsending="localMsgSending"
          @renderFinish="msgDisplayFinish" @renderBegin="msgDisplayBegin"/> -->
    </view>
    <view class="footer">
      <record-status/>
      <select-box  v-if="displayFinish" :messageAction="activeBoxMsg" />
      <command-area  @msgSendStatus="handleMsgSendStatus"
          :inputPromt="activeInputPromtMsg"
          :displayFinish="displayFinish" @keyboardUp="keyboardUp" @keyboardDown="keyboardDown"
          :needFocus="messageList.length>5"/>
    </view>
  </block>
</template>

<script>
import commandArea from '@/components/commandArea'
import selectBox from '@/components/selectBox'
import userSaySending from '@/components/userSay/sending'
import videoplayer from '@/components/widget/videoplayer'
import recordWidget from '@/components/chatPage/recordWidget'
import { mapState } from 'vuex'

const urlMaping = {
  'edit-survey': '/pages/surveySubjects/main',
  'bot-creator': '/pages/index/main',
  'test-survey': '/pages/surveyChat/main',
  'show-survey': '/pages/display/main',
  'publish-survey': '/pages/publish/main',
  'show-survey-result': '/pages/detail/main',
  'course-skill': '/pages/course/main',
  'do-survey': '/pages/surveyChat/main'
}

export default {
  data () {
    return {
      displayFinish: false,
      localMsgSending: false,
      scrollToView: 'bottom',
      videoPlay: false,
      videoSrc: '',
      keyboardInput: false
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
    }
  },
  computed: {
    ...mapState({
      userAuthed: state => state.userProfile.authed
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
      let lastMsg = this.activeRedirectMsg
      if (lastMsg) {
        this.doRedirect(lastMsg)
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
    }
  },

  components: {
    commandArea,
    selectBox,
    userSaySending,
    videoplayer,
    recordWidget
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
</style>
