<template>
	<view>
		<head-nav
			title="交易记录"
			bgColor="#fff"
			:goBack="!type"
			:goIndex="type"
		></head-nav>
		<view class="list-box pad20 ">
			<view class="li mar-t40" v-for="(item, index) in recordList" :key="index">
				<view class="li-tit">
					{{ item.memo }}
				</view>
				<view class="li-payInfo flex-row ju-bt martb20">
					<view class="info-name">
						{{ item.paytypetext }}
					</view>
					<view class="inof-num">
						￥{{ item.money }}
					</view>
				</view>
				<view class="li-time">
					{{ item.createtime }}
				</view>
				<u-line margin="20rpx 0"></u-line>
			</view>
		</view>
	</view>
</template>

<script>
	import { getTransactionRecord } from "@/api/myCenter.js"
	export default {
		data() {
			return {
				type: "",
				// 当前页
				current: 1,
				recordList: [], //记录
			};
		},
		onLoad(eve) {
			this.type = eve.type ?? ""
			this.getTransactionRecordFun();
		},
		onReachBottom() {
			this.current ++;
			this.getTransactionRecordFun();
		},
		methods: {
			getTransactionRecordFun() {
				getTransactionRecord({
					list_rows: 20,
					page: this.current
				}).then(res => {
					this.recordList = [...this.recordList, ...res.data.data]
				})
			},
		}
		
	}
</script>

<style lang="scss">
.list-box {
	.li {
		.li-time {
			color: #999999;
			font-size: 26rpx;
		}
		.li-payInfo {
			.inof-num {
				font-weight: bold;
				color: #FF0D0E;
				font-size: 36rpx;
			}
			.info-name {
				font-weight: 400;
				color: #999999;
				font-size: 28rpx;
			}
		}
		.li-tit {
			font-weight: 600;
			font-size: 32rpx;
			color: #202020;
		}
	}
}
</style>
