<template>
  <!-- 横向滚动选择列表 -->
  <scroll-view
    :scroll-x="true"
    :scroll-left="scrollLeft"
    :scroll-with-animation="true"
    class="scroller"
  >
    <view class=" u-flex u-flex-nowrap u-col-center">
      <view
        v-for="(item, index) in list"
        :key="index"
        @click="changeItem(item, index)"
        class="item-box u-flex-col u-col-center u-row-center"
        :class="{
          'active': currentIndex === index
        }"
      >
        <image
          class="item-img"
          :src="currentIndex === index ? (item.gif || item.image) : item.image"
          @error="loadError"
          mode="widthFix"
        ></image>
        <view class="item-name u-line-1">{{ item.title }}</view>
        <!-- <view
            v-if="index === 0"
            class="recommen"
          >最佳</view> -->
      </view>
    </view>
  </scroll-view>
</template>

<script>

export default {
  props: {
    propList: {
      type: Array,
      default() {
        return []
      }
    },
    propIndex: {
      type: Number,
      default() {
        return -1
      }
    },
    selectOne: {
      type: Boolean,
      default() {
        return false
      }
    },
  },
  data() {
    return {
      scrollLeft: 0,
    };
  },
  watch: {
  },
  computed: {
    list() {
      return this.propList || []
    },
    currentIndex() {
      return this.propIndex || 0
    },
  },
  mounted() {
  },
  methods: {
    changeItem(item, index) {
      // if (index > 2) {
      //   this.scrollLeft = (index - 1) * 95
      // } else {
      //   this.scrollLeft = 0
      // }
      if (this.currentIndex === index) {
        if (!this.selectOne) {
          this.$emit("changeItemHandle", { item: {}, index: -1 })
        }
      } else {
        this.$emit("changeItemHandle", { item, index })
      }
    },
    loadError(e) {
      console.error(e);
    },
  },
};
</script>

<style lang="scss" scoped>
.scroller {
  touch-action: none;

  .item-box {
    position: relative;
    width: 184rpx;
    height: 328rpx;
    background: var(--bg-color-2);
    border-radius: 12rpx 12rpx 12rpx 12rpx;

    &.active {
      border: #00EBD3 2rpx solid;
      // color: #00EBD3;
    }

    .item-img {
      will-change: transform;
      width: 100%;
      height: 100%;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
    }

    .item-name {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 42rpx;
      line-height: 42rpx;
      font-size: 24rpx;
      padding: 0 2rpx;
      color: white;
      border-radius: 0 0 16rpx 16rpx;
      background: rgba(0, 0, 0, 0.4);
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .item-box+.item-box {
    margin-left: 20rpx;
  }
}
</style>
