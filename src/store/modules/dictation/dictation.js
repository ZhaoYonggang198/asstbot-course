import config from '@/config.js'
import wechat from '../wechat'
let hostUrl = config.service.hostRoot

function getPin (word) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: hostUrl + '/pinyin?sentence=' + word,
      method: 'get',
      success: function (res) {
        resolve(res.data.data)
      }
    })
  })
}

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
  },
  getPinyin ({dispatch, commit}, words) {
    let arr = []
    words.map(item => {
      arr.push(getPin(item))
    })
    return Promise.all(arr)
  },
  getPinyinVoice ({dispatch, commit}, words) {
    console.log(words)
    return new Promise((resolve, reject) => {
      wx.request({
        url: hostUrl + '/tts',
        method: 'post',
        data: words,
        success: function (res) {
          resolve(hostUrl + '/' + res.data.url)
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
