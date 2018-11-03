<template>
  <view class="dic-container">
    <title-bar title="听写词语"/>
    <view class="dic-content">
      <view class="dic-content-inner">
        <view class="rate-box">
          <view class="btn-rate" v-if="dictation.playWay=='disorder'">乱序听写</view>
          <view class="btn-rate" v-else-if="dictation.playWay=='order'">顺序听写</view>
        </view>
        <view class="dic-pinyin">
          <view class="dic-circle-box">
            <view class="dic-circle">
              <view class="dic-circle-word">{{pinyin}}</view>
            </view>
          </view>
        </view>
      </view>

      <!--<dictation-process :index="currentIndex" :sum="pinyinArr.length"/>-->
    </view>
    <view class="dic-footer">
      <view class="btn-footer" @click="playPre">上一个</view>
      <view class="btn-footer btn-center" v-if="playState" @click="play">播放</view>
      <view class="btn-footer btn-center" v-else @click="stop">停止</view>
      <view class="btn-footer" @click="playNext">下一个</view>
    </view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
        pinyin: '',
        pinyinArr: [],
        pinyinTts: [],
        dictation: {},
        currentIndex: 0,
        rate: true,
        playState: true,
        innerAudioContext: '',
        audioUrl: '',
        timeout: '',
        timeTwins: '',
        ttsRole: 1,
        ttsSpeed: 1,
        times: 0
      }
    },
    methods: {
      getPinyin: function (wordsArr) {
        let pinyinArr = []
        wordsArr.map((item, index) => {
          let str = ''
          item.pinyin.map(py => {
            str += py[0] + ' '
          })
          str = str.slice(0, -1)
          pinyinArr.push(str)
        })
        return pinyinArr
      },
      getPinyinTts: function (wordsArr) {
        let pinyinTtsArr = []
        wordsArr.map((item, index) => {
          let str = ''
          item.pinyin.map((py, pyIndex) => {
            str += item.term.substring(pyIndex, pyIndex + 1) + '(' + this.getPinyinForm(py[0]) + ')' + ','
          })
          // str.slice(0, -1)
          // console.log(str.slice(0, -1))
          pinyinTtsArr.push(str.slice(0, -1))
        })
        return pinyinTtsArr
      },
      getPinyinForm: function (py) {
        let py1 = /[āōēīūǖ]/g
        let py2 = /[áóéíúǘ]/g
        let py3 = /[ǎǒěǐǔǚ]/g
        let py4 = /[àòèìùǜ]/g
        // let reg = /[āōēīūǖáóéíúǘǎǒěǐǔǚàòèìùǜ]/g
        // reg.test(py)
        let num = ''
        if (py1.test(py)) {
          num = 1
        } else if (py2.test(py)) {
          num = 2
        } else if (py3.test(py)) {
          num = 3
        } else if (py4.test(py)) {
          num = 4
        } else {
          num = 1
        }
        py = py.replace(/[āáǎà]/g, 'a').replace(/[ōóǒò]/g, 'o').replace(/[ēéěè]/g, 'e').replace(/[īíǐì]/g, 'i').replace(/[ūúǔù]/g, 'u').replace(/[ǖǘǚǜ]/g, 'ü')
        return py + num
      },
      playPre: function () {
        this.innerAudioContext.offEnded()
        if (this.innerAudioContext) {
          this.innerAudioContext.stop()
        }
        if (this.currentIndex > 0) {
          this.times = 0
          this.currentIndex -= 1
          if (this.timeout) {
            clearTimeout(this.timeout)
          }
          if (this.timeTwins) {
            clearTimeout(this.timeTwins)
          }
          this.$store.dispatch('getPinyinVoice', {
            text: this.pinyinTts[this.currentIndex],
            speed: this.ttsSpeed,
            role: this.ttsRole
          }).then(res => {
            this.pinyin = this.pinyinArr[this.currentIndex]
            this.audioUrl = res
            this.playAudio()
          })
        }
      },
      playNext: function () {
        this.innerAudioContext.offEnded()
        if (this.innerAudioContext) {
          this.innerAudioContext.stop()
        }
        if (this.currentIndex < this.pinyinArr.length - 1) {
          this.times = 0
          this.currentIndex += 1
          if (this.timeout) {
            clearTimeout(this.timeout)
          }
          if (this.timeTwins) {
            clearTimeout(this.timeTwins)
          }
          this.$store.dispatch('getPinyinVoice', {
            text: this.pinyinTts[this.currentIndex],
            speed: this.ttsSpeed,
            role: this.ttsRole
          }).then(res => {
            this.audioUrl = res
            this.pinyin = this.pinyinArr[this.currentIndex]
            this.playAudio()
          })
        }
      },
      play: function () {
        this.innerAudioContext.offEnded()
        this.times = 0
        this.playAudio()
      },
      stop: function () {
        this.playState = true
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        if (this.timeTwins) {
          clearTimeout(this.timeTwins)
        }
        this.innerAudioContext.stop()
      },
      playAudio: function () {
        const that = this
        this.innerAudioContext.src = this.audioUrl
        this.innerAudioContext.play()
        this.innerAudioContext.onPlay(() => {
          this.playState = false
        })
        this.innerAudioContext.onEnded(() => {
          if (this.currentIndex === this.pinyinTts.length - 1 && this.times === this.dictation.playTimes - 1) {
            that.setPlayStateTrue()
          }
          this.times += 1
          if (this.times < this.dictation.playTimes) {
            if (this.timeTwins) {
              clearTimeout(this.timeTwins)
            }
            this.timeTwins = setTimeout(() => {
              this.innerAudioContext.play()
              clearTimeout(this.timeTwins)
            }, 1000)
          } else {
            this.times = 0
            if (this.currentIndex < this.pinyinTts.length - 1) {
              this.currentIndex += 1
              this.$store.dispatch('getPinyinVoice', {
                text: this.pinyinTts[this.currentIndex],
                speed: this.ttsSpeed,
                role: this.ttsRole
              }).then(res => {
                this.audioUrl = res
                if (this.timeout) {
                  clearTimeout(this.timeout)
                }
                this.timeout = setTimeout(() => {
                  this.pinyin = this.pinyinArr[this.currentIndex]
                  this.innerAudioContext.src = this.audioUrl
                  this.innerAudioContext.play()
                  if (this.timeout) {
                    clearTimeout(this.timeout)
                  }
                }, parseInt(this.dictation.intervel) * 1000)
              })
            }
          }
        })
      },
      dicConvert: function () {
        this.pinyinArr = this.getPinyin(this.getConvert())
        this.pinyin = this.pinyinArr[0]
        this.currentIndex = 0
      },
      dicNormal: function () {
        this.pinyinArr = this.getPinyin([...this.dictation.words])
        this.pinyin = this.pinyinArr[0]
        this.currentIndex = 0
        this.rate = !this.rate
      },
      getConvert: function () {
        this.rate = !this.rate
        let arr = [...this.dictation.words]
        let newArr = []
        let numArr = []
        let len = arr.length
        for (let i = 0; i < len; i++) {
          numArr.push(i)
        }
        for (let i = 0; i < arr.length; i++) {
          let j = Math.floor(Math.random() * len)
          len--
          newArr.push(arr[numArr[j]])
          numArr.splice(j, 1)
        }
        return newArr
      },
      setPlayStateTrue: function () {
        console.log('set state true')
        this.playState = true
      }
    },
    onShow () {
      if (this.$mp.query.param) {
        this.innerAudioContext = wx.createInnerAudioContext()
        this.dictation = JSON.parse(this.$mp.query.param)
        if (this.dictation.playWay === 'order') {
          this.pinyinArr = this.getPinyin([...this.dictation.words])
          this.pinyinTts = this.getPinyinTts([...this.dictation.words])
        } else {
          let arr = this.getConvert()
          this.pinyinArr = this.getPinyin(arr)
          this.pinyinTts = this.getPinyinTts(arr)
        }
        this.pinyin = this.pinyinArr[0]
        this.currentIndex = 0
        this.$store.dispatch('getPinyinVoice', {
          text: this.pinyinTts[this.currentIndex],
          speed: this.ttsSpeed,
          role: this.ttsRole
        }).then(res => {
          this.audioUrl = res
        })
      }
    },
    onUnload () {
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy()
      }
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      if (this.timeTwins) {
        clearTimeout(this.timeTwins)
      }
      this.playState = true
      this.times = 0
      this.currentIndex = 0
    }
  }
