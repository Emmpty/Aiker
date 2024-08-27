<template>
  <view
    class="flex-col page"
    :class="cueTheme"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="免费点数"
    />

    <view class="flex-col flex-auto group_3 space-y-16">

      <view class="user-info">
        <view class="user-name">
          {{ userInfo.level == 0 ? '普通用户' : '尊享会员' }}
          <vipLevel :userVipLevel="userInfo.level"></vipLevel>
        </view>
        <view class="user-item">
          <view>有效时间： {{ userInfo.expire && userInfo.expire || "您还不是会员" }}</view>
          <view>点数：{{ userInfo.point }}点
            <text
              style="color:#1DCCAF;margin-left:20rpx;"
              @click="goDetail()"
            >
              明细
              <text style="margin-left: 20rpx;"> > </text>
            </text>
          </view>
        </view>
      </view>

      <view class="flex-col section_4 space-y-28">

        <view class="flex-row items-center space-x-30">
          <view class="flex-col justify-start items-center relative group_6">
            <text
              class="font_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : 'fff' }"
            >{{ titleList[0] }}</text>
            <image
              class="image_8 pos_4"
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839790264293266.png"
            />
          </view>
        </view>

        <!-- <view class="flex-row justify-between items-center group_7">
          <view class="flex-col items-start space-y-14">
            <text class="font_2 text_7">分享好友，每次获得1点数</text>
            <text class="font_5 text_9">已完成 0/2</text>
          </view>
          <u-button class="flex-col justify-start items-center text-wrapper_2"  shape="circle">
            <text class="font_1 text_8">立即邀请</text>
          </u-button>
        </view> -->

        <view
          :border="false"
          style="flex:unset;margin-top: 32rpx;"
          v-if="listIndex == 0"
        >
          <view
            class="mana"
            title="分享到群，每次获得1点数"
          >
            <view>
              <view
                class="mana-name"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              >分享到群，每次获得1点数
              </view>
              <view class="mana-tips">已完成（{{ inviteData.times || 0 }}/{{ inviteData.total }}）</view>
            </view>
            <view>
              <!-- #ifdef MP -->
              <button
                class="btn"
                v-if="inviteData.stop"
                type="info"
                size="small"
                shape="circle"
              >暂未开放</button>
              <button
                class="btn"
                v-else-if="inviteData.times >= inviteData.total"
                type="warning"
                size="small"
                shape="circle"
              >已完成</button>
              <button
                class="btn"
                v-else
                data-Name="group"
                size="small"
                shape="circle"
                open-type="share"
              >立即分享</button>
              <!-- #endif  -->
              <!-- #ifndef MP -->
              <button
                class="btn"
                data-Name="friend"
                color="#e93323"
                size="small"
                shape="circle"
                @click="getViptype(true)"
              >立即分享</button>
              <!-- #endif  -->
            </view>
          </view>

          <view
            v-if="userInfo.wxUnionid"
            class="mana"
            title="关注公众号"
          >
            <view>
              <view
                class="mana-name"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              >关注公众号，获得10点数
              </view>
              <view class="mana-tips">已完成（{{ inviteData.focusTime ? 1 : 0 }}/{{ 1 }}）</view>
            </view>
            <view>
              <!-- #ifdef MP -->
              <button
                class="btn"
                v-if="inviteData.stop"
                type="info"
                size="small"
                shape="circle"
              >暂未开放</button>
              <button
                class="btn"
                v-else-if="inviteData.focusTime"
                type="warning"
                size="small"
                shape="circle"
              >已完成</button>
              <button
                class="btn"
                v-else
                color="#e93323"
                size="small"
                shape="circle"
                @click="playAD(4)"
              >立即关注</button>
              <!-- #endif  -->
              <!-- #ifndef MP -->
              <button
                class="btn"
                data-Name="friend"
                color="#e93323"
                size="small"
                shape="circle"
                @click="getViptype"
              >立即关注</button>
              <!-- #endif  -->
            </view>
          </view>

        </view>

        <!-- <coral-adv :appid="appid" :type="type" :isshow="isshow" @loadCb="loadCb" url="plugin://coral-adv/adv"
											@finishedCb="finishedCb" @quitCb="quitCb" @errorCb="errorCb">
										</coral-adv> -->

        <view
          class="flex-row items-center space-x-30"
          style="margin-top: 112rpx;"
        >
          <view class="flex-col justify-start items-center relative group_6">
            <text
              class="font_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : 'fff' }"
            >{{ titleList[1] }}</text>
            <image
              class="image_8 pos_4"
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839790264293266.png"
            />
          </view>
        </view>

        <u-cell-group :border="false">
          <view
            class="mana"
            style="color: white !important;"
          >
            <view style="width:60%">
              <view
                class="mana-name"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              >
                邀请好友注册，得5点数。更能获得被邀请人充值金额的10%，支持提现~</view>
              <view class="mana-tips">已邀请{{ inviteData.invites }}人</view>
            </view>
            <view style="display:flex;">
              <button
                class="btn"
                color="#e93323"
                size="small"
                shape="circle"
                @click="inviteNow()"
              >立即邀请</button>
            </view>
          </view>
        </u-cell-group>

      </view>
    </view>
  </view>
