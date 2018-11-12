import config from '@/config.js'
import wechat from '@/store/modules/wechat.js'

const hostRoot = `${config.service.hostRoot}/formId`

function saveFormId (formId) {
  wechat.getOpenId().then(openId => {
    wx.request({
      url: hostRoot,
      method: 'PUT',
      data: {
        id: openId,
        formId
      }
    })
  })
}

export default {
  save: saveFormId
}
