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
}

export default {
  state,
  getters,
  actions,
  mutations
}
