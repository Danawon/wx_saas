<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="会员卡信息-业绩申报"></head-nav>
		<view class="page pad-b20">
			<view class="page-top pad-t40" @click="peopleShow = true">
				<u--input placeholder="选择教练或者销售顾问" prefixIcon="account"
					prefixIconStyle="font-size: 40rpx;color: #909399" suffixIcon="arrow-down"
					suffixIconStyle="color: #909399" disabled disabledColor="#fff" v-model="selectName"></u--input>
			</view>
			<view class="title pad-b20 pad-t40">
				报销售业绩
			</view>
			<view class="time pad-b20">
				下单时间：{{ cardInfo.membercardoreder.paidtime }}
			</view>
			<view class="order flex-j pad20">
				<view class="img-box">
					<u-image :src="cardInfo.membercardoreder.membercard_image" width="150rpx" height="150rpx"
						radius="5rpx"></u-image>
				</view>
				<view class="li-center pad-l20 flex-col">
					<text class="name">{{ cardInfo.membercardoreder.membercard_name }}</text>
					<text>{{ cardInfo.membercardoreder.membercard_info }}</text>
				</view>
				<view class="num">
					￥ <text class="txt">{{ cardInfo.membercardoreder.membercard_price }}</text>
				</view>
			</view>
			<view class="flex-a ju-bt pad-t20 li">
				<text>下单用户：{{ cardInfo.user.nickname }}</text>
				<text>手机号：{{ cardInfo.user.mobile }}</text>
			</view>
			<view class="flex-a ju-bt pad-t20 li">
				<view class="money">
					订单金额&nbsp;&nbsp; ¥<text>{{ cardInfo.membercardoreder.order_price }}</text>
				</view>
				<view class="money">
					使用优惠券面额 &nbsp;&nbsp; ¥<text>{{ cardInfo.membercardoreder.discount_price }}</text>
				</view>
			</view>
			<view class="flex-a ju-ar pad-t40 padlr40 ipt-box">
				<text class="tip">线下补录金额：</text>
				<view class="ipt">
					<u-input placeholder="请输入补录金额" border="surround" v-model="offlineAmount"></u-input>
				</view>
			</view>
			<view class=" flex-a ju-ar pad-t40 padlr40 ipt-box" v-if="is_show">
				 <text class="tip">用户类型：</text>
				 <view class="ipt">
					 <u-radio-group
						 v-model="radiovalue"
					   >
						 <u-radio
						   :customStyle="{ marginLeft: '20rpx'}"
						   v-for="(item, index) in radiolist"
						   :key="index"
						   :label="item.name"
						   :name="item.id"
						 >
						 </u-radio>
					</u-radio-group>
				</view>
			</view>
			
			<view class="btn flex" @click="submitFun">
				提交审核
			</view>
			<view class="msg">
				注：财务审核通过后即会计算选择的教练和销售顾问业绩
			</view>
		</view>
		<u-picker
			title="选择教练"
			:show="peopleShow" 
			:columns="list" 
			@confirm="selectpeopleFun"
			@close="peopleShow = false"
			@cancel="peopleShow = false"
			keyName="name"
			:closeOnClickOverlay="true"
		></u-picker>
	</view>
</template>

<script>
	import { performanceReport, submitPerformanceReport } from "@/api/storeApis.js"
	export default {
		data() {
			return {
				id: "",
				cardInfo: {}, // 会员卡信息
				list: [],
				selectVal: "", // 选中顾问
				selectName: "", // 选中顾问name
				peopleShow: false,
				offlineAmount: '', // 线下补录金额
				radiolist: [
					{
						name: "新用户",
						id: "1",
					},
					{
						name: "老用户",
						id: "2",
					}
				],
				radiovalue: "",
				is_show: 1,
			};
		},
		onLoad(e) {
			this.id = e.id;
			this.getPerformanceReport();
		},
		methods: {
			submitFun() {
				if(!this.selectVal || !this.offlineAmount) {
					uni.showToast({
						title: '请输入补录金额和顾问',
						icon: "none"
					})
					return
				}
				if(this.is_show && !this.radiovalue) {
					uni.showToast({
						title: '请选择用户类型',
						icon: "none"
					})
					return
				}
				submitPerformanceReport({
					id: this.id,
					additional_recording:this.offlineAmount,
					coach_id: this.selectVal,
					sales_ratio: this.is_show ? this.radiovalue : 0
				}).then(res => {
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
					setTimeout(() => {
						uni.navigateBack()
					},1500)
				})
			},
			// 选中人员
			selectpeopleFun(e) {
				this.selectName = e.value[0].name
				this.selectVal = e.value[0].id;
				this.peopleShow = false;
			},
			// 获取业绩申报
			getPerformanceReport() {
				performanceReport({
					id: this.id
				}).then(res => {
					this.cardInfo = res.data.cardinfo;
					this.list = [res.data.personnel]
					if(Number(this.cardInfo.membercardoreder.additional_recording) == 0 ) {
						this.is_show = 1;
					}else {
						this.is_show = 0;
					}
				})
			},
		},
	}
</script>

<style lang="scss">
	.ipt {
		width: 60%;
		display: flex;
		justify-content: flex-end;
	}
	/deep/ .u-radio-group {
		justify-content: flex-end;
	}
	.page {
		.page-top {
			padding: 0 26rpx;
		}

		.title {
			font-size: 28rpx;
			font-weight: 600;
			margin-top: 20rpx;
			color: #202020;
			padding-left: 26rpx;
		}

		.time {
			font-size: 26rpx;
			font-weight: 500;padding-left: 26rpx;
			color: rgba(0, 0, 0, 0.4);
		}

		.li {
			font-size: 28rpx;

			.money {
				color: #EF0708;

				text {
					font-size: 30rpx;
					font-weight: bold;
				}
			}
		}
		.btn {
			margin: 104rpx 32rpx 0;
			height: 74rpx;
			background: #FE5E10;
			border-radius: 50rpx;
			font-size: 32rpx; 
			font-weight: 400;
			color: #FFFFFF;
		}
		.msg {
			font-size: 26rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			text-align: center;
			margin-top: 10rpx;
		}
		.ipt-box {
			.tip {
				color: #EF0708;
				font-size: 28rpx;
			}
		}

		.li:last-child {
			border-bottom: 1rpx solid #f5f5f5;
		}

		.order {
			.li-center {
				font-size: 22rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.4);
			}

			.name {
				font-weight: 600;
				color: rgba(32, 32, 32, 0.9);
				font-size: 28rpx;
				margin-bottom: 8rpx;
			}

			.num {
				margin-left: auto;
				font-weight: bold;
				font-size: 20rpx;
				color: #EF0708;

				.txt {
					font-size: 30rpx
				}
			}
		}

		.li {
			padding: 20rpx 26rpx 0;
		}
	}
</style>
