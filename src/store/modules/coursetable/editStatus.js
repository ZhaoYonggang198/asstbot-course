const state = {
  day: -1,
  interval: -1,
  course: -1,
  status: ''
}

const mutations = {
  setEditStatus (state, {day, interval, course, status}) {
    console.log('setEditStatus')
    state.day = day
    state.interval = interval
    state.course = course
    state.status = status
  },
  clearEditStatus (state) {
    state.day = -1
    state.interval = -1
    state.course = -1
    state.status = ''
  },
  clearEditStatusPerDay (state, {day}) {
    if (day === state.day) {
      state.day = -1
      state.interval = -1
      state.course = -1
      state.status = ''
    }
  }
}

export default {
  state,
  mutations
}
