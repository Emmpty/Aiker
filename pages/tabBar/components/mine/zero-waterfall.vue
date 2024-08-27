<template>
  <view class="container">
    <!-- 画册视图 -->
    <block>
      <view class="waterfall_left">
        <block
          v-for="(item, index) in listLeft"
          :key="item.id"
        >
          <view
            class="waterfall_item"
            v-if="item && item.id > 0"
          >
            <view
              class="item_img"
              @tap="onTap(index, 1, item)"
            >
              <view class="tag-box">{{ getTag(item.type) }}</view>
              <image
                class="shstatuss"
                v-if="statusBox && item.status <= 0"
                :src="item.statusBox ? '/static/img/clip/status_active.png' : '/static/img/clip/status.png'"
              />
              <image
                class="icon"
                :src="item.cover"
                :webp="true"
                @click="albumDetails(item)"
                mode="widthFix"
                @load="considerPush()"
                @error="binderror($event, index, 1)"
              ></image>
              <block v-if="item.status != 0 || item.loadError == 0">
                <view
                  class="defeated"
                  :style="{ color: getStatusColor(item.status) }"
                  @click="albumDetails(item)"
                >{{ getStatusText(item.status) }}</view>
              </block>
            </view>
          </view>
        </block>
      </view>
      <view class="waterfall_right">
        <block
          v-for="(item, index) in listRight"
          :key="item.id"
        >
          <view
            class="waterfall_item"
            v-if="item && item.id > 0"
          >

            <view
              class="item_img"
              @tap="onTap(index, 2, item)"
            >
              <view class="tag-box">{{ getTag(item.type) }}</view>
              <image
                class="shstatuss"
                v-if="statusBox && item.status <= 0"
                :src="item.statusBox ? '/static/img/clip/status_active.png' : '/static/img/clip/status.png'"
              />
              <image
                class="icon"
                :src="item.cover"
                :webp="true"
                @click="albumDetails(item)"
                mode="widthFix"
                @load="considerPush()"
                @error="binderror($event, index, 1)"
              ></image>

              <block v-if="item.status != 0 || item.loadError == 0">
                <view
                  class="defeated"
                  :style="{ color: getStatusColor(item.status) }"
                  @click="albumDetails(item)"
                >{{ getStatusText(item.status) }}</view>
              </block>
            </view>
          </view>
        </block>
      </view>
    </block>
  </view>
</template>
<script>
import { deleteDraw } from "@/static/api/draw.js";

