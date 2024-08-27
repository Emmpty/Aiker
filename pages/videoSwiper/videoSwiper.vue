<template>
  <view
    class="page-box"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="详情"
    />

    <swiper
      class="swiper"
      :style="{ height: `calc(100vh - ${statusBarHeight + 44}px)` }"
      :vertical="true"
      :current="videoIndex"
      @change="onSwiperChange"
    >
      <swiper-item
        v-for="(item, index) in videoDataList"
        :key="index"
      >
        <view class="swiper-item u-flex u-col-center">
          <!-- enable-play-gesture -->
          <video
            v-if="videoIndex === index"
            class="video"
            autoplay
            object-fit="contain"
            :ref="'video' + item.id"
            :id="'video' + item.id"
            :muted="isMuted"
            :src="item.src"
            :controls="true"
            :loop="true"
            :show-fullscreen-btn="false"
            :show-center-play-btn="false"
            :show-progress="true"
            @pause="onPause"
            @play="onPlay"
          >
          </video>
          <image
            v-else
            class="video"
            mode="widthFix"
            :src="item.cover"
          ></image>
        </view>

        <!-- <view
          class="video-hover u-flex"
          @click="tapVideoHover()"
        >
          <image
            v-if="currentVideoData.state == 'pause'"
            class="play-state"
            src="/static/img/video/play.png"
          ></image>
        </view> -->

        <view
          v-if="showMineView && item.title"
          class="list-left"
        >
          <view class="item-title u-flex u-col-center">
            {{ item.title || '创意文案' }}
            <view
              class="copy-icon u-m-l-24"
              @click="copyText(item.content)"
            >
              <i class="iconfont icon-fuzhi"></i>
            </view>
          </view>
          <view class="u-flex-col u-row-left">
            <view
              class="item-content "
              :class="{ 'u-line-4': !item.showMore }"
            >
              {{ item.content }}
            </view>
            <view
              v-if="item.content.length > 80"
              class="launch-box"
              @click="switchStatus()"
            >{{ !item.showMore ? '...展开' : '折叠' }}</view>
          </view>
        </view>

        <view
          class="list-right"
          :class="{ 'show-mine-view': showMineView }"
        >
          <view class="header-box">
            <image
              class="user-avatar"
              :src="item.avatar"
            />
          </view>

          <!-- 点赞 -->
          <view v-if="!showMineView">
            <image
              class="right-icon"
              mode="widthFix"
              :src="currentVideoData.isLike ? '/static/img/video/like.png' : '/static/img/video/like_normal.png'"
              @click="tapLike(item)"
            />
            <view class="right-text">{{ item.likeCount == 0 ? '喜欢' : item.likeCount }}</view>
          </view>

          <!-- 分享 -->
          <view>
            <button
              class="share-btn-box"
              open-type="share"
            >
              <image
                class="right-icon"
                mode="widthFix"
                src="/static/img/video/share.png"
              />
            </button>
            <view class="right-text">分享</view>
          </view>

          <template v-if="showMineView">
            <!-- 下载 -->
            <view @click="saveVideo(item.src, item.title)">
              <image
                class="right-icon"
                mode="widthFix"
                src="/static/img/video/down.png"
              />
              <view class="right-text">下载</view>

            </view>

            <!-- 投稿 -->
            <view class="u-flex-col u-col-center">
              <image
                class="right-icon"
                mode="widthFix"
                :src="(item.flag == 0 || item.flag == 1) ? '/static/img/video/release.png' : (item.flag == 2 ? '/static/img/video/remove.png' : '/static/img/video/fail.png')"
                @click="releaseVideo(item)"
              />
              <view class="right-text">{{ getFlagTexy(item.flag) }}</view>
            </view>

            <!-- 高清 -->
            <view
              v-if="showHdView"
              @click="showVideoHD('HD')"
            >
              <image
                class="right-icon"
                mode="widthFix"
                src="/static/img/video/video-hd.png"
              />
              <view class="right-text">{{ '高清' }}</view>
            </view>

            <!-- 详情 -->
            <view @click="showVideoHD('param')">
              <image
                class="right-icon"
                mode="widthFix"
                src="/static/img/video/details.png"
              />
              <view class="right-text">{{ '详情' }}</view>
            </view>
          </template>

        </view>
      </swiper-item>
    </swiper>

    <!-- 投稿作品询问 -->
    <e-model
      :showModel="showModel"
      title="温馨提示"
      :tips="modelText"
      @cancelHandle="showModel = false"
      @confirmHandle="confirmHandle()"
    ></e-model>

    <e-model
      v-if="showTips"
      :showModel="showTips"
      title="温馨提示"
      confirmText="开通"
      @cancelHandle="showTips = false"
      @confirmHandle="goRecharge()"
    >
      <template slot="content">
        <view class="tips-box u-flex-col u-col-center">
          <view class="vip-text">普通用户仅保留7天内的作品</view>
          <view class="vip-text">开通VIP用户后保留30天已内的作品</view>
          <view class="vip-text">开通SVIP用户客保留60天已内的作品</view>
        </view>
      </template>
    </e-model>

    <!-- 高清 -->
    <u-popup
      v-if="HDShow"
      :show="HDShow"
      mode="center"
      closeOnClickOverlay
      border-radius="40"
      bgColor="transparent"
      @close="HDShow = false"
    >

      <view class="hd-box">
        <view class="header u-flex u-col-center u-row-center">
          <view class="hd-title">{{ showType == 'param' ? '详情参数' : '高清' }}</view>
          <view
            class="close-image"
            @click="HDShow = false"
          >
            <i class="iconfont icon-guanbi"></i>
          </view>
        </view>
        <view
          v-if="showType == 'param' && currentVideoDataParam"
          class="param-box u-flex-col"
        >
          <view class="param-item u-flex u-col-center">
            <view class="param-item-title">类型：</view>
            <view class="param-item-value">{{ getTag(currentVideoData.type) }}</view>
          </view>
          <!-- <view class="param-item u-flex u-col-center">
            <view class="param-item-title">参考图：</view>
            <view class="param-item-value">{{ '查看参考图' }}</view>
          </view> -->
          <view class="param-item u-flex u-col-center">
            <view class="param-item-title">画质：</view>
            <view class="param-item-value">{{ getCurrentQuality }}</view>
          </view>
          <view
            v-if="currentVideoDataParam.aspect"
            class="param-item u-flex u-col-center"
          >
            <view class="param-item-title">尺寸：</view>
            <view class="param-item-value">{{ currentVideoDataParam.aspect }}</view>
          </view>
          <view
            v-if="currentVideoDataParam.duration"
            class="param-item u-flex u-col-center"
          >
            <view class="param-item-title">视频时长：</view>
            <view class="param-item-value">{{ currentVideoDataParam.duration }} 秒</view>
          </view>
          <view
            v-if="currentVideoDataParam.rate"
            class="param-item u-flex u-col-center"
          >
            <view class="param-item-title">运动幅度：</view>
            <view class="param-item-value">{{ currentVideoDataParam.rate }} </view>
          </view>
          <view
            v-if="currentVideoDataParam.words"
            class="param-item u-flex u-col-center"
          >
            <view class="param-item-title">是否添加创意文案：</view>
            <view class="param-item-value">{{ currentVideoDataParam.words == true ? '是' : '否' }} </view>
          </view>
          <view
            v-if="currentVideoDataParam.audio"
            class="param-item u-flex u-col-center"
          >
            <view class="param-item-title">是否添加配音：</view>
            <view class="param-item-value">{{ currentVideoDataParam.audio == true ? '是' : '否' }} </view>
          </view>
          <view
            v-if="currentVideoData.logTime"
            class="param-item u-flex u-col-center"
          >
            <view class="param-item-title">制作时间：</view>
            <view class="param-item-value">{{ formatTime(currentVideoData.logTime) }} </view>
          </view>
          <view class="param-item u-flex u-col-center">
            <view class="param-item-title">任务ID：</view>
            <view class="param-item-value">{{ currentVideoData.id }} </view>
            <i
              class="iconfont icon-fuzhi u-m-l-8"
              @click="copyText(currentVideoData.id)"
            ></i>
          </view>
        </view>
        <view
          v-else
          class="btn-box"
        >
          <button
            class="hd-btn"
            @click="videoHD()"
          >一键高清（2点数）</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>

