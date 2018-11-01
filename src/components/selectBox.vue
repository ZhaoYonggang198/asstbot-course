<template>
    <view class="select-box" :class="{'top_110': !showImage, 'top_444': showImage}">
      <exhibition-action style="display: none" @actionshow="actionshow" :actionclick="actionclicked"></exhibition-action>
      <block v-if="!exhibitionActionShow">
        <radio-box v-if="messageAction.type === 'radio' || (actions && actions.length > 0)" 
          :list="messageAction" :actions="actions" @actionclick="actionclick" @donateclick="donateclick"></radio-box>
        <checkbox-box v-if="messageAction.type === 'checkbox'" :list="messageAction"></checkbox-box>
        <avatar-box v-if="messageAction.type === 'imageUploader'" :list="messageAction"></avatar-box>
      </block>
    </view>
</template>

<script>
  import radioBox from '@/components/floatBox/radioBox'
  import checkboxBox from '@/components/floatBox/checkboxBox'
  import avatarBox from '@/components/floatBox/avatarBox'
  import globalComponent from '@/components/floatBox/globalComponent'

  export default {
    name: 'selectBox',
    props: {
      messageAction: {
        type: Object,
        default: {}
      },
      showImage: {
        type: Boolean,
        default: {}
      }
    },
    components: {
      radioBox,
      checkboxBox,
      avatarBox,
      globalComponent
    },
    data () {
      return {
        chooseItem: {},
        actions: [],
        actionclicked: false
      }
    },
    methods: {
      actionshow (event) {
        console.log(event)
        this.chooseItem = event.mp.detail.chooseItem
        this.actions = event.mp.detail.actions
      },
      actionclick (event) {
        this.actionclicked = true
        console.log(event)
        let action = this.actions[event]
        console.log(this.actions)
        this.$store.dispatch('sendGenericRequest', {
          type: 'event',
          data: {
            caption: action.caption,
            name: action.event,
            indicator: this.chooseItem.indicator,
            ...action.data
          }
        })
      },
      donateclick () {
        this.$emit('donateclick')
      }
    }
  }
</script>

<style scoped>
.select-box{
  /*background: #fff;*/
  width: 100%;
  overflow:auto;
  /*position: absolute;*/
  /*bottom:0*/
}
.top_110{
  /*position: absolute;*/
  top: -110rpx;
}
.top_444{
  /*position: absolute;*/
  top: -444rpx;
}
</style>
