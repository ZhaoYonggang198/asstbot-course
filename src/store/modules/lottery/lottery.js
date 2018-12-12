import config from '@/config.js'
import wechat from '../wechat.js'

const hostRoot = config.service.hostRoot

const state = {
  totalScore: 0,
  usedScore: 0,
  remainScore: 0,
  drawTimes: 0,
  awardList: []
}

const getters = {
}

const mutations = {
  updateScore (state, data) {
    state.totalScore = data.totalScore
    state.usedScore = data.usedScore
    state.remainScore = data.remainScore
    state.drawTimes = data.drawTimes
  },

  updateAwards (state, data) {
    state.awardList = data
  }
}

const actions = {
  getScore ({commit}) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId().then((openId) => {
        wx.request({
          url: `${hostRoot}/integral?id=${openId}`,
          method: 'GET',
          success: (res) => {
            commit('updateScore', res.data.data)
            resolve(res.data.data)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    })
  },
  getAwards ({commit}) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId().then((openId) => {
        wx.request({
          url: `${hostRoot}/awards?id=${openId}`,
          method: 'GET',
          success: (res) => {
            commit('updateAwards', res.data.data)
            resolve()
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    })
  },
  luckyDraw ({dispatch}) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId().then((openId) => {
        wx.request({
          url: `${hostRoot}/luckydraw`,
          method: 'POST',
          data: {id: openId},
          success: (res) => {
            dispatch('getScore')
            dispatch('getAwards')
            resolve(res.data.data)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    })
  },
  prizeuser ({dispatch}, {grand, phone}) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId().then((openId) => {
        wx.request({
          url: `${hostRoot}/prizeuser`,
          method: 'POST',
          data: {id: openId, grand, phone},
          success: (res) => {
            dispatch('getScore')
            resolve(res.data.data)
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
