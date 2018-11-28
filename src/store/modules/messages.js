import wechat from './wechat'
import config from '@/config.js'

var url = `${config.service.hostRoot}/chatbot/survey`
var surveyId = ''
var chatBot = 'surveyBot'
var sceneMode = 'publish'

const state = {
  creatorBotMsg: [],
  surveybotMsg: [],
  canTalk: ''
}

var __appendMsg = function (state, msg) {
  if (chatBot === 'surveyBot') {
    state.surveybotMsg.push(msg)
  } else {
    state.creatorBotMsg.push(msg)
  }
}

const getters = {

  getCreateMsgLength (state) {
    return state.creatorBotMsg.length
  },

  getMessagesBy: state => (index, chatType) => {
    if (chatType === 'main') {
      return state.creatorBotMsg[parseInt(index)]
    } else {
      return state.surveybotMsg[parseInt(index)]
    }
  },

  activeMsg: state => (chatType) => {
    let msgList = (chatType === 'main') ? state.creatorBotMsg : state.surveybotMsg
    if (!msgList) {
      return undefined
    }
    let lastmsg = msgList.slice(-1)[0]
    if (!lastmsg || !lastmsg.to || !lastmsg.msgs || lastmsg.msgs.length === 0) {
      return undefined
    }
    return lastmsg
  }
}

const mutations = {
  appendMessage (state, message) {
    if (message.from) {
      if (chatBot === 'surveyBot') {
        state.surveybotMsg.push([{id: state.surveybotMsg.length, ...message}])
      } else {
        state.creatorBotMsg.push([{id: state.creatorBotMsg.length, ...message}])
      }
    } else {
      if (chatBot === 'surveyBot') {
        state.surveybotMsg[state.surveybotMsg.length - 1].push({id: state.surveybotMsg.length, ...message})
      } else {
        state.creatorBotMsg[state.creatorBotMsg.length - 1].push({id: state.creatorBotMsg.length, ...message})
      }
    }
  },
  talkToBotFather (state) {
    chatBot = 'bodFather'
    url = `${config.service.hostRoot}/chatbot`
    state.surveybotMsg = []
  },
  talkToSurveyBot (state, {id, scene}) {
    state.surveybotMsg = []
    chatBot = 'surveyBot'
    url = `${config.service.hostRoot}/chatbot/survey`
    surveyId = id
    sceneMode = scene
  },
  appendDividerMessage (state, cause) {
    const timestamp = new Date()
    __appendMsg(state, {timestamp, gui: 'gui', type: 'divider'})
  },
  appendUserMessage (state, value) {
    let message = {
      from: {
        id: ''
      },
      type: 'text',
      data: {
        query: value
      }
    }
    this.commit('appendMessage', message)
  },
  modifyMessage (state, message) {
    let modify = (msg) => {
      if (msg.timestamp === message.timestamp) {
        return message
      } else {
        return msg
      }
    }
    if (chatBot === 'surveyBot') {
      state.surveybotMsg = state.surveybotMsg.map(modify)
    } else {
      state.creatorBotMsg = state.surveybotMsg.map(modify)
    }
  },
  setCanTalk (state, data) {
    state.canTalk = data
  }
}

var _impleSendmessage = (commit, id, type, data) => {
  const message = {
    from: {
      id
    },
    type,
    data
  }
  commit('appendMessage', message)
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: message,
      method: 'POST',
      success: (response) => {
        let res = response.data
        let data = []
        if (response.data.msgs && response.data.msgs.length) {
          response.data.msgs.map(item => {
            if (item.type === 'multi-text') {
              item.items.map(msg => {
                data.push({
                  reply: msg,
                  type: 'text'
                })
              })
            } else {
              data.push(item)
            }
          })
        }
        res.msgs = data
        commit('appendMessage', res)
        resolve(response)
      },
      fail: (err) => {
        // commit('appendMessage', {to: {id: 'xxx'}, msgs: [{type: 'text', reply: '小哒累了, 休息一会儿'}]})
        // console.log('test')
        reject(err)
      },
      complete: (response) => {
        if (!response.statusCode || response.statusCode !== 200) {
          commit('appendMessage', {to: {id: 'xxx'}, msgs: [{type: 'text', reply: '小哒累了, 休息一会儿💤，等会儿再来找我行吗'}]})
          console.error(response)
          reject(response)
        }
      }
    })
  })
}

var _sendmessage = (commit, type, data) => {
  return new Promise((resolve, reject) => {
    wechat.getOpenId().then((openid) => {
      _impleSendmessage(commit, openid, type, data)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    })
      .catch((err) => {
        console.error(err)
        reject(err)
      })
  })
}

var __sendLogin = (commit, isNew) => {
  return new Promise((resolve, reject) => {
    _sendmessage(commit, 'login', {code: '', isNew})
      .then(() => {
        wx.setStorage({
          key: 'has-login',
          value: 'true',
          success: () => {
            resolve()
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
      .catch((err) => {
        console.error(err)
        reject(err)
      })
  })
}

const actions = {
  fetchMessages () {
    return new Promise((resolve, reject) => {
    })
  },
  login ({commit}) {
    return _sendmessage(commit, 'login', {code: ''})
  },
  sendQuery ({commit}, query) {
    return _sendmessage(commit, 'text', {query})
  },
  sendImage ({commit}, {url, indicator}) {
    return _sendmessage(commit, 'image', {url, indicator})
  },
  sentRadioReply ({ commit }, data) {
    return _sendmessage(commit, 'radio-reply', data)
  },
  sentCheckBoxReply ({ commit }, data) {
    return _sendmessage(commit, 'checkbox-reply', data)
  },
  start ({commit}) {
    if (chatBot === 'surveyBot') {
      return _sendmessage(commit, 'dialog-start', {surveyId, scene: sceneMode})
    } else {
      return new Promise((resolve, reject) => {
        wx.getStorage({
          key: 'has-login',
          success: (res) => {
            __sendLogin(commit, false)
              .then(() => {
                resolve()
              })
              .catch((err) => {
                console.err(err)
                reject(err)
              })
          },
          fail: (res) => {
            __sendLogin(commit, true)
              .then(() => {
                resolve()
              })
              .catch((err) => {
                console.err(err)
                reject(err)
              })
          }
        })
      })
    }
  },
  getUserinfo ({commit}, data) {
    return _sendmessage(commit, 'getUserinfo', data)
  },
  allowPermise ({commit}, data) {
    return _sendmessage(commit, 'allow', data)
  },
  sendSpeech ({commit}, {url, asr, nlu}) {
    return _sendmessage(commit, 'speech', {url, asr, nlu})
  },
  sendGenericRequest ({commit}, {type, data}) {
    return _sendmessage(commit, type, data)
  },
  setVoice ({dispatch, commit}, data) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId().then((openid) => {
        const message = {
          from: {
            id: openid
          },
          type: 'radio-reply',
          data
        }
        wx.request({
          url,
          data: message,
          method: 'POST',
          success: (response) => {
            resolve(response)
          },
          fail: (err) => {
            reject(err)
          },
          complete: (response) => {
            if (!response.statusCode || response.statusCode !== 200) {
              reject(response)
            }
          }
        })
      })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },
  updateTalkTts ({dispatch, commit}, data) {
    return new Promise((resolve, reject) => {
      wechat.getOpenId().then(openid => {
        wx.request({
          url: config.service.updateTts,
          method: 'post',
          data: {...data, id: openid},
          success: function (res) {
            console.log(res.data)
            resolve(res.data)
          },
          fail: function (err) {
            console.log(err)
            reject(err)
          }
        })
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
