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
          this.triggerEvent('changePinyin', e.currentTarget.dataset.index)
      },
      play: function () {
          this.triggerEvent('playPinyin', this.getPinyinTts([this.properties.content]))
      },
      stop: function () {
          this.triggerEvent('stopPinyin')
      },
      getPinyinTts: function (wordsArr) {
          let pinyinTtsArr = []
          wordsArr.map((item, index) => {
              let str = ''
              item.pinyin.map((py, pyIndex) => {
                  str += item.term.substring(pyIndex, pyIndex + 1) + '(' + this.getPinyinForm(py[0]) + ')' + ','
              })
              // str.slice(0, -1)
              // console.log(str.slice(0, -1))
              pinyinTtsArr.push(str.slice(0, -1))
          })
          return pinyinTtsArr
      },
      getPinyinForm: function (py) {
          let py1 = /[āōēīūǖ]/g
          let py2 = /[áóéíúǘ]/g
          let py3 = /[ǎǒěǐǔǚ]/g
          let py4 = /[àòèìùǜ]/g
          // let reg = /[āōēīūǖáóéíúǘǎǒěǐǔǚàòèìùǜ]/g
          // reg.test(py)
          let num = ''
          if (py1.test(py)) {
              num = 1
          } else if (py2.test(py)) {
              num = 2
          } else if (py3.test(py)) {
              num = 3
          } else if (py4.test(py)) {
              num = 4
          } else {
              num = 1
          }
          py = py.replace(/[āáǎà]/g, 'a').replace(/[ōóǒò]/g, 'o').replace(/[ēéěè]/g, 'e').replace(/[īíǐì]/g, 'i').replace(/[ūúǔù]/g, 'u').replace(/[ǖǘǚǜ]/g, 'ü')
          return py + num
      }
  }
})
