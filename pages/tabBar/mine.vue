<template>
  <view
    class=" page"
    :class="cueTheme"
  >
    <view class="flex-col user-info-box">
      <view class=" relative section_3 u-flex u-row-between u-col-center">
        <view class="flex-row items-center space-x-16">
          <image
            class="image_7"
            :src="userInfo.avatar"
            mode="scaleToFill"
          />
          <view
            class="flex-col items-start space-y-14"
            v-if="userInfo.id"
          >
            <view class="text_3">
              <view class="text">{{ userInfo.nickname }} </view>
              <!-- <vipLevel
                  :userVipLevel="userInfo.level"
                  imgStyle="top: -6rpx;left: 10rpx;width: 126rpx;height: 45rpx;"
                ></vipLevel> -->
            </view>
            <view class="font_1 text_4">总点数：{{ userInfo.point }}</view>
          </view>
          <view
            class="flex-col items-start space-y-14"
            v-else
            @click="gotoLogin"
          >
            <text class="text_3">去登录/注册</text>
          </view>
        </view>
        <image
          class="setting-img pos"
          @click="getSetup"
          src="https://img.drawai.cn/ai-video/icon/Group%2071%402x.png"
        />
      </view>

      <view class="menu-box u-flex  u-col-center u-row-between">
        <block
          v-for="(item, index) in menuList"
          :key="index"
        >
          <view
            v-if="item.name === '加交流群'"
            class="menu-item"
            @click="menuClickHandle(item, index)"
          >
            <!-- #ifdef MP -->
            <cell
              class="add-cell"
              iconUrl=""
              contactText=" "
              style="z-index:22222;position: absolute;opacity: 0.00003;"
              url='https://work.weixin.qq.com/gm/ee055a6b55db17fa30796daa41ddcd8a'
            />
            <!-- #endif  -->
            <image
              class="menu-img"
              :src="item.icon2"
            ></image>
            <!-- :src="cueTheme == 'day-theme' ? item.icon2 : item.icon" -->
            <view class="menu-name">{{ item.name }}</view>
          </view>
          <view
            v-else
            class="menu-item"
            @click="menuClickHandle(item, index)"
          >
            <image
              class="menu-img"
              :src="item.icon2"
            ></image>
            <image
              v-if="item.name === '邀请有奖'"
              class="menu-hot-img"
              src="/static/img/mine/hot.png"
            ></image>
            <view class="menu-name">{{ item.name }}</view>
          </view>
        </block>
        <view style="clear: both;"></view>

      </view>
    </view>

    <u-sticky :bgColor="cueTheme == 'day-theme' ? '#fff' : '#141416'">
      <view style="height:10rpx"></view>
      <u-tabs
        :list="navTabList"
        :current="navtabIndex"
        @change="tabChange"
        lineColor="#1affe8"
        :activeStyle="{
          color: '#1affe8',
          fontWeight: 'bold',
          fontSize: '36rpx',
          transform: 'scale(1.05)'
        }"
        :itemStyle="{
          width: '33%',
          height: '88rpx'
        }"
        :inactiveStyle="{
          color: cueTheme == 'day-theme' ? '#666666' : '#fff',
          fontSize: '36rpx',
          transform: 'scale(1)'
        }"
      ></u-tabs>
      <!-- 画册操作 -->
      <view
        v-if="navtabIndex === 0"
        class="edit-box u-flex u-row-between u-col-center"
      >
        <!-- 左侧容量 -->
        <view class="u-flex u-col-center">
          <text>{{ getUserVipText() }} </text>
          <i
            class="iconfont icon-gantanhao-quan"
            @click="showTips = true"
          ></i>
        </view>

        <!-- 右侧编辑按钮图标 -->

        <view class="icon-item">
          <image
            @click="choiceDelete()"
            :src="cueTheme != 'day-theme' ? '/static/img/clip/sort2.png' : '/static/img/clip/sort22.png'"
          >
          </image>
        </view>
      </view>
    </u-sticky>

    <waterfall
      :list="mineDrawList"
      :statusBox="editStatus"
      :viewType="1"
      ref="waterfallRef"
      @clickBox="waterfallClickHandle"
      @clickAlbumDetails="clickAlbumDetails"
    ></waterfall>

    <u-back-top
      :scroll-top="scrollTop"
      top="600"
    ></u-back-top>


    <!-- 编辑操作栏 -->
    <view
      class="edit-action-bar u-flex u-row-between u-col-center"
      v-if="editStatus"
    >
      <view class="action-left">
        <image
          class="icon"
          @click="editSelect()"
          :src="numberSize > 0 ? '../../static/img/clip/status_active.png' : '../../static/img/clip/status.png'"
        />
        <view>已选<text style="color:#00ebd3">{{ numberSize }}</text>项</view>
      </view>
      <view class="action-right">
        <view
          class="navitem"
          @click="deleteHandle()"
        >删除</view>
        <view
          class="navitem"
          @click="editCancelHandle"
        >取消</view>
      </view>
    </view>

    <u-popup
      :show="capacityShow"
      mode="center"
      border-radius="40"
    >
      <view class="capacity-box">
        <view class="capacity-title">温馨提示</view>
        <view class="capacity-tips">
          {{ capacityData.tips }}</view>
        <view
          class="capacity-btn"
          @click="capacityShow = !capacityShow"
        >知道了</view>
      </view>
    </u-popup>

    <u-action-sheet
      :show="sheetShow"
      :closeOnClickOverlay="true"
      :closeOnClickAction="true"
      cancelText="取消"
      :actions="sheetList"
      @close="sheetClose"
      @select="sheetClick"
    ></u-action-sheet>

    <e-model
      v-if="showTips"
      :showModel="showTips"
      title="温馨提示"
      confirmText="开通"
      @cancelHandle="showTips = false"
      @confirmHandle="goRecharge()"
    >
      <template slot="content">
        <view class="tips-box u-flex-col u-col-center">
          <view class="vip-text">普通用户仅保留7天内的作品</view>
          <view class="vip-text">开通VIP用户后保留30天已内的作品</view>
          <view class="vip-text">开通SVIP用户客保留60天已内的作品</view>
        </view>
      </template>
    </e-model>

  </view>
