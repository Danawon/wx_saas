<template>
	<view>
		<head-nav
			title="租赁记录"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="box pad20">
			<view class="li mar-t20" v-for="(item, index) in list" :key="index">
				<view class="name">
					{{ item.storeLockers.boxNo }}号柜
				</view>
				<view class="time-price flex-row flex-a ju-bt mar-t20">
					<view class="stateEndTime">
						租赁时间：{{ item.start_time_text }}
					</view>
					<view class="price flex-row flex-a">
						<u-icon name="rmb" :bold="true" top="4rpx" color="#FF0D0E" size="30rpx"></u-icon>
						<view class="pri-num">
							{{ item.total_price }}
						</view>
					</view>
				</view>
				<view class="time ">
					{{ item.validity_text }}
				</view>
				<u-line margin="40rpx 0"></u-line>
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
	import { lockerRecord } from "@/api/myCenter.js"
	export default {
		data() {
			return {
				current: 1,
				list: [], // 柜子列表
				// 门店id
				storeId: "",
			};
		},
		onLoad(eve) {
			this.storeId = eve.storeId;
			this.getLockerRecord()
		},
		onReachBottom() {
			this.current ++ 
			this.getLockerRecord();
		},
		methods: {
			// 获取柜子租赁记录
			getLockerRecord() {
				lockerRecord({
					list_rows: 20,
					page: this.current,
					store_id: this.storeId
				}).then(res => {
					this.list = [...this.list, ... res.data.data]

				})
			},
		},
	}
</script>

<style lang="scss" scoped>
.li {
	.time {
		font-weight: 300;
		color: #999999;
		font-size: 24rpx;
		margin-top: 15rpx;
	}
	.time-price {
		.price {
			.pri-num {
				font-weight: bold;
				color: #FF0D0E;
				font-size: 36rpx;
			}
		}
		.stateEndTime {
			font-weight: 400;
			color: #999999;
			font-size: 28rpx;
		}
	}
	.name {
		color: #202020;
		font-weight: 600;
		font-size: 30rpx;
	}
}
</style>
