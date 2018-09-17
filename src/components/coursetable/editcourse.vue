<template lang="pug">
view
  i-popup(visible="true" @ok="confirm" @cancel="cancel" :title="title")
    view(style="text-align: left")
        view(class="weui-cells")
          view(class="weui-cell")
            view(class="weui-cell__hd")
              view(class="weui-label") 课程名
            view(class="weui-cell__bd")
              input(:value="currentCourse.name" class="weui-input" placeholder="请输入课程名" focus="true" :error="error"
                @input="nameChange")
          view(class="select-list" v-if="showSelectCourse")
            block(v-for="(item, index) in selectCourses" :key="item")
              view(class="weui-cell" @click="courseSelected(item)")
                view(class="weui-cell__hd")
                  view(class="weui-label")          
                view(class="weui-cell__bd") 
                  icon(class="weui-icon-checkbox_circle" type="circle" size="16")
                  view {{item}}
          view(class="weui-cell")
            view(class="weui-cell__hd")
              view(class="weui-label") 周次
            view(class="weui-cell__bd")
              weekmode-picker(:value="currentCourse.week" @change="weekmodeChange")
          view(class="weui-cell")
            view(class="weui-cell__hd")
              view(class="weui-label") 时段
            view(class="weui-cell__bd weui-flex")
              view(class="weui-flex__item time-wrapper")
                timepicker(mode='time' :start="minStartTime"
                    :end="currentCourse.endTime?currentCourse.endTime:maxStartTime"
                    :value="currentCourse.startTime?currentCourse.startTime:minStartTime"
                    @change="startTimeChange")
                  view(v-if="currentCourse.startTime") {{currentCourse.startTime}}
                  view(v-else) 未指定
              view(class="weui-flex__item time-wrapper") ~
              view(class="weui-flex__item time-wrapper")
                timepicker(mode='time' :start="currentCourse.startTime?currentCourse.startTime:minEndTime"
                    :end="maxEndTime"
                    :value="currentCourse.endTime?currentCourse.endTime:minEndTime"
                    @change="endTimeChange")
                  view(v-if="currentCourse.endTime") {{currentCourse.endTime}}
                  view(v-else) 未指定
          view(class="weui-cell")
            view(class="weui-cell__hd")
              view(class="weui-label") 地点
            view(class="weui-cell__bd")
              input(:value="currentCourse.location" class="weui-input" placeholder="请输入地点" :error="error"
                @input="locationChange")
          view(class="select-list")
            block(v-for="(item, index) in selectLocation" :key="item")
              view(class="weui-cell" @click="locationSelected(item)")
                view(class="weui-cell__hd")
                  view(class="weui-label")          
                view(class="weui-cell__bd") 
                  icon(class="weui-icon-checkbox_circle" type="circle" size="16")
                  view {{item}}
  i-message#message
</template>

