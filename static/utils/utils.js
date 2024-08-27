import { attestAdd } from '../api/index.js'

const appid = 'wxb365bb4eb4350a44'

// 手机号码加
function formatTel(tel) {
  tel = "" + tel;
  let newTel = tel.substr(0, 3) + "****" + tel.substr(7)
  return newTel;
}

// 下载图片
function downLoadImage(url) {
  uni.showLoading({ title: '' });
  uni.downloadFile({
    url: url,
    success: (res) => {
      uni.hideLoading();
      if (res.statusCode === 200) {
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            uni.showToast({
              title: "保存成功！",
            });
          },
          fail: () => {
            uni.showModal({
              content: '检测到您没有打开保存图片权限，是否去设置打开？',
              success: (res) => {
                if (res.confirm) {
                  uni.openSetting({
                    success: (res) => {
                      if (res.authSetting['scope.writephotosAlbum']) {

                      }
                    }
                  })
                }
              },
            })
          }
        });
      }
    },
    fail: () => {
      uni.showModel({
        content: '检测到您没有打开保存图片权限，是否取设置打开？',
        success: (res) => {
          if (res.confirm) {
            uni.openSetting({
              success: (res) => {
                if (res.authSetting['scope.writephotosAlbum']) {
                  uni.showToast({ title: "保存图片权限已打开", icon: "none" });
                }
              }
            })
          }
        },
      })
    }
  });
}

// 去除空格
function clearSpaces(ele) {
  if (typeof ele === 'string') {
    return ele.split(/[\t\r\f\n\s]*/g).join('');
  }
}

//把base64转换成图片
function getBase64ImageUrl(data) {
  const arrayBuffer = uni.base64ToArrayBuffer(data);
  const blob = new Blob([arrayBuffer], { type: 'image/png' });
  const imgUrl = URL.createObjectURL(blob);
  return imgUrl;
}

function getTime() {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
  var hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
  var minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  var second = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

function formatTime(dateTimeStr) {
  var date = new Date(dateTimeStr)
  let year = date.getFullYear();
  let month = date.getMonth() + 1; // 月份是从0开始的
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  // 保证每个部分至少有两位数字
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 联系客服
function contactCustomer() {
  let customerServiceUrl = 'https://work.weixin.qq.com/kfid/kfc7b5c28ab1f96cfb2'
  // #ifdef MP 
  wx.openCustomerServiceChat({
    corpId: 'ww09bf32f49f8297b2',
    extInfo: { url: customerServiceUrl },
    success(res) {
      console.log('openCustomerServiceChat success', res)
    },
    fail(err) {
      console.error('openCustomerServiceChat error', err)
    }
  })
  // #endif

  // #ifdef H5
  window.open(customerServiceUrl, '_blank');
  // #endif

  // #ifdef APP-PLUS
  let wechat = null
  plus.share.getServices(res => {
    wechat = res.find(i => i.id === 'weixin')
    if (wechat) {
      wechat.openCustomerServiceChat({
        corpid: 'ww09bf32f49f8297b2',//企业ID
        url: customerServiceUrl,//客服地址
      }, (src) => {
        console.log('openCustomerServiceChat success', src)
      }, (err) => {
        console.error('openCustomerServiceChat error', err)
      })
    } else {
      uni.showToast({
        title: '当前环境不支持微信操作', icon: "error"
      });
    }
  });
  // #endif
}

/**
* 画板输入文字自动识别尺寸、算法
* @param {String} str 需要格式化的字符串 
* @param {String} keyword 替换成哪个字母 ar | v
* @param {String} keywordCapital 通配字母的大小写 ([aA][rR]) ([vV])
* "——" 替换成 "--"
* 中间可带可不带空格,前后无限空格的
*/
function regFormat(str, keyword = 'ar', keywordCapital = '([aA][rR])') {
  let regex = new RegExp(`(^|\\s*)(-+|—+)${keywordCapital}(\\s*|$)`, "g");
  const result = str.replace(regex, (match) => {
    // console.log('>>>>>>>>match', match);
    return ` --${keyword} `
  });
  // console.log('>>>>>>>>result', result);
  return result
}

// 复制文案
function copyText(text) {
  console.log('>>>>>>>>>', text);
  // #ifdef H5
  copyTextH5(text)
  // #endif  
  // #ifndef H5
  uni.setClipboardData({
    data: text + '',
    success: () => {
      uni.showToast({ title: "复制成功", icon: 'none', duration: 4000 })
    }, fail: (err) => {
      console.error(err);
    }
  });
  // #endif  
}
function copyTextH5(text) {
  const textString = text.toString();
  let input = document.querySelector('#copy-input');
  if (!input) {
    input = document.createElement('input');
    input.id = "copy-input";
    input.readOnly = "readOnly";        // 防止ios聚焦触发键盘事件
    input.style.position = "absolute";
    input.style.left = "-1000px";
    input.style.zIndex = "-1000";
    document.body.appendChild(input)
  }
  input.value = textString;
  // ios必须先选中文字且不支持 input.select();
  selectText(input, 0, textString.length);
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    Toast('复制成功');
  } else {
    console.log('不兼容');
  }
  input.blur();
  // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
  // 选择文本。createTextRange(setSelectionRange)是input方法
  function selectText(textbox, startIndex, stopIndex) {
    if (textbox.createTextRange) {//ie
      const range = textbox.createTextRange();
      range.collapse(true);
      range.moveStart('character', startIndex);//起始光标
      range.moveEnd('character', stopIndex - startIndex);//结束光标
      range.select();//不兼容苹果
    } else {//firefox/chrome
      textbox.setSelectionRange(startIndex, stopIndex);
      textbox.focus();
    }
  }
}

function checkImage(path) {
  return new Promise(async (resolve, reject) => {
    uni.getImageInfo({
      src: path,
      success: (image) => {
        console.log(image.width);
        console.log(image.height);
        if (image.width * image.height <= 500000) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail: (error) => {
        console.error(error);
        reject(false)
      }
    });
  })
}

async function upLoadImage(filePath) {
  return new Promise(async (resolve, reject) => {
    try {
      // 获取上传图片所需参数、上传地址
      const { result } = await getUploadUrl()
      let formData = result.post.formData
      let url = result.post.url
      let attachment = result.id

      uni.uploadFile({
        url: url,
        filePath: filePath,
        name: 'file',
        method: 'POST',
        formData: formData,
        success: async (res) => {
          let Param = { attachment: attachment }
          resolve(Param)
        },
        fail: (err) => {
          console.log('uploadFile error', err,)
          reject(err)
        },
      });
    } catch (error) {
      reject(error)
      console.error(error);
    }
  })
}

export default {
  appid,
  formatTel,
  downLoadImage,
  clearSpaces,
  getTime,
  formatTime,
  getBase64ImageUrl,
  contactCustomer,
  regFormat,
  copyText,
  checkImage,
  upLoadImage,
}