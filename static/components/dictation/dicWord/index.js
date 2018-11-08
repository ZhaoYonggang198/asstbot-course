// static/components/dictation/dicWord/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      content: {
          type: Object,
          value: {}
      },
      playState: {
          type: Object,
          value: {},
          observer: function (value) {
          }
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
          const index = e.currentTarget.dataset.index
          const { polyphone, term } = this.properties.content
          const hanzi = term.substr(index, 1)
          this.triggerEvent('changePinyin', { index, polyphone: polyphone[index], hanzi })
      },
      play: function () {
          const {ttsFemale, ttsMale} = this.properties.content
          this.triggerEvent('playPinyin', { ttsFemale, ttsMale})
      },
      stop: function () {
          this.triggerEvent('stopPinyin')
      }
  }
})
