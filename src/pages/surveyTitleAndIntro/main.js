import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    page: {
      'enablePullDownRefresh': false
    },
    navigationBarTitleText: '编辑信息'
  }
}