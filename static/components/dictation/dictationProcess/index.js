// static/components/dictation/dictationProcess/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      index: {
          type: Number,
          value: 0,
          observer: function(value){
              if (value != undefined){
                  this.setData({
                      width: parseInt((value + 1) / this.properties.sum * 100) + '%'
                  })
              }
          }
      },
      sum: {
          type: Number,
          value: 0,
          observer: function (value) {
              this.setData({
                  width: parseInt(1 / value * 100) + '%'
              })
          }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      width: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
