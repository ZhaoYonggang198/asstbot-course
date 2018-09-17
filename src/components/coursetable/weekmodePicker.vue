<template lang="pug">
  picker(mode='selector' @change="handlePickerChange" :value="index" :range="weekrange")
    view {{weekmode[index].display}}
</template>

<script>
const WEEK_MODE = [
  {
    value: 'both',
    display: '全周'
  },
  {
    value: 'odd',
    display: '单周'
  },
  {
    value: 'even',
    display: '双周'
  }
]
export default {
  props: ['value'],
  data () {
    return {
      weekrange: WEEK_MODE.map(item => {
        return item.display
      }),
      weekmode: WEEK_MODE,
      index: 0
    }
  },
  watch: {
    value: function (newVal) {
      for (let i in WEEK_MODE) {
        if (WEEK_MODE[i].value === newVal) {
          this.index = i
          return
        }
      }
    }
  },
  methods: {
    handlePickerChange (event) {
      let value = WEEK_MODE[event.mp.detail.value].value
      this.$emit('change', {value})
    }
  }
}
</script>

<style>

</style>