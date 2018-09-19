import config from './config.js'
import wechat from './wechat.js'

const url = config.service.duerosUserUrl

const state = {
  duerosId: ''
}

const getters = {
  duerosId: state => state.duerosId
}

const mutations = {
  setDuerosId (state, id) {
    state.duerosId = id
  }
}

const actions = {
  toBindDuerosId ({commit}, duerosId) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId()
        .then((openid) => {
          wx.request({
            url: url,
            method: 'POST',
            data: {
              openid: openid,
              duerosId: duerosId
            },
            success: function (response) {
              console.log(`post dueros id ${duerosId} successful!`)
              commit('setDuerosId', duerosId)
              resolve(response)
            },
            fail: function (err) {
              console.log(`post dueros id ${duerosId} error ${err}!`)
              reject(err)
            }
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
