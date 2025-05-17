<template>
	<view>
		<head-nav
			title="积分商品详情"
			bgColor="#fff"
			:goBack="true"
		></head-nav>

		<view class="head-box pad20">
			<image :src="info.image" mode=""></image>
			<view class="tit text-elpis">
				{{ info.title }}
			</view>
			<view class="num-box yhj-box  flex-row flex-a ju-bt">
				<view class="num-icon flex-row flex-a">
					<image
						:src="baseUrl + 'jf4.png'"
						mode=""
					></image>
					<text class="num-val">{{ info.price }}</text>
				</view>
				<view class="detail flex">库存 {{ info.stock }}</view>
			</view>
		</view>
		<u-line margin="10rpx 0 "></u-line>
		<view class="pad20">
			<u-parse :content="info.content"></u-parse>
			<!-- <view class="title">兑换说明</view>
			<view class="tag flex martb20">商品名称</view>
			<view class="name txt-sty martb20">
				平台优惠券金额根据平台或店面设置比例
			</view>
			<view class="tag flex martb20">兑换有效期</view>
			<view class="time txt-sty martb20">
				2022年6月8日-2022年8月8日
			</view>
			<view class="tag flex martb20">兑换说明</view>
			<view class="tips-sty">
				1、点击【立即兑换】，输入兑换数量，点击【确定】，进入支付详情页面，点【立即支付】，支付成功后将确认订单后优惠券到账
			</view>
			<view class="tips-sty">
				2、点击【立即兑换】，输入兑换数量，点击【确定】，进入支付详情页面，点【立即支付】，支付成功后将确认订单后优惠券到账
			</view>
			<view class="tag flex martb20">注意事项</view>
			<view class="tips-sty">
				1、本优惠券新老用户均可使用，每个订单限使用1张，不与其他优惠叠加
			</view>
			<view class="tips-sty">
				2、点击【立即兑换】，输入兑换数量，点击【确定】，进入支付详情页面，点【立即支付】，支付成功后将确认订单后优惠券到账
			</view> -->
		</view>
		<view class="btn-box pad-l20 pad-r20 pad-t20 pad-b40">
			<view class="btn flex" @click="payShow = true">
				立即兑换
			</view>
		</view>
		<u-popup
			:show="payShow"
			@close="payShow = false"
			round="40rpx"
			:safeAreaInsetBottom="true"
			:closeable="true"
		>
			<view class="pop-box pad40 ">
				<view class="flex-row fla-a ju-bt mar-t40">
					<view class="pop-l flex-row flex-a">
						<view class="img">
							<image
								:src="info.image"
								mode=""
							></image>
						</view>
						<view
							class="info-box mar-l40 flex-col ju-bt"
						>
							<view class="info-t flex-row flex-a">
								<image
									:src="baseUrl + 'jf4.png'"
									mode=""
								></image>
								<view class="txt-num">{{ parseFloat(info.price) * numberVal }}</view>
							</view>
							<view class="info-b">库存 {{ info.stock }}</view>
						</view>
					</view>
					<view class="pop-r flex-a flex-row">
						<view class="subtract" @click="minusFun">
							<u-icon
								name="minus-circle"
								color="#FE5E10"
								size="40rpx"
							></u-icon>
						</view>
						<view class="number-val marlr20">
							{{ numberVal }}
						</view>
						<view class="add" @click="plusFun">
							<u-icon
								name="plus-circle-fill"
								color="#FE5E10"
								size="40rpx"
							></u-icon>
						</view>
					</view>
				</view>
				<view class="btn flex martb40" @click="goExchange">
					立即兑换
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { integralProductDetail, exchangeProduct } from "@/api/integral.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			payShow: false, // 弹出层状态
			numberVal: 1 ,// 购买数量
			productId: "", // 产品id
			info: {}, // 产品信息
		};
	},
	onLoad(e) {
		this.productId = e.id;
		this.getintegralProductDetail();
	},
	methods: {
		// 获取积分产品详情
		getintegralProductDetail() {
			integralProductDetail({
				id: this.productId
			}).then(res => {
				this.info = res.data
			})
		},
		// 增加数量
		plusFun() {
			this.numberVal ++
		},
		// 减少数量
		minusFun() {
			if(this.numberVal <= 1) {
				this.numberVal = 1
				return
			}
			this.numberVal --
		},
		// 立即兑换
		goExchange() {
			this.payShow = false;
			exchangeProduct({
				product_id:  this.productId,
				num: this.numberVal
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			})
		},
		
	}
};
</script>

<style lang="scss" scoped>
.pop-box {
	.pop-l {
		.info-box {
			.info-b {
				font-size: 22rpx;
				font-weight: 300;
				color: #999999;
			}
			.info-t {
				.txt-num {
					font-size: 35rpx;
				}
				image {
					width: 40rpx;
					height: 40rpx;
				}
			}
			height: 105rpx;
		}
		.img {
			width: 240rpx;
			height: 105rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	// height: 300rpx;
}
.btn {
		width: 100%;
		height: 80rpx;
		color: #fff;
		font-size: 28rpx;
		border-radius: 40rpx;
		background: #fe5e10;
	}

.tips-sty {
	line-height: 50rpx;
	font-weight: 400;
	color: #202020;
	font-size: 28rpx;
}
.txt-sty {
	font-weight: 400;
	color: #202020;
	font-size: 28rpx;
}
.tag {
	display: inline-block;
	padding: 8rpx 15rpx;
	color: #fff;
	font-size: 28rpx;
	background: rgba(255, 124, 60, 0.7);
	border-radius: 4rpx;
}
.title {
	font-weight: 600;
	font-size: 32rpx;
	color: rgba(0, 0, 0, 0.9);
}
.head-box {
	.yhj-box {
		.detail {
			font-weight: 300;
			color: #999999;
			font-size: 22rpx;
		}
		.num-val {
			font-size: 35rpx;
			font-weight: 500;
			color: #fe5e10;
			margin-left: 10rpx;
		}
		image {
			width: 30rpx;
			height: 30rpx;
		}
	}
	.tit {
		font-weight: 400;
		color: rgba(0, 0, 0, 0.9);
		font-weight: 28rpx;
		margin: 10rpx 0;
	}
	image {
		width: 100%;
		height: 280rpx;
	}
}
</style>
