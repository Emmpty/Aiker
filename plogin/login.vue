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
          <text class="self-center text">手机密码登录</text>
          <view class="flex-col list space-y-16">
            <view class="flex-row items-center list-item">
              <image
                class="image"
                src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c6738989b67f001144f935/16739502537446750491.png"
              />
              <text class="font_1 text_2">手机</text>
              <input
                class="font_1 text_3"
                v-model="formData.mobile"
                type="text"
                placeholder="手机号码"
                maxlength="11"
              />
            </view>
          </view>
          <view class="flex-col list space-y-16">
            <view class="flex-row items-center list-item">
              <image
                class="image"
                src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c6738989b67f001144f935/16739502537446750491.png"
              />
              <text class="font_1 text_2">密码</text>
              <input
                class="font_1 text_3"
                v-model="formData.password"
                type="text"
                placeholder="密码"
              />
            </view>
          </view>

          <view class="flex-col group_2 space-y-25">
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
            <view class="flex-col">
              <view
                class="flex-col justify-start items-center relative button"
                @click="getSignIn()"
              ><text class="text_7">登录</text></view>
              <view class="flex-row group_5 space-x-164">
                <text
                  class="font_3"
                  @click="jumpType(3)"
                >手机快速注册</text>
                <text
                  class="font_3"
                  @click="jumpType(4)"
                >忘记密码？</text>
              </view>
            </view>
          </view>

        </view>
      </view>
    </view>

    <!--服务协议  -->

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
import { login } from "@/static/api/login.js";

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
    };
  },

  onLoad() {
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
    disagreeAgreement() {
      this.showPrivacy = false
    },
    agreementStatus() {
      this.needAuthorization = false
      this.showPrivacy = false
    },
    getSignIn() {
      let data = {
        mobile: this.formData.mobile,
        password: this.formData.password,
        session: uni.getStorageSync('session') || '',
      };
      if (!data.mobile || !data.password) {
        uni.showToast({
          title: '手机号码和密码不能为空',
          icon: 'none',
          duration: 2000
        })
        return;
      } else if (data.mobile.length < 11) {
        uni.showToast({
          title: '请输入11位的手机号码!',
          icon: 'none',
          duration: 2000
        })
        return;
      }
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

      uni.showLoading({
        title: '登录中'
      })
      login(data).then((res) => {
        if (res.code == 200) {
          uni.setStorageSync("token", res.result.token);
          getUserInfo({}).then((res) => {
            if (res.code == 200) {
              uni.setStorageSync('userInfo', res.result.user);
              uni.setStorageSync("loginType", 2);
              // 当前用户的邀请码
              let my_inviter = res.result.user.inviterCode;
              getApp().globalData.my_inviter = my_inviter;
              getApp().globalData.sharePath = `/pages/tabBar/gallery?inviter=${my_inviter}`;
              uni.setStorageSync('myInviter', my_inviter); // 存储用户邀请码
              uni.setStorageSync("loginStatus", 2);
              uni.removeStorageSync('session');
              // 登录成功清除缓存
              // uni.removeStorageSync('loginStatus');
              setTimeout(function () {
                uni.hideLoading()
                uni.reLaunch({
                  url: '/pages/tabBar/gallery'
                });
              }, 1000)
            } else {
              uni.hideLoading()
            }
          });
        } else {
          uni.hideLoading()
        }
      });
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
        top: 40%;
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
              line-height: 50rpx;
              height: 50rpx;
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
            padding: 32rpx 0;
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
}
</style>