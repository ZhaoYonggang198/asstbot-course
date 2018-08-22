<template lang="pug">
view(class="page")
  title-bar(title="关联小爱")
  swiper(indicator-dots="true" autoplay="true" interval="5000" circular="true" class="swiper-wrapper")
    swiper-item
      view(class="swiper-item")
        image(src="/static/image/xiaoai.png")
        view(class="page__desc") 绑定手机可以帮助在小爱智能音箱上更方便地使用我的课表技能
    swiper-item
      view(class="swiper-item")
        image(src="/static/image/xiaoaimin.png")
        view(class="page__desc") 对着小爱音箱说“小爱同学，打开我的课表”可以在音箱上使用课程表功能
    swiper-item
      view(class="swiper-item")
        image(src="/static/image/xiaoai.png")
        view(class="page__desc") 在这里绑定手机，并在小爱音箱绑定同一个手机，可以在音箱上使用小程序上创建的课程表
    
  i-panel(:title="bindPhone?'已绑定手机：' + bindPhone:''" class="form")
    i-input(:value="inputPhone" @change="phonechange" type="number" maxlength="11" title="手机号" placeholder="请输入手机号")
    view(class="weui-flex")
      view(class="weui-flex__item")
        i-input(:value="inputCode" @change="codechange" type="number" maxlength="6" title="验证码" placeholder="请输入验证码")
      i-button(size="small" :disabled="vcodeDisable" @iclick="requestCode") {{vcodeOperation}}
  view(class="weui-flex bottom-button")
    view(class="weui-flex__item")
      button(@click="formReset" size="small" :disabled='bindPhone.length === 0') 解绑
    view(class="weui-flex__item")
      button(type="primary" @click="formSubmit" size="small" :disabled='sumbitDisable') 绑定
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      inputPhone: '',
      inputCode: '',
      requestInterval: 0
    }
  },

  computed: {
    ...mapState({
      bindPhone: state => {
        return state.phone.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      }
    }),

    vcodeDisable () {
      return !this.validPhone() || this.requestInterval > 0
    },

    sumbitDisable () {
      return !(this.validPhone() && this.validCode())
    },

    vcodeOperation () {
      if (this.requestInterval > 0) {
        return `等待 (${this.requestInterval}秒)`
      } else {
        return '获取验证码'
      }
    }

  },

  methods: {
    ...mapActions([
      'toRequestCode',
      'toBindPhone',
      'toGetPhone',
      'toUnbindPhone'
    ]),

    validPhone () {
      return /^1(3|4|5|7|8|9)\d{9}$/.test(this.inputPhone)
    },

    validCode () {
      return /^\d{6}$/.test(this.inputCode)
    },

    phonechange (event) {
      this.inputPhone = event.mp.detail.detail.value
    },

    codechange (event) {
      this.inputCode = event.mp.detail.detail.value
    },

    requestCode () {
      if (!this.vcodeDisable) {
        this.toRequestCode(this.inputPhone)
          .then(() => {
            this.restartRequestInterval()
          }).catch((err) => {
            wx.showToast({
              title: err.message,
              icon: 'none'
            })
          })
      }
    },

    formReset (ev) {
      var formId = 1
      this.toUnbindPhone(formId).then(() => {
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          mask: true
        })
      })
    },

    formSubmit (ev) {
      var formId = 1
      if (this.validPhone && this.validCode) {
        this.toBindPhone({
          phone: this.inputPhone,
          code: this.inputCode,
          formId
        })
          .then(() => {
            this.inputPhone = ''
            this.inputCode = ''
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              mask: true
            })
            wx.navigateBack()
          })
          .catch((err) => {
            console.log(err)
            wx.showToast({
              title: '无效的验证码',
              mask: true
            })
          })
      }
    },

    restartRequestInterval: function () {
      this.requestInterval = 60
      clearInterval(this.intervalId)
      this.intervalId = setInterval(() => {
        this.requestInterval--
        if (this.requestInterval === 0) {
          clearInterval(this.intervalId)
        }
      }, 1000)
    }
  },

  created () {
    this.toGetPhone()
  },

  onLoad () {
    this.inputPhone = ''
    this.inputCode = ''
  }
}
</script>

<style scoped>
.page {
  background: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.page .form {
  flex: 1
}

.button-area .weui-flex {
  padding-right: 5px;
  padding-left: 5px;
}

.weui-cell_input {
  padding-right: 5px;
}

.swiper-wrapper {
  height: 280px;
  width: 100%;
  background: white;
}

.swiper-item {
  text-align: center;
  padding-left: 50rpx;
  padding-right: 50rpx;
}

.swiper-item image {
  height: 400rpx;
  width: 600rpx;
}

.bottom-button {
  margin-bottom: 40rpx;
}

.bottom-button button {
  font-size: 28rpx;
  line-height: 2;
  margin-left: 20rpx;
  margin-right: 20rpx;
}
</style>
