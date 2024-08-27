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
    <view class="cash-box">
      <view class="cash-head u-flex u-col-center u-row-between">
        <view class="u-flex-col">
          <view class="cash-text">可提现金额（元）</view>
          <!-- 左边边价格 -->
          <view class="price-box u-flex ">
            <view class="price-icon u-m-r-8">¥</view>
            <view class="price u-m-t-8">{{ usableScore || 0 }}</view>
          </view>
        </view>
        <view
          class="u-flex u-col-center"
          @click="toCashHistory()"
        >
          <view class="cash-text2 u-m-r-8">提现记录</view>
          <i class="iconfont icon-youjiantou"></i>
        </view>
      </view>

      <view class="cash-form u-flex-col">
        <view class="cash-title">提现金额</view>
        <view class="u-flex u-col-center">
          <view class="cash-icon">¥</view>
          <input
            type="number"
            v-model="money"
            class="cash-input u-flex-1"
            placeholder="最低5元"
            placeholder-class="cash-input-placeholder"
          />
          <view class="cash-all" @click="cashAll()">全部提现</view>
        </view>
      </view>


      <view class="cash-tips u-flex-col">
        <view class="cash-title">温馨提醒</view>
        <view class="u-flex u-col-centter">
          <view class="cash-tips-img">1</view>
          <view class="cash-tip">单次提现最高500元，单日可多次申请</view>
        </view>
        <view class="u-flex u-col-centter u-m-t-48">
          <view class="cash-tips-img">2</view>
          <view class="cash-tip">5个工作日内到账微信零钱</view>
        </view>
      </view>

      <button
        class="cash-btn"
        @click="beginCash()"
      >立即提现</button>
    </view>
  </view>
</template>

<script>
import { scoreProfit, scoreCash } from '@/static/api/order.js'
export default {
  data() {
    return {
      walletInfo: {},
      money: '',
    }
  },
  onLoad() {

  },
  onShow() {
    this.getWalletInfo()
  },
  computed: {
    usableScore() {
      return (this.walletInfo.usableScore / 100).toFixed(2)
    },
  },
  methods: {
    async getWalletInfo() {
      try {
        const { code, result } = await scoreProfit()
        if (code == 200) {
          this.walletInfo = result
        }
      } catch (error) {
        console.error(error);
      }
    },
    cashAll(){
      this.money = this.usableScore
    },
    async beginCash() {
      //  #ifndef MP
      uni.showModal({
        title: '温馨提示',
        content: '请前往微信小程序申请提现',
        showCancel: true,
        success: (res) => {
        }
      })
      //  #endif 

      //  #ifdef MP
      if (this.money < 5 || this.money <= 0) {
        uni.showToast({
          title: '提现金额需要大于5元',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if (this.money > 500) {
        uni.showToast({
          title: '单次提现金额最多为500,请重新输入！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      console.log('>>>>>>>>>>', +this.money, +this.usableScore);
      if (+this.money > +this.usableScore) {
        uni.showToast({
          title: '您的可提现金额不足,请重新输入！',
          icon: 'none',
          duration: 3000
        });
        return;
      }

      try {
        uni.showModal({
          title: '温馨提示',
          content: '是否提现',
          success: async (res) => {
            if (res.confirm) {
              let temp = {
                realName: '',
                accountName: "",
                amount: this.money * 100,
                openid: uni.getStorageSync('openid'),
                appid: getApp().globalData.appid,
              }
              const res = await scoreCash(temp)
              if (res.code === 200) {
                this.money = '';
                uni.navigateTo({
                  url: '/pmine/cash/cashResult'
                })
              }
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
      //  #endif 
    },
    toCashHistory() {
      uni.navigateTo({
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



  .cash-head {
    color: #959595;
    margin-top: 32rpx;

    .cash-text {
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;

    }

    .cash-text2 {
      font-size: 28rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;

    }

    .icon-youjiantou {
      font-size: 24rpx;
    }

    .price-box {
      align-items: baseline;
      color: #F4F4F4;

      .price-icon {
        font-size: 28rpx;
        font-weight: 500;
      }

      .price {
        font-size: 44rpx;
        font-weight: 500;
      }
    }
  }

  .cash-form {
    padding: 36rpx 32rpx 80rpx 56rpx;
    background: #232323;
    border-radius: 48rpx;
    color: rgba(244, 244, 244, 0.48);
    font-weight: 500;
    margin-top: 48rpx;

    .cash-title {
      margin-bottom: 40rpx;
    }

    .cash-icon {
      font-size: 56rpx;
      color: #F4F4F4;
      width: 60rpx;
      margin-bottom: -14rpx;
    }

    .cash-input {
      font-size: 56rpx;
      font-weight: bold;
      color: var(--text-color);
      height: 80rpx;
    }

    .cash-input-placeholder {
      color: #656565;
      font-size: 56rpx;
      font-weight: bold;
    }

    .cash-all {
      color: #F4F4F4;
      width: 120rpx;
      font-size: 28rpx;

    }
  }

  .cash-tips {
    color: #BCBCBC;
    font-size: 28rpx;
    margin-bottom: 180rpx;

    .cash-title {
      color: #959595;
      font-size: 24rpx;
      margin: 44rpx 0 32rpx 0;
    }

    .cash-tips-img {
      width: 40rpx;
      height: 40rpx;
      line-height: 40rpx;
      text-align: center;
      color: #F4F4F4;
      background: url('/static/img/mine/cash/Rectangle.png') no-repeat;
      background-size: 100% 100%;
      margin-right: 16rpx;
    }

    .cash-tip {}
  }

  .cash-btn {
    width: 100%;
    height: 96rpx;
    line-height: 96rpx;
    background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
    border-radius: 48rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #121212;
  }
}
</style>
