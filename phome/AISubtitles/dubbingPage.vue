<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="配音选择"
    />
    <!-- style="padding-top: 0 !important;" -->
    <view class="u-p-32">
      <u-sticky>
        <u-tabs
          :list="tabList"
          :current="tabCurrent"
          @change="tabChange"
          lineColor="#1affe8"
          :lineWidth="32"
          :activeStyle="{ color: '#1affe8', fontWeight: 'bold', }"
          :inactiveStyle="{ color: '#fff', }"
        >
        </u-tabs>
      </u-sticky>
      <view class="dubbing-list">
        <view
          class="dubbing-item u-flex u-col-center u-row-between"
          v-for="(item, index) in currentVoiceList"
          :key="index"
          @click="selectVoice(item)"
        >
          <view class="dubbing-info  u-flex u-col-center">
            <view class="dubbing-info-image">
              <image
                v-if="item.image"
                :src="item.image"
              ></image>
            </view>

            <view class="dubbing-info-name u-flex-col">
              <view class="name"> {{ item.name }}</view>
              <view class="type">{{ item.intro }}</view>
            </view>
          </view>
          <view
            class="dubbing-right  u-flex u-col-center"
            @click.stop="changeAudio(item, index)"
          >
            <i
              v-if="!audioContext.paused && currentAudioIndex == index"
              class="iconfont icon-zanting"
            ></i>
            <i
              v-else
              class="iconfont icon-bofang"
            ></i>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getAiVoiceList } from "@/static/api/draw.js";

export default {
  data() {
    return {
      tabCurrent: 0,
      currentAudioIndex: -1,
      audioContext: {},
      dubbingList: [],
    }
  },
  computed: {
    currentVoiceList() {
      // return [
      //   { id: 1, name: '测试1', intro: '测试1', audio: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3' },
      //   { id: 2, name: '测试2', intro: '测试2', audio: 'https://samplelib.com/lib/preview/mp3/sample-6s.mp3' }
      // ]
      return this.dubbingList[this.tabCurrent] && this.dubbingList[this.tabCurrent].voices || []
    },
    tabList() {
      if (this.dubbingList.length > 0) {

        return this.dubbingList.map((item) => {
          return { name: item.title }
        })
      }
      return []
    }
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    uni.setInnerAudioOption({
      obeyMuteSwitch: false, // 是否遵循系统静音开关，默认遵循
    })
    // #endif
    this.audioContext = uni.createInnerAudioContext()
    // this.audioContext.obeyMuteSwitch = false // 该设置无效
    this.audioContext.onEnded(() => {
      this.currentAudioIndex = -1
      this.audioContext.pause()
      console.log('----播放完毕清空URL', this.audioContext.paused);
      this.audioContext.src = null
    })

    this.getList()
  },
  onUnload() {
    this.currentAudioIndex = -1
    this.audioContext && this.audioContext.pause()
    this.audioContext && this.audioContext.destroy()
  },
  onReachBottom() {

  },
  methods: {
    tabChange({ index }) {
      this.currentAudioIndex = -1
      this.audioContext && this.audioContext.pause()
      this.tabCurrent = index
    },
    selectVoice(item) {
      uni.$emit('selectVoice', {
        voice: item
      })
      uni.navigateBack({
        delta: 1
      });
    },
    changeAudio(item, index) {
      if (index == this.currentAudioIndex) {
        this.currentAudioIndex = -1
        this.audioContext && this.audioContext.pause()
        return
      }
      console.log('----', item.audio);
      this.currentAudioIndex = index
      this.audioContext.src = item.audio
      this.audioContext.play()
    },
    async getList() {
      try {
        uni.showLoading({ title: '加载中...', mask: true, })
        const { code, result } = await getAiVoiceList()
        uni.hideLoading()
        if (code == 200) {
          this.dubbingList = result
        }
      } catch (error) {
        console.error(error);
        uni.hideLoading()
      }
    },
  },

}
</script>

<style lang="scss" scoped>
.page-content {
  color: var(--text-color);
}

.dubbing-list {

  .dubbing-item {
    font-weight: 500;
    padding: 32rpx 0;
    border-bottom: 2rpx solid #242426;

    .dubbing-info {
      .dubbing-info-image {
        width: 84rpx;
        height: 84rpx;
        border-radius: 100%;
        background-color: #353535;

        image {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }

      .dubbing-info-name {
        font-size: 28rpx;
        color: #fff;
        margin-left: 16rpx;

        .type {
          font-size: 24rpx;
          color: #959595;
          margin-top: 8rpx;
        }
      }
    }

    .dubbing-right {
      font-size: 28rpx;
      color: #fff;

      .icon-bofang,
      .icon-zanting {
        font-size: 48rpx;
      }
    }
  }

  .dubbing-item+.dubbing-item {
    margin-top: 8rpx;
  }
}
</style>
