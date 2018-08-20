<template lang="pug">
view(class="page content")
  title-bar(title="")
  view(class="course-table")
    view(class="weui-tab")
      view(class="tab-title")
        nav-bar(:navItems="weekdays" :defaultIndex="curDay" @tabActive="tabActive")/
      view(class="weui-tab__panel")
        view(class="weui-tab__content" v-for="(day, dayIdx) in courseInfo"
            :key="dayIdx" v-if="activeDay == dayIdx")
          scroll-view(scroll-y='true' style="height: auto")
            block(v-for="(interval, intervalIdx) in day.interval" :key="intervalIdx")
              i-panel(:title="interval.name" class="interval" v-if="editmode")
                i-cell-group
                  block(v-if="interval.course.length>0")
                    block(v-for="(course, courseIdx) in interval.course" :key="courseIdx")
                      view(v-if="activeDay==dayIdx && activeInterval==intervalIdx && activeCourse==courseIdx"
                        class="active-course")
                        i-cell(:title="course" @iclick="toggleCourse(dayIdx, intervalIdx, courseIdx)")
                        course-operation(:dayIdx="dayIdx" :intervalIdx="intervalIdx" :courseIdx="courseIdx"
                          @configdone="toggleCourse(dayIdx, intervalIdx, courseIdx)"
                          @editcourse="editCourse(dayIdx, intervalIdx, courseIdx)")
                      block(v-else)
                        i-cell(:title="course" is-link="true" @iclick="toggleCourse(dayIdx, intervalIdx, courseIdx)")
                  i-cell(title="添加课程" @iclick="addcourse(dayIdx, intervalIdx)") 
                    i-icon(type="add" slot="icon")
              i-panel(:title="interval.name" class="interval" v-else)
                i-cell-group
                  block(v-if="interval.course.length>0")
                    block(v-for="(course, k) in interval.course" :key="k")
                      i-cell(:title="course")
                  block(v-else)
                    i-cell(title="休息")
  view(class="weui-flex")
    view(class="weui-flex__item")
      i-button(type="ghost" size="small" @iclick="toggleEditMode") {{editbutton}}
    view(class="weui-flex__item")
      i-button(open-type="share" size="small" type="ghost") 分享课表
    view(class="weui-flex__item")
      i-button(type="primary" size="small" @iclick="bindphone") 关联小爱
  editcourse(v-if="inediting" @editdone="editdone"
    :scene="scene" :day="editday" :interval="editinterval" :course="editcourse")
</template>

<script>
import navBar from '@/components/coursetable/navbar'
import courseOperation from '@/components/coursetable/courseOperation'
import editcourse from '@/components/coursetable/editcourse'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      curDay: 0,
      activeDay: 0,
      activeInterval: -1,
      activeCourse: -1,
      inediting: false,
      scene: 'add',
      editday: 0,
      editinterval: 0,
      editcourse: 0,
      editmode: false
    }
  },

  computed: {
    ...mapState({
      courseInfo: state => state.courses.courseInfo,
      openid: state => state.courses.openid
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
    }
  },

  components: {
    navBar,
    courseOperation,
    editcourse
  },

  methods: {
    ...mapActions([
      'getCourses'
    ]),
    tabActive (index) {
      this.activeDay = parseInt(index)
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
      this.editmode = !this.editmode
    }
  },

  created () {

  },

  onLoad () {
    this.getCourses().then(() => {
      var date = new Date()
      var weekday = date.getDay()
      this.curDay = (weekday === 0 ? 6 : (weekday - 1))
    })
    this.inediting = false
  },

  onShareAppMessage: function () {
    return {
      path: `/pages/course/main?user=${this.openid}`
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
.active-course {
  border: solid 3rpx #1cb2b9 !important;
}
</style>
