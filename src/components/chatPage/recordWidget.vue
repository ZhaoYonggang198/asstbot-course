<template>
  <block>
    <view class="container" @touchstart="touchstart"
              @touchcancel="touchcancel"
              @touchmove="touchmove"
              @touchend="touchend">
      <block>
        <view :style="buttonStyle" class="record-button secondary-color" v-if="recordStatus == 'inRecording'">
          <i class="icon iconfont icon-translation recording"></i>
        </view>
        <view :style="buttonStyle" class="record-button warn-color light" v-else-if="recordStatus == 'readyToCancel'">
          <i class="icon iconfont icon-close"></i>
        </view>
      </block>
    </view>
  </block>
</template>

<script>
import recordStatus from '@/components/view/recordStatus'
const recorderManager = wx.getRecorderManager()

export default {
  data () {
    return {
      timer: {},
      buttonStyle: '',
      recordStatus: 'idle',
      pageX: 0,
      pageY: 0,
      timestamp: 0
    }
  },
  components: {
    recordStatus
  },
  computed: {
    buttonPosition () {
      return `top: ${this.pageY - 50}px; left: ${this.pageX - 50}px;`
    }
  },
  watch: {
    recordStatus: function (val) {
      this.$store.commit('updateRecordStatus', {status: val, cancelText: '左右滑动，取消发送'})
    }
  },
  methods: {
    distance (newX, newY) {
      let deltaX = newX - this.pageX
      let detlaY = newY - this.pageY
      console.log('deltaX', deltaX, 'deltaY', detlaY)
      return Math.sqrt(deltaX * deltaX + detlaY * detlaY)
    },
    setStyleBasedOn (newX, newY) {
      let distance = this.distance(newX, newY)
      console.log(distance)
      if (distance < 60) {
        this.recordStatus = 'inRecording'
        this.buttonStyle = this.buttonPosition
      } else if (distance < 100) {
        this.recordStatus = 'readyToCancel'
        let opacity = (distance) / 100
        this.buttonStyle = `${this.buttonPosition} opacity: ${opacity};`
      } else {
        this.recordStatus = 'readyToCancel'
        this.buttonStyle = `${this.buttonPosition} opacity: 1;`
      }
    },
    touchstart (event) {
      console.log('touchstart', event.mp.touches[0])
      this.pageX = event.mp.touches[0].pageX
      this.pageY = event.mp.touches[0].pageY
      this.buttonStyle = this.buttonPosition
      this.recordStatus = 'idle'
      recorderManager.stop()
      this.timer = setTimeout(() => {
        this.startRecord()
        this.recordStatus = 'inRecording'
      }, 350)
    },

    touchcancel (event) {
      this.recordStatus = 'idle'
      recorderManager.stop()
    },

    touchmove (event) {
      if (this.recordStatus !== 'idle') {
        let newPos = event.mp.changedTouches[0]
        this.setStyleBasedOn(newPos.pageX, newPos.pageY)
      } else {
        clearTimeout(this.timer)
      }
    },

    touchend (event) {
      if (this.recordStatus === 'readyToCancel') {
        this.recordStatus = 'idle'
        recorderManager.stop()
      } else if (this.recordStatus === 'inRecording') {
        recorderManager.stop()
      } else {
        clearTimeout(this.timer)
      }
    },

    startRecord () {
      let that = this
      recorderManager.onStart(() => {
      })
      recorderManager.onPause(() => {
      })
      recorderManager.onStop((res) => {
        if (that.recordStatus !== 'idle') {
          that.recordStatus = 'idle'
          that.$emit('msgSendStatus', 'start')
          that.$store.dispatch('getAsrResult', res.tempFilePath)
            .then(() => {
              that.$store.commit('clearState')
              that.items = []
              that.$emit('msgSendStatus', 'end')
            })
            .catch(() => {
              that.$emit('msgSendStatus', 'end')
              wx.showToast({
                title: '没听懂:(',
                icon: 'none'
              })
            })
        }
      })
      recorderManager.onError((error) => {
        console.log('录音停止，原因可能如下所示')
        console.log(error)
      })
      recorderManager.onFrameRecorded((res) => {
        const { frameBuffer } = res
        console.log('frameBuffer.byteLength', frameBuffer.byteLength)
      })
      recorderManager.onError((error) => {
        console.log('录音断开，可能是由于下面原因导致的')
        console.log(error)
        if (wx.getStorageSync('recordError')) {
          wx.setStorageSync('recordError', JSON.stringify(error) + wx.getStorageSync('recordError'))
        } else {
          wx.setStorageSync('recordError', JSON.stringify(error))
        }
      })

      const options = {
        duration: 60000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 64000,
        format: 'mp3'
      }

      recorderManager.start(options)
    }

  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
}

.record-button{
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  position: fixed;
  display:flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.iconfont {
  font-size: 80rpx;
}

.recording {
  animation: name duration timing-function delay iteration-count direction fill-mode;
}
</style>