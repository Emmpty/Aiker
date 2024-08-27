<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      :title="pageTitle"
    />

    <!-- 注册新用户 -->
    <view
      class="flex-col flex-auto group_3 space-y-40"
      v-if="type == '1'"
    >
      <view class="flex-col space-y-16">
        <view
          class="flex-row items-center section_3 space-x-16"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#282828', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >
          <image
            class="image_7"
            :src="cueTheme == 'day-theme' ? '../static/img/login/phone.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846348018144879.png'"
          />
          <input
            v-model="formData.mobile"
            class="font_1 text_3"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            type="text"
            placeholder="手机号码"
            maxlength="11"
          />
        </view>

        <view
          class="flex-row justify-between items-center section_3"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#282828', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >
          <view class="flex-row items-center space-x-16">
            <image
              class="shrink-0 image_7"
              :src="cueTheme == 'day-theme' ? '../static/img/login/code.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846348847661064.png'"
            />
            <input
              v-model="formData.code"
              class="font_1 text_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              type="text"
              placeholder="验证码"
            />
          </view>
          <text
            class="text_5 text_55"
            @click="invitation"
            v-if="second == 0"
          >{{ second == "0" ? '获取验证码' : second + '秒后重试' }}</text>
          <text
            class="text_5 text_55"
            v-else
          >{{ second == "0" ? '获取验证码' : second + '秒后重试' }}</text>
        </view>

        <view
          class="flex-row items-center section_3 space-x-16"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#282828', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >
          <image
            class="image_7"
            :src="cueTheme == 'day-theme' ? '../static/img/login/lock.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846349020663011.png'"
          />
          <input
            v-model="formData.password"
            class="font_1 text_3"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            type="text"
            placeholder="密码"
          />
        </view>

        <view
          class="flex-row items-center section_3 space-x-16"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#282828', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >
          <image
            class="image_7"
            :src="cueTheme == 'day-theme' ? '../static/img/login/lock.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846349020663011.png'"
          />
          <input
            v-model="formData.password2"
            class="font_1 text_3"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            type="text"
            placeholder="再次确认密码"
          />
        </view>

        <view
          class="flex-row justify-between items-center section_3"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#282828', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >
          <view class="flex-row items-center space-x-16">
            <image
              class="shrink-0 image_7"
              :src="cueTheme == 'day-theme' ? '../static/img/login/lock.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846348847661064.png'"
            />
            <input
              v-model="formData.inviter"
              class="font_1 text_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              type="text"
              placeholder="邀请码（选填）"
              v-if="codeInviter"
              disabled
            />
            <input
              v-model="formData.inviter"
              class="font_1 text_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              type="text"
              placeholder="邀请码（选填）"
              v-else
            />
          </view>
        </view>
      </view>

      <view style=" position: relative;">
        <image
          class="shrink-0 image_3"
          v-if="!status"
          @click="consentAgreement"
          src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c6738989b67f001144f935/16739502537460848027.png"
        />
        <image
          class="shrink-0 image_3"
          v-if="status"
          @click="consentAgreement"
          src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c6738989b67f001144f935/16739502548831058299.png"
        />
        <view
          class="group_4"
          style="color: white;"
        >
          <text
            class="font_2 "
            @click="consentAgreement"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >我已阅读并同意</text>
          <text
            class="font_2 text_5"
            @click="jumpType(1)"
          >《用户协议》</text>
          <text
            class="text_6"
            style="color: white;"
          >、</text>
          <text
            class="font_2 text_5"
            @click="jumpType(2)"
          >《隐私政策》</text>
        </view>
      </view>

      <view
        class="flex-col justify-start items-center button"
        @click="getRegister"
      ><text class="text_6">注册</text></view>
    </view>


    <!-- <button v-if="type ==2" class="relative button" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">一键绑定手机号</button> -->

    <!-- 2:绑定手机号码   -->
    <view
      class="flex-col flex-auto group_3 space-y-40"
      v-if="type == 2"
    >
      <view class="flex-col space-y-16">
        <view class="flex-row items-center section_3 space-x-16">
          <image
            class="image_7"
            src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846348018144879.png"
          />
          <input
            v-model="formData.mobile"
            class="font_1 text_3"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            type="text"
            placeholder="手机号码"
            maxlength="11"
          />
        </view>
        <view class="flex-row justify-between items-center section_3">
          <view class="flex-row items-center space-x-16">
            <image
              class="shrink-0 image_7"
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846348847661064.png"
            />
            <input
              v-model="formData.code"
              class="font_1 text_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              type="text"
              placeholder="验证码"
            />
          </view>
          <text
            class="text_5 text_55"
            @click="invitation"
            v-if="second == 0"
          >{{ second == "0" ? '获取验证码' : second + '秒后重试' }}</text>
          <text
            class="text_5 text_55"
            v-else
          >{{ second == "0" ? '获取验证码' : second + '秒后重试' }}</text>
        </view>
      </view>
      <view style=" position: relative;">
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
        <view
          class="group_4"
          style="color: white;"
        >
          <text
            class="font_2 "
            @click="getStatus()"
          >我已阅读并同意</text>
          <text
            class="font_2 text_5"
            @click="jumpType(1)"
          >《用户协议》</text>
          <text
            class="text_6"
            style="color: white;"
          >、</text>
          <text
            class="font_2 text_5"
            @click="jumpType(2)"
          >《隐私政策》</text>
        </view>
      </view>
      <view
        class="flex-col justify-start items-center button"
        @click="getuserRegister"
      >绑定手机号</view>
    </view>

    <!--3:以及小程序一键注册 -->
    <view
      class="flex-col flex-auto group_3 space-y-40"
      v-if="type == 3"
    >
      <view class="flex-col space-y-16">
        <view
          class="flex-row items-center section_3 space-x-16"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#282828', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >
          <image
            class="image_7"
            :src="cueTheme == 'day-theme' ? '../static/img/login/lock.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846348018144879.png'"
          />
          <input
            v-model="formData.mobile"
            class="font_1 text_3"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            type="text"
            placeholder="手机号码"
            maxlength="11"
          />
        </view>
        <view
          class="flex-row justify-between items-center section_3"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#282828', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >
          <view class="flex-row items-center space-x-16">
            <image
              class="shrink-0 image_7"
              :src="cueTheme == 'day-theme' ? '../static/img/login/lock.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846348847661064.png'"
            />
            <input
              v-model="formData.code"
              class="font_1 text_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              type="text"
              placeholder="验证码"
            />
          </view>
          <text
            class="text_5 text_55"
            @click="invitation"
            v-if="second == 0"
          >{{ second == "0" ? '获取验证码' : second + '秒后重试' }}</text>
          <text
            class="text_5 text_55"
            v-else
          >{{ second == "0" ? '获取验证码' : second + '秒后重试' }}</text>
        </view>
      </view>
      <view style=" position: relative;">
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
        <view
          class="group_4"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >
          <text
            class="font_2 "
            @click="getStatus()"
          >我已阅读并同意</text>
          <text
            class="font_2 text_5"
            @click="jumpType(1)"
          >《用户协议》</text>
          <text
            class="text_6"
            style="color: white;"
          >、</text>
          <text
            class="font_2 text_5"
            @click="jumpType(2)"
          >《隐私政策》</text>
        </view>
      </view>
      <view
        class="flex-col justify-start items-center button"
        @click="getuserRegister"
        v-if="type == 3"
      >注册</view>
    </view>



    <!-- 4:设置登录密码-->
    <view
      class="flex-col flex-auto group_3 space-y-40"
      v-if="type == 4"
    >
      <view class="flex-col space-y-16">

        <view
          class="flex-row items-center section_3 space-x-16"
          :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
        >
          <image
            class="image_7"
            :src="cueTheme == 'day-theme' ? '../static/img/login/lock.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846349020663011.png'"
          />
          <input
            v-model="formData.password"
            class="font_1 text_3"
            type="text"
            placeholder="密码"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000000' : '#ffffff' }"
          />
        </view>

        <view
          class="flex-row items-center section_3 space-x-16"
          :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
        >
          <image
            class="image_7"
            :src="cueTheme == 'day-theme' ? '../static/img/login/lock.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846349020663011.png'"
          />
          <input
            v-model="formData.passwordTap"
            class="font_1 text_3"
            type="text"
            placeholder="再次确认密码"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000000' : '#ffffff' }"
          />
        </view>
      </view>
      <view
        class="flex-col justify-start items-center button"
        @click="loginpassword()"
      >确认</view>
    </view>

  </view>
