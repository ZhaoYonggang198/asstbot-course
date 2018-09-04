<template>
  <scroll-view scroll-x="true">
    <view class="big-box">
      <label class="option-container light form-control" v-for="(option, index) in list.items" :key="option"
             :class="[pureTextList ? 'no-image' : 'haveimage']" :for="'option' + index" @click="checked(index)" @touchstart="touchStart(option)" @touchmove="touchMove()" @touchend="touchEnd(option)">
        <view class="weui-flex">
          <view class="weui-flex__item">
            <block v-if="!pureTextList">
              <view class="image-box imageBox">
                <image class="image" mode="aspectFit" :src="option.imageUrl"  v-if="option.imageUrl"></image>
              </view>
            </block>
              <view class="value" :class="[checkArr[index] ? 'checked-color':'un-checked-color', multiLineFlags[index] ? 'two-line-text':'one-line-text']">{{option.caption}}</view>
              <!--<view class="value" :class="[checkArr[index] ? 'checked-color':'un-checked-color', pureTextList ? 'valueBox' : 'image-value']">{{option.caption}}</view>-->
          </view>
        </view>
      </label>
    </view>
  </scroll-view>
</template>

<script>
  import { getLineCount } from '@/utils/layout'
  export default {
    data () {
      return {
        checkArr: [],
        a: 1,
        touchStartTime: '',
        touchMoveTime: '',
        touchEndTime: '',
        timeout: '',
        checkArrIndex: [],
        multiLineFlags: []
      }
    },
    name: 'radioBox',
    props: ['list'],
    computed: {
      pureTextList: state => {
        let a = state.list.items.find(item => !!item.imageUrl === true)
        return a === undefined
      }
      // isMultiLine () {
      //   // return getLineCount(width, font-size, content)
      //   return getLineCount(300, 28, content) > 1
      // }
    },
    methods: {
      selectOption (e) {
        if (this.touchEndTime - this.touchStartTime < 800) {
          let arr = []
          this.checkArrIndex.map(item => {
            arr = [...arr, this.list.items[item]]
          })
          this.$store.commit('updateCheckboxData', {items: arr, event: this.list.event})
        }
      },
      saveInArray (item, arr) {
        if (arr.includes(item)) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === item) {
              arr.splice(i, 1)
            }
          }
        } else {
          arr.push(item)
        }
      },
      checked (index) {
        if (this.touchEndTime - this.touchStartTime < 800) {
          let a = !this.checkArr[index]
          this.checkArr.splice(index, 1, a)
          this.saveInArray(index, this.checkArrIndex)
          let arr = []
          this.checkArrIndex.map(item => {
            arr = [...arr, this.list.items[item]]
          })
          this.$store.commit('updateCheckboxData', {items: arr, event: this.list.event})
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
        console.log('time:start#' + this.timeout)
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
      this.list.items.map(item => {
        this.checkArr = [...this.checkArr, false]
        this.multiLineFlags = [...this.multiLineFlags, getLineCount(300, 28, item.caption) > 1]
      })
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
  }
  .image-box-1{
    border-radius: 20rpx;
    height: 400rpx;
  }
  .image{
    width:100%;
    height: 100%;
    background-color: #f2f2f2;
  }
  .haveimage{
    width:300rpx;
    border-radius: 20rpx;
    height:400rpx;
    margin-left: 20rpx;
    position: relative;
    border: 1px solid #dadada;
  }
  .haveimage .imageBox{
    display: block;
    background-color: #f2f2f2;
  }

  .no-image{
    width: auto;
    border-radius: 10rpx;
    /*border: 1px solid #dadada;*/
    padding:5rpx;
    margin-left: 30rpx;
  }
  .no-image .image-box{
    display: none;
  }
  .value{
    font-size: 28rpx;
    width:100%;
    text-align:center;
    font-weight:500;
  }
  .no-image .value{
    white-space: nowrap;
    padding:6rpx 20rpx;
    border-radius:35rpx;
    padding:10rpx 10rpx;
    box-shadow:0 0 0;
  }

  .haveimage .value {
    word-wrap: break-word;
    height: 100rpx;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
  }

  .haveimage .two-line-text {
    line-height: 50rpx;
    -webkit-line-clamp:2;
  }

  .haveimage .one-line-text {
    line-height: 100rpx;
    -webkit-line-clamp:1;
  }

  .checked-color {
    color: #FFFFFF;
    background-color: @select-btn-color;
    border: none;
  }

  .un-checked-color {
    color: @select-btn-color;
    background:#f2f2f2;
    border:3rpx solid @select-btn-color;
  }

  .haveimage .un-checked-color {
    background:#fff;
    border: none;
  }
  .no-image .checked {
    top: 0;
    right: 10rpx;
  }
  .select-box{
    display: none;
  }
  /*.haveimage .valueBox{*/
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-items: center;*/
    /*justify-content: center;*/
    /*align-content: center;*/
    /*width: 300rpx;*/
    /*height: 400rpx;*/
  /*}*/

  .haveimage .checked {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
  }

  /*.image-value{*/
    /*text-align:center;*/
    /*font-size:28rpx;*/
    /*font-weight:500;*/
    /*line-height: 50rpx;*/
    /*height: 100rpx;*/
    /*overflow:hidden;*/
    /*text-overflow:ellipsis;*/
    /*display:-webkit-box;*/
    /*-webkit-box-orient:vertical;*/
    /*-webkit-line-clamp:2;*/
    /*border-bottom-left-radius: 20rpx;*/
    /*border-bottom-right-radius: 20rpx;*/
  /*}*/

</style>
