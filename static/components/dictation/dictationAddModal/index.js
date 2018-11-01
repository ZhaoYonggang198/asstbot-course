// static/components/dictation/dictationAddModal/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
      dic: {
          openId: '',
          dictateWords: {
              title: '',
              active: false,
              words: []
          }
      }
  },

  /**
   * 组件的方法列表
   */
  methods: {
      addTitle: function(e){
          this.setData({
              'dic.dictateWords.title': e.detail.value
          })
      },
      addNew: function(e){
          let arr = e.detail.value.replace('，',',').split(',');
          this.setData({
              'dic.dictateWords.words': [...arr]
          })
      },
      success: function () {
          if(this.data.dic.dictateWords.title||this.data.dic.dictateWords.words.length){
              this.triggerEvent('newDictation', this.data.dic)
              this.triggerEvent('hideNewModal')
          }else{
              wx.showToast({
                  title: '请填写信息',
              })
          }
      },
      fail: function(){
          this.triggerEvent('hideNewModal')
      }
  }
})
