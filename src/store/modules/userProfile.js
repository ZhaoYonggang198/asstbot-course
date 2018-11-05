import wechat from './wechat'
import config from '@/config.js'

const url = config.service.userInfoUrl

const bindingUrl = `${config.service.hostRoot}/binding`
const unbindingUrl = `${config.service.hostRoot}/unbinding`

const state = {
  userInfo: {},
  authed: undefined,
  loginStatus: undefined,
  smartSpeakes: []
}

const getters = {
  hasLogin: state => {
    return state.authed || state.loginStatus
  }
}

const mutations = {
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  setAuth (state, auth) {
    state.authed = auth
  },
  setLogin (state) {
    state.loginStatus = true
  },
  setSmartSpeaker (state, speakers) {
    state.smartSpeakes = speakers
  }
}

function __updateUserInfo (userInfo) {
  return new Promise((resolve, reject) => {
    wechat.getOpenId()
      .then((openid) => {
        wx.request({
          url,
          data: {
            id: openid,
            wechat: userInfo
          },
          method: 'POST',
          success: (response) => {
            resolve(response)
          },
          catch: (err) => {
            reject(err)
          }
        })
      })
  })
}

function __getUserInfo (auth) {
  return new Promise((resolve, reject) => {
    if (auth) {
      wx.getUserInfo({
        success: function (res) {
          resolve(res.userInfo)
        },
        fail: function (err) {
          reject(err)
        }
      })
    } else {
      resolve({
        nickName: '',
        avatarUrl: '',
        gender: 0,
        city: ''
      })
    }
  })
}

const actions = {
  updateUserInfo ({dispatch, commit}) {
    return new Promise((resolve, reject) => {
      dispatch('updateAuthStatus')
        .then(__getUserInfo)
        .then(__updateUserInfo)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateAuthStatus ({commit}) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (response) => {
          let auth = !!response.authSetting['scope.userInfo']
          commit('setAuth', auth)
          resolve(auth)
        }
      })
    })
  },
  getSmartSpeakers ({commit}) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId().then((openid) => {
        wx.request({
          url: `${bindingUrl}?openId=${openid}`,
          method: 'GET',
          success: (response) => {
            if (response.data.bindingTypes !== undefined) {
              commit('setSmartSpeaker', response.data.bindingTypes)
            }
            resolve(response.data)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    })
  },
  bindSpeaker ({dispatch}, data) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId().then((openId) => {
        wx.request({
          url: `${bindingUrl}`,
          method: 'POST',
          data: {
            openId, ...data
          },
          success: (response) => {
            dispatch('getSmartSpeakers')
            if (response.data.result === 'success' && response.data.state) {
              resolve()
            } else {
              reject(response.data)
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    })
  },
  unbindSpeaker ({dispatch}, data) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId().then((openId) => {
        wx.request({
          url: `${unbindingUrl}`,
          method: 'POST',
          data: {
            openId, ...data
          },
          success: (response) => {
            dispatch('getSmartSpeakers')
            if (response.data.result === 'success' && response.data.state) {
              resolve()
            } else {
              reject(response.data)
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
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
