const state = {
  boxItemArr: []
}

const mutations = {
  initBoxState (state, arr) {
    state.boxItemArr = arr
  }
}

const actions = {
  initBoxItem ({dispatch, commit}, arr) {
    if (arr && arr.length) {
      let target = arr.filter(item => item.type === 'button')
      // target.map(item => {
      //   switch (item.event) {
      //     case 'dictation-skill':
      //       item.src = 'https://xiaodamp.com/imbot/image/1c0097b0-e887-11e8-b6e5-79c4537af773.png'
      //       break
      //     case 'course-skill':
      //       item.src = 'https://xiaodamp.com/imbot/image/0c413870-e887-11e8-b6e5-79c4537af773.png'
      //       break
      //     case 'query-self-horoscope-luck':
      //       item.src = 'https://xiaodamp.com/imbot/image/40b0fcd0-e887-11e8-b6e5-79c4537af773.png'
      //       break
      //     case 'query-huangli':
      //       item.src = 'https://xiaodamp.com/imbot/image/28c358c0-e887-11e8-b6e5-79c4537af773.png'
      //       break
      //     case 'enter_simplifier':
      //       item.src = 'https://xiaodamp.com/imbot/image/eb7f99b0-e886-11e8-b6e5-79c4537af773.png'
      //       break
      //     case 'view_public_survey':
      //       item.src = 'https://xiaodamp.com/imbot/image/3638ef10-e887-11e8-b6e5-79c4537af773.png'
      //       break
      //   }
      // })
      let endArr = []
      if (target.length) {
        while (target.length > 8) {
          endArr.push(target.splice(0, 8))
        }
        endArr.push(target)
        commit('initBoxState', endArr)
      }
    }
  }
}

export default {
  state,
  mutations,
  actions
}
