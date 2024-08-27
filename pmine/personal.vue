<template>
  <view
    class="flex-col page"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="设置"
    />

    <view class="flex-col flex-auto group_3">
      <view
        class="flex-col justify-start items-end self-center image-wrapper_2"
        :style="'background-image: url(' + userInfo.avatar + ')'"
        @click="openImagePage()"
      >
        <image
          class="image_7"
          src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/7b41032b198b8ad8e76679b53b7e1783.png"
        />
      </view>

      <view class="flex-col group_4">
        <view class="flex-row justify-between section_3">
          <text class="font_1">昵称:</text>
          <input
            class="font_2 text_3"
            type="text"
            v-model="userInfo.nickname"
            confirm-type="done"
            @confirm="saveUserName()"
            @blur="blurSaveUserName()"
          >
        </view>

        <view class="flex-col list space-y-8">
          <view
            class="flex-row justify-between items-center list-item"
            @click="setupClick(2)"
          >
            <text class="font_1">修改手机号</text>
            <view class="flex-row items-center space-x-4">
              <image
                class="shrink-0 image_8"
                :src="cueTheme == 'day-theme' ? '/static/img/gallery/arrow.png' : icon"
              />

            </view>
          </view>

          <view
            class="flex-row justify-between items-center list-item"
            @click="setupClick(3)"
          >
            <text class="font_1">修改密码</text>
            <view class="flex-row items-center space-x-4">
              <image
                class="shrink-0 image_8"
                :src="cueTheme == 'day-theme' ? '../static/img/gallery/arrow.png' : icon"
              />
            </view>
          </view>

          <view class="flex-row justify-between items-center list-item">
            <text class="font_1">我的ID :</text>
            <view
              class="flex-row items-center space-x-4"
              @click="copyKeyword(userInfo.id)"
            >
              <view class="font_2 font_3">{{ userInfo.id }}</view>
              <text class="pocy">复制</text>
            </view>
          </view>

        </view>
      </view>
      <view
        class="flex-col justify-start items-center button"
        @click="logoutClick"
      >退出登录</view>
    </view>
  </view>
</template>

<script>
import { updateNick, getUserInfo } from '@/static/api/user.js'
import { mapState } from "vuex";
import utils from "@/static/utils/utils";

