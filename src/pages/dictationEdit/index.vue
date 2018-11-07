<template>
  <view class="big-container">
    <title-bar :title="edit? '编辑词语' : '新增词语'"/>
    <view class="dic-edit-inner">
      <view class="dic-edit-inner-inner">
        <view class="dic-edit-name-box" style="margin-top: -164px;padding-right: 40px">
          <view class="dic-edit-name">词组名</view>
          <input class="dic-edit-title" type="text" :value="dictation.title" @blur="setValue($event, 'title')" @comfirm="setValue($event, 'title')">
          <view class="dic-words-num" v-if="dictation.words.length">{{dictation.words.length}}</view>
        </view>

        <view class="dic-edit-name-box">
          <view class="dic-edit-name">播放方式</view>
          <view class="dic-edit-order" @click="setValue($event, 'order')">
            <text class="order-text" :class="dictation.playWay=='order'? 'active' : ''">顺序</text>
            <text class="order-text" :class="dictation.playWay=='disorder' ? 'active' : ''">乱序</text>
          </view>
        </view>
        <view style="display: flex">
          <view class="dic-edit-name-box half-container">
            <view class="dic-edit-name">播放次数</view>
            <!--<input class="dic-edit-add" @blur="setValue($event, 'playTimes')" @confirm="setValue($event, 'playTimes')" confirm-hold  type="number" maxlength="1" minlength="1" :value="dictation.playTimes" placeholder-style="color: #999">-->
            <view class="counter-container">
              <daCounter :number="dictation.playTimes" max="3" min="1" @changenumber="setPlayTimes"/>
            </view>
          </view>
          <view class="dic-edit-name-box half-container">
            <view class="dic-edit-name">播放间隔</view>
            <!--<input class="dic-edit-add" @blur="setValue($event, 'intervel')" @confirm="setValue($event, 'intervel')" confirm-hold type="number" :value="dictation.intervel" placeholder="单位(s)" placeholder-style="color: #999" maxlength="2" minlength="1">-->
            <view class="counter-container">
              <daCounter :number="dictation.intervel" max="15" min="1" @changenumber="setPlayIntervel"/>
            </view>
          </view>
        </view>
        <view class="dic-edit-name-box">
          <view class="dic-edit-name">
            新词
            <!--<view class="dic-words-num" v-if="dictation.words.length">{{dictation.words.length}}</view>-->
          </view>
          <input class="dic-edit-add" focus @blur="setNew" @confirm="setNew" confirm-hold confirm-type="next" type="text" :value="newWord" placeholder="请输入新的词语，按下一项添加" placeholder-style="color: #999" ref="newWord">
        </view>

        <view class="dic-edit-name-box" style="border-bottom: none;height: 100%;padding-left: 0" v-if="dictation.words.length">
          <!--<view class="dic-edit-name">词组</view>-->
          <scroll-view scroll-y class="dic-edit-scroll" :scroll-into-view="scrollTop" style="height: 100%" >
            <view class="dic-edit-text-container">
              <view class="dic-edit-text-inner"  :id="'scrollTop' + (dicWords.length - index)" v-for="(text, index) in dicWords" :key="index">
                <view class="dic-edit-index">{{dicWords.length - index}}</view>
                <dictation-word :content="text" :playState="playState[index]" :index="index" @deleteText="deleteText(index)" @changePinyin="changePinyin($event, index)" @playPinyin="playPinyin($event, index)" @stopPinyin="stopPinyin($event, index)"/>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <view class="dic-footer">
      <view class="dic-foot-btn" @click="toPlay">开始听写</view>
      <view class="dic-foot-btn"  v-if="edit" @click="setActive">通过音箱听写</view>
      <button class="dic-foot-btn" open-type="share">分享给</button>
      <!--<view class="dic-foot-btn" @click="bindPhone">关联智能音箱</view>-->
    </view>
    <block v-if="showPinyin">
      <dictation-modal :hanzi="hanzi" :pinyin="pinyin" @select="selectPinyin"/>
    </block>
  </view>

</template>

