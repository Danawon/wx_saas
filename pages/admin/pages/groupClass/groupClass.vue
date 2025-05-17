<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="团课成员"></head-nav>
		<view class="page pad20 padtb40">
			<view class="page-top flex-a padlr40 pad-b20 pad-t20 mar-b20" v-for="(item,index) in 10" :key="index">
				<view class="img-box ">
					<u-image src="https://cdn.uviewui.com/uview/album/1.jpg" width="132rpx" height="132rpx"></u-image>
				</view>
				<view class="top-r pad-l40 flex-col ju-bt">
					<text class="name">阳明君</text>
					<text class="account">账号：10010</text>
					<text class="time">手机号：18574558666</text>
				</view>
				<view class="tip" v-if="index>3">
					已签到
				</view>
				<view class="tip no" v-if="index<=3">
					未签到
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #f5f5f5;

		.page-top {
			position: relative;
			background-color: #FFFFFF;

			.top-r {
				.name {
					color: #FE5E10;
					font-size: 32rpx;
					font-weight: 500;
				}

				.account {

					color: #202020;
					font-weight: 400;
					font-size: 28rpx;
				}

				.time {
					font-size: 28rpx;
					font-weight: 400;
					margin-top: 20rpx;
					color: rgba(0, 0, 0, 0.4);
				}
			}

			.tip {
				position: absolute;
				top: 30%;
				right: 20rpx;
				padding: 8rpx 12rpx;
				border-radius: 8rpx;
				background: #FE5E10;
				color: #FFFFFF;
				font-size: 28rpx;
			}

			.tip.no {
				background: #EF0708;
			}
		}
	}
</style>