export default {
  components: {},
  data() {
    return {
      userInfo: {},
      icon: 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839782114203785.png',
    };
  },
  computed: {
    ...mapState("draw", [
      "mineDrawList",
      "galleryDrawList",
    ]),
  },
  onLoad(res) {
    let userinfo = uni.getStorageSync('userInfo');
    this.userInfo = userinfo;
  },
  methods: {
    setupClick(type) {
      if (type == 2) {
        uni.navigateTo({
          url: '/pmine/updatephone'
        })
      } else if (type == 3) {
        uni.navigateTo({
          url: "/plogin/register?type=4",
        })
      }
    },
    visibilityChange(val) {
      let _len = val.length
      return val.substring(0, 6) + '*******' + val.substring(_len - 6, _len)
    },

    // saveChanges() {
    //   let data = {
    //     name: this.userInfo.nickname,
    //     avatar: this.userInfo.avatar
    //   }
    //   updateInfo(data).then(res => {
    //     if (res.code == 200) {
    //       getUserInfo({}).then((res) => {
    //         if (res.code == 200) {
    //           uni.showToast({ title: "更新成功", duration: 4000 });
    //           uni.setStorageSync('userInfo', res.result);
    //         }
    //       })
    //     }
    //   })
    // },

    // 选择图片
    openImagePage() {
      let that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        crop: {
          quality: 10,
        },
        width: 160,
        height: 160,
        success: (res) => {
          uni.showLoading({
            title: '图片上传中'
          });
          if (res.tempFiles[0].size > 1572864) {
            uni.showToast({ title: "图片不能超过1.5MB,请重新上传！", icon: "none", duration: 4000 });
            uni.hideLoading()
            return
          } else {
            uni.uploadFile({
              method: 'POST',
              header: { 'Authorization': uni.getStorageSync('token') },
              url: this.$baseURL + '/user/uploadAvatar',
              filePath: res.tempFilePaths[0],
              name: 'file',
              success: (res) => {
                let data = JSON.parse(res.data);
                let userInfo = that.userInfo;
                userInfo.avatar = data.result.avatar;
                this.userInfo = userInfo;
                uni.hideLoading()
              }
            });
          }
        }
      });
    },

    // 开始图片上传
    getuploadImage(tempFilePaths) {
      uni.hideLoading()
      let _this = this;
      uni.uploadFile({
        method: 'POST',
        header: { 'Authorization': uni.getStorageSync('token') },
        url: _this.$baseURL + '/user/info/uploadAvatar',
        filePath: tempFilePaths[0],
        name: 'file',
        success: (res) => {
          let data = JSON.parse(res.data)
          _this.userInfo.avatar = data.result.avatar;
        }
      });
    },

    //  小程序设置
    Setting: function () {
      uni.openSetting({
        success: function (res) {

        }
      });
    },

    // 复制
    copyKeyword(text) {
      utils.copyText(text)

    },

    logoutClick() {
      uni.showModal({
        title: '温馨提示',
        content: '您确认要退出吗?',
        success: (res) => {
          if (res.confirm) {
            this.$store.commit('draw/changeMineDrawList', [])
            uni.removeStorageSync('taskId'); //清除任务ID
            uni.removeStorageSync('userInfo'); // 清除用户信息
            uni.removeStorageSync('token'); //清除用户token
            uni.removeStorageSync('loginType'); //清除用户账号登录类型
            uni.setStorageSync("loginStatus", 1);
            uni.removeStorageSync('session');    // 清除session 
            uni.switchTab({ url: '/pages/tabBar/index' });

          }
        }
      });
    },

    async saveUserName() {
      console.log('confirm', this.userInfo.nickname);
      let userInfo = uni.getStorageSync('userInfo')
      if (userInfo.nickname === this.userInfo.nickname) {
        return
      }
      try {
        const updateRes = await updateNick({ name: this.userInfo.nickname })
        if (updateRes.code == 200) {
          uni.showToast({ title: "昵称已修改成功", icon: 'none', duration: 4000 })
          const res = await getUserInfo({})
          if (res.code == 200) {
            uni.setStorageSync('userInfo', res.result.user);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async blurSaveUserName() {
      console.log('blur', this.userInfo.nickname);
      let userInfo = uni.getStorageSync('userInfo')
      if (userInfo.nickname === this.userInfo.nickname) {
        return
      }
      try {
        const updateRes = await updateNick({ name: this.userInfo.nickname })
        if (updateRes.code == 200) {
          uni.showToast({ title: "昵称已修改成功", icon: 'none', duration: 4000 })
          const res = await getUserInfo({})
          if (res.code == 200) {
            uni.setStorageSync('userInfo', res.result.user);
          }
        }
      } catch (error) {
        console.error(error);
      }

    },

  },

  /**
 * 用户点击右上角分享
 */
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

<style scoped lang="less">
.page {
  background-color: var(--bg-color-page);
  height: 100vh;

  .group_3 {
    padding: 60rpx 32rpx 504rpx;
    overflow-y: auto;

    .image-wrapper_2 {
      position: relative;
      background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839787430766661.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border-radius: 50%;
      width: 216rpx;
      height: 216rpx;

      .image_7 {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 64rpx;
        height: 64rpx;
      }
    }

    .group_4 {
      padding: 64rpx 0 48rpx;

      .section_3 {
        padding: 32rpx;
        border-radius: 32rpx;
        background-color: var(--bg-color-2);
        color: var(--text-color);

        .text_3 {
          text-align: right;
        }
      }

      .list {
        padding: 16rpx 0;

        .list-item {
          padding: 32rpx;
          border-radius: 32rpx;
          background-color: var(--bg-color-2);
          color: var(--text-color);

          .space-x-4 {
            position: relative;

            .image_9 {
              width: 32rpx;
              height: 32rpx;
            }
          }
        }
      }

      .space-y-8 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-top: 16rpx;
        }
      }

      .font_1 {
        font-size: 28rpx;
        font-family: PingFangSC-Regular;
      }

      .font_2 {
        font-size: 28rpx;
        font-family: PingFangSC;
        line-height: 26rpx;
      }

      .font_3 {
        margin-right: 32rpx;
      }

      .pocy {
        padding: 8rpx 24rpx;
        border-radius: 32rpx;
        font-size: 12px;
        border: 1px solid white;
      }
    }

    .button {
      padding: 28rpx 0 36rpx;
      background-color: var(--bg-color-2);
      color: var(--text-color);
      border-radius: 32rpx;

      .text_6 {
        color: #000000;
        font-size: 32rpx;
        font-family: PingFangSC;
        line-height: 33rpx;
        font-weight: 500;
      }
    }
  }

}

.image_8 {
  width: 14rpx;
  height: 26rpx;
}
</style>