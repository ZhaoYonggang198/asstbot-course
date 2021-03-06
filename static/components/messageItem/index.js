// static/components/messageItem/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messages: {
      type: Object,
      value: {}
    },
    lastBotMsg: {
      type: Boolean,
      value: true
    },
    survey: {
      type: Object,
      value: {}
    },
    userAuthed: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    outgoing: false,
    received: 1,
    displayIncomingMsgs: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadDone () {
      this.triggerEvent('itemLoad')
    },
    previewImage () {
      this.triggerEvent('previewImage')
    },
    buttonListEvent (event) {
      console.log(event)
      if (event.detail.disappear) {
        let index = event.currentTarget.id
        this.setData({
          [`displayIncomingMsgs[${index}].show`]: false
        })
      }
      this.triggerEvent('buttonListEvent', event.detail)
    },
    exhibitionClick (event) {
      this.triggerEvent('exhibitionClick', event.detail)
    },
    itemRender () {
      this.triggerEvent('itemRender')
    }
  },

  attached () {
    let messages = this.properties.messages
    let displayIncomingMsgs = this.data.outgoing || !messages || !messages.msgs ? [] : messages.msgs.filter((msg) => {
      return msg.type === 'text' ||
      msg.type === 'getUserinfo' ||
      msg.type === 'image' ||
      msg.type === 'audio' ||
      msg.type === 'video' ||
      msg.type === 'divider' ||
      msg.type === 'button-list' ||
      msg.type === 'exhibition' ||
        msg.type === 'html' ||
        msg.type === 'page-list'
    }).map((msg) => {
      msg.show = true
      return msg
    })
    this.setData({
      outgoing: messages.from !== undefined,
      displayIncomingMsgs
    })
    if (this.properties.lastBotMsg) {
      let that = this
      this.triggerEvent('renderUpdate')
      let interval = setInterval(() => {
        let received = that.data.received
        received++
        that.setData({
          received
        })
        if (that.data.received > (that.data.displayIncomingMsgs.length - 1) ||
             !that.properties.lastBotMsg) {
          that.triggerEvent('renderComplete')
          clearInterval(interval)
        } else {
          that.triggerEvent('renderUpdate')
        }
      }, 600)
    }
  }
})
