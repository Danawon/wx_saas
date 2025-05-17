<template>
	<view class="wrap">
		<!-- 支付方式 -->
		<view class="pay-way pad20">
			<view
				class="vip-card pad20 flex-row flex-a mar-b20"
				v-for="(item, index) in payList"
				:key="index"
				:class="{ 'selected-bor': selectIndex === index }"
				@click="selectPay(item, index)"
			>
				<view class="pay-l flex-row flex-a">
					<view class="pay-img-box">
						<u--image
							:showLoading="true"
							:src="item.image"
							width="100%"
							height="45rpx"
						></u--image>
					</view>

					<text class="pay-way-txt mar-l20">
						{{ item.name }}
					</text>
					<view class="surplus ">
						<!-- 卡剩余 -->
						<view
							class="surplus-card"
							v-if="item.field == 'mbcard'"
						>
							<text>剩余：</text>
							<text>{{ item.shenday }}天</text>
							<text style="margin-left: 10rpx;" v-if="item.times_show">
								{{ item.number }}次
							</text>
						</view>
						<!-- 余额剩余 -->
						<view
							class="surplus-balance"
							v-if="item.field == 'balance'"
						>
							<text>余额：</text>
							<text>{{ item.balance }}元</text>
						</view>
					</view>
				</view>
				<view class="pay-r" v-if="selectIndex === index">
					已选择
				</view>
			</view>
			
			<u-empty
				v-if="!payList.length"
				mode="list"
				:text="buyType == 'buyCourse' ? '暂无会员卡' : '暂无支付方式'"
			></u-empty>
		</view>
		<!-- 协议 -->
		<view class="agreement-box   flex">
			<view class="" @click="toggleAgreement" v-if="agreementState">
				<u--image
					:showLoading="true"
					:src="baseUrl + 'selected.png'"
					width="30rpx"
					height="30rpx"
				></u--image>
			</view>
			
			<view v-else class="checked-false" @click="toggleAgreement"></view>
			<text style="margin-left: 10rpx;">已阅读协议</text>
			<text class="agreement-tit" @click="goAgreement">
				《服务协议》
			</text>
		</view>
		<!-- 底部支付按钮  购卡-->
		<view class="fot-pay flex-row flex-a" v-if="type != 'course'">
			<view class="pay-total flex-row">
				<view class="total-tit">合计</view>
				<view class="total-price flex-row ">
					<u-icon
						top="5rpx"
						name="rmb"
						color="#FE5E10"
						size="26rpx"
						:bold="true"
					></u-icon>
					<text class="total-price-num">{{ butType ? totalPrice : price }}</text>
				</view>
			</view>
			<view class="pay-btn">
				<view class="btnSty flex" @click="payFun">
					立即支付
				</view>
			</view>
		</view>
		<!-- 底部支付按钮  购卡-->
		<view class="fot-pay flex-row flex-a" v-if="type == 'course'">
			<view class="pay-btn payCourse">
				<view class="btnSty flex" @click="payFun">
					确定约课
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
export default {
	name: 'buyWay',
	props: {
		price: {
			type: String,
			default: 0,
		},
		// 是约课 还是买卡类型
		type: {
			type: String,
			default: ''
		},
		butType: {
			type: Boolean,
			default: false
		},
		totalPrice: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			baseUrl: baseUrl,
			// 当前选中的支付方式下标
			selectIndex: "",
			// 是否勾选协议
			agreementState: true,
			// 选中的支付类型
			selectPayType: "",
			// 会员卡id
			card_id: "",
			payList: [],
			/* 购买类型 */
			buyType: "",
		};
	},
	methods: {
		/* 获取数据 */
		getPayList(eve, type) {
			this.buyType = type;
			if(!eve.length) {
				return
			}
			this.payList = eve;
			this.selectPayType = eve[0].field
			this.selectIndex = 0;
			this.card_id = eve[0].card_id ?? ""
		},
		// 切换协议状态
		toggleAgreement() {
			this.agreementState = !this.agreementState;
		},
		// 选中支付类型
		selectPay(eve, index) {
			this.selectIndex = index;
			this.selectPayType = eve.field; // 支付类型
			this.card_id = eve.card_id ?? ""
		},
		// 支付
		payFun() {
			this.$emit("payFun", {selectPayType: this.selectPayType,agreementState: this.agreementState, card_id: this.card_id})
		},
		// 跳转购卡协议页面
		goAgreement() {
			uni.navigateTo({
				url:
					'/pages/store/pages/buyCardAgreement/buyCardAgreement'
			});
		},
	}
};
</script>

<style lang="scss" scoped>
	.payCourse {
		width: 100%;
		.btnSty {
			width: 100% !important;
		}
	}
	.wrap{
		padding-bottom: 160rpx;
		// background-color: #fff;
	}
	.fot-pay {
		.pay-btn {
			.btnSty {
				background-color: #fe5e10;
				border-radius: 50rpx;
				width: 200rpx;
				height: 80rpx;
				font-size: 30rpx;
				color: #fff;
			}
		}
		.pay-total {
			.total-price {
				.total-price-num {
					color: #fe5e10;
					font-size: 40rpx;
					font-weight: bold;
				}
				margin-left: 10rpx;
			}
	
			.total-tit {
				font-weight: 500;
				color: rgba(32, 32, 32, 0.9);
				font-size: 28rpx;
				font-family: DIN-Bold, DIN;
				margin-top: 11rpx;
			}
		}
		padding: 14rpx 30rpx 60rpx;
		background-color: #fff;
		justify-content: space-between;
		box-sizing: content-box;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
	}
.agreement-box {
	.checked-false {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		border: 1px solid #ccc;
	}
	.agreement-tit {
		color: #fe5e10;
	}
	font-size: 26rpx;
	margin-bottom: 30rpx;
}
.pay-way {
	.pay-img-box {
		width: 42rpx;
		height: 45rpx;
	}
	.selected-bor {
		border: 1px solid #fe5e10;
	}
	.pay-r {
		font-weight: 500;
		color: rgba(0, 0, 0, 0.4);
		font-size: 28rpx;
	}
	.surplus-card,
	.surplus-balance {
		font-weight: 500;
		color: #fe5e10;
		font-size: 27rpx;
	}
	.surplus {
		margin-left: 40rpx;
	}
	.pay-way-txt {
		font-weight: 600;
		color: rgba(32, 32, 32, 0.9);
		font-size: 30rpx;
	}
	.vip-card {
		width: 100%;
		height: 120rpx;
		background-color: #fff;
		// background-color: #f99;
		border-radius: 20rpx;
		justify-content: space-between;
	}
}
</style>
