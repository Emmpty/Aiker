<template>
  <!-- <page-meta
    :background-color-top="cueTheme == 'day-theme' ? '#ffffff' : '#000000'"
    :background-color-bottom="cueTheme == 'day-theme' ? '#ffffff' : '#000000'"
  >
  </page-meta> -->
  <view
    class="u-page"
    :class="cueTheme"
  >

    <view
      v-if="advList.length > 0"
      class="swiper-box"
      style="padding:20rpx;"
    >
      <swiper
        :autoplay="true"
        :circular="true"
        indicator-active-color="#1AFFE8"
        indicator-color="#D9D9D9"
        :indicator-dots="advDrop > 1 ? true : false"
        style="height:324rpx;"
      >
        <block
          v-for="(item, index) in advList"
          :key="index"
        >
          <swiper-item
            v-if="item.hide == 0"
            @tap="openSheet(item)"
            style="height:324rpx;"
          >
            <image
              class="slide-image"
              :src="item.image"
              mode="widthFix"
              :show-menu-by-longpress="false"
              style="height:324rpx;"
            ></image>
          </swiper-item>
        </block>
      </swiper>
    </view>

    <u-sticky :bgColor="cueTheme == 'day-theme' ? '#fff' : '#141416'">
      <u-tabs
        :list="tabList"
        :current="tabCurrent"
        @change="tabChange"
        lineColor="#1affe8"
        :activeStyle="{
          color: '#1affe8',
          fontWeight: 'bold',
          transform: 'scale(1.05)'
        }"
        :inactiveStyle="{
          color: cueTheme == 'day-theme' ? '#666666' : '#fff',
          transform: 'scale(1)'
        }"
      >
      </u-tabs>

      <scroll-view
        scroll-x="true"
        v-if="tabCurrent == 0"
      >
        <view class="wrap_subsection">
          <block
            v-for="(item, index) in recomList"
            :key="index"
          >
            <view
              class="subsection_item"
              :class="{ 'subsection_item_check': recomType == index }"
              @click="recomTab(item.id, index)"
              v-if="item.hide == 0"
            >
              {{ item.label }}</view>
          </block>
        </view>
      </scroll-view>
      <view
        style="height:20rpx;"
        v-if="tabCurrent == 1"
      ></view>
    </u-sticky>


    <waterfall_list
      :list="galleryDrawList"
      ref="uWaterfall"
      @clickAlbumDetails="clickAlbumDetails"
    ></waterfall_list>


    <u-back-top
      :scroll-top="scrollTop"
      top="600"
    ></u-back-top>

  </view>
</template>

<script>
import { getGalleryList, getGalleryDetail } from "@/static/api/draw.js";

import waterfall_list from "./components/gallery/zero-waterfallshowList.vue";
import utils from "@/static/utils/utils";
import datajosn from "@/static/utils/datajosn";
import { mapState } from "vuex";

