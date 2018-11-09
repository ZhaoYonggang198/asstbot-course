const state = {
  id: '',
  dicId: '',
  dicActiveId: ''
}

const mutations = {
  saveId (state, id) {
    state.id = id
  },
  saveDicId (state, id) {
    state.dicId = id
  },
  saveDicActiveId (state, id) {
    state.dicActiveId = id
  }
}

const actions = {
  setId ({commit}, id) {
    commit('saveId', id)
  },
  setDicId ({commit}, id) {
    commit('saveDicId', id)
  },
  setDicActiveId ({commit}, id) {
    commit('saveDicActiveId', id)
  }
}

export default {
  state,
  mutations,
  actions
}
