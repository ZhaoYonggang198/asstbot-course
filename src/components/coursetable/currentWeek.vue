<template lang="pug">
  view 本周为
    text(class="current-week" v-if="currentWeekOdd") 单周
    text(class='current-week' v-else) 双周
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'currentWeekOdd'
    ])
  }
}
</script>

<style scoped>
.current-week {
  font-weight: bold;
}
view {
  color: #0c5053;
}
</style>