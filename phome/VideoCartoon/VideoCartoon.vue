<template>
	<view class="page-content" :class="cueTheme">
		<nav-bar :backState="1000" :homeState="1000" title="视频动漫" />
		<!-- 例子视频展示 -->
		<view class="page-item">
			<video class="example-video-box" object-fit="contain"
				src="https://cdn.lingchuang.art/sdv/aiker/video-cartoon/example-video.mp4" :controls="true"
				:show-fullscreen-btn="false" :show-center-play-btn="true" :show-progress="true">
				<view class="video-tip">视频示例</view>
				<image class="watermark-image" src="https://cdn.lingchuang.art/sdv/aiker/ai-subtitle/watermark.png"
					mode="widthFix"></image>
			</video>
			<view class="u-m-t-32">
				<view class="landscape-tips">应用介绍：抖音热门轻松上，无需剪辑轻松创，只需上传一段视频​，就能生成跟原视频场景一样的动漫视频啦~</view>
				<view class="landscape-tips u-m-t-32">
					模型说明：该模型为视频转动漫模型，只适用于视频领域，并且视频时长需在10秒以内。建议上传带人像类的视频，请您确定上传的视频有合法使用权利或取得他人合法授权</view>
			</view>
		</view>
		<view class="page-item">
			<view class="page-title">上传视频</view>
			<view v-if="!videoUrl" class="upload-box u-flex u-col-center u-row-center" @click.stop="selectVideo()">
				<view class="upload-image-box u-flex u-flex-col u-col-center u-row-center">
					<image class="upload-image" src="https://img.drawai.cn/icon/Union%402x.png" mode="widthFix"></image>
					<view class="upload-text">请上传视频时长为10秒内的视频</view>
				</view>
			</view>
			<view v-else class="media-box u-flex u-col-center u-row-center">
				<view class="video-box">
					<video class="darw-image" :src="videoUrl" mode="heightFix"></video>
					<image class="close-image" src="/static/img/clip/colse_white.png" mode="widthFix"
						@click="clearVideo()"></image>
				</view>
			</view>
		</view>

		<view class="page-item">
			<view class="u-flex u-col-center u-row-between u-m-t-32">
				<view class="page-title u-m-b-0">高清修复</view>
				<u-switch :size="24" active-color="#00ebd3" inactiveColor="#A5A5A5"
					v-model="drawParam.superreal"></u-switch>
			</view>
		</view>

		<view>
			<button class="footer-btn" :loading="btnLoading" :disabled="btnLoading" @click="beginCreation()">
				开始生成
				<template v-if="needEstimate != 0"> {{ `（${needEstimate}点数）` }} </template>
			</button>
		</view>
		<e-model :showModel="showModel" title="温馨提示" cancelText="取消" confirmText="重新上传"
			@cancelHandle="showModel = false" @confirmHandle="selectVideo()">
			<template slot="content">
				<view class="tips-box ">
					{{ '必须上传10S以内的视频' }}
				</view>
			</template>

		</e-model>
	</view>
</template>
<script>

import { getUploadUrl } from "@/static/api/user.js";
import { aiVideoCartoon, estimate } from "@/static/api/draw.js";

