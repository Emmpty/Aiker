<template>
  <view class="flex-col justify-start items-start page">

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="登录"
    />

    <view class="flex-col justify-start items-start section">
      <view class="flex-col section_2 space-y-24">
        <view class="flex-col group">
          <view class="self-logo">
            <image
              class="logo"
              src="/static/img/login/logo.png"
            ></image>
          </view>
          <view class="self-center text">埃客 AI</view>

          <view class="flex-col group_2 space-y-25">
            <view class="flex-col">
              <view
                class="flex-col justify-start items-center relative button"
                @click="QuickLogin()"
                v-if="!needRegister"
              ><text class="text_7">手机快捷登录</text>
              </view>
              <view v-else>
                <button
                  class="flex-col justify-start items-center relative button"
                  v-if="status && !needAuthorization"
                  open-type="getPhoneNumber|agreePrivacyAuthorization"
                  @getphonenumber="onGetPhoneNumber"
                >
                  <text class="text_7">手机一键登录</text>
                </button>
                <view
                  v-if="!status || needAuthorization"
                  class="flex-col justify-start items-center relative button"
                  @click="userRegister()"
                ><text class="text_7">手机一键登录</text></view>
              </view>
            </view>

            <view class="flex-col">
              <view
                class="flex-col justify-start items-center relative button1"
                @click="getLogin"
              ><text class="text_7">手机号登录</text></view>
              <!-- <view class="flex-row group_5 space-x-164">
                <text
                  class="font_3"
                  @click="jumpType(3)"
                >手机快速注册</text>
                <text
                  class="font_3"
                  @click="jumpType(4)"
                >忘记密码？</text>
              </view> -->
            </view>

            <view class="flex-row items-center group_3 space-x-8">
              <image
                class="shrink-0 image_3"
                v-if="!status"
                @click="getStatus()"
                src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c6738989b67f001144f935/16739502537460848027.png"
              />
              <image
                class="shrink-0 image_3"
                v-if="status"
                @click="getStatus()"
                src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c6738989b67f001144f935/16739502548831058299.png"
              />
              <view class="group_4">
                <text
                  class="font_2 text_5"
                  @click="getStatus()"
                >我已阅读并同意</text>
                <text
                  class="font_2"
                  @click="jumpType(1)"
                >《用户协议》</text>
                <text class="text_6">、</text>
                <text
                  class="font_2"
                  @click="jumpType(2)"
                >《隐私政策》</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!--  -->
    <view
      class="model"
      v-if="loginstatus"
    >
      <view
        class="model-body"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <view
          class="title share-name"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >温馨提示</view>
        <view
          class="items items-switch"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >
          为了同步其他平台作品数据，微信需绑定手机号
        </view>
        <view class="btns">
          <view
            class="btnsize"
            @click="loginstatus = false"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '#141416' }"
          >取消</view>
          <button
            class="btnsize actice"
            @click="userRegister(2)"
          >登录</button>
        </view>
      </view>
    </view>

    <!-- 小程序服务协议 -->
    <policy
      v-if="showPrivacy"
      @disagreeAgreement="disagreeAgreement()"
      @agreementStatus="agreementStatus()"
    ></policy>
  </view>
</template>

