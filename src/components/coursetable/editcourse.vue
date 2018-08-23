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
          i-cell-group(class="select-course" v-if="showSelectCourse")
            block(v-for="(item, index) in selectCourses" :key="item")
              i-cell(:title="item" @iclick="select(item)") 
                view(class="choose-item" slot="icon")
          view(class="weui-cell")
            view(class="weui-cell__hd")
              view(class="weui-label") 时段
            view(class="weui-cell__bd weui-flex")
              view(class="weui-flex__item time-wrapper")
                picker(mode='time' start="00:00" end="23:59" :value="currentCourse.startTime" @change="startTimeChange")
                  view(v-if="currentCourse.startTime") {{currentCourse.startTime}}
                  view(v-else) 未指定
              view(class="weui-flex__item time-wrapper") ~
              view(class="weui-flex__item time-wrapper")
                picker(mode='time' start="00:00" end="23:59" :value="currentCourse.endTime" @change="endTimeChange")
                  view(v-if="currentCourse.endTime") {{currentCourse.endTime}}
                  view(v-else) 未指定
          view(class="weui-cell")
            view(class="weui-cell__hd")
              view(class="weui-label") 地点
            view(class="weui-cell__bd")
              input(:value="currentCourse.location" class="weui-input" placeholder="请输入地点" focus="" :error="error"
                @input="locationChange")
  i-message#message
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      currentCourse: {},
      showSelectCourse: true
    }
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
    select (item) {
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
    }
  },
  onLoad () {
    if (this.scene === 'add') {
      this.currentCourse = {
        name: '',
        location: '',
        startTime: '',
        endTime: ''
      }
    } else {
      this.currentCourse = JSON.parse(JSON.stringify(
        this.courseInfo[this.day].interval[this.interval].course[this.course]))
    }
    this.showSelectCourse = false
  }
}
</script>

<style scoped>
.choose-item {
  width: 15rpx;
  height: 15rpx;
  border-radius: 50%;
  background: #999
}
.input-wrapper {
  position: relative
}
.select-course {
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
</style>
