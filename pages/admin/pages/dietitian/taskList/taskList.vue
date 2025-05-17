<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="课程管理"
		></head-nav>
		<view class="page">
			<view
				class="swipe-action u-border-bottom"
				v-for="(item, index) in list"
				:key="index"
			>
				<view class="swipe-action__content pad20 flex-a">
					<text class="num">{{ index + 1 }}</text>
					<view class="">
						<view class="flex-a">
							<text class="title">
								{{ item.title }}
							</text>

							<text v-if="item.status == 1" class="tip btn-tip fs22">已完成</text>
							<text v-if="item.status == 1 && !item.scoretime" class="tip btn-tip noFeedback fs22 mar-l20">未点评</text>
							<text v-if="item.status == 0" class="tip unfinished-btn fs22">未完成</text>
							<text v-if="item.status == 2" class="tip btn-tip fs22">进行中</text>
						</view>
						<view class="msg text-elpis">
							{{ item.abstract || '' }}
						</view>
					</view>
					<view
						class="flex-a flex-col"
						style="margin-left: auto;"
						v-if="item.status == 1"
					>
						<view
							class="btn mlauto"
							@click="
								jump(
									'/pages/admin/pages/dietitian/vipClock/vipClock?id=' +
										item.task_id
								)
							"
						>
							查看详情
						</view>
					</view>
					
					<view
						class="flex-a flex-col"
						style="margin-left: auto;"
						v-if="item.status != 1"
					>
						<view
							class="btn1 mlauto"
							@click="
								jump(
									'/pages/admin/pages/dietitian/releaseTaskList/releaseTaskList?id=' +
										item.task_id
								)
							"
						>
							发布任务
						</view>
						<view
							class="btn1 mlauto mar-t40"
							
							@click="editTit(item)"
						>
							编辑标题
						</view>
					</view>
					
				</view>
			</view>
		</view>
		
		
		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalState"
			title="标题"
			confirmText="保存"
			cancelText="取消"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentConfirm="modalConfirm"
			@parentCancel="modalState = false"
		>
			<view class="modalTxt pad-b40 flex">
				<u-input
					placeholder="请输入"
					border="surround"
					v-model="titleVal"
				></u-input>
			</view>
		</modal-tips>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { tasklist, editTaskTit } from '@/api/dietician.js';
import modalTips from '@/components/modalTips/modalTips.vue';
export default {
	components: {
		modalTips
	},
	data() {
		return {
			baseUrl: baseUrl,
			orderId: '', //订单ID
			list: [], //任务列表数据
			current: 1,
			/* 课程标题 */
			titleVal: "",
			/* modalshow */
			modalState: false,
			/* 选中id */
			selectId: "",
		};
	},
	onLoad(op) {
		this.orderId = op.id;
	},
	onShow() {
		this.current = 1;
		this.list = [];
		this.init();
	},
	onReachBottom() {
		this.current++;
		this.init();
	},
	methods: {
		/* 点击modal确定 */
		modalConfirm() {
			if(!this.titleVal) {
				uni.showToast({
					title: "请输入标题后保存！",
					icon: "none"
				})
				return
			}
			this.modalState = false;
			editTaskTit({
				id: this.selectId,
				title: this.titleVal
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.current = 1;
					this.list = [];
					this.init();
				},1500)
			})
		},
		/* 编辑标题 */
		editTit(e) {
			this.modalState = true;
			this.titleVal = e.title;
			this.selectId = e.task_id;
		},
		//跳转页面
		jump(url) {
			uni.navigateTo({
				url: url
			});
		},
		init() {
			tasklist({
				id: this.orderId,
				list_rows: 20,
				page: this.current
			}).then(res => {
				this.list = [...this.list, ...res.data.data];
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.noFeedback {
	border: 1px solid #fcc524 !important;
	color: #fcc524 !important;
}
.fs22 {
	font-size: 22rpx;
}
.page {
	.mlauto {
		margin-left: auto;
	}
	.fs22 {
		font-size: 22rpx;
	}
	.swipe-action {
		.num {
			font-size: 48rpx;
			font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.6);
			margin-right: 56rpx;
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
