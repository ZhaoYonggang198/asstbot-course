import config from '@/config.js'

const hostRoot = config.service.hostRoot
const url = `${hostRoot}/asr`
// import Fly from 'flyio/dist/npm/wx'

// var fly = new Fly()

const state = {
}

const getters = {
}

const mutations = {
}

const actions = {
  getAsrResult ({dispatch, commit}, filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url,
        filePath,
        name: 'audio',
        // formData: {
        //   filename: filePath
        // },
        success: function (res) {
          wx.removeSavedFile({
            filePath,
            fail: (err) => {
              console.error(err)
            }
          })
          if (res.statusCode === 200) {
            var result = JSON.parse(res.data)
            if (result.result && !result.result.err_no) {
              console.log('result', result)
              try {
                var asr = result.result.result[0]
                asr = asr.substr(0, asr.length - 1)
                if (asr.length !== 0) {
                  dispatch('sendSpeech', {url: hostRoot + result.url, asr, nlu: true})
                }
                resolve()
              } catch (err) {
                reject(err)
              }
            } else {
              reject(new Error('语音识别错误'))
            }
          } else {
            reject(new Error('文件上传失败'))
          }
        },
        fail: function (error) {
          reject(error)
        },
        complete: function (response) {
          console.log(response)
        }
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
