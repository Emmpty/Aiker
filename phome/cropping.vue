<template>
  <view
    class="container"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="图片剪裁"
    />
    <view
      class="header"
      v-if="!hideRatio"
    >
      <scroll-view
        :scroll-x="true"
        class="scroller"
      >
        <view class=" u-flex u-flex-nowrap u-col-center">
          <view
            v-for="(item, index) in ratioList"
            :key="index"
            @click="chooseRatio(index)"
            class="item u-flex-col"
            :class="{
              active: activeIndex === index && ratio !== 0
            }"
          >
            <view class="ratio-box u-flex u-row-center u-col-center">
              <view :class="'itemContent ratio-' + item.width + '-' + item.height"></view>
            </view>
            <view class="ratio-text"> {{ item.width }}:{{ item.height }}</view>
            <view
              v-if="index === 0"
              class="recommen"
            >最佳</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="cropper">
      <bt-cropper
        v-if="imageSrc"
        ref="croper"
        :ratio="ratio"
        :rotate="rotate"
        :quality="0.7"
        showGrid
        @change="onChange"
        :imageSrc="imageSrc"
        :mask="mask"
      >
      </bt-cropper>
    </view>
    <view class="footer">
      <view class="btnGroup">
        <!-- <view
          class="btn choose"
          @click="chooseImage"
        >
          选择图片
        </view> -->
        <button
          class="btn"
          @click="onCrop"
        >
          开始裁切
        </button>
      </view>
      <!-- <slider @changing="onRotate"></slider> -->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imageSrc: "",
      // 蒙版，非黑色区域会裁剪为透明
      // mask: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-a3b890b4-7cb2-4b29-aa78-e652572bdef6/d6bc69ee-cdc0-4a13-a744-d79db42e0dbe.png",
      mask: "",
      dWidth: 500,
      rotate: 0,
      // 输出的宽高比例
      // ratio: 3 / 2,
      ratio: 16 / 9,
      activeIndex: 0,
      ratioList: [{
        width: 16,
        height: 9,
      }, {
        width: 9,
        height: 16,
      },
      {
        width: 1,
        height: 1,
      }, {
        width: 3,
        height: 4,
      }, {
        width: 4,
        height: 3,
      },],
      hideRatio: false,
    }
  },
  onLoad(options) {

    if (options.ratioList) {
      this.ratioList = JSON.parse(options.ratioList)
      this.ratio = this.ratioList[0].width / this.ratioList[0].height

    }
    if (options.hideRatio) {
      this.hideRatio = options.hideRatio
    }
    this.imageSrc = decodeURIComponent(options.src)
  },
  mounted() { },
  methods: {
    onChange(ev) {
      console.log(ev)
    },
    chooseRatio(index) {
      this.activeIndex = index
      let item = this.ratioList[index]
      this.ratio = item.width / item.height
    },
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['original'],
        success: (res) => {
          let tempFilePaths = res.tempFilePaths[0]
          this.imageSrc = tempFilePaths
        }
      })
    },
    onCrop(cb) {
      uni.$u.debounce(async () => {
        this.$refs.croper.crop().then(path => {
          uni.$emit('cropImg', {
            imageUrl: path,
            aspect: this.ratioList[this.activeIndex].width + ':' + this.ratioList[this.activeIndex].height
          })
          uni.navigateBack({
            delta: 1
          });
        })
      }, 300)
    },
    onRotate(ev) {
      this.rotate = 360 * (ev.detail.value / 100)
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // #ifndef H5
  height: 100vh;
  // #endif
  // #ifdef H5
  height: 100%;
  // #endif
  background-color: #000;

  .cropper {
    flex: 1;
  }
}

.header {
  padding-top: 16rpx;

  .scroller {
    // align-items: center;
    width: 100vw;
    height: 135rpx;
    touch-action: none;

    .item {
      position: relative;
      display: flex;
      justify-content: end;
      align-items: center;
      margin-left: 40rpx;
      width: 120rpx;
      height: 120rpx;
      padding: 16rpx 20rpx 4rpx 20rpx;
      flex-shrink: 0;
      color: var(--text-color);
      background-color: var(--bg-color-2);
      border: 1px solid transparent;
      border-radius: 12rpx;

      &.active {
        color: var(--primary-color);
        border: 1px solid var(--primary-color);

      }

      .recommen {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 8rpx;
        width: 48rpx;
        height: 24rpx;
        line-height: 24rpx;
        border: 2rpx solid rgba(255, 255, 255, 0.66);
        background: #F04455;
        font-size: 16rpx;
        color: #fff;
        text-align: center;
      }

      .ratio-box {
        width: 90%;
        flex: 1;


        .itemContent {
          border-radius: 4rpx;
          background-color: var(--bg-color-3);
          font-size: 16rpx;
          display: flex;
          white-space: nowrap;
        }


      }

      .ratio-text {}

      .ratio-1-1 {
        width: 70%;
        height: 70%;
      }

      .ratio-16-9 {
        width: 100%;
        height: 56.25%;
      }

      .ratio-9-16 {
        width: 56.25%;
        height: 100%;
      }

      .ratio-4-3 {
        width: 100%;
        height: 75%;
      }

      .ratio-3-4 {
        width: 75%;
        height: 100%;
      }

      .ratio-3-2 {
        width: 100%;
        height: 66.6%;
      }

      .ratio-2-3 {
        width: 66.6%;
        height: 100%;
      }
    }
  }

}

uni-page-body {
  height: 100%;
}

.footer {
  .btnGroup {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #000000;
    padding: 40rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    width: 100%;

    .btn {
      flex: 1;
      background-color: var(--primary-color);
      font-size: 36rpx;
      font-weight: bold;
      border-radius: 99px;
      text-align: center;
      color: #000;
      height: 90rpx;
      line-height: 90rpx;
      background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
      box-shadow: 0px 16rpx 32rpx #00dbc533;
      border-radius: 27px;

      &.choose {
        margin-right: 20rpx;
        background-color: #F0AD4E;
      }
    }
  }
}
</style>
