import request from '../utils/request.js'
// #ifdef MP
var { miniProgram } = uni.getAccountInfoSync();
var appid = miniProgram.appId;
// #endif

// 获取用户信息
export function userInfo(data) {
  return request({
    url: 'user/info',
    method: 'POST',
    data
  })
}

// 微信快捷登录
export function wxmAuth(data) {
  return request({
    url: 'user/wxm/' + appid + '/auth',
    method: 'POST',
    data
  })
}

// 微信一键注册（使用微信授权手机号码api）
export function wxmRegister(data) {
  return request({
    url: 'user/wxm/' + appid + '/register',
    method: 'POST',
    data
  })
}
// 微信一键绑定手机号（使用微信授权手机号码api）
export function wxmBindPhoner(data) {
  return request({
    url: 'user/wxm/' + appid + '/bindPhone',
    method: 'POST',
    data
  })
}
// 海报生成
export function getWxaCode(data) {
  return request({
    url: 'user/invite/getWxaCode/' + appid + '/' + data.env,
    method: 'POST',
    data
  })
}
// 微信一键登录
export function wxmReg(data) {
  return request({
    url: 'user/wxm/' + appid + '/reg',
    method: 'POST',
    data
  })
}

//  获取草稿列表
export function albumList(data) {
  return request({
    url: 'user/album/list',
    method: 'POST',
    data
  })
}

// 获取专辑内草稿列表
export function taskList(data) {
  return request({
    url: 'user/album/task_list',
    method: 'POST',
    data
  })
}

// 获取作品详情信息
export function tackdrawDetail(data) {
  return request({
    url: 'task/drawDetail',
    method: 'POST',
    data
  })
}

//  移至画册
export function moveToGallery(data) {
  return request({
    url: 'gallery/my/moveToGallery',
    method: 'POST',
    data
  })
}

// 获取画册/影展列表
export function galleryList(data) {
  return request({
    // url: 'user/gallery/list', //废弃
    url: 'user/gallery/page',
    method: 'POST',
    data
  })
}

// 赞过列表
export function likePage(data) {
  return request({
    url: 'user/like/page',
    method: 'POST',
    data
  })
}
// 创意列表
export function creativeList(data) {
  return request({
    url: 'user/creative/list',
    method: 'POST',
    data
  })
}

// 影展 画册 赞过 详情
export function galleryDetail(data) {
  return request({
    // url: 'gallery/detail?id='+data.id,
    // url: 'app/gallery/'+data.id,
    url: 'gallery/show?galleryId=' + data.id + "&taskId=" + data.taskId,
    method: 'POST',
    data
  })
}


// 删除画册作品
export function deleteWorks(data) {
  return request({
    url: 'gallery/my/closeToGallery',
    method: 'POST',
    data
  })
}

// 是否公开作品
export function publicOnGallery(data) {
  return request({
    url: 'gallery/my/publicOnGallery',
    method: 'POST',
    data
  })
}

// 检测折扣码
export function discountCode(data) {
  return request({
    url: 'wallet/promotion/discount',
    method: 'POST',
    data
  })
}


// 点数充值
export function buyMana(data) {
  return request({
    url: 'wallet/buy',
    method: 'POST',
    data
  })
}
// 灵石提现
export function walletCash(data) {
  return request({
    url: 'wallet/cash',
    method: 'POST',
    data
  })
}

// 灵石提现
export function taskInfo(data) {
  return request({
    url: '/wallet/task/info',
    method: 'POST',
    data
  })
}

// 获取邀请人数
export function taskInvites(data) {
  return request({
    url: '/wallet/task/invites',
    method: 'POST',
    data
  })
}

// 兑换码接口
export function redeemCode(data) {
  return request({
    url: 'wallet/redeem_code/use/' + data.code,
    method: 'POST',
    data
  })
}


//   获取最新列表
export function galleryNewList(data) {
  return request({
    url: 'gallery/new_list',
    method: 'POST',
    data
  })
}

//   是否隐藏关键词
export function setGalleryPrompt(data) {
  return request({
    url: 'gallery/my/setGalleryPrompt',
    method: 'POST',
    data
  })
}
//   保存描述
export function saveDescription(data) {
  return request({
    url: 'gallery/my/saveDescription',
    method: 'POST',
    data
  })
}

// 获取消费点数明细
export function pointLogs(data) {
  return request({
    url: 'wallet/point/logs',
    method: 'POST',
    data
  })
}


//   tab影展  
export function galleryDayRankNew(data) {
  console.log(data)
  let src
  if (data.isVisible == 1) {
    src = `type=${data.type}&last=${data.last}&isVisible=${data.isVisible}`
  } else {
    src = `type=${data.type}&last=${data.last}`
  }
  return request({
    url: 'gallery/dayRankNew?' + src,
    method: 'POST',
    data
  })
}


