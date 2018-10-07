import { store, setExhibitionChecked } from '../../../reducers/exhibition'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: Object,
      value: {}
    },
    exhibitionId: {
      type: String,
      value: ''
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
      store.exhibition.dispatch(
        setExhibitionChecked(this.properties.exhibitionId,
          event.currentTarget.dataset.id,
          this.properties.message.items[event.currentTarget.dataset.id],
          this.properties.message.actions))
    },

    previewImage (event) {
      this.triggerEvent('previewImage')
      let url = event.target.dataset.url
      wx.previewImage({
        current: url,
        urls: [url]
      })
    }
  },

  attached () {
    this.unsubscribe = store.exhibition.subscribe(() => {
      const state = store.exhibition.getState()
      if (this.properties.exhibitionId === state.exhibitionId) {
        this.setData({chooseItem: state.chooseItemId})
      } else {
        this.setData({chooseItem: -1})
      }
    })
  },

  detached () {
    this.unsubscribe()
  }
})
