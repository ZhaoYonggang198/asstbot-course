<template>
  <view class="big-container">
    <title-bar :title="edit? '编辑词语' : '新增词语'"/>
    <view class="dic-edit-inner">
      <view class="dic-edit-inner-inner">
        <view class="dic-edit-name-box" style="margin-top: -82px;padding-right: 40px">
          <view class="dic-edit-name">词组名</view>
          <input class="dic-edit-title" type="text" :value="dictation.title" @blur="setTitle">
          <view class="dic-words-num" v-if="dictation.words.length">{{dictation.words.length}}</view>
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
                <text  class="dic-edit-text">{{text}}</text>
                <icon class="del-icon" type="cancel" size="16" color="#fff" @click="deleteText(index)"></icon>
              </view>
            </view>
          </scroll-view>
        </view>
        <!--<text class="dic-tip">如果要添加多个，中间用逗号（，）隔开</text>-->
        <!--<view class="dic-edit-fun-box">-->
          <!--<view class="dic-btn btn-success" @click="success">保存</view>-->
          <!--<view class="dic-btn btn-fail" @click="fail">取消</view>-->
        <!--</view>-->
      </view>
    </view>
    <view class="dic-footer">
      <view class="dic-foot-btn" :class="{'active-btn': activeDictation.active}" v-if="edit" @click="setActive">音箱播放</view>
      <view class="dic-foot-btn">设置</view>
      <button class="dic-foot-btn" open-type="share">分享给</button>
      <view class="dic-foot-btn" @click="toPlay">听写</view>
      <!--<view class="dic-foot-btn" @click="bindPhone">关联智能音箱</view>-->
    </view>
  </view>

</template>

