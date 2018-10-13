
import config from '@/config.js'

const hostRoot = `${config.service.hostRoot}/tts`

const state = {
  sounds: [],
  currentIndex: 0
}

const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = true
innerAudioContext.onError((error) => { console.log(error) })

const play = function (sounds, callback) {
  state.sounds = sounds
  state.currentIndex = 0
  innerAudioContext.src = `${hostRoot}/${sounds[0]}`
  let onEnd = () => {
    innerAudioContext.offEnded()
    state.currentIndex = state.currentIndex + 1
    if (state.currentIndex < state.sounds.length) {
      innerAudioContext.src = `${hostRoot}/${state.sounds[state.currentIndex]}`
      innerAudioContext.onEnded(onEnd)
    } else {
      callback()
    }
  }
  innerAudioContext.onEnded(onEnd)
}

const stop = function () {
  innerAudioContext.stop()
  state.sounds = []
  state.currentIndex = 0
  innerAudioContext.offEnded()
}

export default {
  play,
  stop
}
