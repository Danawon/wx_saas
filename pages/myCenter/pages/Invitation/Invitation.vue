<template>
	<view>
		<head-nav
			title="邀请有礼"
			bgColor="rgba(0,0,0,0)"
			:goBack="true"
		></head-nav>
		<view class="head-box" :style="{
					background: 'url(' + baseUrl + 'clock21.png)',
					'background-size': '100% 100%'
				}">
			<view class="head-tips flex">
				点击右上角分享给好友或请朋友扫一扫
			</view>
			
			<view class="head-content  pad40 flex-row flex-a ju-bt">
				<view class="block-l block flex-col">
					<view class="l-img1 flex">
						<!-- <image :src="shareInfo.avatar" mode=""></image> -->
						<view class="avatar-box">
							<u-avatar :src="shareInfo.avatar" size="90rpx"></u-avatar>
						</view>
					</view>
					<view class="l-img2">
						<image :src="baseUrl + 'letter.png'" mode=""></image>
					</view>
				</view>
				<view class="block-r block">
					<image :src="shareInfo.qrcode" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="content-box pad20">
			<view class="content-Invitation flex">
				已有<text class="invitation-font">{{ shareInfo.count }}</text>位朋友在您的邀请下加入翰思运动健康
			</view>
			<view class="invitation-rule mar-t40">
				邀请规则:当您的朋友成功购买产品后，凭邀请记录(已购) 向所购买产品归属门店申请礼品 (礼品由各门店自行设定)。所有新会员注册即可领取
				<text class="invitation-font">60元</text> 代金券。
			</view>
		</view>
		
		<view class="record pad20">
			<view class="tit">
				我的邀请记录
			</view>
			<view class="record-lst mar-t40">
				<view class="li " v-for="(item, index) in shareInfo.list" :key="index">
					<view class="flex-row flex-a">
						<view class="li-avatar">
							<u-avatar :src="item.avatar" size="95rpx"></u-avatar>
						</view>
						<view class="li-info mar-l20">
							<view class="info-name">
								{{ item.nickname }}
							</view>
							<view class="info-state ">
								{{ item.is_buy == 1 ? '已购买课程' : '未购买课程' }}
								
							</view>
						</view>
					</view>
					<u-line margin="20rpx 0 "></u-line>
				</view>
			</view>
		</view>
		<u-empty
			v-if="!shareInfo.list.length"
			mode="list"
			text="暂无邀请记录..."
		></u-empty>
	</view>
</template>

<script>
	import { baseUrl } from '@/utils/baseUrl.js';
	import { getShareInfo } from "@/api/myCenter.js"
	export default {
		data() {
			return {
				baseUrl: baseUrl,
				shareInfo: {}, // 分享信息
				
			};
		},
		onShareAppMessage() {
			uni.removeStorageSync("token")
			return {
				title: "邀请有礼",
				path: `/pages/store/index/index?uid=${this.shareInfo.uid}`
			};
		},
		onLoad() {
			this.getShareInfoFun();
		},
		methods: {
			getShareInfoFun() {
				getShareInfo().then(res => {
					this.shareInfo = res.data;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.record {
		
		.record-lst {
			.li {
				.li-info {
					.info-name {
						color: #b28861; 
						font-size: 28rpx;
					}
					.info-state {
						margin-top: 10rpx;
						color: #999999;
						font-size: 24rpx;
					}
				}
			}
		}
		.tit {
			font-size: 32rpx;
			// font-weight: bold;
		}
	}
	.content-box {
		.invitation-rule {
			line-height: 40rpx;
		}
		.content-Invitation {
			
			color: #bd966f;
		}
		.invitation-font {
			color: #dd001b ;
			margin: 0 10rpx;
		}
		font-size: 28rpx;
		margin-top: 470rpx;
	}
	.head-content {
		.block-l {
			.l-img1 {
				// image {
				// 	width: 90rpx;
				// 	height: 90rpx;
				// 	margin-top: 60rpx;
				// 	border-radius: 50%;
				// }
				.avatar-box {
					margin-top: 60rpx;
					border: 4rpx solid #7b7b7b;
					border-radius: 50%;
				}
				height: 20%;
				z-index: 999;
			}
			.l-img2 {
				height: 86%;
				width: 85%;
				margin: 0 auto;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		.block-r {
			image {
				width: 100%;
				height: 100%;
			}
		}
		.block {
			height: 300rpx;
			width: 48%;
		}
		width: 100%;
	}
	/deep/ .u-navbar__content {
		z-index: 999;
	}
.head-box {
	.head-tips {
		margin-top: 170rpx;
		color: #fff;
		font-size: 28rpx;
	}
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 600rpx;
}
</style>
