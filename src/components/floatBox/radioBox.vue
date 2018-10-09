<template>
  <scroll-view scroll-x="true">
    <view class="big-box" :class="bigBoxStyle">
      <label class="option-container light form-control"
        v-for="action in actions" :key="action" @click="selectAction(index)"
        :class="{'have background-fff': havaImage, 'no-image user-msg-box-color': !havaImage}">
        <block v-if="havaImage">
          <view class="value image-value one-line-text">{{action.caption}}</view>
        </block>
        <block v-else>
          <view class="value valueBox">{{action.caption}}</view>
        </block>        
      </label>
      <block v-for="option in list.items" :key="option" v-if="list.type==='radio'">
        <label v-if="!option.type || option.type !== 'share'"
            class="option-container light form-control"
            @touchstart="touchStart(option)"
            @touchmove="touchMove"
            @touchend="touchEnd"
            @touch="touchOn"
            @click="selectItem(option)"
            :class="{'have background-fff': havaImage, 'no-image user-msg-box-color': !havaImage}">
          <block v-if="havaImage">
            <view class="image-box imageBox">
              <image class="image" mode="aspectFit" :src="option.imageUrl" v-if="option.imageUrl"></image>
            </view>
            <view class="value image-value" :class="[multiLineFlags[index] ? 'two-line-text':'one-line-text']" v-if="option.caption">{{option.caption}}</view>
          </block>
          <block v-else>
            <view class="value valueBox">{{option.caption}}</view>
          </block>
        </label>
        <label v-else
            class="option-container light form-control"
            @touchstart="touchStart(option)"
            @touchmove="touchMove"
            @touchend="touchEnd"
            @touch="touchOn"
            :for="index"
            :class="{'have background-fff': havaImage, 'no-image user-msg-box-color': !havaImage}">
          <block v-if="havaImage">
            <view class="image-box imageBox">
              <image class="image" mode="aspectFit" :src="option.imageUrl" v-if="option.imageUrl"></image>
            </view>
            <view class="value image-value" :class="[multiLineFlags[index] ? 'two-line-text':'one-line-text']" v-if="option.caption">{{option.caption}}</view>
          </block>
          <block v-else>
            <view class="value valueBox">{{option.caption}}</view>
          </block>
          <button :id="index" open-type="share" style="display:none"/>
        </label>
      </block>
    </view>
  </scroll-view>

</template>

<script>
  import { getLineCount } from '@/utils/layout'
  export default {
    data () {
      return {
        value: '',
        touchStartTime: '',
        touchEndTime: '',
        touchMoveTime: '',
        timeout: '',
        multiLineFlags: []
      }
    },
    name: 'radioBox',
    props: ['list', 'actions'],
    computed: {
      havaImage: state => {
        if (!state.list || !state.list.items) {
          return true
        }

        let a = state.list.items.find(item => !!item.imageUrl === true)
        return a !== undefined
      },
      bigBoxStyle: state => {
        var itemLength = state.actions ? state.actions.length : 0
        if (state.list.type === 'radio') {
          if (state.list.items) {
            itemLength = itemLength + state.list.items.length
          }
        }
        return `list-${itemLength}`
      }
    },
    methods: {
      selectAction (actionIndex) {
        this.$emit('actionclick', actionIndex)
      },
      selectItem (obj) {
        if (this.touchEndTime - this.touchStartTime < 800) {
          this.$store.dispatch('sentRadioReply', {...obj, value: obj.value ? obj.value : obj.caption})
        }
      },
      touchStart (option) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        const that = this
        this.touchStartTime = new Date().getTime()
        this.timeout = setTimeout(function () {
          if (option.imageUrl) {
            that.$store.commit('setPreviewFalse')
            wx.previewImage({
              current: option.imageUrl,
              urls: [option.imageUrl]
            })
          }
        }, 800)
      },
      touchMove () {
        this.touchMoveTime = new Date().getTime()
        if (this.touchMoveTime - this.touchStartTime < 800) {
          clearTimeout(this.timeout)
          this.timeout = ''
        }
      },
      touchEnd () {
        this.touchEndTime = new Date().getTime()
        if (this.touchEndTime - this.touchStartTime < 800) {
          clearTimeout(this.timeout)
          this.timeout = ''
        }
      }
    },
    created () {
      if (this.list.items && this.list.type === 'radio') {
        this.list.items.map(item => {
          this.multiLineFlags = [...this.multiLineFlags, getLineCount(280, 28, item.caption) > 1]
        })
      }
    }
  }
</script>

<style lang="less" scoped>
@import "../../../static/base.less";

.image-box{
  overflow: hidden;
  height:300rpx;
  width:300rpx;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  background-color: #f2f2f2;

}
.image-box-1{
  border-radius: 20rpx;
  height: 400rpx;
}
.image{
  width:100%;
  height:100%;
  text-align: center;
  line-height: 300rpx;
  font-size: @font-size-tiny;
  color:#999;
  background-color: #f2f2f2;
}
.have{
  width:300rpx;
  border-radius:20rpx;
  height:400rpx;
  border:1rpx solid #dadada;
  margin-left:20rpx;
}
.hava .imageBox{
  display: block;
  width: 100%;
}
.hava .value {
  width:100%;
  word-wrap: break-word;
}
.no-image{
  width: auto;
  border-radius: 30rpx;
  padding:5rpx;
  margin-left: 15rpx;
  margin-right: 15rpx;
  background-color: #f2f2f2;
}
.no-image>.image-box{
  display: none;
}

.no-image>.value{
  width: 100%;
  white-space: nowrap;
  padding:6rpx 20rpx;
  background:#f2f2f2;
  border:3rpx solid @select-btn-color;
  color: @select-btn-color;
  border-radius:35rpx;
  padding:10rpx 10rpx;
  text-align:center;
  box-shadow:0 0 0;
  font-weight:500;
  min-width: 60rpx;
}

.no-image>.value:active {
  background: @select-btn-color;
  color: #f2f2f2;
}

.have .valueBox{
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
  align-content: center;
  width: 300rpx;
  height: 400rpx;
}
  .background-fff{
    background: #fff;
  }
.image-value{
  text-align:center;
  font-size:28rpx;
  height: 100rpx;
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  color: @select-btn-color;
  font-weight:500;
}
.one-line-text {
  line-height: 100rpx;
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:1;
  text-align: center;
}
.two-line-text {
  height: 70rpx;
  line-height: 40rpx;
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
  text-align: center;
  padding: 10rpx;
}
</style>
