<template>
  <view
    class="page"
    :class="cueTheme"
  >
    <nav-bar
      title="点数明细"
      :backState="1000"
      :homeState="1000"
    ></nav-bar>
    <!-- <view class="record-item">
      <view
        :class="tabIndex == 1 ? 'tab active' : 'tab'"
        @click="recordType(1)"
      >明细</view>
      <view
        :class="tabIndex == 2 ? 'tab active' : 'tab'"
        @click="recordType(2)"
        :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
      >马力获得</view> 
    </view> -->

    <view class="record">

      <block v-if="tabIndex == 1">
        <view
          class="record-list"
          v-for="(item, index) in inviteList"
          :key="index"
        >
          <view class="icon">
            <image src="@/static/img/detail/money1.png">
            </image>
          </view>
          <view class="">
            <view class="name">{{ item.remark }}</view>
            <view
              class="phone"
              v-if="item.logTime"
            >
              {{ $u.timeFormat(new Date(item.logTime), "yyyy-mm-dd hh:MM:ss") }}</view>
          </view>
          <view
            class="amount"
            v-if="item.changeType == 1"
          > +{{ item.changePoint }}</view>
          <view
            class="amount"
            v-if="item.changeType != 1"
            style="color: aqua;"
          > -{{ item.changePoint }}</view>
        </view>
      </block>

      <view
        class="record-obtain"
        v-if="tabIndex == 2"
      >
        <view>
          <image src="/static/img/home/gift.png"></image>
          做任务获得马力奖励
        </view>
        <view class="task">去做任务</view>
      </view>

    </view>

  </view>
</template>
  
<script>
import { pointLogs } from "@/static/api/order.js";

export default {
  components: {},
  data() {
    return {
      tabIndex: 1,
      inviteTotal: 0, // 邀请总个数
      inviteList: [], // 邀请列表
      queryData: {
        size: 10,
      },
      noMoreData: false,
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
      } else {
        uni.showToast({
          title: "已加载全部", icon: 'none', duration: 3000
        })
      }
    }
  },

  methods: {

    recordType(e) {
      let that = this;
      this.tabIndex = e;
      if (e == 1) {
        that.inviteList = []
        that.inviteListon();
      }
    },

    // 邀请列表
    inviteListon() {
      if (this.noMoreData) return   // 没有更多数据了

      let that = this;
      uni.showLoading({ title: '加载中...', mask: true, })
      pointLogs(this.queryData).then(res => {
        if (res.code == 200) {
          let records = res.result.list;
          if (!res.result.nextId) {
            this.noMoreData = true
          } else {
            this.queryData.nextId = res.result.nextId;
          }
          that.inviteTotal = res.result.total;
          setTimeout(function () {
            uni.hideLoading()
            that.inviteList = that.inviteList.concat(records);
          }, 500)
        }
      }).catch((err) => {
        uni.hideLoading();
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
  
<style lang="scss">
.page {
  min-height: 100vh;
  padding-bottom: 40rpx;
  background-color: var(--bg-color);
}

.record {
  color: white;
  border-radius: 24rpx;
  padding-top: 32rpx;
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
  margin-top: 20rpx;
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
  right: 30rpx;
}

.record-obtain {
  width: auto;
  height: 160rpx;
  line-height: 160rpx;
  background: rgba(244, 244, 244, 0.04);
  border-radius: 32rpx;
  margin: 20rpx 26rpx;
  display: flex;
  justify-content: space-around;

  image {
    width: 100rpx;
    height: 100rpx;
    margin-top: 20rpx;
    margin-right: 20rpx;
    float: left;
  }

  .task {
    margin-top: 40rpx;
    width: 144rpx;
    height: 64rpx;
    font-size: 24rpx;
    color: #121212;
    text-align: center;
    line-height: 64rpx;
    background: linear-gradient(45deg, #2CE1F4 0%, #22F4A7 100%);
    border-radius: 2000rpx 2000rpx 2000rpx 2000rpx;
  }

}
</style>