<template>
  <view class="big-container">
    <title-bar :title="edit? '编辑词语' : '新增词语'"/>
    <view class="dic-edit-inner">
      <view class="dic-edit-inner-inner">
        <view class="dic-edit-name-box" style="margin-top: -172px;padding-right: 40px">
          <view class="dic-edit-name">词组名</view>
          <input class="dic-edit-title" type="text" :value="dictation.title" @blur="setValue($event, 'title')" @comfirm="setValue($event, 'title')">
          <view class="dic-words-num" v-if="dictation.words.length">{{dictation.words.length}}</view>
        </view>
        <view style="display: flex;height: 42px;">
          <view class="dic-edit-name-box half-container">
            <view class="dic-edit-name">播放方式</view>
            <view class="dic-edit-order">
              <text class="order-text" :class="dictation.playWay=='order'? 'active' : ''" @click="setOrder('order')">顺序</text>
              <text class="order-text" :class="dictation.playWay=='disorder' ? 'active' : ''" @click="setOrder('disorder')">乱序</text>
            </view>
          </view>
          <view class="dic-edit-name-box half-container">
            <view class="dic-edit-name">播放角色</view>
            <view class="dic-edit-order">
              <text class="order-text" :class="(dictation.ttsSex=='ttsMale' || dictation.ttsSex == 1)? 'active' : ''" @click="setRole('ttsMale')">男声</text>
              <text class="order-text" :class="(dictation.ttsSex=='ttsFemale' || dictation.ttsSex == 0) ? 'active' : ''" @click="setRole('ttsFemale')">女声</text>
            </view>
          </view>
        </view>
        <view style="display: flex;height: 42px;">
          <view class="dic-edit-name-box half-container">
            <view class="dic-edit-name">播放次数</view>
            <view class="counter-container">
              <daCounter :number="dictation.playTimes" max="3" min="1" @changenumber="setPlayTimes"/>
            </view>
          </view>
          <view class="dic-edit-name-box half-container">
            <view class="dic-edit-name">播放间隔</view>
            <view class="counter-container">
              <daCounter :number="dictation.intervel" max="15" min="3" @changenumber="setPlayIntervel"/>
            </view>
          </view>
        </view>
        <view class="dic-edit-name-box">
          <view class="dic-edit-name">
            新词
          </view>
          <!--<input class="dic-edit-add" v-if="dictation.words.length>0" @blur="setNew" @confirm="setNew" @focus="focus" confirm-hold confirm-type="next" type="text" :value="newWord" placeholder="请输入新的词语，按下一项添加" placeholder-style="color: #999" ref="newWord">-->
          <input class="dic-edit-add" @blur="setNew" @confirm="setNew" confirm-hold confirm-type="next" type="text" :value="newWord" placeholder="请输入新的词语，按下一项添加" placeholder-style="color: #999" ref="newWord">
          <!--<view class="add-icon">-->
            <!--<icon-com type="add" size="20" color="#333"/>-->
          <!--</view>-->
        </view>
        <view class="dic-edit-name-box" style="border-bottom: none;height: 100%;padding-left: 0" v-if="dictation.words.length">
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
      <view class="dic-foot-btn" @click="setActive">通过音箱听写</view>
      <button class="dic-foot-btn" open-type="share">分享给</button>
    </view>
    <block v-if="showPinyin">
      <dictation-modal :hanzi="hanzi" :pinyin="pinyin" :currentPinyin="currentPinyin" @select="selectPinyin"/>
    </block>
  </view>

</template>

