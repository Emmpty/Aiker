<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="图生视频"
    />

    <!-- 图片转视频 -->
    <ai-video
      ref="videoRef"
      :imageUrlObj="imageUrlObj"
      :propMaskImageUrl="maskImageUrl"
      @clearMaskImage="clearMaskImage()"
    ></ai-video>
  </view>
</template>

<script>
import aiVideo from "@/components/creation-board/imageToVideo.vue";

export default {
  components: {
    aiVideo
  },
  data() {
    return {
      imageUrlObj: { imageUrl: '', aspect: '', },
      maskImageUrl: '',
    };
  },
  methods: {
    clearMaskImage() {
      this.maskImageUrl = ''
    },
  },
  onShow() {
    // 拿到剪裁后的图片
    uni.$once('cropImg', (data) => {
      console.log('监听到事件来自 update ，携带参数 msg 为：' + data);
      this.imageUrlObj.imageUrl = data.imageUrl
      this.imageUrlObj.aspect = data.aspect
    })
    // 拿到剪裁后的图片
    uni.$once('paintedImg', (data) => {
      this.maskImageUrl = data.maskImageUrl
      console.log('监听到事件来自 paintedImg ，携带参数为：' + this.maskImageUrl);
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
}</style>
