<template lang="pug">
view(class="weui-flex")
  view(class="weui-flex__item")
    i-button(size="small" @iclick="editcourse") 修改
  view(class="weui-flex__item")
    i-button(size="small" @iclick="moveupcourse") 上移   
  view(class="weui-flex__item")
    i-button(size="small" @iclick="movedowncourse") 下移
  view(class="weui-flex__item")
    i-button(size="small" @iclick="removecourse") 删除  
</template>

<script>
export default {
  props: ['dayIdx', 'intervalIdx', 'courseIdx'],
  methods: {
    editcourse () {
      this.$emit('editcourse')
    },
    moveupcourse () {
      this.$emit('configdone')
      this.$store.commit('moveupCourse', {day: this.dayIdx,
        interval: this.intervalIdx,
        course: this.courseIdx})
      this.$store.dispatch('saveCourses', this.courseInfo)
    },
    movedowncourse () {
      this.$emit('configdone')
      this.$store.commit('movedownCourse', {day: this.dayIdx,
        interval: this.intervalIdx,
        course: this.courseIdx})
      this.$store.dispatch('saveCourses', this.courseInfo)
    },
    removecourse () {
      this.$emit('configdone')
      this.$store.commit('deleteCourse', {day: this.dayIdx,
        interval: this.intervalIdx,
        course: this.courseIdx})
      this.$store.dispatch('saveCourses', this.courseInfo)
    }
  }
}
</script>

<style>
.card {
  padding: 10px;
}
</style>
