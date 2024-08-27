<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="提现"
    />
    <view class="cash-box u-flex-col u-col-center">
      <view class="cash-tips u-flex-col u-col-center">
        <image
          class="cash-img"
          mode="widthFix"
          src="https://cdn.lingchuang.art/sdv/aiker/cashResult.png"
        />
        <view class="cash-title">提现申请成功</view>
        <view class="cash-tip u-m-t-32">客服会在5个工作日内</view>
        <view class="cash-tip u-m-t-16">将提现金额打款至您的微信账户</view>
      </view>

      <view class="btn-box u-flex u-col-center u-row-around">
        <button
          class="cash-btn"
          @click="goHistory()"
        >提现记录</button>
        <view class="u-flex-1 u-m-l-46">
          <button
            class="cash-btn primary"
            @click="goHome()"
          >返回首页</button>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      walletInfo: {},
    }
  },
  methods: {
    goHome() {
      uni.switchTab({
        url: '/pages/tabBar/gallery'
      })
    },
    goHistory() {
      uni.redirectTo({
        url: '/pmine/cash/cashHistory'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.cash-box {
  padding: 32rpx;
  width: 100%;
  margin-top: 92rpx;

  .cash-tips {
    .cash-img {
      width: 320rpx;
    }

    .cash-title {
      font-size: 44rpx;
      font-weight: 500;
      color: #F4F4F4;
      margin: 16rpx 0;
    }

    .cash-tip {
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: rgba(244, 244, 244, 0.48);
    }
  }

  .btn-box {
    width: 90%;
    margin-top: 230rpx;

    .cash-btn {
      flex: 1;
      height: 96rpx;
      line-height: 96rpx;
      border: 2rpx solid #ACACAC;
      background: #141416;
      border-radius: 48rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;


      &.primary {
        background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
        border: 0;
        color: #121212;
      }
    }
  }
}
</style>