</template>

<script>
import {
  inviteTask,
  taskDo
} from '@/static/api/user.js'

import { getUserInfo } from '@/static/api/user.js'

export default {
  components: {

  },
  data() {
    return {
      titleList: ['每日任务', '长期任务'],
      listIndex: 0,
      isshow: false,
      appid: 109053,
      type: 2,
      userInfo: {}, //用户信息
      inviteData: {
        invites: 0,
        times: 0,
        total: 1,
        focusTime: ''
      },
    }
  },
  onShow() {
    this.getuserInfo()
  },
  onLoad(res) {
    this.gettaskInvites();

    if (uni.createRewardedVideoAd) {
      this.videoAd = uni.createRewardedVideoAd({
        adUnitId: 'adunit-ec2aea4e3be2b8c5'
      })
      if (this.videoAd) {
        this.videoAd.onLoad(() => { })
        this.videoAd.onError((err) => { })
        this.videoAd.onClose((res) => {
          // 用户点击了【关闭广告】按钮
          if (res && res.isEnded) {
            // 正常播放结束
            // 这里应该联网给予用户激励。且这段代码应该做安全保护，详见下文中的“安全注意”
            this.dotask(4);
          } else {
            // 播放中途退出
          }
        })
      }
    }
  },

  methods: {
    goDetail() {
      uni.navigateTo({
        url: '/pmine/recharge/detail'
      });
    },
    async getuserInfo() {
      try {
        const { code, result } = await getUserInfo()
        if (code == 200) {
          this.userInfo = { ...result.user }
          uni.setStorageSync('userInfo', result.user)
        }
      } catch (error) {
        console.error(error);
      }
    },
    loadCb(e) {
      console.log(e)
    },
    // 监听广告成功的回调事件
    finishedCb(e) {
      this.isshow = flase;
      uni.showToast({
        title: '广告看完了',
        icon: 'error',
        duration: 3000
      });
    },
    // 监听广告中途退出的回调事件
    quitCb() {
      this.isshow = flase;
      uni.showToast({
        title: '广告中途退出',
        icon: 'error',
        duration: 3000
      });
    },
    // 监听广告失败的回调事件errorCb
    errorCb() {
      this.isshow = flase;
      uni.showToast({
        title: '广告失败',
        icon: 'error',
        duration: 3000
      });
    },


    // 获取邀请数据
    async gettaskInvites() {
      try {
        const { code, result } = await inviteTask()
        if (code == 200) {
          this.inviteData = result
        }
      } catch (error) {
        console.error(error);
      }
    },

    //立即邀请 
    inviteNow() {
      uni.navigateTo({
        url: '/pmine/inviteFriend/inviteFriend'
      })
    },

    dotask(taskType) {
      taskDo().then(res => {
        if (res.code == 200) {
          if (res.result) {
            uni.showToast({
              title: "任务已完成"
            });
          }
          this.gettaskInvites();
          this.getuserInfo()
        }
      })
    },

    playAD(type) {
      console.log(type, '111111')
      // this.isshow = true;
      // setTimeout(()=>{
      // 	this.isshow = false;
      // },1000)

      // return
      if (type == 4) {
        uni.navigateTo({
          url: '/pmine/webviewManage/webviewManage?type=7',
        })
        return
      }

      // 用户触发广告后，显示激励视频广告
      if (this.videoAd) {
        this.videoAd.show().catch(() => {
          // 失败重试
          this.videoAd.load()
            .then(() => this.videoAd.show())
            .catch(err => {
              console.log('激励视频显示失败')
            })
        })
      } else {
        uni.$u.toast("激励视频组件加载中");
      }
    },

    getViptype(type) {
      // #ifdef  APP
      if (type) {
        uni.share({
          provider: 'weixin',
          scene: "WXSceneSession",
          type: 5,
          imageUrl: getApp().globalData.shareImage,
          title: getApp().globalData.shareTitle,
          miniProgram: {
            id: 'gh_a496e8cb60d0',
            path: getApp().globalData.sharePath,
            type: 0,
            webUrl: 'https://m.aiker.art/#' + getApp().globalData.sharePath
          },
          success: (ret) => {
            console.log(JSON.stringify(ret));
          },
          fail: (err) => {
            console.error('----app分享失败');
          }
        });
        return
      }
      // #endif



      uni.showToast({
        title: "请前往埃客AI小程序做任务！",
        icon: 'none'
      });

    },

  },
  /**
   * 用户分享
   * shareBtn：是否按钮转发
   * isshare：是否分享成功 isshare=1 成功 isshare=0 失败
   */
  onShareAppMessage: function (res) {
    var that = this;
    console.log("[onShareAppMessage]", res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      that.shareBtn = true;
      //#ifdef MP-WEIXIN
      if (res.target.dataset.name == "friend") {
        // 分享到个人
        setTimeout(() => {
          this.dotask(1);
        }, 618)
      } else if (res.target.dataset.name == "group") {
        //分享到群
        setTimeout(() => {
          this.dotask(2);
        }, 618)
      }
      //#endif
    } else {
      //来自右上角转发
      that.shareBtn = false;
    }
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
      complete: function (res) {
        console.log(res);
        if (res.errMsg == 'shareAppMessage:ok') {
          //#ifndef MP-WEIXIN
          //分享为按钮转发
          if (that.shareBtn) {
            //判断是否分享到群
            if (res.hasOwnProperty('shareTickets')) {
              console.log(res.shareTickets[0]);
              //分享到群
              that.isshare = 1;
              that.dotask(2);
            } else {
              // 分享到个人
              that.isshare = 0;
              that.dotask(1);
            }
          }
          //#endif
        } else {
          uni.$u.toast("分享失败");
          that.isshare = 0;
        }
      },
    }
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
.mana {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #353535;
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
  color: #959595;
  margin-top: 10rpx;
}

.longterm {
  line-height: 80px;
}

.btn {
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  color: #141416 !important;
  border: none !important;
  padding: 0 !important;
  line-height: 72rpx;
  font-weight: normal;
  border-radius: 48rpx;
  font-size: 28rpx;
  width: 184rpx;
  height: 72rpx;
  font-weight: bold;
}

.btn2 {
  background: #f3f3f3 !important;
}

.titleStyle {
  font-size: 16px !important;
  color: white !important;
}

.page {
  background-color: var(--bg-color);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .group_3 {
    padding-top: 32rpx;
    overflow-y: auto;

    .section_3 {
      margin: 0 32rpx;
      padding: 44rpx 0 40rpx 116rpx;
      border-radius: 40rpx;
      background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839789045186863.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;

      .group_4 {
        padding-left: 88rpx;

        .group_5 {
          margin-top: 12rpx;

          .text_3 {
            color: #ffffff;
            font-size: 36rpx;
            font-family: PingFangSC-Medium;
            line-height: 33rpx;
          }

          .text_4 {
            color: #ffffff99;
            font-size: 28rpx;
            font-family: PingFangSC-Regular;
            line-height: 20rpx;
          }
        }

        .text-wrapper {
          padding: 28rpx 0;
          background-color: #ffffffb3;
          border-radius: 24rpx 0px 0px 24rpx;
          backdrop-filter: blur(20rpx);
          width: 160rpx;
          height: 80rpx;
        }
      }

      .equal-division {
        margin-top: 40rpx;

        .equal-division-item {
          text-align: center;
          // flex: 1 1 228rpx;
          padding: 12rpx 40rpx;
          width: 228rpx;

          .font_4 {
            font-size: 48rpx;
            font-family: Montserrat;
            line-height: 34rpx;
            font-weight: 700;
            color: #ffffff;
          }

          .text_5 {
            opacity: 0.8;
          }
        }
      }

      .image_7 {
        width: 136rpx;
        height: 136rpx;
        border-radius: 50%;
      }

      .pos_3 {
        position: absolute;
        left: 32rpx;
        top: 32rpx;
      }
    }

    .section_4 {
      border-radius: 32rpx 32rpx 0rpx 0rpx;
      height: 80%;
      padding: 32rpx 32rpx 106rpx;
      // background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/8b0313213e3b48f1033924a4f82666a8.png');
      // background-position: 0% 0%;
      // background-size: 750rpx 1060rpx;
      // background-repeat: no-repeat;
      background-color: #232323;

      .space-x-30 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          // margin-left: 60rpx;
        }

        ::v-deep.u-cell-group {
          flex: unset;
        }

        /deep/ .u-cell-group {
          flex: unset;
        }

        // .text_6 {
        //   color: #ffffff99;
        // }
        .group_6 {
          padding: 20rpx 0;
          width: 176rpx;

          .image_8 {
            width: 176rpx;
            height: 64rpx;
          }

          .pos_4 {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
          }
        }
      }

      .group_7 {
        padding-bottom: 32rpx;
        border-bottom: solid 2rpx #ffffff1a;

        .text-wrapper_2 {
          padding: 16rpx 0;
          background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
          border-radius: 36rpx;
          width: 128rpx;
          height: 56rpx;

          .text_8 {
            color: #141416;
            line-height: 22rpx;
          }
        }
      }

      .font_5 {
        font-size: 28rpx;
        font-family: PingFangSC-Regular;
        line-height: 26rpx;
      }
    }

    .space-y-28 {

      &>view:not(:first-child),
      &>text:not(:first-child),
      &>image:not(:first-child) {
        margin-top: 56rpx;
      }
    }

    .font_3 {
      font-size: 28rpx;
      font-family: PingFangSC-Medium;
      line-height: 26rpx;
      color: #ffffff;
    }

    .space-y-14 {

      &>view:not(:first-child),
      &>text:not(:first-child),
      &>image:not(:first-child) {
        margin-top: 28rpx;
      }

      .font_2 {
        font-size: 36rpx;
        font-family: PingFangSC-Regular;
        line-height: 34rpx;
        color: #ffffff;
      }

      .text_7 {
        line-height: 36rpx;
      }

      .text_9 {
        color: #ffffffcc;
      }
    }

    .font_1 {
      font-size: 24rpx;
      font-family: PingFangSC-Regular;
      line-height: 21rpx;
      color: #ffffff;
    }
  }

  .space-y-16 {

    &>view:not(:first-child),
    &>text:not(:first-child),
    &>image:not(:first-child) {
      margin-top: 32rpx;
    }
  }
}

.user-info {
  width: auto;
  border-radius: 16rpx;
  margin: 32rpx;
  padding: 32rpx 40rpx;
  background-color: #232323;
  color: var(--text-color);

  .user-name {
    font-size: 36rpx;
    font-weight: 500;
    margin-bottom: 20rpx;
    color: var(--text-color);
    display: flex;

    .ident image {
      width: 146rpx;
      height: 52rpx;
      position: relative;
      top: 0rpx;
      margin-left: 20rpx;
    }
  }

  .user-item {
    display: flex;
    justify-content: space-between;
    border-top: 2rpx solid rgba(244, 244, 244, 0.08);
    font-size: 22rpx;
    padding-top: 20rpx;
    color: rgba(244, 244, 244, 0.76);

  }
}
</style>