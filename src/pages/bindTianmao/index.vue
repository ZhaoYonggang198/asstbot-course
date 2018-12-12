<template lang="pug">
view(class="page")
  title-bar(title="关联天猫精灵")
  bind-speaker(title="关联天猫精灵" 
        deviceType="aligenie"
        unbindHint="你还没有和天猫精灵关联"
        bindedHint="你已经绑定成功"
        :bindSteps="bindSteps")
    
</template>

<script>

import bindSpeaker from '@/components/bindSpeaker'

export default {
  data () {
    return {
      bindSteps: [
        '对天猫精灵说，"天猫精灵，打开我的课表"',
        '接着说: "天猫精灵，验证码"',
        '输入听到的5位数字验证码，点击"绑定"按钮，完成和天猫精灵的关联'
      ]
    }
  },
  components: {
    bindSpeaker
  },

  onLoad () {
    this.$store.dispatch('getSmartSpeakers')
  },

  onShareAppMessage: function () {
  }
}
</script>

<style scoped>

</style>
