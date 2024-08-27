<template>
  <view class="container">
    <view class="waterfall_left">
      <block
        v-for="(item, index) in listLeft"
        :key="index"
      >
        <view
          class="waterfall_item"
          v-if="item && item.id > 0"
        >
          <view
            class="item_img"
            :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '#262628' }"
          >
            <image
              class="icon"
              :src="item.cover || 'https://cdn.lingchuang.art/sdv/default.jpg'"
              mode="widthFix"
              @load="considerPush"
              @error="binderror($event, index, 1)"
              @click="albumDetails(item)"
            ></image>
            <date :params="item"></date>
          </view>
        </view>
      </block>
    </view>
    <view class="waterfall_right">
      <block
        v-for="(item, index) in listRight"
        :key="index"
      >
        <view
          class="waterfall_item"
          v-if="item && item.id > 0"
        >
          <view
            class="item_img"
            :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '#262628' }"
          >
            <image
              class="icon"
              :src="item.cover"
              mode="widthFix"
              @load="considerPush"
              @error="binderror($event, index, 2)"
              @click="albumDetails(item)"
            ></image>
            <date :params="item"></date>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>
<script>
import date from "./date.vue";

export default {
  name: "zero-waterfall",
  components: {
    date,
  },
  props: {
    // 需要在使用页面 onPageScroll 传进来
    list: {
      type: Array,
      required: true,
      default: []
    },
    // 图片裁剪模式
    imgMode: {
      type: String,
      default: 'widthFix'
    },
  },
  data() {
    return {
      listLeft: [],
      listRight: [],
      newList: [],
    }
  },
  watch: {
    list(newValue, oldValue) {
      this.newList = newValue.slice(oldValue.length);
      this.considerPush()
    },
  },
  mounted() {
    // this.init()
  },

  methods: {

    onTap(index, type) {
      let that = this;
      if (!that.statusBox) return
      // if(type==1){
      // 	that.listLeft[index].statusBox=!that.listLeft[index].statusBox;
      // }else{
      // 	that.listRight[index].statusBox=!that.listRight[index].statusBox;
      // }
      // that.$emit("clickBox",that.numberSize());
    },



    // 画册详情
    albumDetails(item) {
      this.$emit("clickAlbumDetails", item);

    },

    // 触发重新排列
    init() {
      this.newList = [...this.list];
      this.listLeft = [];
      this.listRight = [];
      if (this.newList.length != 0) {
        // console.log(this.newList.shift(),'')
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
    async binderror(event, index, type) {
      console.log(event, '888')
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
    async considerPush() {
      if (this.newList.length == 0) return; //没有数据了
      let leftH = 0,
        rightH = 0; //左右高度
      var query = uni.createSelectorQuery().in(this);

      query.selectAll('.waterfall_left').boundingClientRect()
      query.selectAll('.waterfall_right').boundingClientRect()

      // 等待 exec 完成
      let res = await new Promise((resolve) => {
        query.exec(resolve);
      });

      leftH = res[0].length != 0 ? res[0][0].height : 0; //防止查询不到做个处理
      rightH = res[1].length != 0 ? res[1][0].height : 0;
      // console.log(this.newList.shift(),'listLeft')
      if (leftH == rightH || leftH < rightH) {
        // 相等 || 左边小  
        this.listLeft.push(this.newList.shift());
      } else {
        // 右边小
        this.listRight.push(this.newList.shift());
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
  padding: 20rpx 10rpx;
}

.waterfall_left,
.waterfall_right {
  width: 50%;
}

.waterfall_item {
  width: 100%;
  padding: 10rpx;
  border-radius: 32rpx;

  .item_img {
    width: 100%;
    position: relative;
    border-radius: 32rpx;

    // padding:14rpx;
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
      background: #666;
      border-radius: 4rpx;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .number {
      color: #666;
      padding-top: 14rpx;
      line-height: 60rpx;
    }
  }


}
</style>