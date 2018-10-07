import { store, setExhibitionChecked } from '../../../reducers/exhibition'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actionclick: {
      type: Boolean,
      value: false,
      observer: function (val) {
        if (val) {
          store.exhibition.dispatch(setExhibitionChecked())
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    actions: [],
    chooseItem: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickAction (event) {
      let action = event.currentTarget.dataset.item
      this.triggerEvent('actionclicked', {caption: action.caption,
        name: action.event,
        indicator: this.data.chooseItem.indicator,
        ...action.data})
      store.exhibition.dispatch(setExhibitionChecked())
    }
  },

  attached () {
    store.exhibition.dispatch(setExhibitionChecked())
    this.unsubscribe = store.exhibition.subscribe(() => {
      const state = store.exhibition.getState()
      this.triggerEvent('actionshow', state)
    })
  },

  detached () {
    this.unsubscribe()
  }
})
