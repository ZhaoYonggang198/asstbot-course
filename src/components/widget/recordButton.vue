<template>
<block>
  <view class="input-widget form-control secondary-color" :class="recordStatus=='idle'?'':'dark'"
          style="border-radius:0!important; border:none"
            @touchstart="startRecord"
            @touchcancel="cancelRecord"
            @touchmove="recordOperation"
            @touchend="stopRecord">{{recordOperationText}}</view>
</block>
</template>
<script>
const recorderManager = wx.getRecorderManager()
export default {
  data () {
    return {
      recordStatus: 'idle',
      startRecordPageY: 0,
      endRecordPageY: 0
    }
  },
  computed: {
    recordOperationText () {
      if (this.recordStatus === 'idle') {
        return '按住对我讲话'
      } else if (this.recordStatus === 'readyToCancel') {
        return '松开手指，取消发送'
      } else {
        return '松开 结束'
      }
    }
  },
  watch: {
    recordStatus: function (val) {
      this.$store.commit('updateRecordStatus', {status: val, cancelText: '手指上滑，取消发送'})
    }
  },
  methods: {
    startRecord (e) {
      this.startRecordPageY = e.clientY
      this.endRecordPageY = e.clientY
      this.recordStatus = 'inRecording'
      this.startRecordOperation()
    },
    stopRecord (e) {
      recorderManager.stop()
    },
    cancelRecord (e) {
      this.recordStatus = 'idle'
      recorderManager.stop()
    },
    recordOperation (e) {
      this.endRecordPageY = e.clientY
      if (this.endRecordPageY - this.startRecordPageY < -50) {
        this.recordStatus = 'readyToCancel'
      } else {
        this.recordStatus = 'inRecording'
      }
    },
    clearRecordStatus () {
      this.recordStatus = 'idle'
      this.startRecordPageY = 0
      this.endRecordPageY = 0
    },
    startRecordOperation () {
      let that = this
      recorderManager.onStart(() => {
        console.log('recorder start')
      })
      recorderManager.onPause(() => {
        console.log('recorder pause')
      })
      recorderManager.onStop((res) => {
        console.log('recorder stop', res)
        // const { tempFilePath } = res
        if (that.recordStatus === 'inRecording') {
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
            .finally(() => {
              that.$emit('msgSendStatus', 'end')
            })
        }
        that.clearRecordStatus()
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

      if (this.recordStatus === 'inRecording') {
        recorderManager.start(options)
      }
    }
  }
}
</script>

<style scoped>
.input-widget {
  margin: 0!important;
  height: 100%;
  max-height: 80rpx;
  line-height: 80rpx;
  box-sizing: border-box;
  text-align: center;
}
.button::after {
  border-radius: 0;
}
</style>
