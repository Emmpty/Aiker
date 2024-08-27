<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="光影舞蹈"
    />

    <!-- 光影舞蹈 -->
    <ai-dance ref="danceRef"></ai-dance>
  </view>
</template>

<script>
import aiDance from "@/components/creation-board/dance.vue";

export default {
  components: {
    aiDance
  },
  data() {
    return {

    };
  },
  onShow() {
    console.log('>>>>>>>>>>>>>>>>>', this.$refs.danceRef);
    this.$refs.danceRef && this.$refs.danceRef.getFirstImg()

  },
  onHide() {
    this.$refs.danceRef && this.$refs.danceRef.clearTimer()
  },
  // #ifdef MP
  onShareAppMessage() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    };
  },

  onShareTimeline() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    }
  }
  // #endif
}
</script>

<style lang="scss">
.page-content {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-color);
}
</style>
