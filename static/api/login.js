import request from '@/static/utils/request.js'
import utils from '@/static/utils/utils.js'

// 登录
export function wxmAuth(data) {
  return request({
    url: `user/wxm/${utils.appid}/auth`,
    method: 'POST',
    data
  })
}

// 注册
export function wxmRegister(data) {
  return request({
    url: `user/wxm/${utils.appid}/register`,
    method: 'POST',
    data
  })
}

// 用户信息
export function userInfo(data) {
  return request({
    url: 'user/info',
    method: 'POST',
    data
  })
}

// 发送验证码
export function sendRegCode(data) {
  return request({
    url: 'app/sendRegCode',
    method: 'POST',
    data
  })
}

// 手机号/密码 登录
export function login(data) {
  return request({
    url: 'user/login',
    method: 'POST',
    data
  })
}

// 手机号注册/登录
export function mobileRegAndLogin(data) {
  return request({
    url: 'app/mobileLogin',
    method: 'POST',
    data
  })
}
// 解析公众号code
export function appMpoath(data) {
  return request({
    url: 'app/mp_oath?appid=wx56f072f1563a013a&code=' + data.code,
    method: 'POST',
    data
  })
}

// 设置密码
export function modifyPwd(data) {
  return request({
    url: 'user/modifyPwd',
    method: 'POST',
    data
  })
}

