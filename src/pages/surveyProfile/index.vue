<template>

  <movable-area class="move-area">
    <view class="page">
      <view class="content">
        <view class="weui-cells weui-cells_after-title">
          <view class="weui-cell weui-cell_input ">
            <view class="weui-cell__bd avatar-uploader">
              <view @click="chooseImage">
                <bod-avatar :url="avatarUrl" size="100"/>
              </view>
              <view class="avatar-badge"  @click="chooseImage">
                <i class="icon iconfont icon-editor" style="font-size: @font-size-small"></i>
              </view>
              <button class="weui-btn" type="default" size="mini"
                      open-type="getUserInfo" @getuserinfo="onGetUserInfo">使用您的微信头像</button>
            </view>
          </view>
        </view>
        <view class="weui-cells__title">标题</view>
        <view class="weui-cells weui-cells_after-title">
          <view class="weui-cell weui-cell_input">
            <view class="weui-cell__bd">
              <input class="weui-input" v-model="title" placeholder="请输入标题"/>
            </view>
          </view>
        </view>
        <view class="weui-cells__title">简介</view>
        <view class="weui-cells weui-cells_after-title">
          <view class="weui-cell">
            <view class="weui-cell__bd">
            <textarea class="weui-textarea" placeholder="请输入简介"
                      v-model="welcomeText" style="height: 3.3em" />
              <view class="weui-textarea-counter">{{welcomeText.length}}/200</view>
            </view>
          </view>
        </view>
        <!-- <view class="weui-cells__title">类型</view>
        <view class="weui-cells weui-cells_after-title">
            <radio-group @change="surveTypeChange">
                <label class="weui-cell weui-check__label" v-for="type in surveyTypes" :key="type">
                    <radio class="weui-check" :value="type.value" :checked="type.checked"/>

                    <view class="weui-cell__bd">{{type.name}}</view>
                    <view class="weui-cell__ft weui-cell__ft_in-radio" v-if="type.checked">
                        <icon class="weui-icon-radio" type="success_no_circle" size="16"></icon>
                    </view>
                </label>
            </radio-group>
        </view> -->
      </view>
      <view class="bottom_button">
        <button class="weui-btn" type="primary" @click="createBot" :disabled="dataValid">创建</button>
      </view>
    </view>
    <home-button/>
  </movable-area>
</template>

<script>

export default {
  data () {
    return {
      surveyTypes: [
        {name: '答卷', value: 'exam', checked: true},
        {name: '问卷', value: 'exam1', checked: false},
        {name: '跳转', value: 'exam2', checked: false}
      ],
      title: '',
      avatarUrl: '',
      welcomeText: '',
      surveyType: 'exam'
    }
  },

  computed: {
    dataValid () {
      return this.title.length === 0
    }
  },

  methods: {
    createBot (ev) {
      this.$store.dispatch('createSurvey',
        {
          title: this.title,
          type: this.surveyType,
          avatarUrl: this.avatarUrl,
          intro: this.welcomeText
        })
        .then((surveyId) => {
          wx.redirectTo({
            url: `/pages/surveySubjects/main?id=${surveyId}`
          })
        })
    },
    surveTypeChange (ev) {
      var surveyTypes = this.surveyTypes.map((type) => {
        type.checked = type.value === ev.mp.detail.value
        return type
      })
      this.surveyTypes = surveyTypes
    },
    chooseImage () {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success: res => {
          // this.avatarUrl = res.tempFilePaths
          this.$store.dispatch('uploadImage', res.tempFilePaths[0])
            .then((remoteUrl) => {
              this.avatarUrl = remoteUrl
            })
        }
      })
    },
    onGetUserInfo (ev) {
      var userInfo = ev.mp.detail.rawData
      if (userInfo) {
        this.avatarUrl = JSON.parse(userInfo).avatarUrl
      }
    }
  },

  onLoad (option) {
    console.log('receive survey type :' + option.surveyType)
    this.surveyType = option.surveyType
  },

  created () {
  },
  onShow () {
    this.title = ''
    this.welcomeText = ''
  },
  onShareAppMessage: function () {
    return {
      title: '',
      path: '/pages/index/main'
    }
  }
}
</script>

<style scoped>
.content {
  flex-direction: column;
}
.avatar-uploader {
  text-align: center;
  position: relative;
  margin-top: 30rpx;
}
.avatar-uploader .weui-btn {
  margin-top: 5rpx;
}

.avatar-badge {
  position: absolute;
  top: 5rpx;
  right: 270rpx;

}

</style>
