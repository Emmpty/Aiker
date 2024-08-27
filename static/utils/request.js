import Vue from 'vue'

function request(obj) {
  const baseURL = Vue.prototype.$baseURL + "/" //测试服
  return new Promise((resolve, reject) => {
    let header = {
      'content-type': obj.contentType || 'application/json;charset=UTF-8',
      'Authorization': obj.token || uni.getStorageSync('token'),
      'Accept-Language': 'zh'
    };
    if (obj.data && obj.data.Bearer && obj.data.Bearer == 'Bearer') {
      header.Authorization = 'Bearer ' + uni.getStorageSync('token');
    }
    uni.request({
      url: baseURL + obj.url,
      data: obj.data || {},
      method: obj.method || "GET",
      header: header,
      success: ((res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
          if (res.data.code == 200) { return; }
          if (res.data.code == 400) {
            uni.showToast({
              icon: 'none',
              title: res.data.message,
              duration: 4000
            })
          } else if (res.data.code == 404) {
            // 过滤掉用户使用手机号与微信号没有关联后的提示
            if (!res.data.result) {
              uni.showToast({
                title: res.data.message, icon: 'none', duration: 3500
              })
              return;
            }
            if (res.data.result.session) {
              return
            } else {
              uni.showToast({
                title: res.data.message, icon: 'none', duration: 3500
              })
            }
          } else if (res.data.code == 401) {
            uni.removeStorageSync('userInfo'); // 清除用户信息
            uni.removeStorageSync('token'); //清除用户token
            uni.removeStorageSync('loginType'); //清除用户账号登录类型

            // uni.removeStorageSync('session');    // 清除session 

          } else if (res.data.code == 666) {
          } else {
            uni.showModal({
              title: '温馨提示',
              content: res.data.message,
              confirmText: "知道了",
              showCancel: false,
              success: function (res) {

              }
            })
          }
        } else {
          //提示失败
          uni.showToast({ icon: 'none', title: "网络异常！" })
          reject(res)
        }
      }),
      fail: ((err) => {
        reject(err)
      })
    })
  })
}
export default request