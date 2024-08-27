<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="图生文案"
    />

    <view class="page-item">
      <view class="page-title">上传参考图</view>
      <view
        class="upload-box u-flex u-col-center u-row-center"
        @click="uploadImage()"
      >
        <view
          v-if="!imageUrl"
          class="upload-image-box u-flex u-flex-col u-col-center u-row-center"
        >
          <image
            class="upload-image"
            src="https://img.drawai.cn/icon/Union%402x.png"
            mode="widthFix"
          ></image>
          <view class="upload-text">上传图片</view>
        </view>

        <image
          v-else
          class="darw-image"
          :src="imageUrl"
          mode="heightFix"
        ></image>
      </view>

      <view class="u-m-t-32">
        <view class="landscape-tips">应用介绍：只需上传一张图片即可输出指定平台风格的四条文案。</view>
        <view class="landscape-tips u-m-t-32">说明：该模型为图生文案模型，会根据上传图片的内容及风格自动生成对应文案。（无法出与图片无关的内容）</view>
      </view>
    </view>


    <view class="page-item">
      <view class="page-title">平台格式选择</view>
      <scroll-view
        class="size-box u-flex u-flex-nowrap u-col-center"
        :scroll-x="true"
      >
        <view
          v-for="(item, index) in platformList"
          :key="index"
          class="size-item"
          :class="{ 'active': index == currentPlatformIndex }"
          @click="changePlatform(item, index)"
        >
          <view class="size-text">{{ item.name }}</view>
          <!-- <image
            v-if="item.platform > 5"
            class="vip-img "
            src="@/static/img/payment/vip-icon.png"
            mode="heightFix"
          ></image> -->
        </view>
      </scroll-view>
    </view>

    <view>
      <button
        class="footer-btn"
        @click="beginCreation()"
      >
        开始生成
        <template v-if="needEstimate != 0"> {{ `（${needEstimate}点数）` }} </template>
      </button>
    </view>

  </view>
</template>
<script>

import { getUploadUrl } from "@/static/api/user.js";
import { aiCopywriting, estimate } from "@/static/api/draw.js";

