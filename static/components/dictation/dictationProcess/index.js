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
                  console.log(parseInt((value + 1) / this.properties.sum * 100) + '%')
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
              console.log(this.properties.index)
              this.setData({
                  width: parseInt((this.properties.index + 1) / value * 100) + '%'
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
