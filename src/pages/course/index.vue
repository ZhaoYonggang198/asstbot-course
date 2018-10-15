<template lang="pug">
include ../../pug/template.pug

view(class="page content")
  title-bar(title="我的课表")
  block(v-if="courseMeta.needOddEvenWeek")
    block(v-if="editmode")
      current-week-config
    block(v-else)
      week-display-mode(@weekModeChange="chooseWeekMode")
  +navbar-swiper("(day, dayIdx) in displayCourseInfo")
    block(v-if="!editmode")
      block(v-if="interval.course.length>0")
        block(v-for="(course, k) in interval.course" :key="k")
          view(class="weui-cell course-info" :class="currentCourses[dayIdx][intervalIdx][k]?'current-course':''" @click="setEditmode")
            +course-info
      block(v-else)
        view(class="weui-cell" @click="setEditmode")
          view(class="weui-cell__bd course-name") 休息
    block(v-else)
      block(v-for="(course, courseIdx) in interval.course" :key="courseIdx")
        view(class="active-course" v-if="activeDay==dayIdx && activeInterval==intervalIdx && activeCourse==courseIdx")
          view(class="weui-cell course-info" @click="toggleCourse(dayIdx, intervalIdx, courseIdx)")
            +course-info
          view(class="weui-celll")
            course-operation(:dayIdx="dayIdx" :intervalIdx="intervalIdx" :courseIdx="courseIdx"
              @configdone="configDone(dayIdx, intervalIdx, courseIdx)"
              @editcourse="editCourse(dayIdx, intervalIdx, courseIdx)")
        view(class="weui-cell weui-cell_access" v-else @longtap="toggleCourse(dayIdx, intervalIdx, courseIdx)")
          view(class="weui-cell__bd" @click="editCourse(dayIdx, intervalIdx, courseIdx)")
            view(class="weui-cell course-info")
              +course-info
          view(class="weui-cell__ft course-config")
            i( class="icon iconfont icon-editor" @click="editCourse(dayIdx, intervalIdx, courseIdx)")
            i(class="icon iconfont icon-trash" @click="removecourse(dayIdx, intervalIdx, courseIdx)")
      view(class="weui-cell add-more" @click="addcourse(dayIdx, intervalIdx)" v-if="activeInterval != intervalIdx")
        view(class="weui-cell__bd") 添加更多
  view(class="bottom-button" v-if="!editmode")
    button(class="button" size="small" @click="toggleEditMode") 修改课表
    button(class="button" open-type="share" type="ghost") 转发给...
    button(class="button" type="primary" @click="bindphone") 关联智能音箱
  view(class="bottom-button" v-else)
    button(class="button" type="primary" @click="toggleEditMode") 完成修改
  editcourse(v-if="inediting" @editdone="editdone"
    :scene="scene" :day="editday" :interval="editinterval" :course="editingcourse"
    :recommendCourseName="recommendCourseName")
</template>

<script>
import navBar from '@/components/coursetable/navbar'
import courseOperation from '@/components/coursetable/courseOperation'
import editcourse from '@/components/coursetable/editcourse'
import currentWeekConfig from '@/components/coursetable/currentWeekConfig'
import weekDisplayMode from '@/components/coursetable/weekDisplayMode'
import { mapState, mapActions } from 'vuex'
import Time from '@/utils/time'

