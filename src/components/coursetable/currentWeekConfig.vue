<template lang="pug">
  view(class="weui-cell")
    view(class="weui-cell__bd")
      current-week
    view(class="weui-cell__ft")
      switch(:checked="currentWeekOdd" @change='valueChange')
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import currentWeek from './currentWeek'

export default {
  data () {
    return {
      isOdd: true
    }
  },
  components: {
    currentWeek
  },
  computed: {
    ...mapState({
      courseInfo: state => state.courses.courseInfo
    }),
    ...mapGetters([
      'currentWeekOdd'
    ])
  },
  methods: {
    valueChange (event) {
      this.$store.commit('setCurrentWeek', event.mp.detail.value)
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