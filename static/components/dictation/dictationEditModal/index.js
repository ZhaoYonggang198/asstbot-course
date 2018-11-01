// static/components/dictation/dictataionEditModal/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      content: {
          type: Object,
          value: {},
          observer: function(value){
              value.id&&this.setData({
                  dic: {...value}
              })
            //   console.log(value)
          }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      dic: {},
      words: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
      success: function (e) {
          this.triggerEvent('updateDictation', this.data.dic)
          this.triggerEvent('hideModal')
      },
      fail: function () {
          this.triggerEvent('hideModal')
      },
      addNewWord: function(e){
          if (e.detail.value) {
              let arr = e.detail.value.replace('，', ',').split(',');
              let newArr = this.data.dic.words.concat(arr)
              this.setData({
                  'dic.words': [...newArr],
                  words: ''
              })
          }
          

      },
      editTitle: function(e){
          this.setData({
              'dic.title': e.detail.value
          })
      },
      dicDel: function(e){
          let arr = [...this.data.dic.words];
          arr.splice(e.currentTarget.dataset.index,1);
          this.setData({
              'dic.words': [...arr]
          })
      }
  },

})
