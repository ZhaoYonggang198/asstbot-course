<template lang="pug">
include ../../pug/template.pug
  
view(class="page content")
  title-bar(title="课表")
  block(v-if="courseMeta.needOddEvenWeek")
    block(v-if="editmode")
      current-week-config
    block(v-else)
      week-display-mode(@weekModeChange="chooseWeekMode")
  +navbar-swiper("(day, dayIdx) in displayCourseInfo")
    block(v-if="!editmode")
      block(v-if="interval.course.length>0")
        block(v-for="(course, k) in interval.course" :key="k")
          view(class="weui-cell")
            +course-info
      block(v-else)
        view(class="weui-cell")
          view(class="weui-cell__bd") 休息
    block(v-else)
      block(v-for="(course, courseIdx) in interval.course" :key="courseIdx")
        view(class="active-course" v-if="activeDay==dayIdx && activeInterval==intervalIdx && activeCourse==courseIdx")
          view(class="weui-cell" @click="toggleCourse(dayIdx, intervalIdx, courseIdx)")
            +course-info
          view(class="weui-celll")
            course-operation(:dayIdx="dayIdx" :intervalIdx="intervalIdx" :courseIdx="courseIdx"
              @configdone="configDone(dayIdx, intervalIdx, courseIdx)"
              @editcourse="editCourse(dayIdx, intervalIdx, courseIdx)")
        view(class="weui-cell weui-cell_access" v-else @click="toggleCourse(dayIdx, intervalIdx, courseIdx)")
          +course-info
          view(class="weui-cell__ft weui-cell__ft_in-access")
      view(class="weui-cell add-more" @click="addcourse(dayIdx, intervalIdx)" v-if="activeInterval != intervalIdx") 
        view(class="weui-cell__bd") 添加更多
  view(class="weui-flex bottom-button" v-if="!editmode")
    view(class="weui-flex__item")
      button(class="button" size="small" @click="toggleEditMode") 编辑课程
    view(class="weui-flex__item" )
      button(class="button" open-type="share" type="ghost") 分享课表
    view(class="weui-flex__item")
      button(class="button" type="primary"  @click="bindphone") 关联小米音箱
  view(class="weui-flex bottom-button" v-else)
    view(class="weui-flex__item")
      button(class="weui-btn" type="primary" @click="toggleEditMode") 完成编辑
  editcourse(v-if="inediting" @editdone="editdone"
    :scene="scene" :day="editday" :interval="editinterval" :course="editcourse")
</template>

<script>
import navBar from '@/components/coursetable/navbar'
import courseOperation from '@/components/coursetable/courseOperation'
import editcourse from '@/components/coursetable/editcourse'
import currentWeekConfig from '@/components/coursetable/currentWeekConfig'
import weekDisplayMode from '@/components/coursetable/weekDisplayMode'
import { mapState, mapActions } from 'vuex'

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
      editcourse: 0,
      editmode: false,
      weekmode: 'both',
      displayCourseInfo: []
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

    displayCurrentWeek () {
      let currentWeekOdd = this.$store.getters.currentWeekOdd ? '单周' : '双周'
      return `本周为 ${currentWeekOdd}`
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
        url: '/pages/phone/main'
      })
    },
    editCourse (day, interval, course) {
      this.inediting = true
      this.scene = 'config'
      this.editday = day
      this.editinterval = interval
      this.editcourse = course
    },
    editdone () {
      this.inediting = false
    },
    addcourse (day, interval) {
      this.inediting = true
      this.scene = 'add'
      this.editday = day
      this.editinterval = interval
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
    }
  },

  created () {
  },

  onLoad () {
    this.getCourses().then(() => {
      var date = new Date()
      var weekday = date.getDay()
      this.activeDay = (weekday === 0 ? 6 : (weekday - 1))
      this.setDisplayCourseInfo()
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
  margin-bottom: 40rpx;
}

.bottom-button .button {
  font-size: 28rpx;
  line-height: 2;
  margin-left: 10rpx;
  margin-right: 10rpx;
}

.bottom-button .weui-btn {
  font-size: 28rpx;
  margin-left: 20rpx;
  margin-right: 20rpx;
}

.current-week {
  font-size: 40rpx;
}

</style>