<script>
  import { mapState } from 'vuex'
  import Time from '@/utils/time'
  let clickFlag = true
  export default {
    data () {
      return {
        edit: true,
        dictation: {},
        activeDictation: {},
        preActive: {},
        newWord: ''
      }
    },
    computed: {
      ...mapState({
        dictateList: state => state.dictation.dictation
      })
    },
    methods: {
      setNew: function (e) {
        if (clickFlag) {
          clickFlag = false
          this.newWord = e.mp.detail.value
          let newWordArr = []
          if (this.newWord) {
            newWordArr = this.newWord.replace(/，/g, ',').split(',')
          }
          if (this.edit) {
            this.$store.dispatch('updateDictation', {
              id: this.dictation.id,
              dictateWords: {
                title: this.dictation.title,
                active: this.dictation.active,
                words: this.dictation.words.concat(newWordArr)
              }
            }).then(res => {
              this.$store.dispatch('initDictation')
              if (this.newWord) {
                this.dictation.words = [...this.dictation.words, ...this.newWord.replace(/，/g, ',').split(',')]
              }
              this.newWord = ''
              this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
              // wx.showToast({
              //   title: '保存成功'
              // })
              clickFlag = true
            }).catch(err => {
              clickFlag = true
              console.log(err)
              wx.showToast({
                title: '添加失败'
              })
            })
          } else {
            this.$store.dispatch('newDictation', {
              openId: '',
              dictateWords: {
                title: this.dictation.title,
                active: false,
                words: this.dictation.words.concat(newWordArr)
              }
            }).then(res => {
              this.$store.dispatch('initDictation')
              if (this.newWord) {
                this.dictation.words = [...this.dictation.words, ...this.newWord.replace(/，/g, ',').split(',')]
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
          }
        }
      },
      setTitle: function (e) {
        this.dictation.title = e.mp.detail.value
        let newWordArr = []
        if (this.newWord) {
          newWordArr = this.newWord.replace(/，/g, ',').split(',')
        }
        if (this.edit) {
          this.$store.dispatch('updateDictation', {
            id: this.dictation.id,
            dictateWords: {
              title: this.dictation.title,
              active: this.dictation.active,
              words: this.dictation.words.concat(newWordArr)
            }
          }).then(res => {
            this.$store.dispatch('initDictation')
            if (this.newWord) {
              this.dictation.words = [...this.dictation.words, ...this.newWord.replace(/，/g, ',').split(',')]
            }
            this.newWord = ''
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
              words: this.dictation.words.concat(newWordArr)
            }
          }).then(res => {
            this.$store.dispatch('initDictation')
            if (this.newWord) {
              this.dictation.words = [...this.dictation.words, ...this.newWord.replace(/，/g, ',').split(',')]
            }
            this.dictation.id = res.data.id
            this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
            this.newWord = ''
            this.edit = true
          }).catch(err => {
            console.log(err)
            wx.showToast({
              title: '保存失败'
            })
          })
        }
      },
      deleteText: function (index) {
        let arr = [...this.dictation.words]
        arr.splice(index, 1)
        this.dictation.words = [...arr]
        let newWordArr = []
        if (this.newWord) {
          newWordArr = this.newWord.replace(/，/g, ',').split(',')
        }
        if (this.edit) {
          this.$store.dispatch('updateDictation', {
            id: this.dictation.id,
            dictateWords: {
              title: this.dictation.title,
              active: this.dictation.active,
              words: this.dictation.words.concat(newWordArr)
            }
          }).then(res => {
            this.$store.dispatch('initDictation')
            if (this.newWord) {
              this.dictation.words = [...this.dictation.words, ...this.newWord.replace(/，/g, ',').split(',')]
            }
            this.newWord = ''
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
              words: this.dictation.words.concat(newWordArr)
            }
          }).then(res => {
            this.$store.dispatch('initDictation')
            if (this.newWord) {
              this.dictation.words = [...this.dictation.words, ...this.newWord.replace(/，/g, ',').split(',')]
            }
            this.dictation.id = res.data.id
            this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
            this.newWord = ''
            this.edit = true
          }).catch(err => {
            console.log(err)
            wx.showToast({
              title: '保存失败'
            })
          })
        }
      },
      success: function () {
        let newWordArr = []
        if (this.newWord) {
          newWordArr = this.newWord.replace(/，/g, ',').split(',')
        }
        if (this.edit) {
          this.$store.dispatch('updateDictation', {
            id: this.dictation.id,
            dictateWords: {
              title: this.dictation.title,
              active: this.dictation.active,
              words: this.dictation.words.concat(newWordArr)
            }
          }).then(res => {
            this.$store.dispatch('initDictation')
            if (this.newWord) {
              this.dictation.words = [...this.dictation.words, ...this.newWord.replace(/，/g, ',').split(',')]
            }
            this.newWord = ''
            this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
            wx.showToast({
              title: '保存成功'
            })
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
              words: this.dictation.words.concat(newWordArr)
            }
          }).then(res => {
            this.$store.dispatch('initDictation')
            if (this.newWord) {
              this.dictation.words = [...this.dictation.words, ...this.newWord.replace(/，/g, ',').split(',')]
            }
            this.dictation.id = res.data.id
            this.activeDictation = JSON.parse(JSON.stringify(this.dictation))
            this.newWord = ''
            this.edit = true
            wx.showToast({
              title: '保存成功'
            })
          }).catch(err => {
            console.log(err)
            wx.showToast({
              title: '保存失败'
            })
          })
        }
      },
      setActive: function () {
        if (this.preActive.id && this.preActive.id !== this.activeDictation.id) {
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
      fail: function () {
        wx.navigateBack()
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
      console.log(this.dictateList)
      console.log(this.$mp.query)
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
          active: false
        }
        this.activeDictation = {
          title: Time.getFormatTime(),
          words: [],
          active: false
        }
        this.edit = false
      }
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
    padding-top: 82px;
  }
  .dic-edit-name-box{
    padding-left:60px;
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
    width:60px;
    float:left;
    margin-left:-60px;
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
    padding:8px 30px 8px 8px;
    border-radius:15px;
    line-height:13px;
    height:30px;
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
