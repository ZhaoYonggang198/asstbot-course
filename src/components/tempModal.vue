<template>
  <view>
    <view class="modal-new-skill-tip-container" @click="hideModal" v-if="showFootNew" ref="aaa" id="aaa">

    </view>
    <view class="modal-new-skill-tip" v-if="showFootNew" ref="bbb" id="bbb">
      <view class="global-modal-container">
        <view class="tri-bottom"></view>
        <view style="font-size: 16px">{{content}}</view>
        <view class="iknow" @click="hideModal">我知道了</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
        showFootNew: false
      }
    },
    props: {
      direction: {
        type: String,
        default: 'left'
      },
      position: {
        type: String,
        default: 'start'
      },
      content: {
        type: String,
        default: ''
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    computed: {
    },
    methods: {
      hideModal () {
        console.log(this)
        wx.setStorageSync('showFootNew', false)
        this.showFootNew = false
        console.log(this.showFootNew)
      }
    },
    onLoad () {
      this.showFootNew = (wx.getStorageSync('showFootNew') === undefined || wx.getStorageSync('showFootNew') === '') ? true : wx.getStorageSync('showFootNew')
    }
  }
</script>

<style scoped>
  .modal-new-skill-tip-container{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5);
    top: 0;
    left: 0;
    z-index: 9999;
  }
  .modal-new-skill-tip{
    height:83px;
    position:absolute;
    width:250px;
    top:-198rpx;
    z-index:1000000;
    right:20rpx;
    border-radius:40rpx;
    padding:20px 10px;
    box-sizing:border-box;
    background: #fff4df ;
  }
  .global-modal-container{
    display: flex;
    /*justify-content: center;*/
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  .global-modal-container:after{

  }
  .tri-bottom{
    position:absolute;
    border-left:40rpx solid transparent;
    border-right:30rpx solid transparent;
    border-bottom:40rpx solid transparent;
    border-top:30rpx solid #fff4df ;
    bottom:-60rpx;
    right:8px;
    z-index: 9999;
  }
  .iknow{
    position:absolute;
    right:15px;
    bottom:5px;
    line-height:32px;
  }
</style>

