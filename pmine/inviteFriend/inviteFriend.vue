<template>
  <view>
    <view class='posters'>
      <nav-bar
        bgColor="transparent"
        title="邀请有奖"
        :backState="1000"
        :homeState="1000"
      ></nav-bar>

      <view class="rebate">
        <image
          mode="widthFix"
          src="https://cdn.lingchuang.art/sdv/aiker/invite-friend.png"
        ></image>
      </view>

      <view class="obtain">
        <view class="obtain-name">好友充值可获得10%返佣</view>
        <view class="obtain-stop">
          <view class="name">可提现金额</view>
          <view class="total u-flex u-col-center u-row-center">
            <view class="num"> {{ (walletInfo.usableScore / 100).toFixed(2) || 0 }}</view>
            <button
              class="cash-btn"
              @click="toCash()"
            >提现</button>
          </view>
        </view>
        <view
          class="obtain-code"
          @click="copyKeyword()"
        >专属邀请码：<text>{{ my_inviter }}</text>
          <image src="/static/img/detail/copy2.png"></image>
        </view>
        <view class="u-flex u-col-center u-row-center u-m-t-32 u-m-b-32">
          <button
            class="more-commission"
            @click="showCustomerServiceImg()"
          >合伙人计划</button>
        </view>
        <view class="obtain-flex">
          <view
            class="conpt"
            @click="llustrateStatus()"
          >
            <image src="/static/img/payment/download.png"></image> 海报邀请
          </view>
          <button
            class="conpt"
            open-type="share"
            type="button"
            @click="shareWX()"
          >
            <image src="/static/img/payment/wechat_icon.png" />
            <text>直接邀请</text>
          </button>
        </view>
      </view>

      <view class="record">

        <u-tabs
          :list="navTabList"
          :current="tabIndex"
          @change="tabChange"
          lineColor="#1affe8"
          :activeStyle="{
            color: '#000',
            fontWeight: 'bold',
            fontSize: '36rpx',
            transform: 'scale(1.05)'
          }"
          :itemStyle="{
            width: '33%',
            height: '88rpx'
          }"
          :inactiveStyle="{
            color: '#000',
            fontSize: '36rpx',
            transform: 'scale(1)'
          }"
        ></u-tabs>

        <block v-if="tabIndex == 0">
          <template v-if="inviteList.length == 0">
            <view class="empty-tip">暂无记录</view>
          </template>
          <template v-else>
            <view
              class="record-list"
              v-for="(item, index) in inviteList"
              :key="index"
            >
              <view class="icon">
                <image src="@/static/img/detail/avter1.png">
                </image>
              </view>
              <view class="">
                <view class="name">{{ item.userId }}</view>
                <view class="phone">{{ item.phone }}</view>
              </view>
              <view class="time">{{ $u.timeFormat(new
                Date(item.createTime), "yyyy-mm-dd hh:MM:ss") }}</view>
            </view>
            <view
              class="record-more"
              @click="seeMore()"
            >查看更多></view>
          </template>
        </block>
        <block v-if="tabIndex == 1">
          <template v-if="scoreList.length == 0">
            <view class="empty-tip">暂无记录</view>
          </template>
          <template v-else>
            <view
              class="record-list"
              v-for="(item, index) in scoreList"
              :key="index"
            >
              <view class="icon">
                <image src="@/static/img/detail/money1.png">
                </image>
              </view>
              <view class="">
                <view class="name">{{ item.remark }}</view>
                <view class="phone">{{ $u.timeFormat(new
                  Date(item.logTime), "yyyy-mm-dd hh:MM:ss") }}</view>
              </view>
              <view class="amount"> +{{ (item.changeAmount / 100).toFixed(2) }}</view>
            </view>
            <view
              class="record-more"
              @click="seeMore()"
            >查看更多></view>
          </template>
        </block>
        <block v-if="tabIndex == 2">
          <template v-if="cashList.length == 0">
            <view class="empty-tip">暂无记录</view>
          </template>
          <template v-else>
            <view
              class="record-list"
              v-for="(item, index) in cashList"
              :key="index"
            >
              <view class="icon">
                <image src="@/static/img/detail/money1.png">
                </image>
              </view>
              <view class="">
                <view class="name">{{ item.name }}</view>
                <view class="phone">{{ $u.timeFormat(new
                  Date(item.updateTime), "yyyy-mm-dd hh:MM:ss") }}</view>
              </view>
              <view class="amount"> +{{ (item.cashAmount / 100).toFixed(2) }}</view>
            </view>
            <view
              class="record-more"
              @click="seeMore()"
            >查看更多></view>
          </template>
        </block>
      </view>
    </view>

    <view
      class="poster"
      v-show="llustrate"
      @click="llustrate = !llustrate"
    >
      <swiper
        class="swiper"
        :indicator-dots="false"
        :autoplay="false"
        :circular="false"
        interval="3000"
        duration="500"
        @change="bindchange"
        previous-margin="40px"
        next-margin="40px"
      >
        <block
          v-for="(item, index) in spreadData"
          :key="index"
          class="img-list"
        >
          <swiper-item class="aaa">
            <div
              class="box"
              ref="bill"
              :class="swiperIndex == index ? 'active' : 'quiet'"
            >
              <view class="user-msg">
                <view class="user-code">
                  <image
                    class="canvas"
                    :style="{ height: hg + 'px' }"
                    :src="posterImage[index]"
                    v-if="posterImage[index]"
                  ></image>
                  <canvas
                    class="canvas"
                    :style="{ height: hg + 'px' }"
                    :canvas-id="'myCanvas' + index"
                    v-else
                  ></canvas>
                </view>
              </view>
            </div>
          </swiper-item>
        </block>
      </swiper>
    </view>

  </view>