<script>
import { mapState } from 'vuex'
import weekmodePicker from './weekmodePicker'
export default {
  data () {
    return {
      currentCourse: {},
      showSelectCourse: true,
      selectLocation: []
    }
  },
  components: {
    weekmodePicker
  },
  props: {
    scene: {
      type: String,
      default: 'config'
    },
    day: {
      type: Number,
      default: 0
    },
    interval: {
      type: Number,
      default: 0
    },
    course: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState({
      courseInfo: state => state.courses.courseInfo
    }),
    title () {
      if (!this.scene) {
        return ''
      }
      let day = this.courseInfo[this.day]
      let intervalDesc = day.name + day.interval[this.interval].name

      if (this.scene === 'add') {
        return `添加${intervalDesc}课程`
      } else {
        return `编辑课程`
      }
    },
    selectCourses () {
      if (this.currentCourse.name === undefined) {
        return []
      }
      return this.$store.getters.allCourses.filter((course) => {
        return this.currentCourse.name !== course &&
          course.indexOf(this.currentCourse.name) !== -1
      }).splice(0, 5)
    },
    minStartTime () {
      if (this.courseInfo[this.day].interval[this.interval].name === '上午') {
        return '03:00'
      } else if (this.courseInfo[this.day].interval[this.interval].name === '下午') {
        return '12:00'
      } else {
        return '18:00'
      }
    },
    maxStartTime () {
      if (this.courseInfo[this.day].interval[this.interval].name === '上午') {
        return '12:00'
      } else if (this.courseInfo[this.day].interval[this.interval].name === '下午') {
        return '18:00'
      } else {
        return '23:59'
      }
    },
    minEndTime () {
      if (this.courseInfo[this.day].interval[this.interval].name === '上午') {
        return '03:00'
      } else if (this.courseInfo[this.day].interval[this.interval].name === '下午') {
        return '12:00'
      } else {
        return '18:00'
      }
    },
    maxEndTime () {
      if (this.courseInfo[this.day].interval[this.interval].name === '上午') {
        return '13:00'
      } else if (this.courseInfo[this.day].interval[this.interval].name === '下午') {
        return '20:00'
      } else {
        return '23:59'
      }
    }
  },
  watch: {
    'currentCourse.name': function (newVal) {
      if (!newVal) {
        return
      }

      let locations = this.$store.getters.allLocationOfCourse
        .filter((item) => {
          return item.name === newVal
        })
        .map((item) => {
          return item.location
        })

      this.selectLocation = locations
    },
    'currentCourse.location': function (newVal) {
      let locations = this.$store.getters.allLocations.filter((item) => {
        return item !== newVal && item.indexOf(newVal) !== -1
      }).splice(0, 5)
      this.selectLocation = locations
    }
  },
  methods: {
    confirm () {
      if (this.scene === 'config') {
        if (this.currentCourse.name === '') {
          this.$store.commit('deleteCourse', {
            day: this.day,
            interval: this.interval,
            course: this.course
          })
        } else {
          this.$store.commit('editCourse', {
            day: this.day,
            interval: this.interval,
            course: this.course,
            value: this.currentCourse})
        }
      } else {
        if (this.currentCourse.name !== '') {
          this.$store.commit('appendCourse', {
            day: this.day,
            interval: this.interval,
            value: this.currentCourse
          })
        }
      }
      this.$store.dispatch('saveCourses', this.courseInfo)
      this.$emit('editdone')
    },
    cancel () {
      this.$emit('editdone')
    },
    nameChange (event) {
      this.showSelectCourse = true
      this.currentCourse.name = event.mp.detail.value
    },
    courseSelected (item) {
      this.currentCourse.name = item
    },

    startTimeChange (event) {
      this.currentCourse.startTime = event.mp.detail.value
    },

    endTimeChange (event) {
      this.currentCourse.endTime = event.mp.detail.value
    },

    locationChange (event) {
      this.currentCourse.location = event.mp.detail.value
    },

    locationSelected (item) {
      this.currentCourse.location = item
    },

    weekmodeChange (event) {
      this.currentCourse.week = event.value
    }
  },
  onLoad () {
    if (this.scene === 'add') {
      let interval = this.$store.getters.canditateInterval(this.day, this.interval)
      this.currentCourse = {
        name: '',
        location: '',
        week: 'both',
        ...interval
      }
      this.showSelectCourse = true
    } else {
      this.currentCourse = JSON.parse(JSON.stringify(
        this.courseInfo[this.day].interval[this.interval].course[this.course]))
      this.showSelectCourse = false
    }
  }
}
</script>

<style scoped>
.choose-item {
  width: 15rpx;
  height: 15rpx;
  border-radius: 50%;
  background: #999;
  margin-right: 40rpx;
}
.input-wrapper {
  position: relative
}
.select-list {
  max-height: 100px;
}
.weui-input {
  font-size: 28rpx;
  border-bottom: solid 1rpx #d6d8d8;
}

.time-wrapper {
  text-align: center;
  font-size: 28rpx;
}

.time-wrapper:first-child {
  text-align: left;
}

.time-wrapper:last-child {
  text-align: right;
}

.weui-cells:before {
  border: none;
}

.weui-cells:after {
  border: none;
}

.weui-cell:before {
  display: none;
}

.select-list .weui-cell {
  padding-top: 5rpx;
  padding-bottom: 5rpx;
  color: #666;
  font-size: 26rpx;
}

.select-list .weui-cell__bd {
  display: flex;
  flex-direction: row;
}
</style>
