<template>
    <view class='dictation-inner'>
      <title-bar title='词汇列表'/>
      <!--<view class="dictation-add-container" @click="ShowNewModal">-->
        <!--<view class="dic-add-icon">-->
          <!--<dictation-add-icon type="add" size="40" color="#fff"/>-->
        <!--</view>-->
        <!--<view class="dic-add-word">添加词汇</view>-->
      <!--</view>-->
      <view class='dictation-container'>
        <!--<movable-area class="dictation-movable">-->
          <!--<movable-view class="dic-movable-view" x="300" y="700" direction="all" out-of-bounds=false  @click="ShowNewModal">-->
            <!--<dictation-add-icon type="add" size="40" color="#fff"/>-->
          <!--</movable-view>-->
          <dictation-item style="height: 100%" :content="dictateList" @toEdit="toEdit" @deleteDictation="deleteDictation"/>
        <!--</movable-area>-->
      </view>
      <view class="dic-foot-container">
        <view class="dic-footer">
          <view class="dic-foot-btn" @click="ShowNewModal">
            <view class="dic-add-row dic-add-item"></view>
            <view class="dic-add-col dic-add-item"></view>
          </view>
        </view>
      </view>
      <!--<block v-if="showAdd">-->
        <!--<dictation-add-modal @hideNewModal="hideNewModal" @newDictation="newDictation"/>-->
      <!--</block>-->
    </view>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data () {
      return {
        // dictateList: [
        //   {
        //     title: '语文第一课',
        //     active: false,
        //     words: [
        //       '高粱撒在麦地里',
        //       '穿冬衣摇夏扇',
        //       '冬天不戴帽子',
        //       '春凳折了靠背儿',
        //       '大眠起来的春蚕',
        //       '春天的蜜蜂',
        //       '穿凉鞋戴棉帽',
        //       '冬天摇蒲扇'
        //     ],
        //     'darwinId': 'weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8',
        //     'createTime': '2018-10-23',
        //     'updateTime': '2018-10-23',
        //     'id': '52330001'
        //   },
        //   {
        //     title: '语文第二课',
        //     'darwinId': 'weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8',
        //     'active': true,
        //     'words': [
        //       '池上红衣伴倚阑',
        //       '栖鸦常带夕阳还',
        //       '殷云度雨疏桐落',
        //       '明月生凉宝扇闲',
        //       '乡梦窄',
        //       '水天宽',
        //       '小窗愁黛淡秋山',
        //       '吴鸿好为传归信',
        //       '杨柳阊门屋数间'
        //     ],
        //     'id': '52330002'
        //   },
        //   {
        //     title: '语文第三课',
        //     active: false,
        //     words: [
        //       '夫人之相与',
        //       '俯仰一世',
        //       '或取诸怀抱',
        //       '悟言一室之内',
        //       '或因寄所托',
        //       '放浪形骸之外',
        //       '虽趣舍万殊',
        //       '静躁不同',
        //       '当其欣于所遇',
        //       '暂得于己',
        //       '快然自足',
        //       '不知老之将至'
        //     ],
        //     'darwinId': 'weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8',
        //     'createTime': '2018-10-23',
        //     'updateTime': '2018-10-23',
        //     'id': '52330003'
        //   },
        //   {
        //     title: '语文第四课',
        //     'darwinId': 'weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8',
        //     'active': true,
        //     'words': [
        //       '和风细雨',
        //       '雨露之恩',
        //       '恩恩爱爱',
        //       '爱日惜力',
        //       '力可拔山',
        //       '山栖谷隐',
        //       '隐姓埋名',
        //       '名士风流',
        //       '流离失所'
        //     ],
        //     'id': '52330004'
        //   },
        //   {
        //     title: '语文第五课',
        //     active: false,
        //     words: [
        //       '及其所之既倦',
        //       '情随事迁',
        //       '感慨系之矣',
        //       '向之所欣',
        //       '俯仰之间',
        //       '已为陈迹',
        //       '犹不能不以之兴怀'
        //     ],
        //     'darwinId': 'weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8',
        //     'createTime': '2018-10-23',
        //     'updateTime': '2018-10-23',
        //     'id': '52330005'
        //   },
        //   {
        //     title: '语文第六课',
        //     'darwinId': 'weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8',
        //     'active': true,
        //     'words': [
        //       '况修短随化',
        //       '终期于尽',
        //       '古人云',
        //       '死生亦大矣',
        //       '岂不痛哉'
        //     ],
        //     'id': '52330006'
        //   },
        //   {
        //     title: '语文第七课',
        //     active: false,
        //     words: [
        //       '每览昔人兴感之由',
        //       '若合一契',
        //       '未尝不临文嗟悼',
        //       '不能喻之于怀',
        //       '固知一死生为虚诞',
        //       '齐彭殇为妄作',
        //       '后之视今',
        //       '亦犹今之视昔',
        //       '悲夫',
        //       '故列叙时人',
        //       '录其所述',
        //       '虽世殊事异',
        //       '所以兴怀',
        //       '其致一也',
        //       '后之览者',
        //       '亦将有感于斯文'
        //     ],
        //     'darwinId': 'weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8',
        //     'createTime': '2018-10-23',
        //     'updateTime': '2018-10-23',
        //     'id': '52330007'
        //   },
        //   {
        //     title: '语文第八课',
        //     'darwinId': 'weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8',
        //     'active': true,
        //     'words': [
        //       '青，取之于蓝，而青于蓝',
        //       '冰，水为之，而寒于水',
        //       '木直中绳，輮以为轮，其曲中规',
        //       '虽有槁暴（pù），不复挺者，輮使之然也',
        //       '故木受绳则直，金就砺则利',
        //       '君子博学而日参省乎己，则知明而行无过矣'
        //     ],
        //     'id': '52330008'
        //   },
        //   {
        //     title: '语文第九课',
        //     active: false,
        //     words: [
        //       '故不登高山，不知天之高也',
        //       '不临深溪，不知地之厚也',
        //       '不闻先王之遗言，不知学问之大也',
        //       '干、越、夷、貉之子，生而同声',
        //       '长而异俗，教使之然也',
        //       '吾尝终日而思矣，不如须臾之所学也',
        //       '吾尝跂而望矣，不如登高之博见也'
        //     ],
        //     'darwinId': 'weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8',
        //     'createTime': '2018-10-23',
        //     'updateTime': '2018-10-23',
        //     'id': '52330009'
        //   }
        // ],
        select: {},
        showAdd: false
      }
    },
    components: {
    },
    computed: {
      ...mapState({
        dictateList: state => state.dictation.dictation
      }),
      activeDictation: state => {
        if (state.dictateList && state.dictateList.length) {
          let active = state.dictateList.find(item => item.active) || {}
          return active
        }
      }
    },
    methods: {
      selectDic: function (dic) {
        this.select = {...dic.mp.detail}
      },
      ShowNewModal: function () {
        // this.showAdd = true
        wx.navigateTo({
          url: '/pages/dictationEdit/main'
        })
      },
      hideNewModal: function () {
        this.showAdd = false
      },
      newDictation: function (e) {
        this.$store.dispatch('newDictation', e.mp.detail).then(res => {
          this.$store.dispatch('initDictation')
        }).catch(err => {
          console.log(err)
        })
      },
      updateDictation: function (e) {
        this.$store.dispatch('updateDictation', {
          id: e.mp.detail.id,
          dictateWords: {
            title: e.mp.detail.title,
            active: e.mp.detail.active,
            words: e.mp.detail.words
          }
        }).then(res => {
          this.$store.dispatch('initDictation')
        }).catch(err => {
          console.log(err)
        })
      },
      deleteDictation: function (e) {
        this.$store.dispatch('deleteDictation', e.mp.detail).then(res => {
          this.$store.dispatch('initDictation')
        }).catch(err => {
          console.log(err)
        })
      },
      toEdit: function (e) {
        wx.navigateTo({
          url: '/pages/dictationEdit/main?param=' + e.mp.detail.id + '&active=' + this.activeDictation.id
        })
      },
      bindPhone: function () {
        wx.navigateTo({
          url: '/pages/smartSpeaker/main'
        })
      }
    },
    onLoad () {
      this.$store.dispatch('initDictation')
    },
    onShareAppMessage: function () {
      return {
        title: '听写词汇',
        path: '/pages/dictation/main'
      }
    }
  }
