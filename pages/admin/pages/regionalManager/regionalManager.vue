<template>
	<view class="wrap-min">
		<head-nav
			title="门店列表"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<u-line></u-line>
		<view class="pad20 operation-box flex-row flex-a " v-if="type == 'manager' || type == 'finance'">
			<view
				class="operationli flex-col flex-a pad-b20"
				v-for="(item, index) in operationList"
				:key="index"
				@click="goRouter(item.url)"
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
		<view class="list-box pad20">
			<view
				class="li mar-b20 pad20 flex-row flex-a ju-bt"
				v-for="(item, index) in list"
				:key="index"
				@click="goRoute(item)"
			>
				<view class="li-img">
					<u-image
						:showLoading="true"
						:src="item.avatar"
						width="160rpx"
						height="160rpx"
						mode="scaleToFill"
					></u-image>
				</view>
				<view class="li-info flex-col  ju-bt">
					<view class="name">
						{{ item.name }}
					</view>
					<view class="txt ">门店电话:{{ item.phone }}</view>
					<view class=" text-elpis txt">
						{{ item.province_name }}
						{{ item.city_name }}
						{{ item.area_name }}
						{{ item.address }}
					</view>
				</view>
				<view class="li-icon">
					<u-image
						:showLoading="true"
						:src="baseUrl + 'li1.png'"
						width="45rpx"
						height="45rpx"
						mode="scaleToFill"
					></u-image>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { managerStoreSelect, ifExistRole } from "@/api/admin.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			list: [],
			type: "", // 父级页面类型
			// 操作列表
			operationList: [],
		};
	},
	onLoad(eve) {
		this.type = eve.type ?? ""
		if(this.type == 'manager') {
			this.operationList = [
				{
					tit: '分区财务管理',
					icon: `${baseUrl}managerIcon3.png`,
					id: 1,
					url: '/pages/admin/pages/financeList/financeList?type=1'
				},
				{
					tit: '投资人管理',
					icon: `${baseUrl}managerIcon7.png`,
					id: 2,
					url: '/pages/admin/pages/financeList/financeList?type=2'
				},
				{
					tit: '用户查询',
					icon: `${baseUrl}searchUser.png`,
					id: 3,
					url: '/pages/admin/pages/searchUser/searchUser?type=potential'
				},
				{
					tit: '医生管理',
					icon: `${baseUrl}searchUser.png`,
					id: 4,
					url: '/pages/admin/pages/financeList/financeList?type=4'
				},
			]
		}else {
			this.operationList = [
				{
					tit: '销售收入统计',
					icon: `${baseUrl}managerIcon3.png`,
					url: '/pages/admin/pages/finance/courseIncome/courseIncome'
				},
				{
					icon: baseUrl + 'cancelClassesIcon.png',
					tit: '会员卡消课记录',
					url: `/pages/admin/pages/vipClassRecord/vipClassRecord`
				},
				{
					tit: '用户查询',
					icon: `${baseUrl}searchUser.png`,
					url: '/pages/admin/pages/searchUser/searchUser?type=potential'
				},
			]
		}
		this.getManagerStoreSelect();
	},
	methods: {
		goRouter(url) {
			let routeUrl = url;
			uni.navigateTo({
				url: routeUrl
			})
		},
		// 获取分区经理选择门店列表
		getManagerStoreSelect() {
			managerStoreSelect().then(res => {
				this.list= res.data;
			})
		},
		filterRole(eve) {
			let roleArr = [
				{
					type: 'store',
					url: '/pages/admin/pages/manager/manager'
				},
				{
					type: 'coach',
					url: '/pages/admin/pages/coach/index/index'
				},
				{
					type: 'finance',
					url: `/pages/admin/pages/finance/finance?storeInfo=${JSON.stringify(eve)}`
				},
				{
					type: 'sale',
					url: `/pages/admin/pages/Sales/index/index`
				},
				{
					type: 'manager',
					url: `/pages/admin/pages/regionalManagerOperation/regionalManagerOperation?storeInfo=${JSON.stringify(eve)}`
				},
				{
					type: 'doctor',
					url: `/pages/doctor/index/index`
				},
			]
			let url = '';
			roleArr.map(item => {
				if(item.type == this.type) {
					url = item.url
				}
			})
			uni.navigateTo({
				url: url
			})
		},
		goRoute(eve) {
			ifExistRole({
				role_id: this.type == "store" ? "shopowner" : this.type,
				store_id: eve.id
			}).then(res => {
				if(res.data.jurisdiction == "1") {
					uni.setStorageSync('role', res.data.role);
					uni.setStorageSync(
						'relation_id',
						res.data.relation_id
					);
					this.filterRole(eve);
				}
			})
		}
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
	}
	flex-wrap: wrap;
	background-color: #fff;
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
			width: 65%;
			height: 130rpx;
		}
		.li-icon {
			width: 8%;
		}
		.li-img {
			width: 25%;
		}
		background-color: #fff;
		border-radius: 20rpx;
	}
}
</style>
