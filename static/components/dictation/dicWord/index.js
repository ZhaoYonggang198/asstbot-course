// static/components/dictation/dicWord/index.js
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
      delete: function(){
          this.triggerEvent('deleteText')
      },
      changePinyin: function (e) {
          this.triggerEvent('changePinyin', e.currentTarget.dataset.index)
      }
  }
})