export default {
  name: "zero-waterfall",
  props: {
    // 需要在使用页面 onPageScroll 传进来
    list: {
      type: Array,
      required: true,
      default: []
    },
    // 是否显示选择框
    statusBox: {
      type: Boolean,
    },
    // 视图类型
    viewType: {
      type: [String, Number]
    }
  },
  data() {
    return {
      listLeft: [],
      listRight: [],
      leftHeight: 0,
      rightHeight: 0,
      newList: [],
      queryNode: {},

    }
  },
  watch: {
    list(newValue, oldValue) {
      this.newList = newValue.slice(oldValue.length);
      this.considerPush()
      // this.setWaterfallLayout()
    },
  },
  mounted() {
    // this.init()

    this.queryNode = uni.createSelectorQuery().in(this);
  },

  methods: {
    getTag(type) {
      let text
      switch (type) {
        case 0:
          text = '图生视频'
          break;
        case 1:
          text = '光影舞蹈'
          break;
        case 2:
          text = '山水动图'
          break;
        case 3:
          text = '图生文案'
          break;
        case 4:
          text = '高清'
          break;
        case 5:
          text = '图片说话'
          break;
        case 6:
          text = '视频动漫'
          break;
      }
      return text
    },
    getStatusColor(status) {
      let color = '#FF6850'
      let arr = [-1, -3, -5, -6, -7, -8]
      if (arr.includes(status)) {
        color = '#FF6850'
      } else if (status < 0 || status > 0) {
        color = '#1AFFE8'
      }
      return color
    },
    getStatusText(status) {
      let text = ''
      let arr = [-1, -3, -5, -6, -7, -8]
      if (status < 0) {
        if (arr.includes(status)) {
          switch (status) {
            case -1:
              text = '制作失败'
              break;
            case -3:
              text = '制作超时'
              break;
            case -5:
              text = '参数有误'
              break;
            case -6:
              text = '关键词异常'
              break;
            case -7:
              text = '链接异常'
              break;
            case -8:
              text = '审核不通过'
              break;
            default:
              break;
          }
        } else {
          text = '制作失败'
        }
      } else if (status > 0) {
        if (status == 9) {
          text = '正在等待中'
        } else {
          text = '正在制作中'
        }
      } else if (status == 0) {
        //制作完成但是图片加载失败 loadError == 0
        text = '加载失败'
      }
      return text
    },
    onTap(index, type, item) {
      if (item.status > 0) {
        // 制作中不能选中
        return
      }
      let that = this;
      if (!that.statusBox) return
      if (type == 1) {
        that.listLeft[index].statusBox = !that.listLeft[index].statusBox;
      } else {
        that.listRight[index].statusBox = !that.listRight[index].statusBox;
      }
      that.$emit("clickBox", that.numberSize());
    },

    // 画册选中个数统计
    numberSize(e) {
      let that = this;
      let list = that.listLeft.concat(that.listRight)
      const newArr = list.filter((item, i, arr) => {
        if (item && item.id) {
          return item.statusBox
        }
      })
      return newArr;
    },

    // 全选全不选
    selectAll(status) {
      let that = this;
      let listLeft = that.listLeft
      let listRight = that.listRight
      for (var i = 0; i < listLeft.length; i++) {
        if (listLeft[i] && listLeft[i].id) {
          listLeft[i].statusBox = status ? true : false
        }
      }
      for (var i = 0; i < listRight.length; i++) {
        if (listRight[i] && listRight[i].id) {
          listRight[i].statusBox = status ? true : false
        }
      }
      this.$emit("clickBox", that.numberSize());
    },

    // 删除画册
    albumDelete() {
      uni.showModal({
        title: '温馨提示',
        content: '你确认是否删除？',
        success: (res) => {
          if (res.confirm) {
            let that = this;
            let albumList = that.listLeft.concat(that.listRight);
            let arr = [];
            albumList.map(item => {
              if (item && item.statusBox) {
                arr.push(item.id)
              }
            })
            if (arr.length == 0) {
              uni.showToast({ title: "请选择需要删除的作品", icon: "none", duration: 3000 })
              return
            }
            deleteDraw(arr).then(res => {
              if (res.code == 200) {
                that.localDeletion()
              }
            }).catch(err => { })

          }
        }
      })
    },

    // 删除本地
    localDeletion() {
      let that = this;
      uni.showToast({ title: "删除成功", duration: 3000 })
      that.statusbox = false;
      // 本地删除
      const listLeft = that.listLeft.filter((item, i, arr) => {
        if (item && !item.statusBox) {
          return !item.statusBox
        }
      })
      const listRight = that.listRight.filter((item, i, arr) => {
        if (item && !item.statusBox) {
          return !item.statusBox
        }
      })
      that.listLeft = [...listLeft];
      that.listRight = [...listRight];
      that.$emit("clickBox", that.numberSize());
    },

    // 画册详情
    albumDetails(item) {
      if (item.status == 0 && !this.statusBox) {
        this.$emit("clickAlbumDetails", item);
      }

    },

    // 画册集详情
    albumList(item) {
      let that = this;
      if (!that.statusBox) {
        uni.navigateTo({
          url: "/pages/videoSwiper/videoSwiper?currentId=" + item.id,
        });
      }
    },

    async binderror(event, index, type) {
      console.error('-----------', event.detail.errMsg);
      if (event.detail.errMsg.indexOf("404") != -1) {
        if (this.listLeft[index]) {
          this.$set(this.listLeft[index], 'loadError', 0)
          this.$set(this.listLeft[index], 'cover', 'https://cdn.lingchuang.art/ling/load-error.jpg')
        }
        if (this.listRight[index]) {
          this.$set(this.listRight[index], 'loadError', 0)
          this.$set(this.listRight[index], 'cover', 'https://cdn.lingchuang.art/ling/load-error.jpg')
        }
      }
    },

    // 触发重新排列
    init() {
      this.newList = [...this.list];
      this.listLeft = [];
      this.listRight = [];
      console.log(this.newList, '我被调用了')
      if (this.newList.length != 0) {
        console.log(this.newList.shift(), 'this.newList.shift()')
        this.listLeft.push(this.newList.shift()); //触发排列
        // this.listRight.push(this.newList[1]); //触发排列
      }
    },
    // 清空数据列表
    clear() {
      this.listLeft = [];
      this.listRight = [];
      // 同时清除父组件列表中的数据
      this.$emit('clear', []);
      this.newList = [];
    },
    async considerPush() {
      // return
      if (this.newList.length == 0) return; //没有数据了
      let leftH = 0, rightH = 0; //左右高度

      this.queryNode.select('.waterfall_left').boundingClientRect()
      this.queryNode.select('.waterfall_right').boundingClientRect()

      // 等待 exec 完成
      let res = await new Promise((resolve) => {
        this.queryNode.exec(resolve);
      });
      // console.log('-----------', res[0].height, res[1].height);
      if (res.length !== 0) {
        leftH = res[0].height //防止查询不到做个处理
        rightH = res[1].height
      }



      let currentItem = this.newList.shift()
      // 去重，避免左右列表出现相同的数据
      if (currentItem) {
        let index = this.listLeft.concat(this.listRight).findIndex((item) => item.id == currentItem.id)
        if (index != -1) {
          return
        }
        if (leftH <= rightH) {
          // 相等 || 左边小  
          this.listLeft.push(currentItem);
        } else {
          // 右边小
          this.listRight.push(currentItem);
        }

      }

    },

    // 设置瀑布流布局
    async setWaterfallLayout() {
      for (var i = 0; i < this.newList.length; i++) {
        let item = this.newList[i];
        try {
          await uni.getImageInfo({
            src: item.cover,
            success: (imgInfo) => {
              let height = imgInfo.height
              console.log(imgInfo);
              if (this.leftHeight <= this.rightHeight) {
                this.listLeft.push(item);
                this.leftHeight += height;
              } else {
                this.listRight.push(item);
                this.rightHeight += height;
              }
            },
            fail: (e) => {
              console.error(e);
            }
          })

        } catch (error) {
          console.log(error);
        }
      }
    },
    // 计算排列
    // considerPush() {
    // 	if (this.newList.length == 0) return; //没有数据了
    // 	let leftH = 0,
    // 		rightH = 0; //左右高度
    // 	var query = uni.createSelectorQuery().in(this);

    // 	query.selectAll('.waterfall_left').boundingClientRect()
    // 	query.selectAll('.waterfall_right').boundingClientRect()
    // 	query.exec(res => {
    // 		// console.log('结果',res)
    // 		leftH = res[0].length != 0 ? res[0][0].height : 0; //防止查询不到做个处理
    // 		rightH = res[1].length != 0 ? res[1][0].height : 0;
    // 		// console.log('结果',leftH,rightH)
    // 		if (leftH == rightH || leftH < rightH) {
    // 			// 相等 || 左边小  
    // 			this.listLeft.push(this.newList.shift());
    // 		} else {
    // 			// 右边小
    // 			this.listRight.push(this.newList.shift());
    // 		}
    // 	});
    // },

  }

}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: flex-start;
  padding: 0rpx 10rpx;
}

.waterfall_left,
.waterfall_right {
  width: 50%;
}

.waterfall_item {
  width: 100%;
  padding: 8rpx 10rpx;
  position: relative;

  .tag-box {
    position: absolute;
    right: 12rpx;
    top: 12rpx;
    padding: 4rpx 8rpx;
    background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
    border-radius: 8rpx;
    font-size: 16rpx;
    font-weight: 500;
    color: #000;
    z-index: 5;
  }

  .item_img {
    width: 100%;
    position: relative;
    border-radius: 32rpx;

    .icon {
      width: 100%;
      border-radius: 32rpx;
    }

    .shstatuss {
      position: absolute;
      top: 20rpx;
      left: 20rpx;
      width: 40rpx;
      height: 40rpx;
      z-index: 9;
    }

    .defeated {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      color: white;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 32rpx;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .number {
      color: #FFFFFF;
      padding-bottom: 10rpx;
      padding-left: 24rpx;
      line-height: 60rpx;
      z-index: 999;
    }
  }


}
</style>