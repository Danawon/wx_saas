<template>
	<view class="wrap-min">
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="训练计划模板"
		></head-nav>
		<view class=" pad20">
			<u-button @click="templateShow = true" type="primary" icon="plus"  color="#fe5e10" text="添加训练计划模板"></u-button>
			<view class="mar-t20" v-if="trainingList.length">
				<view
					class="box flex-a ju-bt mar-lr20 mar-t20 pad20"
					v-for="(item, index) in trainingList"
					:key="index"
					@click.stop="editCurrent(item)"
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
						<view v-if="item.is_cancel" class="cancel flex mar-r20" @click.stop="cancelPlanFun(item)">取消计划</view>
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
		
		<u-picker
			title="选择训练计划模板"
			:show="templateShow" 
			:columns="templateList" 
			@confirm="selectTemplate"
			@close="templateShow = false"
			@cancel="templateShow = false"
			keyName="title"
			:closeOnClickOverlay="true"
		></u-picker>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { trainingPlanTemplate, setPlan, cencelPlan } from '@/api/admin.js';
export default {
	data() {
		return {
			orderId: '', // 训练计划id
			trainingList: [], // 当前训练计划列表
			templateList: [] ,// 其他训练计划列表
			uid: "",
			templateShow: false, // 模板show
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
		/* 选中模板 */
		selectTemplate(e) {
			this.templateShow = false;
			this.setPlanFun(e.value[0].id);
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
		setPlanFun(id) {
			setPlan({
				uid: this.uid,
				id: id
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
				this.templateList = [res.data.usertrainingnot];
			});
		},
		editCurrent(e) {
			uni.navigateTo({
				url:
					`/pages/admin/pages/coach/trainingPlanEdit/trainingPlanEdit?id=${e.id}&uid=${this.uid}&orderId=${this.orderId}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	/deep/ .u-button__text {
		margin-left: 20rpx;
	}

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
		.cancel {
			padding: 0 30rpx;
			height: 45rpx;
			border-radius: 42rpx;
			color: rgba(0, 0, 0, 0.4);
			border: 1rpx solid rgba(0, 0, 0, 0.4);
		}
	}
}

</style>
