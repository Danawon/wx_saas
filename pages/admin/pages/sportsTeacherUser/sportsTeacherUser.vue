<template>
	<view>
		<!-- 教练 -->
		<view class="page">
			<img :src="baseUrl + 'manager/topBg.png'" class="img-bg" />
			<head-nav bgColor="rgba(0,0,0,0)" :goBack="true" titColor="#fff" title=" "></head-nav>
			<view style="position: relative;">
				<!-- 头部 -->
				<view class="page-top" @click="jump('/pages/admin/pages/sportsTeacherUser/info/info')">
					<view class="img-box"><u--image :src="infoData.avatar" width="96rpx" height="96rpx" shape="circle"></u--image></view>
					<text class="head-txt">{{ infoData.name }}</text>
					<view class="icon-right"><u-icon name="arrow-right" color="#fff" size="40rpx"></u-icon></view>
				</view>

				<view
					class="balance-box flex-a ju-bt"
					:style="{
						background: 'url(' + baseUrl + 'pay1.png)',
						'background-size': '100% 100%'
					}"
				>
					<view class="flex-col">
						<view class="msg">提现金额</view>
						<view>
							<text class="price">{{ infoData.money }}</text>
							元
						</view>
					</view>
					<view class="btn flex" @click="withdrawDeposit(infoData.money)">提现</view>
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
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { sportsTeacherInfo } from "@/api/sportsTeacher.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			//系统设置
			setList: [
				{
					image: baseUrl + 'myIncome.png',
					name: '我的收入',
					url: '/pages/admin/pages/sportsTeacherUser/income/income'
				},
				{
					image: baseUrl + 'withdrawRecord.png',
					name: '提现申请记录',
					url: '/pages/admin/pages/sportsTeacherUser/withdrawRecord/withdrawRecord'
				},
				{
					image: baseUrl + 'releasePeriod.png',
					name: '居家时段发布',
					url: '/pages/admin/pages/coach/periodTime/periodTime'
				},
				{
					image: baseUrl + 'punchCardAdmin.png',
					name: '课程打卡管理',
					url: `/pages/admin/pages/sportsTeacherUser/courseManagement/courseManagement`
				},
				{
					image: baseUrl + 'appointmentRecordCoach.png',
					name: '学员约课管理',
					url: '/pages/admin/pages/sportsTeacherUser/classOrder/classOrder'
				},
				{
					image: baseUrl + 'myStudent.png',
					name: '我的学员',
					url: '/pages/admin/pages/searchUser/searchUser?type=sporty'
				},
				{
					image: baseUrl + 'potentialMember.png',
					name: '潜在会员查询',
					url:
						'/pages/admin/pages/searchUser/searchUser?type=potential'
				},
				{
					image: baseUrl + 'monitoringSystem.png',
					name: '运动强度监控',
					url:
						'/pages/admin/pages/heartRateDetection/heartRateDetection'
				},
			],
			// 信息
			infoData: {},
		};
	},
	onLoad() {
	},
	onShow() {
		this.getSportsTeacherInfo();
	},
	methods: {
		// 提现金额
		withdrawDeposit(e) {
			uni.navigateTo({
				url: `/pages/admin/pages/sportsTeacherUser/withdrawal/withdrawal?balance=${e}`
			})
		},
		// 获取信息
		getSportsTeacherInfo() {
			sportsTeacherInfo().then(res => {
				this.infoData = res.data
			})
		},
		//跳转页面
		jump(url) { 
			uni.navigateTo({
				url: `${url}?id=${this.infoData.id}`
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
.page {
	// background-color: #FF925D;

	.img-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 352rpx;
	}

	.balance-box {
		height: 230rpx;
		margin: 20rpx 26rpx 0rpx;
		background-size: 100% 100%;
		background-position: center;
		color: #fff;

		.msg {
			font-size: 32rpx;
			margin: 32rpx 0 10rpx 46rpx;
		}
		.price {
			font-weight: bold;
			font-size: 64rpx;
			margin-left: 46rpx;
		}
		.btn {
			width: 124rpx;
			height: 46rpx;

			font-size: 28rpx;
			border-radius: 56rpx;
			background: linear-gradient(#fde5a5, #f9e29f, #dcbc73);
			margin-right: 46rpx;
		}
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

	.pad-t80 {
		padding-top: 80rpx;
	}
}
</style>
