import config from '@/config.js'
import wechat from '../wechat'
let hostUrl = config.service.hostRoot

let state = {
  dictation: []
}

const getters = {
}

const mutations = {
  initDictation (state, res) {
    state.dictation = [...res]
  }
}

const actions = {
  initDictation ({dispatch, commit}) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId().then(openId => {
        wx.request({
          url: hostUrl + '/dictateWords?openId=' + openId,
          method: 'get',
          success: function (res) {
            commit('initDictation', res.data.data)
            resolve(res)
          },
          fail: function (err) {
            reject(err)
          }
        })
      })
    })
  },
  newDictation ({dispatch, commit}, param) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId().then(openId => {
        wx.request({
          url: hostUrl + '/dictateWords',
          method: 'post',
          data: {...param, openId: openId},
          success: function (res) {
            resolve(res)
          },
          fail: function (err) {
            reject(err)
          }
        })
      })
    })
  },
  updateDictation ({dispatch, commit}, param) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: hostUrl + '/dictateWords',
        method: 'put',
        data: {...param},
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },
  deleteDictation ({dispatch, commit}, id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: hostUrl + '/dictateWords?id=' + id,
        method: 'delete',
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        }
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
