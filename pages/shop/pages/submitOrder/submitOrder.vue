<template>
	<view class="wrap-min">
		<head-nav title="提交订单" :goBack="true"></head-nav>
		<!-- 地址信息 -->
		<view
			
			class="address-info pad20 mar-t20 mar-b20 flex-row flex-a"
			@click="goAddressManage"
		>
			<view class="info-l" v-if="addressInfo.id">
				<!-- 地区 -->
				<view class="region mar-t20 mar-b20">
					<text>{{ addressInfo.province }}</text>
					<text class="mar-l20">{{ addressInfo.city }}</text>
					<text class="mar-l20">{{ addressInfo.area }}</text>
				</view>
				<!-- 详细地址 -->
				<view class="detail-address mar-t20 mar-b20">
					{{ addressInfo.address }}
				</view>
				<!-- 用户信息 -->
				<view
					class="user-info flex-row flex-a mar-t20 mar-b20"
				>
					<view class="name">{{ addressInfo.name }}</view>
					<view class="tel">{{ addressInfo.mobile }}</view>
				</view>
			</view>
			<view class="address-tips"  v-else>
				暂无地址
			</view>
			<view class="info-r">
				<u-icon
					name="arrow-right"
					color="#999999"
					size="30rpx"
					bold="true"
				></u-icon>
			</view>
		</view>
		<!-- 订单信息 -->
		<view class="goods-info pad20 flex">
			<view class="info-img">
				<u--image
					:showLoading="true"
					:src="productIndo.image"
					width="210rpx"
					height="170rpx"
					radius="4rpx"
				></u--image>
			</view>
			<view class="info-content flex-col">
				<view class="goods-tit  flex-row">
					<view class="img-box mar-r20">
						<image :src="baseUrl + 'ziy.png'" mode=""></image>
					</view>
					<view
						class="tit-txt"
						:style="{
							'text-indent': true ? '18%' : '0'
						}"
					>
						{{ productIndo.title || '' }}
					</view>
				</view>

				<view class="goods-price flex-row flex-a ">
					<!-- 当前价 -->
					<view
						class="current-price flex-row flex-col"
					>
						<view class="price-num">¥{{ productIndo.sales_price || '' }}</view>
					</view>
					<!-- 划线价 -->
					<view class="lineation-price mar-l20">
						¥{{ productIndo.market_price || '' }}
					</view>
				</view>
			</view>
		</view>
		<u-cell-group v-if="couponList.length" :customStyle="{background: '#fff'}">
			<u-cell  title="优惠卷" :value="couponName"  :isLink='true' @click="couponShow = true"></u-cell>
		</u-cell-group>
		<!-- 选择支付方法组件 -->
		<view class=" mar-t40">
			<pay-way
				ref="payWayRef"
				:price="paymentAmount"
				@payFun="submitFun"
			></pay-way>
		</view>
		
		<u-action-sheet
			:actions="couponList"
			title="优惠卷列表"
			:show="couponShow"
			cancelText="关闭"
			@close="couponShow = false"
			@select="selectCoupon"
		></u-action-sheet>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { createOrder, submitOrder } from "@/api/mall.js"
import { wxPay } from "@/utils/util.js"
// 支付方式组件
import payWay from '@/components/payWay/payWay.vue';
export default {
	components: {
		payWay
	},
	data() {
		return {
			baseUrl: baseUrl,
			addressInfo: {}, // 地址信息
			productId: "", // 商品订单
			productIndo: {}, // 产品信息
			couponList: "", // 优惠卷列表
			paymentAmount:"", // 真实支付金额
			couponId: "", // 优惠卷id
			couponName: "", // 优惠卷名称
			couponShow: false, // 优惠卷show
		};
	},
	onLoad(e) {
		this.productId = e.id;
		this.createOrderFun();
	},
	onShow() {
		uni.$off("selectAddress")
		uni.$on("selectAddress", data => {
			 this.addressInfo = data;
		})
	},
	methods: {
		/* 选中优惠卷 */
		selectCoupon(e) {
			this.couponName = e.name;
			this.couponId = e.id; // 优惠卷id
			this.createOrderFun();
		},
		// 创建订单
		createOrderFun() {
			createOrder({
				num: 1,
				address_id: this.addressInfo.id || '',
				product_id: this.productId,
				coupon_id: this.couponId
			}).then(res => {
				this.productIndo = res.data.info;
				this.$refs.payWayRef.getPayList(res.data.pay_type);
				this.paymentAmount = res.data.total_price
				if(res.data.coupon.length) {
					res.data.coupon.map(item => {
						item.name = `${item.name} (${item.bond_price}元)`
					})
					this.couponList = res.data.coupon
					if(this.couponId === '' || this.couponId === undefined) {
						this.couponName = res.data.coupon[0].name
						this.couponId = res.data.coupon[0].id
					}
				}
			})
		},
		// 下单
		submitFun(eve) {
			if(!this.addressInfo.id) {
				uni.showToast({
					title: "请选择地址！",
					icon: "error"
				})
				return
			}
			if (!eve.selectPayType || !eve.agreementState) {
				uni.showToast({
					title: '请选择支付方式和勾选协议',
					icon: 'none'
				});
				return;
			}
			submitOrder({
				product_id: this.productId,
				address_id: this.addressInfo.id,
				pay_type: eve.selectPayType,
				num: 1,
				coupon_id: this.couponId
			}).then(res => {
				if(!res.data.hasOwnProperty('appId')) {
					uni.showToast({
						title: res.msg,
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: `/pages/store/pages/paySuccess/paySuccess?orderInfo=${
								JSON.stringify(res.data)
							}&type=1`
						});
					}, 1500);
				}else {
					wxPay(res.data, eve => {
						setTimeout(() => {
							uni.navigateTo({
								url: `/pages/store/pages/paySuccess/paySuccess?order_sn=${
									res.data.order_sn
								}&type=2`
							});
						}, 1500);
					})
				}
			})
		},
		
		// 跳转地址管理页
		goAddressManage() {
			uni.navigateTo({
				url: "/pages/shop/pages/addressList/addressList"
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	.address-tips {
		color: #999;
	}
	.fot-box {
		.buy-btn {
			height: 70rpx;
			width: 170rpx;
			color: #fff;
			font-size: 28rpx;
			border-radius: 40rpx;
			background-color: #FE5E10;
			opacity: 1;
		}
		.total {
			.total-price {
				.price-num {
					font-weight: bold;
					font-size: 35rpx;
					color: #FF0D0E;
				}
			}
			.total-txt {
				margin-top: 4rpx;
				font-weight: 550;
				color: #202020;
				font-size: 28rpx;
			}
		}
		width: 100%;
		padding: 30rpx 30rpx 60rpx;
		background-color: #fff;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		left: 0;
	}
.goods-info {
	.info-content {
		.goods-price {
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
					font-size: 30rpx;
				}
			}
		}
		.goods-tit {
			.tit-txt {
				font-weight: 540;
				color: #202020;
				line-height: 50rpx;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
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
				top: 4rpx;
			}
			position: relative;
		}
		width: 67%;
		height: 170rpx;
		justify-content: space-between;
	}
	.info-img {
		width: 30%;
	}
	justify-content: space-between;
	width: 100%;
	background-color: #fff;
}
.address-info {
	.info-l {
		.detail-address,
		.user-info {
			font-weight: 400;
			color: #999999;
			font-size: 28rpx;
		}
		.region {
			font-size: 32rpx;
			font-weight: 500;
			color: #202020;
			font-weight: bold;
		}
	}
	background-color: #fff;
	justify-content: space-between;
}
</style>
