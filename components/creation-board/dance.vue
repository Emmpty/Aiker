<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <view class="page-item">
      <view class="page-title">输入关键词</view>
      <view class="textarea-box">
        <textarea
          class="textarea-content"
          v-model="drawParam.prompt"
          cols="30"
          rows="10"
          placeholder="如湖泊、雪山等..."
          :auto-height="true"
          maxlength="50000"
        ></textarea>
      </view>

      <view class="u-m-t-32">
        <view class="landscape-tips">应用介绍：抖音热门轻松上，无需剪辑轻松创，只需输入风景/场景类关键词即可生成一段火爆的光影舞蹈。</view>
        <view class="landscape-tips u-m-t-32">说明：该模型为光影错觉舞蹈模型，不建议使用人像相关的关键词。</view>
      </view>
    </view>

    <view class="page-item"></view>
    <view class="page-item">
      <view class="page-title">选择模板</view>
      <modelTemplate
        :propList="templateList"
        :propIndex="templateIndex"
        selectOne
        @changeItemHandle="changeModelTemplate"
      ></modelTemplate>
    </view>

    <!-- <view class="page-item">
      <view class="page-title">选择尺寸</view>
      <sizeModel @changeItemHandle="changeSizeModel"></sizeModel>
    </view> -->

    <view class="page-item">
      <view class="u-flex u-col-center u-row-between u-m-t-32">
        <view class="page-title u-m-b-0">是否添加配音</view>
        <u-switch
          :size="24"
          active-color="#00ebd3"
          inactiveColor="#A5A5A5"
          v-model="drawParam.audio"
        ></u-switch>
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

    <!-- 首帧图像 -->
    <e-model
      v-if="firstImgModelShow"
      :showModel="firstImgModelShow"
      title="-首帧图像确认-"
      cancelText="重新输入"
      :confirmText="firstImgConfirmText"
      :hideCancel="firstImgModelLoading"
      @cancelHandle="imgCancelHandle"
      @confirmHandle="imgConfirmHandle"
    >
      <template slot="content">
        <view
          v-if="firstImgModelLoading"
          class="u-m-t-32 u-m-b-32"
        >
          <u-loading-icon
            mode="semicircle"
            size="100"
            color="#00ebd3"
            text="首帧图像生成中，请稍候"
            textColor="#fff"
            textSize="16"
            :vertical="true"
          ></u-loading-icon>

        </view>
        <view
          v-else-if="danceDrwaParam.firstImgShowStatus == 0"
          class="first-img-box u-flex-col u-col-center"
        >
          <view class="first-img-tip">是否用该图像作为视频的画面风格</view>
          <scroll-view
            class="first-img-scroll"
            :scroll-y="true"
          >
            <image
              class="first-image"
              :src="firstImg"
              mode="widthFix"
            ></image>
          </scroll-view>
        </view>
        <view
          v-else
          class="make-fail"
        >制作失败，请重新发起制作</view>
      </template>
    </e-model>

  </view>
</template>
<script>

import { aiDanceImagine, aiDanceStart, aiDanceImagineProcess, estimate } from "@/static/api/draw.js";
import datajosn from "@/static/utils/datajosn";
import sizeModel from "@/components/creation-board/sizeModel.vue";
import modelTemplate from "@/components/creation-board/modelTemplate.vue";
import { mapState } from "vuex";

