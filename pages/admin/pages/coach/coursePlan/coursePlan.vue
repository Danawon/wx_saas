<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="查看训练计划模板"
		></head-nav>
		<view class="page pad20">
			<view class="" v-if="trainingList.length">
				<view
					class="box flex-a ju-bt mar-lr20 mar-t20 pad20"
					v-for="(item, index) in trainingList"
					:key="index"
					@click="onCurrent(item)"
				>
					<view class="box-left">
						<view class="name pad-b20">
							{{ item.title }}
						</view>
						<view class="gray">
							共计{{ item.unifiedcount.count }}节课程
						</view>
						<view class="gray">
							已完成{{ item.unifiedcount.status1 }}节，还剩{{ item.unifiedcount.status0 }}节
						</view>
					</view>
					<view class="box-btn flex-row flex-a">
						<u-icon
							name="arrow-right"
							color="#333"
							size="30rpx"
							space="10rpx"
						></u-icon>
					</view>
				</view>
			</view>
			<u-empty
				v-if="!trainingList.length"
				mode="list"
				text="暂无当前该用户训练计划..."
			></u-empty>
			
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { trainingPlanTemplate, setPlan, cencelPlan } from '@/api/admin.js';
export default {
	data() {
		return {
			orderId: '', // 训练计划id
			trainingList: {}, // 当前训练计划列表
			othreTrainingList: [] ,// 其他训练计划列表
			uid: ""
		};
	},
	onLoad(e) {
		this.uid = e.uid;
		this.orderId = e.orderId;
	},
	onShow() {
		this.getTrainingPlanTemplate();
	},
	methods: {
		/* 选中当前训练计划 */
		onCurrent(e) {
			uni.navigateTo({
				url: `/pages/myCenter/pages/trainingDetail/trainingDetail?id=${e.id}&type=coachRole&orderId=${this.orderId}`
			})
		},
		// 取消训练计划
		cancelPlanFun(e) {
			cencelPlan({
				id: e.id
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.getTrainingPlanTemplate();
				}, 1000)
			})
		},
		// 设置计划
		setPlanFun(item) {
			setPlan({
				uid: this.uid,
				id: item.id
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.getTrainingPlanTemplate();
				}, 1000)
			})
		},
		// 获取训练计划模板
		getTrainingPlanTemplate() {
			trainingPlanTemplate({
				order_id: this.orderId,
				uid: this.uid
			}).then(res => {
				this.trainingList = res.data.usertraining
				this.othreTrainingList = res.data.usertrainingnot;
			});
		},
	}
};
</script>

<style lang="scss" >
.page {
	background-color: #f9f9f9;
	min-height: 95vh;

	.box {
		background-color: #fff;
		border-radius: 24rpx;
		line-height: 35rpx;

		.name {
			font-size: 30rpx;
		}
		.gray {
			color: rgba(0, 0, 0, 0.6);
			font-size: 22rpx;
			margin-bottom: 16rpx;
		}
		.box-btn {
			font-size: 24rpx;
			.edit {
				padding: 0 30rpx;
				height: 45rpx;
				border-radius: 42rpx;
				color: #fe5e10;
				border: 1rpx solid #fe5e10;
			}
		}
	}
}
</style>
