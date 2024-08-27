<template>
  <view>
    <!-- :style="{ top: top, left: left }" -->
    <image
      class="vip-img"
      mode="heightFix"
      v-if="item.level == userVipLevel"
      v-for="(item, index) in vipList"
      :key="item.level"
      :style="imgStyle"
      :src="item.imageUrl"
    ></image>
  </view>
</template>

<script>

export default {
  props: {
    userVipLevel: {
      type: String | Number,
      default() {
        return ''
      }
    },
    imgStyle: {
      type: String | Object,
      default() {
        return {}
      }
    },

  },
  computed: {

  },
  data() {
    return {
      vipList: [
        {
          level: 0, imageUrl: require('@/static/img/payment/vip0.png'),
        },
        {
          level: 1, imageUrl: 'https://cdn.lingchuang.art/sdv/aiker/vip.png',
        },
        {
          level: 2, imageUrl: 'https://cdn.lingchuang.art/sdv/aiker/svip.png',
        },
      ]
    };
  },
  mounted() {
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
.vip-img {
  position: relative;
  top: 0rpx;
  height: 52rpx;
  margin-left: 20rpx;
}
</style>