import {
  getGalleryList, getGalleryDetail, getDrawList,
  removeLike, addLike, taskPublishOrReset,
  aiHDVideo,
} from "@/static/api/draw.js";
import { mapState } from "vuex";
import utils from "@/static/utils/utils";

export default {
  components: {},
  data() {
    return {
      // 导航栏高度
      statusBarHeight: 0,
      videoParam: {},    // 页面传递数据
      videoDataList: [],
      videoIndex: 0,
      videoContextList: [],
      firstEnter: true,
      isMuted: false,
      isShare: false,
      queryParam: {},
      totalCount: 0,
      videoState: 'pause',
      showModel: false,
      modelText: '确定将该作品投稿影展吗？',
      userInfo: {},
      noMoreData: false,
      HDShow: false,
      showType: 'HD'
    }
  },
  computed: {
    ...mapState("draw", [
      "mineDrawList",
      "galleryDrawList",
    ]),
    // currentVideoContext() {
    //   return this.videoContextList[this.videoIndex]
    // },
    currentVideoData: {
      get: function () {
        let currentData = this.videoDataList[this.videoIndex] || {}
        this.videoParam = { ...this.videoParam, id: currentData.id, authorId: currentData.userId }
        return currentData
      },
      set: function (newValue) {
        console.log('`````````setcurrentVideoData', newValue);
        // this.$set(this.videoDataList, this.videoIndex, newValue)
        // this.videoDataList[this.videoIndex] = { ...this.videoDataList[this.videoIndex], ...newValue }
        // this.videoParam = {...this.videoParam, id: }
      }
    },
    currentVideoDataParam() {
      let currentData = this.videoDataList[this.videoIndex] || {}
      if (currentData.param) {
        let param = JSON.parse(currentData.param)
        return param
      }
      return {}
    },
    showHdView() {
      if (this.showMineView && this.userInfo.level > 0) {
        if (this.currentVideoData.type == 4) {
          return false
        } else if (this.currentVideoData.type == 1) {
          return false
        } else if (this.currentVideoData.type == 5 && this.currentVideoDataParam.superreal) {
          return false
        }
        return true
      } else {
        return false
      }
    },
    showMineView() {
      return this.videoParam.isMine && !this.isShare
    },
    getCurrentQuality() {
      if (this.currentVideoData.type == 5 && this.currentVideoDataParam.superreal || this.currentVideoData.type == 4) {
        return '高清'
      }
      return '普通'
    },
  },
  watch: {
    videoIndex(newVal, oldVal) {
      console.log('-----------', newVal, oldVal, this.videoDataList.length - 2, this.videoParam.queryParam.size);
      if (newVal - oldVal > 0 && (oldVal == this.videoDataList.length - 2 || newVal == this.videoDataList.length - 1) && this.videoDataList.length >= this.videoParam.queryParam.size) {
        this.getShortVideoList()
      }
    },
  },
  async onLoad(option) {
    if (option.videoData) {
      this.videoParam = JSON.parse(option.videoData)
      console.error('----this.videoParam', this.videoParam);
      this.videoParam.queryParam.exclude = [this.videoParam.id]
      if (option.isShare) {
        // 分享进来的，需要当前分享的放在第一位
        console.log('!!!!!!!!!!!!!option.isShare', option.isShare);
        this.isShare = option.isShare
        this.getCurrentDrawData()
        this.getShortVideoList()
      } else {
        // 其他页面进来的 把当前分页数据带进来
        let videoContex = []
        if (this.videoParam.fromMine) {
          this.videoDataList = this.mineDrawList.filter((item) => item.status == 0 && item.type != 3 && item.src)
        } else {
          this.videoDataList = this.galleryDrawList
        }
        this.videoIndex = this.videoDataList.findIndex((item) => item.id === this.videoParam.id)
        this.videoParam.queryParam.exclude = this.videoDataList.map((item) => item.id)
        this.updateVideo()
      }
    }

    this.userInfo = uni.getStorageSync('userInfo')
    // if (option.currentId)
  },
  onReady() {
    //获取手机状态栏高度
    this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight']

  },
  onShow() {
    this.isMuted = false
    if (this.firstEnter) this.firstEnter = false
    // if (this.videoContextList && this.videoContextList.length > 0) {
    //   this.currentVideoContext.play()
    // }
  },
  methods: {
    getTag(type) {
      let text
      switch (type) {
        case 0:
          text = '图生视频'
          break;
        case 1:
          text = '光影舞蹈'
          break;
        case 2:
          text = '山水动图'
          break;
        case 3:
          text = '图生文案'
          break;
        case 4:
          text = '一键高清'
          break;
        case 5:
          text = '图片说话'
          break;
        case 6:
          text = '视频动漫'
          break;
      }
      return text
    },
    async getCurrentDrawData() {
      try {
        const detailRes = await getGalleryDetail({ userId: this.videoParam.authorId, id: this.videoParam.id })
        if (detailRes.code == 200 && detailRes.result) {
          let drawData = detailRes.result
          this.videoDataList = [drawData]
          this.videoParam.queryParam.exclude = [drawData.id]
          // let currentContext = uni.createVideoContext('video' + drawData.id, this)
          // this.videoContextList = [currentContext]

          this.updateVideo()

        }
      } catch (error) {
        console.error(error);
      }
    },
    // 获取短视频列表
    async getShortVideoList() {
      if (this.noMoreData) {
        // 没有更多数据了
        return uni.showToast({
          title: '已经到底了哦~',
          icon: 'none'
        });
      }
      try {
        uni.showLoading({ title: '加载中...', mask: true, })
        let res
        // 分享进来的，除了第一个视频，其他视频都是推荐视频
        if (this.isShare) {
          // 列表为推荐列表
          this.videoParam.queryParam.type = 'best'
          res = await getGalleryList(this.videoParam.queryParam)
        } else {
          if (this.videoParam.fromMine) {
            // 个人中心进来
            debugger
            res = await getDrawList(this.videoParam.queryParam)
          } else {
            // 首页进来
            res = await getGalleryList(this.videoParam.queryParam)
          }
        }


        if (res.code == 200) {
          // 判断是否还有下一页
          if (!res.result.nextId) {
            this.noMoreData = true
          } else {
            this.queryParam.nextId = res.result.nextId
          }

          let list = res.result.list
          if (list && list.length > 0) {
            // 已加载的视频不再加载
            this.videoParam.queryParam.exclude = this.videoParam.queryParam.exclude.concat(list.map((item) => item.id))
            let videoContex = []
            // 去重, 不然创建videoContext会报错
            let uniqueArray = this.videoDataList.concat(list).reduce((accumulator, current) => {
              if (!accumulator.find(item => item.id === current.id)) {
                accumulator.push(current);
              }
              return accumulator;
            }, [])

            this.videoDataList = uniqueArray
            // list.map((item) => {
            //   videoContex.push(uni.createVideoContext('video' + item.id, this))
            // })
            // this.videoContextList = this.videoContextList.concat(videoContex)
            console.log('videoContextList', this.videoContextList)
            this.updateVideo()

            console.log('>>>>>>>>>>>>>>>>this.videoDataList', this.videoDataList);
          }
        }
        uni.hideLoading()
      } catch (error) {
        uni.hideLoading()
        console.error('---catch', error);
      }
    },
    formatTime(time) {
      let timeStr = utils.formatTime(time)
      return timeStr
    },
    // 复制文案
    copyText(text) {
      utils.copyText(text)
    },
    // 展开折叠
    switchStatus() {
      this.$set(this.currentVideoData, 'showMore', !this.currentVideoData.showMore)
      console.log('55555555', this.currentVideoData.showMore);
    },
    // 点赞功能
    async tapLike(item) {
      if (!uni.getStorageSync('token') && !getApp().globalData.getLogin()) {
        return;
      }
      const data = {
        id: item.id,
        userId: item.userId
      }
      try {
        let likeCount = this.currentVideoData.likeCount
        if (!item.isLike) {
          const likeRes = await addLike(data)
          if (likeRes.code == 200) {
            this.$set(this.currentVideoData, 'likeCount', likeCount + 1)
            this.$set(this.currentVideoData, 'isLike', !this.currentVideoData.isLike)
          }
        } else {
          const removeLikeRes = await removeLike(data)
          if (removeLikeRes.code == 200) {

            this.$set(this.currentVideoData, 'likeCount', likeCount - 1 < 0 ? 0 : likeCount - 1)
            this.$set(this.currentVideoData, 'isLike', !this.currentVideoData.isLike)
          }
        }

      } catch (error) {
        console.error(error);
      }

    },
    onSwiperChange(e) {
      let currentIndex = e.detail.current
      if (currentIndex === this.videoIndex) {
        return
      }

      this.swiperChangeEevnt(currentIndex)

    },
    swiperChangeEevnt(currentIndex) {
      if (this.videoIndex >= 0) {
        // this.currentVideoContext.pause()
        // this.currentVideoContext.seek(0)
      }
      this.videoIndex = currentIndex
      this.updateVideo()
    },
    updateVideo() {
      if (this.firstEnter) {
        // this.videoContextList.map((item) => {
        //   item.pause()
        // })
      }
      setTimeout(() => {
        // this.currentVideoContext.play()
      }, 300)
    },
    navigateTo(tempUrl) {
      uni.navigateTo({
        url: tempUrl
      })
    },
    onPause() {
      this.$set(this.currentVideoData, 'state', 'pause')
    },
    onPlay() {
      this.$set(this.currentVideoData, 'state', 'play')
    },
    // 点击播放&&暂停
    tapVideoHover() {
      if (this.currentVideoData.state == 'pause') {
        // this.currentVideoContext.play()
      } else {
        // this.currentVideoContext.pause()
      }
      setTimeout(() => {
        console.log('播放状态：', this.currentVideoData.state);
      }, 500);
    },
    saveVideo(videoUrl, title) {
      uni.$u.debounce(async () => {
        // 使用 uni.downloadFile API 下载视频
        console.log('保存视频链接', videoUrl);

        // #ifdef WEB
        this.saveVideoFileH5(videoUrl, title)
        // #endif

        // #ifndef WEB
        uni.showLoading({ title: '保存中...', mask: true })
        uni.getSetting({
          success: (res) => {
            console.log('授权数据', res);
            if (!res.authSetting['scope.writePhotosAlbum']) {
              uni.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                  console.log('授权成功');
                  this.saveVideoFile(videoUrl)
                },
                fail: (err) => {
                  uni.hideLoading()
                  uni.showToast({
                    title: '相册未授权，请打开相册授权',
                    icon: 'none'
                  });
                  console.error('获取相册权限失败', err);
                }
              });
            } else {
              this.saveVideoFile(videoUrl)
            }
          },
          fail: (err) => {
            uni.hideLoading()
            uni.showToast({
              title: '获取相册授权信息失败',
              icon: 'none'
            });
            console.error('获取授权信息失败', err);
          }
        });
        // #endif
      }, 500)
    },
    saveVideoFile(filePath) {
      try {
        let fileSavePath = wx.env.USER_DATA_PATH + '/' + new Date().valueOf() + '.mp4'
        uni.downloadFile({
          url: filePath,
          // filepath: fileSavePath,
          success: (downloadResult) => {
            console.log('>>>>>>>>>>>>>videoUrl', downloadResult);
            if (downloadResult.errMsg === 'downloadFile:ok') {
              // uni.compressVideo({ // 压缩下载返回的地址
              //   src: downloadResult.tempFilePath, // 下载成功的临时路径
              //   quality: 'high',
              //   success: (res1) => {
              // 下载成功后，保存视频到相册
              uni.saveVideoToPhotosAlbum({
                filePath: downloadResult.tempFilePath,
                success: () => {
                  uni.hideLoading()
                  uni.showToast({
                    title: '视频保存成功',
                    icon: 'success'
                  });
                },
                fail: (err) => {
                  uni.hideLoading()
                  console.log('保存视频失败：', err);
                  if (err.errMsg.indexOf('cancel') > -1) {
                    return uni.showToast({
                      title: '已取消',
                      icon: 'none'
                    });
                  }
                  uni.showToast({
                    title: '保存失败，请稍候重试',
                    icon: 'none'
                  });
                }
              });
              //   },
              //   fail: (err) => {

              //   },
              // })

            }
          },
          fail: (err) => {
            uni.hideLoading()
            console.log('下载视频失败：', err);
            uni.showToast({
              title: '保存失败，请稍候重试',
              icon: 'none'
            });
          }
        });
      } catch (error) {
        uni.hideLoading()
        console.log('下载视频失败：catch', error);
        uni.showToast({
          title: '保存失败，请稍候重试',
          icon: 'none'
        });
      }
    },
    saveVideoFileH5(filePath, title) {
      try {
        uni.showLoading({ title: '保存中...', mask: true })
        uni.downloadFile({
          url: filePath,
          success: (downloadResult) => {
            console.log('>>>>>>>>>>>>>videoUrl', downloadResult);
            if (downloadResult.errMsg === 'downloadFile:ok') {
              // 下载成功后，保存视频到相册
              var oA = document.createElement("a");
              oA.download = title || ''; // 设置下载的文件名，默认是'下载'
              oA.href = downloadResult.tempFilePath; //临时路径再保存到本地
              document.body.appendChild(oA);
              oA.click();
              // 下载之后把创建的元素删除
              document.body.removeChild(oA);
              uni.hideLoading()
              uni.showToast({
                title: '视频保存成功',
                icon: 'success'
              });
            }
          },
          fail: (err) => {
            uni.hideLoading()
            console.log('下载视频失败：fail', err);
            uni.showToast({
              title: '保存失败，请稍候重试',
              icon: 'none'
            });
          }
        });

      } catch (error) {
        uni.hideLoading()
        console.log('下载视频失败：catch', error);
        uni.showToast({
          title: '保存失败，请稍候重试',
          icon: 'none'
        });
      }
    },
    getFlagTexy(flag) {
      switch (flag) {
        case 0:
          return '投稿'
        case 1:
          return '审核中'
        case 2:
          return '移出'
        case -1:
          return '审核失败'
      }
    },
    releaseVideo(item) {
      if (item.flag == -1) {
        return uni.showToast({ title: '该作品不符合投稿要求', icon: 'none' });
      } else if (item.flag == 1) {
        return uni.showToast({ title: '该作品正在审核中', icon: 'none' });
      }

      if (item.flag == 2) {
        this.modelText = '确定将该作品移出影展吗？'
      } else if (item.flag == 0) {
        this.modelText = '确定将该作品投稿影展吗？'
      }
      this.showModel = true
    },
    async confirmHandle() {
      this.showModel = false
      let status = this.modelText == '确定将该作品移出影展吗？' ? 0 : 1
      try {
        const res = await taskPublishOrReset({ id: this.currentVideoData.id, status: status })
        if (res.code == 200) {
          this.$set(this.currentVideoData, 'flag', status)
          uni.showToast({
            title: '操作成功',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('error', error);
      }
    },
    showVideoHD(type) {
      this.showType = type
      this.HDShow = true
    },
    async videoHD() {
      uni.$u.debounce(async () => {
        try {
          const res = await aiHDVideo({ taskId: this.currentVideoData.id })
          if (res.code == 200) {
            this.HDShow = false
            uni.showToast({
              title: '视频一键高清成功',
              icon: 'none'
            });
            uni.$emit('newDraw', { status: true })
            uni.navigateBack({
              delta: 1
            })
          }
        } catch (error) {
          console.error('error', error);
        }
      }, 300)
    }
  },
  onHide() {
    this.isMuted = true
    // this.currentVideoContext.pause()
  },
  onUnload() {
    let pages = getCurrentPages();
    let prevPage = pages.length > 1 ? pages[pages.length - 2] : null;
    if (prevPage) {
      let prevPagePath = prevPage.route || prevPage.__route__; // 或者 prevPage.__route__ (取决于平台和版本)
      if (prevPagePath == 'pages/tabBar/mine') {
        console.log("上一个页面的路径是:", prevPagePath);
        uni.setStorageSync('noRefresh', true)
      }
    }
  },
  //  用户点击右上角分享
  onShareAppMessage() {
    const data = this.videoParam
    console.error('----this.videoParam', this.videoParam);
    return {
      path: '/pages/videoSwiper/videoSwiper?videoData=' + JSON.stringify(data) + "&isShare=" + true,
      title: getApp().globalData.shareTitle,
      imageUrl: this.currentVideoData.cover,
    };
  },
}
</script>

<style>
page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  background-color: #000;
}
</style>
<style lang="scss" scoped>
.page-box {
  flex: 1;
  width: 750rpx;
  background-color: #000;
}