<script>
  import { mapState } from 'vuex'
  import Time from '@/utils/time'
  import daCounter from '@/components/uicomponent/daCounter'
  let clickFlag = true
  let clickFlag1 = true
  let t1 = ''
  let t2 = ''
  export default {
    data () {
      return {
        edit: true,
        hanzi: '',
        pinyin: '',
        wordsIndex: '',
        pinyinIndex: '',
        showPinyin: false,
        dictation: {},
        activeDictation: {},
        preActive: {},
        newWord: '',
        playWay: 'order',
        title: '',
        playTimes: 2,
        intervel: 10,
        ttsRole: 1,
        ttsSpeed: 1,
        voiceUrl: '',
        innerAudioContext: '',
        playIndex: '',
        playState: [],
        scrollTop: 'scrollTop'
      }
    },
    components: {
      daCounter
    },
    computed: {
      ...mapState({
        dictateList: state => state.dictation.dictation
      }),
      dicWords: state => {
        let arr = [...state.dictation.words].reverse()
        arr.map(item => {
          state.playState.push({value: false})
        })
        return arr
      }
    },
    methods: {
      getPinString: function (arr) {
        let word = []
        arr.map(item => {
          word.push([item[0]])
        })
        return word
      },
      setNew: function (e) {
        if (clickFlag) {
          clickFlag = false
          this.newWord = e.mp.detail.value
          console.log(this.newWord)
          let newWordArr = []
          if (this.newWord) {
            newWordArr = [...this.newWord.replace(/，/g, ',').split(',')]
          }
          if (newWordArr.length) {
            if (this.edit) {
              this.$store.dispatch('getPinyin', newWordArr).then(res => {
                let arr = []
                newWordArr.map((item, index) => {
                  arr.push({term: item, pinyin: this.getPinString(res[index].termPinyin)})
                })
                this.$store.dispatch('updateDictation', {
                  id: this.dictation.id,
                  dictateWords: {
                    title: this.dictation.title,
                    active: this.dictation.active,
                    playWay: this.dictation.playWay,
                    playTimes: this.dictation.playTimes,
                    intervel: this.dictation.intervel,
                    words: this.dictation.words.concat(arr)
                  }
                }).then(res => {
                  this.$store.dispatch('initDictation')
                  if (this.newWord) {
                    this.dictation.words = [...this.dictation.words, ...arr]
                  }
                  this.scrollTop = 'scrollTop' + this.dicWords.length
                  this.newWord = ''
                  this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
                  clickFlag = true
                }).catch(err => {
                  clickFlag = true
                  console.log(err)
                  wx.showToast({
                    title: '添加失败'
                  })
                })
              })
            } else {
              this.$store.dispatch('getPinyin', newWordArr).then(res => {
                let arr = []
                newWordArr.map((item, index) => {
                  arr.push({term: item, pinyin: this.getPinString(res[index].termPinyin)})
                })
                this.$store.dispatch('newDictation', {
                  openId: '',
                  dictateWords: {
                    title: this.dictation.title,
                    active: false,
                    playWay: this.playWay,
                    playTimes: this.playTimes,
                    intervel: this.intervel,
                    words: this.dictation.words.concat(arr)
                  }
                }).then(res => {
                  this.$store.dispatch('initDictation')
                  if (this.newWord) {
                    this.dictation.words = [...this.dictation.words, ...arr]
                  }
                  this.scrollTop = 'scrollTop' + (this.dicWords.length - 1)
                  this.dictation.id = res.data.id
                  this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
                  this.newWord = ''
                  this.edit = true
                  clickFlag = true
                }).catch(err => {
                  clickFlag = true
                  console.log(err)
                  wx.showToast({
                    title: '添加失败'
                  })
                })
              })
            }
          } else {
            clickFlag = true
          }
        }
      },
      setValue: function (e, value) {
        this.editDictation(e.mp.detail.value, value)
      },
      editDictation: function (newVal, value) {
        if (clickFlag1) {
          clickFlag1 = false
          switch (value) {
            case 'title':
              if (this.title === newVal) {
                clickFlag1 = true
                return
              } else {
                this.dictation.title = newVal
                this.title = newVal
                break
              }
            case 'playTimes':
              if (this.playTimes === newVal) {
                clickFlag1 = true
                return
              } else {
                this.dictation.playTimes = parseInt(newVal)
                if (this.dictation.playTimes >= 1 && this.dictation.playTimes <= 3) {
                  this.playTimes = parseInt(newVal)
                  break
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '播放次数最少一次，最多三次，请重新填写',
                    success (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                  clickFlag1 = true
                  return
                }
              }
            case 'intervel':
              if (this.intervel === newVal) {
                clickFlag1 = true
                return
              } else {
                this.dictation.intervel = parseInt(newVal)
                if (this.dictation.intervel >= 3 && this.dictation.intervel <= 15) {
                  this.intervel = parseInt(newVal)
                  break
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '播放间隔最短三秒，最长15秒，请重新填写',
                    success (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                  clickFlag1 = true
                  return
                }
              }
            case 'order':
              this.dictation.playWay = this.dictation.playWay === 'order' ? 'disorder' : 'order'
              break
          }
          if (this.edit) {
            this.$store.dispatch('updateDictation', {
              id: this.dictation.id,
              dictateWords: {
                title: this.dictation.title,
                active: this.dictation.active,
                words: this.dictation.words,
                playWay: this.dictation.playWay,
                playTimes: this.dictation.playTimes,
                intervel: this.dictation.intervel
              }
            }).then(res => {
              this.$store.dispatch('initDictation')
              this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
              clickFlag1 = true
            }).catch(err => {
              clickFlag1 = true
              console.log(err)
              wx.showToast({
                title: '保存失败'
              })
            })
          } else {
            this.$store.dispatch('newDictation', {
              openId: '',
              dictateWords: {
                title: this.dictation.title,
                active: false,
                words: this.dictation.words,
                playWay: this.dictation.playWay,
                playTimes: this.dictation.playTimes,
                intervel: this.dictation.intervel
              }
            }).then(res => {
              this.$store.dispatch('initDictation')
              this.dictation.id = res.data.id
              this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
              this.edit = true
              clickFlag1 = true
            }).catch(err => {
              console.log(err)
              wx.showToast({
                title: '保存失败'
              })
              clickFlag1 = true
            })
          }
        }
      },
      deleteText: function (index) {
        let arr = [...this.dictation.words]
        arr.splice(this.dictation.words.length - index - 1, 1)
        this.dictation.words = [...arr]
        if (this.edit) {
          this.$store.dispatch('updateDictation', {
            id: this.dictation.id,
            dictateWords: {
              title: this.dictation.title,
              active: this.dictation.active,
              playWay: this.dictation.playWay,
              playTimes: this.dictation.playTimes,
              intervel: this.dictation.intervel,
              words: this.dictation.words
            }
          }).then(res => {
            this.$store.dispatch('initDictation')
            if (this.newWord) {
              this.dictation.words = [...this.dictation.words]
            }
            this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
          }).catch(err => {
            console.log(err)
            wx.showToast({
              title: '保存失败'
            })
          })
        } else {
          this.$store.dispatch('newDictation', {
            openId: '',
            dictateWords: {
              title: this.dictation.title,
              active: false,
              playWay: this.dictation.playWay,
              playTimes: this.dictation.playTimes,
              intervel: this.dictation.intervel,
              words: this.dictation.words
            }
          }).then(res => {
            this.$store.dispatch('initDictation')
            if (this.newWord) {
              this.dictation.words = [...this.dictation.words]
            }
            this.dictation.id = res.data.id
            this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
            this.edit = true
          }).catch(err => {
            console.log(err)
            wx.showToast({
              title: '保存失败'
            })
          })
        }
      },
      setPlayTimes: function (e) {
        if (t1) {
          clearTimeout(t1)
        }
        t1 = setTimeout(() => {
          this.editDictation(e.number, 'playTimes')
          clearTimeout(t1)
        }, 300)
      },
      setPlayIntervel: function (e) {
        if (t2) {
          clearTimeout(t2)
        }
        t2 = setTimeout(() => {
          this.editDictation(e.number, 'intervel')
          clearTimeout(t2)
        }, 300)
      },
      setActive: function () {
        if (this.preActive && this.preActive.id && this.preActive.id !== this.activeDictation.id) {
          this.$store.dispatch('updateDictation', {
            id: this.preActive.id,
            dictateWords: {
              title: this.preActive.title,
              active: !this.preActive.active,
              words: this.preActive.words
            }
          })
        }
        if ((this.preActive && this.preActive.id && this.preActive.id !== this.activeDictation.id) || !this.preActive || !this.preActive.id) {
          this.$store.dispatch('getSmartSpeakers').then(res => {
            if (res.bindingTypes.length) {
              this.activeDictation.active = !this.activeDictation.active
              this.$store.dispatch('updateDictation', {
                id: this.activeDictation.id,
                dictateWords: {
                  title: this.activeDictation.title,
                  active: this.activeDictation.active,
                  words: this.activeDictation.words
                }
              }).then(res => {
                this.$store.dispatch('initDictation')
                if (this.activeDictation.active) {
                  this.preActive = this.dictateList.find(item => item.id === this.activeDictation.id)
                }
                wx.showModal({
                  title: '设置成功',
                  content: '现在请对音箱说："打开词语听写"，开始听写吧！',
                  showCancel: false
                })
              }).catch(err => {
                console.log(err)
                wx.showToast({
                  title: '设置失败'
                })
              })
            } else {
              wx.navigateTo({
                url: '/pages/smartSpeaker/main'
              })
            }
          })
        } else {
          wx.showModal({
            content: '现在请对音箱说："打开词语听写"，开始听写吧！',
            showCancel: false
          })
        }
        console.log(this.activeDictation)
      },
      changePinyin: function (e, index) {
        const that = this
        let hanzi = this.dictation.words[this.dictation.words.length - index - 1].term.substr(e.mp.detail, 1)
        let pinyinIndex = e.mp.detail
        this.$store.dispatch('getPinyin', [hanzi]).then(res => {
          if (res[0].wordPinyin[0].length > 1) {
            that.showPinyin = true
            that.pinyin = res[0].wordPinyin[0]
            that.hanzi = hanzi
            that.wordsIndex = this.dictation.words.length - index - 1
            that.pinyinIndex = pinyinIndex
          }
        })
      },
      selectPinyin: function (e) {
        this.dictation.words[this.wordsIndex].pinyin[this.pinyinIndex] = [e.mp.detail]
        this.$store.dispatch('updateDictation', {
          id: this.dictation.id,
          dictateWords: {
            title: this.dictation.title,
            active: this.dictation.active,
            words: this.dictation.words,
            playWay: this.dictation.playWay,
            playTimes: this.dictation.playTimes,
            intervel: this.dictation.intervel
          }
        }).then(res => {
          this.$store.dispatch('initDictation')
          this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
          this.dictation.words = [...this.dictation.words]
          this.showPinyin = false
          clickFlag1 = true
        }).catch(err => {
          clickFlag1 = true
          this.showPinyin = false
          console.log(err)
          wx.showToast({
            title: '保存失败'
          })
        })
      },
      bindPhone: function () {
        wx.navigateTo({
          url: '/pages/smartSpeaker/main'
        })
      },
      toPlay: function () {
        wx.navigateTo({
          url: '/pages/dictationPlay/main?param=' + JSON.stringify(this.dictation)
        })
      },
      stopPinyin: function (e, index) {
        console.log('stop')
        console.log(index)
        this.playState[index].value = false
        this.innerAudioContext.offEnded()
        if (this.innerAudioContext) {
          this.innerAudioContext.pause()
          this.playIndex = ''
        }
      },
      playPinyin: function (e, index) {
        this.playState.map(item => {
          item.value = false
        })
        this.playState[index].value = true
        this.playIndex = index
        this.$store.dispatch('getPinyinVoice', {
          text: e.mp.detail[0],
          speed: this.ttsSpeed,
          role: this.ttsRole
        }).then(res => {
          this.voiceUrl = res
          this.innerAudioContext.offEnded()
          if (this.innerAudioContext) {
            this.innerAudioContext.stop()
          }
          this.innerAudioContext.src = this.voiceUrl
          this.innerAudioContext.play()
          this.innerAudioContext.onEnded(() => {
            this.playIndex = ''
            this.playState[index].value = false
          })
        })
      }
    },
    onShow (option) {
      if (option && option.shareId) {
        console.log('shareId')
        console.log(option.shareId)
        console.log(JSON.parse(option.shareId))
      }
      this.innerAudioContext = wx.createInnerAudioContext()
      if (this.$mp.query.active) {
        this.preActive = this.dictateList.find(item => item.id === this.$mp.query.active)
      }
      if (this.$mp.query.param) {
        this.dictation = this.dictateList.find(item => item.id === this.$mp.query.param)
        this.activeDictation = this.dictateList.find(item => item.id === this.$mp.query.param)
        this.edit = true
      } else {
        this.dictation = {
          title: Time.getFormatTime(),
          words: [],
          active: false,
          playWay: 'order',
          playTimes: 2,
          intervel: 15
        }
        this.activeDictation = {
          title: Time.getFormatTime(),
          words: [],
          active: false,
          playWay: 'order',
          playTimes: 2,
          intervel: 15
        }
        this.edit = false
      }
      this.title = this.dictation.title
      this.playTimes = this.dictation.playTimes
      this.intervel = this.dictation.intervel
    },
    onHide () {
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy()
      }
    },
    onShareAppMessage: function () {
      return {
        title: '词汇详情',
        path: '/pages/dictationEdit/main?shareId=' + JSON.stringify(this.dictation)
      }
    },
    onLoad (option) {
      console.log(option)
    },
    onUnload () {
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy()
      }
    }
  }
