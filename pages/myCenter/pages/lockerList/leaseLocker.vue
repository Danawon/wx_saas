<template>
	<view class="wrap-min">
		<head-nav
			title="储物柜租赁"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="page  pad20">
			<view class="box pad40">
				<view
					class="input-box flex mar-t40"
					:class="{ bor: psd }"
				>
					<u-input
						type="password"
						v-model="psd"
						placeholder="请输入四位数密码"
						border="none"
						prefixIcon="lock"
						maxlength="4"
						prefixIconStyle="font-size: 40rpx;color: #ffaa7f"
					></u-input>
				</view>
			</view>

			<view class="box pad40 mar-t20">
				<view class="li">
					<view class="flex-row flex-a ju-bt ">
						<view class="lable">租赁开始时间</view>
						<view class="lable-val flex-row">
							<view
								class="val "
								@click="timeShow = true"
							>
								<u-input
									type="text"
									v-model="selectTime"
									placeholder="请选择时间"
									disabled
									border="none"
									inputAlign="right"
									disabledColor="rgba(0,0,0,0)"
								></u-input>
							</view>
						</view>
					</view>
					<u-line margin="40rpx 0"></u-line>
				</view>
				<view class="li">
					<view class="flex-row flex-a ju-bt ">
						<view class="lable">租赁天数</view>
						<view class="lable-val flex-row">
							<view class="val">
								<u--input
									@change="changeDays"
									placeholder="请输入天数"
									border="none"
									v-model="days"
									type="digit"
									inputAlign="right"
								></u--input>
							</view>
						</view>
					</view>
					<u-line margin="40rpx 0"></u-line>
				</view>
				<view class="li" v-if="couponList.length" @click="couponShow = true">
					<view class="flex-row flex-a ju-bt ">
						<view class="lable">优惠卷</view>
						<view class="lable-val flex-row">
							<view class="val">
								{{ couponName }}
							</view>
						</view>
					</view>
					<u-line margin="40rpx 0"></u-line>
				</view>
				<view class="tit">支付方式</view>
				<view class="li mar-t40" @click="payWay = 'balance'">
					<view class="flex-row flex-a ju-bt ">
						<view class="lable flex-row felx-a">
							<u-avatar
								:src="baseUrl + 'balance.png'"
								size="45rpx"
							></u-avatar>
							<text class="mar-l20 flex">
								余额支付
							</text>
						</view>
						<view class="lable-val flex-row">
							<u-avatar
								v-if="payWay == 'balance'"
								:src="baseUrl + 'radio2.png'"
								size="40rpx"
							></u-avatar>
							<u-avatar
								v-else
								
								:src="baseUrl + 'radio1.png'"
								size="40rpx"
							></u-avatar>
						</view>
					</view>
					<u-line margin="40rpx 0"></u-line>
				</view>
				<view class="li " @click="payWay = 'wechat'" v-if="totalPrice != 0">
					<view class="flex-row flex-a ju-bt ">
						<view class="lable flex-row felx-a">
							<u-avatar
								:src="baseUrl + 'wx-pay.png'"
								size="50rpx"
							></u-avatar>
							<text class="mar-l20 flex">
								微信支付
							</text>
						</view>
						<view class="lable-val flex-row">
							<u-avatar
								v-if="payWay == 'wechat'"
								:src="baseUrl + 'radio2.png'"
								size="40rpx"
							></u-avatar>
							<u-avatar
								v-else
								
								:src="baseUrl + 'radio1.png'"
								size="40rpx"
							></u-avatar>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fot-box flex-row flex-a ju-bt">
			<view class="price flex-row flex-a">
				<view class="tit-box flex-row flex-a">
					<view class="price-txt ">合计:</view>
					<view class="price-icon ">￥</view>
				</view>

				<view class="price-num ">
					{{ totalPrice || 0 }}
				</view>
				<view class="original-price ">
					{{ originalPrice }}
				</view>
			</view>
			<view class="btn flex" @click="confirmFun">
				立即支付
			</view>
		</view>
		<u-datetime-picker
			:show="timeShow"
			v-model="timeVal"
			mode="date"
			@close="timeShow = false"
			@confirm="confirmTime"
			@cancel="timeShow = false"
		></u-datetime-picker>
		
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
import { timestampToTime, wxPay } from '@/utils/util.js';
import {
	submitLockerOrde,
	getBuyLockerInfo,
	submitLockerOrder
} from '@/api/myCenter.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			psd: '',
			timeShow: false,
			timeVal: Number(new Date()),
			// 训中的时间
			selectTime: '',
			// 储物柜id
			id: '',
			payWay: 'balance', // 支付方式
			days: 1, // 租赁天数
			couponList: '', // 优惠卷列表
			totalPrice: '' ,// 价格
			couponName: "", // 优惠卷名称
			couponId: "", // 优惠卷id
			couponShow: false,
			originalPrice: ""// 储物柜原价
		};
	},
	onLoad(eve) {
		// 储物柜id
		this.id = eve.id;
		// 获取储物柜信息
		this.getBuyLockerInforFun();
	},
	watch: {
		totalPrice(newV, olv) {
			if(newV <= 0) {
				this.payWay = "balance";
			}
		}
	},
	methods: {
		/* 选中优惠卷 */
		selectCoupon(e) {
			this.couponName = e.name;
			this.couponId = e.id; // 优惠卷id
			this.getBuyLockerInforFun();
		},
		// 租赁天数发生改变
		changeDays() {
			if(this.days) {
				this.getBuyLockerInforFun();
			}
		},
		// 获取储物柜信息
		getBuyLockerInforFun() {
			getBuyLockerInfo({
				id: this.id,
				start_time: this.selectTime.trim() || timestampToTime(
					new Date().getTime() / 1000
				),
				lease_day: this.days,
				coupon_id: this.couponId
			}).then(res => {
				
				this.totalPrice = res.data.total_price;
				this.originalPrice = res.data.day_price
				if(res.data.coupon.length) {
					res.data.coupon.map(item => {
						item.name = `${item.name} (${item.bond_price}元)`
					})
					this.couponList = res.data.coupon;
					if(this.couponId === '' || this.couponId === undefined) {
						this.couponName = res.data.coupon[0].name
						this.couponId = res.data.coupon[0].id
					}
				}
			});
		},
		// 提交订单
		confirmFun() {
			if (
				!this.selectTime ||
				this.psd.length < 4 ||
				!this.payWay ||
				!this.days
			) {
				uni.showToast({
					title: '请输入四位数密码、和租赁开始时间、',
					icon: 'none'
				});
				return;
			}
			
			submitLockerOrder({
				lockers_id: this.id,
				lease_day: this.days,
				start_time: this.selectTime,
				pay_type: this.payWay,
				pwd: this.psd,
				coupon_id: this.couponId
			}).then(res => {
				if(res.data.pay_type == "balance") {
					uni.showToast({
						title: res.msg
					})
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				}else {
					wxPay(res.data, data => {
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					});
				}
			
			});
		},
		// 选中时间
		confirmTime(eve) {
			this.selectTime = timestampToTime(
				this.timeVal / 1000,
				'ymd'
			);
			this.timeShow = false;
			this.getBuyLockerInforFun();
		}
	}
};
</script>

