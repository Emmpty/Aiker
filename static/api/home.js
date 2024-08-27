import request from '../utils/request.js'

// 立即体验
export function tryFast(data) {
  return request({
    url: 'task/tryFast/' + data.id,
    method: 'POST',
    data
  })
}
// 使用水印
export function reqWatermark(data) {
  return request({
    url: 'task/reqWatermark',
    method: 'POST',
    data
  })
}
// 画同款  重做
export function galleryCopyStyle(data) {
  return request({
    url: 'gallery/copyStyle/' + data.id,
    method: 'POST',
    data
  })
}

// 公众号授权认证
export function mpOauth(data) {
  return request({
    url: 'mp/wx56f072f1563a013a/oauth?code=' + data.code,
    method: 'POST',
    data
  })
}

// 用户无感知公众号授权认证
export function mpToOpenIdOauth(data) {
  return request({
    url: 'wallet/mp2OpenId?appid=wx56f072f1563a013a&code=' + data.code,
    method: 'POST',
    data
  })
}

// 公众号授权认证
export function orderQuery(data) {
  return request({
    url: 'wallet/order/query/' + data.id,
    method: 'POST',
    data
  })
}


