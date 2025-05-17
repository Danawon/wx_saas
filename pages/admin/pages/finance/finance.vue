<template>
	<view class="">
		<head-nav
			title="分区财务"
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
					<view class="txt ">门店电话:{{ storeInfo.phone || '' }}</view>
					<view class=" text-elpis txt">
						{{ storeInfo.province_name || '' }}
						{{ storeInfo.city_name || '' }}
						{{ storeInfo.area_name || '' }}
						{{ storeInfo.address || ''}}
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
					id: 1
				},
				{
					tit: '优惠卷发放',
					icon: `${baseUrl}couponGrant.png`,
					id:2
				},
				{
					tit: '优惠卷查询',
					icon: `${baseUrl}inquireCoupon.png`,
					id: 3
				},
				{
					tit: '用户约课记录',
					icon: `${baseUrl}appointmentRecord.png`,
					id: 4
				},
				{
					tit: '会员卡管理',
					icon: `${baseUrl}clubCardAdmin.png`,
					id: 5
				},
			],
			// 门店信息
			storeInfo: {},
		};
	},
	onLoad(eve) {
		this.storeInfo = JSON.parse(eve.storeInfo);
	},
	methods: {
		goRouter(eve) {
			let url = "";
			if(eve.id == 1) {
				url = `/pages/admin/pages/searchUser/searchUser?type=store&storeId=${this.storeInfo.id}`
			}else if(eve.id == 2) {
				url = `/pages/admin/pages/selectUser/selectUser?type=store&storeId=${this.storeInfo.id}`
			}else if(eve.id == 3) {
				url = "/pages/admin/pages/couponRecord/couponRecord"
			}else if(eve.id == 4) {
				url = "/pages/admin/pages/adoutClass/adoutClass"
			}else if(eve.id == 5) {
				url= `/pages/admin/pages/vipInfo/vipInfo?role=finance&storeId=${this.storeInfo.id}`
			}
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
