// static/components/botSay/buttonList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: Object,
      default: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click (event) {
      console.log(event)
      let item = event.currentTarget.dataset.item
      this.triggerEvent('buttonListEvent',
        { buttonList: this.properties.message,
          item,
          disappear: !!this.properties.message.once
        })
      if (this.properties.message.once) {
        this.setData({ show: false })
      }
    }
  }
})
