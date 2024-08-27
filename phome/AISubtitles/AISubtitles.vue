<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="图片说话"
    />
    <!-- 例子视频展示 -->
    <view class="page-item">
      <video
        class="video-box"
        object-fit="contain"
        src="https://cdn.lingchuang.art/sdv/aiker/ai-subtitle/example-video.mp4"
        :controls="true"
        :show-fullscreen-btn="false"
        :show-center-play-btn="true"
        :show-progress="true"
      >
        <view class="video-tip">视频示例</view>
        <image
          class="watermark-image"
          src="https://cdn.lingchuang.art/sdv/aiker/ai-subtitle/watermark.png"
          mode="widthFix"
        ></image>
      </video>
      <view class="u-m-t-32">
        <view class="landscape-tips">应用介绍：抖音热门轻松上，无需剪辑轻松创，只需上传一张带有人像的图片和一段您想要的文案​，我们将自动生成一段带有字幕的视频文件。</view>
        <view class="landscape-tips u-m-t-32">
          模型说明：该模型为图片开口说话模型，只用于人像领域，请上传带有人像（五官清晰的正面照）的图片。请您确定上传的图片有合法使用权利或取得他人合法授权。</view>
      </view>
    </view>

    <view class="page-item">
      <view class="page-title">上传人像正面图片</view>
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
      <view class="page-title">输入配音文案</view>
      <view class="textarea-box">
        <u--textarea
          class="textarea-content"
          v-model="drawParam.text"
          height="168rpx"
          placeholder="请输入您想让图片说的话"
          cursorSpacing="30"
          adjustPosition
          count
          :border="false"
          maxlength="200"
        ></u--textarea>
        <view
          class="recommend-text u-flex u-col-center"
          @click="showRecommend()"
        >
          <image
            class="recommend-image"
            src="@/static/img/draw/Vector@2x.png"
          ></image>
          <view class="recommend-title">AI推荐</view>
        </view>

        <image
          class="recommend-clear"
          src="@/static/img/draw/Vector.png"
          @click="clearRecommend()"
        ></image>
      </view>
    </view>

    <view class="page-item">
      <view class="page-title">配音选择</view>
      <view
        class="dubbing-box u-flex u-col-center u-row-between"
        @click="dubbingSelect()"
      >
        <view class="dubbing-info  u-flex u-col-center">
          <view class="dubbing-info-image">
            <image
              v-if="dubbingData.image"
              :src="dubbingData.image"
            ></image>
          </view>

          <view class="dubbing-info-name">{{ dubbingData.name || '点击选择配音角色哦' }}</view>
        </view>
        <view class="dubbing-right  u-flex u-col-center">
          <view>{{ drawParam.voiceId ? '切换' : '选择' }}</view>
          <i class="iconfont icon-youjiantou"></i>
        </view>
      </view>
    </view>

    <view class="page-item">
      <view class="u-flex u-col-center u-row-between u-m-t-32">
        <view class="page-title u-m-b-0 u-flex u-col-center">
          高清修复
        </view>
        <u-switch
          :size="24"
          active-color="#00ebd3"
          inactiveColor="#A5A5A5"
          v-model="drawParam.superreal"
        ></u-switch>
      </view>
    </view>

    <view>
      <button
        class="footer-btn"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="beginCreation()"
      >开始生成{{ `（${needEstimate}点数）` }}</button>
    </view>

    <e-model
      v-if="showImageTip"
      :showModel="showImageTip"
      title="温馨提示"
      tips="当前图片像素过低，会影响视频输出质量，建议重新上传图片"
      cancelText="仍要制作"
      confirmText="重新上传"
      @cancelHandle="cropImage()"
      @confirmHandle="selectImage()"
    ></e-model>

    <!-- ai推荐词类型选择 -->
    <e-model
      v-if="showAISelect"
      :showModel="showAISelect"
      title="AI推荐"
      :hideBtn="true"
      :showClose="true"
      closeOnClickOverlay
      @cancelHandle="showAISelect = false"
    >
      <template v-slot:content>
        <view class="ai-recommend u-flex-col">
          <view
            class="btn-box"
            v-for="(item, index) in btnList"
            :key=index
          >
            <button
              class="select-btn"
              @click="getAIRecommend(item.type)"
            >{{ item.name }}</button>
          </view>

        </view>
      </template>
    </e-model>

    <!-- 上传人像照片前确认 -->
    <e-model
      v-if="showUpLoadAuthorize"
      :showModel="showUpLoadAuthorize"
      title="请选择一张人脸清晰照片"
      cancelText="不同意"
      confirmText="同意上传照片"
      cancelStyle="flex: 2;"
      confirmStyle="flex: 3;"
      @cancelHandle="showUpLoadAuthorize = false"
      @confirmHandle="selectImage()"
    >
      <template v-slot:content>
        <view class="content-box u-flex-col u-col-center">
          <!-- <view class="title">请选择一张人脸清晰照片</view> -->
          <view class="image-example-box u-flex u-col-center u-row-between">
            <view
              class="example-item u-flex-col"
              v-for="(item, index) in exampleList"
              :key="index"
            >
              <image
                class="example-item-img"
                :src="item.image"
              ></image>
              <view
                class="example-item-text"
                :class="{ 'green': index == 0 }"
              >{{ item.text }}</view>

              <image
                class="example-item-img-2"
                :src="index == 0 ? '/static/img/draw/Group 27@2x.png' : '/static/img/draw/Group 29@2x.png'"
              ></image>
            </view>
          </view>
          <view class="tips-box">
            <view class="tip-title">用户照片不收集承诺</view>
            <view class="tip-detail">1.我们承诺不收集任何用户信息，您上传的照片系统仅用于所选视频图片合成，作品生成后照片会自动删除，不会保留您的照片，请勿使用未获得本人授权同意的照片。</view>
            <view class="tip-detail">2.小程序内人脸照片仅储存在您的手机文件内仅您自己能看见或使用。</view>
          </view>
        </view>
      </template>
    </e-model>
  </view>
