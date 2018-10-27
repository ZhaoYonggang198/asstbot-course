<template lang="pug">
view(class="page content")
  title-bar(title="小度音箱说明")
  view(class="weui-article")
    view(class="weui-article__h1") 课程表技能说明
    view(class="weui-article__section")
      view(class="weui-article__title") 简介
      view(class="weui-article__section")
        view(class="weui-article__p")
          text 为了方便
          text(class="bold-style") 小度音箱
          text 的用户，小哒为大家开发了
          text(class="bold-style") 课程表
          tex 技能
      view(class="weui-article__title") 使用说明
      view(class="weui-article__section")
        view(class="weui-article__p")
          text 在
          text(class="bold-style") 小度音箱App
          text 中启用
          text(class="bold-style") 课程表
          text 技能。对小度说“
          text(class="bold-style") 小度小度，打开课程表
          text ”，就可以使用课程表技能了
        view(class="weui-article__p")
          text 课程表技能支持查询课表。
        view(class="weui-article__p")
          text 用户在小度在家上打开技能,如果发现还没有录入课程,或者对音箱说"怎么录入课程",会提醒扫描小程序码在哒尔文小程序上输入课程。
        view(class="weui-article__p")
          text 使用微信扫描小度音箱屏幕上的小程序码，即完成在小程序和小度在家的关联。在小程序上输入课程，可以在小度音箱上使用本小程序的课表
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
.weui-article {
  background: white;
}
.weui-article__p {
  color: #999999
}

.bold-style {
  color: #0c5053;
  font-weight: bold;
}
</style>
