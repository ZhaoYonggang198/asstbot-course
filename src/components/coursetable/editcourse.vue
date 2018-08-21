<template lang="pug">
view
  i-popup(visible="true" @ok="confirm" @cancel="cancel" :title="title")
    view(style="text-align: left")
        view(class="input-wrapper")
          input(:value="coursename" class="weui-input" placeholder="请输入课程名" focus="true" :error="error"
            @input="change")
          i-cell-group(class="select-course" v-if="showSelectCourse")
            block(v-for="(item, index) in selectCourses" :key="item")
              i-cell(:title="item" @iclick="select(item)") 
                view(class="choose-item" slot="icon")        
  i-message#message
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      coursename: '',
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
      if (this.coursename === undefined) {
        return []
      }
      return this.$store.getters.allCourses.filter((course) => {
        return this.coursename !== course &&
          course.indexOf(this.coursename) !== -1
      }).splice(0, 5)
    }
  },
  methods: {
    confirm () {
      if (this.scene === 'config') {
        if (this.coursename === '') {
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
            value: this.coursename})
        }
      } else {
        if (this.coursename !== '') {
          this.$store.commit('appendCourse', {
            day: this.day,
            interval: this.interval,
            value: this.coursename
          })
        }
      }
      this.$store.dispatch('saveCourses', this.courseInfo)
      this.$emit('editdone')
    },
    cancel () {
      this.$emit('editdone')
    },
    change (event) {
      this.showSelectCourse = true
      this.coursename = event.mp.detail.value
    },
    select (item) {
      this.coursename = item
    }
  },
  onLoad () {
    if (this.scene === 'add') {
      this.coursename = ''
    } else {
      this.coursename = this.courseInfo[this.day].interval[this.interval].course[this.course]
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
  box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12) !important;
}
.weui-input {
  padding: 10rpx 20rpx;
  color: black;
  display: block;
  box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12) !important;
}
</style>
