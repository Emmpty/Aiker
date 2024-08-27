<template>
  <view
    class="page"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="记录明细"
    />
    <view class="record-item">
      <view
        :class="tabIndex == 1 ? 'tab active' : 'tab'"
        @click="recordType(1)"
      >邀请记录</view>
      <view
        :class="tabIndex == 2 ? 'tab active' : 'tab'"
        @click="recordType(2)"
      >收益记录</view>
      <view
        :class="tabIndex == 3 ? 'tab active' : 'tab'"
        @click="recordType(3)"
      >提现记录</view>
    </view>

    <view class="record">

      <block v-if="tabIndex == 1">
        <view
          class="record-list"
          v-for="(item, index) in inviteList"
          :key="index"
        >
          <view class="icon">
            <image src="@/static/img/detail/avter.png"></image>
          </view>
          <view class="">
            <view class="name">{{ item.userId }}</view>
            <view class="phone">{{ item.phone }}</view>
          </view>
          <view class="time">{{ $u.timeFormat(new Date(item.createTime), "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
      </block>
      <block v-if="tabIndex == 2">
        <view
          class="record-list"
          v-for="(item, index) in scoreList"
          :key="index"
        >
          <view class="icon">
            <image src="@/static/img/detail/money.png"></image>
          </view>
          <view class="">
            <view class="name">{{ item.remark }}</view>
            <view
              v-if="item.logTime"
              class="phone"
            >{{ $u.timeFormat(new Date(item.logTime), "yyyy-mm-dd hh:MM:ss") }}</view>
          </view>
          <view class="amount"> +{{ (item.changeAmount / 100).toFixed(2) }}</view>
        </view>
      </block>
      <block v-if="tabIndex == 3">
        <view
          class="record-list"
          v-for="(item, index) in cashList"
          :key="index"
        >
          <view class="icon">
            <image src="@/static/img/detail/money.png"></image>
          </view>
          <view class="">
            <view class="name">{{ item.name }}</view>
            <view class="phone">{{ $u.timeFormat(new Date(item.updateTime), "yyyy-mm-dd hh:MM:ss") }}</view>
          </view>
          <view class="amount"> +{{ (item.cashAmount / 100).toFixed(2) }}</view>
        </view>
      </block>

    </view>

  </view>
</template>
  
<script>
import { invitePage, incomePage, cashLogs } from "@/static/api/order.js";

export default {
  components: {},
  data() {
    return {
      tabIndex: 1,
      inviteNum: 1,   // 邀请记录分页
      inviteTotal: 0, // 邀请总个数
      inviteList: [], // 邀请列表

      scoreNum: 1,   // 收益分页
      scoreList: [], // 收益列表
      scoreTotal: 0, // 收益总个数

      cashNum: 1,   // 提现分页
      cashList: [], // 提现分页
      cashTotal: 0, // 提现分页
      queryParam: {
        size: 10,
      }
    };
  },

  onLoad() {
    this.inviteListon()
  },

  onReachBottom() {
    let that = this;
    if (that.tabIndex == 1) {
      if (that.inviteList.length != that.inviteTotal) {
        that.inviteListon();
      }
    } else if (that.tabIndex == 2) {
      if (that.scoreList.length >= that.scoreTotal) {
        return
      }
      that.scoreListon();
    } else {
      if (that.cashList.length >= that.cashTotal) {
        return
      }
      that.cashListon();
    }
  },

  methods: {
    recordType(e) {
      let that = this;
      this.tabIndex = e;
      this.queryParam = {
        size: 10,
      }
      this.noMoreData = false
      if (e == 1) {
        that.inviteNum = 1;
        that.inviteList = []
        that.inviteListon();
      }
      if (e == 2) {
        that.scoreNum = 1;
        that.scoreList = [];
        that.scoreListon()
      }
      if (e == 3) {
        that.cashNum = 1;
        that.cashList = [];
        that.cashListon();
      }
    },

    // 邀请列表
    inviteListon() {
      let that = this;
      let data = {
        pageNum: that.inviteNum,
        pageSize: 10,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      invitePage(data).then(res => {
        if (res.code == 200) {
          let records = res.result.records;
          that.inviteNum = that.inviteNum + 1;
          that.inviteTotal = res.result.total;
          setTimeout(function () {
            uni.hideLoading()
            that.inviteList = that.inviteList.concat(records);
          }, 500)
        }
      })
    },

    // 获取收益记录列表
    scoreListon() {
      let that = this;
      if (this.noMoreData) return   // 没有更多数据了
      uni.showLoading({ title: '加载中...', mask: true, })
      incomePage(this.queryParam).then(res => {
        if (res.code == 200) {
          // 判断是否还有下一页
          if (!res.result.nextId) {
            this.noMoreData = true
          } else {
            this.queryParam.nextId = res.result.nextId
          }
          let records = res.result.list;
          that.scoreNum = that.scoreNum + 1;
          that.scoreTotal = res.result.total;
          setTimeout(function () {
            uni.hideLoading()
            that.scoreList = that.scoreList.concat(records);
          }, 500)
        }
      })
    },

    // 获取提现记录列表
    cashListon() {
      let that = this;
      if (this.noMoreData) return   // 没有更多数据了
      uni.showLoading({ title: '加载中...', mask: true, })
      cashLogs(this.queryParam).then(res => {
        if (res.code == 200) {
          if (!res.result.nextId) {
            this.noMoreData = true
          } else {
            this.queryParam.nextId = res.result.nextId
          }
          let records = res.result.list;
          records.map(item => {
            item.name = item.status == 0 ? '申请处理中' : item.status == 1 ? "提现成功" : '提现退回'
          })
          that.cashNum = that.cashNum + 1;
          that.cashTotal = res.result.total;
          setTimeout(function () {
            uni.hideLoading()
            that.cashList = that.cashList.concat(records);
          }, 500)
        }
      })
    },
  },

  onShareAppMessage() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    };
  },

  onShareTimeline() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    }
  }
};
</script>
  