export default {
  data () {
    return {
      activeDay: 0,
      activeInterval: -1,
      activeCourse: -1,
      inediting: false,
      scene: 'add',
      editday: 0,
      editinterval: 0,
      editingcourse: 0,
      editmode: false,
      weekmode: 'both',
      displayCourseInfo: [],
      currentDay: 0,
      recommendCourseName: '',
      loadOption: {}
    }
  },

  computed: {
    ...mapState({
      courseInfo: state => state.courses.courseInfo,
      openid: state => state.courses.openid,
      courseMeta: state => state.courses.courseMeta
    }),
    weekdays () {
      if (this.courseInfo.length === 0) {
        return []
      }
      return this.courseInfo.map((day) => {
        return day.name
      })
    },
    editbutton () {
      return this.editmode ? '确认编辑' : '编辑课程'
    },
    currentCourses () {
      return this.displayCourseInfo.map((day, dayIndex) => {
        return day.interval.map((interval, intervalIndex) => {
          return interval.course.map((course, index) => {
            if (dayIndex === this.currentDay) {
              let date = new Date()
              let current = `${date.getHours()}:${date.getMinutes()}`
              if (course.startTime && course.endTime) {
                if (Time.isGreater(current, course.startTime) &&
                  Time.isGreater(course.endTime, current)) {
                  return true
                }
                if (index > 0 &&
                  interval.course[index - 1].startTime &&
                  interval.course[index - 1].endTime) {
                  if (Time.isGreater(current, interval.course[index - 1].endTime) &&
                    Time.isGreater(course.startTime, current)) {
                    return true
                  }
                }
                if (index === 0 &&
                  Time.interval(current, course.startTime) < 30 &&
                  Time.interval(current, course.startTime) >= 0) {
                  return true
                }
              }
            }
            return false
          })
        })
      })
    }
  },

  components: {
    navBar,
    courseOperation,
    editcourse,
    currentWeekConfig,
    weekDisplayMode
  },

  methods: {
    ...mapActions([
      'getCourses'
    ]),
    tabActive (index) {
      this.activeDay = parseInt(index)
      this.activeInterval = -1
      this.activeCourse = -1
    },
    toggleCourse (dayIdx, intervalIdx, courseIdx) {
      if (dayIdx !== this.activeDay) {
        return
      }
      if (this.activeInterval !== -1 && this.activeCourse !== -1) {
        this.activeInterval = -1
        this.activeCourse = -1
      } else {
        this.activeInterval = intervalIdx
        this.activeCourse = courseIdx
      }
    },
    bindphone () {
      wx.navigateTo({
        url: '/pages/smartSpeaker/main'
      })
    },
    editCourse (day, interval, course) {
      this.inediting = true
      this.scene = 'config'
      this.editday = day
      this.editinterval = interval
      this.editingcourse = course
    },
    editdone () {
      this.inediting = false
      this.recommendCourseName = ''
      this.activeInterval = -1
      this.activeCourse = -1
    },
    addcourse (day, interval) {
      this.inediting = true
      this.scene = 'add'
      this.editday = day
      this.editinterval = interval
      this.editingcourse = this.courseInfo[day].interval[interval].course.length
    },
    toggleEditMode () {
      if (this.editmode) {
        this.clearEditmode()
      } else {
        this.setEditmode()
      }
    },
    configDone (day, interval, course) {
      this.toggleCourse(day, interval, course)
      this.$store.dispatch('saveCourses', this.courseInfo)
    },
    swiperchange (event) {
      this.activeDay = event.mp.detail.current
      this.activeInterval = -1
      this.activeCourse = -1
    },
    setEditmode () {
      this.editmode = true
      this.activeInterval = -1
      this.activeCourse = -1
      this.setDisplayCourseInfo()
    },
    clearEditmode () {
      this.editmode = false
      this.activeInterval = -1
      this.activeCourse = -1
      this.setDisplayCourseInfo()
    },
    chooseWeekMode (value) {
      this.weekmode = value
      this.setDisplayCourseInfo()
    },
    setDisplayCourseInfo () {
      if (this.editmode) {
        this.displayCourseInfo = this.courseInfo
      } else {
        this.displayCourseInfo = this.$store.getters.getDisplayCourse((course) => {
          if (this.weekmode === 'both' || course.week === 'both') {
            return true
          } else {
            return this.weekmode === course.week
          }
        })
      }
    },
    removecourse (day, interval, course) {
      wx.showModal({
        title: '确定删除这节课吗',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#0c5053',
        confirmText: '确定',
        confirmColor: '#19a1a8',
        success: res => {
          if (res.confirm) {
            this.$store.commit('deleteCourse', {day,
              interval,
              course})
            this.$store.dispatch('saveCourses', this.courseInfo)
          }
        }
      })
    }
  },

  created () {
  },

  onLoad (option) {
    var duerosId = option.scene
    if (duerosId && duerosId.indexOf('dueros') !== -1) {
      console.log('qrcode scan from dueros, duerosId = ' + duerosId)
      this.$store.dispatch('toBindDuerosId', duerosId)
    } else {
      if (option.weekday && option.time) {
        this.loadOption = {
          weekday: option.weekday,
          time: option.time,
          course: option.course,
          config: 'add'
        }
      }
    }
    this.getCourses().then(() => {
      var weekday = new Date().getDay()
      this.activeDay = (weekday === 0 ? 6 : (weekday - 1))
      this.currentDay = this.activeDay
      this.setDisplayCourseInfo()
      if (this.loadOption.config === 'add') {
        this.editmode = true
        if (this.loadOption.weekday !== undefined && this.loadOption.time !== undefined) {
          this.inediting = true
          this.activeDay = this.loadOption.weekday
          this.editday = this.loadOption.weekday
          this.editinterval = this.loadOption.time
          this.scene = 'add'
          this.recommendCourseName = this.loadOption.course
        }
      }
    })
    this.inediting = false
    this.clearEditmode()
  },

  onShareAppMessage: function () {
    return {
      path: `/pages/sharedcourse/main?user=${this.openid}`
    }
  }
}
</script>

<style scoped>
@import "../../pug/course.css";
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
.active-course {
  border: solid 3rpx #1cb2b9 !important;
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

.bottom-button .weui-btn {
  font-size: 28rpx;
  margin-left: 20rpx;
  margin-right: 20rpx;
}

.current-week {
  font-size: 40rpx;
}

.course-config {
  display: flex;
  flex-direction: row;
}

.icon.iconfont {
  font-size: 45rpx;
  margin-left: 20rpx;
}

</style>
