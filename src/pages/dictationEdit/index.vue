<template>
  <view class="big-container">
    <title-bar :title="edit? '编辑词语' : '新增词语'"/>
    <view class="dic-edit-inner">
      <view class="dic-edit-inner-inner">
        <view class="dic-edit-name-box" style="margin-top: -205px;padding-right: 40px">
          <view class="dic-edit-name">词组名</view>
          <input class="dic-edit-title" type="text" :value="dictation.title" @blur="setValue($event, 'title')" @comfirm="setValue($event, 'title')">
          <view class="dic-words-num" v-if="dictation.words.length">{{dictation.words.length}}</view>
        </view>

        <view class="dic-edit-name-box">
          <view class="dic-edit-name">播放方式</view>
          <view class="dic-edit-order" @click="setValue($event, 'order')"><text>{{dictation.playWay=='order'? '顺序' : '乱序'}}</text></view>
        </view>

        <view class="dic-edit-name-box">
          <view class="dic-edit-name">播放次数</view>
          <input class="dic-edit-add" @blur="setValue($event, 'playTimes')" @confirm="setValue($event, 'playTimes')" confirm-hold  type="number" maxlength="1" minlength="1" :value="dictation.playTimes" placeholder-style="color: #999">
        </view>

        <view class="dic-edit-name-box">
          <view class="dic-edit-name">播放间隔</view>
          <input class="dic-edit-add" @blur="setValue($event, 'intervel')" @confirm="setValue($event, 'intervel')" confirm-hold type="number" :value="dictation.intervel" placeholder="单位(s)" placeholder-style="color: #999" maxlength="2" minlength="1">
        </view>

        <view class="dic-edit-name-box">
          <view class="dic-edit-name">新词</view>
          <input class="dic-edit-add" @blur="setNew" @confirm="setNew" confirm-hold confirm-type="next" type="text" :value="newWord" placeholder="请输入新的词语，按下一项添加" placeholder-style="color: #999">
        </view>

        <view class="dic-edit-name-box" style="border-bottom: none;height: 100%;padding-left: 0" v-if="dictation.words.length">
          <!--<view class="dic-edit-name">词组</view>-->
          <scroll-view scroll-y class="dic-edit-scroll" style="height: 100%">
            <view class="dic-edit-text-container">
              <view class="dic-edit-text-inner" v-for="(text, index) in dictation.words" :key="index">
                <dictation-word :content="text" @deleteText="deleteText(index)" @changePinyin="changePinyin($event, index)"/>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <view class="dic-footer">
      <view class="dic-foot-btn" :class="{'active-btn': activeDictation.active}" v-if="edit" @click="setActive">音箱播放</view>
      <button class="dic-foot-btn" open-type="share">分享给</button>
      <view class="dic-foot-btn" @click="toPlay">听写</view>
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
  let clickFlag = true
  let clickFlag1 = true
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
        intervel: 10
      }
    },
    computed: {
      ...mapState({
        dictateList: state => state.dictation.dictation
      })
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
        if (clickFlag1) {
          clickFlag1 = false
          switch (value) {
            case 'title':
              if (this.title === e.mp.detail.value) {
                clickFlag1 = true
                return
              } else {
                this.dictation.title = e.mp.detail.value
                this.title = e.mp.detail.value
                break
              }
            case 'playTimes':
              if (this.playTimes === e.mp.detail.value) {
                clickFlag1 = true
                return
              } else {
                this.dictation.playTimes = parseInt(e.mp.detail.value)
                if (this.dictation.playTimes >= 1 && this.dictation.playTimes <= 3) {
                  this.playTimes = parseInt(e.mp.detail.value)
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
              if (this.intervel === e.mp.detail.value) {
                clickFlag1 = true
                return
              } else {
                this.dictation.intervel = parseInt(e.mp.detail.value)
                if (this.dictation.intervel >= 3 && this.dictation.intervel <= 15) {
                  this.intervel = parseInt(e.mp.detail.value)
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
        arr.splice(index, 1)
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
          wx.showToast({
            title: '设置成功'
          })
        }).catch(err => {
          console.log(err)
          wx.showToast({
            title: '设置失败'
          })
        })
        console.log(this.activeDictation)
      },
      changePinyin: function (e, index) {
        const that = this
        let hanzi = this.dictation.words[index].term.substr(e.mp.detail, 1)
        this.hanzi = hanzi
        this.wordsIndex = index
        this.pinyinIndex = e.mp.detail
        this.$store.dispatch('getPinyin', [hanzi]).then(res => {
          that.pinyin = res[0].wordPinyin[0]
          if (that.pinyin.length > 1) {
            that.showPinyin = true
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
      }
    },
    onShow () {
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
    onShareAppMessage: function () {
      return {
        title: '词汇详情',
        path: '/pages/dictationEdit/main'
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
    padding-top: 205px;
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
    margin-left:-80px;
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
    flex-wrap:wrap;
    /*padding-top:12px;*/
    /*flex-direction: column;*/
  }
  .dic-edit-text-inner{
    margin-right:10px;
    margin-top:12px;
    background:#19a1a8;
    padding:10px;
    border-radius: 5px;
    line-height:13px;
    /*height:30px;*/
    box-sizing:border-box;
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
</style>
