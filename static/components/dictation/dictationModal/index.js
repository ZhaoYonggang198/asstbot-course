// static/components/dictation/dictationModal/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      hanzi: {
          type: String,
          value: '',
      },
      pinyin: {
          type: Array,
          value: []
      },
      currentPinyin: {
          type: String,
          value: '',
          observer: function (value) {
              this.setData({
                  current: value
              })
          }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      current: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
      select: function (e) {
          this.setData({
              current: e.currentTarget.dataset.item
          })
          this.triggerEvent('select', e.currentTarget.dataset.item)
      }
  }
})
