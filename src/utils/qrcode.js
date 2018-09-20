import config from '@/config.js'

function getSaveImageAuth (scene) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success (res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success () {
              resolve(scene)
            },
            fail (err) {
              wx.hideLoading()
              wx.showToast({
                title: '请在设置页面打开“保存到相册”',
                icon: 'none'
              })
              reject(err)
            }
          })
        } else {
          resolve(scene)
        }
      }
    })
  })
}

export function getQrcodeImageUrl (scene) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.service.qrcodeUrl + '?scene=' + scene,
      method: 'GET',
      success: (response) => {
        let imageUrl = config.service.hostRoot + response.data.url
        resolve(imageUrl)
      },
      fail: (err) => {
        console.log('get qrcode failed : ' + JSON.stringify(err))
        reject(err)
      }
    })
  })
}
function storeQrCodeImage (imageUrl) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: imageUrl,
      success: (res) => {
        console.log(JSON.stringify(res))
        if (res.statusCode === 200) {
          console.log(`save image (${imageUrl}) in path ${res.tempFilePath}`)
          resolve(res.tempFilePath)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        console.log('save image failed : ' + JSON.stringify(err))
        reject(err)
      }
    })
  })
}
function saveImageToPhotosAlbum (imageFilePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath: imageFilePath,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        console.log('save image to photo album failed : ' + JSON.stringify(err))
        reject(err)
      }
    })
  })
}

function comfirmSaveImageToPhotosAlbum (image) {
  wx.hideLoading()
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '分享二维码已保存到系统相册',
      content: '',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      fail: (err) => {
        console.log('comfirm save image to photo album failed : ' + JSON.stringify(err))
        reject(err)
      }
    })
  })
}

export function saveQrCodeToPhotosAlbum (scene) {
  getSaveImageAuth(scene)
    .then(getQrcodeImageUrl)
    .then(storeQrCodeImage)
    .then(saveImageToPhotosAlbum)
    .then(comfirmSaveImageToPhotosAlbum)
    .catch((err) => {
      wx.hideLoading()
      console.log('save qrcode image to photo album failed : ' + JSON.stringify(err))
    })
}

export function savePosterToPhotosAlbum (poster) {
  getSaveImageAuth(poster)
    .then(saveImageToPhotosAlbum)
    .then(comfirmSaveImageToPhotosAlbum)
    .catch((err) => {
      console.log('save qrcode image to photo album failed : ' + JSON.stringify(err))
    })
}

export default {
  getQrcodeImageUrl,
  saveQrCodeToPhotosAlbum,
  savePosterToPhotosAlbum
}
