// static/components/dictation/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: Array,
      value: [],
      observer: function(value){
          if(value.length){
              let obj = value.find(item => item.active)
              this.setData({
                  activeDictation: obj ||{}
              })
          }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
      dicBottom: 'dicBottom0',
      dicEdit: false,
      dicDel: false,
      dictation: {},
      activeDictation: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
      selectDic: function(item){
          if (this.data.activeDictation.id){
              this.triggerEvent('updateDictation', { ...this.data.activeDictation, active: false})
              if (this.data.activeDictation.id == item.currentTarget.dataset.dic.id){
                  this.triggerEvent('selectDic', {})
              }else{
                  this.triggerEvent('updateDictation', { ...item.currentTarget.dataset.dic, active: true })
                  this.triggerEvent('selectDic', { ...item.currentTarget.dataset.dic, active: true })
              }
          }else{
              this.triggerEvent('updateDictation', { ...item.currentTarget.dataset.dic, active: true })
              this.triggerEvent('selectDic', { ...item.currentTarget.dataset.dic, active: true })
          }
          this.setData({
              dicBottom: ''
          })
          setTimeout(() => {
              this.setData({
                  dicBottom: item.currentTarget.dataset.bottom
              })
          })
      },
      dictateEdit: function(e){
          this.setData({
              dictation: e.currentTarget.dataset.dic,
              dicEdit: true
          })
      },
      hideEditModal: function(){
          this.setData({
              dictation: {},
              dicEdit: false
          })
      },
      dictateDel: function(e){
          this.setData({
              dictation: e.currentTarget.dataset.dic,
              dicDel: true
          })
      },
      hideDelModal: function(){
          this.setData({
              dictation: {},
              dicDel: false
          })
      },
      delDicItem: function(e) {
          this.triggerEvent('deleteDictation', e.detail)
      },
      updateDictation: function(e){
          this.triggerEvent('updateDictation', e.detail)
      }
  },

  attached: function(){
    // console.log(this.properties)
   let time = setInterval(() => {
       if(this.data.activeDictation.id){
           this.triggerEvent('selectDic', this.data.activeDictation)
           clearInterval(time)
       }
   },100)
  }
})
