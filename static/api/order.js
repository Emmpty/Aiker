import request from '../utils/request.js'

// 创建订单
export function createOrder(data) {
  return request({
    url: 'user/order/create',
    method: 'POST',
    data
  })
}

// 通过手机号支付
export function walletBuyByPhone(data, mobile) {
  return request({
    url: 'h5/special_buy/' + mobile,
    method: 'POST',
    data
  })
}

// 申请提现
export function scoreCash(data) {
  return request({
    url: 'user/score/cash',
    method: 'POST',
    data
  })
}
// 收益统计
export function scoreProfit(data) {
  return request({
    url: 'user/score/profit',
    method: 'POST',
    data
  })
}
// 邀请记录
export function invitePage(data) {
  return request({
    url: 'user/invite/page',
    method: 'POST',
    data
  })
}
// 收益记录
export function incomePage(data) {
  return request({
    url: 'user/score/logs',
    method: 'POST',
    data
  })
}
// 提现记录
export function cashLogs(data) {
  return request({
    url: 'user/score/cashLogs',
    method: 'POST',
    data
  })
}
// 提现记录
export function pointLogs(data) {
  return request({
    url: 'user/point/logs',
    method: 'POST',
    data
  })
}

// 检测折扣码
export function discountCode(data) {
  return request({
    url: 'user/discount',
    method: 'POST',
    data
  })
}














