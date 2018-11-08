<template lang="pug">
  block(v-if='true')
    view(style="text-align:center;font-size:18px;color:#0c5053") 点击图片可放大查看
    swiper(indicator-dots="true" autoplay="true" interval="5000" circular="true" class="swiper-wrapper")
      swiper-item(v-for="(item, index) in desc" :key="index")
        view(class="swiper-item")
          image(:src="item.image" mode="aspectFit" @click="previewImage(item.image)")
          view(class="page__desc") {{index + 1}}. {{item.desc}}
</template>

<script>
export default {
  props: ['desc'],
  methods: {
    previewImage (imageUrl) {
      wx.previewImage({
        current: imageUrl,
        urls: this.desc.map((item) => { return item.image })
      })
    }
  }
}
</script>

<style scoped>

.swiper-wrapper {
  padding-top: 20rpx;
  height: 550rpx;
  width: 100%;
  background: white;
}

.swiper-item {
  text-align: center;
  padding-left: 50rpx;
  padding-right: 50rpx;
  background: #fefefe
}

.swiper-item image {
  height: 416rpx;
  width: 240rpx;
}

</style>