<template>
  <view>
    <view class="same">
      <block v-if="params.isVisible == 0">
        <view :class="cueTheme == 'day-theme' ? 'same-name' : 'same-name same-active'">不可画同款</view>
      </block>
      <block v-else>
        <view
          :class="cueTheme == 'day-theme' ? 'same-name' : 'same-name same-active'"
          @click="sameModel(false)"
          v-if="params.isCopy"
        >一键同款(已购)</view>
        <view
          :class="cueTheme == 'day-theme' ? 'same-name' : 'same-name same-active'"
          @click="sameModel(false)"
          v-if="!params.isCopy"
        >一键同款({{ params.isVisible == 1 ? '免费' : params.isVisibles + '点数' }})</view>
      </block>
      <view
        class="same-right"
        v-if="cueTheme == 'day-theme'"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >
        <image
          @click="recommendLike()"
          :src="!isLike ? '../../../../static/img/gallery/xin_hui.png' : '../../../../static/img/gallery/xin_active.png'"
        />
        <text>{{ isLike ? params.likeCount + 1 : params.likeCount }}</text>
      </view>
      <view
        class="same-right"
        v-else
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >
        <image
          @click="recommendLike()"
          :src="!isLike ? '../../../../static/img/gallery/xin.png' : '../../../../static/img/gallery/xin_active.png'"
        />
        <text>{{ isLike ? params.likeCount + 1 : params.likeCount }}</text>
      </view>
    </view>

    <!-- 画同款弹窗 -->
    <u-popup
      :show="popupStatus"
      mode="center"
      border-radius="40"
    >
      <view
        class="popup"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <view
          class="popup-title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >温馨提示</view>
        <view
          class="popup-tips"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        > 该作品画同款需要向作者支付{{ params.isVisibles }}点数，确定要画同款吗？</view>
        <view class="popup-btn">
          <view
            class="item"
            @click="popupStatus = false"
            :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '' }"
          >取消</view>
          <view
            class="item active"
            @click="sameModel(true)"
          >立即支付</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { removeLike, addLike, } from "../../../../static/api/index.js";
import { galleryCopyStyle } from "../../../../static/api/home.js";
export default {
  name: "",
  options: {},
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      isLike: false,
      popupStatus: false,
    };
  },
  methods: {
    // 制作同款
    sameModel(e) {
      let that = this;
      if (!getApp().globalData.getLogin()) {
        uni.setStorageSync('goodsid', that.params.id);
        return;//用户未登录
      }
      uni.removeStorageSync('maskinfo'); //清除原有缓存
      uni.removeStorageSync('goodsid') //清空原影展ID
      // 免费 已购
      if (that.params.isVisible == 1 || that.params.isCopy) {
        // uni.navigateTo({
        // 	url:'/phome/generate?goodsid='+ that.params.id
        // })
        galleryCopyStyle({ id: that.params.id }).then(res => {
          if (res.code == 200) {
            let data = res.result;
            data.modelInfo.style = data.modelInfo.style ? JSON.parse(data.modelInfo.style) : {}
            data.style = data.modelInfo.style
            uni.setStorageSync('maskinfo', JSON.stringify(data));
            uni.navigateTo({
              url: '/phome/generate?maskinfo=' + JSON.stringify(data)
            })
          } else {
            uni.showModal({
              title: '温馨提示',
              content: '您的点数不足，请前往充值',
              success: function (res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url: '/pmine/mine/recharge?epindex=point'
                  })
                }
              }
            })
          }
        })
        return;
      }
      that.popupStatus = !that.popupStatus;
      if (e) {
        galleryCopyStyle({ id: that.params.id }).then(res => {
          if (res.code == 200) {
            let data = res.result;
            data.modelInfo.style = data.modelInfo.style ? JSON.parse(data.modelInfo.style) : {}
            data.style = data.modelInfo.style
            uni.setStorageSync('maskinfo', JSON.stringify(data));
            uni.navigateTo({
              url: '/phome/generate?maskinfo=' + JSON.stringify(data)
            })
            // uni.reLaunch({
            // 	url:'/pages/tabBar/index?maskinfo='+ JSON.stringify(data)
            // })
          } else {
            uni.showModal({
              title: '温馨提示',
              content: '您的点数不足，请前往充值',
              success: function (res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url: '/pmine/mine/recharge?epindex=point'
                  })
                }
              }
            })
          }
        })
      }
    },

    // 
    recommendLike() {
      let that = this;
      that.isLike = !that.isLike
      if (that.isLike) {
        addLike({ id: that.params.id }).then(res => {
          if (res.code == 200) {

          }
        })
      } else {
        removeLike({ id: that.params.id }).then(res => {
          if (res.code == 200) {

          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.same {
  padding: 16rpx 0rpx 16rpx;
  display: flex;
  justify-content: space-between;
  line-height: 60rpx;
  padding-left: 24rpx;
}

.same .same-name {
  width: 179rpx;
  height: 50rpx;
  line-height: 50rpx;
  background: #2DFFB4;
  border-radius: 27px;
  font-size: 22rpx !important;
  color: #121212;
  text-align: center;
  //   margin-left:14rpx;
}

.same .same-active {
  background: rgba(45, 255, 180, 0.12);
  border-radius: 25rpx;
  border: 2rpx solid;
  // border-image: linear-gradient(90deg, rgba(97, 255, 255, 1), rgba(41, 255, 175, 1)) 2 2;
  color: #121212;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  border: 2rpx solid rgba(97, 255, 255, 1);
}

.same .same-active::before {
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  width: 179rpx;
  height: 50rpx;
  border-radius: 25rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  z-index: -1;
}

.same image {
  width: 34rpx;
  height: 34rpx;
  position: relative;
  top: 10rpx;
  right: 6rpx
}

.same .same-right {
  font-size: 22rpx;
  line-height: 50rpx;
  margin-right: 10rpx;
}

.popup {
  width: 580rpx;
  border-radius: 20rpx;
  padding: 0 30rpx 40rpx;
}

.popup .popup-title {
  line-height: 100rpx;
  text-align: center;
  font-size: 30rpx;
}

.popup .popup-tips {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(18, 18, 18, 0.46);
  text-align: left;
}

.popup .popup-btn {
  display: flex;
  justify-content: space-around;
  margin-top: 50rpx;
}

.popup .popup-btn .item {
  width: 48%;
  height: 80rpx;
  line-height: 80rpx;
  background: rgba(18, 18, 18, 0.04);
  border-radius: 80rpx;
  text-align: center;
  border: 2rpx solid #E4E4E4;
  font-size: 28rpx !important;
}

.popup .popup-btn .active {
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);

}
</style>
