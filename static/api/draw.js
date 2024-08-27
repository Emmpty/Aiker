import request from '@/static/utils/request.js'

// 影展列表
export function getGalleryList(data) {
  return request({
    url: 'gallery/list',
    method: 'POST',
    data
  })
}

// 影展详情
export function getGalleryDetail(data) {
  return request({
    url: 'gallery/detail',
    method: 'POST',
    data
  })
}

// 发起创作任务
export function creativeDraw(data) {
  return request({
    url: 'task/start',
    method: 'POST',
    data
  })
}

// 发起山水动图创作
export function creativeDrawLandscape(data) {
  return request({
    url: 'task/landscape',
    method: 'POST',
    data
  })
}

// 创作任务列表
export function getDrawList(data) {
  return request({
    url: 'task/list',
    method: 'POST',
    data
  })
}

// 删除创作
export function deleteDraw(data) {
  return request({
    url: 'task/delete',
    method: 'POST',
    data
  })
}

// 创作容量
export function taskCapacity(data) {
  return request({
    url: 'task/capacity',
    method: 'POST',
    data
  })
}

//  移除点赞
export function removeLike(data) {
  return request({
    url: 'gallery/removeLike',
    method: 'POST',
    data
  })
}
//  点赞
export function addLike(data) {
  return request({
    url: 'gallery/addLike',
    method: 'POST',
    data
  })
}

// 作品发布 撤回发布
export function taskPublishOrReset(data) {
  return request({
    url: 'gallery/publish',
    method: 'POST',
    data
  })
}


// 光影舞蹈生成参考图
export function aiDanceImagine(data) {
  return request({
    url: 'draft/imagine',
    method: 'POST',
    data
  })
}

// 参考图生成进度
export function aiDanceImagineProcess(data) {
  return request({
    url: 'draft/process',
    method: 'POST',
    data
  })
}

// 光影舞蹈制作
export function aiDanceStart(data) {
  return request({
    url: 'draft/start',
    method: 'POST',
    data
  })
}

// 图生文案
export function aiCopywriting(data) {
  return request({
    url: 'writes/start',
    method: 'POST',
    data
  })
}

// 图生文案详情
export function aiCopywritingDetail(data) {
  return request({
    url: 'writes/detail',
    method: 'POST',
    data
  })
}

// 一键高清
export function aiHDVideo(data) {
  return request({
    url: 'task/superreal',
    method: 'POST',
    data
  })
}

// 视频动漫
export function aiVideoCartoon(data) {
  return request({
    url: 'task/anime',
    method: 'POST',
    data
  })
}

// 点数扣点
export function estimate(data) {
  return request({
    url: 'task/estimate',
    method: 'POST',
    data
  })
}

// 图片说话
export function aiTalker(data) {
  return request({
    url: 'task/talker',
    method: 'POST',
    data
  })
}


// AI推荐语
export function getAiWrite(data) {
  return request({
    url: 'ai/voice/write',
    method: 'POST',
    data
  })
}

// 配音列表
export function getAiVoiceList(data) {
  return request({
    url: 'ai/voice/list',
    method: 'POST',
    data
  })
}





