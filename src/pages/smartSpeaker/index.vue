<template lang="pug">
view(class="page content")
  title-bar(title="关联智能音箱")
  navigator(class="weui-cell weui-cell_access" hover-class="weui-cell_active" url="/pages/phone/main")
    view(class="weui-cell__bd") 关联小爱音箱（小米）
    view(class="weui-cell__ft weui-cell__ft_in-access")
  navigator(class="weui-cell weui-cell_access" hover-class="weui-cell_active" url="/pages/xiaoduhelp/main")
    view(class="weui-cell__bd") 关联小度在家（百度）
    view(class="weui-cell__ft weui-cell__ft_in-access")
</template>

<script>
import navBar from '@/components/coursetable/navbar'

export default {
  data () {
    return {
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
  },

  onShareAppMessage () {
  }
}
</script>

<style scoped>
view {
  color: #0c5053;
}
</style>
