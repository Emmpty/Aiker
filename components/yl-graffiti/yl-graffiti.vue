<template>
  <view
    style="position: relative;background-color: #fff;"
    :style="canvasStyle"
  >
    <!-- 合成canvas -->
    <canvas
      style="position: absolute;top: 0px;left: 150%;"
      id="compoundCanvas"
      canvas-id="compoundCanvas"
      :style="compoundCanvasStyle"
      :disable-scroll="true"
    >
    </canvas>
    <!-- 底图canvas获取rgba色值 -->
    <canvas
      style="position: absolute;top: 0px;left: 0px;"
      id="imageCanvas"
      canvas-id="imageCanvas"
      :style="canvasStyle"
      :disable-scroll="true"
    >
    </canvas>
    <!-- 涂抹canvas -->
    <canvas
      style="position: absolute;top: 0px;left: 0px;z-index:99;"
      id="defCanvas"
      canvas-id="defCanvas"
      :style="defCanvasStyle"
      :disable-scroll="true"
      @touchstart.stop="penStart"
      @touchmove.stop="penMove"
      @touchend.stop="penEnd"
    >
    </canvas>


  </view>
</template>

<script>
// 绘制点集合
let drawFigures = [];
// 保存操作的像素数据
let imageData = [];

export default {
  name: 'yl-graffiti',
  props: {
    // 画布ID
    canvasId: {
      type: String,
      default: 'defCanvas'
    },
    // 画布宽度
    width: {
      type: Number,
      default: 300
    },
    // 画布高度
    height: {
      type: Number,
      default: 225
    },
    // 原图宽度
    imgWidth: {
      type: Number,
      default: 0
    },
    // 原图高度
    imgHeight: {
      type: Number,
      default: 0
    },
    // 图形 默认曲线 curve/line/rect/hollow-rect/circle/hollow-circle
    shape: {
      type: String,
      default: "curve"
    },
    // 画笔颜色
    lineColor: {
      type: String,
      default: '#ffffff'
    },
    // 画笔宽度
    lineWidth: {
      type: Number,
      default: 5
    },
    // 画布背景颜色
    bgColor: {
      type: String,
      default: "transparent"
    },
    // 画布背景图片
    bgImage: {
      type: String,
      default: ""
    },
    typeIndex: {
      type: String | Number,
      default: "-1",
    }
  },

  data() {
    return {
      imageCanvasContext: null,
      compoundCanvasContext: null,
      myCanvasContext: null,
      curStep: -1, // 当前步数
      // #ifdef MP-WEIXIN
      topLeftPoint: { // 画布左上角点
        left: 0,
        top: 0
      },
      // #endif
      startX: 0, // 前一个绘制节点X轴
      startY: 0, // 前一个绘制节点Y轴
      curBgImage: null,
      canDraw: false,
      currentOperationType: 'source-over',
      deviceInfo: {}
    }
  },

  /**
   * 初始化画板
   */
  mounted() {
    // #ifdef MP
    this.deviceInfo = uni.getSystemInfoSync()
    // #endif

    // 有背景图片初始化
    if (this.bgImage) {
      this.imageCanvasContext = uni.createCanvasContext("imageCanvas", this);
      this.compoundCanvasContext = uni.createCanvasContext("compoundCanvas", this);
      this.myCanvasContext = uni.createCanvasContext("defCanvas", this);
      // 设置背景色
      if (this.bgColor) {
        this.setBackgroundColor();
      }
      // this.myCanvasContext.globalAlpha = 0
      // 绘制图片
      this.imageCanvasContext.drawImage(this.bgImage, 0, 0, this.width, this.height);
      this.imageCanvasContext.draw();
      // 让线条圆润
      this.myCanvasContext.setLineCap('round');
      this.myCanvasContext.strokeStyle = this.lineColor;
      this.myCanvasContext.setFillStyle(this.lineColor);
      this.myCanvasContext.setLineWidth(this.lineWidth);
    }


    // #ifdef MP-WEIXIN
    this.getBoundingClientRect(`#${this.canvasId}`, this).then(res => {
      this.topLeftPoint = res;
    })
    // #endif

    drawFigures = [];
    imageData = [];

    // this.myCanvasContext.globalCompositeOperation = 'destination-out'; // 设置为擦除模式  
  },

  computed: {
    /**
     * 画布样式
     */
    canvasStyle() {
      if (this.bgImage) {
        const bgImage = this.curBgImage || this.bgImage;
        return `width:${this.width}px;height:${this.height}px;background-image:url(${bgImage});background-size:${this.width}px ${this.height}px;left:calc(50% - ${this.width / 2});`;
      }
      return `width:${this.width}px;height:${this.height}px;`;
    },

    /**
     * 画布样式
     */
    defCanvasStyle() {
      return `width:${this.width}px;height:${this.height}px;background:rgba(255,255,255,0)`;
    },
    compoundCanvasStyle() {
      return `width:${this.imgWidth}px;height:${this.imgHeight}px;background:rgba(255,255,255,0)`;
    },
  },

  watch: {
    /**
     * 设置线条颜色
     */
    lineColor() {

      if (this.bgImage) {
        this.myCanvasContext.strokeStyle = this.lineColor;
        this.myCanvasContext.setFillStyle(this.lineColor);
      }
    },

    /**
     * 设置线条颜色
     */
    lineWidth() {

      if (this.bgImage) {
        this.myCanvasContext.setLineWidth(this.lineWidth);
      }
    },

    /**
     * 当前位置
     */
    curStep() {
      this.$emit("stepChanged", {
        curStep: this.curStep,
        len: imageData.length
      })
    },
    currentOperationType(newV, oldV) {
      this.myCanvasContext.globalCompositeOperation = newV
    }
  },

  methods: {
    /**
     * 清空画板
     */
    clearBoard(clearData = true) {
      // 清除之前恢复默认绘制模式
      this.myCanvasContext.globalCompositeOperation = 'source-over';

      this.myCanvasContext.clearRect(0, 0, this.width, this.height);
      this.myCanvasContext.draw();

      this.myCanvasContext.setLineCap('round');
      this.myCanvasContext.strokeStyle = this.lineColor;
      this.myCanvasContext.setFillStyle(this.lineColor);
      this.myCanvasContext.setLineWidth(this.lineWidth);

      this.imageCanvasContext.drawImage(this.bgImage, 0, 0, this.width, this.height);
      this.imageCanvasContext.draw();
      // 清空
      if (clearData) {
        // 重置数据
        this.curStep = -1;
        this.currentOperationType = 'source-over'
        imageData = [];
        if (this.bgImage) {
          this.curBgImage = null;
        }

        return
      }

      if (!clearData && this.curStep == -1) {
        this.imageCanvasContext.drawImage(this.bgImage, 0, 0, this.width, this.height);
        this.imageCanvasContext.draw();
      }

    },



    /**
     * 将保存的画布内容重新写入画布
     */
    restoreImageData(index = this.curStep) {
      if (this.bgImage) {
        this.curBgImage = imageData[index];
        console.log('----------- this.curBgImage-', this.curBgImage);
        this.myCanvasContext.drawImage(imageData[index], 0, 0, this.width, this.height);
        this.myCanvasContext.draw();
      }
    },


    /**
     * 撤销操作
     */
    repeal() {
      if (this.curStep != -1) {
        this.curStep = this.curStep - 1;
        this.clearBoard(false);
        if (this.curStep != -1) {
          this.restoreImageData();
        } else if (this.bgImage) {
          this.curBgImage = null;
        }
      }
    },

    /**
     * 重做操作
     */
    redo() {
      if (this.curStep < imageData.length - 1) {
        this.curStep = this.curStep + 1;
        this.clearBoard(false);
        if (this.curStep < imageData.length) {
          this.restoreImageData();
        }
      }
    },
    /**
     * 橡皮擦
     */
    destinationOut() {
      // this.myCanvasContext.strokeStyle = "transparent";
      // this.myCanvasContext.setFillStyle("transparent");
      this.currentOperationType = 'destination-out'; // 设置为擦除模式

    },
    /**
     * 正常涂抹
     */
    sourceOver() {
      this.myCanvasContext.strokeStyle = this.lineColor;
      this.myCanvasContext.setFillStyle(this.lineColor);
      this.currentOperationType = 'source-over'; // 设置为恢复模式
    },

    /**
     * 设置画板背景颜色
     */
    setBackgroundColor() {
      if (this.bgImage) {
        this.myCanvasContext.setFillStyle(this.bgColor);
        this.myCanvasContext.fillRect(0, 0, this.width, this.height);
        this.myCanvasContext.fill();
        this.myCanvasContext.draw();
      }
    },

    /**
     * 保存画布内容
     */
    async saveCanvas() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          uni.canvasToTempFilePath({
            canvasId: 'defCanvas',
            quality: 1,
            success: (res) => {
              console.log(' res.tempFilePath', res.tempFilePath);
              this.compoundCanvasContext.drawImage(this.bgImage, 0, 0, this.imgWidth, this.imgHeight);
              this.compoundCanvasContext.drawImage(res.tempFilePath, 0, 0, this.imgWidth, this.imgHeight);
              this.compoundCanvasContext.draw();
              setTimeout(() => {
                this.$nextTick(() => {

                  uni.canvasGetImageData({
                    canvasId: 'compoundCanvas',
                    x: 0,
                    y: 0,
                    width: this.imgWidth,
                    height: this.imgHeight,
                    success: (res) => {
                      let data = res.data;
                      for (let i = 0; i < data.length; i += 4) {
                        let r = data[i];
                        let g = data[i + 1];
                        let b = data[i + 2];
                        if (r > 250 && g > 250 && b > 250) { // 白色
                          data[i + 3] = 0;
                        }
                      }
                      // console.log(data);
                      uni.canvasPutImageData({
                        canvasId: 'compoundCanvas',
                        data: data,
                        x: 0,
                        y: 0,
                        width: this.imgWidth,
                        height: this.imgHeight,
                        success: (res) => {

                          let canvasData = {
                            canvasId: 'compoundCanvas',
                            quality: 1,
                            destWidth: this.imgWidth,
                            destHeight: this.imgHeight,
                          }

                          // #ifdef MP
                          let systemVersion = this.deviceInfo.system.indexOf('iOS 17')
                          if (systemVersion > -1) {
                            // ios17+版本不能指定输出图片的宽高，指定会导致上面把白色rgba的区域转成透明失效
                            delete canvasData.destWidth
                            delete canvasData.destHeight
                          }
                          // #endif

                          uni.canvasToTempFilePath({
                            ...canvasData,
                            success: (res1) => {
                              // console.log(' res1.tempFilePath', res1.tempFilePath);
                              resolve(res1.tempFilePath);
                            },
                            fail: (err) => {
                              console.error('333', err);
                            }
                          }, this);

                        },
                        fail: (err) => {
                          console.error('PutImageData失败', err);
                        }
                      }, this)
                    },
                    fail: (err) => {
                      console.error('获取imageData失败', err);
                    }
                  }, this)
                })
              }, 500);


            },
            fail: (err) => {
              console.error('合成失败', err);
            }
          }, this);
        }, 100);
      })
    },

    /**
     * 保存画布内容
     */
    saveImageData() {
      uni.canvasToTempFilePath({
        canvasId: "defCanvas",
        quality: 1,
        success: res => {
          // console.log("saveImageData path: ", res.tempFilePath)
          if (this.curStep < imageData.length - 1) {
            imageData = imageData.filter((item, index) => index <= this.curStep);
          }
          imageData.push(res.tempFilePath);
          this.curStep += 1;
        },
        fail: err => {
          console.log('saveImageData failed: ', err);
        }
      }, this);
    },

    /**
     * 绘制所有图形
     */
    drawGraph() {
      drawFigures.forEach(figure => {
        const {
          shape,
          lineColor,
          lineWidth,
          points
        } = figure;
        // 初始化颜色和线宽
        this.myCanvasContext.strokeStyle = lineColor;
        this.myCanvasContext.setFillStyle(lineColor);
        this.myCanvasContext.setLineWidth(lineWidth);

        const startX = points[0].x;
        const startY = points[0].y;
        const endX = points[1] ? points[1].x : 0;
        const endY = points[1] ? points[1].y : 0;

        switch (shape) {
          case "curve":
            this.drawCurveOnce(points, this.myCanvasContext);
            break;
          case "rect":
            this.drawRect(startX, startY, endX, endY, this.myCanvasContext);
            break;

        }
      })
      this.myCanvasContext.draw(true)

    },

    /**
     * 开始接触事件
     * @param {Object} e
     */
    penStart(e) {
      // console.log("penStart: ", e.touches)
      // #ifdef MP-WEIXIN
      const x = e.touches[0].pageX - this.topLeftPoint.left;
      const y = e.touches[0].pageY - this.topLeftPoint.top;
      // #endif
      // #ifndef MP-WEIXIN
      const x = e.touches[0].x;
      const y = e.touches[0].y;
      // #endif

      if (this.currentOperationType == 'destination-out') {
        this.myCanvasContext.globalCompositeOperation = 'destination-out'
      } else {
        this.myCanvasContext.globalCompositeOperation = 'source-over';
      }

      if (this.bgImage) {
        this.myCanvasContext.beginPath();
      }
      this.startX = x;
      this.startY = y;

      switch (this.shape) {
        case "curve":
          this.drawCurve(x, y);
          break;
        default:
          break;
      }
      drawFigures = drawFigures.filter((figure, index) => index <= this.curStep);
      drawFigures.push({
        shape: this.shape,
        lineColor: this.lineColor,
        lineWidth: this.lineWidth,
        points: [{
          x,
          y
        }]
      });
    },

    /**
     * 滑动事件
     * @param {Object} e
     */
    penMove(e) {
      // if (this.intervalId) {
      //   clearInterval(this.intervalId);
      //   this.intervalId = null;
      // }
      // this.intervalId = setInterval(_ => this.canDraw = true, 100);

      try {
        // #ifdef MP-WEIXIN
        const x = e.touches[0].pageX - this.topLeftPoint.left;
        const y = e.touches[0].pageY - this.topLeftPoint.top;

        // #endif
        // #ifndef MP-WEIXIN
        const x = e.touches[0].x;
        const y = e.touches[0].y;
        // #endif
        // console.log("penMove: ", x, y)
        switch (this.shape) {
          case "curve":
            this.addToPoints(x, y);
            this.drawCurve(x, y);
            if (this.bgImage) {
              this.myCanvasContext.draw(true);
            }
            break;

          case "rect":
            this.addToPoints(x, y);
            this.drawGraph();
            break;

          default:
            break;
        }
      } catch (error) {
        console.error(error);
      }

    },

    /**
     * 离开屏幕事件
     * @param {Object} e
     */
    penEnd(e) {
      // console.log("penEnd: ", e);

      // #ifdef MP-WEIXIN
      const x = e.changedTouches[0].pageX - this.topLeftPoint.left;
      const y = e.changedTouches[0].pageY - this.topLeftPoint.top;
      // #endif
      // #ifndef MP-WEIXIN
      const x = e.changedTouches[0].x;
      const y = e.changedTouches[0].y;
      // #endif

      switch (this.shape) {
        case "curve":
          this.addToPoints(x, y);
          this.drawCurve(x, y);
          break;

        case "rect":
          this.addToPoints(x, y);
          if (this.bgImage) {
            this.drawRect(this.startX, this.startY, x, y, this.myCanvasContext);
            this.myCanvasContext.draw(true);
          }
          // this.drawGraph();
          break;

        default:
          break;
      }
      this.saveImageData();
    },

    /**
     * 添加到点数组
     * @param {Object} x
     * @param {Object} y
     */
    addToPoints(x, y) {
      const drawFigure = drawFigures[this.curStep + 1];
      if (this.shape == "curve") {
        drawFigure.points.push({
          x,
          y
        });
      } else if (drawFigure.points.length == 1) {
        drawFigure.points.push({
          x,
          y
        });
      } else {
        drawFigure.points[1] = {
          x,
          y
        };
      }
    },

    /**
     * 一次绘制完整曲线
     */
    drawCurveOnce(points, ctx = this.myCanvasContext) {
      points.forEach((point, index) => {
        if (index != 0) {
          let x = point.x
          let y = point.y
          let width = point.x - points[index - 1].x
          let height = point.y - points[index - 1].y

          if (this.bgImage) {
            this.myCanvasContext.clearRect(x, y, width, height)
            this.myCanvasContext.draw(true);
          }
        }
      })
    },

    /**
     * 绘制曲线中间添加点
     * @param {Object} x
     * @param {Object} y
     */
    drawCurve(x, y, ctx = this.myCanvasContext) {
      if (this.bgImage) {
        // 橡皮擦模式
        if (this.currentOperationType == 'destination-out') {
          this.myCanvasContext.globalCompositeOperation = 'destination-out';
          if (this.deviceInfo.platform == 'ios') {
            this.myCanvasContext.setLineWidth(this.lineWidth + 2);
            ctx.moveTo(this.startX, this.startY)
            ctx.lineTo(x, y);
            ctx.stroke();
          } else {
            // 安卓端对destination-out的支持有问题，无法像ios那样涂抹擦除
            ctx.arc(x, y, (this.lineWidth / 2) + 2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // 确保在非橡皮擦模式下将globalCompositeOperation设置回默认值
          this.myCanvasContext.globalCompositeOperation = 'source-over';
          ctx.moveTo(this.startX, this.startY)
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }

      this.startX = x;
      this.startY = y;
    },



    /**
     * 这里是画实体矩形
     * @param {Object} startX
     * @param {Object} startY
     * @param {Object} x
     * @param {Object} y
     * @param {Object} ctx
     */
    drawRect(startX, startY, x, y, ctx = this.myCanvasContext) {
      let width = x - startX;
      let height = y - startY;
      // this.myCanvasContext.clearRect(startX, startY, width, height)
      ctx.beginPath();
      ctx.rect(startX, startY, width, height); // 绘制圆形
      ctx.fill(); // 填充圆形，实际上是清除这部分区域

    },
    /**
     * 获取组件信息
     * @param {Object} selector
     * @param {Object} queryIn
     */
    getBoundingClientRect(selector, queryIn) {
      const selectors = selector.split(",");
      if (selectors.length == 1) {
        return new Promise((resolve) => {
          const query = uni.createSelectorQuery();
          if (queryIn) {
            query.in(queryIn).select(selector).boundingClientRect(res => resolve(res)).exec();
          } else {
            query.select(selector).boundingClientRect(res => resolve(res)).exec();
          }
        })
      } else {
        return new Promise((resolve) => {
          const query = uni.createSelectorQuery();
          if (queryIn) {
            query.in(queryIn).selectAll(selector).boundingClientRect(res => resolve(res)).exec();
          } else {
            query.selectAll(selector).boundingClientRect(res => resolve(res)).exec();
          }
        })
      }
    }
  }
}
</script>

<style></style>