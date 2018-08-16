/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://xiaodamp.cn'

export default {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/mpapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/mpapp/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/mpapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/mpapp/upload`,

    openIdUrl: `${host}/mpapp/openid`,

    courseUrl: `${host}/mpapp/course`,

    phoneUrl: `${host}/mpapp/phone`,

    requestCodeUrl: `${host}/phone/request/code`,

    verifyCodeUrl: `${host}/phone/login`
  }
}
