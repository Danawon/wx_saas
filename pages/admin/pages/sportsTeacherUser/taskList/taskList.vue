<template>
	<view class="wrap">
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="课程管理"></head-nav>
		<view class="page">
			<view class="" v-for="(item, index) in list" :key="index">
				<view class="swipe-action u-border-bottom">
					<view class="swipe-action__content flex-a">
						<text class="num">{{ index + 1 }}</text>
						<view class="parent-w">
							<view class="flex-a tit-box">
								<view class="title">{{ item.title }}</view>
								<view v-if="item.status == 1" class="tip btn-tip fs22">已完成</view>
								<view v-if="item.status == 1 && !item.scoretime" class="tip btn-tip noFeedback fs22 mar-l20">未点评</view>
								<view v-if="item.status == 0" class="tip unfinished-btn fs22">未完成</view>
								<view v-if="item.status == 2" class="tip btn-tip fs22">进行中</view>
							</view>
							<view class="msg text-elpis">{{ item.abstract || "" }}</view>
						</view>
						<view class="flex-a flex-col" style="margin-left: auto;" v-if="item.status==1" >
							<view class="btn mlauto"   @click="jump('/pages/admin/pages/sportsTeacherUser/vipClock/vipClock?id='+item.task_id)">查看详情</view>
						</view>
							  
						<view class="btn1 mlauto" v-if="item.status==0 || item.status== 2" @click="jump('/pages/admin/pages/sportsTeacherUser/releaseTask/releaseTask?id='+item.task_id)">发布任务</view>
					</view>
				</view>
			</view>
		</view>
	<!-- 	<view class="fot-btn padlr20 pad-t20">
			<view class="btn flex" @click="addPlan">
				新增任务
			</view>
		</view> -->
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { aerobicCoursePlan, delPlan } from "@/api/sportsTeacher.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#EF0708'
					}
				}
			],
			// 产品id
			id: "",
			list: [],
			uId: "",
			current: 1,
		};
	},
	onLoad(e) {
		this.id = e.id;
		this.uId = e.uid
	},
	onShow() {
		this.list = [];
		this.current = 1;
		this.getAerobicCoursePlan();
	},
	onReachBottom() {
		this.current ++
		this.getAerobicCoursePlan();
	},
	methods: {
		// 新增任务
		addPlan() {
			uni.navigateTo({
				url: `/pages/admin/pages/sportsTeacherUser/releaseTask/releaseTask?id=${this.id}&uId=${this.uId}&type=addTask`
			})
		},
		// 删除计划
		deletePptions(e) {
			delPlan({
				task_id: e.task_id
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.list = [];
					this.current = 1;
					this.getAerobicCoursePlan();
				}, 1000)
			})
		},
		// 获取
		getAerobicCoursePlan() {
			aerobicCoursePlan({
				id: this.id,
				list_rows: 20,
				page: this.current,
			}).then(res => {
				this.list = [...this.list, ...res.data.data];
			})
		},
		//跳转页面
		jump(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.parent-w {
		width: 60%;
	}
	.tit-box {
		.title {
			width: 75%;
		}
		.tip {
			width: 25%;
			text-align: center;
		}
	}
	.noFeedback {
		border: 1px solid #fcc524 !important;
		color: #fcc524 !important;
	}
	.fot-btn {
		.btn {
			height: 80rpx;
			border-radius: 40rpx;
			color: #fff;
			background: #fe5e10;
			font-weight: 400;
			font-size: 32rpx;
		}
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		left: 0;
		background-color: #fff;
		z-index: 99;
		padding-bottom: 40rpx;
	}
	.wrap {
		min-height: 100vh;
	}
.page {
	padding: 30rpx;
	// min-height: 100vh;
	padding-bottom: 145rpx;
	.mlauto {
		margin-left: auto;
	}
	.fs22 {
		font-size: 22rpx;
	}

	.swipe-action {
		.swipe-action__content {
			// padding: 20rpx 0 50rpx 20rpx;
			margin: 30rpx 0;
		}

		.num {
			font-size: 48rpx;
			font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.6);
			margin-right: 30rpx;
		}

		.title {
			font-size: 32rpx;
			font-weight: 600;
			color: rgba(0, 0, 0, 0.9);
			margin-right: 10rpx;
		}
		.msg {
			font-size: 26rpx;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.41);
		}

		.unfinished-btn {
			font-size: 22rpx;
			border-radius: 8rpx;
			padding: 3rpx 10rpx;
			border: 2rpx solid #999999;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
		}
		.btn-tip {
			background-color: #ffffff;
			color: #fe5e10;
			padding: 3rpx 10rpx;
			border-radius: 8rpx;
			border: 1rpx solid #fe5e10;
		}

		.btn {
			padding: 6rpx 30rpx;
			background: #fe5e10;
			border-radius: 42rpx;
			font-size: 28rpx;
			color: #ffffff;
		}

		.btn1 {
			background-color: #ffffff;
			color: #fe5e10;
			padding: 6rpx 30rpx;
			font-size: 28rpx;
			border-radius: 42rpx;
			border: 1rpx solid #fe5e10;
		}
	}
}
</style>