<style scoped lang="less">
.page {
  min-height: 100vh;
  padding-bottom: 40rpx;
  background-color: var(--bg-color);
}

.my-nav {
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  z-index: 100;
  background: #1F1F1F;

  .left {
    position: absolute;
    line-height: 90rpx;
    top: 0;
    bottom: 0;
    left: 20rpx;
    margin: auto;
  }

  .left-btn {
    width: 170rpx;
    height: 60rpx;
    line-height: 60rpx;
    background: rgba(244, 244, 244, 0.08);
    border-radius: 40rpx 40rpx 40rpx 40rpx;
    opacity: 1;
    border: 2rpx solid rgba(244, 244, 244, 0.04);
    display: flex;
    justify-content: space-between;

    .item {
      width: 50%;
      text-align: center;
    }

    image {
      width: 36rpx;
      height: 36rpx;
      margin-top: 10rpx;
    }
  }

  .left-active {
    border: 2rpx solid rgba(18, 18, 18, 0.04) !important;
    background: #fff !important;
  }

  .title {
    padding: 0;
    font-size: 28rpx;
    font-family: Source Han Sans CN;
  }
}

.record {
  color: white;
  border-radius: 24rpx;
  padding-top: 110rpx;
}

.record-item {
  display: flex;
  justify-content: space-around;
  line-height: 100rpx;
  color: rgba(244, 244, 244, 0.48);
  background: #1F1F1F;
  border-radius: 0 0 20rpx 20rpx;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;

}

.record-item .tab {
  font-size: 32rpx;
}

.record-item .active {
  color: white;
  position: relative;
}

.record-item .active:before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 128rpx;
  height: 8rpx;
  border-radius: 30rpx;
  background: linear-gradient(45deg, #2CE1F4 0%, #22F4A7 100%);
}

.record-list {
  display: flex;
  position: relative;
  padding: 20rpx 30rpx;
  background: rgba(244, 244, 244, 0.08);
  margin: 20rpx 26rpx;
  border-radius: 32rpx;
}

.record-list .icon {
  background: rgba(244, 244, 244, 0.12);
  border-radius: 16rpx;
  width: 77rpx;
  height: 80rpx;
  text-align: center;
  margin-right: 20rpx;
}

.record-list .icon image {
  width: 40rpx;
  height: 40rpx;
  margin-top: 18rpx;
}

.record-list .name {
  font-size: 28rpx;
  font-weight: 500;
  color: #F4F4F4;
  line-height: 44rpx;
}

.record-list .phone {
  font-size: 20rpx;
  color: #F4F4F4;
  line-height: 28rpx;
  margin-top: 8rpx;
}

.record-list .time {
  position: absolute;
  top: 26rpx;
  right: 20rpx;
  font-size: 20rpx;
  color: rgba(244, 244, 244, 0.48);
}

.record-list .amount {
  color: #F04455;
  font-size: 32rpx;
  position: absolute;
  top: 40rpx;
  right: 20rpx;
}
</style>