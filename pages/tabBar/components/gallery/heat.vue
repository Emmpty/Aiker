<template>
    <view>
		<view class="same">
			<view class="same-avact" :style="{'color':cueTheme=='day-theme'?'#000':'#fff'}">
				<image class="avact" :src="params.url"/>{{params.uname}}
			</view>
			<view class="same-right" v-if="cueTheme=='day-theme'" :style="{'color':cueTheme=='day-theme'?'#000':'#fff'}">
				<image @click="recommendLike()" :src="!isLike?'../../../../static/img/gallery/xin_hui.png':'../../../../static/img/gallery/xin_active.png'"/>
				<text>{{isLike? params.likeCount+1:params.likeCount}}</text>
			</view>
			<view class="same-right" v-else :style="{'color':cueTheme=='day-theme'?'#000':'#fff'}">
				<image @click="recommendLike()" :src="!isLike?'../../../../static/img/gallery/xin.png':'../../../../static/img/gallery/xin_active.png'"/>
				<text>{{isLike? params.likeCount+1:params.likeCount}}</text>
			</view>
		</view>

	</view>

</template>

<script>
import { removeLike,addLike,} from "../../../../static/api/index.js";
export default {
	name:"",
	options:{},
	props:{
		params:{
			type: Object,
			default(){
				return {}
			}
		},
	},
	data() {
		return {
			isLike:false,
		};
	},
	methods:{
		
		// 
		recommendLike(){
			let that =this;
			that.isLike =!that.isLike
			if(that.isLike){
				addLike({id:that.params.id}).then(res => {
					if (res.code == 200) {

					}
				})
			}else{
				removeLike({id:that.params.id}).then(res => {
					if (res.code == 200) {

					}
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.same{
	display: flex;
  justify-content: space-between;
  line-height:60rpx;
  padding-left: 24rpx;
  padding-bottom: 18rpx;
}
.same .same-avact{
	font-size:24rpx;
	width:240rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: left;
}
.same .same-avact .avact{
  width: 45rpx;
  height:45rpx;
  border-radius:50%;
  margin-right:10rpx;
  position: relative;
  top: 14rpx;
}

.same .same-right image{
  width:34rpx;
  height:34rpx;
  position: relative;
  top: 18rpx;
  right:6rpx
}
.same .same-right{
	font-size: 22rpx;
	margin-right: 10rpx;
}
.same .same-right text{
	position: relative;
	top: 10rpx;
	right:0rpx
}

.popup{
  width:580rpx;
  border-radius:20rpx;
  padding:0 30rpx 40rpx;
}
.popup .popup-title{
  line-height: 100rpx;
  text-align: center;
  font-size: 30rpx;
}
.popup .popup-tips{
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(18,18,18,0.46);
  text-align: left;
}
.popup .popup-btn{
  display: flex;
  justify-content: space-around;
  margin-top: 50rpx;
}
.popup .popup-btn .item{
  width: 48%;
  height: 80rpx;
  line-height:80rpx;
  background: rgba(18,18,18,0.04);
  border-radius: 80rpx;
  text-align: center;
  border: 2rpx solid #E4E4E4;
  font-size: 28rpx !important;
}
.popup .popup-btn .active{
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);

}

</style>
