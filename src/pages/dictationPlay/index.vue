<template>
  <view class="dic-container">
    <title-bar title="听写词语"/>
    <view class="dic-content">
      <view class="dic-content-inner">
        <view class="rate-box">
          <view class="btn-rate" @click="setOrder('order')" v-if="dictation.playWay=='disorder'&&showAble">乱序听写</view>
          <view class="btn-rate" @click="setOrder('disorder')" v-else-if="dictation.playWay=='order'&&showAble">顺序听写</view>
          <view class="btn-rate btn-rate-disable" disabled  v-if="dictation.playWay=='disorder'&&!showAble">乱序听写</view>
          <view class="btn-rate btn-rate-disable" disabled  v-else-if="dictation.playWay=='order'&&!showAble">顺序听写</view>
          <view class="btn-rate" @click="setRole()" v-if="(dictation.ttsSex==1 || dictation.ttsSex=='ttsMale')&&showAble">男声播放</view>
          <view class="btn-rate" @click="setRole()" v-else-if="(dictation.ttsSex==0 || dictation.ttsSex=='ttsFemale')&&showAble">女声播放</view>
          <view class="btn-rate btn-rate-disable" disabled  v-if="(dictation.ttsSex==1 || dictation.ttsSex=='ttsMale')&&!showAble">男声播放</view>
          <view class="btn-rate btn-rate-disable" disabled  v-else-if="(dictation.ttsSex==0 || dictation.ttsSex=='ttsFemale')&&!showAble">女声播放</view>
        </view>
        <view class="dic-pinyin">
          <view class="dic-circle-box">
            <view class="dic-circle">
              <view class="dic-circle-word">{{pinyin}}</view>
            </view>
          </view>
          <dictation-process style="width: 100%;" :index="processIndex" :sum="pinyinArr.length"/>

        </view>
      </view>
    </view>
    <view class="dic-footer">
      <view class="btn-footer" @click="playPreBack"><image class="play-icon icon-pre" src="https://xiaodamp.com/imbot/image/49add8b0-e0e6-11e8-b6e5-79c4537af773.png"></image></view>
      <view class="btn-footer btn-center" v-if="playState" @click="play"><image class="play-icon icon-play-1" src="https://xiaodamp.com/imbot/image/43be6050-e0e6-11e8-b6e5-79c4537af773.png"></image></view>
      <view class="btn-footer btn-center" v-else @click="stopBackAudio"><image class="play-icon" src="https://xiaodamp.com/imbot/image/3ebcca60-e0e6-11e8-b6e5-79c4537af773.png"></image></view>
      <!--<view class="btn-footer btn-center" @click="rePlay">重播</view>-->
      <view class="btn-footer" @click="playNextBack"><image class="play-icon icon-aft" src="https://xiaodamp.com/imbot/image/398a1250-e0e6-11e8-b6e5-79c4537af773.png"></image></view>
    </view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
        pinyin: '',
        pinyinArr: [],
        ttsArr: [],
        dictation: {},
        currentIndex: 0,
        rate: true,
        playState: true,
        innerAudioContext: '',
        audioUrl: '',
        timeout: '',
        timeTwins: '',
        timeoutBack: '',
        timeTwinsBack: '',
        ttsRole: 1,
        ttsSpeed: 1,
        times: 0,
        showAble: true,
        processIndex: 0
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
      getTts: function (wordsArr) {
        console.log(wordsArr)
        let ttsArr = []
        wordsArr.map((item, index) => {
          ttsArr.push({
            ttsFemale: item.ttsFemale,
            ttsMale: item.ttsMale
          })
        })
        return ttsArr
      },
      playPre: function () {
        if (this.currentIndex > 0) {
          this.innerAudioContext.offEnded()
          if (this.innerAudioContext) {
            this.innerAudioContext.stop()
          }
          if (this.timeout) {
            clearTimeout(this.timeout)
          }
          if (this.timeTwins) {
            clearTimeout(this.timeTwins)
          }
          this.times = 0
          this.currentIndex -= 1
          this.processIndex = this.currentIndex
          this.pinyin = this.pinyinArr[this.currentIndex]
          this.setAudioUrl()
          // this.audioUrl = this.ttsArr[this.currentIndex].ttsMale
          console.log('next:' + this.audioUrl)
          this.playAudio()
        }
      },
      playPreBack: function () {
        if (this.currentIndex > 0) {
          if (this.backgroundAudioContext) {
            this.backgroundAudioContext.stop()
          }
          if (this.timeoutBack) {
            clearTimeout(this.timeoutBack)
          }
          if (this.timeTwinsBack) {
            clearTimeout(this.timeTwinsBack)
          }
          this.times = 0
          this.currentIndex -= 1
          this.processIndex = this.currentIndex
          this.pinyin = this.pinyinArr[this.currentIndex]
          this.playBackAudio()
        }
      },
      playNext: function () {
        if (this.currentIndex < this.pinyinArr.length - 1) {
          this.innerAudioContext.offEnded()
          if (this.innerAudioContext) {
            this.innerAudioContext.stop()
          }
          if (this.timeout) {
            clearTimeout(this.timeout)
          }
          if (this.timeTwins) {
            clearTimeout(this.timeTwins)
          }
          this.times = 0
          this.currentIndex += 1
          console.log('这里执行了P139，值为： ' + this.currentIndex)
          this.setAudioUrl()
          // this.audioUrl = this.ttsArr[this.currentIndex].ttsMale
          this.pinyin = this.pinyinArr[this.currentIndex]
          this.processIndex = this.currentIndex
          console.log('pre:' + this.audioUrl)
          this.playAudio()
        }
      },
      playNextBack: function () {
        if (this.currentIndex < this.pinyinArr.length - 1) {
          if (this.backgroundAudioContext) {
            this.backgroundAudioContext.stop()
          }
          if (this.timeoutBack) {
            clearTimeout(this.timeoutBack)
          }
          if (this.timeTwinsBack) {
            clearTimeout(this.timeTwinsBack)
          }
          this.times = 0
          this.currentIndex += 1
          console.log('这里执行了P160，值为： ' + this.currentIndex)
          this.pinyin = this.pinyinArr[this.currentIndex]
          this.processIndex = this.currentIndex
          this.playBackAudio()
        }
      },
      rePlay: function () {
        this.innerAudioContext.offEnded()
        if (this.innerAudioContext) {
          this.innerAudioContext.stop()
        }
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        if (this.timeTwins) {
          clearTimeout(this.timeTwins)
        }
        this.times = 0
        this.currentIndex = 0
        this.processIndex = this.currentIndex
        this.pinyin = this.pinyinArr[this.currentIndex]
        this.setAudioUrl()
        // this.audioUrl = this.ttsArr[this.currentIndex].ttsMale
        this.playAudio()
      },
      play: function () {
        if (this.processIndex < 0) {
          this.backgroundAudioContext.title = '现在开始听写'
          this.backgroundAudioContext.src = (this.dictation.ttsSex === 0 || this.dictation.ttsSex === 'ttsFemale') ? 'https://xiaodamp.cn/asst/tts/5df1c480-e65e-11e8-9774-bd7f39b40d24.mp3' : 'https://xiaodamp.cn/asst/tts/5de2f770-e65e-11e8-9774-bd7f39b40d24.mp3'
          setTimeout(() => {
            this.processIndex = 0
            this.times = 0
            console.log('这里应该是0，实际是：' + this.currentIndex)
            this.playBackAudio(this.ttsArr, this.currentIndex)
          }, 5500)
        } else {
          this.playBackAudio(this.ttsArr, this.currentIndex)
        }
        // if (this.processIndex < 0) {
        //   this.processIndex = 0
        // }
        // this.times = 0
        // this.playBackAudio(this.ttsArr, this.currentIndex)
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
      stopBackAudio: function () {
        this.playState = true
        if (this.timeoutBack) {
          clearTimeout(this.timeoutBack)
        }
        if (this.timeTwinsBack) {
          clearTimeout(this.timeTwinsBack)
        }
        this.backgroundAudioContext.stop()
      },
      playAudio: function () {
        const that = this
        this.innerAudioContext.src = this.audioUrl
        this.innerAudioContext.play()
        this.innerAudioContext.onPlay(() => {
          this.playState = false
          this.showAble = false
        })
        this.innerAudioContext.onEnded(() => {
          if (this.currentIndex === this.ttsArr.length - 1 && this.times === this.dictation.playTimes - 1) {
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
            if (this.currentIndex < this.ttsArr.length - 1) {
              if (this.timeout) {
                clearTimeout(this.timeout)
              }
              this.timeout = setTimeout(() => {
                this.currentIndex += 1
                console.log('这里执行了P253，值为： ' + this.currentIndex)
                this.setAudioUrl()
                this.pinyin = this.pinyinArr[this.currentIndex]
                this.processIndex = this.currentIndex
                this.innerAudioContext.src = this.audioUrl
                this.innerAudioContext.play()
                if (this.timeout) {
                  clearTimeout(this.timeout)
                }
              }, parseInt(this.dictation.intervel) * 1000)
            }
          }
        })
      },
      playBackAudio: function () {
        this.backgroundAudioContext.title = this.pinyinArr[this.currentIndex]
        this.backgroundAudioContext.src = (this.dictation.ttsSex === 0 || this.dictation.ttsSex === 'ttsFemale') ? this.ttsArr[this.currentIndex].ttsFemale : this.ttsArr[this.currentIndex].ttsMale
        this.backgroundAudioContext.onPlay(() => {
          this.playState = false
          this.showAble = false
        })
        this.backgroundAudioContext.onEnded(() => {
          if (this.processIndex >= 0) {
            if (this.currentIndex === this.ttsArr.length - 1 && this.times === this.dictation.playTimes - 1) {
              this.setPlayStateTrue()
              setTimeout(() => {
                this.backgroundAudioContext.title = '全部词汇已经听写完成'
                this.backgroundAudioContext.src = (this.dictation.ttsSex === 0 || this.dictation.ttsSex === 'ttsFemale') ? ' https://xiaodamp.cn/asst/tts/5de73d30-e65e-11e8-9774-bd7f39b40d24.mp3' : 'https://xiaodamp.cn/asst/tts/5dee4210-e65e-11e8-9774-bd7f39b40d24.mp3'
              }, 1000)
            }
            this.times += 1
            if (this.times < this.dictation.playTimes) {
              if (this.timeTwinsBack) {
                clearTimeout(this.timeTwinsBack)
              }
              this.timeTwinsBack = setTimeout(() => {
                this.playBackAudio()
              }, 1000)
            } else {
              if (this.currentIndex < this.ttsArr.length - 1) {
                this.times = 0
                if (this.timeoutBack) {
                  clearTimeout(this.timeoutBack)
                }
                this.timeoutBack = setTimeout(() => {
                  this.currentIndex += 1
                  console.log('这里执行了P297，值为： ' + this.currentIndex)
                  this.pinyin = this.pinyinArr[this.currentIndex]
                  this.processIndex = this.currentIndex
                  this.playBackAudio()
                }, this.dictation.intervel * 1000)
              }
            }
          }
        })
        this.backgroundAudioContext.onNext(() => {
          this.playNextBack()
        })
        this.backgroundAudioContext.onPrev(() => {
          this.playPreBack()
        })
      },
      dicConvert: function () {
        this.pinyinArr = this.getPinyin(this.getConvert())
        this.pinyin = this.pinyinArr[0]
        this.currentIndex = 0
        this.processIndex = this.currentIndex
      },
      dicNormal: function () {
        this.pinyinArr = this.getPinyin([...this.dictation.words])
        this.currentIndex = 0
        this.processIndex = this.currentIndex
        this.pinyin = this.pinyinArr[this.currentIndex]
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
      },
      setOrder: function (playWay) {
        this.dictation.playWay = playWay
        if (playWay === 'order') {
          this.pinyinArr = this.getPinyin([...this.dictation.words])
          this.ttsArr = this.getTts([...this.dictation.words])
        } else {
          let arr = this.getConvert()
          this.pinyinArr = this.getPinyin(arr)
          this.ttsArr = this.getTts(arr)
        }
        this.$store.dispatch('updateDictation', {
          id: this.dictation.id,
          dictateWords: {
            title: this.dictation.title,
            active: this.dictation.active,
            words: this.dictation.words,
            playWay: this.dictation.playWay,
            playTimes: this.dictation.playTimes,
            intervel: this.dictation.intervel,
            ttsSex: this.dictation.ttsSex
          }
        }).then(res => {
          this.$store.dispatch('initDictation')
        }).catch(err => {
          console.log(err)
        })
        this.currentIndex = 0
        this.processIndex = this.currentIndex
        this.pinyin = this.pinyinArr[this.currentIndex]
        this.setAudioUrl()
        // this.audioUrl = this.ttsArr[this.currentIndex].ttsMale
      },
      setRole: function () {
        this.dictation.ttsSex = (this.dictation.ttsSex === 1 || this.dictation.ttsSex === 'ttsMale') ? 'ttsFemale' : 'ttsMale'
        this.setAudioUrl()
        this.$store.dispatch('updateDictation', {
          id: this.dictation.id,
          dictateWords: {
            title: this.dictation.title,
            active: this.dictation.active,
            words: this.dictation.words,
            playWay: this.dictation.playWay,
            playTimes: this.dictation.playTimes,
            intervel: this.dictation.intervel,
            ttsSex: this.dictation.ttsSex
          }
        }).then(res => {
          this.$store.dispatch('initDictation')
        }).catch(err => {
          console.log(err)
        })
      },
      setAudioUrl: function () {
        if (this.dictation.ttsSex === 1 || this.dictation.ttsSex === 'ttsMale') {
          this.audioUrl = this.ttsArr[this.currentIndex].ttsMale
        } else {
          this.audioUrl = this.ttsArr[this.currentIndex].ttsFemale
        }
      }
    },
    onShow () {
      if (this.currentIndex > 0) {
      } else {
        if (this.$mp.query.param) {
          this.showAble = true
          // this.innerAudioContext = wx.createInnerAudioContext()
          this.backgroundAudioContext = wx.getBackgroundAudioManager()
          this.dictation = JSON.parse(this.$mp.query.param)
          this.dictation.ttsSex = this.dictation.ttsSex === undefined ? 'ttsMale' : this.dictation.ttsSex
          if (this.dictation.playWay === 'order') {
            this.pinyinArr = this.getPinyin([...this.dictation.words])
            this.ttsArr = this.getTts([...this.dictation.words])
          } else {
            let arr = this.getConvert()
            this.pinyinArr = this.getPinyin(arr)
            this.ttsArr = this.getTts(arr)
          }
          this.currentIndex = 0
          this.processIndex = -1
          this.pinyin = this.pinyinArr[this.currentIndex]
          this.setAudioUrl()
        }
      }
    },
    onUnload (option) {
      console.log('unload')
      if (this.backgroundAudioContext) {
        this.backgroundAudioContext.stop()
      }
      if (this.timeoutBack) {
        clearTimeout(this.timeoutBack)
      }
      if (this.timeTwinsBack) {
        clearTimeout(this.timeTwinsBack)
      }
      this.backgroundAudioContext = ''
      this.playState = true
      this.times = 0
      this.currentIndex = 0
      this.processIndex = -1
    },
    onHide () {
      console.log('hide')
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
    margin-left: 5px;
  }
  .btn-rate-disable{
    background:#999;
  }
  .dic-pinyin{
    display:flex;
    flex-direction:column;
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
    font-size: 40px;
    letter-spacing: 1px;
    font-family:Songti SC;
  }
  .dic-footer{
    display: flex;
    justify-content: center;
    padding: 10px 15px 25px 15px;
  }
  .btn-footer{
    height:68rpx;
    border:2rpx solid #19a1a8;
    box-sizing:border-box;
    border-radius:34rpx;
    margin:0px 7px;
    display:flex;
    justify-content:center;
    align-items:center;
    width: 60px;
  }
  .play-icon{
    width: 28px;
    height: 28px;
  }
  .btn-center{
    width: 60px;
    text-align: center;
  }
  .icon-play-1{
    width: 24px;
    height: 24px;
  }
  .icon-aft{
    width: 32px;
    height: 32px;
  }
  .icon-pre{
    width: 30px;
    height: 30px;
  }
</style>
