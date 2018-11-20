const state = {
  boxItemArr: [],
  voiceObject: {}
}

const mutations = {
  initBoxState (state, arr) {
    state.boxItemArr = arr
  },
  initVoiceState (state, obj) {
    state.voiceObject = obj
  }
}

const actions = {
  initBoxItem ({dispatch, commit}, arr) {
    if (arr && arr.length) {
      let target = arr.filter(item => item.type === 'button')
      let voiceTarget = arr.filter(item => item.type === 'icon')
      let endArr = []
      if (target.length) {
        while (target.length > 8) {
          endArr.push(target.splice(0, 8))
        }
        endArr.push(target)
        commit('initBoxState', endArr)
      }
      if (voiceTarget.length) {
        commit('initVoiceState', voiceTarget[0])
      }
    }
  }
}

export default {
  state,
  mutations,
  actions
}
