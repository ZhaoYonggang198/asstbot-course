<template lang="pug">
view
  i-popup(visible="true" @ok="confirm" @cancel="cancel" :title="title")
    view(style="text-align: left")
        view(class="weui-cells")
          select-input(inputId='name' label='课程名' placeholder="请输入课程名" 
            :value="currentCourse.name" :currentfocus="focusItem"
            :selectlist="allCourses" :validator="nameValidator"
            @change="nameChange" @focuson="selectInput('name')")
          select-input(inputId='teacher' label='任课老师' placeholder="请输入老师名" 
            :value="currentCourse.teacher" :currentfocus="focusItem"
            :selectlist="selectTeacher" :validator="teacherValidator"
            @change="teacherChange" @focuson="selectInput('teacher')")        
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
          select-input(inputId='location' label='地点' placeholder="请输入上课地点" 
            :value="currentCourse.location" :currentfocus="focusItem"
            :selectlist="selectLocation"  :validator="locationValidator"
            @change="locationChange" @focuson="selectInput('location')")   
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import weekmodePicker from './weekmodePicker'
import selectInput from './selectInput'
export default {
  data () {
    return {
      currentCourse: {},
      focusItem: 'name',
      selectLocation: [],
      selectTeacher: [],
      nameValidator: {
        valid: function (value) {
          const invalidCharacter = [',', '.', '，', '。']
          for (let i in invalidCharacter) {
            if (value.indexOf(invalidCharacter[i]) !== -1) {
              return false
            }
          }
          return true
        },
        hint: '课程名包含无效字符'
      },
      teacherValidator: {
        valid: function (value) {
          return true
        },
        hint: '老师名包含无效字符'
      },
      locationValidator: {
        valid: function (value) {
          return true
        },
        hint: '上课地点包含无效字符'
      }
    }
  },
  components: {
    weekmodePicker,
    selectInput
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
    ...mapGetters([
      'allCourses'
    ]),
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

      let allLocationOfCourse = this.$store.getters.allLocationOfCourse
        .filter((item) => {
          return item.name === newVal
        })
        .map((item) => {
          return item.location
        })

      let otherLocation = this.$store.getters.allLocations.filter((item) => {
        return allLocationOfCourse.indexOf(item) === -1
      })

      this.selectLocation = [...allLocationOfCourse, ...otherLocation]

      let teachers = this.$store.getters.allTeacherOfCourse(newVal)
      this.selectTeacher = teachers
    },

    'currentCourse.teacher': function (newVal) {
      console.log(newVal)
      this.selectTeacher = []
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
      this.currentCourse.name = event
    },

    startTimeChange (event) {
      this.currentCourse.startTime = event.mp.detail.value
    },

    endTimeChange (event) {
      this.currentCourse.endTime = event.mp.detail.value
    },

    locationChange (event) {
      this.currentCourse.location = event
    },

    weekmodeChange (event) {
      this.currentCourse.week = event.value
    },

    teacherChange (event) {
      this.currentCourse.teacher = event
    },

    selectInput (event) {
      this.focusItem = event
    }
  },
  onLoad () {
    if (this.scene === 'add') {
      let interval = this.$store.getters.canditateInterval(this.day, this.interval)
      this.currentCourse = {
        name: '',
        location: '',
        week: 'both',
        tearch: '',
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
.input-wrapper {
  position: relative
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



</style>