export default {
  name: "index",
  components: {
    waterfall_list,
  },
  props: {},
  data() {
    return {
      tabList: [{ name: "推荐", type: 'best' }, { name: "最新", type: 'latest' }, { name: "热门", type: 'hot' }],
      tabCurrent: 0,
      rankSection: ["　日榜　", "　周榜　", "　月榜　"],
      rankType: 0, //热门下标
      dayRankList: [], // 热门列表
      dayRankLast: 0,
      recommend: [],// 推荐列表
      arrId: [], // // 推荐列表分页Id

      newNum: 1,//最新分页
      newList: [],//最新列表
      newTotal: 0, //最新总条数
      redStatus: false, // 推荐筛选状态
      newStatus: false,// 最新筛选状态
      visStatus: false, // 热门筛选状态
      filterIndex: null, // 筛选状态 1公开 2隐藏
      prompt: '',//搜索关键词

      // 
      searchList: [],
      searchNum: 1,
      searchStatus: false,

      labelStatus: false,
      popupStatus: false,//
      maskInfo: {},
      painIndex: 0,
      scrollTop: 0,

      versionApp: {},//app信息
      isupAppStatu: false, // 更新提示框
      updatesys: '', // 更新系统型号
      isupAppList: {}, // 更新系统型号
      updatesum: 0, // 更新进度条
      updateprogress: false, // 更新进行状态
      version: '',
      recomType: 0,  // 推荐分类下标
      recomList: [], // 推荐分类列表
      advList: [], //轮播列表
      advDrop: 0, //是否显示轮播点

      queryParam: {
        size: 10,
        type: 'best',
        exclude: [],
      },

      noMoreData: false,

    };
  },
  watch: {
    tabCurrent(newV, oldV) {
      delete this.queryParam.category
      this.queryParam.type = this.tabList[newV].type
      this.initData()
    },
  },
  computed: {
    ...mapState("draw", [
      "galleryDrawList",
    ]),
  },
  onLoad(option) {
    this.getDrawList()
    // 保存邀请码
    if (option.inviter) {
      uni.setStorageSync("inviter", option.inviter);
    }
    if (option.scene) {
      const code = decodeURIComponent(option.scene);
      uni.setStorageSync("inviter", code);
    }


    datajosn.settings((data) => {
      let advList = data.adv.filter((item) => item.hide == 0)
      this.recomList = data.classifyType || []
      this.advDrop = advList.length
      this.advList = advList || []
    })


  },

  // 上拉
  onReachBottom() {
    console.log('1111111111');
    this.getDrawList()
  },

  methods: {
    initData(pullDown) {
      this.queryParam.nextId = ''
      this.queryParam.exclude = []
      this.noMoreData = false
      this.$refs.uWaterfall && this.$refs.uWaterfall.clear();
      this.$store.commit('draw/changeGalleryDrawList', [])
      uni.pageScrollTo({
        scrollTop: 0
      })
      this.getDrawList(pullDown)
    },
    getTurntable() {
      uni.navigateTo({
        url: '/phome/lottery/turntable',
      });
    },

    openSheet(item) {
      if (item.type == 'page') {
        uni.navigateTo({
          url: item.target,
        });
      } else {
        uni.navigateTo({
          url: '/pmine/webviewManage/webviewManage?url=' + item.target,
        });
      }
    },


    //获取画册列表
    async getDrawList(pullDown) {
      if (this.noMoreData) return   // 没有更多数据了

      try {
        uni.showLoading({ title: '加载中...', mask: true, })
        const { code, result } = await getGalleryList(this.queryParam)
        uni.hideLoading()
        if (pullDown) {
          uni.stopPullDownRefresh();
        }
        if (code == 200) {

          // 判断是否还有下一页
          if (!result.nextId) {
            this.noMoreData = true
          } else {
            this.queryParam.nextId = result.nextId
          }

          let list = result.list
          this.queryParam.exclude = this.queryParam.exclude.concat(list.map((item) => item.id))

          this.$store.commit('draw/changeGalleryDrawList', this.galleryDrawList.concat(list))
          this.queryParam.nextId = result.nextId
        }
      } catch (error) {
        console.error(error);
        uni.hideLoading()
      }
    },

    // 影展切换 
    tabChange({ index }) {
      this.tabCurrent = index
    },

    // 推荐分类
    recomTab(id, index) {
      this.recomType = index
      if (index === 0) {
        delete this.queryParam.category
      } else {
        this.queryParam.category = id
      }
      this.initData()
    },

    clickAlbumDetails(item) {
      const data = {
        id: item.id,
        authorId: item.userId,
        queryParam: this.queryParam,
        isMine: false,
      }
      uni.navigateTo({
        url: "/pages/videoSwiper/videoSwiper?videoData=" + JSON.stringify(data),
      });
    }
  },

  onShow() {

  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    console.log('22222');
    this.initData(true)
  },
  // 页面处理函数--用户点击右上角分享
  onShareAppMessage(options) {
    if (options.from === "button") {
      // 来自页面内分享按钮
    }
    console.log(options, getApp().globalData.sharePath);
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



<style scoped="scoped" lang="scss">
.scroll {
  position: relative;
  height: 80rpx;
}

.tabber-tips {
  position: absolute;
  top: 0rpx;
  right: 0;
  background: white;
  width: 80rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
}

.tabber-tips image {
  width: 36rpx;
  height: 36rpx;
}

.tabber .tabber-item {
  display: inline-block;
  width: 130rpx;
  text-align: center;
  line-height: 60rpx;
  border-radius: 70rpx;
  border: 2rpx solid rgba(18, 18, 18, 0.08);
  margin: 10rpx;
  font-size: 24rpx;
}

.tabber .tabber-active {
  background: #121212;
  color: white;
}

.label {
  padding: 30rpx;
  border-radius: 24rpx 24rpx 0 0;
}

.label-title {
  line-height: 84rpx;
  padding-bottom: 20rpx;
  position: relative;
  padding-left: 10rpx;
  font-size: 36rpx;
  color: #121212;
  font-weight: 500;
}

.label-title image {
  width: 42rpx;
  height: 42rpx;
  position: absolute;
  top: 10rpx;
  right: 0rpx;
}

.label-name {
  line-height: 84rpx;
  padding-bottom: 20rpx;
  position: relative;
  padding-left: 10rpx;
  font-size: 28rpx;
  color: rgba(18, 18, 18, 0.66);
  font-weight: 400;
}

.label-black {
  line-height: 84rpx;
  padding-bottom: 20rpx;
  position: relative;
  padding-left: 10rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: white;
}

.label-size .label-size-list {
  width: 33.3%;
  display: inline-block;
  text-align: center;
  font-size: 28rpx;
}

.label-size .label-size-list .item {
  height: 80rpx;
  width: 218rpx;
  line-height: 80rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.16);
  border-radius: 70rpx;
  margin: 8rpx;
  color: rgba(255, 255, 255, 0.66);
}

.label-size .label-size-list .active {
  background: #141416;
  color: white !important;
}

.label-size .label-size-list .blackb {
  background: rgba(50, 255, 187, 0.08);
  border-radius: 40rpx;
  opacity: 1;
  color: #141416;
  border: 2rpx solid #61ffff;
}

.label-footer {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-top: 100rpx;
}

.label-footer .resetting {
  width: 36%;
  height: 86rpx;
  line-height: 86rpx;
  border-radius: 43rpx 43rpx 43rpx 43rpx;
  opacity: 1;
  color: white;
  border: 2rpx solid #f8f8f8;
}

.label-footer .deter {
  width: 60%;
  height: 86rpx;
  line-height: 86rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 43rpx 43rpx 43rpx 43rpx;
  opacity: 1;
}

.u-page {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.navadmin {
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx 10rpx;
  background: #141416;
}

.navadmin .input {
  width: 280px;
  height: 40px;
  background: #262628;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 12px;
  padding-left: 20rpx;
}

.navadmin .inputv {
  width: 280px;
  height: 40px;
  background: #F5F5F5;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 12px;
  padding-left: 20rpx;
}

.navadmin .navitem {
  width: 140rpx;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 70rpx;
  border: 1px solid #1AFFE8;
  text-align: center;
  background: #262628;
  color: #1AFFE8;
  font-size: 26rpx;
  margin-top: 12rpx;
}

.reload {
  width: 34px;
  height: 34px;
  margin-top: 10rpx;
  margin-left: 20rpx;
}

.demo-warter {
  border-radius: 8px;
  margin: 5px;
  // background: #262628;
  padding: 10px;
  position: relative;
  text-align: right;
}

.chuang {
  color: white;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 70rpx;
  padding: 0 10rpx;
  background: #262628;
  display: flex;
  justify-content: space-between;
  border-radius: 0 0 14rpx 14rpx;

  .title2 {
    width: 120rpx;
    overflow: hidden;
  }

  .shstatuss {
    width: 40rpx;
    height: 40rpx;
    margin-top: 10rpx;
  }

  .button {
    // line-height: 22rpx;
    // color: white;
    background: none;
    margin: 0 !important;
    padding: 0;

  }

  .item {
    image {
      width: 40rpx;
      height: 40rpx;
      position: relative;
      top: 8rpx;
      margin-right: 10rpx;
    }
  }
}

.waterfall-item {
  background: #141416;
}

.u-close {
  position: absolute;
  top: 32rpx;
  right: 32rpx;
}

.demo-image {
  width: 100%;
  border-radius: 4px;
}

.demo-title {
  font-size: 30rpx;
  margin-top: 5px;
  color: $u-main-color;
}

.demo-tag {
  display: flex;
  margin-top: 5px;
}

.demo-tag-owner {
  // background-color: $u-error;
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 4rpx 14rpx;
  border-radius: 50rpx;
  font-size: 20rpx;
  line-height: 1;
}

.demo-tag-text {
  border: 1px solid $u-primary;
  color: $u-primary;
  margin-left: 10px;
  border-radius: 50rpx;
  line-height: 1;
  padding: 4rpx 14rpx;
  display: flex;
  align-items: center;
  border-radius: 50rpx;
  font-size: 20rpx;
}

.demo-price {
  font-size: 30rpx;
  // color: $u-error;
  color: $u-tips-color;
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
}

.demo-shop {
  font-size: 22rpx;
  color: $u-tips-color;
  margin-top: 5px;
  display: flex;
  // justify-content: flex-end;
}

.load-icon {
  width: 300rpx;
  height: 300rpx;
  margin: 0 auto 20rpx auto;
  display: block;
}

.load-txt {
  padding: 0 0 20rpx 0rpx;
  text-align: center;
  color: #999;
  font-size: 24rpx;
}

.wrap_subsection {
  display: flex;
  margin: 0 20rpx;
  padding: 20rpx 0;

  .subsection_item {
    width: 64px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10rpx 0;
    color: var(--text-color);
  }

  .subsection_item_check {
    color: #141416;
    background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
    border-radius: 18px;
  }
}
</style>

<style scoped="scoped" lang="scss">
// 00000000000000000
.filter {
  background: #2E2E33;
  border-radius: 16px 16px 0px 0px;
  opacity: 1;
  z-index: 999;
  color: white;
  padding: 0 30rpx 40rpx;

}

.filter-top {
  text-align: center;
  line-height: 120rpx;
  margin-bottom: 10rpx;
}

.filter-list {
  line-height: 100rpx;
  text-align: center;
}

.filter-active {
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: #262628;
  color: white !important;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.pubuBox {
  background: #141416;
  padding: 22rpx;
  height: 100%;
}

.pubuItem {
  column-count: 2;
  column-gap: 20rpx;
  break-inside: avoid;
  ;
  /*视为一个整体 不会被分开*/
}

.item-masonry {
  box-sizing: border-box;
  border-radius: 15rpx;
  overflow: hidden;
  background: #262628;
  /* // background-color: #141416; */
  break-inside: avoid;
  /*避免在元素内部插入分页符*/
  box-sizing: border-box;
  margin-bottom: 20rpx;
  box-shadow: 0px 0px 28rpx 1rpx rgba(78, 101, 153, 0.14);
  position: relative;

  .shstatus {
    position: absolute;
    width: 54rpx;
    height: 54rpx;
    z-index: 9;
    margin: 20rpx;
  }

  .under {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 220rpx;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: 600;
  }
}

.item-masonry image {
  width: 100%;
}

.listtitle {
  padding-left: 22rpx;
  font-size: 24rpx;
  padding-bottom: 22rpx;

  .listtitle2 {
    color: white;
    font-size: 26rpx;
    line-height: 32rpx;
    // font-weight: bold;
    // padding-top: 22rpx;
    display: flex;
    padding-right: 22rpx;
    justify-content: space-between;

    .avact {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
    }

    image {
      width: 40rpx;
      height: 40rpx;
      position: relative;
      top: 8rpx;
      right: 10rpx;
    }
  }

  .listtitle3 {
    font-size: 28rpx;
    color: #909399;
    line-height: 32rpx;
    padding-top: 22rpx;
  }
}

.Index {
  width: 100%;
  height: 100%;
}

.upAppBg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 750rpx;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upAppBox {
  width: 600rpx;
  padding: 20rpx 0 50rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upAppBox_title {
  line-height: 80rpx;
  font-weight: bold;
}

.upAppBox_content {
  padding: 10rpx 0 0rpx;
  font-size: 26rpx;
}

.upAppBox_btn {
  margin-top: 50rpx;
  width: 500rpx;
  line-height: 80rpx;
  text-align: center;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 24px;
}
</style>
