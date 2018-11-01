// static/components/dictation/dictationList/index.js
let start,move,end;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      content: {
          type: Object,
          value: []
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      dicDel: false,
      dictation: {},
      deleteSlider: '',
      slideId: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
      start: function (e) {
          this.setData({
              slideId: e.currentTarget.dataset.dic.id
          })
          start = e.touches[0].clientX
      },
      move: function (e) {
          move = e.touches[0].clientX;
          let moveLong = start - move;
          if (moveLong <= 0) {
              this.setData({
                  deleteSlider: "transform:translateX(0px)"
              })
          } else if (moveLong > 0) {
              this.setData({
                  deleteSlider: "transform:translateX(-" + moveLong + "px)"
              })
              if (moveLong >= 80) {
                  this.setData({
                      deleteSlider: "transform:translateX(-80px)"
                  })
              }
          }
      },
      end: function (e) {
          let endX = e.changedTouches[0].clientX;
            let moveLong = start -endX;

          if ((moveLong ) < (80 / 2)) {
              this.setData({
                  deleteSlider: "transform:translateX(0px)"
              })
          } else {
              this.setData({
                  deleteSlider: "transform:translateX(-80px)"
              })
          }
      },
      toEdit: function (e) {
          this.triggerEvent('toEdit', e.currentTarget.dataset.dic)
      },
      delDicItem: function (e) {
          this.triggerEvent('deleteDictation', e.detail)
      },
      showDelModal: function(e) {
          this.setData({
              dictation: e.currentTarget.dataset.dic,
              dicDel: true
          })
      },
      hideDelModal: function () {
          this.setData({
              dictation: {},
              dicDel: false
          })
      },
  }
})