</template>
<script>

import { getUploadUrl } from "@/static/api/user.js";
import { aiTalker, getAiWrite, estimate } from "@/static/api/draw.js";
import datajosn from "@/static/utils/datajosn";
import utils from "@/static/utils/utils";

export default {
  components: {},
  data() {
    return {
      drawParam: {
        imageUrl: '',    // 已选择推荐图的图片路径
        imageAttachment: '', // 附件id
        voiceId: '',
        text: '',
        aspect: '',
        superreal: false,
      },
      needEstimate: 0,
      userInfo: uni.getStorageSync('userInfo') || {},
      btnLoading: false,
      showImageTip: false,
      showAISelect: false,
      showUpLoadAuthorize: false,
      filePath: '',
      dubbingData: {
        image: '',
        name: '',
      },
      exampleList: [
        { text: '正脸无遮挡', image: 'https://cdn.lingchuang.art/sdv/aiker/ai-subtitle/ai-subtitle-avatar-1.png', },
        { text: '不遮挡脸部', image: 'https://cdn.lingchuang.art/sdv/aiker/ai-subtitle/ai-subtitle-avatar-2.png', },
        { text: '不侧脸侧身', image: 'https://cdn.lingchuang.art/sdv/aiker/ai-subtitle/ai-subtitle-avatar-3.png', },
      ],
      btnList: [
        // 6祝福，7禅语，8哲语
        { name: '祝福类', type: '6' }, { name: '禅语类', type: '7' }, { name: '其他类', type: '8' },
      ]
    };
  },
  watch: {
    "drawParam.superreal": {
      handler(newV, oldV) {
        this.getestimate()
      },
    },
  },
  computed: {
  },
  onLoad() {
    this.getestimate()
  },
  onShow() {
    // 拿到剪裁后的图片
    uni.$once('cropImg', (data) => {
      console.log('监听到事件来自 update ，携带参数 msg 为：' + data);
      this.drawParam.imageUrl = data.imageUrl
      this.drawParam.aspect = data.aspect
    })
    uni.$once('selectVoice', (data) => {
      console.log('监听到事件来自 selectVoice ，携带参数 msg 为：' + data);
      this.drawParam.voiceId = data.voice.id
      this.dubbingData = data.voice
    })
  },
  methods: {
    cropImage() {
      this.showImageTip = false
      let ratioList = [
        { width: 9, height: 16, }, { width: 1, height: 1, }, { width: 16, height: 9, },
        { width: 3, height: 4, }, { width: 4, height: 3, },
      ]

      uni.navigateTo({
        url: `/phome/cropping?src=${decodeURIComponent(this.filePath)}&ratioList=${JSON.stringify(ratioList)}`
      })
    },
    selectImage() {
      this.showUpLoadAuthorize = false
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
      this.showUpLoadAuthorize = true
    },
    // 获取创作点数
    getestimate() {
      this.btnLoading = true
      uni.$u.debounce(async () => {
        try {
          const { code, result } = await estimate({ type: 5, ...this.drawParam })
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
        return uni.showToast({ title: "请先上传图片", icon: "none", duration: 2000 })
      }
      if (!this.drawParam.voiceId) {
        return uni.showToast({ title: "请选择配音", icon: "none", duration: 2000 })
      }
      try {
        this.btnLoading = true
        // 获取上传图片所需参数、上传地址
        const { result } = await getUploadUrl()
        let formData = result.post.formData
        let url = result.post.url
        this.drawParam.imageAttachment = result.id

        uni.uploadFile({
          url: url,
          filePath: this.drawParam.imageUrl,
          name: 'file',
          method: 'POST',
          formData: formData,
          success: async (res) => {
            let Param = JSON.parse(JSON.stringify(this.drawParam))
            delete Param.imageUrl

            const drawRes = await aiTalker(Param)
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
        this.btnLoading = false
        console.error('catch', error);
      }
    },
    async getAIRecommend(type) {
      try {
        uni.showLoading({
          title: '生成中...',
          mask: true,
        });
        const drawRes = await getAiWrite({ type: type })
        if (drawRes.code == 200) {
          uni.hideLoading()
          this.showAISelect = false
          this.drawParam.text = drawRes.result
        } else {
          setTimeout(() => {
            uni.hideLoading()
          }, 1000);
        }
      } catch (error) {
        uni.hideLoading()
        console.error('error', error);
      }
    },
    showRecommend() {
      console.log('----------------------1111');
      this.showAISelect = true
    },
    clearRecommend() {
      this.drawParam.text = ''
    },
    dubbingSelect() {
      uni.navigateTo({
        url: `/phome/AISubtitles/dubbingPage`
      })
    },
    resetData() {
      this.drawParam = {
        imageUrl: '',    // 图片地址
        imageAttachment: '', // 附件id
        voiceId: '',
        text: '',
        aspect: '',
        superreal: false,
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-content {
  color: var(--text-color);
  padding: 32rpx;
  padding-bottom: calc(180rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(180rpx + env(safe-area-inset-bottom));

  .page-item {
    position: relative;
  }

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

  .textarea-box {
    position: relative;
    margin-top: 28rpx;
    background-color: var(--bg-color-2);
    border-radius: 12rpx;

    ::v-deep .u-textarea {
      background-color: var(--bg-color-2);
      font-size: 24rpx;
      line-height: 36rpx;
      color: #fff;
      border-radius: 12rpx;
      padding-bottom: 60rpx;
    }

    /deep/ textarea {
      font-size: 24rpx !important;
      color: #fff !important;
      line-height: 36rpx;
    }

    /deep/ .u-textarea__count {
      color: #989898 !important;
      font-size: 20rpx !important;
      right: 50rpx !important;
      background-color: var(--bg-color-2) !important;
    }

    .textarea-content {
      width: 100%;
      color: var(--text-color);
      width: 100% !important;
      font-size: 28rpx;
      line-height: 36rpx;
      min-height: 168rpx !important;
      max-height: 400rpx;
      word-break: break-all;
      white-space: pre-wrap;
      overflow: scroll;
    }

    .recommend-text {
      position: absolute;
      left: 18rpx;
      bottom: 18rpx;
      padding: 6rpx 16rpx;
      background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
      border-radius: 48rpx;
      z-index: 99;

      .recommend-image {
        width: 20rpx;
        height: 20rpx;
      }

      .recommend-title {
        font-size: 24rpx;
        font-weight: 500;
        color: #1C1C1D;
        margin-left: 4rpx;
      }
    }

    .recommend-clear {
      width: 28rpx;
      height: 28rpx;
      position: absolute;
      right: 18rpx;
      bottom: 18rpx;
      z-index: 9;
    }
  }

  .page-tip {
    font-size: 28rpx;
    font-weight: 500;
    color: #E1E1E1;
  }

  .video-box {
    position: relative;
    width: 100%;
    height: 686rpx;
  }

  .video-tip {
    position: absolute;
    left: 32rpx;
    top: 32rpx;
    z-index: 99;
    width: 140rpx;
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
    // background-color: #2AFFB0;
    border-radius: 12rpx;
    font-size: 24rpx;
    font-weight: bold;
    color: #000;
  }

  .watermark-image {
    position: absolute;
    right: 32rpx;
    bottom: 32rpx;
    width: 200rpx;
    height: 76rpx;
    z-index: 99;
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
}

.dubbing-box {
  font-weight: 500;

  .dubbing-info {
    .dubbing-info-image {
      width: 64rpx;
      height: 64rpx;
      border-radius: 100%;
      background-color: #353535;

      image {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }

    .dubbing-info-name {
      font-size: 32rpx;
      color: #EAEAEA;
      margin-left: 16rpx;
    }
  }

  .dubbing-right {
    font-size: 24rpx;
    color: #54FFEC;

    .icon-youjiantou {
      font-size: 18rpx;
      margin-left: 12rpx;
    }
  }
}

.content-box {
  .title {
    font-size: 28rpx;
    font-weight: bold;
    color: #FFFFFF;
  }

  .image-example-box {
    padding: 40rpx 40rpx 60rpx 40rpx;
    width: 100%;
    border-bottom: 2rpx solid #3F3F3F;

    .example-item {
      position: relative;

      .example-item-img {
        width: 120rpx;
        height: 120rpx;
        border-radius: 100%;
      }

      .example-item-img-2 {
        position: absolute;
        right: 0;
        bottom: 52rpx;
        width: 36rpx;
        height: 36rpx;
      }

      .example-item-text {
        font-size: 24rpx;
        font-weight: bold;
        color: #F1626C;
        margin-top: 20rpx;

        &.green {
          color: #60CE56;
        }
      }
    }
  }

  .tips-box {
    font-size: 24rpx;
    font-weight: bold;
    color: #FFFFFF;

    .tip-title {
      text-align: center;
      margin: 48rpx 0 32rpx 0;
    }

    .tip-detail {
      line-height: 40rpx;
    }

    .tip-detail+.tip-detail {
      margin-top: 24rpx;
    }
  }
}

.ai-recommend {
  padding-bottom: 40rpx;

  .btn-box {
    width: 100%;

    .select-btn {
      flex: 1;
      height: 96rpx;
      line-height: 96rpx;
      background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
      border-radius: 48rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #121212;
    }

  }

  .btn-box+.btn-box {
    margin-top: 40rpx;
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