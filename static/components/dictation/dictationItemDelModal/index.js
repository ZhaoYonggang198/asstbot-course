// static/components/dictation/dictationItemDelModal/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      content: {
          type: Object,
          value: {}
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      success: function () {
          this.triggerEvent('dicItemDel', this.properties.content.id)
          this.triggerEvent('hideModal')
      },
      fail: function () {
          this.triggerEvent('hideModal')
      }
  }
})