</script>

<style scoped>
  .dictation-inner{
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .dictation-add-container{
    margin-bottom:15px;
    background:#fff;
    padding:0 10px;
    height:40px;
    display: flex;
  }
  .dic-add-icon{
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #19a8a1;
  }
  .dic-add-word{
    line-height:40px;
    font-weight:500;
    font-size:16px;
    padding-left:10px;
  }
  .dictation-container{
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .dictation-movable{
    height: 100%;
    width: 100%;
  }
  .dic-movable-view{
    width: 60px;
    height: 60px;
    background: #25CEC2;
    border-radius: 50%;
    display:flex;
    justify-content:center;
    align-items:center;
    z-index: 1;
    box-shadow:0px 0px 10px #0c5053;
  }
  .dictation-scroll{
    height: 100%;
  }
  .dic-foot-container{
    border-top: 1px solid #d8d8d8;
  }
  .dic-foot-add{
    padding: 10px 15px;
    text-align: center;
    border-bottom: 1px solid #d8d8d8;
    font-size: 16px;
    background: #19a1a8;
    color: #fff;
  }
  .dic-footer{
    display: flex;
    min-height: 41px;
    height: auto;
    justify-content: center;
    margin-bottom: 25px;
    margin-top: 10px;
  }
  .dic-foot-btn{
    /*font-size: 28rpx;*/
    /*margin-left: 15rpx;*/
    /*margin-right: 15rpx;*/
    /*line-height: 32px;*/
    /*height: 34px;*/
    /*box-sizing: border-box;*/
    /*white-space: nowrap;*/
    /*background: #f2f2f2;*/
    /*border: 1px solid #19a1a8;*/
    /*color: #19a1a8;*/
    border-radius: 35rpx;
    /*padding: 0rpx 20rpx;*/
    /*text-align: center;*/
    box-shadow: 0 0 0;
    /*font-weight: 500;*/
    /*min-width: 60rpx;*/
    position: relative;
    width:50px;
    height:50px;
    border-radius:50%;
    background:#25CEC2;
  }
  .dic-add-item{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto auto;
    background: #fff;
    border-radius: 2px;
  }
  .dic-add-row{
    width: 20px;
    height: 4px;
  }
  .dic-add-col{
    width: 4px;
    height: 20px;
  }
  .dic-foot-select{
    border-bottom: 1px solid #d8d8d8;
    padding: 0 15px;
    font-size: 14px;
    background: #fff;
  }
  .dic-foot-select-tip{
    text-align:center;
    font-size:32rpx;
    line-height:64rpx;
    width:100vw;
    margin-left:-15px;
    border-bottom:1px solid #d8d8d8;
    margin-bottom:10px;
  }
  .dic-foot-select-title{
    height: 30px;
    font-size: 16px;
  }
  .dic-foot-select-text-container{
    display: flex;
    flex-wrap: wrap;
  }
  .dic-foot-select-text{
    margin-right:10px;
    padding: 8px 10px;
    border-radius:5px;
    background: #f0f0f0;
    white-space: nowrap;
    line-height: 14px;
    margin-bottom: 10px;
  }
</style>
