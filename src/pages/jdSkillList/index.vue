<template lang="pug">
view(class="page content")
  title-bar(title="关联叮咚音箱")
  view(class="weui-cells weui-cells_after-title")
    block(v-for="(skill, index) in skillList" :key="index")
      navigator(class="weui-cell weui-cell_access" hover-class="weui-cell_active" :url="'/pages/bindJingdong/main?skill='+skill.name")
        view(class="weui-cell__bd") {{skill.title}}
        view(class="weui-cell__ft weui-cell__ft_in-access")
          block(v-if="bindStatus[index]") 已关联
          block(v-else) 未关联
</template>

<script>
import navBar from '@/components/coursetable/navbar'
import { mapState } from 'vuex'

export default {
  data () {
    return {
    }
  },

  computed: {
    ...mapState({
      skillList: state => state.speaker.dingDongSkillList,
      bindSkillList: state => state.userProfile.smartSpeakers.filter((item) => {
        return item.platType === 'dingdong'
      }).map(item => item.skill)
    }),
    bindStatus () {
      return this.skillList.map((item) => {
        return this.bindSkillList.indexOf(item.name) !== -1
      })
    }
  },

  components: {
    navBar
  },

  methods: {
  },

  created () {
  },

  onLoad (option) {
    this.$store.dispatch('getDingdongSkillList')
    this.$store.dispatch('getSmartSpeakers')
  },

  onShareAppMessage () {
  }
}
</script>

<style scoped>
.weui-cells {
  font-size: 28rpx;
}

.weui-cell__bd {
  color: #0c5053;
}
</style>