</template>

<script>
import { getDrawList, taskCapacity } from "@/static/api/draw.js";
import { getUserInfo } from "@/static/api/user.js";

import shareMethod from "@/static/utils/utils.js";
import waterfall from "./components/mine/zero-waterfall.vue";
import { mapState } from "vuex";
import utils from "@/static/utils/utils";

export default {
  components: { waterfall },
  data() {
    return {
      tabIndex: "3",
      userInfo: {
      }, // 用户信息
      // 功能列表
      menuList: [
        { name: '充值中心', icon: '/static/img/mine/icon2.png', icon2: '/static/img/mine/icon22.png', url: "/pmine/recharge/recharge" },
        { name: "邀请有奖", icon: '/static/img/mine/menu2.png', icon2: '/static/img/mine/menu22.png', url: "/pmine/inviteFriend/inviteFriend", },
        { name: "免费点数", icon: '/static/img/mine/menu1.png', icon2: '/static/img/mine/menu11.png', url: "/pmine/freeMana/freeMana", },
        { name: "联系客服", icon: '/static/img/mine/menu7.png', icon2: '/static/img/mine/menu77.png', url: "", },
        { name: "加交流群", icon: '/static/img/mine/menu5.png', icon2: '/static/img/mine/menu55.png', url: "", },
      ],
      filterModel: false,//主题切换弹窗状态
      current: '',
      imgheights: [],
      sheetUrl: "",
      sheetShow: false,
      sheetList: [
        { name: '跳转链接', type: "turn", index: 0 },
        { name: '保存图片', type: "save", index: 1 },
      ],
      bannerImgs: [],  // 轮播图
      filterIndex: 0,//主题颜色
      navTabList: [{ name: "作品", type: 'my' }, { name: "投稿", type: 'publish' }, { name: "喜欢", type: 'like' }],
      navtabIndex: 0,
      // 容量解析弹窗
      capacityShow: false,
      // 是否正在编辑状态
      editStatus: false,
      scrollTop: 0, //顶部距离
      numberList: [],// 已选中列表
      capacityData: {},
      // 异步请求相关
      queryParam: {
        size: 10,
        isAsc: false,
        exclude: [],
        type: 'my',
      },
      noMoreData: false,
      showTips: false,  // 展示vip介绍
      isNewRenderDone: false,
      noRefresh: false,
      pageScrollTop: 0,
    };
  },
  computed: {
    numberSize() {
      return this.numberList.length || 0
    },
    ...mapState("draw", [
      "mineDrawList",
    ]),
  },
  watch: {
    // navtabIndex(newV, oldV) {
    //   this.queryParam.type = this.navTabList[newV].type
    // }
  },
  onLoad() {
    if (uni.getStorageSync('token')) {
      this.infoTips()
      // this.initData()
    }
  },
  async onShow() {
    if (uni.getStorageSync('token')) {

      getUserInfo({}).then((res) => {
        if (res.code == 200) {
          this.userInfo = res.result.user
          uni.setStorageSync('userInfo', res.result.user);
        }
      }).catch((err) => {
        console.error(err);
      })

      // 有新制作时
      uni.$once('newDraw', (data) => {
        this.navtabIndex = 0
        this.queryParam.type = 'my'
        // this.infoTips()
        this.initData()
      })
      let noRefresh = uni.getStorageSync('noRefresh')
      if (noRefresh == true) {
        uni.setStorageSync('noRefresh', false)
        return
      }
      this.initData()

    } else {
      this.editStatus = false
      delete this.queryParam.nextId
      this.noMoreData = false
      this.$refs.waterfallRef && this.$refs.waterfallRef.clear()
      this.capacityData = {}
      this.$store.commit('draw/changeMineDrawList', [])
      this.userInfo = {}
    }
  },

  methods: {
    getLoadNum(num) {
      console.log('共加载了:' + num);
      !this.isNewRenderDone && uni.hideLoading()
      this.isNewRenderDone = true
    },
    // 数据初始化
    initData(pullDown) {
      uni.$u.throttle(async () => {
        if (this.noRefresh) return this.noRefresh = false
        console.log(pullDown);
        delete this.queryParam.nextId
        this.editStatus = false
        this.noMoreData = false
        this.$store.commit('draw/changeMineDrawList', [])
        this.$refs.waterfallRef && this.$refs.waterfallRef.clear()
        setTimeout(() => {
          this.getAlbumList(pullDown)
        }, 300);
      }, 300)
    },
    tabChange({ index }) {
      this.navtabIndex = index
      this.queryParam.type = this.navTabList[index].type
      this.initData()

    },
    //获取画册列表
    async getAlbumList(pullDown) {
      if (this.noMoreData) return   // 没有更多数据了

      try {
        uni.showLoading({ title: '加载中...', mask: true, })
        const { code, result } = await getDrawList(this.queryParam)
        uni.hideLoading()
        if (pullDown) {
          uni.stopPullDownRefresh();
        }
        if (code == 200) {

          let list = result.list;
          list.map(item => {
            item.statusBox = false;
            item.url = (item.status == 0 && item.url) ? item.url + '!thumb' : 'https://cdn.lingchuang.art/ling/load-error.jpg'
          })
          // 判断是否还有下一页
          if (!result.nextId) {
            this.noMoreData = true
          } else {
            this.queryParam.nextId = result.nextId
          }
          this.$store.commit('draw/changeMineDrawList', this.mineDrawList.concat(list))
        }
      } catch (error) {
        console.error(error);
        uni.hideLoading()
      }
    },
    // 画册--管理功能
    choiceDelete() {
      this.editStatus = true
    },
    // 画册点击事件
    waterfallClickHandle(data) {
      this.numberList = data;
    },
    // 全选反选
    editSelect() {
      let allStatus = this.numberSize > 0
      allStatus = !allStatus
      this.$refs.waterfallRef && this.$refs.waterfallRef.selectAll(allStatus);
    },
    // 删除
    deleteHandle() {
      this.$refs.waterfallRef && this.$refs.waterfallRef.albumDelete();
    },
    // 取消编辑状态
    editCancelHandle() {
      this.editStatus = false
      this.$refs.waterfallRef && this.$refs.waterfallRef.selectAll(false);
    },
    async infoTips() {
      try {
        const res = await taskCapacity({})
        if (res.code == 200) {
          this.capacityData = res.result;
        }
      } catch (error) {

      }
    },
    goRecharge() {
      if (!getApp().globalData.getLogin()) {
        return;
      }
      uni.navigateTo({
        url: '/pmine/recharge/recharge'
      })
    },
    // 去登录
    gotoLogin() {
      // #ifdef MP 
      let url = uni.getStorageSync('session') ? '/plogin/logintype?needRegister=true' : "/plogin/logintype";
      uni.navigateTo({
        url: url
      })
      // #endif

      // #ifndef MP  
      let urls = "/plogin/login"
      uni.navigateTo({
        url: urls
      })
      // #endif
    },

    // 关注 粉丝 列表
    followList(type) {
      if (!getApp().globalData.getLogin()) {
        return;
      }
      uni.navigateTo({
        url: type == 1 ? "/psetup/followlist" : "/psetup/fanlist"
      })
    },

    swiperChange(e) {
      this.current = e.detail.current;
    },

    openSheet(url) {
      this.sheetUrl = url;
      this.sheetShow = true;
    },

    sheetClose() {
      this.sheetShow = false;
    },

    sheetClick(item) {
      if (item.type == "save") {
        shareMethod.downLoadImage(this.sheetUrl)
        // getApp().globalData.downLoadImage(this.sheetUrl);
      } else if (item.type == "turn") {
        let url = this.bannerImgs[item.index].url
        uni.navigateTo({
          url: "/pmine/mine/webview?url=" + url
        })
      }
      this.sheetShow = false;
    },

    getswiperImgH(e, index) {
      //获取当前屏幕的宽度
      let winWid = uni.getSystemInfoSync().windowWidth;
      //减去两侧间距
      winWid = winWid - 16 * 2;
      //图片高度
      let imgh = e.detail.height;
      //图片宽度
      let imgw = e.detail.width;
      //计算的高度值
      let swiperH = winWid * imgh / imgw + 'px'
      //把每一张图片的高度记录到数组里
      this.imgheights[index] = swiperH;
      // 如果是第一次加载，初始化current
      if (this.current === undefined && index == 0) {
        this.current = 0;
      }
    },

    getSetup() {
      if (!getApp().globalData.getLogin()) {
        return;
      }
      uni.navigateTo({
        url: "/pmine/personal",
      });
    },

    //  
    menuClickHandle(item, index) {
      if (item.name == "联系客服") {
        utils.contactCustomer()
        return;
      } else if (item.name == "加交流群") {
        return
      }

      if (!getApp().globalData.getLogin()) { // 验证登录手机状态
        return
      }

      if (item.url) {
        uni.navigateTo({
          url: item.url + "?userId=" + this.userInfo.id + '&uidtype=1',
        });
      }
    },
    clickAlbumDetails(item) {
      const data = {
        id: item.id,
        authorId: item.userId,
        queryParam: this.queryParam,
        isMine: this.navtabIndex != 2,    // 区分我的相册和他人相册
        fromMine: true,    // 区分页面入口，获取不同接口列表
      }
      let url = `/pages/videoSwiper/videoSwiper?videoData=${JSON.stringify(data)}`
      if (item.type == 3) {
        url = `/phome/AICopywriting/textDetails?videoData=${JSON.stringify(data)}`
      }
      // if (!item.src) {
      //   return
      // }
      uni.navigateTo({
        url: url,
      });
    },
    getUserVipText() {
      let level = this.userInfo.level
      if (level == 0) {
        return '普通用户保留7天内的作品'
      } else if (level == 1) {
        return 'VIP用户保留30天内的作品'
      } else if (level == 2) {
        return 'SVIP用户保留60天内的作品'
      } else {
        return ''
      }
    },

  },

  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onPullDownRefresh() {
    this.initData(true)
  },
  onReachBottom() {
    // 加锁，避免在加载更多时用户频繁下拉导致的重复触发而渲染异常
    // if (!this.isNewRenderDone) return;

    this.getAlbumList()
  },
  // #ifdef MP
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
  // #endif
};
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 20rpx;
  background-color: var(--bg-color-page);


  .user-info-box {
    padding: 0 28rpx;
    background: linear-gradient(180deg, #000B20 0%, #141416 100%);
    border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);

    .section_3 {
      padding: 56rpx 28rpx;
      border-radius: 40rpx;

      .space-x-16 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-left: 32rpx;
        }

        .image_7 {
          width: 128rpx;
          height: 128rpx;
          // border: 1px solid #1affe8;
          border-radius: 50%;
        }
      }

      .space-y-14 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-top: 28rpx;
        }

        .text_3 {
          color: #ffffff;
          font-size: 36rpx;
          font-weight: 500;
          line-height: 33rpx;
          display: flex;
        }

        .text_3 .text {
          max-width: 200rpx;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .text_4 {
          color: #959595;
          line-height: 20rpx;
          font-size: 28rpx;
          font-weight: 500;
        }
      }

      .setting-img {
        width: 64rpx;
        height: 64rpx;
      }
    }

    .font_1 {
      font-size: 28rpx;
      font-family: PingFangSC-Regular;
      line-height: 26rpx;
      color: #ffffff;
    }
  }

}

