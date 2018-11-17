<template lang="pug">
view(class="page content")
  title-bar(title="关联智能音箱")
  view(class="weui-cells weui-cells_after-title")
    navigator(class="weui-cell weui-cell_access" hover-class="weui-cell_active" url="/pages/bindXiaomi/main")
      view(class="weui-cell__bd") 关联小爱音箱（小米）
      view(class="weui-cell__ft weui-cell__ft_in-access")
        block(v-if="xiaoaiBinded") 已关联
        block(v-else) 未关联
    navigator(class="weui-cell weui-cell_access" hover-class="weui-cell_active" url="/pages/xiaoduhelp/main")
      view(class="weui-cell__bd") 关联小度在家（百度有屏音箱）
      view(class="weui-cell__ft weui-cell__ft_in-access")
        block(v-if="baiduBinded") 已关联
        block(v-else) 未关联
    navigator(class="weui-cell weui-cell_access" hover-class="weui-cell_active" url="/pages/bindXiaodu/main")
      view(class="weui-cell__bd") 关联小度音箱（百度无屏音箱）
      view(class="weui-cell__ft weui-cell__ft_in-access")
        block(v-if="baiduBinded") 已关联
        block(v-else) 未关联
    navigator(class="weui-cell weui-cell_access" hover-class="weui-cell_active" :url="jingDongUrl")
      view(class="weui-cell__bd") 关联叮咚音箱（京东）
      view(class="weui-cell__ft weui-cell__ft_in-access")
</template>

<script>
import navBar from '@/components/coursetable/navbar'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      jingDongUrl: '/pages/jdSkillList/main'
    }
  },

  computed: {
    ...mapState({
      xiaoaiBinded: state => (state.userProfile.smartSpeakes.indexOf('xiaoai') !== -1),
      baiduBinded: state => (state.userProfile.smartSpeakes.indexOf('dueros') !== -1),
      jingdongBinded: state => (state.userProfile.smartSpeakes.indexOf('dingdong') !== -1)
    })
  },

  components: {
    navBar
  },

  methods: {
  },

  created () {
  },

  onLoad (option) {
    if (option.skill) {
      this.jingDongUrl = `/pages/bindJingdong/main?skill=${option.skill}`
    }
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
