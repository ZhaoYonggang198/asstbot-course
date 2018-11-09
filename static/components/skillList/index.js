// static/components/skillLIst/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    skillList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggleActive (detail) {
      console.log(detail)
      let index = detail.currentTarget.dataset.id
      if (this.data.activeIndex === index) {
        this.setData({
          activeIndex: -1
        })
      } else {
        this.triggerEvent('skillActive', {value: detail.detail.y})
        this.setData({
          activeIndex: index
        })
      }
    },

    clickOnRequest (detail) {
      this.triggerEvent('requestClick', {value: detail.currentTarget.dataset.request})
    }
  }
})