</template>

<script>
import { getUserInfo } from '@/static/api/user.js'
import { scoreProfit, invitePage, incomePage, cashLogs } from "@/static/api/order.js";
import utils from "@/static/utils/utils";

export default {
  components: {},
  data() {
    return {
      titleName: '邀请好友',
      height: '60px',
      paddingTop: '20px',
      walletInfo: {}, //已获得收益
      my_inviter: '',//邀请码
      userInfo: {},
      spreadData: [{}], //新海报数据
      hg: 0,
      wd: 0,
      spread: [
        { "pic": "https://cdn.lingchuang.art/sdv/aiker/invite-friend-poster.jpg" }
      ],
      swiperIndex: 0,
      posterImage: [],
      llustrate: false,
      showCustomerService: false,
      tabIndex: 0,
      navTabList: [{ name: "邀请记录", type: 'my' }, { name: "收益记录", type: 'all' }, { name: "提现记录", type: 'like' }],
      inviteList: [],
      scoreList: [],
      cashList: [],
    };
  },
  created() {
    let that = this;
    // #ifdef MP
    let demo = uni.getMenuButtonBoundingClientRect();
    let statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    that.paddingTop = demo.top * 2 + "rpx";
    that.height = (statusBarHeight + 44) * 2 + 'rpx'
    // #endif
  },
  onLoad() {

    this.walletProfit()
    this.inviteListon(); // 邀请记录
    this.scoreListon();  // 收益记录
    this.cashListon();   // 提现记录

    getUserInfo({}).then((res) => {
      if (res.code == 200) {
        this.my_inviter = res.result.user.inviterCode
        getApp().globalData.my_inviter = this.my_inviter
        getApp().globalData.sharePath = `/pages/tabBar/gallery?inviter=${this.my_inviter}`;
        uni.setStorageSync('myInviter', this.my_inviter); // 存储用户邀请码
      }
    });
  },

  methods: {
    tabChange({ index }) {
      this.tabIndex = index

    },
    showCustomerServiceImg() {
      let url = 'https://cdn.lingchuang.art/sdv/aiker/partner-poster.png'
      uni.previewImage({
        current: url,   //当前图片地址
        urls: [url],        //所有要预览的图片的地址集合 数组形式
      })
    },
    toCash() {
      uni.navigateTo({
        url: '/pmine/cash/cash'
      })
    },

    // 查看更多
    seeMore() {
      uni.navigateTo({
        url: "/pmine/cash/cashHistory",
      })
    },
    // 邀请列表
    inviteListon() {
      let that = this;
      let data = {
        pageNum: 1,
        pageSize: 4,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      invitePage(data).then(res => {
        if (res.code == 200) {
          that.inviteList = res.result.records
          setTimeout(function () {
            uni.hideLoading()
          }, 500)
        }
      })
    },

    // 获取收益记录列表
    scoreListon() {
      let that = this;
      let data = {
        pageNum: 1,
        pageSize: 4,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      incomePage(data).then(res => {
        if (res.code == 200) {
          that.scoreList = res.result.list;
          setTimeout(function () {
            uni.hideLoading()
          }, 500)
        }
      })
    },

    // 获取提现记录列表
    cashListon() {
      let that = this;
      let data = {
        pageNum: 1,
        pageSize: 4,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      cashLogs(data).then(res => {
        if (res.code == 200) {
          let records = res.result.list;
          records.map(item => {
            item.name = item.status == 0 ? '申请处理中' : item.status == 1 ? "提现成功" : '提现退回'
          })
          setTimeout(function () {
            uni.hideLoading()
            that.cashList = that.cashList.concat(records);
          }, 500)
        }
      })
    },

    // 复制 
    copyKeyword() {
      utils.copyText(this.my_inviter)
    },
    llustrateStatus() {
      let that = this;
      that.llustrate = !that.llustrate
      this.$nextTick(() => {
        let selector = uni.createSelectorQuery().select('.aaa');
        selector.fields({
          size: true
        }, data => {
          this.wd = data.width
          this.hg = data.height
        }).exec();
      })

      if (that.spreadData[0].pic) {
        that.collectClick()
        return;
      }
      uni.showLoading({
        title: '海报生成中',
        mask: true
      });

      setTimeout(function () {
        that.spreadMsgs()
      }, 100)
    },

    bindchange(e) {
      let spreadList = this.spreadList;
      this.swiperIndex = e.detail.current;
      this.poster = spreadList.poster[e.detail.current]
    },

    //获取图片
    async spreadMsgs() {
      // let res = {
      // 	data: {
      // 		qrcode: "test",
      // 		spread: [
      // 			{ "pic": "https://cdn.drawai.cn/public/poster.jpg" }
      // 		]
      // 	}
      // }
      this.spreadData = this.spread
      this.nickName = this.userInfo.name;
      this.siteName = "埃客"

      let mpUrl = this.$baseURL + '/user/invite/getWxaCode/wxb365bb4eb4350a44/release'
      console.log('0000');
      mpUrl = await this.downloadFilestoreImage(mpUrl)
      if (!mpUrl) {
        return
      }
      this.qrcode = mpUrl
      console.log('1111111');
      for (let i = 0; i < this.spread.length; i++) {
        let that = this
        let img = this.spread[i].pic
        img = await this.downloadFilestoreImage(img);
        if (!img) {
          return
        }
        let arr2 = [this.qrcode, img]
        that.userPosterCanvas(arr2, that.userInfo.name, that.siteName, i, that.wd, that.hg, (tempFilePath) => {
          that.$set(that.posterImage, i, tempFilePath);
          console.log('22222');
          wx.showShareImageMenu({
            path: that.posterImage[0],
            success: (res) => {
              if (res.errMsg == 'showShareImageMenu:ok') {
                that.llustrate = false;
                uni.showToast({
                  title: '保存成功！',
                  icon: 'none',
                  duration: 3000,
                })
              }
            },
            fail: (res) => {
              if (res.errMsg.indexOf('deny') != -1 || res.errMsg.indexOf('denied') != -1) {
                uni.showToast({
                  title: '保存相册失败，请设置权限！',
                  icon: 'none',
                  duration: 2000,
                })
              } else {
                that.llustrate = false;
              }
            }
          });
        });
      }
      uni.hideLoading();
    },
    userPosterCanvas: function (arr2, nickname, sitename, index, w, h, successFn) {
      let that = this;
      const ctx = uni.createCanvasContext('myCanvas' + index);
      ctx.clearRect(0, 0, 0, 0);
      uni.getImageInfo({
        src: arr2[1],
        success: function (res) {
          const WIDTH = res.width;
          const HEIGHT = res.height;
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(arr2[1], 0, 0, w, h);
          ctx.setTextAlign('left')
          ctx.setFontSize(12);
          ctx.setFillStyle('#333');
          let codex = 0.32
          let codey = 0.51
          let codeSize = 0.35
          ctx.drawImage(arr2[0], w * codex, h * codey, w * codeSize, w * codeSize);
          ctx.save();
          ctx.draw(true, function () {
            uni.canvasToTempFilePath({
              canvasId: 'myCanvas' + index,
              fileType: 'png',
              quality: 1,
              success: function (res) {
                successFn && successFn(res.tempFilePath);
              }
            })
          });
        },
        fail: function (err) {
          uni.hideLoading();
          console.warn(err)
          uni.$u.toast("无法获取图片信息");
        }
      })
    },

    //图片转符合安全域名路径
    downloadFilestoreImage(url) {
      return new Promise((resolve, reject) => {
        let that = this;
        console.log('3333');
        uni.downloadFile({
          url: url,
          header: {
            Authorization: uni.getStorageSync('token')
          },
          success: (res) => {
            console.log(res, 'res520')
            resolve(res.tempFilePath);
          },
          fail: (err) => {
            console.error(err);
            reject(false)
            that.$util.Tips({
              title: '加载图片失败'
            });
          }
        });
      })
    },

    // 收藏
    collectClick() {
      let that = this;
      wx.showShareImageMenu({
        path: that.posterImage[0],
        success: (res) => {
          if (res.errMsg == 'showShareImageMenu:ok') {
            that.llustrate = false;
            uni.showToast({
              title: '保存成功！',
              icon: 'none',
              duration: 3000,
            })
          }
        },
        fail: (res) => {
          if (res.errMsg.indexOf('deny') != -1 || res.errMsg.indexOf('denied') != -1) {
            uni.showToast({
              title: '保存相册失败，请设置权限！',
              icon: 'none',
              duration: 2000,
            })
          } else {
            that.llustrate = false;
          }
        }
      });
    },

    // 收益统计
    walletProfit() {
      let that = this;
      scoreProfit({}).then(res => {
        if (res.code == 200) {
          that.walletInfo = res.result
        }
      })
    },
    shareWX() {
      // #ifdef APP-PLUS
      uni.share({
        provider: 'weixin',
        scene: "WXSceneSession",
        type: 5,
        imageUrl: getApp().globalData.shareImage,
        title: getApp().globalData.shareTitle,
        miniProgram: {
          id: 'gh_2cab7758e3ab',  // 微信小程序原始id，不是appid
          path: getApp().globalData.sharePath,
          type: 0,
          webUrl: 'https://m.drawai.cn/' + getApp().globalData.sharePath
        },
        success: (ret) => {
          console.log(JSON.stringify(ret));
        },
        fail: (err) => {
          console.error('----app分享失败');
        }
      });
      // #endif
      // #ifdef WEB
      uni.showToast({
        title: "请前往埃客AI小程序操作",
        icon: 'none'
      });
      // #endif
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
  },
}
</script>

<style lang="scss">
.posters {
  background-image: url('https://cdn.drawai.cn/public/bg%402x.png');
  background-size: 100% 100%;
  min-height: 100vh;
}

.rebate {
  text-align: center;
  margin: 10rpx auto;
}

.obtain {
  padding: 40rpx;
  margin: 20rpx 30rpx;
  background-image: url('https://cdn.drawai.cn/avatar/733987.jpg?t=1689228964929');
  background-size: 100% 100%;
  width: auto;
  min-height: 680rpx;
  // box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(0,0,0,0.08), 0rpx 0rpx 96rpx 0rpx rgba(0,0,0,0.12);
  border-radius: 48rpx;
  position: relative;
}

.obtain .obtain-name {
  margin-top: 50rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #B22B4E;
  padding-bottom: 40rpx;
  position: relative;
}

.obtain-stop {
  text-align: center;
  position: relative;
}

.obtain-stop .name {
  font-weight: 400;
  color: #C37086;
  font-size: 24rpx;
  line-height: 40rpx;
}

.obtain-stop .total {
  font-size: 64rpx;
  font-weight: 500;
  color: #3A0211;
  line-height: 88rpx;
  margin-bottom: 30rpx;

  .num {
    margin: 0 32rpx 0 160rpx;
  }

  .cash-btn {
    width: 128rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    color: #000;
    font-size: 28rpx;
    font-weight: 500;
    background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
    border-radius: 48rpx;
  }
}


.obtain-code {
  height: 132rpx;
  line-height: 132rpx;
  border-radius: 24rpx;
  text-align: center;
  color: #C37086;
  border: 2px dashed rgba(232, 203, 210, 1);
  position: relative;
}

.obtain-code::before {
  content: '';
  position: absolute;
  left: 0rpx;
  right: 0rpx;
  bottom: -120rpx;
  height: 2px;
  border-bottom: 2px dashed rgba(232, 203, 210, 1);
}

.obtain-code text {
  color: #3A0211;
  font-weight: 600;
}

.obtain-code image {
  width: 40rpx;
  height: 40rpx;
  position: relative;
  top: 8rpx;
  margin-left: 20rpx;
}

.more-commission {
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;
  width: 220rpx;
  height: 56rpx;
  line-height: 56rpx;
  color: #000;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
}

.obtain-flex {
  display: flex;

  button {
    background: none !important;
  }
}

.obtain-flex {
  display: flex;
  justify-content: space-around;
  margin-top: 80rpx;

}

.obtain-flex .conpt {
  color: #B22B4E !important;
  height: 116rpx;
  font-size: 32rpx !important;
  line-height: 116rpx !important;
  width: 50% !important;
  text-align: center;
  position: relative;
}

.obtain-flex .conpt:last-child::before {
  position: absolute;
  content: '';
  left: 0;
  top: 34rpx;
  height: 50rpx;
  border-left: 2px dashed rgba(232, 203, 210, 1);
}

.obtain-flex .conpt image {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  position: relative;
  top: 8rpx;
  right: 18rpx;
}

.flowpath {
  background: #FAF1F7;
  box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(0, 0, 0, 0.08), 0rpx 0rpx 96rpx 0rpx rgba(0, 0, 0, 0.12);
  border-radius: 48rpx 48rpx 48rpx 48rpx;
  padding: 40rpx;
  margin: 30rpx;
  position: relative;
}

.flowpath-name {
  padding-bottom: 30rpx;
  font-weight: 600;
  color: #B22B4E;
}

.flowpath-item {
  font-size: 28rpx;
  color: #BC284E;
  font-weight: 400;
  line-height: 44rpx;
  padding-bottom: 20rpx;
  display: flex;
}

.flowpath-item .sort {
  color: white;
  width: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  position: relative;
  top: -4rpx;
  font-size: 16rpx;
  margin-right: 26rpx;
  background-image: url('https://cdn.drawai.cn/public/%E6%A1%86%402x.png');
  background-size: 100% 100%;
}

.flowpath .coin {
  position: absolute;
  right: -30rpx;
  bottom: -40rpx;
  width: 176rpx;
  height: 176rpx;
}

.rule {
  font-size: 28rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #A62F4E;
  line-height: 64rpx;
  text-align: center;
  padding-bottom: 30rpx;
}

.my-nav {
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  z-index: 100;

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
  }

  .title {
    padding: 0;
    font-size: 28rpx;
    font-family: Source Han Sans CN;
  }


}

.share {
  padding: 10rpx 0 0;
  height: 420rpx;
  border-top: 1px solid #3D3D3D;
  background: #121212;
  border-radius: 48rpx 48rpx 0 0;
}

.share-item {
  display: flex;
  justify-content: space-around;

  color: rgba(18, 18, 18, 0.52);
  line-height: 28rpx;
  margin: 40rpx 0 50rpx
}

.share-item .list {
  text-align: center;
  font-size: 20rpx !important;
}

.share-item .icons {
  width: 112rpx;
  height: 112rpx;
  background: rgba(244, 244, 244, 0.08);
  border-radius: 20rpx;
  margin-bottom: 30rpx
}

.share-item image {
  width: 64rpx;
  height: 64rpx;
  margin-top: 20rpx;
}

.share-colse {
  background: #242424;
  text-align: center;
  line-height: 160rpx;
  color: #777777;
}



.poster {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.52);
  z-index: 10075;
}

.swiper {
  width: 100%;
  height: 1000rpx;
  position: relative;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10076;
}

.canvas {
  width: 100%;
}

.box {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 18rpx;
  overflow: hidden;

  .user-msg {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .user-code {
      width: 100%;
      // height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      justify-content: space-between;

      image {
        width: 100%;
      }
    }
  }
}

.mask-box {
  width: 100%;
  height: 100%;

  .img {
    width: calc(100% - 100rpx);
  }
}


.record {
  background: #fff;
  margin: 30rpx;
  padding: 30rpx;
  color: #000;
  border-radius: 24rpx;
}

.empty-tip {
  width: 100%;
  height: 150rpx;
  line-height: 150rpx;
  color: #333;
  text-align: center;
  font-size: 28rpx;
  font-weight: 500;
}

.record-list {
  display: flex;
  position: relative;
  padding: 30rpx 0rpx;
}

.record-list .icon {
  background: #ECECEC;
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
  color: #000;
  line-height: 44rpx;
}

.record-list .phone {
  font-size: 20rpx;
  color: #000;
  line-height: 28rpx;
  margin-top: 8rpx;
}

.record-list .time {
  position: absolute;
  top: 26rpx;
  right: 10rpx;
  font-size: 20rpx;
  color: #000;
}

.record-list .amount {
  color: #F04455;
  font-size: 32rpx;
  position: absolute;
  top: 40rpx;
  right: 10rpx;
}

.record-more {
  text-align: center;
  line-height: 40rpx;
  padding-bottom: 30rpx;
  color: #000;
  font-size: 22rpx;
}
</style>