export default {
  components: {},
  data() {
    return {
      imageUrl: '',
      drawParam: {
        platform: '3',
      },
      needEstimate: 0,
      platformList: [
        { name: '抖音', platform: '3' }, { name: '小红书', platform: '2' }, { name: '快手', platform: '4' }, { name: '视频号', platform: '5' },
      ],
      currentPlatformIndex: 0,
    };
  },
  watch: {
  },
  computed: {
  },

  onShow() {
    // 拿到剪裁后的图片
    uni.$once('cropImg', (data) => {
      console.log('监听到事件来自 update ，携带参数 msg 为：' + data);
      this.imageUrl = data.imageUrl
    })

  },
  onLoad() {
    // uni.downloadFile({
    //   url: 'https://yimacdn.lingchuang.art/sdv/gen/120001_4869.mp4',
    //   success: (downloadResult) => {
    //     console.log('>>>>>>>>>>>>>videoUrl', downloadResult);
    //     if (downloadResult.errMsg === 'downloadFile:ok') {

    //       uni.getVideoInfo({
    //         src: downloadResult.tempFilePath,
    //         success: (res) => {
    //           console.log(res);
    //         },
    //         fail: (err) => {
    //           console.error(err);
    //         }
    //       })
    //     }
    //   },
    //   fail: (err) => {
    //     console.error(err);
    //   }
    // })
    this.getestimate()
  },
  methods: {
    uploadImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          uni.navigateTo({
            url: `/phome/cropping?src=${decodeURIComponent(res.tempFilePaths[0])}`
          })
        }
      })
    },
    // 获取创作点数
    getestimate() {
      uni.$u.debounce(async () => {
        try {
          const { code, result } = await estimate({ type: 3, ...this.drawParam })
          if (code == 200) {
            this.needEstimate = result
          }
        } catch (error) {
          console.error(error);
        }
      }, 300)
    },
    async beginCreation() {
      if (!this.imageUrl) {
        return uni.showToast({ title: "请先上传参考图", icon: "none", platform: 2000 })
      }

      uni.showLoading()
      try {
        // 需要传attachment
        const { result } = await getUploadUrl()
        let formData = result.post.formData
        let url = result.post.url
        this.drawParam.attachment = result.id

        uni.uploadFile({
          url: url,
          filePath: this.imageUrl,
          name: 'file',
          method: 'POST',
          formData: formData,
          success: async (res) => {
            let Param = JSON.parse(JSON.stringify(this.drawParam))
            delete Param.imageUrl
            const drawRes = await aiCopywriting(Param)
            uni.hideLoading()
            if (drawRes.code == 200) {
              this.resetData()
              uni.$emit('newDraw', { status: true })

              setTimeout(() => {
                uni.switchTab({
                  url: '/pages/tabBar/mine'
                });
              }, 500);

            }
          },
          fail: (err) => {
            uni.hideLoading()
            console.log('uploadFile error', err,)
          },
        });

      } catch (error) {
        uni.hideLoading()
        console.error('catch', error);
      }
    },
    changePlatform(item, index) {
      this.currentPlatformIndex = index
      this.drawParam.platform = item.platform
    },
    resetData() {
      this.drawParam = {
        platform: '3',
      }
    },
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
<style lang="scss" scoped>
.page-content {
  color: var(--text-color);
  padding: 32rpx;

  .page-item+.page-item {
    margin-top: 56rpx;
  }

  .landscape-tips {
    font-size: 24rpx;
    font-weight: 500;
    color: #C5C5C5;
  }

  .page-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 24rpx;
  }

  .image-recommen-box {
    width: 100%;
    white-space: nowrap;

    .image-recommen {
      display: inline-block;
      overflow: hidden;
      // width: 232rpx;
      height: 164rpx;
      border: transparent 2rpx solid;
      border-radius: 12rpx;

      &.active {
        border-color: #00EBD3;
      }

      .recommen-img {
        height: 100%;
      }

    }

    .image-recommen+.image-recommen {
      margin-left: 20rpx;
    }
  }

  .slider-num {
    background: var(--bg-color-2);
    padding: 12rpx 30rpx;
    text-align: center;
    color: var(--text-color);
    border-radius: 12rpx;
    font-size: 24rpx;
  }

  .upload-box {
    height: 196rpx;
    background-color: var(--bg-color-2);
    border-radius: 12rpx;

    .upload-image-box {
      .upload-image {
        width: 72rpx;
        height: 56rpx;
      }

      .upload-text {
        margin-top: 20rpx;
        color: var(--text-color);
        font-size: 24rpx;
      }
    }

    .darw-image {
      height: 100%;
    }

  }

  .size-box {
    width: 100%;
    white-space: nowrap;

    .size-item {
      display: inline-block;
      position: relative;
      width: 156rpx;
      height: 64rpx;
      line-height: 64rpx;
      background: var(--bg-color-2);
      color: var(--text-color);
      border-radius: 32rpx;
      margin-top: 20rpx;
      text-align: center;


      &.active {
        border: #00EBD3 2rpx solid;
        background: var(--bg-color-3);
        color: var(--text-color);
      }

      .size-text {}

      .vip-img {
        height: 24rpx;
        position: absolute;
        top: -12rpx;
        right: 8rpx;
      }
    }

    .size-item+.size-item {
      margin-left: 20rpx;
    }
  }
}

.footer-btn {
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  z-index: 99;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  height: 96rpx;
  line-height: 96rpx;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
  bottom: 30rpx;
  bottom: calc(30rpx + constant(safe-area-inset-bottom));
  bottom: calc(30rpx + env(safe-area-inset-bottom));

}
</style>