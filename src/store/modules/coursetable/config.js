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
    loginUrl: `${host}/api/course/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/api/course/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/api/course/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/api/course/upload`,

    openIdUrl: `${host}/asst/openid`,

    courseUrl: `${host}/api/course/course`,

    phoneUrl: `${host}/api/course/phone`,
    
    requestCodeUrl: `${host}/api/oauth/request/code`,

    verifyCodeUrl: `${host}/api/oauth/login`
  }
}
