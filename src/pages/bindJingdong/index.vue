<template lang="pug">
view(class="page")
  title-bar(:title="skillProfile.title")
  bind-speaker-help(:desc="skillProfile.bindHelp")
  bind-speaker(:title="skillProfile.title" 
        deviceType="dingdong"
        :skill="skillProfile.name"
        :unbindHint="skillProfile.unbindHint"
        :bindedHint="skillProfile.bindHint"
        codeLabel="验证码")
</template>

<script>

import bindSpeaker from '@/components/bindSpeaker'
import bindSpeakerHelp from '@/components/bindSpeakerHelp'

export default {
  data () {
    return {
      skillProfile: {},
      skill: ''
    }
  },
  components: {
    bindSpeaker,
    bindSpeakerHelp
  },

  onLoad (option) {
    if (option.skill) {
      console.log(option)
      this.skill = option.skill
      this.$store.dispatch('getDingdongSkillList').then((skillList) => {
        console.log(this.$store)
        this.skillProfile = skillList.filter(item => {
          return item.name === this.skill
        })[0]
      })
    }
  },

  onShareAppMessage: function () {
  }
}
</script>

<style scoped>

</style>
