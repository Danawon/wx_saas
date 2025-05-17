<template>
	<view>
		<head-nav
			title="心率设备"
			bgColor="rgba(0,0,0,0)"
			:goBack="true"
			iconC="#fff"
			titColor="#fff"
		></head-nav>
		<view class="head-box pad20 ">
			<view class="electric-quantity flex-row flex-a">
				<u--image :showLoading="true" :src="baseUrl+'heart2.png'" width="24rpx" height="45rpx" ></u--image>
				<view class="electric-num">
					100%
				</view>
			</view>
			<view class="heart-num flex">
				<view class="num-val">
					142
				</view>
				<view class="headr-icon">
					<image :src="baseUrl + 'heart1.png'" mode=""></image>
					<view class="bpm">
						BPM
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseUrl } from '@/utils/baseUrl.js';
	export default {
		data() {
			return {
				baseUrl: baseUrl,
			};
		}
	}
</script>

<style lang="scss" scoped>
.head-box {
	.heart-num {
		.headr-icon {
			.bpm {
				font-weight: 600;
				color: #000000;
				font-size: 28rpx;
			}
			image {
				width: 60rpx;
				height: 60rpx;
			}
			margin-left: 10rpx;
		}
		.num-val {
			font-weight: bold;
			color: #FE5E10;
			font-size: 120rpx;
		}
		margin: 40rpx auto;
	}
	.electric-quantity {
		.electric-num {
			font-weight: 400;
			color: rgba(0,0,0,0.9);
			font-size: 28rpx;
			margin-left: 10rpx;
		}
		margin-top: 170rpx;
		justify-content: flex-end;
	}
	height: 600rpx;
	width: 100%;
	background: linear-gradient(
		180deg,
		#fe5e10 0%,
		#ffffff 100%
	);
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}
/deep/ .u-navbar__content {
	z-index: 99;
}
</style>
