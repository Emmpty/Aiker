<template>
  <view
    v-if="showModel"
    class="model u-flex u-col-center u-row-center"
    :class="[cueTheme, { 'modal-out': showFadeOut }]"
    catchtouchmove="ture"
    @click="maskClick()"
  >
    <!-- <u-popup
    :show="showModel"
    mode="center"
  > -->
    <view
      class="model-body "
      :class="{ 'modal-out': showFadeOut }"
    >
      <view class="title">
        {{ title }}
        <i
          v-if="showClose"
          class="iconfont icon-guanbi"
          @click="cancelHandle()"
        ></i>
      </view>
      <!-- 插槽 -->
      <template v-if="$slots.content">
        <slot name="content" />
      </template>
      <!-- 默认内容 -->
      <template v-else>
        <view class="title-illust">
          {{ tips }}
        </view>
      </template>


      <view
        v-if="!hideBtn"
        class="btns"
      >
        <view
          v-if="!hideCancel"
          class="btnsize"
          :style="cancelStyle"
          @click="cancelHandle()"
        >
          {{ cancelText || '取消' }}
        </view>
        <view
          class="btnsize actice"
          :style="confirmStyle"
          @click="confirmHandle()"
        >
          {{ confirmText || '确定' }}
        </view>
      </view>
    </view>
    <!-- </u-popup> -->

  </view>
</template>

<script>

export default {
  props: {
    showModel: {
      type: Boolean,
      default() {
        return false
      }
    },
    title: {
      type: String,
      required: false,
      default() {
        return '温馨提示'
      }
    },
    tips: {
      type: String,
      required: false,
      default() {
        return ''
      }
    },
    hideCancel: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    },
    hideBtn: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    },
    showClose: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    },
    cancelText: {
      type: String,
      required: false,
      default() {
        return ''
      }
    },
    confirmText: {
      type: String,
      required: false,
      default() {
        return ''
      }
    },
    cancelStyle: {
      type: String,
      required: false,
      default() {
        return `flex: 1;`
      }
    },
    confirmStyle: {
      type: String,
      required: false,
      default() {
        return `flex: 1;`
      }
    },
    closeOnClickOverlay: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    },
  },
  computed: {
  },
  data() {
    return {
      showFadeOut: false,
    };
  },
  mounted() {
  },
  beforeDestroy(){
    // 该组件通过v-if来控制,实际上并没有销毁掉
    this.showFadeOut = false
    console.error('---------------------------------');
  },
  methods: {
    cancelHandle() {
      this.showFadeOut = true
      setTimeout(() => {
        this.showFadeOut = false
        this.$emit("cancelHandle")
      }, 300);
    },
    confirmHandle() {
      this.showFadeOut = true
      setTimeout(() => {
        this.showFadeOut = false
        this.$emit("confirmHandle")
      }, 300);
    },
    maskClick() {
      if (!this.closeOnClickOverlay) return
      this.showFadeOut = true
      setTimeout(() => {
        this.showFadeOut = false
        this.$emit("cancelHandle")
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;

  &.modal-out {
    animation: fadeOut 0.3s ease-out forwards;
  }
}

.model-body {
  min-width: 600rpx;
  max-width: 85vw;
  min-height: 324rpx;
  border-radius: 32rpx;
  color: white;
  // position: fixed;
  // top: 48%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  padding: 0 30rpx;
  background-color: #191919;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  animation: popIn 0.3s ease-out 1;

  .title {
    color: var(--text-color);
    padding: 30rpx 0;
    font-size: 32rpx;
    text-align: center;
    position: relative;
    font-weight: bold;
  }

  .icon-guanbi {
    position: absolute;
    right: 0;
    top: 30rpx;
  }

  .title-illust {
    font-size: 26rpx;
    text-align: left;
    line-height: 40rpx;
    padding: 0 20rpx;
  }

  .btns {
    display: flex;
    justify-content: space-around;
    margin: 50rpx 0 30rpx;

    .btnsize {
      flex: 1;
      height: 44px;
      line-height: 44px;
      color: var(--text-color);
      background: rgba(18, 18, 18, 0.04);
      border-radius: 70rpx;
      opacity: 1;
      margin: 0;
      border: 2rpx solid #E4E4E4;
      text-align: center;
      font-weight: bold;

      &.actice {
        background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
        border: none;
        color: #141416;
      }
    }

    .btnsize+.btnsize {
      margin-left: 20rpx;
    }
  }

  &.modal-out {
    animation: popOut 0.3s ease-out forwards;
  }
}

@keyframes popIn {
  from {
    transform: scale(0.7);
    /* 开始时，元素被缩小到原来的一半 */
    opacity: 0;
    /* 开始时，元素完全透明 */
  }

  to {
    transform: scale(1);
    /* 结束时，元素放大到原始大小 */
    opacity: 1;
    /* 结束时，元素完全不透明 */
  }
}

@keyframes popOut {
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(0.7);
    opacity: 0;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