export default {
  props: {

  },
  components: {
    sizeModel,
    modelTemplate,
  },
  data() {
    return {
      maskShow: false,
      firstImgModelShow: false,  // 制作弹框遮罩
      firstImg: '',
      templateIndex: 0,
      templateList: [],
      drawParam: {
        prompt: '',     // 关键词
        aspect: '9:16',     // 尺寸
        templateId: '1', // 模板
        audio: false,   // 是否需要配音
      },
      needEstimate: 0,
      timer: null,
      loadingDots: '',
      dotsTimer: null,
      btnLoading: false,
    };
  },
  watch: {
    "danceDrwaParam.firstImgShowStatus": {
      handler(newV, oldV) {
        if (newV !== null) {
          this.firstImgModelShow = true
        } else {
          this.firstImgModelShow = false
        }
      },
      immediate: true,
    },
    "drawParam.audio": {
      handler(newV, oldV) {
        this.getestimate()
      },
    },
  },
  computed: {
    ...mapState("draw", [
      "danceDrwaParam",
    ]),
    // 制作中
    firstImgModelLoading() {
      return this.danceDrwaParam.firstImgShowStatus > 0
    },
    firstImgConfirmText() {
      return this.danceDrwaParam.firstImgShowStatus == 0 ? '生成视频' : '返回首页'
    }
  },

  mounted() {
    // 获取配置
    this.getDrawSetting()
  },
  beforeDestroy() {
    this.clearTimer()
  },

  methods: {
    changeSizeModel({ item }) {
      this.drawParam.aspect = item.name
    },
    changeModelTemplate({ item, index }) {
      this.drawParam.templateId = item.id
      this.templateIndex = index
    },
    // 获取画板配置
    async getDrawSetting() {
      datajosn.settings((data) => {
        this.templateList = data.template && data.template || [{ id: '' }]
        this.templateIndex = 0
        this.drawParam.templateId = this.templateList[0].id
        this.getestimate()
      })
    },

    async beginCreation() {
      try {
        if (this.danceDrwaParam.firstImgShowStatus == null) {
          this.btnLoading = true
          // 先生成参考图
          const { code, result } = await aiDanceImagine(this.drawParam)
          this.btnLoading = false
          if (code == 200) {
            this.$store.commit('draw/changeDanceDrwaParam', {
              firstImgShowStatus: 1,
              draftId: result.draftId,
            })
            // 清空生成参考图的数据
            // this.resetData()
            // 定时获取首帧图
            this.getFirstImg()
          }
        } else {
          // 弹出弹框
          this.firstImgModelShow = true
        }
      } catch (error) {
        console.error('---------draw', error);
      }
    },
    // 获取创作点数
    getestimate() {
      this.btnLoading = true
      uni.$u.debounce(async () => {
        try {
          const { code, result } = await estimate({ type: 1, ...this.drawParam })
          this.btnLoading = false
          if (code == 200) {
            this.needEstimate = result
          }
        } catch (error) {
          this.btnLoading = false
          console.error('estimate', error);
        }
      }, 300)
    },
    changeDanceDrwaParam() {

    },
    // 取消重做
    imgCancelHandle() {
      this.$store.commit('draw/changeDanceDrwaParam', {
        firstImgShowStatus: null,
        draftId: '',
      })
      // this.resetData()
    },
    async imgConfirmHandle() {
      if (this.danceDrwaParam.firstImgShowStatus == 0) {
        // 生成光影舞蹈视频
        try {
          uni.showLoading({ title: '加载中', mark: true, })
          const { code, result } = await aiDanceStart({ draftId: this.danceDrwaParam.draftId })
          uni.hideLoading()
          if (code == 200) {
            uni.$emit('newDraw', { status: true })
            setTimeout(() => {
              this.imgCancelHandle()
              this.firstImg = ''
              uni.switchTab({
                url: '/pages/tabBar/mine'
              });
            }, 500);
          }
        } catch (error) {
          uni.hideLoading()
        }

      } else {
        if (this.danceDrwaParam.firstImgShowStatus < 0) {
          this.imgCancelHandle()
        }
        uni.navigateBack({
          delta: 1
        });
      }
    },
    getFirstImg() {
      let draftId = this.danceDrwaParam.draftId
      if (!draftId) {
        return
      }
      this.clearTimer()
      this.getFirstImgAPi()
      this.timer = setInterval(() => {
        this.getFirstImgAPi()
      }, 3000);
    },
    async getFirstImgAPi() {
      try {
        const { code, result } = await aiDanceImagineProcess({ draftId: this.danceDrwaParam.draftId })
        if (result.status <= 0) {
          this.clearTimer()
        }
        if (code == 200) {
          this.danceDrwaParam.firstImgShowStatus = result.status
          this.$store.commit('draw/changeDanceDrwaParam', this.danceDrwaParam)
          this.firstImg = result.imageUrl
        }
      } catch (error) {
        this.clearTimer()
        console.error('-----------', error);
      }
    },
    clearTimer() {
      this.timer && clearInterval(this.timer)
      this.timer = null
    },
    resetData() {
      this.templateIndex = 0
      this.drawParam = {
        templateId: this.templateList[0].id,       // 模板
        prompt: '',    // 关键词
        aspect: '9:16',     // 尺寸
        audio: false,   // 是否需要配音
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-content {
  background-color: var(--bg-color);
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

  .textarea-box {
    margin-top: 28rpx;
    background-color: var(--bg-color-2);
    border-radius: 32rpx;
    margin-bottom: 24rpx;
    padding: 20rpx;

    .textarea-content {
      width: 100%;
      color: var(--text-color);
      width: 100% !important;
      font-size: 28rpx;
      line-height: 36rpx;
      min-height: 196rpx !important;
      max-height: 400rpx;
      word-break: break-all;
      white-space: pre-wrap;
      overflow: scroll;
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

.mask-box {
  width: 100%;
  height: 100%;
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

.first-img-box {
  background-color: #323234;
  width: 100%;
  max-height: 70vh;

  .first-img-tip {
    color: #AEAEAE;
    font-size: 24rpx;
    height: 40rpx;
    line-height: 40rpx;
    margin-bottom: 28rpx;
  }

  .first-img-scroll {
    width: 100%;
    height: 100%;
    max-height: 800rpx;
    border-radius: 8rpx;
    overflow: hidden;

    .first-image {
      width: 100%;
    }
  }

}

.make-fail {
  text-align: center;
}
</style>