<template>
    <view class='dictation-inner'>
      <title-bar title='词汇列表'/>
      <view class='dictation-container'>
          <dictation-item style='height: 100%' :content='dictateList' @toEdit='toEdit' @deleteDictation='deleteDictation'/>
      </view>
      <view class='dic-foot-container'>
        <view class='dic-footer'>
          <view class='dic-foot-btn' @click='ShowNewModal'>
            <view class='dic-add-row dic-add-item'></view>
            <view class='dic-add-col dic-add-item'></view>
          </view>
        </view>

      </view>
      <block v-if='showAdd'>
        <dictation-add-modal :content='dictation' @addCancel='hideNewModal' @addSuccess='addSuccess'/>
      </block>
    </view>
</template>

<script>
  import wechat from '@/store/modules/wechat'
  import { mapState } from 'vuex'
  export default {
    data () {
      return {
        select: {},
        showAdd: false,
        dictation: {}
      }
    },
    components: {
    },
    computed: {
      ...mapState({
        dictateList: state => state.dictation.dictation
      }),
      activeDictation: state => {
        if (state.dictateList && state.dictateList.length) {
          let active = state.dictateList.find(item => item.active) || {}
          return active
        }
      }
    },
    methods: {
      ShowNewModal: function () {
        wx.navigateTo({
          url: '/pages/dictationEdit/main'
        })
      },
      hideNewModal: function () {
        this.showAdd = false
        this.dictation = {}
      },
      addSuccess: function () {
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
          this.hideNewModal()
          this.$store.dispatch('initDictation')
        })
      },
      deleteDictation: function (e) {
        this.$store.dispatch('deleteDictation', e.mp.detail).then(res => {
          this.$store.dispatch('initDictation')
        }).catch(err => {
          console.log(err)
        })
      },
      toEdit: function (e) {
        wx.navigateTo({
          url: '/pages/dictationEdit/main?param=' + e.mp.detail.id + '&active=' + this.activeDictation.id
        })
      }
    },
    onLoad (option) {
      console.log(wechat)
      wechat.getOpenId().then(res => {
        this.openId = res
        if (option && option.openId) {
          if (option.openId !== res) {
            this.dictation = JSON.parse(option.shareId)
            this.showAdd = true
          }
        }
      })
      this.$store.dispatch('initDictation')
    },
    onShareAppMessage: function () {
      return {
        title: '听写词汇',
        path: '/pages/dictation/main'
      }
    }
  }
</script>

<style scoped>
  .dictation-inner{
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .dictation-add-container{
    margin-bottom:15px;
    background:#fff;
    padding:0 10px;
    height:40px;
    display: flex;
  }
  .dic-add-icon{
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #19a8a1;
  }
  .dic-add-word{
    line-height:40px;
    font-weight:500;
    font-size:16px;
    padding-left:10px;
  }
  .dictation-container{
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .dictation-movable{
    height: 100%;
    width: 100%;
  }
  .dic-movable-view{
    width: 60px;
    height: 60px;
    background: #25CEC2;
    border-radius: 50%;
    display:flex;
    justify-content:center;
    align-items:center;
    z-index: 1;
    box-shadow:0px 0px 10px #0c5053;
  }
  .dictation-scroll{
    height: 100%;
  }
  .dic-foot-container{
    border-top: 1px solid #d8d8d8;
  }
  .dic-foot-add{
    padding: 10px 15px;
    text-align: center;
    border-bottom: 1px solid #d8d8d8;
    font-size: 16px;
    background: #19a1a8;
    color: #fff;
  }
  .dic-footer{
    display: flex;
    min-height: 41px;
    height: auto;
    justify-content: center;
    margin-bottom: 35px;
    margin-top: 10px;
  }
  .dic-foot-btn{
    /*font-size: 28rpx;*/
    /*margin-left: 15rpx;*/
    /*margin-right: 15rpx;*/
    /*line-height: 32px;*/
    /*height: 34px;*/
    /*box-sizing: border-box;*/
    /*white-space: nowrap;*/
    /*background: #f2f2f2;*/
    /*border: 1px solid #19a1a8;*/
    /*color: #19a1a8;*/
    border-radius: 35rpx;
    /*padding: 0rpx 20rpx;*/
    /*text-align: center;*/
    box-shadow: 0 0 0;
    /*font-weight: 500;*/
    /*min-width: 60rpx;*/
    position: relative;
    width:55px;
    height:55px;
    border-radius:50%;
    background:#25CEC2;
    box-shadow: 0 0 10px #0c5053;
  }
  .dic-add-item{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto auto;
    background: #fff;
    border-radius: 2px;
  }
  .dic-add-row{
    width: 20px;
    height: 4px;
  }
  .dic-add-col{
    width: 4px;
    height: 20px;
  }
  .dic-foot-select{
    border-bottom: 1px solid #d8d8d8;
    padding: 0 15px;
    font-size: 14px;
    background: #fff;
  }
  .dic-foot-select-tip{
    text-align:center;
    font-size:32rpx;
    line-height:64rpx;
    width:100vw;
    margin-left:-15px;
    border-bottom:1px solid #d8d8d8;
    margin-bottom:10px;
  }
  .dic-foot-select-title{
    height: 30px;
    font-size: 16px;
  }
  .dic-foot-select-text-container{
    display: flex;
    flex-wrap: wrap;
  }
  .dic-foot-select-text{
    margin-right:10px;
    padding: 8px 10px;
    border-radius:5px;
    background: #f0f0f0;
    white-space: nowrap;
    line-height: 14px;
    margin-bottom: 10px;
  }
</style>
