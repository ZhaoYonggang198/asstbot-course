<template lang="pug">
include ../../pug/template.pug

view(class="page content")
  title-bar(title="你朋友的课表")
  share-course-hint
  +navbar-swiper("(day, dayIdx) in courseInfo")
    block(v-if="interval.course.length>0")
      block(v-for="(course, courseIdx) in interval.course" :key="courseIdx")
        view(class="weui-cell weui-cell_access share-course-item" :class="{'shared-course': course.share}" @click='toggleShare(dayIdx, intervalIdx, courseIdx)')
          view(class="weui-cell__hd weui-check__hd_in-checkbox")
            icon(class="weui-icon-checkbox_circle" type="circle" size="23" v-if="!course.share")
            icon(class="weui-icon-checkbox_success" type="success" size="23" v-else)
          view(class="weui-cell__bd")
            view(class="weui-cell course-info")
              +course-info
    block(v-else)
      view(class="weui-cell")
        view(class="weui-cell__bd") 休息
  view(class="weui-flex bottom-button")
    button(class="button" size="small" @click="gotocourse") 回到主页
    button(class="button" size="small" open-type="share") 直接转发
    button(class="button" size="small" @click="mergecourse") 存入我的课表
</template>

<script>
import navBar from '@/components/coursetable/navbar'
import shareCourseHint from '@/components/coursetable/shareCourseHint'
import { mapState, mapActions } from 'vuex'

function filterByShare (courseInfo) {
  return courseInfo.map(day => {
    let tmpDay = day
    tmpDay.interval = day.interval.map(interval => {
      let tmpInterval = interval
      tmpInterval.course = interval.course.filter((course) => {
        return course.share
      })
      return tmpInterval
    })
    return tmpDay
  })
}

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
    navBar,
    shareCourseHint
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
      console.log('relaunch after confirm')
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
              this.gotocourse()
            }
          },
          fail: (err) => {
            console.log('comfirm continue on survey : ' + JSON.stringify(err))
          }
        })
      } else {
        this.copyCourses()
        this.gotocourse()
      }
    },
    copyCourses () {
      let courseInfo = filterByShare(this.courseInfo)

      this.$store.commit('copyCourses', {courseInfo, meta: this.courseMeta})
      this.saveCourses(this.owncourseInfo)
    },
    swiperchange (event) {
      this.activeDay = event.mp.detail.current
    },
    sharecourse () {
      console.log(this.$root.$mp.query)
    },
    toggleShare (dayIdx, intervalIdx, courseIdx) {
      this.courseInfo[dayIdx].interval[intervalIdx].course[courseIdx].share =
        !this.courseInfo[dayIdx].interval[intervalIdx].course[courseIdx].share
    }
  },

  created () {

  },

  onLoad (option) {
    if (option.user) {
      this.getOtherCourses(option.user)
        .then((courses) => {
          this.courseInfo = filterByShare(courses.courseInfo)
          this.courseMeta = {...courses.meta, from: option.user}
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
  padding-top: 20rpx;
  margin-bottom: 50rpx;
  display: flex;
  justify-content: center;
}

.bottom-button .button {
  font-size: 28rpx;
  margin-left: 15rpx;
  margin-right: 15rpx;
  line-height: 1.6;
  white-space:nowrap;
  background:#f2f2f2;
  border:3rpx solid #19a1a8;
  color:#19a1a8;
  border-radius:35rpx;
  padding:10rpx 20rpx;
  text-align:center;
  box-shadow:0 0 0;
  font-weight:500;
  min-width:60rpx;
}

.bottom-button .button:active {
  background: #19a1a8;
  color: white;
}

.share-course-item.shared-course {
  background-color: #fbfbfb;
}

@import '../../pug/course.css';
</style>