//   重置发送验证码
export function sendForgetCode(data) {
  return request({
    url: 'app/sendForgetCode/' + data.phone,
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

// 设置密码
export function modifyPwd(data) {
  return request({
    url: 'app/modifyPwd',
    method: 'POST',
    data
  })
}

// 用户登录
export function login(data) {
  return request({
    url: 'app/login',
    method: 'POST',
    data
  })
}

// 绑定发送验证码
export function sendBindCode(data) {
  return request({
    url: 'app/sendBindCode/' + data.mobile,
    method: 'POST',
    data
  })
}
//   注册发送验证码
export function generateCode(data) {
  return request({
    url: 'app/sendRegCode/' + data.phone,
    method: 'POST',
    data
  })
}
// 绑定发送验证码
export function appbindPhone(data) {
  return request({
    url: 'app/bindPhone',
    method: 'POST',
    data
  })
}
// 用户注册
export function userRegister(data) {
  return request({
    url: 'app/register',
    method: 'POST',
    data
  })
}

// 开始绘图
export function createTask(data) {
  return request({
    url: 'task/new',
    method: 'POST',
    data
  })
}

// 开始绘图
export function currentDraw(data) {
  return request({
    url: 'task/getCurrentDraw',
    method: 'POST',
    data
  })
}

//
export function taskNext(data) {
  return request({
    url: 'task/next',
    method: 'POST',
    data
  })
}

//  删除专辑（批量） 
export function deleteBatch(data) {
  return request({
    url: 'user/album/deleteBatch',
    method: 'DELETE',
    data
  })
}

//  删除专辑（批量） 
export function galleryDeleteBatch(data) {
  return request({
    url: 'user/gallery/deleteBatch',
    method: 'DELETE',
    data
  })
}

//  token 续期
export function refreshToken(data) {
  return request({
    url: 'app/refreshToken',
    method: 'POST',
    data
  })
}

//  影展 热门 点赞
export function removeLike(data) {
  return request({
    url: 'user/removeLike?id=' + data.id,
    method: 'POST',
    data
  })
}
//  影展 热门 点赞
export function addLike(data) {
  return request({
    url: 'user/addLike?id=' + data.id,
    method: 'POST',
    data
  })
}


//  存证列表
export function attestPage(data) {
  return request({
    url: 'user/attest/page',
    method: 'POST',
    data
  })
}
//  申请存证
export function attestAdd(data) {
  return request({
    url: 'user/attest/add',
    method: 'POST',
    data
  })
}
//  存证详情
export function attestDetail(data) {
  return request({
    url: 'user/attest/detail?id=' + data.id,
    method: 'POST',
    data
  })
}
//  搜索存证
export function attestSearch(data) {
  return request({
    url: 'user/attest/search?id=' + data.id,
    method: 'POST',
    data
  })
}
// 发送修改手机验证码
export function sendVerifyCode(data) {
  return request({
    url: 'app/sendVerifyCode',
    method: 'POST',
    data
  })
}
// 发送修改手机验证码
export function checkVerifyCode(data) {
  return request({
    url: 'app/checkVerifyCode/' + data.code,
    method: 'POST',
    data
  })
}
// 双验证码绑定手机号
export function bindPhone(data) {
  return request({
    url: 'user/bind/phone',
    method: 'POST',
    data
  })
}
// 解绑用户微信
export function unbindWx(data) {
  return request({
    url: 'user/unbind/wx',
    method: 'POST',
    data
  })
}

// 获取个人主页 用户列表
export function galleryPage(data) {
  return request({
    url: 'gallery/page',
    method: 'POST',
    data
  })
}
// 获取个人主页 用户信息
export function userId(data) {
  return request({
    url: 'app/user/' + data.id,
    method: 'POST',
    data
  })
}


// 用户关注
export function followAdd(data) {
  return request({
    url: 'user/follow/add/' + data.id,
    method: 'POST',
    data
  })
}
// 取消关注
export function followRemove(data) {
  return request({
    url: 'user/follow/remove/' + data.id,
    method: 'POST',
    data
  })
}
// 获取粉丝列表 
export function fansList(data) {
  return request({
    url: 'user/fans/page',
    method: 'POST',
    data
  })
}
// 获取关注列表 
export function followList(data) {
  return request({
    url: 'user/follow/page',
    method: 'POST',
    data
  })
}
// 购买权益次数
export function walletBuy(data) {
  return request({
    url: 'wallet/buy',
    method: 'POST',
    data
  })
}

// 通过手机号支付
export function walletBuyByPhone(data, mobile) {
  return request({
    url: 'wallet/special_buy/' + mobile,
    method: 'POST',
    data
  })
}

// 获取合集列表
export function collectList(data) {
  return request({
    url: 'user/collect/page',
    method: 'POST',
    data
  })
}
// 新增合集列表
export function collectAdd(data) {
  return request({
    url: 'user/collect/create',
    method: 'POST',
    data
  })
}
// 编辑合集
export function collectEdit(data) {
  return request({
    url: 'user/collect/edit',
    method: 'POST',
    data
  })
}

// 获取合集草稿列表
export function collectTaskpage(data) {
  return request({
    url: 'user/collect/task_page',
    method: 'POST',
    data
  })
}
// 获取合集里面草稿列表
export function taskPage(data) {
  return request({
    url: 'user/task/page',
    method: 'POST',
    data
  })
}
// 我的 画册列表搜索
export function searchMytask(data) {
  return request({
    url: 'search/my_task',
    method: 'POST',
    data
  })
}
// 我的影展列表搜索
export function searchMygallery(data) {
  return request({
    url: 'search/my_gallery',
    method: 'POST',
    data
  })
}

// 获取合集里面草稿列表
export function moveToCollect(data) {
  return request({
    url: 'user/collect/moveToCollect',
    method: 'POST',
    data
  })
}
// 从合集里面移除
export function moveOutCollect(data) {
  return request({
    url: 'user/collect/moveOutCollect',
    method: 'POST',
    data
  })
}
// 从合集里面删除
export function deleteInCollect(data) {
  return request({
    url: 'user/collect/deleteInCollect',
    method: 'POST',
    data
  })
}
// 删除合集
export function collectDelete(data) {
  return request({
    url: 'user/collect/deleteBatch',
    method: 'DELETE',
    data
  })
}

// 删除画册
export function taskDelete(data) {
  return request({
    url: 'user/task/delete/' + data.id,
    method: 'DELETE',
    data
  })
}
// 画册删除
export function taskdeleteBatch(data) {
  return request({
    url: 'user/task/deleteBatch',
    method: 'DELETE',
    data
  })
}

// 影展搜索
export function searchGallery(data) {
  return request({
    url: 'search/gallery',
    method: 'POST',
    data
  })
}

// 影展推荐
export function galleryRecommend(data) {
  return request({
    url: 'gallery/recommend',
    method: 'POST',
    data
  })
}

// 获取存证下载地址
export function attestDownload(data) {
  return request({
    url: 'user/attest/download?id=' + data.id,
    method: 'POST',
    data
  })
}

// 获取邀请记录列表
export function inviteList(data) {
  return request({
    url: 'user/invite/page',
    method: 'POST',
    data
  })
}
// 获取收益记录列表
export function scoreList(data) {
  return request({
    url: 'wallet/income/logs',
    method: 'POST',
    data
  })
}

// 获取提现记录列表
export function cashList(data) {
  return request({
    url: 'wallet/cash/page',
    method: 'POST',
    data
  })
}

// 取消排队
export function cancelQueue(data) {
  return request({
    url: 'task/cancelQueue/' + data.id,
    method: 'POST',
    data
  })
}


// 图中图
export function pictureinImage(data) {
  return request({
    url: 'user/imagine',
    method: 'POST',
    data
  })
}

// 移出影展
export function galleryDelete(data) {
  return request({
    url: 'user/gallery/delete/' + data.id,
    method: 'DELETE',
    data
  })
}
// 分享查询次数统计
export function taskDo(data) {
  return request({
    url: 'wallet/task/do/' + data.taskType,
    method: 'POST',
    data
  })
}

export function taskUpscale(data) {
  return request({
    url: 'task/upscale',
    method: 'POST',
    data
  })
}

export function taskPrompt(data) {
  return request({
    url: 'task/prompt/rand/' + data.model,
    method: 'POST',
    data
  })
}

// 获取公告
export function notifyPull(data) {
  return request({
    url: 'user/notify/pull',
    method: 'POST',
    data
  })
}
// 用户收益统计
export function walletProfit(data) {
  return request({
    url: 'wallet/profit',
    method: 'POST',
    data
  })
}

// 会员兑换码
export function exchangeCode(data) {
  return request({
    url: 'wallet/exchange_code/use/' + data.code,
    method: 'POST',
    data
  })
}

// 解散合集
export function departBatch(data) {
  return request({
    url: 'user/collect/departBatch',
    method: 'POST',
    data
  })
}
// 发起创意任务
export function creativeDraw(data) {
  return request({
    url: 'task/creative/draw',
    method: 'POST',
    data
  })
}

// 根据手机号判断用户是否注册
export function checkUserRegisterByPhone(data) {
  return request({
    url: 'wallet/checkMobile/' + data,
    method: 'POST',
    data
  })
}

// 获取增值服务列表明细
export function capacityList(data) {
  return request({
    url: 'user/capacity/list',
    method: 'POST',
    data
  })
}
// 作品容量提示
export function capacityTips(data) {
  return request({
    url: 'user/capacity/tips',
    method: 'POST',
    data
  })
}

// 应用 制作任务
export function appletDraw(data) {
  return request({
    url: 'task/applet/draw',
    method: 'POST',
    data
  })
}
// 应用 列表
export function appletList(data) {
  return request({
    url: 'user/applet/list',
    method: 'POST',
    data
  })
}