</script>

<style scoped>
  .big-container{
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .dic-edit-inner{
    display: flex;
    flex: 1;
    border-bottom: 1px solid #d8d8d8;
  }
  .dic-edit-inner-inner{
    padding:0 15px;
    background:#fff;
    box-sizing: border-box;
    padding-bottom: 15px;
    width: 100%;
    height:100%;
    padding-top: 164px;
  }
  .dic-edit-name-box{
    padding-left:80px;
    border-bottom:1px solid #d8d8d8;
    min-height:41px;
  }
  .dic-words-num{
    display:inline-block;
    background:#999;
    color:#fff;
    min-width:20px;
    height:20px;
    line-height:20px;
    text-align:center;
    border-radius:10px;
    padding:0 5px;
    box-sizing:border-box;
    font-size:14px;
    float:right;
    margin-right:-40px;
    margin-top:-30px;

  }
  .dic-edit-name{
    width:80px;
    float:left;
    margin-left:-75px;
    height:40px;
    line-height:40px;
    font-weight: 500;
  }
  .dic-edit-title{
    line-height:40px;
    height:40px;
    border-radius:5px;
    font-size: 16px;
  }
  .dic-edit-order{
    height:40px;
    line-height:40px;
  }
  .dic-edit-scroll{
    /*max-height:225px;*/
  }
  .dic-edit-text-container{
    display:flex;
    flex-direction: column;
  }
  .dic-edit-text-inner{
    line-height:13px;
    box-sizing:border-box;
    color: #333;
    border-bottom: 1px solid #d8d8d8;
    padding-left: 24px;
  }
  .half-container{
    width: 50%;
  }
  .counter-container{
    height: 34px;
    margin-top: 6px;
  }
  .dic-edit-text{
    font-size: 14px;
    color: #fff;
  }
  .del-icon{
    float:right;
    margin-right:-30px;
    height:30px;
    width:30px;
    text-align:center;
  }
  .dic-edit-add{
    line-height:40px;
    height:40px;
    border-radius:5px;
    font-size:16px;
  }
  .dic-tip{
    font-size: 14px;
    color: #999;
  }
  .dic-edit-fun-box{
    display:flex;
    justify-content:space-around;
    padding-top:15px;
  }
  .dic-btn{
    height:40px;
    line-height:40px;
    text-align:center;
    border-radius:10rpx;
    color:#fff;
    font-size:32rpx;
    flex:1;
  }
  .btn-success{
    background:#19a1a8;
    border-bottom-right-radius:0px;
    border-top-right-radius:0px;
  }
  .btn-fail{
    background: #eaeaea;
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
  }
  .dic-footer{
    display: flex;
    min-height: 41px;
    height: auto;
    justify-content: center;
    margin-bottom: 50rpx;
    margin-top: 20rpx;
  }
  .dic-foot-btn{
    font-size: 28rpx;
    margin-left: 15rpx;
    margin-right: 15rpx;
    line-height: 32px;
    height: 34px;
    box-sizing: border-box;
    white-space: nowrap;
    background: #f2f2f2;
    border: 1px solid #19a1a8;
    color: #19a1a8;
    border-radius: 35rpx;
    padding: 0rpx 20rpx;
    text-align: center;
    box-shadow: 0 0 0;
    font-weight: 500;
    min-width: 60rpx;
  }
  .active-btn{
    background: #19a1a8;
    color: #fff;
  }
  .order-text{
    border:1px solid #999;
    padding:5px 10px;
    border-radius:14px;
    margin-right:10px;
    color:#999;
  }
  .active{
    border:1px solid #19a1a8;
    background: #19a1a8;
    color: #fff;
  }
  .dic-edit-index{
    float:left;
    width:24px;
    margin-left:-24px;
    padding-top:32px;
    line-height:32px;
    font-size:16px;
    text-align:center;
    color:#999;
  }
</style>