<script>
import policy from "./components/policy/policy.vue";
import { getUserInfo } from "@/static/api/user.js";
import { wxmAuth, wxmRegister } from "@/static/api/login.js";
export default {
  components: {
    policy,
  },
  data() {
    return {
      formData: {
        mobile: '',
        password: ''
      },
      status: false,
      needAuthorization: false,
      showPrivacy: false,//是否显示隐私协议
      loginstatus: false,
      needRegister: '',//新用户一键登录
    };
  },

  onLoad(res) {
    if (res.needRegister) { // 新用户一键登录
      this.needRegister = res.needRegister;
    }

    //#ifdef MP-WEIXIN
    wx.getPrivacySetting({
      success: res => {
        if (res.needAuthorization) {
          console.warn('----------需要用户统一小程序授权');
          this.needAuthorization = true;
        } else {
          this.needAuthorization = false
        }
      },
      fail: () => { },
      complete: () => { }
    })
    //#endif 
  },

  methods: {
    checkPrivacyAuth() {


    },
    // 微信快捷登录
    QuickLogin() {
      if (!this.status) {
        uni.showModal({
          title: '温馨提示',
          content: '请先阅读并同意《用户协议》和《隐私协议》',
          showCancel: false,
          confirmText: "同意继续",
          success: (res) => {
            this.status = true
            // 是否需要弹出隐私协议
            if (this.needAuthorization) {
              this.showPrivacy = true
            }
          }
        })
        return;
      } else {
        if (this.needAuthorization) {
          this.showPrivacy = true
          return
        }
      }
      try {
        uni.showLoading({
          title: '登录中'
        })
        uni.login({
          provider: 'weixin',
          onlyAuthorize: true,
          success: (res) => {
            wxmAuth({ code: res.code },).then((res) => {
              if (res.code == 200) {
                let token = res.result.token;
                uni.setStorageSync("token", res.result.token);

                if (res.result.session) {
                  console.error(res.result.session);
                  uni.setStorageSync('session', res.result.session);
                }

                getUserInfo({ token: token }).then((res) => {  // 获取用户最新信息
                  if (res.code == 200) {
                    uni.setStorageSync('userInfo', res.result.user);
                    // 登录成功清除缓存
                    uni.removeStorageSync('loginStatus');
                    uni.removeStorageSync('loginType');//清除账号登录类型

                    // 用户画同款记录id，直接跳转到创作页面
                    if (uni.getStorageSync('goodsid')) {
                      uni.redirectTo({
                        url: '/phome/generate'
                      })
                      return
                    }
                    setTimeout(function () {
                      uni.reLaunch({
                        url: '/pages/tabBar/gallery'
                      });
                    }, 600)
                  }
                }).catch((err) => {
                  console.error(err);
                }).finally(() => {
                  uni.hideLoading();
                })
              }
            }).finally(() => {
              uni.hideLoading();
            })
          },
          fail: (error) => {
            uni.hideLoading();
            console.error(error);
          }
        })
      } catch (error) {
        uni.hideLoading();
        console.error(error);
      }

    },
    disagreeAgreement() {
      this.showPrivacy = false
    },
    agreementStatus() {
      this.needAuthorization = false
      this.showPrivacy = false
    },
    // 手机一键登录
    userRegister(e) {
      if (!this.status) {
        uni.showModal({
          title: '温馨提示',
          content: '请先阅读并同意《用户协议》和《隐私协议》',
          showCancel: false,
          confirmText: "同意继续",
          success: (res) => {
            this.status = true
            // 是否需要弹出隐私协议
            if (this.needAuthorization) {
              this.showPrivacy = true
            }
          }
        })
        return;
      } else {
        if (this.needAuthorization) {
          this.showPrivacy = true
          return
        }
      }

      // if (this.status) {
      //   this.loginstatus = true;
      // }
    },

    // 授权手机号码注册登录
    onGetPhoneNumber(e) {
      if (e.detail.errMsg != "getPhoneNumber:ok") {
        return;//用户取消授权
      }
      this.loginstatus = false;
      let data = {
        code: e.detail.code,
        inviter: uni.getStorageSync('inviter') || '',
        session: uni.getStorageSync('session'),
      }
      uni.showLoading({
        title: '登录中'
      })
      wxmRegister(data).then((res) => {
        uni.hideLoading()
        if (res.code == 200) {
          uni.setStorageSync('token', res.result.token);
          getUserInfo({ token: res.result.token }).then((res) => {  // 获取用户最新信息
            if (res.code == 200) {
              uni.setStorageSync('userInfo', res.result.user);
              // 登录成功清除缓存
              uni.removeStorageSync('loginStatus');
              uni.removeStorageSync('loginType');//清除账号登录类型
              uni.removeStorageSync('session');

              // 用户画同款记录id，直接跳转到创作页面
              if (uni.getStorageSync('goodsid')) {
                uni.redirectTo({
                  url: '/phome/generate'
                })
                return
              }

              setTimeout(function () {
                uni.reLaunch({
                  url: "/pages/tabBar/gallery",
                });
              }, 600)
            }
          }).catch((err) => {
            uni.hideLoading()
          })
        }
      }).catch((err) => {
        uni.hideLoading()
      })
    },

    // 手机密码登录
    getLogin() {
      uni.navigateTo({
        url: '/plogin/login'
      })
    },

    getStatus() {
      this.status = !this.status
    },

    // 注册、用户、隐私协议、忘记密码 跳转
    jumpType(type) {
      let typeObj = {
        '1': '/plogin/user_agree',
        '2': '/plogin/privacy_agree',
        '3': '/plogin/register?type=1',
        '4': '/plogin/forget',
      }
      uni.navigateTo({
        url: typeObj[type],
      });
    },

  },
};
</script>

