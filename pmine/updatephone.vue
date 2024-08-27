<template>
  <view
    class="flex-col "
    :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="更换手机号"
    />

    <view
      class="page-content"
      v-if="type == 1"
    >
      <view
        class="name"
        :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', }"
      >输入短信验证码</view>
      <view
        class="tips"
        :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', }"
      >请先获取您手机 <text>{{ userInfo.mobile }}</text>验证码</view>
      <view class="input">
        <input
          v-model="code"
          type="text"
          placeholder="请输入原手机验证码"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', }"
        >
        <button
          class="codetext"
          @click="countDown(60)"
          :disabled="second == 0 ? false : true"
        >{{ second == "0" ? '获取验证码' : second + '秒重新获取' }}</button>
      </view>
      <button
        class="button"
        @click="nextStep"
      >下一步</button>
    </view>

    <view
      class="page-content"
      v-if="type == 2"
    >
      <view
        class="name"
        :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', }"
      >输入短信验证码</view>
      <view
        class="tips"
        :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', }"
      >已向您的手机 <text>{{ userInfo.mobile }}</text> 发送验证码</view>
      <view class="input">
        <input
          v-model="mobile"
          type="text"
          placeholder="请输入新手机号码"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', }"
        >
        <button
          class="codetext"
          @click="countDowntwo()"
          :disabled="seconds == 0 ? false : true"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', }"
        > {{ seconds == "0" ? '获取验证码' : seconds + '秒重新获取' }}</button>
      </view>
      <input
        class="input"
        v-model="codeVs"
        type="text"
        placeholder="请输入验证码"
        :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', }"
      >
      <button
        class="button"
        @click="replaceConfirm"
      >确认</button>
    </view>

  </view>
</template>

<script>
import { getUserInfo, sendVerifyCode, checkVerifyCode, bindPhone, sendBindCode } from '@/static/api/user.js'

export default {
  components: {},
  data() {
    return {
      userInfo: {},
      code: '',
      codeVs: '',
      mobile: '',
      seconds: '0',
      second: 0,
      type: 1,
    };
  },
  onLoad(res) {
    let userInfo = uni.getStorageSync('userInfo');
    userInfo.mobile = this.formatTel(userInfo.mobile || '')
    this.userInfo = userInfo
  },
  methods: {
    // 发送验证码
    sendCodeclick(type) {
      if (type == 1) {
        sendVerifyCode().then(res => {
          if (res.code == 200) {
            uni.showToast({
              title: '验证码发送成功，请注意查收',
              icon: 'none',
              duration: 4000
            })
          }
        })
      } else {
        if (!this.mobile || this.mobile.length != 11) {
          uni.showToast({
            title: '请输入11位数的手机号码',
            icon: 'none',
            duration: 4000
          })
          return
        }
        sendBindCode({ mobile: this.mobile }).then(res => {
          if (res.code == 200) {
            uni.showToast({
              title: '验证码发送成功，请注意查收',
              icon: 'none',
              duration: 4000
            })
          }
        })
      }
    },

    // 倒计时
    countDown() {
      var nsecond = 60;
      var that = this;
      var appCount = setInterval(function () {
        nsecond -= 1;
        that.second = nsecond;
        if (nsecond < 1) {
          clearInterval(appCount);
          nsecond = 60;
        }
      }, 1000);
      that.sendCodeclick(1)
    },

    countDowntwo() {
      var seconds = 60;
      var that = this;
      var appCount = setInterval(function () {
        seconds -= 1;
        that.second = seconds;
        if (seconds < 1) {
          clearInterval(appCount);
          seconds = 60;
        }
      }, 1000);
      that.sendCodeclick(2)
    },

    // 下一步
    nextStep() {
      let that = this;
      if (!that.code) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      checkVerifyCode({ code: that.code }).then(res => {
        if (res.code == 200) {
          that.type = 2;
        }
      })
    },

    // 确认绑定  
    replaceConfirm() {
      let that = this;
      let data = {
        mobile: that.mobile,
        bindCode: that.codeVs,
        verifyCode: that.code,
      }
      bindPhone(data).then(res => {
        if (res.code == 200) {
          uni.showToast({
            title: '操作成功！',
            icon: 'none',
            duration: 2000
          })
          getUserInfo({}).then((res) => {
            if (res.code == 200) {
              // 存储用户信息
              uni.setStorageSync('userInfo', res.result.user);
              uni.navigateBack();
            }
          });
        }
      })
    },

    formatTel(tel) {
      tel = "" + tel;
      let newTel = tel.substr(0, 4) + "****" + tel.substr(8, 10)
      return newTel;
    }
  },

  // #ifdef MP
  onShareAppMessage() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    };
  },
  // #endif
};
</script>

<style scoped lang="scss">
.page-content {
  height: 100vh;
  padding: 40rpx;
}

.name {
  font-size: 24px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  line-height: 30px;
  margin-top: 60rpx;
}

.tips {
  height: 17px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 30px;
}

.input {
  height: 40px;
  line-height: 40px;
  padding-left: 20rpx;
  margin: 50rpx 0 20rpx;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
}

.codetext {
  position: absolute;
  top: 0rpx;
  right: 0rpx;
  min-width: 180rpx;
  z-index: 999;
  height: 30px;
  font-size: 25rpx;
  line-height: 30px;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
}

.code {
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 30px;
  margin-bottom: 50rpx;
}

.button {
  margin-top: 100rpx;
  font-size: 30rpx;
  height: 48px;
  width: 305px;
  line-height: 48px;
  text-align: center;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  box-shadow: 0px 8px 16px 1px rgba(0, 219, 197, 0.2);
  border-radius: 24px 24px 24px 24px;
  opacity: 1;
}
</style>