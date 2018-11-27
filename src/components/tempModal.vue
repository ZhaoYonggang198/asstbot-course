<template>
  <view>
    <view class="modal-new-skill-tip-container" v-if="showFootNew || hideFootNew" ref="aaa" id="aaa">

    </view>
    <view class="modal-new-skill-tip" v-if="showFootNew" ref="bbb" id="bbb">
      <view class="global-modal-container">
        <view class="tri-bottom"></view>
        <view style="font-size: 16px">点击➕号，查看我的更多本领</view>
        <view class="iknow" @click="hideModal('showFootNew')">我知道了</view>
      </view>
    </view>
    <view class="modal-new-skill-tip" v-if="hideFootNew" ref="bbb" id="bbb">
      <view class="global-modal-container">
        <view class="tri-bottom"></view>
        <view style="font-size: 16px">点击✖️号，关闭我的本领</view>
        <view class="iknow" @click="hideModal('hideFootNew')">我知道了</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
        showFootNew: false,
        hideFootNew: false
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
      show: {
        type: Boolean,
        default: false
      },
      showModalOrder: {
        type: Array,
        default: [
          {
            value: '',
            copyRight: false,
            next: ''
          }
        ]
      }
    },
    computed: {
      aa () {
        if (this.showModalOrder && this.showModalOrder.length) {
          const item = this.showModalOrder[0]
          if (item.copyRight) {
            this[item.value] = true
          } else {
            this[item.value] = (wx.getStorageSync(item.value) === undefined || wx.getStorageSync(item.value) === '') ? true : wx.getStorageSync(item.value)
          }
        }
      }
    },
    methods: {
      hideModal (value) {
        const item = this.showModalOrder.find(item => item.value === value)
        wx.setStorageSync(value, false)
        this[value] = false
        if (item.next) {
          this[item.next] = true
        }
      }
    },
    onLoad () {
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
