<template>
  <view :class="cueTheme">
    <view class="same">
      <view class="same-avact">
        <image
          class="avact"
          :src="params.avatar"
        />{{ params.nickName }}
      </view>
      <view class="same-right">
        <image
          @click="switchLike()"
          :src="!isLike ? '/static/img/gallery/xin.png' : '/static/img/gallery/xin_active.png'"
        />
        <text>{{ params.likeCount }}</text>
      </view>

    </view>


  </view>
</template>

<script>
import { removeLike, addLike, } from "@/static/api/draw.js";
export default {
  name: "",
  options: {},
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  watch: {
  },
  computed: {
    isLike: {
      get: function () {
        return this.params.isLike
      },
      set: function (newValue) {
        this.$set(this.params, 'isLike', newValue)
        console.log('---------set', this.params.isLike);
      }
    },
  },
  data() {
    return {
      popupStatus: false,
    };
  },
  methods: {
    switchLike() {
      const data = {
        id: this.params.id,
        userId: this.params.userId
      }
      if (this.isLike) {
        removeLike(data)
      } else {
        addLike(data)
      }
      this.isLike = !this.isLike
    }
  }
}
</script>

<style lang="scss" scoped>
.same {
  display: flex;
  justify-content: space-between;
  line-height: 60rpx;
  padding-left: 24rpx;
  padding-bottom: 18rpx;
  color: var(--text-color);

  .same-avact {
    font-size: 24rpx;
    width: 240rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;


    .avact {
      width: 45rpx;
      height: 45rpx;
      border-radius: 50%;
      margin-right: 10rpx;
      position: relative;
      top: 14rpx;
    }
  }

  .same-right {
    font-size: 22rpx;
    margin-right: 10rpx;

    image {
      width: 34rpx;
      height: 34rpx;
      position: relative;
      top: 18rpx;
      right: 6rpx
    }

    text {
      position: relative;
      top: 10rpx;
      right: 0rpx
    }
  }
}

.popup {
  width: 580rpx;
  border-radius: 20rpx;
  padding: 0 30rpx 40rpx;
}

.popup .popup-title {
  line-height: 100rpx;
  text-align: center;
  font-size: 30rpx;
}

.popup .popup-tips {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(18, 18, 18, 0.46);
  text-align: left;
}

.popup .popup-btn {
  display: flex;
  justify-content: space-around;
  margin-top: 50rpx;
}

.popup .popup-btn .item {
  width: 48%;
  height: 80rpx;
  line-height: 80rpx;
  background: rgba(18, 18, 18, 0.04);
  border-radius: 80rpx;
  text-align: center;
  border: 2rpx solid #E4E4E4;
  font-size: 28rpx !important;
}

.popup .popup-btn .active {
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);

}
</style>
