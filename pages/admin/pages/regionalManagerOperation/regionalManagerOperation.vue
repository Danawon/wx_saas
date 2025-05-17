<template>
	<view class="">
		<head-nav
			title="区域经理操作"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<u-line></u-line>
		<view class="list-box pad20">
			<view class="li mar-b20 pad20 flex-row flex-a ju-bt">
				<view class="li-img">
					<u-image
						:showLoading="true"
						:src="storeInfo.avatar"
						width="160rpx"
						height="160rpx"
						mode="scaleToFill"
					></u-image>
				</view>
				<view class="li-info flex-col  ju-bt">
					<view class="name">
						{{ storeInfo.name || '' }}
					</view>
					<view class="txt ">门店电话:{{ storeInfo.phone || ''}}</view>
					<view class=" text-elpis txt">
						{{ storeInfo.province_name || '' }}
						{{ storeInfo.city_name || '' }}
						{{ storeInfo.area_name || '' }}
						{{ storeInfo.address || '' }}
					</view>
				</view>
			</view>
		</view>
		<view class="pad20 operation-box flex-row flex-a ">
			<view
				class="operationli flex-col flex-a "
				v-for="(item, index) in operationList"
				:key="index"
				@click="goRouter(item)"
			>
				<view class="li-icon">
					<u-image
						:showLoading="true"
						:src="item.icon"
						width="70rpx"
						height="70rpx"
						mode="scaleToFill"
					></u-image>
				</view>
				<view class="li-tit mar-t20">
					{{ item.tit }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 操作列表
			operationList: [
				{
					tit: '用户查询',
					icon: `${baseUrl}searchUser.png`,
					id: 1,
				},
				{
					tit: '店长管理',
					icon: `${baseUrl}managerIcon2.png`,
					id: 2,
				},
				{
					tit: '客户健康数据对比',
					icon: `${baseUrl}managerIcon5.png`,
					id: 3,
				},
				{
					tit: '产品审核',
					icon: `${baseUrl}auditIcon.png`,
					id: 4,
				},
				{
					tit: '运动强度监控',
					icon: `${baseUrl}monitoringSystem.png`,
					id: 5,
				},
				
			],
			// 门店信息
			storeInfo: {},
			urlList: []
		};
	},
	onLoad(eve) {
		this.storeInfo = JSON.parse(eve.storeInfo);
		this.urlList = [
				{
					id: 1,
					url: `/pages/admin/pages/searchUser/searchUser?type=store&storeId=${this.storeInfo.id}`
				},
				{
					id: 2,
					url: `/pages/admin/pages/financeList/financeList?type=3&storeId=${this.storeInfo.id}`
				},
				{
					id: 3,
					url: `/pages/admin/pages/selectUserHealth/selectUserHealth?storeId=${this.storeInfo.id}`
				},
				{
					id: 4,
					url: `/pages/admin/pages/productAudit/productAudit`
				},
				{
					id: 5,
					url: `/pages/admin/pages/heartRateDetection/heartRateDetection`
				},
			]
	},
	methods: {
		goRouter(eve) {
			let url = "";
			this.urlList.forEach(item => {
				if(eve.id == item.id) {
					url = item.url
				}
			})
			uni.navigateTo({
				url: url
			})
		},
	}
};
</script>

<style lang="scss" scoped>
.operation-box {
	.operationli {
		.li-tit {
			font-weight: 500;
			color: rgba(0, 0, 0, 0.4);
			font-size: 24rpx;
		}
		width: 33.33%;
		margin-bottom: 70rpx;
	}
	flex-wrap: wrap;
}
.list-box {
	.li {
		.li-info {
			.txt {
				font-weight: 500;
				color: rgba(0, 0, 0, 0.6);
				font-size: 24rpx;
			}
			.name {
				font-weight: 400;
				color: rgba(0, 0, 0, 0.9);
				font-size: 32rpx;
			}
			width: 73%;
			height: 130rpx;
		}
		.li-img {
			width: 25%;
		}
		box-shadow: 0 0 15rpx 9rpx #eee;
		background-color: #fff;
		border-radius: 20rpx;
	}
}
</style>