<style lang="scss" scoped>
	.original-price {
		font-size: 24rpx;
		color: #999;
		text-decoration: line-through;
		margin-left: 10rpx
	}
.val {
	color: #b3b3b3;
	font-size: 26rpx;
}
.fot-box {
	.price {
		.tit-box {
			margin-top: 10rpx;
		}
		.price-num {
			font-weight: bold;
			color: #fe5e10;
			font-size: 40rpx;
		}
		.price-icon {
			color: #fe5e10;
			margin-left: 10rpx;
		}
		.price-txt {
			font-weight: 500;
			color: rgba(32, 32, 32, 0.9);
			font-size: 28rpx;
		}
	}
	.btn {
		height: 80rpx;
		width: 200rpx;
		color: #fff;
		background-color: #fe5e10;
		border-radius: 40rpx;
		font-size: 28rpx;
		font-weight: 600;
	}
	padding: 10rpx 40rpx 60rpx;
	position: fixed;
	bottom: 0rpx;
	left: 0;
	width: 100%;
	background-color: #fff;
}
.tit {
	font-weight: 400;
	color: rgba(153, 153, 153, 0.9);
	font-size: 22rpx;
}
.box {
	background-color: #fff;
	border-radius: 20rpx;
}
.page {
	background-color: #f5f5f5;
	.input-box {
		height: 80rpx;
		background: rgba(255, 116, 69, 0.04);
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 5rpx 10rpx;
	}

	.input-box.bor {
		border: #fe5e10 1rpx solid;
	}

	.ipt-btn {
		margin: 70rpx auto;
		height: 74rpx;
		background: #fe5e10;
		color: #ffffff;
		font-size: 32rpx;
		border-radius: 54rpx;
	}
}
</style>
