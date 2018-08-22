<template lang="pug">
view(class="page content")
  title-bar(title="你朋友的课表")
  view(class="course-table")
    view(class="weui-tab")
      view(class="tab-title")
        nav-bar(:navItems="weekdays" :current="activeDay" @tabActive="tabActive")/
      view(class="weui-tab__panel")
        swiper(@change="swiperchange" :current="activeDay" style="height: 100%")
          swiper-item(v-for="(day, dayIdx) in courseInfo" :key="dayIdx")
            view(class="weui-tab__content" )
              scroll-view(scroll-y='true' style="height: auto")
                block(v-for="(interval, j) in day.interval" :key="j")
                  i-panel(:title="interval.name" class="interval")
                    i-cell-group
                      block(v-if="interval.course.length>0")
                        block(v-for="(course, k) in interval.course" :key="k")
                          i-cell(:title="course")
                      block(v-else)
                        i-cell(title="休息")
  view(class="weui-flex bottom-button")
    view(class="weui-flex__item")
      button(size="small" @click="gotocourse") 回到主页    
    view(class="weui-flex__item")
      button(size="small" type="primary" @click="mergecourse") 复制课程
    //- view(class="weui-flex__item")
    //-   i-button(type="ghost" size="small" @iclick="mergecourse") 合并课程
</template>

<script>
import navBar from '@/components/coursetable/navbar'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      curDay: 0,
      activeDay: 0,
      courseInfo: []
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
      this.$store.commit('copyCourses', this.courseInfo)
      this.saveCourses(this.owncourseInfo)
        .then(() => {
          wx.reLaunch({
            url: '/pages/course/main'
          })
        })
    },
    swiperchange (event) {
      this.activeDay = event.mp.detail.current
    }
  },

  created () {

  },

  onLoad (option) {
    if (option.user) {
      this.getOtherCourses(option.user)
        .then((courses) => {
          this.courseInfo = courses
        })
    }
    this.getCourses()
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
}
</style>
