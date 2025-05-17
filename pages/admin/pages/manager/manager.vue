<template>
	<view>
		<view class="page">
			<img
				:src="baseUrl + 'manager/topBg.png'"
				class="img-bg"
			/>
			<head-nav
				bgColor="rgba(0,0,0,0)"
				:goBack="true"
				titColor="#fff"
				title=" "
			></head-nav>
			<view style="position: relative;">
				
				<view
					class="page-top"
					@click="
						jump(
							'/pages/admin/pages/alterUser/alterUser'
						)
					"
				>
					<view class="img-box">
						<u--image
							:src="storeInfo.avatar"
							width="96rpx"
							height="96rpx"
							shape="circle"
						></u--image>
					</view>
					<text class="head-txt">
						{{ storeInfo.name || '' }}
					</text>
					<view class="icon-right">
						<u-icon
							name="arrow-right"
							color="#fff"
							size="40rpx"
						></u-icon>
					</view>
				</view>
				
				<view class="page-center flex-row">
					<view
						class="center-box flex flex-col pad-t40 pad-b20"
						v-for="(item, index) in centerList"
						@click="jump(item.url)"
						:key="index"
						v-if="item.state"
					>
						<u--image
							:src="item.image"
							width="66rpx"
							height="66rpx"
						></u--image>
						<text class="pad-t20">
							{{ item.name }}
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { storeInfo } from '@/api/admin.js';
import { ifJurisdictionJurisdiction } from '@/api/storeApis.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 门店id
			storeId: {},
			//中间菜单栏数据
			centerList: [
				{
					image: baseUrl + 'couponGrant.png',
					name: '优惠券发放',
					url:
						'/pages/admin/pages/selectUser/selectUser',
					state: true
				},
				{
					image: baseUrl + 'inquireCoupon.png',
					name: '优惠券记录',
					url:
						'/pages/admin/pages/couponRecord/couponRecord',
					state: true
				},
				{
					image: baseUrl + 'materialAmend.png',
					name: '门店会员',
					url:
						'/pages/admin/pages/searchUser/searchUser',
					state: true
				},
				{
					image: baseUrl + 'potentialMember.png',
					name: '潜在会员',
					url:
						'/pages/admin/pages/searchUser/searchUser?type=potential',
					state: true
				},
				{
					image: baseUrl + 'storeIncomeIco.png',
					name: '门店收入',
					url:
						'/pages/admin/pages/incomeRecord/incomeRecord',
					state: true
				},
				{
					image: baseUrl + 'coachAudit.png',
					name: '门店教练审核',
					url:
						'/pages/admin/pages/storeManager/storeManager',
					state: true
				},
				{
					image: baseUrl + 'customerManagerAudit.png',
					name: '销售顾问审核',
					url:
						'/pages/admin/pages/salesManager/salesManager',
					state: true
				},
				{
					image: baseUrl + 'clubCardBuy.png',
					name: '会员卡购买记录',
					url:
						'/pages/admin/pages/coachSales/coachSales',
					state: true
				},
				{
					image: baseUrl + 'appointmentRecord.png',
					name: '约课记录',
					url:
						'/pages/admin/pages/adoutClass/adoutClass',
					state: true
				},
				{
					image: baseUrl + 'clubCardIcon.png',
					name: '发布会员卡',
					url:
						'/pages/admin/pages/vipManagement/vipManagement',
					state: true
				},
				{
					image: baseUrl + 'clubCardAdmin.png',
					name: '会员卡管理',
					url: '/pages/admin/pages/vipInfo/vipInfo',
					state: true
				},
				{
					image: baseUrl + 'templateAdmin.png',
					name: '团课模板管理',
					url:
						'/pages/admin/pages/groupClassTpl/groupClassTpl',
					state: true
				},
				{
					image: baseUrl + 'groupCourseRelease.png',
					name: '教练资料设置',
					url:
						'/pages/admin/pages/storeManagerInfo/storeManagerInfo',
					state: true
				},
				{
					image: baseUrl + 'studyHallAdmin.png',
					name: '自习课管理',
					url: '/pages/admin/pages/selfStudy/selfStudy',
					state: true
				},
				{
					image: baseUrl + 'coachStatistics.png',
					name: '教练月销售统计',
					url:
						'/pages/admin/pages/salesStatistics/salesStatistics',
					state: true
				},
				{
					image: baseUrl + 'lockerIcon.png',
					name: '门店储物柜设置',
					url: `/pages/admin/pages/lockerDeviceList/lockerDeviceList`,
					state: true
				},
				{
					image: baseUrl + 'lamplightIcon.png',
					name: '灯光控制设置',
					url:
						'/pages/admin/pages/lightControl/lightControl',
					state: true
				},
				{
					image: baseUrl + 'HolidaysSet.png',
					name: '节假日管理',
					url:
						'/pages/admin/pages/holidayAdd/holidayAdd',
					state: true
				},
				{
					image: baseUrl + 'cancelClassesIcon.png',
					name: '会员卡消课记录',
					url:
						'/pages/admin/pages/vipClassRecord/vipClassRecord',
					state: true
				},
				{
					image: baseUrl + 'entrance.png',
					name: '门禁授权管理',
					url:
						'/pages/admin/pages/entranceAuthorize/entranceAuthorize',
					state: true
				},
				{
					image: baseUrl + 'NFC.png',
					name: 'NFC绑定管理',
					url:
						'/pages/admin/pages/nfcBinding/nfcBinding',
					state: true
				}
			],
			// 门店信息
			storeInfo: {}
		};
	},
	onLoad() {
		this.getifJurisdictionJurisdiction();
	},
	onShow() {
		this.getStoreInfo();
	},
	methods: {
		// 获取优惠卷权限
		getifJurisdictionJurisdiction() {
			ifJurisdictionJurisdiction().then(res => {
				this.centerList[0].state = Boolean(
					res.data.coupon_permission
				);
			});
		},
		// 获取门店信息
		getStoreInfo() {
			storeInfo().then(res => {
				this.storeInfo = res.data;
				this.storeId = this.storeInfo.id;
			});
		},
		//跳转页面
		jump(url) {
			uni.navigateTo({
				url: url + `?storeId=${this.storeId}&type=store`
			});
		}
	}
};
</script>

<style lang="scss">
.page {
	

	.img-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 352rpx;
	}

	.page-top {
		width: 100%;
		padding: 38rpx 34rpx 50rpx 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;

		.head-txt {
			font-size: 36rpx;
			font-family: PingFang SC-Semibold, PingFang SC;
			font-weight: 600;
			color: #ffffff;
			margin-left: 32rpx;
		}

		.icon-right {
			margin-left: auto;
		}
	}

	.page-center {
		flex-wrap: wrap;

		.center-box {
			width: 25%;
			font-size: 24rpx;

			.image-center {
				height: 66rpx;
				width: 66rpx;
			}
		}
	}
}
</style>