</template>

<script>
import { appbindPhone, wxmReg, sendBindCode, wxmBindPhoner } from '@/static/api/index.js'
import { sendRegCode, mobileRegAndLogin, modifyPwd } from "@/static/api/login.js";
import { getUserInfo } from '@/static/api/user.js'
export default {
  components: {},
  data() {
    return {
      formData: {},
      pageTitle: '注册',
      seconds: '获取验证码',
      second: 0,
      status: false,
      type: 0,
      codeInviter: "", //邀请码
    };
  },

  onLoad(res) {
    let that = -this;
    // 1:注册新用户   2:帮定手机号码   3：手机一键登录  4：老用户设置登录密码
    this.type = res.type;
    if (res.type == 2) {
      this.pageTitle = '绑定手机号'
      uni.setNavigationBarTitle({
        title: '绑定手机号'
      })
    } else if (res.type == 4) {
      this.pageTitle = '设置登录密码'
      uni.setNavigationBarTitle({
        title: '设置登录密码'
      })
    }

    // 获取邀请码
    if (uni.getStorageSync('inviter')) {
      this.codeInviter = uni.getStorageSync('inviter') || '';
      this.formData.inviter = uni.getStorageSync('inviter') || '';
    }

    // 获取邀请链接邀请码
    if (res.code) {
      that.codeInviter = res.code;
      that.formData.inviter = res.code || '';
    }

  },

  methods: {
    // 获取验证码
    invitation() {
      let temp = {
        mobile: this.formData.mobile,
      }
      if (!temp.mobile) {
        uni.showToast({
          title: '请输入手机号码',
          icon: 'none',
          duration: 2000
        })
        return;
      } else if (temp.mobile.length < 11) {
        uni.showToast({
          title: '请输入11位手机号码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      // 新用户注册发送验证码
      if (this.type == 1 || this.type == 3) {
        sendRegCode(temp).then(res => {
          if (res.code == 200) {
            uni.showToast({
              title: '验证码发送成功，请注意查收',
              icon: 'none',
              duration: 4000
            })
            this.countDown()
          }
        }).catch(err => { })
      }

      // 绑定手机号码发送验证码
      if (this.type == 2) {
        this.formData.code = '';
        temp.mobile = this.formData.mobile;
        sendBindCode(temp).then(res => {
          if (res.code == 200) {
            this.countDown();
            uni.showToast({
              title: '验证码发送成功，请注意查收',
              icon: 'none',
              duration: 4000
            })
          }
        }).catch(err => { })
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
    },

    // 手机号码注册
    getRegister() {
      let that = this;
      if (!that.status) {
        uni.showModal({
          title: '温馨提示',
          content: '请先阅读并同意《用户协议》和《隐私协议》',
          showCancel: false,
          confirmText: "同意继续",
          success: (res) => {
            that.status = true;
          }
        })
        return
      }
      //  测试邀请码
      let data = {
        mobile: that.formData.mobile,
        password: that.formData.password,
        code: that.formData.code,
        inviter: that.formData.inviter || uni.getStorageSync('inviter'),
        session: uni.getStorageSync('session') || '',
      };
      mobileRegAndLogin(data).then(res => {
        if (res.code == 200) {
          uni.setStorageSync("loginType", 2);
          uni.removeStorageSync('session');    // 清除session 
          uni.setStorageSync('token', res.result.token);
          // 更新用户信息
          that.updateUserinfo(res.result.token);
        }
      }).catch(err => { })
    },

    // 隐私协议、忘记密码 跳转
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

    consentAgreement() {
      this.status = !this.status;
    },

    //  绑定手机号码
    getuserRegister() {
      if (!this.status) {
        uni.showModal({
          title: '温馨提示',
          content: '请先阅读并同意《用户协议》和《隐私协议》',
          showCancel: false,
          confirmText: "同意继续",
          success: (res) => {
            this.status = true;
          }
        })
        return
      }
      let data = {
        mobile: this.formData.mobile,
        code: this.formData.code,
        inviter: uni.getStorageSync('inviter') || '',
        session: uni.getStorageSync('session')
      };
      if (!data.mobile || !data.code) {
        uni.showToast({
          title: '手机号和验证码不能为空！',
          icon: 'none',
          duration: 3000
        });
        return
      }

      //  type:3  小程序新用户注册 ， 
      if (this.type == 3) {
        wxmReg(data).then(res => {
          if (res.code == 200) {
            uni.removeStorageSync('session');    // 清除session 
            uni.setStorageSync('token', res.result.token);
            // 更新用户信息
            this.updateUserinfo(res.result.token);
          }
        })
        return;
      } else {  // 以下老用户绑定手机号
        delete data.session,
          delete data.inviter,
          appbindPhone(data).then(res => {
            if (res.code == 200) {
              this.updateUserinfo('');
            }
          })
      }
    },

    // 更新用户信息
    updateUserinfo(token) {
      getUserInfo({ token: token }).then((res) => {
        if (res.code == 200) {
          uni.showToast({
            title: '操作成功',
            icon: 'none',
            duration: 3000
          });
          // 当前用户的邀请码
          let my_inviter = res.result.user.inviterCode;
          getApp().globalData.my_inviter = my_inviter;
          getApp().sharePath = `/pages/tabBar/gallery?inviter=${my_inviter}`;
          // 登录成功清除缓存
          uni.removeStorageSync('loginStatus');
          // 存储用户邀请码
          uni.setStorageSync('myInviter', my_inviter);
          // 存储用户信息
          uni.setStorageSync('userInfo', res.result.user);
          uni.switchTab({ url: '/pages/tabBar/index' });
        }
      });
    },

    // 
    getStatus() {
      this.status = !this.status
    },

    // 设置登录密码
    loginpassword() {
      let data = this.formData;
      if (!data.password || !data.passwordTap) {
        uni.showToast({
          title: '请输入密码和确认密码！',
          icon: 'none',
          duration: 2000
        })
        return;
      } else if (data.password != data.passwordTap) {
        uni.showToast({
          title: '两次密码不一样，请重新输入！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      modifyPwd({ password: this.formData.password }).then(res => {
        if (res.code == 200) {
          uni.showToast({
            title: '操作成功',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            uni.reLaunch({
              url: "/pages/tabBar/index",
            })
          }, 500)
        }
      }).catch(err => { })
    }

  },
};

</script>

<style scoped lang="css">
.page {
  height: 100vh;
}

.image_3 {
  width: 36rpx;
  height: 36rpx;
  position: absolute !important;
  top: 8rpx !important;
  left: 0 !important;
}

.group_4 {
  margin-left: 44rpx;
}

.group_3 {
  padding: 20px;
  overflow-y: auto;
}

.space-y-40>view:not(:first-child),
.space-y-40>text:not(:first-child),
.space-y-40>image:not(:first-child) {
  margin-top: 80rpx;
}

.space-y-16>view:not(:first-child),
.space-y-16>text:not(:first-child),
.space-y-16>image:not(:first-child) {
  margin-top: 32rpx;
}

.section_3 {
  padding: 32rpx;
  /* background-color: #262628; */
  border-radius: 56rpx;
  position: relative;
}

.space-x-16>view:not(:first-child),
.space-x-16>text:not(:first-child),
.space-x-16>image:not(:first-child) {
  margin-left: 32rpx;
}

.image_7 {
  width: 48rpx;
  height: 48rpx;
}

.font_1 {
  font-size: 32rpx;
  font-family: PingFangSC;
  line-height: 30rpx;
  margin-left: 18rpx;
  /* color: #ffffff99; */
}

.text_3 {
  line-height: 29rpx;
  color: white;
}

.text_4 {
  line-height: 29rpx;
}

.text_5 {
  color: #1affe8;
}

.text_55 {
  position: absolute;
  top: 30rpx;
  right: 20rpx;
  color: #000 !important;
  padding: 10rpx 20rpx;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  font-size: 24rpx;
  border-radius: 70rpx;
  z-index: 9999;
}

.button {
  padding: 32rpx 0;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
}

.relative {
  width: 96%;
  line-height: 100rpx;
  height: 100rpx;
  margin-top: 50%;
  padding: 0 !important;
}

.text_6 {
  color: #000000;
  font-size: 36rpx;
  font-family: PingFangSC;
  line-height: 33rpx;
}
</style>