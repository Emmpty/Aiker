<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="明细"
    />

    <view class="flex-col flex-auto group_3 space-y-16">

      <view
        class="flex-col section_4 space-y-24"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >

        <!--  <view class="flex-row items-center space-x-22">
          <view :class="tabIndex == index?'justify-start items-center text-active text-wrapper':' justify-start items-center text-wrapper'" v-for="(item,index) in 2" :key="index" @click="tabClick(index)">
            <text class="text_8" :style="{'color':cueTheme=='day-theme'?'#000':'#fff'}" >{{index ==0?'点数明细':'点数获得'}}</text>
          </view>
        </view>-->

        <!-- 点数明细 -->
        <block v-if="tabIndex == 0">
          <view
            class="mana"
            v-for="(item, index) in list"
            :key="index"
          >
            <view>
              <view
                class="mana-name"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              >{{ item.remark }}</view>
              <view class="mana-tips">{{ $u.timeFormat(new Date(item.logTime), "yyyy-mm-dd hh:MM:ss") }}</view>
            </view>
            <view slot="right-icon">
              <text :style="item.changeType == 1 ? 'color:#1AFFE8;' : 'color:#FFC400;'">{{ item.changeType == 1 ? "+" :
                "-" }}{{
    item.changePoint / 10 }}</text>
            </view>
          </view>
        </block>

        <!-- 点数获得 -->
        <view
          class="flex-col space-y-16"
          v-if="tabIndex == 1"
        >
          <view
            class="flex-row justify-between items-center list-item"
            @click="taskTab()"
          >
            <view class="flex-row items-center">
              <image
                class="shrink-0 image_7"
                src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839794781388531.png"
              />
              <text
                class="font_3"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              > 做任务获得点数奖励</text>
            </view>
            <view class="flex-col justify-start items-center text-wrapper_2"><text class="font_4">去做任务</text></view>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
import { pointLogs } from '@/static/api/index.js'


export default {
  components: {},
  data() {
    return {
      tabIndex: 0,
      point: 0,
      pageNum: 1,
      list: [],
      total: 0,
    };
  },

  onLoad(res) {
    this.point = res.point;
    this.pointList();
  },

  onReachBottom() {
    let that = this;
    if (that.list.length != that.total) {
      that.pointList();
    } else {
      uni.showToast({
        title: "已加载全部", icon: 'none', duration: 3000
      })
    }
  },

  methods: {

    tabClick(e) {
      this.tabIndex = e;
    },

    pointList() {
      let data = {
        pageNum: this.pageNum,
        pageSize: 10,
      }
      pointLogs(data).then(res => {
        if (res.code == 200) {
          this.list = this.list.concat(res.result.records);
          this.total = res.result.total;
          this.pageNum = this.pageNum + 1;
        }
      })
    },

    taskTab(e) {
      uni.navigateTo({
        url: '/pmine/freeMana/freeMana'
      })
    }
  },

  //  用户点击右上角分享
  onShareAppMessage() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    };
  },

  // 
  onShareTimeline() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    }
  }

};
</script>
<style>
page {
  background-color: #141416;
  min-height: 100vh;
}
</style>
<style scoped lang="less">
.mana {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f5f5f5;
  padding: 30rpx 0;
}

.mana-name {
  font-size: 16px;
  font-family: 'PingFang SC-Regular, PingFang SC';
  font-weight: 400;
  color: #141416;
}

.mana-tips {
  font-size: 12px;
  font-family: 'PingFang SC-Regular, PingFang SC';
  font-weight: 400;
  color: #666666;
  margin-top: 10rpx;
}

.page {
  background-color: #141416;
  min-height: 100vh;

  // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  .group_3 {
    // padding-top: 18rpx;
    overflow-y: auto;

    .section_3 {
      margin: 0 32rpx;
      padding: 64rpx 0 40rpx;
      border-radius: 40rpx;
      background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839792597693295.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-color: #23262F;

      .text_3 {
        color: #ffffff;
        font-size: 36rpx;
        font-family: Montserrat;
        line-height: 25rpx;
      }

      .text_4 {
        margin-top: 20rpx;
        color: #ffffff99;
        font-size: 28rpx;
        font-family: PingFangSC;
        line-height: 26rpx;
      }

      .equal-division {
        margin-top: 40rpx;

        .equal-division-item {
          padding: 12rpx 48rpx;
          flex: 1 1 216rpx;
        }

        .space-y-12 {

          &>view:not(:first-child),
          &>text:not(:first-child),
          &>image:not(:first-child) {
            // margin-top: 24rpx;
          }
        }

        .equal-division-item_2 {
          padding: 12rpx 0;
          flex: 1 1 216rpx;
        }

        .font_2 {
          font-size: 48rpx;
          font-family: Montserrat;
          line-height: 35rpx;
          font-weight: 700;
          color: #ffffff;
        }

        .font_1 {
          font-size: 24rpx;
          font-family: PingFangSC-Regular;
          line-height: 22rpx;
          color: #ffffff;
        }

        .text_6 {
          opacity: 0.8;
        }

        .equal-division-item_3 {
          padding: 12rpx 36rpx;
          flex: 1 1 216rpx;

          .space-x-4 {

            &>view:not(:first-child),
            &>text:not(:first-child),
            &>image:not(:first-child) {
              margin-left: 8rpx;
            }

            .text_5 {
              color: #ffffff;
              font-size: 28rpx;
              font-family: PingFangSC-Regular;
              line-height: 24rpx;
            }
          }
        }
      }

      .space-x-10 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-left: 20rpx;
        }
      }
    }

    .section_4 {
      padding: 32rpx 32rpx 20rpx;
      background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/28fb63b1bd1842c25215302e3856bf4f.png');
      background-position: 0% 0%;
      background-size: 750rpx 1076rpx;
      background-repeat: no-repeat;
      background-color: #23262F;

      .space-x-22 {
        .text-wrapper {
          color: #fff;
          width: 176rpx;
          text-align: center;
          margin-right: 20rpx;
        }

        .text-active {
          background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839795768276528.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          width: 176rpx;
          height: 64rpx;
          line-height: 64rpx;
          text-align: center;
          color: #ffffff;
        }
      }
    }

  }

  .space-y-16 {

    &>view:not(:first-child),
    &>text:not(:first-child),
    &>image:not(:first-child) {
      margin-top: 32rpx;
    }

    .list-item {
      padding: 4rpx 0;
      background-color: #ffffff1a;
      border-radius: 32rpx;

      .image_7 {
        width: 166rpx;
        height: 166rpx;
      }

      .font_3 {
        font-size: 32rpx;
        font-family: TsangerYuYangT-W02;
        line-height: 30rpx;
        color: #ffffff;
      }

      .text-wrapper_2 {
        margin-right: 24rpx;
        padding: 16rpx 0;
        background-image: linear-gradient(113.6deg, #61ffff 0%, #29ffaf 100%);
        border-radius: 36rpx;
        width: 128rpx;
        height: 56rpx;

        .font_4 {
          font-size: 24rpx;
          font-family: TsangerYuYangT-W02;
          line-height: 22rpx;
          color: #141416;
        }
      }
    }
  }
}

.u-cell__title-text {
  color: #fff;
}
</style>