<template>
	<view>
		<head-nav
			title="运营专员管理"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="list-box padlr20 pad-t20">
			<view class="li " v-for="(item, index) in 12" :key="index">
				<view class="flex-row flex-a">
					<view class="li-avatar">
						<u-avatar
							:src="baseUrl + 'avatar3.png'"
							size="150rpx"
						></u-avatar>
					</view>
					<view class="li-info flex-row flex-a ju-bt">
						<view class="info-l flex-col ju-ar">
							<view class="info-name">
								上官婉儿
							</view>
							<view class="account">
								账号：248134194
							</view>
							<view class="passWord">
								密码：sss248134194
							</view>
							<view class="sdfjj-num">
								已授权功能：234个
							</view>
						</view>

						<view class="info-btn">
							<view class="btn">删除</view>
						</view>
					</view>
				</view>
					<u-line margin="40rpx 0"></u-line>
			</view>
		</view>
		<view class="fot-btn pad20">
			<view class="btn flex" @click="goRouter">
				新增人员
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
export default {
	data() {
		return {
			baseUrl: baseUrl
		};
	},
	methods: {
		goRouter() {
			uni.navigateTo({
				url: "/pages/admin/pages/addOperation/addOperation"
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	.list-box {
		padding-bottom: 100rpx;
	}
	.fot-btn {
		.btn {
			height: 80rpx;
			border-radius: 40rpx;
			color: #fff;
			background: #FE5E10;
			font-weight: 400;
			font-size: 32rpx;
		}
		position: fixed;
		bottom: 20rpx;
		width: 100%;
		left: 0;
		background-color: #fff;
	}
.li {
	.li-info {
		.info-btn {
			.btn {
				font-weight: 400;
				color: #fe5e10;
				font-size: 28rpx;
				border-radius: 15rpx;
				padding: 10rpx 30rpx;
				border: 1px solid #fe5e10;
			}
		}
		.info-l {
			.info-name {
				font-weight: 400;
				color: #202020;
				font-size: 32rpx;
			}
			font-weight: 300;
			color: rgba(0, 0, 0, 0.6);
			font-size: 24rpx;
			height: 100%;
		}
		width: 75%;
		height: 170rpx;
	}
	.li-avatar {
		width: 25%;
	}
}
</style>
