<template>
	<view>
		<head-nav
			title="充值"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="head pad20">
			<view
				class="head-bg pad40 "
				:style="
					'background:url(' +
						baseUrl +
						'pay1.png);background-size: 100% 100%;'
				"
			>
				<view class="head-tit pad20">我的余额</view>
				<view class="price flex-row pad20 ">
					<view class="price-num">{{ myInfo.money }}</view>
					<view class="price-unit  ">元</view>
				</view>
			</view>
		</view>

		<view class="ipt-box pad20">
			<view class="tpyBox-sty pad20">
				<u-input
					placeholder="请输入金额"
					border="none"
					v-model="priceVal"
					type="digit"
					:customStyle="{'height': '80rpx','padding':'0 20rpx'}"
				>
					<view class="prefix mar-r20" slot="prefix">
						<u-icon
							name="rmb"
							color="#999999"
							size="40rpx"
							:bold="true"
						></u-icon>
					</view>
					<view class="" slot="suffix">元</view>
				</u-input>
			</view>
		</view>
		<view class="btn-box pad20">
			<view class="btn  flex" @click="payFun">
				充值
			</view>
		</view>
		<view class="tips-box pad20">
			<view class="tip-tit">
				充值说明：
			</view>
			<view class="tips-1 tip-txt mar-t20">
				1、充值金额只能在翰思运动健康小程序内使用，不能用于其他平台。
			</view>
			<view class="tips-2 tip-txt mar-t20">
				2、充值金额支持无使用期限。
			</view>
			<view class="tips-3 tip-txt mar-t20">
				3、有任何疑问请联系客服400-5588-888.
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getMyInfo, payFun, payBalance } from "@/api/myCenter.js";
import { wxPay } from "@/utils/util.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			priceVal: '', // 金额
			myInfo:{}, // 个人信息
		};
	},
	onLoad() {
		this.getMyInfoFun(); // 获取个人信息
	},
	methods: {
		// 充值余额
		payFun() {
			if(!this.priceVal) {
				uni.showToast({
					title: "请输入要充值的金额",
					icon: "none"
				})
				return
			}
			let _this = this;
			payBalance({
				money: this.priceVal,
			}).then(res => {
				// 微信支付
				wxPay(res.data, payEve => {
					_this.getMyInfoFun();
					_this.priceVal = "";
				})
			})
		},
		// 获取个人信息
		getMyInfoFun() {
			getMyInfo().then(res => {
				this.myInfo = res.data;
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	.tips-box {
		font-weight: 400;
		color: #202020;
		font-size: 28rpx;
		.tips-1 {
			line-height: 45rpx;
		}

	}
	.btn-box {
		.btn {
			width: 100%;
			height: 80rpx;
			border-radius: 10rpx;
			color: #fff;
			background-color: #FF7C3C;
		}
	}
.ipt-box {
	.tpyBox-sty {
		// height: 100rpx;
		width: 100%;
		border-radius: 20rpx;
		border: 1px solid #fe5e10;
	}
}
.head-bg {
	.price {
		align-items: flex-end;
		.price-unit {
			color: #ffffff;
			line-height: 24px;
			font-size: 28rpx;
			margin-left: 10rpx;
			margin-bottom: 8rpx;
		}
		.price-num {
			font-weight: bold;
			color: #ffffff;
			font-size: 60rpx;
		}
	}
	.head-tit {
		font-weight: 400;
		color: #ffffff;
		font-size: 32rpx;
	}
	width: 100%;
	height: 380rpx;
	border-radius: 20rpx;
	color: #fff;
}
</style>
