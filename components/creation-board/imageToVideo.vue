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
        @click="uploadImage()"
      >
        <view
          v-if="!drawParam.imageUrl"
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
          :src="drawParam.imageUrl"
          mode="heightFix"
        ></image>
      </view>
    </view>

    <view class="page-item">
      <view class="page-title">图片推荐</view>
      <scroll-view
        class="image-recommen-box"
        :scroll-x="true"
      >
        <view
          class="image-recommen "
          v-for="(item, index) in recommenImageList"
          :key="index"
          @click="changeRecommenImage(item, index)"
        >
          <image
            class="recommen-img "
            :src="item.thumb"
            mode="heightFix"
          ></image>
        </view>
      </scroll-view>
    </view>

    <view class="page-item">
      <view class="page-title">视频时长</view>
      <scroll-view
        class="size-box u-flex u-flex-nowrap u-col-center"
        :scroll-x="true"
      >
        <view
          v-for="(item, index) in videoDurationList"
          :key="index"
          class="size-item"
          :class="{ 'active': index == currentDurationIndex }"
          @click="changeDuration(item, index)"
        >
          <view class="size-text">{{ item.duration }}秒</view>
          <image
            v-if="item.duration > 5"
            class="vip-img "
            src="@/static/img/payment/vip-icon.png"
            mode="heightFix"
          ></image>
        </view>
      </scroll-view>
    </view>

    <view
      v-if="deviceInfo.platform != 'windows'"
      class="page-item"
    >
      <view class="u-flex u-col-center u-row-between u-m-t-32">
        <view class="page-title u-m-b-0 u-flex u-col-center">
          局部动画
        </view>
        <u-switch
          :size="24"
          active-color="#00ebd3"
          inactiveColor="#A5A5A5"
          v-model="maskImageUrlStatus"
          asyncChange
          @change="asyncChangeStatus"
        ></u-switch>
      </view>
      <image
        v-if="maskImageUrlStatus"
        class="darw-image-mask"
        :src="maskImageUrl || drawParam.imageUrl"
        mode="heightFix"
        @click="openPaintedImg()"
      ></image>
    </view>

    <view class="page-item">
      <view class="page-title">运动幅度</view>
      <view
        v-if="maskImageUrlStatus"
        class="page-tip u-m-t-20 u-m-b-20"
      >使用说明：如遇到使用该功能时涂抹区域没有运动可以尝试提高运动幅度，推荐运动幅度在3~6之间</view>
      <view class="u-flex u-col-center">
        <view class="slider-box  u-flex-1">
          <u-slider
            class="u-flex-1"
            :block-style="{ marginLeft: 0 }"
            activeColor="#00EBD3"
            v-model="drawParam.rate"
            step="1"
            min="1"
            max="12"
          ></u-slider>
        </view>
        <view class="slider-num"> {{ drawParam.rate }}</view>
      </view>
    </view>

    <view>
      <button
        class="footer-btn"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="beginCreation()"
      >开始创作{{ `（${needEstimate}点数）` }}</button>
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
import { creativeDraw, estimate } from "@/static/api/draw.js";
import datajosn from "@/static/utils/datajosn";
import utils from "@/static/utils/utils";

