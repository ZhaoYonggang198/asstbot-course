// static/components/dictation/dicPin/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      pinyin: {
          type: String,
          value: ''
      },
      index: {
          type: Number,
          value: 0
      },
      word: {
          type: String,
          value: '',
          observer: function(value){
              this.setData({
                  hanzi: value.substr(this.properties.index, 1)
              })
          }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      hanzi: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