.swiper {
  flex: 1;
  height: 100vh;
  width: 750rpx;
  background-color: #000;
}

.swiper-item {
  flex: 1;
  height: 100%;
  z-index: 19;
}


.video {
  flex: 1;
  height: 90%;
  /* #ifndef APP-PLUS */
  width: 100%;
  /* #endif */
  z-index: 19;
}

.list-left {
  position: absolute;
  bottom: 200rpx;
  left: 20rpx;
  z-index: 999;
  width: 560rpx;

  .item-title {
    font-size: 36rpx;
    color: #fff;
    line-height: 50rpx;
    /* #ifndef APP-PLUS-NVUE */
    word-wrap: break-word;
    /* #endif */
    margin-bottom: 16rpx;
  }

  .item-content {
    font-size: 28rpx;
    font-weight: 500;
    line-height: 40rpx;
    color: #FFFFFF;
    flex-grow: 1;
  }

  .launch-box {
    position: absolute;
    right: 0;
    bottom: -4rpx;
    padding: 4rpx 8rpx;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 40rpx;
    color: #FFFFFF;
    align-self: flex-end;
  }
}

.list-right {
  /* #ifndef APP-PLUS */
  display: flex;
  /* #endif */
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 40%;
  right: 32rpx;
  z-index: 999;
  color: #fff;

  &.show-mine-view {
    bottom: 25%;
  }

  .header-box {
    .user-avatar {
      width: 108rpx;
      height: 108rpx;
      border-radius: 100%;
    }
  }

  .right-icon {
    width: 64rpx;
    height: 64rpx;
    margin-top: 50rpx;
  }

  .iconfont {
    font-size: 64rpx;
    margin-top: 50rpx;
  }

  // .icon-aixin {
  //   &.active {
  //     color: #EB3E3E;
  //   }
  // }

  .right-text {
    font-size: 24rpx;
    margin-top: 10rpx;
    text-align: center;
    text-shadow: 0 0 6rpx rgba(0, 0, 0, 0.7);
  }

  .share-btn-box {
    color: #fff;
    background: transparent;
    height: 110rpx;
    position: relative;
  }
}


