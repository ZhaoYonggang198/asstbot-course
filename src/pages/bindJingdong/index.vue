<template lang="pug">
view(class="page")
  title-bar(title="关联叮咚音箱")
  bind-speaker-help(:desc="helpDesc")
  bind-speaker(title="关联叮咚音箱" 
        deviceType="dingdong"
        unbindHint="你还没有和叮咚音箱关联"
        bindedHint="你已经绑定成功，快到小程序里配置课程表吧"
        codeLabel="验证码"
        :bindSteps="bindSteps")
</template>

<script>

import bindSpeaker from '@/components/bindSpeaker'
import bindSpeakerHelp from '@/components/bindSpeakerHelp'

export default {
  data () {
    return {
      bindSteps: [
      ],
      helpDesc: [
        {
          image: 'http://xiaodamp.cn/asst/resource/dingdong1.png',
          desc: '在App"叮咚音箱"技能页面搜索"我的课表"技能'
        },
        {
          image: 'http://xiaodamp.cn/asst/resource/dingdong2.png',
          desc: '点击"授权"按钮'
        },
        {
          image: 'http://xiaodamp.cn/asst/resource/dingdong3.png',
          desc: '在这里输入上面看到的5位数字，点击"绑定"按钮'
        },
        {
          image: 'http://xiaodamp.cn/asst/resource/dingdong4.png',
          desc: '完成关联，在本小程序里输入课程，就可以在叮咚音箱上使用“我的课表”技能了'
        }
      ]
    }
  },
  components: {
    bindSpeaker,
    bindSpeakerHelp
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
