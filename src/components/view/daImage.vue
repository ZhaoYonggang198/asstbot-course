<template>
  <view class="image-wrapper" v-if="url">
    <image mode="widthFix" class="image" :src="url"/>
  </view>
</template>

<script>
export default {
  props: ['url']
}
</script>

<style scoped>
.image-wrapper{
  text-align: center;
  font-size: 0;
  position: relative;
  background: #fff;
  border-bottom: 1px solid #d8d8d8;
}
.image{
  display: inline-block;
  width:100%;
}
</style>
