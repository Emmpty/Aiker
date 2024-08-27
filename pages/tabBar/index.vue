<template>
  <view
    class="page"
    :class="cueTheme"
  >
    <view class="ai-apple-list u-flex-col">
      <view
        class="apple-item"
        v-for="(item, index) in appleList"
        :key="index"
        :style="{ background: `url(${item.bgImg}) no-repeat`, backgroundSize: '100%' }"
        @click="appleItemClick(item)"
      >
        <view class="item-title">{{ item.name }}</view>
        <view class="item-introduce u-m-t-20">{{ item.introduce }}</view>
        <image
          v-if="item.name == '山水动图'"
          class="item-icon"
          src="@/static/img/draw/hot.png"
        ></image>
      </view>
    </view>

    <!-- 公告 -->
    <e-model
      v-if="showModel"
      :showModel="showModel"
      :title="notifyData.title"
      :hideCancel="true"
      confirmText="我知道了"
      @cancelHandle="showModel = false"
      @confirmHandle="showModel = false"
    >
      <template slot="content">

        <view class="tips-box ">
          <image
            v-if="notifyData.image"
            class="tips-image"
            mode="widthFix"
            :src="notifyData.image"
          ></image>

          {{ notifyData.content }}
        </view>
      </template>
    </e-model>

    <view style="height:1px"></view>
  </view>
</template>
<script>
import { notifyPull } from "@/static/api/system.js";
import utils from "@/static/utils/utils";
import datajosn from "@/static/utils/datajosn";

export default {
  components: {
  },
  data() {
    return {
      showModel: false,
      notifyData: {},   // 公告
      drawSetting: {
        hideDraw: false,
        time: '',
      },
      appleList: [
        {
          name: '视频动漫',
          introduce: '一键视频转动漫神器',
          bgImg: 'https://cdn.lingchuang.art/sdv/aiker/video-cartoon.png',
          pageUrl: '/phome/VideoCartoon/VideoCartoon'
        },
        {
          name: '图生视频',
          introduce: '一键让你的图片动起来吧~',
          bgImg: 'https://cdn.lingchuang.art/sdv/aiker/ai-video.png',
          pageUrl: '/phome/AIVideo/AIVideo'
        },
        {
          name: '山水动图',
          introduce: '一键成片神器，更能自动生成发布文案',
          bgImg: 'https://cdn.lingchuang.art/sdv/aiker/landscape.png',
          pageUrl: '/phome/AILandscape/AILandscape'
        },
        {
          name: '图片说话',
          introduce: '一键让人像图片开口说话',
          bgImg: 'https://cdn.lingchuang.art/sdv/aiker/ai-subtitle/ai-subtitles.png',
          pageUrl: '/phome/AISubtitles/AISubtitles'
        },
        {
          name: '一键高清',
          introduce: '上传视频秒变高清，快来试试吧',
          bgImg: 'https://cdn.lingchuang.art/sdv/aiker/ai-hd.png',
          pageUrl: '/phome/AIHD/AIHD'
        },
        {
          name: '图生文案',
          introduce: '上传一张图片秒出爆款文案',
          bgImg: 'https://cdn.lingchuang.art/sdv/aiker/ai-copywriting.png',
          pageUrl: '/phome/AICopywriting/ImageToCopywriting'
        },
        {
          name: '光影舞蹈',
          introduce: '流量密码：光影错觉下的舞蹈世界',
          bgImg: 'https://cdn.lingchuang.art/sdv/aiker/ai-dance.png',
          pageUrl: '/phome/AIDance/AIDance'
        },

      ],
    };
  },

  onLoad(e) {
    this.fetchNotify()
    // this.getDrawSetting()
  },
  onShow() {

  },
  onHide() {

  },
  methods: {
    // 获取画板配置
    async getDrawSetting() {
      datajosn.settings((data) => {
        this.drawSetting = data.drawSetting || {}
      })
    },
    fetchNotify() {
      // 公告
      let startTime = uni.getStorageSync('startTime') || null
      notifyPull({ startTime: startTime }).then(res => {
        if (res.code == 200) {
          uni.setStorageSync("startTime", utils.getTime());
          this.notifyData = res.result;
          this.showModel = res.result.content ? true : false;
        }
      })
    },
    appleItemClick(item) {
      if (!getApp().globalData.getLogin()) { // 验证登录手机状态
        return
      }
      uni.navigateTo({
        url: item.pageUrl
      });
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
  
<style lang="scss" scoped>
.page {
  background-color: var(--bg-color);
  width: 100%;
  min-height: 100vh;
  padding-bottom: 140rpx;
  padding-bottom: calc(140rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
}

.ai-apple-list {
  padding: 32rpx;

  .apple-item {
    color: #fff;
    height: 164rpx;
    padding: 40rpx 24rpx;
    border-radius: 20rpx;
    position: relative;

    .item-title {
      font-size: 36rpx;
      font-weight: bold;
    }

    .item-introduce {
      font-size: 24rpx;
      color: #ECECEC;
    }

    .item-icon {
      width: 98rpx;
      height: 98rpx;
      position: absolute;
      right: 0;
      top: 0;
    }

    .icon-hot {
      position: absolute;
      right: 0;
      top: 0;
      color: #F03939;
      font-size: 100rpx;
    }
  }

  .apple-item+.apple-item {
    margin-top: 32rpx;
  }
}

.tips-box {
  font-size: 26rpx;
  text-align: left;
  line-height: 40rpx;
  padding: 0 20rpx;

  .tips-image {
    width: 100%;
    margin-bottom: 36rpx;
  }
}
</style>