<template lang="pug">
  view(class="weui-cell")
    view(class="weui-cell__bd")
      current-week
    view(class="weui-cell__ft") 
      view(class="weui-flex")
        view(class="weui-flex__item")
          view(class="week-mode both-mode" :class="displayMode" @click="choose('both')") 全周
        view(class="weui-flex__item")
          view(class="week-mode odd-mode" :class="displayMode" @click="choose('odd')") 单周
        view(class="weui-flex__item")
          view(class="week-mode even-mode" :class="displayMode" @click="choose('even')") 双周
</template>

<script>
import currentWeek from './currentWeek'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      displayMode: 'both'
    }
  },
  computed: {
    ...mapGetters([
      'currentWeekOdd'
    ])
  },
  components: {
    currentWeek
  },
  methods: {
    choose (mode) {
      this.displayMode = mode
      this.$emit('weekModeChange', mode)
      wx.setStorage({
        key: 'displayBothWeek',
        data: mode === 'both'
      })
    }
  },
  onLoad () {
    wx.getStorage({
      key: 'displayBothWeek',
      success: res => {
        this.displayMode = res.data ? 'both' : (this.currentWeekOdd ? 'odd' : 'even')
      },
      fail: () => {
        this.displayMode = 'both'
      }
    })
  }
}
</script>

<style>
.week-mode {
  padding: 5rpx 20rpx;
  border:3rpx solid #19a1a8;
  color:#19a1a8;
  border-radius: 35rpx;
  margin-right: 8rpx;
  font-size: 28rpx;
}

.week-mode.both-mode.both,
.week-mode.even-mode.even,
.week-mode.odd-mode.odd {
  background-color: #19a1a8;
  color: white;
}
</style>