.menu-box {
  color: white;
  border-radius: 30rpx;
  padding: 28rpx 10rpx;
  // background-color: var(--bg-color-2);
  background-color: #1F1F20;
  margin-bottom: 48rpx;

  .menu-item {
    position: relative;
    // float: left;
    text-align: center;
    font-size: 20rpx;
    flex: 1;

    .menu-img {
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 8rpx;
    }

    .menu-hot-img {
      width: 58rpx;
      height: 24rpx;
      position: absolute;
      right: 0;
      top: -12rpx;
    }

    .menu-name {
      font-size: 24rpx;
      color: var(--text-color);
    }
  }

  // .menu-item+.menu-item {
  //   margin-left: 42rpx;
  // }

  .add-cell {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.edit-box {
  padding: 20rpx 32rpx;
  font-size: 28rpx;
  display: flex;
  justify-content: space-between;
  background: var(--bg-color);
  color: #F5F5F5;

  .icon-gantanhao-quan {
    font-size: 28rpx;
    margin-left: 16rpx;
    margin-top: 2rpx;
  }

  .icon-item {
    width: 80rpx;
    height: 56rpx;
    display: inline-block;
    text-align: right;

    image {
      width: 40rpx;
      height: 40rpx;
    }
  }
}

.edit-action-bar {
  position: fixed;
  left: 0;
  right: 0;
  // #ifdef MP
  bottom: 0rpx;
  // #endif
  // #ifdef H5
  bottom: 98rpx;
  // #endif
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: space-between;
  height: 100rpx;
  z-index: 99;
  padding: 0 32rpx;

  .action-left {
    color: white;
    line-height: 100rpx;
    margin-left: 14rpx;
    font-size: 24rpx;
    display: flex;

    .icon {
      width: 40rpx;
      height: 40rpx;
      margin-top: 32rpx;
      margin-right: 10rpx;
    }
  }

  .action-right {
    display: flex;
    justify-content: right;

    .navitem {
      width: 140rpx;
      height: 66rpx;
      line-height: 66rpx;
      border-radius: 70rpx;
      border: 1px solid white;
      text-align: center;
      font-size: 26rpx;
      color: white;
      margin: 16rpx;
    }
  }
}

.capacity-box {
  width: 580rpx;
  border-radius: 20rpx;
  padding: 0 30rpx 50rpx;
  background-color: var(--bg-color-2);

  .capacity-title {
    line-height: 100rpx;
    text-align: center;
    font-size: 30rpx;
    font-weight: 700;
    color: var(--text-color);
  }

  .capacity-tips {
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: var(--text-color);
  }

  .capacity-btn {
    display: flex;
    justify-content: space-around;
    margin-top: 50rpx;
    background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
    line-height: 80rpx;
    border-radius: 80rpx;
  }
}
</style>