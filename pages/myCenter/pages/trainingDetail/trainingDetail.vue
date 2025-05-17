<template>
	<view>
		<head-nav
			title="训练详情"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="list-tit " v-for="(titItem, itiIndex) in detailData.list" :key="itiIndex">
			<view class="tit-txt pad20">
				{{ titItem.title }}
			</view>
			<view class="list-lable  " v-for="(labItem, labIndex) in titItem.children" :key="labIndex">
				<view class="lable-txt padtb20 pad-r20">
					{{ labItem.title }}
				</view>
				<view class="list pad20 ">
					<view
						class="li mar-t20  flex-row flex-a ju-bt"
						v-for="(item, index) in labItem.children"
						:key="index"
						@click="goRoute(item)"
					>
						<view class="li-info flex-col ju-bt">
							<view class="info-tit">
								{{ item.title }}
							</view>
							<view class="info-coach mar-t20">
								教练： {{ detailData.coach_name }}
							</view>
							<view class="info-time">
								{{ item.createtime }}
							</view>
						</view>
						<view class="li-stateBtn flex-col flex-a ju-ar">
							<view
								class="btn btn3 flex"
								v-if="item.status == 1"
							>
								已完成
							</view>
							<view
								class="btn btn1 flex"
								v-if="item.status == 2"
							>
								已预约
							</view>
							<view
								class="btn btn1 flex"
								v-if="item.status == 3"
							>
								进行中
							</view>
							<view
								class="btn btn4 flex"
								v-if="item.status == 0"
							>
								未完成
							</view>
							<view
								class="btn btn2 flex"
								v-if="item.feedback"
							>
								已回复
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		
		<u-empty
			v-if="
				!detailData.list.length
			"
			mode="list"
			text="暂无数据..."
		></u-empty>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { trainingProgramDetail, getPlanState } from '@/api/myCenter.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 当前选中的标题
			selectTitIndex: 0,
			// 当前选中计划
			selectPlan: 0,
			// 当前选中的 li
			selectLi: 0,
			// 计划id
			trainingId: '',
			// 计划详情数据
			detailData: {},
			/* 是否是教练角色 进去此页面 */
			roleType: "",
			orderId: "", // 订单id
		};
	},
	onLoad(eve) {
		/* 有参数代表教练进入当前页面 */
		this.roleType = eve.type;
		this.trainingId = eve.id;
		/* orderid不存在 代表用户端 点击训练计划进入 */
		this.orderId = eve.orderId;
	},
	onShow() {
		this.getTrainingProgramDetail();
	},
	methods: {
		// 计划change
		selectPlanChange(index) {
			this.selectPlan = index;
		},
		// 标题change
		changeTit(index) {
			this.selectTitIndex = index;
		},
		// 获取计划详情
		getTrainingProgramDetail() {
			let _this = this;
			trainingProgramDetail({
				training_id: this.trainingId,
				order_id: this.orderId
			}).then(res => {
				_this.detailData = res.data;
			});
		},
		// 跳转
		goRoute(eve) {
			/* roleType 存在 代表是教练身份进入此页面 无条件跳转计划详情 */
			if(this.roleType) {
				if(eve.status == 1) {
					uni.navigateTo({
						url: `/pages/myCenter/pages/trainingDetailEquipment/trainingDetailEquipment?courseId=${eve.id}&roleType=other`
					});
				}else {
					uni.navigateTo({
						url:
							`/pages/myCenter/pages/trainingDetailEquipment/trainingDetailEquipment?courseId=${eve.id}&coachRole=coachRole`
					});
				}
				
			}else {
				getPlanState({
					id: eve.id
				}).then(res => {
					if(res.data.result) {
						uni.navigateTo({
							url:
								`/pages/myCenter/pages/trainingDetailEquipment/trainingDetailEquipment?courseId=${eve.id}`
						});
					}else {
						uni.showToast({
							title: "暂无训练计划！",
							icon: "none"
						})
					}
				})
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	.list-tit {
		.list-lable {
			font-size: 32rpx;
			.lable-txt {
				background-color: #4a4a4a;
				border-bottom: 1px solid #c19b73;
				padding-left: 30rpx;
				
				line-height: 50rpx;
			}
		}
		background-color: #6d6d6d;
		color: #c19b73;
		// margin-bottom: 5rpx;
		border-bottom: 1px solid #c19b73;
		font-size: 30rpx;
	}
.list {
	// padding: 20rpx;
	.li {
		.li-stateBtn {
			.btn4 {
				background: #ef0708;
			}
			.btn3 {
				background: #c9caca;
			}
			.btn2 {
				background-color: #fff;
				border: 1px solid rgba(0, 0, 0, 0.4);
				color: rgba(0, 0, 0, 0.4) !important;
			}
			.btn1 {
				background: #5ac725;
			}
			.btn {
				width: 130rpx;
				height: 52rpx;
				border-radius: 30rpx;
				color: #fff;
				font-size: 24rpx;
				font-weight: 400;
			}
			width: 25%;
			height: 120rpx;
		}
		.li-info {
			.info-time {
				font-weight: 300;
				color: rgba(0, 0, 0, 0.4);
				font-size: 24rpx;
			}
			.info-coach {
				font-weight: 400;
				color: #999999;
				font-size: 28rpx;
			}
			.info-tit {
				font-weight: 600;
				color: #202020;
				font-size: 32rpx;
			}
			height: 150rpx;
			width: 65%;
		}
		.li-l {
			width: 10%;
			.selected-2 {
				width: 37rpx;
				height: 37rpx;
				border-radius: 50%;
				background: #f5f5f5;
			}
		}
		width: 100%;
		box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
		border-radius: 20rpx;
		background-color: #fff;
		padding: 30rpx 20rpx 30rpx 30rpx;
		// height: 200rpx;
	}
}
.plan-box {
	.select-planLi {
		box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
		background: #fe5e10 !important;
		color: #fff !important;
	}
	.plan-li {
		// width: 25%;
		padding: 10rpx 25rpx;
		height: 60rpx;
		border-radius: 4rpx;
		background: rgba(0, 168, 112, 0.3);
		color: rgba(255, 255, 255, 0.6);
		font-size: 24rpx;
		font-weight: 600;
		flex-shrink: 0; //子元素添加
		margin-right: 30rpx;
	}
	overflow-x: scroll;
	flex-wrap: nowrap;
}
.head-tit {
	.select-tit {
		background-color: #fe5e10 !important;
		color: #fff !important;
	}
	.tit-li {
		flex-shrink: 0; //子元素添加
		height: 80rpx;
		width: 50%;
		background-color: #ffe6da;
		font-weight: 400;
		color: #ffb692;
		font-size: 28rpx;
	}
}
</style>
