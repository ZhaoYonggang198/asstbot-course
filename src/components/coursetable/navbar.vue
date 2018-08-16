<template>
  <view class="weui-navbar">
    <block v-for="(navItem, index) in navItems" :key="index">
      <view class="weui-navbar__item" :id="index" :class="activeIndex == index ? 'weui-bar__item_on' : ''" @click="tabClick">
          <view class="weui-navbar__title">{{navItem}}</view>
      </view>
    </block>
    <view class="weui-navbar__slider" :style="sliderStyle">
    </view>
  </view>
</template>

<script>
var sliderWidth = 48

export default {
  data () {
    return {
      activeIndex: 0,
      // sliderOffset: 0,
      // sliderLeft: 0,
      windowWidth: 414
    }
  },
  props: {
    navItems: {
      type: Object,
      default: ['选项一', '选项二', '选项三']
    },
    defaultIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    defaultIndex: function (val) {
      this.activeIndex = val
      this.$emit('tabActive', val)
    }
  },
  computed: {
    sliderStyle () {
      let sliderLeft = ((this.windowWidth / this.navItems.length) - sliderWidth) / 2
      let sliderOffset = this.windowWidth / this.navItems.length * this.activeIndex
      return `left: ${sliderLeft}px; transform: translateX(${sliderOffset}px); -webkit-transform: translateX(${sliderOffset}px);`
    }
  },

  methods: {
    tabClick (event) {
      var index = event.mp.currentTarget.id
      var offsetLeft = event.mp.currentTarget.offsetLeft

      this.activeIndex = index
      this.sliderOffset = offsetLeft
      this.$emit('tabActive', index)
    }
  },

  onLoad () {
    var that = this
    // this.activeIndex = this.defaultIndex
    wx.getSystemInfo({
      success: function (res) {
        that.windowWidth = res.windowWidth
      }
    })
  }
}
</script>

<style scoped>
.weui-navbar__slider {
  width: 3em;
  background: #2b85e4!important
}

.weui-bar__item_on {
  color:  #2b85e4!important;
}

.weui-navbar {
  background-color: white;
}
</style>
