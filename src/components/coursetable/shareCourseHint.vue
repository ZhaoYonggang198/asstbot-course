<template lang='pug'>
  view(class="weui-cell")
    view(class="weui-cell__bd") 选择要存入的课程
    
</template>

<script>
export default {
  props: ['text']
}
</script>

<style scoped>
view {
  color: #0c5053;
}
</style>