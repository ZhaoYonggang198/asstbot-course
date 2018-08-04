import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: '分享到朋友圈',
    'enablePullDownRefresh': false,
    'disableScroll': true,
    'usingComponents': {
      'painter': '../../../static/painter/painter',
      'wxc-panel': '../../../static/minui/packages/wxc-panel/dist/index',
      'wxc-popup': '../../../static/minui/packages/wxc-popup/dist/index',
      'wxc-list': '../../../static/minui/packages/wxc-list/dist/index'
    }
  }
}
