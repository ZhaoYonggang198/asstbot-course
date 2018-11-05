<template lang="pug">
view(class="modal")
  view(class="donate-modal")
    view(class="modal-title")
      view(class="title" v-if="!donated") 小哒辛苦了
      view(class="title" v-else) 
      view(class="modal-close" @click="close")
        i(class="icon iconfont icon-close")

    block(v-if="!donated")
      view(class="donate-option")
        block(v-for="(item, index) in feeOptions" :key="index")
          view(class="fee-option" :class="{'active-fee':item == totalFee}" @click="choose(item)") 
            view(class="unit") ￥
              text(class="money") {{item}}
      view(class="other-fee")
        view 其他金额(元)
        input(type="number" :value="totalFee" placeholder="请输入金额" @input="changeValue")
      view(class="button-area")
        view(class="button" @click="confirm") 打赏
    block(v-else)
      view(class="thanks") 谢谢老板
      view(class="button-area")
        view(class="button" @click="end") 再逛逛
</template>

<script>
import config from '@/config.js'
import wechat from '@/store/modules/wechat'
const hostRoot = config.service.hostRoot
export default {
  data () {
    return {
      totalFee: '',
      feeOptions: [2, 5, 10, 20, 30, 100],
      donated: false
    }
  },
  computed: {
  },
  methods: {
    choose (item) {
      this.totalFee = item
    },
    changeValue (event) {
      this.totalFee = event.mp.detail.value
    },
    close () {
      // this.donated = false
      this.totalFee = ''
      this.$emit('closeDonate')
    },
    end () {
      this.$emit('closeDonate')
    },
    confirm () {
      wx.showLoading({
        mask: true
      })
      wechat.getOpenId()
        .then((openId) => {
          wx.request({
            url: `${hostRoot}/payment/unifyOrder`,
            method: 'POST',
            data: {openId, totalFee: this.totalFee * 100},
            success: (response) => {
              wx.hideLoading()
              wx.requestPayment({
                ...response.data,
                success: res => {
                  console.log(res)
                  this.donated = true
                },
                fail: () => {

                }
              })
              console.log(response)
            },
            fail: () => {
              wx.hideLoading()
            }
          })
        })
    }
  },

  onLoad () {
    this.donated = false
    this.totalFee = ''
  }
}
</script>

<style scoped>
.modal {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display:flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
  z-index: 1000;
}

.donate-modal {
  width: 600rpx;
  padding: 30rpx;
  border-radius: 15rpx;
  background: #f2f2f2;
  display:flex;
  flex-direction: column;
}

.modal-title {
  display: flex;
  flex-direction: row;
}

.modal-title .title {
  flex: 1;
  color: #0c5053;
}

.donate-option {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20rpx;
  justify-content:space-between;
  height: 230rpx;
}

.donate-option .fee-option {
  width: 180rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  color: tomato;
  border: solid 1px tomato;
  border-radius: 3px;
}

.fee-option.active-fee {
  background: tomato;
  color: white;
}

.donate-option .fee-option .money {
  font-size: 40rpx;
}

.donate-option .fee-option .unit {
  font-size: 24rpx;
}

.other-fee {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #0c5053;
}

.other-fee input {
  border-bottom: 1rpx solid gray;
  padding: 0 15rpx;
}

.button-area {
  margin-top: 20rpx;
}

.button {
  white-space:nowrap;
  padding:10rpx 10rpx;
  background:#f2f2f2;
  border:3rpx solid #19a1a8;
  background-color: #19a1a8;
  color: #f2f2f2;
  border-radius:35rpx;
  padding:10rpx 10rpx;
  text-align:center;
  box-shadow:0 0 0;
  font-weight:500;
  min-width:60rpx;
}

.thanks {
  width: 100%;
  font-size: 26rpx;
  color: #0c5053;
  text-align: center;
  margin: 20rpx 0;
}

</style>