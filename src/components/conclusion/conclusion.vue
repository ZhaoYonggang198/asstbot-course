<template>
<block>
  <view class="survey-conclusion-header">结论 {{index+1}}
    <icon class="survey-item-delete" type='cancel' size='20' color='#333' @click.stop="remove(index)"></icon></view>
  <view class="weui-cells weui-cells_after-title">
    <view class="weui-cell" v-if="surveyType==='exam'">
        <view class="weui-cell__hd">
            <view class="weui-label">答对题目</view>
        </view>
        <view class="weui-cell__ft">
            {{conclusion.scoreRange.min}} ~ {{conclusion.scoreRange.max}}
        </view>
    </view>
    <view class="weui-cell" v-else-if="surveyType==='quiz'&&conclusion.scoreRange.max>0">
      <view class="weui-cell__hd">
        <view class="weui-label">得分</view>
      </view>
      <view class="weui-cell__ft">
        {{conclusion.scoreRange.min}} ~ {{conclusion.scoreRange.max}}
      </view>
    </view>
    <da-text :content="conclusion.text"></da-text>
    <daVideoForList v-if="conclusion.urlType=='video'" :poster="conclusion.mediaInfo?conclusion.mediaInfo.poster:''"/>
    <daAudio v-else-if="conclusion.urlType=='audio'" :url="conclusion.imageUrl" :data="conclusion"/>
    <da-image v-else :url="conclusion.imageUrl"/>
  </view>
</block>
</template>

<script>
  import daImage from '@/components/view/daImage'
  import daVideoForList from '@/components/view/daVideoForList'
  import daAudio from '@/components/view/daAudio'
export default {
    props: ['surveyType', 'conclusion', 'index'],
    components: {
      daImage,
      daVideoForList,
      daAudio
    },
    methods: {
      remove (i) {
        this.$store.commit('deleteCurConclusion', i)
        this.$store.dispatch('saveCurSurvey', this.$store.state.curSurvey.survey)
      }
    }
}
</script>

<style>
.card {
  padding: 10px;
}
.survey-conclusion-header{
  padding: 10px 15px;
  background: #fff;
}
.survey-item-delete{
  float: right;
}
</style>
