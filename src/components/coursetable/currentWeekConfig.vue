<template lang="pug">
  view(class="weui-cell")
    view(class="weui-cell__bd")
      current-week
    view(class="weui-cell__ft")
      switch(checked @change='valueChange' v-if="initOddStatus")
      switch(@change='valueChange' v-else)
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import currentWeek from './currentWeek'

export default {
  data () {
    return {
      initOddStatus: true
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
      this.isOdd = event.mp.detail.value
      this.$store.commit('setCurrentWeek', event.mp.detail.value)
      this.$store.dispatch('saveCourses', this.courseInfo)
    }
  },
  onLoad () {
    this.initOddStatus = this.$store.getters.currentWeekOdd
  }
}
</script>

<style>
.card {
  padding: 10px;
}
</style>