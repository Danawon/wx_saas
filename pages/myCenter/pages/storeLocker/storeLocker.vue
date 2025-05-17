<template>
	<view class="wrap-min">
		<head-nav
			title="储物柜"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="pad20">
			<view class="list-box pad20" v-if="storeList.length">
				<view class="li " v-for="(item, index) in storeList" :key="index" @click="goRouter(item)">
					<view class="flex-row flex-a ju-bt">
						<view class="li-img">
							<u--image
								:src="item.avatar"
								width="100%"
								height="200rpx"
								mode="scaleToFill"
							></u--image>
						</view>
						<view class="li-info flex-col ju-bt">
							<view class="info-tit">
								{{ item.name }}
							</view>
							<view class="tel flex-row flex-a">
								<u-icon
									name="phone-fill"
									color="#ffa376"
									size="35rpx"
								></u-icon>
								<view class="tel-txt">
									{{ item.phone }}
								</view>
							</view>
							<view class="distance">距离{{ (item.store_distance / 1000).toFixed(2) }}公里</view>
						</view>
					</view>
					<u-line margin="40rpx 0"></u-line>
				</view>
			</view>
			<u-empty
				v-if="!storeList.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getStoreList } from "@/api/myCenter.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 门店列表
			storeList: [],
		};
	},
	onLoad() {
		this.getStoreListFun();
	},
	methods: {
		// 获取门店列表
		getStoreListFun() {
			getStoreList({
				longitude: uni.getStorageSync("longitude"),
				latitude: uni.getStorageSync("latitude")
			}).then(res => {
				this.storeList = res.data;
			})
		},
		goRouter(eve) {
			uni.navigateTo({
				url: `/pages/myCenter/pages/lockerList/lockerList?id=${eve.id}`
			})
		},
	}
};
</script>

<style lang="scss" scoped>
.li {
	.li-info {
		.info-tit {
			color: #202020;
			font-weight: 600;
			font-size: 32rpx;
		}
		width: 58%;
		height: 200rpx;
		padding: 10rpx 0;
	}
	.li-img {
		width: 38%;
	}
}
.list-box {
	width: 100%;
	border-radius: 30rpx;
	background-color: #fff;
}
</style>
