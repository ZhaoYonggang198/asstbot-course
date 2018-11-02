<template>
  <view class="dic-container">
    <title-bar title="听写词语"/>
    <view class="dic-content">
      <view class="dic-content-inner">
        <view class="rate-box">
          <view class="btn-rate" @click="dicConvert" v-if="dictation.playWay=='order'">乱序听写</view>
          <view class="btn-rate" @click="dicNormal" v-else>顺序听写</view>
        </view>
        <view class="dic-pinyin">
          <view class="dic-circle-box">
            <view class="dic-circle">
              <view class="dic-circle-word">{{pinyin}}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="dic-footer">
      <view class="btn-footer" @click="playPre">上一个</view>
      <view class="btn-footer" v-if="playState" @click="play">PLAY</view>
      <view class="btn-footer" v-else @click="stop">STOP</view>
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
        currentIndex: 0,
        rate: true,
        playState: true,
        innerAudioContext: '',
        audioUrl: ''
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
      playPre: function () {
        if (this.currentIndex > 0) {
          this.currentIndex = --this.currentIndex
          this.pinyin = this.pinyinArr[this.currentIndex]
        }
      },
      playNext: function () {
        if (this.currentIndex < this.pinyinArr.length - 1) {
          this.currentIndex = ++this.currentIndex
          this.pinyin = this.pinyinArr[this.currentIndex]
        }
      },
      play: function () {
        const that = this
        this.playState = !this.playState
        this.innerAudioContext = wx.createInnerAudioContext()
        this.innerAudioContext.src = this.audioUrl
        this.innerAudioContext.play()
        this.innerAudioContext.onEnded(() => {
          that.playState = !that.playState
        })
      },
      stop: function () {
        this.playState = !this.playState
        console.log('stop')
        console.log(this.currentIndex)
        console.log(this.pinyin)
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
      }
    },
    onShow () {
      if (this.$mp.query.param) {
        this.dictation = JSON.parse(this.$mp.query.param)
        this.pinyinArr = this.getPinyin([...this.dictation.words])
        this.pinyin = this.pinyinArr[0]
        this.currentIndex = 0
        this.$store.dispatch('getPinyinVoice', {
          text: '杨(yang1)国(guo1)伟(wei3)',
          speed: 1,
          role: 2
        }).then(res => {
          this.audioUrl = res
        })
      }
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
    flex: 1;
    border-bottom: 1px solid #d8d8d8;
    background: #fff;
  }
  .dic-content-inner{
    padding: 50px 0px 15px;
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
    /*display:flex;*/
    /*justify-content:center;*/
    /*align-items:center;*/
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
</style>