</script>

<style scoped>
.dic-container{
  display: flex;
  flex-direction: column;
  height: 100%;
}
  .dic-content{
    display: flex;
    flex-direction: column;
    flex: 1;
    border-bottom: 1px solid #d8d8d8;
    background: #fff;
  }
  .dic-content-inner{
    padding: 50px 0px 15px;
    height:100%;
    box-sizing:border-box;

  }
  .rate-box{
    text-align: right;
    margin-top: -35px;
    padding: 0 15px;
  }
  .btn-rate{
    text-align:right;
    background:#19a1a8;
    display:inline-block;
    line-height:14px;
    font-size:14px;
    color:#fff;
    padding:10px 15px;
    border-radius:17px;
  }
  .dic-pinyin{
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:40px;
    color: #19a1a8;
    height: 100%;
  }
  .dic-circle-box{
    width: 100vw;
    min-width: 320px;
    height: 100vw;
    min-height: 320px;
    padding: 15px;
    box-sizing: border-box;
  }
  .dic-circle{
    width:100%;
    height:100%;
    border-radius:50%;
    border:2rpx solid #188ae2;
    display:flex;
    align-items:center;
    justify-content: center;
    color:#188ae2;
  }
  .dic-circle-word{
    line-height: 40px;
    text-align: center;
    font-size: 30px;
  }
  .dic-footer{
    display: flex;
    justify-content: center;
    padding: 10px 15px 25px 15px;
  }
  .btn-footer{
    margin: 0 7px;
    height: 34px;
    line-height: 32px;
    border: 1px solid #19a1a8;
    color: #19a1a8;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 500;
    border-radius: 17px;
    padding:0 8px;
  }
  .btn-center{
    width: 60px;
    text-align: center;
  }
</style>
