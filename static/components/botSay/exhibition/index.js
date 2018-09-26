// static/components/botSay/exhibition/index.js
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
    chooseItem: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickAction (event) {
      if (this.data.chooseItem === -1 || this.data.chooseItem >= this.properties.message.items.length) {
        return
      }
      let item = event.currentTarget.dataset.item
      const chooseItem = this.properties.message.items[this.data.chooseItem]
      let indicator = chooseItem.indicator
      let eventName = item.event
      this.triggerEvent('exhibitionClick', {caption: item.caption, name: eventName, indicator, ...item.data})
      this.setData({chooseItem: -1})
    },

    clickItem (event) {
      let id = event.currentTarget.dataset.id
      if (id === this.data.chooseItem) {
        this.setData({chooseItem: -1})
      } else {
        this.setData({chooseItem: id})
      }
      if (this.data.chooseItem !== -1) {
        this.triggerEvent('itemRender')
      }
    },

    previewImage (event) {
      this.triggerEvent('previewImage')
      let url = event.target.dataset.url
      wx.previewImage({
        current: url,
        urls: [url]
      })
    }
  }
})
