<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="一键高清"
    />

    <view class="page-item">
      <view class="page-title">上传视频</view>
      <view
        v-if="!videoUrl"
        class="upload-box u-flex u-col-center u-row-center"
        @click.stop="selectVideo()"
      >
        <view class="upload-image-box u-flex u-flex-col u-col-center u-row-center">
          <image
            class="upload-image"
            src="https://img.drawai.cn/icon/Union%402x.png"
            mode="widthFix"
          ></image>
          <view class="upload-text">上传视频</view>
        </view>
      </view>
      <view
        v-else
        class="upload-box u-flex u-col-center u-row-center"
      >
        <view class="video-box">
          <video
            class="darw-image"
            :src="videoUrl"
            mode="heightFix"
          ></video>
          <image
            class="close-image"
            src="/static/img/clip/colse_white.png"
            mode="widthFix"
            @click="clearVideo()"
          ></image>
        </view>
      </view>

      <view class="u-m-t-32">
        <view class="landscape-tips">应用介绍：只需上传一段视频即可提高分辨率，增强画质。</view>
        <view class="landscape-tips u-m-t-32">说明：该模型为视频超分模型，支持最大分辨率为720x1280最长时间为10s，最大上传文件大小为10M。</view>
      </view>
    </view>

    <view>
      <button
        class="footer-btn"
        :loading="btnLoading"
        :disabled="btnLoading"
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
import { aiHDVideo, estimate } from "@/static/api/draw.js";

export default {
  components: {},
  data() {
    return {
      videoInfo: {},
      videoUrl: '',
      drawParam: {
        imageUrl: '',
        videoAttachment: '',
      },
      needEstimate: 0,
      btnLoading: false,
    };
  },
  watch: {
  },
  computed: {
  },

  onShow() {

  },
  onLoad() {

    this.getestimate()
  },
  methods: {
    clearVideo() {
      this.videoInfo = {}
      this.videoUrl = ''
    },
    selectVideo() {
      uni.chooseVideo({
        count: 1,
        sourceType: ['album'],
        compressed: false,
        maxDuration: 10,
        success: (res) => {
          const { errMsg, size, duration, width, height, tempFilePath, thumbTempFilePath } = res
          console.log('选取视频信息', res);
          if (errMsg == 'chooseVideo:ok') {
            if (size > 10485760 || duration > 10 || width * height > 720 * 1280) {
              return uni.showToast({ title: '您上传的视频不符合规范哦~', icon: 'none' })
            }
            // if (size > 10485760) {
            //   return uni.showToast('视频大小不能超过10M')
            // }
            // if (duration > 10) {
            //   return uni.showToast('视频时长不能超过10s')
            // }
            // if (width * height > 720 * 1280) {
            //   return uni.showToast('视频分辨率不能超过720*1280')
            // }

            this.videoInfo = res
            this.videoUrl = tempFilePath
          }
        }
      })
    },
    // 获取创作点数
    getestimate() {
      this.btnLoading = true
      uni.$u.debounce(async () => {
        try {
          const { code, result } = await estimate({ type: 4, ...this.drawParam })
          this.btnLoading = false
          if (code == 200) {
            this.needEstimate = result
          }
        } catch (error) {
          this.btnLoading = false
          console.error(error);
        }
      }, 300)
    },
    async beginCreation() {
      if (!this.videoUrl) {
        return uni.showToast({ title: "请先上传视频", icon: "none", platform: 2000 })
      }
      this.btnLoading = true
      try {

        this.drawParam.imageUrl = 'https://cdn.lingchuang.art/sdv/aiker/ai-hd-default.png'
        this.drawParam.videoAttachment = await this.uploadVideo()

        if (this.drawParam.imageUrl && this.drawParam.videoAttachment) {

          const Param = JSON.parse(JSON.stringify(this.drawParam))
          const drawRes = await aiHDVideo(Param)

          this.btnLoading = false
          if (drawRes.code == 200) {
            this.resetData()
            uni.$emit('newDraw', { status: true })
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/tabBar/mine'
              });
            }, 500);
          }
        } else {
          this.btnLoading = false
          uni.showToast({ title: "视频上传失败", icon: "none", platform: 2000 })
          console.error('----视频上传失败：', this.drawParam);
        }
      } catch (error) {
        this.btnLoading = false
        console.error('catch', error);
      }
    },
    // 上传视频
    uploadVideo() {
      return new Promise(async (resolve, reject) => {
        const { result } = await getUploadUrl(1)
        let formData = result.post.formData
        let url = result.post.url
        let videoAttachment = result.id

        uni.uploadFile({
          url: url,
          filePath: this.videoUrl,
          name: 'file',
          method: 'POST',
          formData: formData,
          success: async (res) => {
            resolve(videoAttachment)
          },
          fail: (err) => {
            reject(false)
            this.btnLoading = false
            console.log('uploadFile error', err,)
          },
        });

      })
    },
    resetData() {
      this.drawParam = {
        imageUrl: '',
        videoAttachment: '',
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
  .upload-box {
    height: 292rpx;
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

    .video-box {
      position: relative;
      height: 100%;
      max-width: 100%;

      .close-image {
        position: absolute;
        right: 0;
        top: 0;
        width: 48rpx;
        height: 48rpx;
        z-index: 99;
      }
    }


    .darw-image {
      height: 100%;
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