// .around {
//   width: 100rpx;
//   height: 100rpx;
//   margin-top: 30rpx;
//   /* #ifndef APP-PLUS-NVUE */
//   animation: rotate 1.5s linear 0.2s infinite;
//   /* #endif */
// }

// @keyframes rotate {
//   0% {
//     transform: rotate(0deg)
//   }

//   100% {
//     transform: rotate(360deg)
//   }
// }

// @keyframes music {
//   0% {
//     transform: translate3d(80%, 0, 0)
//   }

//   100% {
//     transform: translate3d(-80%, 0, 0)
//   }
// }
.video-hover {
  position: absolute;
  top: 0;
  left: 0;
  flex: 1;
  background-color: rgba(0, 0, 0, 0.1);
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;
  z-index: 99;
}

.play-state {
  width: 80rpx;
  height: 80rpx;
}

.flexbox {
  position: fixed;
}

.hd-box {
  width: 614rpx;
  padding: 40rpx;
  background: #191919;
  border-radius: 32rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);

  .header {
    position: relative;
    font-size: 36rpx;
    font-weight: bold;
    color: #FFFFFF;
    margin-bottom: 48rpx;

    .close-image {
      position: absolute;
      right: 0;
      top: 8rpx;
      width: 32rpx;
      height: 32rpx;
    }
  }

  .btn-box {
    width: 100%;


    .hd-btn {
      flex: 1;
      height: 92rpx;
      line-height: 92rpx;
      background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
      border-radius: 12rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #121212;
    }
  }

  .param-box {
    font-size: 28rpx;

    .param-item {
      .param-item-title {

        font-weight: 400;
        color: #959595;
      }

      .param-item-value {
        color: #fff;
      }
    }

    .param-item+.param-item {
      margin-top: 48rpx;
    }
  }
}
</style>
