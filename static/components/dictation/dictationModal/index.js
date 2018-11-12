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
          value: ''
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
      select: function (e) {
          this.triggerEvent('select', e.currentTarget.dataset.item)
      }
  }
})
