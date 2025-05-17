<template>
	<view class="wrap-min">
		<head-nav title="商品详情" :goBack="true"></head-nav>
		<view class="swiper-box">
			<u-swiper
				:list="productInfo.images"
				mgMode=""
				height="340rpx"
				:indicator="true"
				:indicatorStyle="bottom"
				radius="0"
				indicatorMode="dot"
			></u-swiper>
		</view>
		<u-line margin="40rpx 0 0 0"></u-line>
		<view class="pad20">
			<!-- 商品价格 -->
			<view class="price-box flex-row flex-a ">
				<!-- 当前价 -->
				<view class="current-price flex-row flex-col">
					<u-icon
						name="rmb"
						size="30rpx"
						color="#FF0D0E"
						:bold="true"
						top="5rpx"
					></u-icon>
					<view class="price-num">{{ productInfo.sales_price }}</view>
				</view>
				<!-- 划线价 -->
				<view class="lineation-price mar-l20">¥{{ productInfo.market_price }}</view>
			</view>
			<!-- 商品标题 -->
			<view class="goods-tit mar-t20 flex-row">
				<view class="img-box mar-r20">
					<image :src="baseUrl + 'ziy.png'" mode=""></image>
				</view>
				<view
					class="tit-txt"
					:style="{
						'text-indent': true ? '12%' : '0'
					}"
				>
					{{ productInfo.title }}
				</view>
			</view>
			<!-- 商品描述 -->
			<view class="goods-describe mar-t20">
				{{ productInfo.desc }}
			</view>
		</view>
		<u-line margin="40rpx 0 30rpx 0"></u-line>
		<!-- 运费 -->
		<view
			class="freight mar-t20 mar-b20 pad-l20 pad-r20 flex-row flex-a"
		>
			<view class="freight-l flex-row flex-col">
				<view class="l-tit">运费</view>
				<view class="l-price">免费运</view>
			</view>
			<view class="freight-r">
				<u-icon
					name="arrow-right"
					size="28rpx"
					color="#000"
					:bold="true"
				></u-icon>
			</view>
		</view>
		<u-line margin="30rpx 0 40rpx 0"></u-line>
		<!-- 商品详情 -->
		<view class="goods-detail flex mar-b20">
			<view class="line"></view>
			<view class="txt mar-l20 mar-r20">商品详情</view>
			<view class="line"></view>
		</view>
		<!-- 富文本 -->
		<view class="u-content pad20">
			<u-parse :content="productInfo.content"></u-parse>
		</view>
		<!-- 购买 -->
		<view class="foot-buy flex">
			<view class="buy-btn flex " @click="goOrder">
				立即购买
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { productDetails } from "@/api/mall.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			productId: "", // 商品id
			productInfo: {},
		};
	},
	onLoad(e) {
		this.productId = e.id;
		this.getProductDetails();
	},
	methods: {
		// 获取详情
		getProductDetails() {
			productDetails({
				id: this.productId
			}).then(res => {
				this.productInfo = res.data
			})
		},
		// 跳转订单详情页
		goOrder() {
			uni.navigateTo({
				url: `/pages/shop/pages/submitOrder/submitOrder?id=${this.productInfo.id}`
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	.foot-buy {
		.buy-btn {
			width: 100%;
			height: 70rpx;
			background-color: #FE5E10;
			color: #fff;
			border-radius: 50rpx;
		}
		padding: 30rpx 40rpx 40rpx;
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
	}
.goods-detail {
	.txt {
		font-weight: 550;
		color: #202020;
	}
	.line {
		height: 1rpx;
		width: 50rpx;
		background: #d9d9d9;
		opacity: 1;
	}
}
.freight {
	.freight-l {
		.l-price {
			margin-left: 30rpx;
		}
		font-weight: bold;
		font-size: 28rpx;
	}
	justify-content: space-between;
}
.goods-describe {
	color: #999999;
	line-height: 50rpx;
	font-weight: 400;
	font-size: 26rpx;
}
.goods-tit {
	.tit-txt {
		width: 100%;
		font-weight: 550;
		color: #202020;
		line-height: 45rpx;
	}
	.img-box {
		image {
			width: 100%;
			height: 100%;
		}
		height: 40rpx;
		width: 75rpx;
		position: absolute;
		left: 0;
		top: 0;
	}
	position: relative;
}
.price-box {
	.lineation-price {
		font-family: DIN-Medium, DIN;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.26);
		font-size: 26rpx;
		text-decoration: line-through;
		margin-top: 6rpx;
		font-weight: bold;
	}
	.current-price {
		.price-num {
			font-family: DIN-Medium, DIN;
			font-weight: bold;
			color: #ff0d0e;
			font-size: 40rpx;
		}
	}
}
.swiper-box {
	width: 100%;
	height: 340rpx;
}
.wrap-min {
	background-color: #fff;
	padding-bottom: 150rpx;
}
</style>
