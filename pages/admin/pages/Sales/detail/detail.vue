<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="店长以报业绩"></head-nav>
		<view class="list">
			<view class="top flex-a">
				<u--image src="" width="132rpx" height="132rpx"></u--image>
				<view class="flex-a ju-bt flex-col pad-l20">
					<text class="title">私教课</text>
					<text class="msg">会员卡简介</text>
				</view>
				<view style="margin-left: auto;color: #FE5E10;">
					￥
					<text style="font-size: 40rpx;font-weight: bold;">99</text>
				</view>
			</view>
			<view class="pad-l20 pad-r20"><u-line></u-line></view>

			<view class="pad-l40 pad-r40 flex-a ju-bt pad-t20 pad-b20 li">
				<text class="gray">预约场地</text>
				<text class="gray2">开福万达翰思健康运动馆</text>
			</view>
			<view class="pad-l40 pad-r40 flex-a ju-bt pad-t20 pad-b20 li">
				<text class="gray">预约教练</text>
				<text class="gray2">李颂杰</text>
			</view>
			<view class="pad-l40 pad-r40 flex-a ju-bt pad-t20 pad-b20 li">
				<text class="gray">上课次数</text>
				<text class="gray2">236天 90次卡</text>
			</view>
			<view class="pad-l40 pad-r40 flex-a ju-bt pad-t20 pad-b20 li">
				<text class="gray">上课次数</text>
				<text class="gray2">236天 90次卡</text>
			</view>
			<view class="pad-l40 pad-r40 flex-a ju-bt pad-t20 pad-b20 li">
				<text class="gray">支付方式</text>
				<text class="gray2">会员卡支付</text>
			</view>
			<view class="pad-l40 pad-r40 flex-a ju-bt pad-t20 pad-b20 li">
				<text class="gray">支付时间</text>
				<text class="gray2">2022-01-19 18:22</text>
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
	onShow() {},
	methods: {
		//跳转页面
		jump(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.list {
	.top {
		padding: 26rpx 40rpx 32rpx;
		.title {
			color: #2f2f2f;
			font-size: 40rpx;
		}

		.msg {
			font-size: 22rpx;
			font-weight: 400;
			color: #999999;
			margin-top: 33rpx;
		}
	}

	.li {
		.gray {
			color: rgba(0, 0, 0, 0.6);
			font-size: 28rpx;
		}
		.gray1 {
			color: #434343;
			font-size: 28rpx;
		}
	}
}
</style>
