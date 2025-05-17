<template>
	<view class="wrap">
		<head-nav title="详情" :goBack="false" iconC="rgba(0,0,0,0)"></head-nav>

		<view class="sucess-img flex-col flex-a">
			<u--image
				:showLoading="true"
				:src="baseUrl + 'paySuccess.png'"
				width="160rpx"
				height="160rpx"
				shape="circle"
			></u--image>
			<text class="img-txt mar-t20">订单支付成功</text>
		</view>
		<view class="order-info-box pad20">
			<view class="order-info ">
				<view class="list flex-row flex-a">
					<view class="order-tit">订单编号</view>
					<view class="order-info-value">
						{{ orderInfo.order_sn }}
					</view>
				</view>
				<view class="list flex-row flex-a">
					<view class="order-tit">订单信息</view>
					<view class="order-info-value">
						{{ orderInfo.body }}
					</view>
				</view>
				<view class="list flex-row flex-a">
					<view class="order-tit">下单时间</view>
					<view class="order-info-value">
						{{ orderInfo.createtime }}
					</view>
				</view>
				<view class="list flex-row flex-a">
					<view class="order-tit">支付方式</view>
					<view class="order-info-value">
						<text
							v-if="
								orderInfo.pay_type == 'balance'
							"
						>
							余额支付
						</text>
						<text
							v-if="orderInfo.pay_type == 'wechat'"
						>
							微信支付
						</text>
						<text
							v-if="orderInfo.pay_type == 'mbcard'"
						>
							会员卡支付
						</text>
					</view>
				</view>
				<view class="list flex-row flex-a">
					<view class="order-tit">支付金额</view>
					<view class="order-info-value">
						{{ orderInfo.total_price }}
					</view>
				</view>
			</view>
		</view>
		<view class="btn-box pad20">
			<view class="look-order flex" @click="goRouter(1)">
				查看订单
			</view>
			<view
				class="look-index flex mar-t20"
				@click="goRouter(2)"
			>
				查看首页
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getOrderInfo } from '@/api/living.js';
export default {
	name: 'paySuccess',
	data() {
		return {
			baseUrl: baseUrl,
			// 订单信息：
			orderInfo: {},
			// 订单类型
			orderTtpe: ''
		};
	},
	onLoad(eve) {
		if (eve.type == 1) {
			this.orderTtpe = 1; // 卡 或 余额支付
			this.orderInfo = JSON.parse(eve.orderInfo);
		} else {
			this.getOrderInfo(eve.order_sn);
		}
	},
	methods: {
		// 跳转页面
		goRouter(eve) {
			let url = '';
			if (eve == 1) {
				// 查看订单
				if(this.orderInfo.order_type == 'membercard_order') {
					uni.reLaunch({
						url: `/pages/myCenter/pages/tradingRecord/tradingRecord?type=success`
					});
				}else if(this.orderInfo.order_type == "coach_order") {
					uni.reLaunch({
						url: `/pages/myCenter/pages/appointmentDetails/appointmentDetails?type=success&orderId=${this.orderInfo.order_id}`
					});
				}else if(this.orderInfo.order_type == "clockon_order") {
					uni.reLaunch({
						url: `/pages/punchTheClock/pages/myBuyCard/myBuyCard?type=success&id=${this.orderInfo.order_id}`
					});
				}else if(this.orderInfo.order_type == "mall_order") {
					uni.reLaunch({
						url: `/pages/myCenter/pages/mallOrder/mallOrder?type=success`
					});
				}
			} else if (eve == 2) {
				// 返回首页
				uni.switchTab({
					url: '/pages/store/index/index',
					success: function(e) {
						var page = getCurrentPages().pop(); // 返回页面数组的最后一个页面数据
						if (page == undefined || page == null)
							return; //如果最后一个页面为undefined或null，即当前就在首页 return出去，不调用onLoad
						page.onLoad();
					}
				});
			}
		},
		// 获取订单信息
		getOrderInfo(eve) {
			getOrderInfo({
				order_sn: eve
			}).then(res => {
				this.orderInfo = res.data;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.btn-box {
	.look-index {
		opacity: 1;
		border: 2px solid #fe5e10;
		font-weight: 540;
		color: #fe5e10;
	}
	.look-order {
		background: linear-gradient(
			90deg,
			#fe5e10 0%,
			#fe5e10 100%
		);
		color: #fff;
	}
	.look-order,
	.look-index {
		font-size: 33rpx;
		height: 90rpx;
		border-radius: 50rpx;
	}
}
.order-info-box {
	.list:not(:last-child) {
		margin-bottom: 30rpx;
	}
	.list {
		justify-content: space-between;
	}
	.order-info {
		.order-info {
			font-weight: bold;
			color: rgba(0, 0, 0, 0.9);
			font-size: 30rpx;
		}
		.order-tit {
			font-weight: 400;
			color: rgba(0, 0, 0, 0.4);
			font-size: 30rpx;
		}
		width: 100%;
		padding: 40rpx 20rpx;
		border-radius: 20rpx;
		background-color: #f9f9f9;
		opacity: 1;
		margin-top: 50rpx;
	}
}
.sucess-img {
	.img-txt {
		font-weight: 500;
		color: rgba(0, 0, 0, 0.6);
		font-size: 30rpx;
		font-weight: bold;
	}
	margin-top: 60rpx;
}
view {
	font-family: PingFang SC-Medium, PingFang SC;
}
</style>
