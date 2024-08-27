<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="山水动图"
    />

    <!-- 图片转视频 -->
    <ai-landscape
      ref="videoRef"
      :imageUrlObj="imageUrlObj"
    ></ai-landscape>
  </view>
</template>

<script>
import aiLandscape from "@/components/creation-board/imageToLandscape.vue";

export default {
  components: {
    aiLandscape
  },
  data() {
    return {
      imageUrlObj: { imageUrl: '', aspect: '' },
    };
  },
  onShow() {
    // 拿到剪裁后的图片
    uni.$once('cropImg', (data) => {
      console.log('监听到事件来自 update ，携带参数 msg 为：' + data);
      this.imageUrlObj = data
    })
  },
  onHide() {

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
