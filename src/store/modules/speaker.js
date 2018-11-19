import config from '@/config.js'

const url = `${config.service.hostRoot}/dingdong/skill`

const state = {
  dingDongSkillList: []
}

const getters = {
}

const mutations = {
  updateSkillList (state, data) {
    state.dingDongSkillList = data
  }
}

const actions = {
  getDingdongSkillList ({commit}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        method: 'GET',
        success: (res) => {
          commit('updateSkillList', res.data)
          resolve(res.data)
        },
        fail: () => {}
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
