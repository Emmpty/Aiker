<template>
  <view
    class="page flex-center "
    :class="cueTheme"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="图生视频"
    />

    <view
      v-if="writing"
      class="full-screen1"
    >
      <view class="h-55vh flex-column flex-center">
        <yl-graffiti
          ref="graffiti"
          canvas-id="defCanvas"
          :width="canvasStyle.w"
          :height="canvasStyle.h"
          :imgWidth="canvasStyle.imgWidth"
          :imgHeight="canvasStyle.imgHeight"
          :shape="curShape"
          :lineColor="lineColor"
          :lineWidth="lineWidth"
          :bgImage="picture"
          :typeIndex="typeIndex"
          @stepChanged="stepChanged"
        >
        </yl-graffiti>
      </view>

    </view>
    <!-- <view class="explain u-m-t-20 u-m-b-20">使用说明：如遇到使用该功能时涂抹区域没有运动可以尝试提高运动幅度，推荐运动幅度在3~6之间</view> -->
    <view class="u-flex-col u-col-center u-m-t-30 ">
      <view class="redraw  u-row-around">
        <!--  -->
        <view
          v-for="(item, index) in shapes"
          :key="index"
          class="redraw-item u-flex-col flex-center "
          :class="{ 'redraw-active': typeIndex == index }"
          @click="updateShape(item, index)"
        >
          <image
            class="icon"
            :src="item.icon"
          ></image>
          <view class="name">{{ item.title }}</view>
        </view>
      </view>

      <view class="w-100 u-m-t-20 u-m-b-30">
        <view class="u-flex u-col-center">
          <view class="page-title">笔刷大小</view>
          <view class="u-flex-1">
            <u-slider
              style="flex: 1;"
              activeColor="#00EBD3"
              v-model="lineWidth"
              step="2"
              min="10"
              max="50"
            ></u-slider>
          </view>
          <view class="slider-num"> {{ lineWidth }}</view>
        </view>
      </view>
      <view
        class="redraw-start"
        @click="savePicture()"
      >保存</view>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      title: '局部重绘',
      picture: "",
      picture22: '',
      writing: false,
      swiperCurrent: -1,
      canvasStyle: {},
      optIndex: 0,
      options: [{
        label: "",
        icon: "cuicon-write"
      }, {
        label: "删除",
        icon: "cuicon-delete"
      }],
      shapes: [ //画笔形状
        { title: '回退', icon: "/static/img/custom/back.png", shape: "", active: false },
        { title: '恢复', icon: "/static/img/custom/recovery.png", shape: "curve", active: false },
        { title: '橡皮擦', icon: "/static/img/custom/eraser.png", shape: "curve", active: false },
        // { title: '画笔', icon: "/static/img/custom/icon2.png", shape: "curve", active: false },
        // { title: '框选', icon: "/static/img/custom/icon3.png", shape: "rect", active: true },
        { title: '重置', icon: "/static/img/custom/reset.png", shape: "", active: false },

      ],
      colors: [ //画笔颜色 
        { color: "#ffffff", active: true },
        // { color: "#1c9d02", active: false },
        // { color: "#000000", active: false },
        // { color: "#006ce6", active: false },
        // { color: "#efaa03", active: false }
      ],
      lineWidth: 20,  //画笔粗细
      sizes: [ //画笔粗细
        { thickness: 30, active: true },
        // { thickness: 4, active: false },
        // { thickness: 6, active: false },
        // { thickness: 8, active: false },
        // { thickness: 10, active: false }
      ],
      stepInfo: {
        curStep: -1,
        len: 0
      },
      saving: false,
      systemInfo: null,
      goods: {},
      typeIndex: -1,
    }
  },

  onLoad(options) {
    this.systemInfo = uni.getSystemInfoSync();

    if (options.maskImageUrl) {
      let imageSrc = decodeURIComponent(options.maskImageUrl)
      if (options.imgWidth) {
        this.canvasStyle = this.caclCanvasStyle(options.imgHeight, options.imgWidth);
        this.picture = imageSrc
        this.writing = true
      } else {
        uni.getImageInfo({
          src: imageSrc,
          success: (image) => {
            console.log(image)

            this.canvasStyle = this.caclCanvasStyle(image.height, image.width);
            this.picture = image.path;
            this.writing = true;
          },
          fail: (err) => {
            console.log("getImageInfo err: ", err);
          }
        });
      }

    }
  },

  computed: {

    /**
     * 当前形状
     */
    curShape() {
      return 'curve' || this.shapes[this.typeIndex].shape || '';
    },

    /**
     * 线条颜色
     */
    lineColor() {
      return this.colors.filter(color => color.active)[0].color;
    },
  },

  methods: {

    /**
     * 计算高
     * @param {Object} imgHeight
     * @param {Object} imgWidth
     */
    caclCanvasStyle(imgHeight, imgWidth) {

      let width = 0, height = 0;
      let { windowWidth, windowHeight } = this.systemInfo

      // 图片宽高比
      let imgScale = imgWidth / imgHeight
      let windowScale = windowWidth / (windowHeight)
      if (imgScale > windowScale) {
        width = windowWidth
        height = width / imgScale
        let maxImgHeight = (windowHeight) * 0.55
        if (height > maxImgHeight) {
          height = maxImgHeight
          width = height * imgScale
        }
      } else {
        height = (windowHeight) * 0.55
        width = height * imgScale
      }

      width = parseInt(width.toFixed(0))
      height = parseInt(height.toFixed(0))

      console.log('...........原图宽高', imgWidth, imgHeight);
      console.log('width, height', width, height, parseInt(height.toFixed(0)));

      return {
        width: width + "px",
        height: height + "px",
        imgWidth: +imgWidth,
        imgHeight: +imgHeight,
        w: +width,
        h: +height,
        style: `width:${width.toFixed(0)}px;height:${height.toFixed(0)}px;`
      }

    },

    /**
     * 图片操作
     * @param {Object} index
     */
    selectOption(index) {
      switch (index) {
        case 0:
          this.writing = true;
          break;
        case 1:
          this.picture = "";
          break;
        default:
          break;
      }
    },

    /**
     * 选择涂鸦的类型
     * @param {Object} index
     */
    selectWritingOption(index) {
      switch (index) {
        case 0:
          this.$refs.graffiti.destinationOut();
          break;
        case 1:
          this.$refs.graffiti.sourceOver();
          break;
        case 2:
          this.optIndex = index;
          break;
        case 3:
          this.$refs.graffiti.repeal();
          break;
        case 4:
          this.$refs.graffiti.redo();
          break;
        case 5:
          this.$refs.graffiti.clearBoard(true);
          break;
        default:
          break;
      }
    },

    /**
     * 当前位置变化
     * @param {Object} e
     */
    stepChanged(e) {
      this.stepInfo = e;
    },

    /**
     * 更新线条形状
     * @param {Object} shape
     * @param {Object} index
     */
    updateShape(shape, index) {
      if (shape.title === '重置') {
        this.typeIndex = -1
        shape.active = false
        return this.selectWritingOption(5)
      }
      if (shape.title === '回退') {
        return this.selectWritingOption(3)
      }
      if (shape.title === '恢复') {
        return this.selectWritingOption(4)
      }
      if (this.typeIndex == index) {
        // 取消选中橡皮擦
        this.typeIndex = -1
        shape.active = false
        return this.selectWritingOption(1)
      }
      // 选中橡皮擦
      this.typeIndex = index
      shape.active = true
      this.selectWritingOption(0)
      // this.shapes.forEach((item, idx) => item.active = idx == index);
    },

    /**
     * 更新线条颜色
     * @param {Object} color
     * @param {Object} index
     */
    updateColor(color, index) {
      this.colors.forEach((item, idx) => item.active = idx == index);
    },

    /**
     * 更新线条尺寸
     * @param {Object} size
     * @param {Object} index
     */
    updateSize(size, index) {
      this.sizes.forEach((item, idx) => item.active = idx == index);
    },

    /**
     * 保存涂鸦
     */
    savePicture() {
      uni.showLoading();
      this.$refs.graffiti.saveCanvas().then(res => {
        uni.$emit('paintedImg', {
          maskImageUrl: res,
        })

        // uni.saveImageToPhotosAlbum({
        //   filePath: res,
        //   success: () => {
        //     uni.showToast({ title: "保存成功！", });
        //   },
        //   fail: () => {
        //     uni.showToast({
        //       title: "保存失败",
        //       icon: "none",
        //     });
        //   }
        // });
        uni.navigateBack({
          delta: 1
        });

      });
    }
  }
}
</script>

