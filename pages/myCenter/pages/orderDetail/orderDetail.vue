<template>
	<view class="wrap-min">
		<head-nav
			title="订单详情"
			bgColor="rgba(0,0,0,0)"
			:goBack="true"
			iconC="#fff"
			titColor="#fff"
		></head-nav>
		<view class="head-box pad20 ">
			<view class="head-boxInfo flex-row flex-a">
				<view class="img">
					<image
						:src="baseUrl + 'order2.png'"
						mode=""
					></image>
				</view>
				<view class="state-tips flex-col ju-bt ">
					<view class="tips-txt">
						{{ orderInfo.order.status_text }}
					</view>
					<view class="tips-time">
						{{ orderInfo.order.createtime }}
					</view>
				</view>
			</view>
			<view class="stepsBox">
					<u-steps :current="stepsCurrent" activeColor="#FE5E10">
						<u-steps-item title="待付款" ></u-steps-item>
						<u-steps-item title="待发货" ></u-steps-item>
						<u-steps-item title="待收货"  ></u-steps-item>
						<!-- <u-steps-item title="待确认" ></u-steps-item> -->
						<u-steps-item title="已完成" ></u-steps-item>
					</u-steps>
			</view>
		</view>
		
		<view class="address-box flex-row flex-a mar-b20  pad-l20 pad-r20">
			<view class="add-img">
				<image :src="baseUrl + 'order3.png'" mode=""></image>
			</view>
			<view class="add-info flex-col ju-bt mar-l40">
				<view class="name-tel flex-row fla-a">
					<view class="name">
						{{ orderInfo.order.consignee }}
					</view>
					<view class="tel mar-l40">
						{{ orderInfo.order.mobile }}
					</view>
				</view>
				<view class="add-txt">
					{{ orderInfo.order.province }} {{ orderInfo.order.city }} {{ orderInfo.order.area }} {{ orderInfo.order.address }}
				</view>
			</view>
		</view>
		
		<view class="order-info pad20 flex-row flex-a ju-bt">
			<view class="info-img">
				<image :src="orderInfo.orderpro.goods_image" mode=""></image>
			</view>
			<view class="info-tit flex-col ju-bt">
				<view class="tit-txt text-elpis2">
					{{ orderInfo.orderpro.goods_title }}
				</view>
				<view class="price flex-row ">
					<view class="discounts mar-r40 flex-row flex-a">
						<u-icon name="rmb" color="#FF0D0E" top="3rpx" :bold="true" size="32rpx"></u-icon>
						{{ orderInfo.orderpro.goods_price }}
					</view>
					<view class="market-price text-del flex-row flex-a">
						<!-- <u-icon name="rmb" color="#999" :bold="true" size="24rpx"></u-icon> -->
						<!-- 199 -->
					</view>
				</view>
			</view>
		</view>
		
		<view class="order-list pad20 martb20">
			<view class="li flex-row flex-a ju-bt martb40">
				<view class="lable">
					订单编号：
				</view>
				<view class="lable-val flex-row flex-a">
					<view class="val">
						{{ orderInfo.order.order_sn }}
					</view>
					<view class="btn-copy mar-l20" @click="copyFun">
						<image :src="baseUrl+ 'order4.png'" mode=""></image>
					</view>
				</view>
			</view>
			<view class="li flex-row flex-a ju-bt martb40">
				<view class="lable">
					下单时间：
				</view>
				<view class="lable-val flex-row flex-a">
					<view class="val">
						{{ orderInfo.order.createtime }}
					</view>
				</view>
			</view>
			<view class="li flex-row flex-a ju-bt martb40">
				<view class="lable">
					支付状态：
				</view>
				<view class="lable-val flex-row flex-a">
					<view class="val">
						{{ orderInfo.order.pay_status_text }}
					</view>
				</view>
			</view>
			<view class="li flex-row flex-a ju-bt martb40">
				<view class="lable">
					支付方式：
				</view>
				<view class="lable-val flex-row flex-a">
					<view class="val">
						{{ orderInfo.order.pay_type_text }}
					</view>
				</view>
			</view>
		</view>
		<!-- 支付金额 -->
		<view class="price-box pad-t40 pad-b40 pad-l20 pad-r20">
			<view class="pay-price flex-row flex-a ju-bt ">
				<view class="lable">
					支付金额：
				</view>
				<view class="lable-val flex-row">
					<u-icon name="rmb" color="#202020" :bold="true" size="26rpx"></u-icon>
					<view class="val-num">
						{{ orderInfo.order.order_price }}
					</view>
				</view>
			</view>
			<u-line margin="40rpx 0"></u-line>
			<view class="actual-payment flex-row">
				<view class="lable">
					实付款：
				</view>
				<view class="actual-val flex-row ">
					<u-icon name="rmb" color="#FF0D0E" :bold="true" top="2rpx" size="28rpx"></u-icon>
					<view class="val-num">
						{{ orderInfo.order.total_price }}
					</view>
				</view>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="fot-btn pad-l20 pad-r20 pad-t40 pad-b40 flex-row mar-t20" v-if="orderInfo.order.status == '2'">
			<!-- <view class="btn btn1" v-if="orderInfo.order.status == '3'">
				申请售后
			</view> -->
			<view class="btn btn1" @click="getOrderLogistics">
				查看物流
			</view>
			<view class="btn btn2" @click="confirmReceiptFun">
				确认收货
			</view>
		</view>
		
		<u-popup :show="logisticsShow" @close="logisticsShow = false"  :closeable="true" round="20">
			<view class="logistics-nox">
				<view class="tit flex">
					物流信息
				</view>
				<view class="service-info  mar-t40">
					{{ logisticsInfo.item.express_name || '' }}  {{ logisticsInfo.item.express_no}}
				</view>
				<u-line margin="20rpx 0 40rpx"></u-line>
				<!-- 收货地址 -->
				<view class="receive-box flex-row flex-a">
					<view class="icon">
						<u-avatar :src="baseUrl + 'receiv.png'" size="60rpx"></u-avatar>
					</view>
					<view class="receive-info mar-l20">
						[收货地址] {{ orderInfo.order.province }}{{ orderInfo.order.city }}{{ orderInfo.order.area }}{{ orderInfo.order.address }}
					</view>
					
				</view>
				<!-- 物流信息 -->
				<view class="logistics-list mar-t40">
					<view class="li mar-t20 flex-row flex-a ju-bt" v-for="(item, index) in logisticsInfo.data.data" :key="index">
						<view class="sign-box">
							<view class="sign "></view>
						</view>
						<view class="list-txt" :class="{'list-txt2': index == 0}">
							<view class="time" :class="{'time2': index == 0}">
								{{ item.time }}
							</view>
							<view class="tips">
								{{ item.context }}
							</view>
						</view>
					</view>
				</view>
				
			</view>
		</u-popup>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { orderLogistics, orderDetails, confirmReceipt } from "@/api/mall.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			stepsCurrent: 0,
			orderId: "",
			orderInfo: {}, // 订单信息
			logisticsShow: false, // 物流show
			logisticsInfo: [], // 物流信息
		};
	},
	onLoad(e) {
		this.orderId = e.id;
		this.getOrderDetail();
	},
	methods: {
		// 
		// 确认收货
		confirmReceiptFun() {
			confirmReceipt({
				id: this.orderInfo.order.id
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					// this.getOrderDetail();
					uni.navigateBack()
				},1500)
			})
		},
		// 获取订单详情
		getOrderDetail() {
			orderDetails({
				id: this.orderId
			}).then(res => {
				this.orderInfo = res.data;
				this.stepsCurrent = this.orderInfo.order.status ; // 物流状态
			})
		},
		// 获取物流信息
		getOrderLogistics() {
			this.logisticsShow = true;
			orderLogistics({
				id: this.orderId
			}).then(res =>{
				this.logisticsInfo = res.data;
				
			})
		},
		// 复制
		copyFun() {
			uni.setClipboardData({
				data: this.orderInfo.order.order_sn,
				success: function(res) {
					uni.getClipboardData({
						success: function(res) {
							uni.showToast({
								title: '复制成功'
							});
						}
					});
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
	.logistics-nox {
		.logistics-list {
			.li {
				.sign-box {
					width: 7%;
					.sign {
						width: 30rpx;
						height: 30rpx;
						border-radius: 50%;
						background-color: #D9D9D9;
					}
				}
				.time2 {
					color: #FE5E10 !important;
				}
				.list-txt2 {
					color: #333 !important;
				}
				.list-txt {
					.time {
						font-weight: 400;
						color: #999999;
						font-size: 24rpx;
						line-height: 35rpx;
					}
					.tips {
						margin-top: 10rpx;
					}
					width: 90%;
					font-weight: 400;
					color: #999999;
					font-size: 24rpx;
					line-height: 35rpx;
				}
			}
		}
		.receive-box {
			.receive-info {
				font-size: 26rpx;
				font-weight: 400;
				color: #999999;
				line-height: 35rpx;
			}
		}
		.service-info {
			font-weight: 550;
			color: #333333;
			font-size: 26rpx;
		}
		.tit {
			font-weight: 400;
			color: #333333;
			font-size: 34rpx;
		}
		padding: 60rpx 40rpx 0rpx;
		max-height: 60vh;
		overflow-y: scroll;
	}
	.fot-btn {
		.btn2 {
			color: #FE5E10;
			border: 1px solid #FE5E10;
		}
		.btn1 {
			border: 1px solid #999999;
		}
		.btn {
			margin: 0 10rpx;
			display: inline-block;
			padding: 10rpx 25rpx;
			border-radius: 40rpx;
			font-size: 32rpx;
			font-weight: 400;
		}
		background-color: #fff;
		justify-content: flex-end;
	}
	.actual-payment {
		.actual-val {
			.val-num {
				color: #FF0D0E;
				font-size: 36rpx;
				font-weight: 600;
			}
		}
		justify-content: flex-end;
	}
	.price-box {
		.pay-price {
			.lable-val{
				.val-num {
					font-size: 32rpx;
					font-weight: 600;
					color: #202020;
				}
			}
		}
		width: 100%;
		background-color: #fff;
	}
	.order-list {
		background-color: #fff;
	}
	.lable-val {
		.btn-copy {
			width: 80rpx;
			height: 40rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.val {
			font-weight: 400;
			color: #999999;
			font-size: 28rpx;
		}
	}
	.lable {
		font-weight: 400;
		color: #202020;
		font-size: 28rpx;
	}
	.order-info {
		.info-tit {
			.price {
				.market-price {
					font-weight: 400;
					color: #999999;
					font-size: 26rpx;
					margin-bottom: 5rpx;
				}
				.discounts {
					font-weight: 600;
					color: #FF0D0E;
					font-size: 39rpx;
				}
				align-items: flex-end;
			}
			.tit-txt {
				line-height: 50rpx;
				font-weight: 600;
				color: #202020;
				font-size: 30rpx;
			}
			height: 200rpx;
			width: 60%;
		}
		.info-img {
			width: 35%;
			height: 200rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		background-color: #fff;
	}
	.address-box {
		.add-info {
			.add-txt {
				font-weight: 300;
				color: #999999;
				font-size: 28rpx;
			}
			.name-tel {
				font-weight: 400;
				color: #202020;
				font-size: 30rpx;
			}
			height: 90rpx;
		}
		.add-img {
			width: 80rpx;
			height: 80rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		background-color: #fff;
		margin-top: 360rpx;
	}
	.stepsBox {
		margin-top: 95rpx;
	}
	/deep/ .u-steps-item__line--row {
		width: 127rpx !important;
		left: 116rpx !important;
	}
	/deep/ .u-steps-item__wrapper {
		background-color: rgba(0,0,0,0) !important;
	}
.head-box {
	.head-boxInfo {
		.state-tips {
			.tips-time {
				font-size: 24rpx;
				color: rgba(255,255,255,.5);
			}
			.tips-txt {
				font-weight: 600;
				color: #FFFFFF;
				font-size: 32rpx;
			}
			margin-left: 35rpx;
			padding-top: 10rpx;
			height: 100rpx;
		}
		.img {
			width: 100rpx;
			height: 100rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
		margin-top: 180rpx;
	}

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