export default {
  props: {
    imageUrlObj: {
      type: Object,
      default() {
        return { imageUrl: '', aspect: '', }
      }
    },
    propMaskImageUrl: {
      type: String,
      default() {
        return ''
      }
    },
  },
  components: {},
  data() {
    return {
      drawParam: {
        imageUrl: '',    // 已选择推荐图的图片路径
        attachment: '', // 附件id
        duration: 3,   // 视频时长
        rate: 4,        // 运动幅度
        aspect: '',     // 尺寸
      },
      needEstimate: 0,
      userInfo: uni.getStorageSync('userInfo') || {},
      // 视频时长
      videoDurationList: [{ duration: 3 }, { duration: 5 }, { duration: 7 }, { duration: 10 },],
      currentDurationIndex: 0,  // 当前视频时长选择索引
      recommenImageList: [],      // 推荐图片列表
      btnLoading: false,
      maskImageUrlStatus: false,
      showImageTip: false,
      filePath: '',
      maskImageUrl: '',
      deviceInfo: {},
    };
  },
  watch: {
    imageUrlObj: {
      handler(newValue, oldValue) {
        console.log('>>>>>>>>>>>>>>>>>', newValue);
        this.drawParam.imageUrl = newValue.imageUrl
        this.drawParam.aspect = newValue.aspect
      },
      immediate: true,// 立即触发handler函数
      deep: true
    },
    propMaskImageUrl: {
      handler(newValue, oldValue) {
        console.log('>>>>>>>>>>>>>>>>>', newValue);
        if (newValue) {
          this.maskImageUrlStatus = true
        } else {
          this.maskImageUrlStatus = false
        }
        this.maskImageUrl = newValue
      },
      immediate: true,
    },
    maskImageUrlStatus(newValue, oldValue) {
      if (newValue) {
        if (!this.maskImageUrl) {
          uni.navigateTo({
            url: `/phome/clearRect/clearRect?maskImageUrl=${encodeURIComponent(this.drawParam.imageUrl)}`
          });
          this.maskImageUrlStatus = false
        }
      }
    },
    "drawParam.duration": {
      handler(newV, oldV) {
        this.getestimate()
      },
    },
    "drawParam.imageUrl": {
      handler(newV, oldV) {
        if (newV != oldV) {
          this.maskImageUrlStatus = false
          this.$emit('clearMaskImage')
        }
      },
    },
  },
  computed: {
    // maskImageUrl() {
    //   console.log('----------- this.maskImageUrlStatus', this.maskImageUrlStatus);
    //   if (this.propMaskImageUrl) {
    //     this.maskImageUrlStatus = true
    //   } else {
    //     this.maskImageUrlStatus = false
    //   }
    //   return this.propMaskImageUrl
    // }
  },

  mounted() {
    // #ifdef MP
    this.deviceInfo = uni.getSystemInfoSync()
    // #endif
    this.getDrawSetting()
  },

  methods: {
    // 获取画板配置
    async getDrawSetting() {
      datajosn.settings((data) => {
        this.recommenImageList = data.presetImage && data.presetImage || []
        this.getestimate()
      })
    },
    changeRecommenImage(item, index) {
      if (this.maskImageUrlStatus && this.maskImageUrl) {
        uni.showModal({
          title: '温馨提示',
          content: '您已对该图片进行过局部动画哦，确定要重新更换图片吗?',
          success: (res) => {
            if (res.confirm) {
              this.$emit('clearMaskImage')

              this.drawParam.imageUrl = item.imageUrl
              this.drawParam.aspect = item.aspect
            }
          }
        });
      } else {
        this.drawParam.imageUrl = item.imageUrl
        this.drawParam.aspect = item.aspect
      }

    },
    changeDuration(item, index) {
      if (item.duration > 5 && this.userInfo.level < 1) {
        return uni.showToast({ title: "VIP、SVIP用户专享", icon: "none", duration: 2000 })
      }
      this.currentDurationIndex = index
      this.drawParam.duration = item.duration
    },
    asyncChangeStatus(e) {
      if (!this.drawParam.imageUrl) {
        uni.showToast({ title: "请先上传或选择需要局部动画的图片", icon: "none", duration: 2000 })
      } else {
        console.log(e);
        this.maskImageUrlStatus = e
      }

    },
    openPaintedImg() {
      uni.getImageInfo({
        src: this.drawParam.imageUrl,
        success: (image) => {
          // 需指定原图尺寸，不然每制作一次，都会按屏幕像素比放大
          uni.navigateTo({
            url: `/phome/clearRect/clearRect?maskImageUrl=${encodeURIComponent(this.maskImageUrl)}&imgWidth=${image.width}&imgHeight=${image.height}`
          })
        },
        fail: (err) => {
          console.log("getImageInfo err: ", err);
        }
      });

    },
    cropImage() {
      this.showImageTip = false
      uni.navigateTo({
        url: `/phome/cropping?src=${encodeURIComponent(this.filePath)}`
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
    async uploadImage() {
      if (this.maskImageUrlStatus && this.maskImageUrl) {
        uni.showModal({
          title: '温馨提示',
          content: '您已对该图片进行过局部动画哦，确定要重新更换图片吗?',
          success: (res) => {
            if (res.confirm) {
              this.$emit('clearMaskImage')
              this.selectImage()
            }
          }
        });
      } else {
        this.selectImage()
      }
    },
    // 获取创作点数
    getestimate() {
      this.btnLoading = true
      uni.$u.debounce(async () => {
        try {
          const { code, result } = await estimate({ type: 0, ...this.drawParam })
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
      if (!this.drawParam.imageUrl) {
        return uni.showToast({ title: "请先上传参考图", icon: "none", duration: 2000 })
      }
      try {
        if (this.maskImageUrlStatus) {
          if (!this.maskImageUrl) {
            return uni.showToast({ title: "请编辑局部动画区域或取消局部动画", icon: "none", duration: 2000 })
          } else {
            this.btnLoading = true
            const maskAttachment = await this.uploadMaskImg()
            if (maskAttachment) {
              this.drawParam.maskAttachment = maskAttachment
            }
          }
        }
        this.btnLoading = true

        // 选择推荐图片制作
        console.log('this.drawParam.imageUrl', this.drawParam.imageUrl);
        if (this.drawParam.imageUrl.indexOf('https://') == 0) {
          let Param = JSON.parse(JSON.stringify(this.drawParam))
          delete Param.attachment
          console.error('-----------', Param);
          const drawRes = await creativeDraw(Param)
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
          // 自定义上传图片制作,不需要传imageUrl，需要传attachment
          const { result } = await getUploadUrl()
          let formData = result.post.formData
          let url = result.post.url
          this.drawParam.attachment = result.id

          uni.uploadFile({
            url: url,
            filePath: this.drawParam.imageUrl,
            name: 'file',
            method: 'POST',
            formData: formData,
            success: async (res) => {
              let Param = JSON.parse(JSON.stringify(this.drawParam))
              delete Param.imageUrl
              console.error('-----------', Param);
              const drawRes = await creativeDraw(Param)
              this.btnLoading = false
              if (drawRes.code === 666) {
                return this.showModelNav = true
              }
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
        }
      } catch (error) {
        this.btnLoading = false
        console.error('catch', error);
      }
    },
    // navConfirmHandle() {
    //   uni.navigateToMiniProgram({
    //     appId: 'wxec994b5f8ad8bfde',
    //     path: 'pages/tabBar/gallery',
    //     extraData: {},
    //     envVersion: 'release',
    //     success(res) { },
    //     fail(res) { }
    //   })
    // },
    uploadMaskImg() {
      return new Promise(async (resolve, reject) => {
        try {
          const { result } = await getUploadUrl(1)
          let formData = result.post.formData
          let url = result.post.url
          let maskAttachment = result.id

          uni.uploadFile({
            url: url,
            filePath: this.maskImageUrl,
            name: 'file',
            method: 'POST',
            formData: formData,
            success: async (res) => {
              resolve(maskAttachment)
            },
            fail: (err) => {
              reject(false)
              console.log('uploadFile error', err,)
            },
          });
        } catch (error) {
          reject(false)
          console.error('catch', error);
        }
      })
    },
    resetData() {
      this.drawParam = {
        imageUrl: '',    // 已选择推荐图的图片路径
        attachment: '', // 附件id
        duration: 3,   // 视频时长
        rate: 4,        // 运动幅度
        aspect: '',     // 尺寸
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

  .page-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 24rpx;
  }

  .page-tip {
    font-size: 28rpx;
    font-weight: 500;
    color: #E1E1E1;
  }

  .slider-box {
    /deep/ slider {
      margin-left: 0;
    }
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

.darw-image-mask {
  height: 164rpx;
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
}</style>