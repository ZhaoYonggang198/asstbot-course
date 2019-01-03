<template lang="pug">
view(class="page")
  title-bar(title="关联小爱同学")
  bind-speaker(title="关联小爱同学" 
        deviceType="xiaoai"
        unbindHint="你还没有和小爱同学关联"
        bindedHint="你已经绑定成功"
        :bindSteps="bindSteps")
    
</template>

<script>

import bindSpeaker from '@/components/bindSpeaker'

export default {
  data () {
    return {
      bindSteps: [
        '对小爱同学说，"打开幸运数字"',
        '在这里输入听到5位幸运数字，并点击绑定'
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
