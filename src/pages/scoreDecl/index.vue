<template lang="pug">
view(class="page content")
  title-bar(title="积分说明")
  view(class="weui-article")
    view(class="weui-article__h1") 积分规则:
    view(class="weui-article__section")
      view(class="weui-article__p") 连续登录1天到6天，每天获得10个积分。
      view(class="weui-article__p") 连续登录7天到20天，每天获得20个积分。
      view(class="weui-article__p") 连续登录超过21天，每天获得30个积分。
      view(class="weui-article__p") 成功分享听写词语给其他好友，获得10个积分。
      view(class="weui-article__p") 成功分享课程表给其他好友，获得10个积分。
    view(class="weui-article__h1") 积分抽奖规则：
    view(class="weui-article__section")
      view(class="weui-article__p") 积分200可以兑换抽奖一次。
      view(class="weui-article__p") 每天兑换积分的次数没有限制。
    view(class="weui-article__h1") 说明：
    view(class="weui-article__section")
      view(class="weui-article__p") 本文中的积分规则和兑奖规则由小哒智能科技（上海）有限公司制定，相关积分规则和兑奖规则的最终修改权和解释权归公司所有。
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
