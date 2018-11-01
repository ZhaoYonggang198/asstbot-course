<template lang="pug">
view(class="page")
  title-bar(title="关联小度音箱")
  bind-speaker(title="关联小度音箱" 
        deviceType="dueros"
        unbindHint="你还没有和小度音箱关联"
        bindedHint="你已经绑定成功，快到小程序里配置课程表吧"
        :bindSteps="bindSteps")
  //- view(class="weui-cells weui-cells_after-title")
  //-   navigator(class="weui-cell weui-cell_access" hover-class="weui-cell_active" url="/pages/xiaoduhelp/main")
  //-     view(class="weui-cell__bd") 关联说明
  //-     view(class="weui-cell__ft weui-cell__ft_in-access")
  //- view(class="weui-cells__title") 关联小度音箱
  //- view(class="weui-cells weui-cells_after-title")
  //-   view(class="weui-cell weui-cell_input")
  //-     view(class="weui-cell__hd")
  //-       view(class="weui-label") 关联状态
  //-     view(class="weui-cell__bd weui-input")
  //-     view(class="weui-cell__ft")
  //-       block(v-if="baiduBinded") 已关联
  //-       block(v-else) 未关联
  //-   view(class="weui-cell weui-cell_input")
  //-     view(class="weui-cell__hd")
  //-       view(class="weui-label") 语音验证码
  //-     view(class="weui-cell__bd")
  //-       input(class="weui-input" placeholder="请输入验证码" type="number" maxlength="5" focus @input="inputCode")
  //-     view(class="weui-cell__ft")
  //-       view(class="bind-button" :class="{'disabled': code.length != 5}" @click="bindSpeaker") 绑定
  //- block(v-if="!baiduBinded")
  //-   view(class="weui-cells__tips") 你还没有和小度音箱关联
  //-   view(class="weui-cells__tips") 1. 对小度无屏音箱说，"小度小度，打开课程表"，音箱会提示搜索小程序"哒尔文"。
  //-   view(class="weui-cells__tips") 2. 对音箱说，”我的验证码“，在上面输入听到的5位验证码，点击”绑定”按钮，完成和小度无屏音箱的关联
  //- block(v-else)
  //-   view(class="weui-cells__tips") 你已经绑定成功，快到小程序里配置课程表吧
    
</template>

<script>

import bindSpeaker from '@/components/bindSpeaker'

export default {
  data () {
    return {
      bindSteps: [
        '对小度无屏音箱说，"小度小度，打开课程表"，音箱会提示搜索小程序"哒尔文"。',
        '对音箱说，"我的验证码"，在上面输入听到的5位验证码，点击"绑定"按钮，完成和小度无屏音箱的关联'
      ]
    }
  },
  components: {
    bindSpeaker
  },

  created () {
    this.$store.dispatch('getSmartSpeakers')
  },

  onShareAppMessage: function () {
  }
}
</script>

<style scoped>

</style>
