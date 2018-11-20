const state = {
  status: 'idle',
  cancelText: '',
  authed: false
}

const getters = {
}

const mutations = {
  updateRecordStatus (state, {status, cancelText}) {
    state.status = status
    state.cancelText = cancelText
  },
  initAuthStatus (state, recordAuth) {
    state.authed = recordAuth
  }
}

const actions = {
  initRecordAuthStatus ({commit}) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success (res) {
          if (!res.authSetting['scope.record']) {
            wx.authorize({
              scope: 'scope.record',
              success: res => {
                commit('initAuthStatus', true)
                resolve()
              }
            })
          } else {
            commit('initAuthStatus', true)
            resolve()
          }
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
