<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="忘记密码"
    />

    <view class="flex-col flex-auto group_3 space-y-40">
      <view class="flex-col space-y-16">
        <view
          class="flex-row items-center section_3 space-x-16"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#282828' }"
        >
          <image
            class="image_7"
            :src="cueTheme == 'day-theme' ? '../static/img/login/phone.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846348018144879.png'"
          />
          <input
            v-model="formData.mobile"
            class="font_1 text_3"
            type="text"
            placeholder="手机号码"
            maxlength="11"
          />
        </view>
        <view
          class="flex-row justify-between items-center section_3"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#282828' }"
        >
          <view class="flex-row items-center space-x-16">
            <image
              class="shrink-0 image_7"
              :src="cueTheme == 'day-theme' ? '../static/img/login/code.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846348847661064.png'"
            />
            <input
              v-model="formData.code"
              class="font_1 text_3"
              type="text"
              placeholder="验证码"
            />
          </view>
          <!-- <button size="mini" @click="invitation" class="text_5" :disabled="second==0?false:true">
            {{second == "0"?'获取验证码':second+'秒后重试' }}
          </button> -->
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
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#282828' }"
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
          />
        </view>
        <view
          class="flex-row items-center section_3 space-x-16"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#282828' }"
        >
          <image
            class="image_7"
            :src="cueTheme == 'day-theme' ? '../static/img/login/lock.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846349020663011.png'"
          />
          <input
            v-model="formData.password2"
            class="font_1 text_3"
            type="text"
            placeholder="再次输入密码"
          />
        </view>
      </view>
      <view
        class="flex-col justify-start items-center button"
        @click="retrievePassword"
      ><text class="text_6">确认</text></view>
    </view>
  </view>
</template>

<script>
import { sendForgetCode, password } from '@/static/api/user.js'

export default {
  components: {},
  data() {
    return {
      formData: {},
      seconds: '获取验证码',
      second: 0,
    };
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
      sendForgetCode(temp).then(res => {
        if (res.code == 200) {
          this.countDown()
          uni.showToast({
            title: '验证码发送成功，请注意查收',
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(err => { })
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

    // 提交修改密码
    retrievePassword() {
      let data = {
        mobile: this.formData.mobile,
        password: this.formData.password,
        code: this.formData.code,
      };
      if (!data.mobile || !data.password || !data.code) {
        uni.showToast({
          title: '手机号，验证码，密码不能为空！',
          icon: 'none',
          duration: 2000
        })
        return;
      } else if (data.password != this.formData.password2) {
        uni.showToast({
          title: '两次密码不一样，请重新输入！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      password(data).then(res => {
        if (res.code == 200) {
          uni.showToast({
            title: '操作成功',
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            uni.navigateBack({
              delta: 1,
            });

          }, 2000);
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(err => { })
    },

  },
};
</script>

<style scoped lang="css">
.page {
  background-color: #141416;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.group_3 {
  padding: 138rpx 70rpx 586rpx;
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
  background-color: #ffffff1a;
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
  color: #ffffff99;
}

.text_3 {
  line-height: 29rpx;
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
  z-index: 999;
}

.button {
  padding: 32rpx 0;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
}

.text_6 {
  color: #000000;
  font-size: 36rpx;
  font-family: PingFangSC;
  line-height: 33rpx;
}
</style>