<template>
  <!-- 尺寸比例 -->
  <scroll-view
    :scroll-x="true"
    :scroll-left="scrollLeft"
    :scroll-with-animation="true"
    class="scroller"
  >
    <view class=" u-flex u-flex-nowrap u-col-center">
      <view
        class="scales-item u-flex-col u-col-center u-row-between"
        v-for="(item, index) in list"
        :key="index"
        :class="{ 'scales-active': index == currentIndex }"
        @click="changeItem(item, index)"
      >
        <view
          class="ratio"
          :style="{ width: item.width, height: item.height }"
        ></view>
        <view class="name"> {{ item.name }}</view>
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

  },
  watch: {
    propList(newVal, oldVal) {
      this.list = newVal
    },
    propIndex(newVal, oldVal) {
      this.currentIndex = newVal
    },
  },
  computed: {

  },
  data() {
    return {
      scrollLeft: 0,
      currentIndex: 0,
      list: [
        { name: '9:16', width: '32rpx', height: '58rpx' },
        { name: '16:9', width: '58rpx', height: '32rpx' },
        { name: '1:1', width: '48rpx', height: '48rpx' },
        { name: '2:3', width: '36rpx', height: '56rpx' },
        { name: '3:2', width: '56rpx', height: '36rpx' },
        { name: '3:4', width: '46rpx', height: '56rpx' },
        { name: '4:3', width: '56rpx', height: '46rpx' },
      ]
    };
  },
  mounted() {
  },
  methods: {
    changeItem(item, index) {
      if (index > 3) {
        this.scrollLeft = (index - 1) * 60
      } else {
        this.scrollLeft = 0
      }
      if (this.currentIndex === index) {
        this.currentIndex = -1
        this.$emit("changeItemHandle", { item: {}, index })
      } else {
        this.currentIndex = index
        this.$emit("changeItemHandle", { item, index })
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.scroller {
  font-size: 26rpx;
  touch-action: none;

  .scales-item {
    width: 120rpx;
    height: 120rpx;
    background: var(--bg-color-2);
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    // border: 2rpx solid #6BE7D3;
    position: relative;
    margin: 0 0 12rpx 12rpx;
    padding: 20rpx;
    padding-bottom: 8rpx;

    &.scales-active {
      border: #00EBD3 2rpx solid;
      // color: #00EBD3;
    }

    .ratio {
      max-width: 56rpx;
      max-height: 56rpx;
      background: var(--bg-color-3);
      margin: 0 auto;
      border-radius: 4rpx 4rpx 4rpx 4rpx;
    }

    .name {
      color: var(--text-color);
      height: 32rpx;
      margin-top: 8rpx;
    }

    .custon-text {
      font-size: 24rpx;
      color: var(--text-color);
    }
  }
}
</style>
