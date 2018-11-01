<template lang="pug">
view(class="page")
  title-bar(title="关联小度音箱")
  //- view(class="weui-cells weui-cells_after-title")
  //-   navigator(class="weui-cell weui-cell_access" hover-class="weui-cell_active" url="/pages/xiaoduhelp/main")
  //-     view(class="weui-cell__bd") 关联说明
  //-     view(class="weui-cell__ft weui-cell__ft_in-access")
  view(class="weui-cells__title") 关联小度音箱
  view(class="weui-cells weui-cells_after-title")
    view(class="weui-cell weui-cell_input")
      view(class="weui-cell__hd")
        view(class="weui-label") 关联状态
      view(class="weui-cell__bd weui-input")
      view(class="weui-cell__ft")
        block(v-if="baiduBinded") 已关联
        block(v-else) 未关联
    view(class="weui-cell weui-cell_input")
      view(class="weui-cell__hd")
        view(class="weui-label") 语音验证码
      view(class="weui-cell__bd")
        input(class="weui-input" placeholder="请输入验证码" type="number" maxlength="5" focus @input="inputCode")
      view(class="weui-cell__ft")
        view(class="bind-button" :class="{'disabled': code.length != 5}" @click="bindSpeaker") 绑定
  block(v-if="!baiduBinded")
    view(class="weui-cells__tips") 你还没有和小度音箱关联
    view(class="weui-cells__tips") 1. 对小度无屏音箱说，"小度小度，打开课程表"，音箱会提示搜索小程序"哒尔文"。
    view(class="weui-cells__tips") 2. 对音箱说，”我的验证码“，在上面输入听到的5位验证码，点击”绑定”按钮，完成和小度无屏音箱的关联
  block(v-else)
    view(class="weui-cells__tips") 你已经绑定成功，快到小程序里配置课程表吧
    
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      code: ''
    }
  },

  computed: {
    ...mapState({
      baiduBinded: state => (state.userProfile.smartSpeakes.indexOf('百度') !== -1)
    })
  },

  methods: {
    inputCode (e) {
      console.log(e)
      this.code = e.mp.detail.value
    },
    bindSpeaker () {
      wx.showLoading({
        title: '正在关联',
        mask: true
      })
      this.$store.dispatch('bindSpeaker', {bindingCode: this.code})
        .then(() => {
          wx.hideLoading()
          wx.showToast({
            title: '关联成功',
            icon: 'none',
            duration: 1500,
            mask: false
          })
        })
        .catch(() => {
          wx.showToast({
            title: '关联失败，验证码错误或者已过期',
            icon: 'none',
            duration: 1500,
            mask: false
          })
        })
    }
  },

  created () {
    this.$store.dispatch('getSmartSpeakers')
  },

  onLoad () {
    this.code = ''
  },
  onShareAppMessage: function () {
  }
}
</script>

<style scoped>
view {
  font-size: 28rpx;
}
.weui-cell__bd, .weui-label {
  color: #0c5053;
}

.bind-button {
  white-space:nowrap;
  padding:10rpx 10rpx;
  background:#f2f2f2;
  border:3rpx solid #19a1a8;
  color:#19a1a8;
  /* border-radius:35rpx; */
  padding:10rpx 20rpx;
  text-align:center;
  box-shadow:0 0 0;
  font-weight:500;
  min-width:60rpx;
}

.bind-button.disabled, .bind-button.disabled:active {
  border: #999;
  color: #999;
  background-color: #f2f2f2;
}

.bind-button:active {
  background: #19a1a8;
  color: white;
}
</style>
