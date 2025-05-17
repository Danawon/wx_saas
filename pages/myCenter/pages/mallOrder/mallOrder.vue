<template>
	<view class="wrap-min pad-b40">
		<head-nav
			title="商城订单"
			bgColor="#fff"
			:goBack="!type"
			:goIndex="type"
		></head-nav>
		<u-sticky bgColor="#fff">
			<u-tabs
				:list="tabList"
				lineColor="#FE5E10"
				:activeStyle="{
					color: '#FE5E10',
					fontWeight: 'bold',
					transform: 'scale(1.05)'
				}"
				:inactiveStyle="{
					color: '#606266',
					transform: 'scale(1)'
				}"
				:current="tabsCurrent"
				@change="tabsChange"
				:scrollable="false"
			></u-tabs>
		</u-sticky>

		<view class="list-box mar-t20 pad20" v-if="list.length">
			<view
				class="li martb20"
				v-for="(item, index) in list"
				:key="index"
				@click.stop="goRouter(item)"
			>
				<view class="li-time flex-r flex-a ju-bt">
					<view class="time">2022-05-20 15:00</view>
					<view class="state">
						<text class="state-txt1">
							{{ item.status_text }}
						</text>
					</view>
				</view>
				<view class="info flex-row flex-a ju-bt martb40">
					<view class="info-img">
						<image
							:src="item.goods_image"
							mode=""
						></image>
					</view>
					<view
						class="inf-title flex-a flex-col ju-bt"
					>
						<view class="title text-elpis2">
							{{ item.goods_title }}
						</view>
						<view
							class="price-box flex-row flex-a ju-bt"
						>
							<view class="price flex-row">
								<u-icon
									name="rmb"
									:bold="true"
									top="3rpx"
									color="#ff0d0e"
									size="28rpx"
								></u-icon>
								<text>
									{{ item.goods_price }}
								</text>
							</view>
							<view class="btn-stateBox">
								<view
									class="btn1 btn"
									v-if="item.status == '2'"
									@click.stop="goRouter(item)"
								>
									查看物流
								</view>
								<view
									class="btn2 btn"
									v-if="item.status == '1'"
								>
									待商家发货
								</view>
								<view
									class="btn2 btn"
									v-if="item.status == '2'"
									@click.stop="
										confirmReceiptFun(item)
									"
								>
									确认收货
								</view>
								<view
									class="btn2 btn"
									v-if="item.status == '3'"
								>
									已完成
								</view>
								<view
									class="btn2 btn"
									v-if="item.status == '0'"
									@click.stop="wxPayFun(item)"
								>
									立即支付
								</view>
							</view>
						</view>
					</view>
				</view>
				<u-line margin="40rpx 0 20rpx"></u-line>
			</view>
		</view>
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import {
	mallOrdersList,
	confirmReceipt,
	againPay
} from '@/api/mall.js';
import { wxPay } from '@/utils/util.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			tabList: [
				{
					name: '全部',
					id: ''
				},
				{
					name: '待付款',
					id: '0'
				},
				{
					name: '待发货',
					id: '1'
				},
				{
					name: '待收货',
					id: '2'
				},
				{
					name: '已完成',
					id: '3'
				}
			],
			// tabs当前选中
			tabsCurrent: 0,
			// 当前页
			current: 1,
			list: [],
			type: ''
		};
	},
	onLoad(eve) {
		// 是否是支付成功页跳转到此
		this.type = eve.type ?? '';
	},
	onShow() {
		this.list = [];
		this.current = 1;
		this.getMallOrdersList();
	},
	methods: {
		// 确认收货
		confirmReceiptFun(e) {
			confirmReceipt({
				id: e.id
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					this.list = [];
					this.current = 1;
					this.getMallOrdersList();
					// uni.navigateBack()
				}, 1500);
			});
		},
		// 微信支付
		wxPayFun(eve) {
			againPay({
				order_id: eve.id
			}).then(res => {
				wxPay(res.data, payRes => {
					setTimeout(() => {
						this.list = [];
						this.current = 1;
						this.getMallOrdersList();
					},1500)
				});
			});
		},
		// 获取商城列表
		getMallOrdersList() {
			mallOrdersList({
				page: this.current,
				list_rows: 20,
				status: this.tabList[this.tabsCurrent].id
			}).then(res => {
				this.list = [...this.list, ...res.data.data];
			});
		},
		// 查看物流
		goRouter(eve) {
			uni.navigateTo({
				url: `/pages/myCenter/pages/orderDetail/orderDetail?id=${
					eve.id
				}`
			});
		},
		// tabschange改变
		tabsChange(eve) {
			this.tabsCurrent = eve.index;
			this.list = [];
			this.current = 1;
			this.getMallOrdersList();
		}
	}
};
</script>

<style lang="scss" scoped>
.list-box {
	.li {
		.info {
			.inf-title {
				.price-box {
					.btn-stateBox {
						.btn3 {
							font-size: 32rpx;
						}
						.btn2 {
							border: 1px solid #fe5e10;
							color: #fe5e10;
						}
						.btn1 {
							border: 1px solid #999999;
							color: #202020;
						}
						.btn {
							display: inline-block;
							padding: 10rpx 20rpx;
							border-radius: 40rpx;
							font-weight: 400;
							font-size: 26rpx;
							margin-left: 10rpx;
						}
					}
					.price {
						font-weight: 600;
						color: #ff0d0e;
						font-size: 36rpx;
					}
					width: 100%;
				}
				.title {
					font-weight: 550;
					color: #202020;
					font-size: 30rpx;
					line-height: 50rpx;
				}
				width: 60%;
				height: 220rpx;
				padding: 10rpx 0;
			}
			.info-img {
				width: 35%;
				height: 220rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		.li-time {
			.state-txt1 {
				color: #fe5e10;
			}
			.state {
				font-weight: 400;
				font-size: 26rpx;
			}
			.time {
				font-weight: 300;
				color: #999999;
				font-size: 24rpx;
			}
		}
	}
	background-color: #fff;
}
</style>
