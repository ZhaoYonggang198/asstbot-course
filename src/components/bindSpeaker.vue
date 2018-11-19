<template lang="pug">
view
  view(class="weui-cells__title") {{title}}
  view(class="weui-cells weui-cells_after-title")
    view(class="weui-cell weui-cell_input")
      view(class="weui-cell__hd")
        view(class="weui-label") 关联状态
      view(class="weui-cell__bd weui-input")
      view(class="weui-cell__ft")
        block(v-if="speakerBinded") 已关联
        block(v-else) 未关联
    view(class="weui-cell weui-cell_input" v-if="!speakerBinded")
      view(class="weui-cell__hd")
        view(class="weui-label") {{codeLabel}}
      view(class="weui-cell__bd")
        input(class="weui-input" placeholder="请输入验证码" type="number" :value="code" maxlength="5" focus @input="inputCode")
      view(class="weui-cell__ft")
        view(class="bind-button" :class="{'disabled': code.length != 5}" @click="bindSpeaker") 绑定
    view(class="weui-cell" v-else)
      view(class="weui-cell__bd unbind-button-container")
        view(class="unbind-button" @click="unbindSpeaker") 解绑
  block(v-if="!speakerBinded")
    view(class="weui-cells__tips") {{unbindHint}}
    block(v-for="(step, index) in bindSteps" :key="index")
      view(class="weui-cells__tips") {{index+1}}. {{step}}
  block(v-else)
    view(class="weui-cells__tips") {{bindedHint}}
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    title: {
      type: String
    },
    deviceType: {
      type: String
    },
    skill: {
      type: String
    },
    unbindHint: {
      type: String
    },
    bindedHint: {
      type: String
    },
    bindSteps: {
      type: Array
    },
    codeLabel: {
      type: String,
      default: '语音验证码'
    }
  },

  data () {
    return {
      code: ''
    }
  },
  computed: {
    ...mapState({
      smartSpeakes: state => state.userProfile.smartSpeakes,
      skillList: state => state.userProfile.skillList
    }),
    speakerBinded () {
      return (!this.skill && this.smartSpeakes.indexOf(this.deviceType) !== -1) ||
        (this.skill && this.skillList.filter((item) => {
          return item.platType === this.deviceType && item.skill === this.skill
        }).length > 0)
    }
  },

  methods: {
    inputCode (e) {
      console.log(e)
      this.code = e.mp.detail.value
    },
    bindSpeaker () {
      if (this.code.length !== 5) {
        return
      }
      wx.showLoading({
        title: '正在关联',
        mask: true
      })
      this.$store.dispatch('bindSpeaker', {bindingCode: this.code, type: this.deviceType, skill: this.skill})
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
        .finally(() => {
          this.code = ''
        })
    },
    unbindSpeaker () {
      console.log('unbind speaker')
      this.$store.dispatch('unbindSpeaker', {type: this.deviceType, skill: this.skill})
    }
  },

  onLoad () {
    this.code = ''
  }
}
</script>

<style>
view {
  font-size: 28rpx;
}
.weui-cell__bd, .weui-label {
  color: #0c5053;
}

.bind-button, .unbind-button{
  white-space: nowrap;
  padding: 10rpx 10rpx;
  background: #f2f2f2;
  border: 3rpx solid #19a1a8;
  color: #19a1a8;
  /* border-radius:35rpx; */
  padding: 10rpx 20rpx;
  text-align: center;
  box-shadow: 0 0 0;
  font-weight: 500;
  min-width: 60rpx;
}

.unbind-button-container {
  display:flex;
  justify-content: center;
}
.unbind-button {
  font-size: 28rpx;
  line-height: 1.6;
  white-space:nowrap;
  background:white;
  border:3rpx solid #19a1a8;
  color:#19a1a8;
  border-radius:35rpx;
  padding:10rpx 20rpx;
  text-align:center;
  box-shadow:0 0 0;
  font-weight:500;
  min-width: 60rpx;
  width: 240rpx;
}

.unbind-button:active {
  background: #19a1a8;
  color: white;
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