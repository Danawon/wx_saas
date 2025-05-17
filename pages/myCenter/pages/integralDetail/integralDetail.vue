<template>
	<view class="wrap-min">
		<head-nav
			title="积分明细"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="list pad20">
			<view class="li" v-for="(liItem, liIndex) in list" :key="liIndex">
				<view class="tit-time">
					{{ liItem.time }}
				</view>
				<view class="li-list flex-row flex-a ju-bt martb20 " v-for="(listItem, listIndex) in liItem.obvious" :key="listIndex">
					<view class="li-l flex-a flex-row">
						<!-- <image :src="baseUrl+'jf3.png'" mode=""></image> -->
						<view class="li-info flex-col ju-bt mar-l20">
							<view class="info-name">
								{{ listItem.memo }}
							</view>
							<view class="info-time">
								{{ listItem.createtime }}
							</view>
						</view>
					</view>
					<view class="li-r flex-a flex-row">
						<image :src="baseUrl+'jf4.png'" mode=""></image>
						<!-- 加 -->
						<view class="plus-txt txt-num" v-if="listItem.after < listItem.before">
							{{ listItem.score }}
						</view>
						<!-- 减 -->
						<view class="minus-txt txt-num" v-else>
							{{ listItem.score }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
	</view>
</template>

<script>
	import { baseUrl } from '@/utils/baseUrl.js';
	import { integralDetail } from "@/api/integral.js"
	export default {
		data() {
			return {
				baseUrl: baseUrl,
				list: [],
			};
		},
		onLoad() {
			// 获取积分
			this.getIntegralDetail();
		},
		methods: {
			getIntegralDetail() {
				integralDetail().then(res => {
					this.list = res.data;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.list {
	.li {
		.li-list{
			.li-r {
				.txt-num {
					font-size: 34rpx;
					font-weight: 500;
				}
				.minus-txt {
					color: rgba(32,32,32,0.9);
				}
				.plus-txt{
					color: #EF0708;
				}
				image {
					width: 35rpx;
					height: 35rpx;
					margin: 0 5rpx 0 8rpx;
				}
			}
			.li-l {
				.li-info {
					.info-time {
						font-weight: 300;
						color: #999999;
						font-size: 22rpx;
					}
					.info-name {
						font-weight: 500;
						color: #202020;
						font-size: 30rpx;
					}
					height: 100rpx;
				}
				image {
					width: 230rpx;
					height: 100rpx;
				}
			}
			background-color: #fff;
			border-radius: 20rpx;
			padding: 30rpx;
		}
		.tit-time {
			font-weight: 500;
			color: #000000;
			font-size: 32rpx;
		}
	}
}
</style>
