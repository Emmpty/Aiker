import request from '@/static/utils/request.js'

// 获取公告
export function notifyPull(data) {
  return request({
    url: 'h5/notify/pull',
    method: 'POST',
    data
  })
}





