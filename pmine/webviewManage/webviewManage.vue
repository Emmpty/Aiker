<template>
  <!-- #ifdef MP -->
  <web-view :src="mpurl"></web-view>
  <!-- #endif  -->
</template>

<script>
export default {
  data() {
    return {
      mpurl: '',
    }
  },
  onLoad: function (optics) {
    let that = this;

    if (optics.url) {
      that.mpurl = optics.url;
      // #ifndef MP
      window.location.href = that.mpurl;
      // #endif 
      return
    }
    console.log('---------', optics.url);
    if (optics.type == 1) { //加入群聊
      that.mpurl = 'https://m.drawai.cn/docs/1611281992580759553'
    } else if (optics.type == 2) {
      let bannerImgs = getApp().globalData.jsonGoods.banner;
      // 从轮播图过来的
      that.mpurl = bannerImgs[optics.index].url;
    } else if (optics.type == 3) {
      // 招募推广大使
      that.mpurl = 'https://m.drawai.cn/docs/1620662665770827777'
    } else if (optics.type == 4) {
      // 帮助中心
      that.mpurl = 'https://mp.weixin.qq.com/s?__biz=Mzg4Mjg5NDc1OA==&mid=2247484053&idx=1&sn=785146c82eb728cddeb5beedcd391d67&chksm=cf4ef05cf839794ad69c2c01805ee0c04d9d095aae74c90b09e5002a19f96931f6f0314b8d66#rd'
    } else if (optics.type == 5) {
      // 抖音AI作品发布规则
      that.mpurl = 'https://m.drawai.cn/docs/1664548318782595074'
    } else if (optics.type == 6) {
      // 会员充值 更多权益链接
      that.mpurl = 'https://m.drawai.cn/docs/1677153370466619393'
    } else if (optics.type == 7) {
      // 做任务 关注公众号
      that.mpurl = 'https://mp.weixin.qq.com/s/M9t5FF8hvyr9TYr526oXRg'
    } else if (optics.type == 8) {
      that.mpurl = 'https://m.drawai.cn/docs/1686961937088409601'
    } else {
      // 招募推广大使
      that.mpurl = getApp().globalData.jsonGoods.promotion
      // return
    }
    // #ifndef MP
    window.location.href = that.mpurl;
    // #endif 
  },
  // #ifdef MP
  onShareAppMessage() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    };
  },
  // #endif
}
</script>

<style></style>