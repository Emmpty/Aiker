<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="详情"
    />


    <view
      class="darw-image-box u-flex u-col-center u-row-center"
      style="width: 100%;"
    >
      <image
        class="darw-image"
        :src="drawData.cover"
        mode="heightFix"
      ></image>
    </view>

    <view class="copywriting-box">
      <view class="title">{{ getDetailPlatform(drawData.platform) }}平台文案</view>

      <view class="copywriting-list u-flex-col ">
        <view
          class="copywriting-item"
          v-for="(item, index) in drawData.copywritingList"
          :key="index"
        >
          <view class="u-flex u-col-center">
            <view class="copywriting-item-title u-m-r-8">文案{{ index + 1 }}</view>
            <button
              class="copy-btn u-flex u-col-center u-row-center"
              @click="copyText(item.desc)"
            >
              <i class="iconfont icon-fuzhi u-m-r-4"></i>复制</button>
          </view>
          <view class="copywriting-item-content u-m-t-16">{{ item.desc }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { aiCopywritingDetail } from "@/static/api/draw.js";
import utils from "@/static/utils/utils";

export default {
  data() {
    return {
      videoParam: {},    // 页面传递数据
      drawData: {
        cover: '',
        platform: '',
        copywritingList: [],
      },
    }
  },
  async onLoad(option) {
    if (option.videoData) {
      this.videoParam = JSON.parse(option.videoData)
      this.getCurrentDrawData()
    }
  },
  methods: {
    async getCurrentDrawData() {
      try {
        const { code, result } = await aiCopywritingDetail({ userId: this.videoParam.authorId, id: this.videoParam.id })
        if (code == 200 && result) {
          console.log(result);
          this.drawData.platform = result.platform
          this.drawData.cover = result.cover
          this.drawData.copywritingList = result.prompt && JSON.parse(result.prompt) || []
        }
      } catch (error) {
        console.error(error);
      }
    },
    getDetailPlatform(platform) {
      switch (platform) {
        case 2:
          return '小红书';
        case 3:
          return '抖音';
        case 4:
          return '快手';
        case 5:
          return '视频号';
        default:
          return '';
      }
    },
    copyText(text) {
      utils.copyText(text)
    },
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  color: var(--text-color);
  padding: 32rpx;
  padding-bottom: calc(40rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));

  .darw-image-box {
    width: 100%;
    height: 472rpx;

    .darw-image {
      height: 100%;
      max-width: 100%;
    }
  }

  .copywriting-box {
    margin-top: 64rpx;

    .title {
      font-size: 36rpx;
      font-weight: 800;
    }

    .copywriting-list {
      margin-top: 20rpx;

      .copywriting-item {
        padding: 28rpx;
        background: #1C1C1D;
        border-radius: 8rpx;

        .copywriting-item-title {
          font-size: 28rpx;
          font-weight: 500;
        }

        .copy-btn {
          width: 88rpx;
          height: 36rpx;
          border-radius: 32rpx;
          opacity: 0.6;
          border: 2rpx solid #C6C6C6;
          background-color: transparent;
          font-size: 20rpx;
          color: #fff;
          font-weight: 500;
          text-align: center;

          .icon-fuzhi {
            font-size: 20rpx;
          }
        }

        .copywriting-item-content {
          font-size: 24rpx;
          font-weight: 400;
          color: #959595;
        }
      }

      .copywriting-item+.copywriting-item {
        margin-top: 32rpx;
      }
    }
  }
}
</style>
