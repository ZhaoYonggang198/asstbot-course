const state = {
  id: '',
  dictateWords: {
    title: '',
    active: false,
    playWay: 'order',
    playTimes: 1,
    intervel: 5,
    words: [
      {
        term: '',
        pinyin: ''
      }
    ]
  }
}

const mutations = {
  initEditDictation (state, param) {
    state = {...param}
  },
  updateDictationTitle (state, title) {
    state.dictateWords.title = title
  },
  updateActive (state, active) {
    state.dictateWords.active = active
  },
  updatePlayway (state, playway) {
    state.dictateWords.playWay = playway
  },
  updatePlaytime (state, playtime) {
    state.dictateWords.playTimes = playtime
  },
  updateInterval (state, interval) {
    state.dictateWords.interval = interval
  },
  updateWordsPinyin (state, {index, value}) {
    state.dictateWords.words[index] = value
  },
  deleteWord (state, {index}) {
    state.dictateWords.words.splice(index, 1)
  }
}

const actions = {
}

export default {
  state,
  mutations,
  actions
}
