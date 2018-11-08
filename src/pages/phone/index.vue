<template lang="pug">
view(class="page")
  title-bar(title="关联小米音箱")
  block(v-if="!xiaoaiBinded")
    bind-speaker-help(:desc="helpDesc")
  i-panel(:title="bindPhone?'已绑定手机：' + bindPhone:''" class="form")
    block(v-if="!bindPhone")
      i-input(:value="inputPhone" @change="phonechange" type="number" maxlength="11" title="手机号" placeholder="请输入手机号")
      view(class="weui-flex")
        view(class="weui-flex__item")
          i-input(:value="inputCode" @change="codechange" type="number" maxlength="6" title="验证码" placeholder="请输入验证码")
        i-button(size="small" :disabled="vcodeDisable" @iclick="requestCode" v-if="sumbitDisable") {{vcodeOperation}}
        i-button(type="primary" @iclick="formSubmit" size="small" v-else) 绑定
  view(class="bottom-button" v-if="bindPhone")
    view(class="button" @click="formReset" size="small" ) 解绑
</template>

<script>

import { mapState, mapActions } from 'vuex'
import bindSpeakerHelp from '@/components/bindSpeakerHelp'

export default {
  data () {
    return {
      inputPhone: '',
      inputCode: '',
      requestInterval: 0,
      helpDesc: [
        {
          image: 'http://xiaodamp.cn/asst/resource/skill.png',
          desc: '在App"小爱音箱"技能页面搜索"课表"技能'
        },
        {
          image: 'http://xiaodamp.cn/asst/resource/auth1.png',
          desc: '点击"绑定账号"按钮'
        },
        {
          image: 'http://xiaodamp.cn/asst/resource/auth2.png',
          desc: '输入与本页面相同的手机号'
        },
        {
          image: 'http://xiaodamp.cn/asst/resource/auth3.png',
          desc: '点击"确认授权"按钮'
        },
        {
          image: 'http://xiaodamp.cn/asst/resource/xiaomi.png',
          desc: '对小米音箱说"打开课表"，开始使用本课表'
        }
      ]
    }
  },

  components: {
    bindSpeakerHelp
  },

  computed: {
    ...mapState({
      bindPhone: state => {
        return state.phone.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      },
      xiaoaiBinded: state => (state.userProfile.smartSpeakes.indexOf('小米') !== -1)
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
        this.$store.dispatch('getSmartSpeakers')
        wx.showToast({
          title: '解绑成功',
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
            wx.showModal({
              title: '绑定成功',
              content: '在小爱音箱app搜索"课表"技能并绑定同一手机号，可以在小爱音箱上使用该课程表',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#3CC51F',
              success: res => {
                wx.navigateBack()
              }
            })
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
    this.$store.dispatch('getSmartSpeakers')
  },
  onShareAppMessage: function () {
    return {
      title: '',
      path: '/pages/index/main'
    }
  }
}
</script>

<style scoped>
.page {
  background: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f2f2f2;
}

.page .form {

}

.button-area .weui-flex {
  padding-right: 5px;
  padding-left: 5px;
}

.weui-cell_input {
  padding-right: 5px;
}

.bottom-button {
  margin-top: 40rpx;
  margin-bottom: 40rpx;
}

button {
  font-size: 28rpx;
  line-height: 2;
  margin-left: 20rpx;
  margin-right: 20rpx;
}


.button {
  font-size: 28rpx;
  margin-left: 15rpx;
  margin-right: 15rpx;
  line-height: 1.6;
  white-space:nowrap;
  background:#f2f2f2;
  border:3rpx solid #19a1a8;
  color:#19a1a8;
  border-radius:35rpx;
  padding:10rpx 20rpx;
  text-align:center;
  box-shadow:0 0 0;
  font-weight:500;
  min-width: 60rpx;

}
.bottom-button {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bottom-button .button {
  width: 240rpx;
}

.button:active {
  background: #19a1a8;
  color: white;
}

.page__desc {
  color: #0c5053;
}
</style>
