
Component({
  properties: {
      content: {
          type: Object,
          value: {}
      }
  },
  data: {

  },
  methods: {
      success: function () {
          this.triggerEvent('addSuccess')
      },
      fail: function () {
          this.triggerEvent('addCancel')
      }
  }
})