export default {
	components: {},
	data() {
		return {
			videoInfo: {},
			videoUrl: '',
			drawParam: {
				superreal: false,
				videoAttachment: '',
			},
			needEstimate: 0,
			btnLoading: false,
			showModel: false,
		};
	},
	computed: {
	},
	watch: {
		"drawParam.superreal": {
			handler(newV, oldV) {
				this.getestimate()
			},
		},
	},
	onShow() {

	},
	onLoad() {
		this.getestimate()
	},
	methods: {
		clearVideo() {
			this.videoInfo = {}
			this.videoUrl = ''
		},
		selectVideo() {
			uni.chooseVideo({
				count: 1,
				sourceType: ['album'],
				compressed: false,
				maxDuration: 10,
				success: (res) => {
					const { errMsg, size, duration, width, height, tempFilePath, thumbTempFilePath } = res
					console.log('选取视频信息', res);
					if (errMsg == 'chooseVideo:ok') {
						if (duration > 10) {
							console.log('..........', duration);
							return this.showModel = true
						} else {
							this.showModel = false
						}
						this.videoInfo = res
						this.videoUrl = tempFilePath
					}
				}
			})
		},
		// 获取创作点数
		getestimate() {
			this.btnLoading = true
			uni.$u.debounce(async () => {
				try {
					const { code, result } = await estimate({ type: 6, ...this.drawParam })
					this.btnLoading = false
					if (code == 200) {
						this.needEstimate = result
					}
				} catch (error) {
					this.btnLoading = false
					console.error(error);
				}
			}, 300)
		},
		async beginCreation() {
			if (!this.videoUrl) {
				return uni.showToast({ title: "请先上传视频", icon: "none", platform: 2000 })
			}
			this.btnLoading = true
			try {
				this.drawParam.imageUrl = 'https://cdn.lingchuang.art/sdv/aiker/ai-hd-default.png'
				this.drawParam.videoAttachment = await this.uploadVideo()
				if (this.drawParam.videoAttachment) {
					const Param = JSON.parse(JSON.stringify(this.drawParam))
					const drawRes = await aiVideoCartoon(Param)
					this.btnLoading = false
					if (drawRes.code == 200) {
						this.resetData()
						uni.$emit('newDraw', { status: true })
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabBar/mine'
							});
						}, 500);
					}
				} else {
					this.btnLoading = false
					uni.showToast({ title: "视频上传失败", icon: "none", platform: 2000 })
					console.error('----视频上传失败：', this.drawParam);
				}
			} catch (error) {
				this.btnLoading = false
				console.error('catch', error);
			}
		},
		// 上传视频
		uploadVideo() {
			return new Promise(async (resolve, reject) => {
				const { result } = await getUploadUrl(1)
				let formData = result.post.formData
				let url = result.post.url
				let videoAttachment = result.id

				uni.uploadFile({
					url: url,
					filePath: this.videoUrl,
					name: 'file',
					method: 'POST',
					formData: formData,
					success: async (res) => {
						resolve(videoAttachment)
					},
					fail: (err) => {
						reject(false)
						this.btnLoading = false
						console.log('uploadFile error', err,)
					},
				}); f

			})
		},
		resetData() {
			this.drawParam = {
				superreal: false,
				videoAttachment: '',
			}
		},
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
};
</script>
<style lang="scss" scoped>
.page-content {
	color: var(--text-color);
	padding: 32rpx;
	padding-bottom: calc(180rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(180rpx + env(safe-area-inset-bottom));

	.page-item+.page-item {
		margin-top: 56rpx;
	}

	.landscape-tips {
		font-size: 24rpx;
		font-weight: 500;
		color: #C5C5C5;
	}

	.page-title {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 24rpx;
	}

	.example-video-box {
		position: relative;
		width: 100%;
		height: 686rpx;

		.video-tip {
			position: absolute;
			left: 32rpx;
			top: 32rpx;
			z-index: 99;
			width: 140rpx;
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
			background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
			// background-color: #2AFFB0;
			border-radius: 12rpx;
			font-size: 24rpx;
			font-weight: bold;
			color: #000;
		}

		.watermark-image {
			position: absolute;
			right: 32rpx;
			bottom: 32rpx;
			width: 200rpx;
			height: 76rpx;
			z-index: 99;
		}
	}

	.media-box {
		width: 100%;
		background-color: var(--bg-color-2);
		border-radius: 12rpx;
		height: 292rpx;

		.video-box {
			position: relative;
			height: 100%;
			max-width: 100%;

			.close-image {
				position: absolute;
				right: 0;
				top: 0;
				width: 48rpx;
				height: 48rpx;
				z-index: 99;
			}
		}


		.darw-image {
			height: 100%;
		}
	}

	.upload-box {
		height: 196rpx;
		background-color: var(--bg-color-2);
		border-radius: 12rpx;

		.upload-image-box {
			.upload-image {
				width: 72rpx;
				height: 56rpx;
			}

			.upload-text {
				margin-top: 20rpx;
				color: #ACACAC;
				font-size: 24rpx;
			}
		}
	}
}

.footer-btn {
	position: fixed;
	left: 30rpx;
	right: 30rpx;
	z-index: 99;
	text-align: center;
	font-size: 32rpx;
	font-weight: bold;
	height: 96rpx;
	line-height: 96rpx;
	background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
	border-radius: 48rpx;
	box-shadow: 0px 16rpx 32rpx #00dbc533;
	bottom: 30rpx;
	bottom: calc(30rpx + constant(safe-area-inset-bottom));
	bottom: calc(30rpx + env(safe-area-inset-bottom));
}

.tips-box {
  font-size: 26rpx;
  text-align: center;
  padding: 0 20rpx;
}
</style>