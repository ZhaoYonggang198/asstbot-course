<template lang="pug">
view(class="page")
  title-bar(title="关联华为音箱")
  bind-speaker(title="关联华为音箱" 
        deviceType="huawei"
        unbindHint="你还没有和华为音箱关联"
        bindedHint="你已经绑定成功，快到小程序里配置课程表吧"
        :bindSteps="bindSteps")
    
</template>

<script>

import bindSpeaker from '@/components/bindSpeaker'

export default {
  data () {
    return {
      bindSteps: [
        '对华为音箱说，"小艺小艺，打开幸运数字"',
        '在这里输入听到的5位幸运数字，并点击绑定'
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