<style  lang="scss">
.page {
  padding: 32rpx;
  min-height: 100vh;
  background-color: #141414;
  overflow-x: hidden;
}

.full-screen {
  width: 100vw !important;
  height: 100vh !important;
}

.flex-center {
  justify-content: center !important;
  align-items: center !important;
}

.explain {
  margin-top: 20rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: #ACACAC;
}

.redraw {
  display: flex;
  position: relative;
  width: 100%;
}

.redraw .redraw-item {
  background: #353535;
  width: 92rpx;
  height: 92rpx;
  text-align: center;
  border-radius: 50%;
  margin-right: 20rpx;

  .icon {
    width: 52rpx;
    height: 48rpx;
  }

  .name {
    font-size: 20rpx;
    color: white;
  }
}

.redraw .redraw-active {
  border: 2rpx solid #5DFFF9;
}

.redraw-start {
  width: 90%;
  height: 96rpx;
  line-height: 96rpx;
  text-align: center;
  background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
  border-radius: 48rpx;
  color: var(--text-color-2);
  font-size: 32rpx;
  font-weight: bold;
}

.create {
  color: #141416;
  background: linear-gradient(180deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 58rpx;
  width: 85%;
  margin: 0 auto;
  font-size: 36rpx;
  font-weight: 500;
  line-height: 100rpx;
  height: 100rpx;
  text-align: center;
  justify-content: center;
}

.page-title {
  width: 120rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.slider-num {
  background: var(--bg-color-2);
  padding: 12rpx 30rpx;
  text-align: center;
  color: var(--text-color);
  border-radius: 12rpx;
  font-size: 24rpx;
}
</style>
