<template>
	<view>
		<!-- 教练 -->
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
			<!-- 头部 -->
			<view
				class="page-top"
				@click="
					jump(
						'/pages/admin/pages/coach/coachInfo/coachInfo'
					)
				"
			>
				<view class="img-box">
					<u--image
						:src="coachInfo.avatar"
						width="96rpx"
						height="96rpx"
						shape="circle"
					></u--image>
				</view>
				<text class="head-txt">
					{{ coachInfo.name || '' }}
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
					v-for="(item, index) in setList"
					@click="jump(item.url)"
					:key="index"
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
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { coachInfo } from '@/api/admin.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			//系统设置
			setList: [
				{
					image: baseUrl + 'applyStore.png',
					name: '申请店面',
					url:
						'/pages/admin/pages/Sales/shop/shop?type=coach'
				},
				{
					image: baseUrl + 'releasePeriod.png',
					name: '私教时段发布',
					url:
						'/pages/admin/pages/coach/periodTime/periodTime'
				},
				{
					image: baseUrl + 'groupCourseRelease.png',
					name: '团课发布管理',
					url:
						'/pages/admin/pages/coach/groupClass/groupClass'
				},
				{
					image: baseUrl + 'appointmentRecordCoach.png',
					name: '约课订单管理',
					url:
						'/pages/admin/pages/coach/classOrder/classOrder'
				},
				{
					image: baseUrl + 'myStudent.png',
					name: '我的学员',
					url:
						'/pages/admin/pages/searchUser/searchUser?type=coach'
				},
				{
					image: baseUrl + 'potentialMember.png',
					name: '潜在会员查询',
					url:
						'/pages/admin/pages/searchUser/searchUser?type=potential'
				},
				{
					image: baseUrl + 'performance.png',
					name: '教练月销售记录',
					url:
						'/pages/admin/pages/salesStatistics/salesStatistics'
				},	
				{
					image: baseUrl + 'monitoringSystem.png',
					name: '运动强度监控',
					url:
						'/pages/admin/pages/heartRateDetection/heartRateDetection'
				},
			],
			// 信息
			coachInfo: {}
		};
	},
	onLoad() {
	},
	onShow() {
		this.getCoachInfo();
	},
	methods: {
		// 获取教练信息
		getCoachInfo() {
			coachInfo().then(res => {
				this.coachInfo = res.data;
			});
		},
		//跳转页面
		jump(url) {
			uni.navigateTo({
				url: `${url}?id=${this.coachInfo.id}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
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
.service-set {
	border-bottom: 1rpx solid #e7e7e7;

	.setRight {
		margin-left: auto;
	}
}
</style>
