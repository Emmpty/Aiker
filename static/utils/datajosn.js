import Vue from 'vue'
import utils from '@/static/utils/utils';

function settings(doSuccess) {
  let jsonUrl = 'https://cdn.lingchuang.art/sdv/settings.json?time=' + utils.getTime()
  if (Vue.prototype.$baseURL == "https://app.onefold.cn") {
    jsonUrl = 'https://cdn.lingchuang.art/sdv/settings.json'//    //测试环境
  }

  uni.request({
    url: jsonUrl,
    method: 'GET',
    success: ({ data }) => {
      doSuccess(data)
    },
    fail: (err) => { }
  });
}


// 应用获取数据
function applets(doSuccess) {
  let jsonUrl = 'https://cdn.drawai.cn/public/applets.json' //正式环境
  if (Vue.prototype.$baseURL == "https://app.onefold.cn") {
    jsonUrl = 'https://cdn.drawai.cn/public/applets_test.json'//    //测试环境
  }
  uni.request({
    url: jsonUrl,
    method: 'GET',
    success: ({ data }) => {
      doSuccess(data)
    },
    fail: (err) => { }
  });
}


export default {
  settings,
  applets
}