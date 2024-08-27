<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <!-- <view class="content-box"> -->

    <view class="page-item">
      <view class="page-title">上传参考图</view>
      <view
        class="upload-box u-flex u-col-center u-row-center"
        @click="selectImage()"
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
        <view class="landscape-tips">应用介绍：抖音热门轻松上，无需剪辑轻松创，只需上传一张风景图即可生成一段7秒的动态高清视频。</view>
        <view class="landscape-tips u-m-t-32">说明：该模型为风景专属模型，不适宜制作人像。</view>
      </view>
    </view>

    <view class="page-item">
      <view class="u-flex u-col-center u-row-between u-m-t-32">
        <view class="page-title u-m-b-0">是否添加创意文案</view>
        <u-switch
          :size="24"
          active-color="#00ebd3"
          inactiveColor="#A5A5A5"
          v-model="drawParam.words"
        ></u-switch>
      </view>
    </view>

    <view>
      <button
        class="footer-btn"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="beginCreation()"
      >开始创作
        <template v-if="needEstimate != 0"> {{ `（${needEstimate}点数）` }} </template>
      </button>
    </view>

    <e-model
      :showModel="showImageTip"
      title="温馨提示"
      tips="当前图片像素过低，会影响视频输出质量，建议重新上传图片"
      cancelText="仍要制作"
      confirmText="重新上传"
      @cancelHandle="cropImage()"
      @confirmHandle="selectImage()"
    ></e-model>
  </view>
</template>
<script>

import { getUploadUrl } from "@/static/api/user.js";
import { creativeDrawLandscape, estimate } from "@/static/api/draw.js";
import utils from "@/static/utils/utils";

export default {
  props: {
    imageUrlObj: {
      type: Object,
      default() {
        return { imageUrl: '', aspect: '' }
      }
    },
  },
  components: {},
  data() {
    return {
      imageUrl: '',
      drawParam: {
        words: false,   // 是否添加创意文案
      },
      needEstimate: 0,
      // 视频时长
      videoDurationList: [{ duration: 3 }, { duration: 2 }],
      currentDurationIndex: 0,  // 当前视频时长选择索引
      recommenImageList: [],      // 推荐图片列表
      btnLoading: false,
      showImageTip: false,
      filePath: '',
    };
  },
  watch: {
    imageUrlObj: {
      handler(newValue, oldValue) {
        this.imageUrl = newValue.imageUrl
      },
      immediate: true,
      deep: true// 立即触发handler函数
    },
    "drawParam.words": {
      handler(newV, oldV) {
        this.getestimate()
      },
      immediate: true,
    },
  },
  computed: {

  },

  mounted() {

  },

  methods: {
    cropImage() {
      this.showImageTip = false
      let ratioList = [
        { width: 9, height: 16, }, { width: 16, height: 9, },
        { width: 1, height: 1, }, { width: 3, height: 4, }, { width: 4, height: 3, },
      ]

      uni.navigateTo({
        url: `/phome/cropping?src=${decodeURIComponent(this.filePath)}&ratioList=${JSON.stringify(ratioList)}&hideRatio=true`
      })
    },
    selectImage() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          this.showImageTip = false
          this.filePath = res.tempFilePaths[0]
          // 判断图片像素是否大于50W
          const result = await utils.checkImage(this.filePath)
          if (result) {
            this.showImageTip = result
          } else {
            this.cropImage()
          }
        }
      })
    },
    // 获取创作点数
    getestimate() {
      this.btnLoading = true
      uni.$u.debounce(async () => {
        try {
          const { code, result } = await estimate({ type: 2, ...this.drawParam })
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
      if (!this.imageUrl) {
        return uni.showToast({ title: "请先上传参考图", icon: "none", duration: 2000 })
      }
      this.btnLoading = true
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
            const drawRes = await creativeDrawLandscape(Param)
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
          },
          fail: (err) => {
            this.btnLoading = false
            console.log('uploadFile error', err,)
          },
        });

      } catch (error) {
        uni.hideLoading()
        console.error('catch', error);
      }


    },
    resetData() {
      this.drawParam = {
        words: false,
      }
    },
  },
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
    .size-item {
      min-width: 120rpx;
      padding: 20rpx;
      background: var(--bg-color-2);
      color: var(--text-color);
      border-radius: 10rpx;
      margin: 20rpx;
      margin-top: 0;
      text-align: center;


      &.active {
        border: #00EBD3 2rpx solid;
        background: var(--bg-color-3);
        color: var(--text-color);
      }

      .size-text {}
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