<template lang="pug">
include ../../pug/template.pug

view(class="page content")
  title-bar(title="你朋友的课表")
  +navbar-swiper("(day, dayIdx) in courseInfo")
    block(v-if="interval.course.length>0")
      block(v-for="(course, k) in interval.course" :key="k")
        view(class="weui-cell")
          +course-info
    block(v-else)
      view(class="weui-cell")
        view(class="weui-cell__bd") 休息
  view(class="weui-flex bottom-button")
    view(class="weui-flex__item")
      button(size="small" @click="gotocourse") 回到主页
    view(class="weui-flex__item")
      button(size="small" open-type="share") 直接转发
    view(class="weui-flex__item")
      button(size="small" type="primary" @click="mergecourse") 存入我的课表
</template>

<script>
import navBar from '@/components/coursetable/navbar'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      curDay: 0,
      activeDay: 0,
      courseInfo: [],
      courseMeta: {},
      weekmode: 'both'
    }
  },

  computed: {
    ...mapState({
      owncourseInfo: state => state.courses.courseInfo
    }),
    weekdays () {
      if (this.courseInfo.length === 0) {
        return []
      }
      return this.courseInfo.map((day) => {
        return day.name
      })
    }
  },

  components: {
    navBar
  },

  methods: {
    ...mapActions([
      'getCourses',
      'getOtherCourses',
      'saveCourses'
    ]),
    tabActive (index) {
      this.activeDay = index
    },
    gotocourse () {
      wx.reLaunch({
        url: '/pages/index/main'
      })
    },
    mergecourse () {
      if (this.$store.getters.allCourses.length > 0) {
        wx.showModal({
          title: '你的课表将会被覆盖',
          content: '确认要复制吗？',
          success: (res) => {
            if (res.confirm) {
              this.copyCourses()
            }
          },
          fail: (err) => {
            console.log('comfirm continue on survey : ' + JSON.stringify(err))
          }
        })
      } else {
        this.copyCourses()
      }
    },
    copyCourses () {
      this.$store.commit('copyCourses', {courseInfo: this.courseInfo, meta: this.courseMeta})
      this.saveCourses(this.owncourseInfo)
        .then(() => {
          wx.reLaunch({
            url: '/pages/course/main'
          })
        })
    },
    swiperchange (event) {
      this.activeDay = event.mp.detail.current
    },
    sharecourse () {
      console.log(this.$root.$mp.query)
    }
  },

  created () {

  },

  onLoad (option) {
    if (option.user) {
      this.getOtherCourses(option.user)
        .then((courses) => {
          this.courseInfo = courses.courseInfo
          this.courseMeta = courses.meta
        })
    }
    this.getCourses()
  },

  onShareAppMessage: function () {
    return {
      path: `/pages/sharedcourse/main?user=${this.$root.$mp.query.user}`
    }
  }
}
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.tab-title {
  background: #999;
  z-index: 2;
}
.course-table {
  flex: 1;
  flex-direction:column;
  display: flex;
}
.bottom-button {
  margin-bottom: 40rpx;
}

.bottom-button button {
  font-size: 28rpx;
  line-height: 2;
  margin-left: 20rpx;
  margin-right: 20rpx;
  padding-left: 10rpx;
  padding-right: 10rpx;
}

@import '../../pug/course.css';
</style>
