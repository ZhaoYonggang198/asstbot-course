<template lang="pug">
  view(class="page")
    title-bar(title="打赏")
    donate
    
</template>

<script>
import donate from '@/components/donate'

export default {
  data: {
  },
  computed: {
  },
  components: {
    donate
  },
  methods: {
  },
  onLoad (option) {
  }
}
</script>

<style lang="less" scoped>
.content {
  flex-direction: column;
}
.weui-label {
  color: #999;
}
</style>
