const state = {
  status: 'idle',
  cancelText: ''
}

const getters = {
}

const mutations = {
  updateRecordStatus (state, {status, cancelText}) {
    state.status = status
    state.cancelText = cancelText
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
