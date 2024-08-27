import request from '@/static/utils/request.js'

// 用户信息
export function getUserInfo(data) {
  return request({
    url: 'user/info',
    method: 'POST',
    data
  })
}
// 修改昵称
export function updateNick(data) {
  return request({
    url: 'user/updateNick',
    method: 'POST',
    data
  })
}
// 获取图片上传参数
export function getUploadUrl(data) {
  return request({
    url: 'task/attachment?type=' + (data || ''),
    method: 'POST',
    data: {}
  })
}

// 获取修改手机验证码
export function sendVerifyCode(data) {
  return request({
    url: 'app/sendVerifyCode',
    method: 'POST',
    data
  })
}
// 验证修改手机验证码
export function checkVerifyCode(data) {
  return request({
    url: 'app/checkVerifyCode',
    method: 'POST',
    data
  })
}
// 换绑手机发送验证码
export function sendBindCode(data) {
  return request({
    url: 'app/sendBindCode',
    method: 'POST',
    data
  })
}

// 绑定手机号
export function bindPhone(data) {
  return request({
    url: 'app/changeMobile',
    method: 'POST',
    data
  })
}

// 用户邀请任务
export function inviteTask(data) {
  return request({
    url: 'user/invite/task',
    method: 'POST',
    data
  })
}

// 做任务
export function taskDo(data) {
  return request({
    url: 'user/invite/share',
    method: 'POST',
    data
  })
}

// 用户无感知公众号授权认证获取code，openId
export function mpToOpenIdOauth(data) {
  return request({
    url: 'app/mp2OpenId?appid=wx56f072f1563a013a&code=' + data.code,
    method: 'POST',
    data
  })
}

// 根据手机号判断用户是否注册
export function checkUserRegisterByPhone(data) {
  return request({
    url: 'h5/checkMobile/' + data,
    method: 'POST',
    data
  })
}

//  忘记密码发送验证码
export function sendForgetCode(data) {
  return request({
    url: 'app/sendForgetCode',
    method: 'POST',
    data
  })
}
//   确认找回密码
export function password(data) {
  return request({
    url: 'app/forget/password',
    method: 'POST',
    data
  })
}

