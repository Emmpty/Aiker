<template>
  <u-popup
    :show="showPrivacy"
    :round="10"
    mode="bottom"
  >
    <view class="popup-body">
      <view class="title">用户隐私协议保护指引</view>
      <view class="content">
        <view>在你使用 埃客AI服务之前，请仔细阅读</view>
        <view
          class="link-text"
          @click="jumpType(1)"
        >《埃客AI小程序隐私保护指引》</view>
        <view> 如你同意该指引，请点击“同意”开始使用本小程序</view>
      </view>
      <view class="operate">
        <view
          class="operate-item"
          @click="disagreeAgreement()"
        >拒绝</view>
        <button
          type="button"
          id="agree-btn"
          open-type="agreePrivacyAuthorization"
          @agreeprivacyauthorization="handleAgreePrivacyAuthorization"
          class="operate-item operate-active"
        >同意</button>
      </view>
    </view>
  </u-popup>
</template>

<script>

export default {
  props: {
    params: {

    },
  },
  data() {
    return {
      showPrivacy: true,
    };
  },
  methods: {

    handleAgreePrivacyAuthorization(res) {
      wx.requirePrivacyAuthorize({
        success: res => {
          console.log(res)
          this.showPrivacy = false;
          this.$emit('agreementStatus', false)
        }
      });
    },

    disagreeAgreement() {
      this.$emit('disagreeAgreement')
    },

    jumpType(type) {
      wx.openPrivacyContract({
        success: () => { }, // 打开成功
        fail: () => { }, // 打开失败
        complete: () => { }
      })
    },
  }
}
</script>

<style lang="scss">
.popup-body {
  padding: 60rpx 40rpx 32rpx 40rpx;
  padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));

  .title {
    font-size: 34rpx;
    font-weight: 600;
  }

  .content {
    font-size: 28rpx;
    font-weight: 500;
    color: #808080;
    line-height: 40rpx;
  }

  .link-text {

    font-size: 28rpx;
    font-weight: 500;
    color: #636C91;
  }

  .operate {
    display: flex;
    justify-content: center;
    margin-top: 40rpx;
    font-weight: bold;

    .operate-item {
      width: 228rpx;
      height: 75rpx;
      line-height: 75rpx;
      font-size: 28rpx;
      border-radius: 10rpx;
      text-align: center;
      background: #F1F1F1;
      color: #57BF6A;
    }

    .operate-active {
      background: #57BF6A;
      color: #fff;
      margin-left: 30rpx !important;
    }
  }
}
</style>
