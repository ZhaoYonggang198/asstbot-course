<template>
    <view class="global-modal-container">
      <view class="tri-top"></view>
      <view class="tri-right"></view>
      <view class="tri-bottom"></view>
      <view class="tri-left"></view>
      <view class="">{{content}}</view>
    </view>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
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
      ...mapState({
      })
    }
  }
</script>

<style scoped>
.global-modal-container{
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
  .global-modal-container:after{

  }
</style>