<script>
  import { mapState } from 'vuex'
  import daCounter from '@/components/uicomponent/daCounter'
  import wechat from '@/store/modules/wechat'
  let clickFlag = true
  let clickFlag1 = true
  let t1 = ''
  let t2 = ''
  export default {
    data () {
      return {
        edit: false,
        hanzi: '',
        pinyin: '',
        currentPinyin: '',
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
        scrollTop: 'scrollTop',
        openId: ''
      }
    },
    components: {
      daCounter
    },
    computed: {
      ...mapState({
        dictateList: state => state.dictation.dictation,
        dicId: state => state.id.dicId,
        dicActiveId: state => state.id.dicActiveId
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
      getPolyphoneString: function (arr) {
        let word = []
        arr.map(item => {
          word.push(item)
        })
        return word
      },
      getArr: function (newWordArr, res, arr) {
        const that = this
        return new Promise((resolve, reject) => {
          newWordArr.map((item, index) => {
            (function (item, index) {
              let pinyin = that.getPinString(res[index].termPinyin)
              let polyphone = that.getPolyphoneString(res[index].wordPinyin)
              let tts = that.getPinyinTts([{term: item, pinyin: pinyin, polyphone: polyphone}])
              Promise.all([that.$store.dispatch('getPinyinVoice', {
                text: tts[0],
                speed: that.ttsSpeed,
                role: 1
              }), that.$store.dispatch('getPinyinVoice', {
                text: tts[0],
                speed: that.ttsSpeed,
                role: 0
              })]).then(ttsRes => {
                arr.push({term: item, pinyin: pinyin, polyphone: polyphone, ttsMale: ttsRes[0], ttsFemale: ttsRes[1]})
                if (arr.length >= newWordArr.length) {
                  resolve(arr)
                }
              })
            })(item, index)
          })
        })
      },
      setNew: function (e) {
        const that = this
        if (clickFlag) {
          clickFlag = false
          this.newWord = e.mp.detail.value
          if (/[0-9a-zA-Z]/g.test(this.newWord)) {
            wx.showModal({
              title: '词语格式提醒',
              content: '目前只支持中文词语,请重新输入新的中文词语',
              showCancel: false,
              complete: function () {
                clickFlag = true
              }
            })
          } else {
            let newWordArr = []
            if (this.newWord) {
              newWordArr = [...this.newWord.replace(/，/g, ',').split(',')]
            }
            if (newWordArr.length) {
              this.$store.dispatch('getPinyin', newWordArr).then(res => {
                let arr = []
                that.getArr(newWordArr, res, arr).then(resp => {
                  this.$store.dispatch('updateDictation', {
                    id: this.dictation.id,
                    dictateWords: {
                      title: this.dictation.title,
                      active: this.dictation.active,
                      playWay: this.dictation.playWay,
                      playTimes: this.dictation.playTimes,
                      intervel: this.dictation.intervel,
                      ttsSex: this.dictation.ttsSex,
                      words: this.dictation.words.concat(resp)
                    }
                  }).then(res => {
                    this.edit = true
                    this.$store.dispatch('initDictation')
                    if (this.newWord) {
                      this.dictation.words = [...this.dictation.words, ...resp]
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
              })
            } else {
              clickFlag = true
            }
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
              this.dictation.playWay = newVal
              break
            case 'role':
              this.dictation.ttsSex = newVal
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
            this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
            clickFlag1 = true
          }).catch(err => {
            clickFlag1 = true
            console.log(err)
            wx.showToast({
              title: '保存失败'
            })
          })
        }
      },
      deleteText: function (index) {
        let arr = [...this.dictation.words]
        arr.splice(this.dictation.words.length - index - 1, 1)
        this.dictation.words = [...arr]
        this.$store.dispatch('updateDictation', {
          id: this.dictation.id,
          dictateWords: {
            title: this.dictation.title,
            active: this.dictation.active,
            playWay: this.dictation.playWay,
            playTimes: this.dictation.playTimes,
            intervel: this.dictation.intervel,
            ttsSex: this.dictation.ttsSex,
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
      },
      setOrder: function (order) {
        this.editDictation(order, 'order')
      },
      setRole: function (role) {
        this.editDictation(role, 'role')
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
      setActive () {
        if (this.dictation.words.length) {
          if (this.preActive && this.preActive.id && this.preActive.id !== this.activeDictation.id) {
            this.$store.dispatch('updateDictation', {
              id: this.preActive.id,
              dictateWords: {
                title: this.preActive.title,
                active: !this.preActive.active,
                playWay: this.preActive.playWay || 'order',
                playTimes: this.preActive.playTimes || 2,
                intervel: this.preActive.intervel || 10,
                ttsSex: this.preActive.ttsSex,
                words: this.preActive.words
              }
            })
          }
          if ((this.preActive && this.preActive.id && this.preActive.id !== this.activeDictation.id) || !this.preActive || !this.preActive.id) {
            this.$store.dispatch('getSmartSpeakers').then(res => {
              if (res.bindingTypes.length) {
                console.log(this.activeDictation)
                this.activeDictation.active = !this.activeDictation.active
                this.$store.dispatch('updateDictation', {
                  id: this.activeDictation.id,
                  dictateWords: {
                    title: this.activeDictation.title,
                    active: this.activeDictation.active,
                    playWay: this.activeDictation.playWay || 'order',
                    playTimes: this.activeDictation.playTimes || 2,
                    intervel: this.activeDictation.intervel || 10,
                    ttsSex: this.activeDictation.ttsSex,
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
        } else {
          wx.showModal({
            title: '还没有听写词汇',
            content: '请添加听写词汇，然后在设置音箱播放',
            showCancel: false
          })
        }
      },
      changePinyin: function (e, ourterIndex) {
        const {index, polyphone, hanzi, pinyin} = e.mp.detail
        console.log(index, polyphone, hanzi, pinyin)
        if (polyphone.length > 1) {
          this.showPinyin = true
          this.pinyin = polyphone
          this.currentPinyin = pinyin
          this.hanzi = hanzi
          this.wordsIndex = this.dictation.words.length - ourterIndex - 1
          this.pinyinIndex = index
        }
      },
      selectPinyin: function (e) {
        const that = this
        this.dictation.words[this.wordsIndex].pinyin[this.pinyinIndex] = [e.mp.detail]
        let tts = this.getPinyinTts([this.dictation.words[this.wordsIndex]])
        Promise.all([that.$store.dispatch('getPinyinVoice', {
          text: tts[0],
          speed: that.ttsSpeed,
          role: 1
        }), that.$store.dispatch('getPinyinVoice', {
          text: tts[0],
          speed: that.ttsSpeed,
          role: 0
        })]).then(ttsRes => {
          that.dictation.words[that.wordsIndex].ttsFemale = ttsRes[1]
          that.dictation.words[that.wordsIndex].ttsMale = ttsRes[0]
          that.$store.dispatch('updateDictation', {
            id: that.dictation.id,
            dictateWords: {
              title: that.dictation.title,
              active: that.dictation.active,
              words: that.dictation.words,
              playWay: that.dictation.playWay,
              playTimes: that.dictation.playTimes,
              intervel: that.dictation.intervel,
              ttsSex: that.dictation.ttsSex
            }
          }).then(res => {
            this.edit = true
            that.$store.dispatch('initDictation')
            that.activeDictation = JSON.parse(JSON.stringify(that.dictation))
            that.dictation.words = [...that.dictation.words]
            that.showPinyin = false
            clickFlag1 = true
          }).catch(err => {
            clickFlag1 = true
            that.showPinyin = false
            console.log(err)
            wx.showToast({
              title: '保存失败'
            })
          })
        })
      },
      toPlay: function () {
        if (this.dictation.words.length) {
          wx.navigateTo({
            url: '/pages/dictationPlay/main?param=' + JSON.stringify(this.dictation)
          })
        } else {
          wx.showModal({
            title: '没有要听写的单词',
            content: '请添加要听写的单词',
            showCancel: false
          })
        }
      },
      stopPinyin: function (e, index) {
        this.playState[index].value = false
        this.innerAudioContext.offEnded()
        if (this.innerAudioContext) {
          this.innerAudioContext.pause()
          this.playIndex = ''
        }
      },
      playPinyin: function (e, index) {
        const {ttsFemale, ttsMale} = e.mp.detail
        this.playState.map(item => {
          item.value = false
        })
        this.playState[index].value = true
        this.playIndex = index
        if (this.dictation.ttsSex === 'ttsMale' || this.dictation.ttsSex === 1) {
          this.voiceUrl = ttsMale
        } else {
          this.voiceUrl = ttsFemale
        }
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
      },
      getPinyinTts: function (wordsArr) {
        let pinyinTtsArr = []
        wordsArr.map((item, index) => {
          let str = ''
          item.pinyin.map((py, pyIndex) => {
            if (/[ǖǘǚǜ]/g.test(py[0])) {
              str += item.term.substring(pyIndex, pyIndex + 1) + ','
            } else {
              str += item.term.substring(pyIndex, pyIndex + 1) + '(' + this.getPinyinForm(py[0]) + ')' + ','
            }
          })
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
      }
    },
    onShow (option) {
      // this.$store.dispatch('getPinyinVoice', {
      //   text: '现(xian4)在(zai4)开(kai1)始(shi3)听(ting1)写(xie3)',
      //   speed: 5,
      //   role: 1
      // })
      // this.$store.dispatch('getPinyinVoice', {
      //   text: '现(xian4)在(zai4)开(kai1)始(shi3)听(ting1)写(xie3)',
      //   speed: 5,
      //   role: 0
      // })
      // this.$store.dispatch('getPinyinVoice', {
      //   text: '全(quan2)部(bu4)词(ci2)汇(hui4)已(yi3)经(jing1)听(ting1)写(xie3)完(wan2)成(cheng2)',
      //   speed: 5,
      //   role: 1
      // })
      // this.$store.dispatch('getPinyinVoice', {
      //   text: '全(quan2)部(bu4)词(ci2)汇(hui4)已(yi3)经(jing1)听(ting1)写(xie3)完(wan2)成(cheng2)',
      //   speed: 5,
      //   role: 0
      // })
      wechat.getOpenId().then(res => {
        this.openId = res
      })
      this.innerAudioContext = wx.createInnerAudioContext()
      this.$store.dispatch('initDictation').then(res => {
        if (this.$mp.query.active !== 'undefined') {
          this.preActive = res.data.data.find(item => item.id === this.$mp.query.active)
          if (this.preActive) {
            this.preActive.ttsSex = this.preActive.ttsSex === undefined ? 'ttsMale' : this.preActive.ttsSex
          }
        }
        this.dictation = res.data.data.find(item => item.id === this.$mp.query.param)
        this.activeDictation = res.data.data.find(item => item.id === this.$mp.query.param)
        this.dictation.ttsSex = this.dictation.ttsSex === undefined ? 'ttsMale' : this.dictation.ttsSex
        this.activeDictation.ttsSex = this.activeDictation.ttsSex === undefined ? 'ttsMale' : this.activeDictation.ttsSex
        this.edit = false
        this.title = this.dictation.title
        this.playTimes = this.dictation.playTimes
        this.intervel = this.dictation.intervel
      })
    },
    onHide () {
      // if (this.innerAudioContext) {
      //   this.innerAudioContext.destroy()
      // }
    },
    onShareAppMessage: function () {
      return {
        title: '词汇详情',
        path: '/pages/dictation/main?openId=' + this.openId + '&shareId=' + JSON.stringify(this.dictation)
      }
    },
    onLoad (option) {
    },
    onUnload () {
      if (!this.dictation.words.length) {
        this.$store.dispatch('deleteDictation', this.dictation.id).then(res => {
          this.$store.dispatch('initDictation')
        })
      }
      // if (this.innerAudioContext) {
      //   this.innerAudioContext.destroy()
      // }
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
    padding-top: 172px;
  }
  .dic-edit-name-box{
    padding-left:65px;
    border-bottom:1px solid #d8d8d8;
    height:42px;
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
    width:65px;
    float:left;
    margin-left:-65px;
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
  .dic-edit-new{
    padding-right: 30px;
  }
  .dic-edit-add{
    line-height:40px;
    height:40px;
    border-radius:5px;
    font-size:16px;
  }
  .add-icon{
    float:right;
    margin-right:-30px;
    width:30px;
    height:40px;
    margin-top:-40px;
    text-align:right;
    line-height:40px;
    box-sizing:border-box;
    padding-right:3px;

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
    padding:5px 5px;
    border-radius:14px;
    margin-right:10px;
    color:#999;
    font-size: 13px;
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