<style scoped lang="less">
.page {
  background-color: #141416;
  width: 100%;

  .section {
    background-image: url("https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c6738989b67f001144f935/16739502537349856459.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 100%;
    height: 100vh;

    .self-logo {
      text-align: center;
      margin-bottom: 30rpx;
    }

    .self-logo image {
      width: 124rpx;
      height: 124rpx;
      border-radius: 50%;
    }

    .section_2 {
      height: 100%;
      width: 100%;
      background-color: #14141680;

      .image {
        width: 48rpx;
        height: 48rpx;
      }

      .group {
        padding: 0 44rpx;
        position: absolute;
        top: 38%;
        left: 50%;
        transform: translate(-50%, -50%);

        .text {
          color: #ffffff;
          font-size: 48rpx;
          font-family: PingFangSC-Medium;
          line-height: 45rpx;
        }

        .list {
          margin-top: 72rpx;

          .list-item {
            margin-right: 4rpx;
            padding: 32rpx;
            background-color: #141416;
            border-radius: 56rpx;

            .font_1 {
              font-size: 32rpx;
              font-family: PingFangSC-Regular;
              line-height: 30rpx;
              color: #ffffff99;
            }

            .text_2 {
              margin-left: 12rpx;
              color: #ffffff;
              line-height: 23rpx;
            }

            .image_2 {
              margin-left: 12rpx;
              width: 18rpx;
              height: 12rpx;
            }

            .text_3 {
              width: 60%;
              margin-left: 26rpx;
              line-height: 29rpx;
            }
          }
        }

        .space-y-16 {

          &>view:not(:first-child),
          &>text:not(:first-child),
          &>image:not(:first-child) {
            margin-top: 32rpx;
          }
        }

        .group_2 {
          margin-top: 48rpx;

          .group_3 {
            padding-left: 42rpx;
            padding-right: 32rpx;

            .image_3 {
              width: 32rpx;
              height: 32rpx;
            }

            .group_4 {
              line-height: 22rpx;
              height: 22rpx;

              .font_2 {
                font-size: 24rpx;
                font-family: PingFangSC-Regular;
                line-height: 22rpx;
                color: #1affe8;
              }

              .text_5 {
                color: #ffffff;
              }

              .text_6 {
                color: #ffffff;
                font-size: 24rpx;
                font-family: PingFangSC-Regular;
                line-height: 7rpx;
              }
            }
          }

          .space-x-8 {

            &>view:not(:first-child),
            &>text:not(:first-child),
            &>image:not(:first-child) {
              margin-left: 16rpx;
            }
          }

          .button {
            margin-right: 4rpx;
            padding: 32rpx 0 !important;
            background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
            border-radius: 48rpx;
            box-shadow: 0px 16rpx 32rpx #00dbc533;
            width: 610rpx;

            .text_7 {
              color: #000000;
              font-size: 36rpx;
              font-family: PingFangSC-Medium;
              line-height: 33rpx;
            }
          }

          .button1 {
            margin-right: 4rpx;
            padding: 32rpx 0;
            // background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
            border-radius: 48rpx;
            box-shadow: 0px 16rpx 32rpx #00dbc533;
            width: 610rpx;
            color: white;
            border: 1px solid #61ffff;
            font-size: 36rpx;
            font-family: PingFangSC-Medium;
            line-height: 33rpx;
          }

          .group_5 {
            padding-top: 40rpx;

            .font_3 {
              font-size: 28rpx;
              font-family: PingFangSC;
              line-height: 26rpx;
              color: #1affe8;
            }
          }

          .space-x-164 {

            &>view:not(:first-child),
            &>text:not(:first-child),
            &>image:not(:first-child) {
              margin-left: 328rpx;
            }
          }
        }

        .space-y-25 {

          &>view:not(:first-child),
          &>text:not(:first-child),
          &>image:not(:first-child) {
            margin-top: 50rpx;
          }
        }

        .text_8 {
          margin-top: 500rpx;
          color: #ffffff;
          font-size: 24rpx;
          font-family: PingFang SC;
          line-height: 22rpx;
        }

        .group_6 {
          margin-top: 80rpx;

          .image_4 {
            width: 80rpx;
            height: 80rpx;
          }

          .image_5 {
            margin-left: 202rpx;
          }
        }

        .space-x-24 {

          &>view:not(:first-child),
          &>text:not(:first-child),
          &>image:not(:first-child) {
            margin-left: 48rpx;
          }
        }
      }
    }

    .space-y-24 {

      &>view:not(:first-child),
      &>text:not(:first-child),
      &>image:not(:first-child) {
        margin-top: 48rpx;
      }
    }
  }

  .model {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
  }

  .model-body {
    width: 300px;
    height: 205px;
    background: #2E2E33;
    border-radius: 16px 16px 16px 16px;
    color: white;
    text-align: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .model-body .title {
    line-height: 100rpx;
    font-size: 16px;
  }

  .model-body .share-name {
    line-height: 40rpx;
    font-size: 16px;
    width: 388rpx;
    margin: 60rpx auto 10rpx;
  }

  .model-body .items {
    display: flex;
    text-align: center;
    padding: 20rpx 40rpx;
    font-size: 30rpx;
  }

  .model-body .items text {
    margin-left: 20rpx;
  }

  .model-body .btns {
    display: flex;
    justify-content: space-around;
    margin-top: 20rpx;
  }

  .model-body .btns .btnsize {
    width: 126px;
    height: 48px;
    line-height: 48px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 24px 24px 24px 24px;
    opacity: 1;
    margin: 0;
    border: 1px solid rgba(255, 255, 255, 0.4);
  }

  .model-body .btns .actice {
    background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
    color: #141416;
  }
}
</style>