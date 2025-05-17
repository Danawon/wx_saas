<template>
	<view class="wrap-min">
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="训练计划"
		></head-nav>
		<view class="page">
			<view class="page-li flex-a ju-bt bgfff">
				<text class="lable">训练计划名称</text>
				<view class="ipt-box">
					<u-input
						v-model="planTit"
						border="surround"
						placeholder="请输入内容"
						@blur="editPlanName"
					></u-input>
				</view>
			</view>
			<view class="page-li flex-a ju-bt bgfff">
				<text class="lable">{{ planTit }}</text>
				<view class="btn-box flex-a ">
					<view
						v-if="planList.length"
						class="del btn flex padlr20"
						@click="delChildNode({ id: planId })"
					>
						删除
					</view>
					<view
						v-if="!planList.length"
						class="del btn flex padlr20"
						@click="tplLibrary(planItem)"
					>
						选择计划
					</view>
					<view
						class="add btn flex mar-l20"
						@click="childNodes({ id: planId })"
					>
						添加中周期名称
					</view>
				</view>
			</view>
			<!-- <u-line margin="20rpx 0 0"></u-line> -->
			<view class="page-list">
				<view class="mar-t20" @click="recipeShow = true">
					<u-cell-group :customStyle="{background:'#fff'}">
						<u-cell title="运动处方" :value="recipeName || '请选择'" :isLink="true"></u-cell>
					</u-cell-group>
				</view>
				<view
					class="page-li bgfff mar-l20 mar-r20 mar-t20 "
					v-for="(planItem, planIndex) in planList"
					:key="planIndex"
				>
					<view class="li-top flex-a  ju-bt">
						<view
							class="name w63"
							@click="
								childNodes(planItem, 'nodeChild')
							"
						>
							{{ planItem.title }}
						</view>
						<view class="flex-row flex-a ju-bt w35">
							<view
								class="btn-li add-child "
								@click="childNodes(planItem)"
							>
								添加小周期名称
							</view>
							<view
								class="del-icon-plan "
								@click="delChildNode(planItem)"
							>
								<u-icon
									name="trash"
									size="36rpx"
									color="#1B1B1B"
								></u-icon>
							</view>
						</view>
					</view>
					<view
						class="li-center martb20"
						v-for="(item,
						index) in planItem.children"
						:key="index"
					>
						<view
							class="node2-box flex-a ju-bt mar-l20"
						>
							<view
								class="w63 "
								@click="
									childNodes(item, 'nodeChild')
								"
							>
								{{ item.title }}
							</view>
							<view
								class="w35 flex-row flex-a ju-bt"
							>
								<view
									class="btn-li add-child "
									@click="childNodes(item)"
								>
									添加课程名称
								</view>
								<view
									class="del-icon-plan"
									@click="delChildNode(item)"
								>
									<u-icon
										name="trash"
										size="36rpx"
										color="#1B1B1B"
									></u-icon>
								</view>
							</view>
						</view>
						<view
							class="flex-a mar-l40 mar-t20 ju-bt course-box"
							v-for="(chiItem,
							chiIndex) in item.children"
							:key="chiIndex"
						>
							<view
								class="flex-row flex-a course-l"
								@click.stop="
									childNodes(
										chiItem,
										'nodeChild'
									)
								"
							>
								<u-radio-group
									v-model="radioVal"
									:disabled="
										chiItem.status != 0 ||
											orderInfo.course_id
									"
								>
									<u-radio
										:label="' '"
										:name="chiItem.id"
									></u-radio>
								</u-radio-group>
								<view
									class="nodeTxt flex-row flex-a"
								>
									<view class="nodeTxt-tit" :class="[chiItem.status == 0 ? 'nodeTxt-tit-bold' : 'nodeTxt-tit-disabled']">
										{{ chiItem.title }}
									</view>
									<view
										class="btn-li complete  pad-l20"
										v-if="
											chiItem.status == 1
										"
									>
										已完成
									</view>
									<view
										class="btn-li complete  pad-l20"
										v-if="
											chiItem.status == 2
										"
									>
										已预约
									</view>
									<view
										class="btn-li complete  pad-l20"
										v-if="
											chiItem.status == 3
										"
									>
										进行中
									</view>
									<view
										class="btn-li no-complete   pad-l20"
										v-if="
											chiItem.status == 0
										"
									>
										未完成
									</view>
								</view>
							</view>

							<view
								class="flex-row flex-a course-r ju-bt"
								@click.stop="
									selectChildNode(chiItem)
								"
							>
								<view class="editSty  mar-l20">
									{{
										chiItem.status == 1
											? '查看课程'
											: '编辑课程'
									}}
								</view>
								<view
									class="del-icon "
									@click.stop="
										delChildNode(chiItem)
									"
								>
									<u-icon
										name="trash"
										size="36rpx"
										color="#1B1B1B"
									></u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-empty
			v-if="!planList.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
		<view
			class="bottom-btn flex"
			@click="confirmFun"
			v-if="!orderInfo.course_id"
		>
			发布
		</view>

		<modal-tips
			ref="modalTipsRef"
			:modalShow="addNodeShow"
			title="标题"
			confirmText="保存"
			cancelText="取消"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentConfirm="addNodeConfirm"
			@parentCancel="addNodeCancel"
		>
			<view class="modalTxt pad-b40 flex">
				<u-input
					placeholder="请输入"
					border="surround"
					v-model="addNodeVal"
				></u-input>
			</view>
		</modal-tips>
		
		<u-picker 
			:show="recipeShow" 
			:columns="recipeColumns"
			@confirm="selectRecipe"
			@close="recipeShow = false"
			@cancel="recipeShow = false"
			keyName="title"
		></u-picker>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import modalTips from '@/components/modalTips/modalTips.vue';
import {
	trainingDetailsEdit,
	addStairGrouping,
	delPlanChildNode,
	coachTrainingEdit,
	setCourse
} from '@/api/admin.js';
import { recipeList } from "@/api/doctor.js"
export default {
	components: {
		modalTips
	},
	data() {
		return {
			checkboxValue1: 1,
			radioVal: '', // 选中的计划id
			// 计划id
			planId: '',
			// 计划总标题
			planTit: '',
			planList: [],
			selectNodeId: '', // 选中的节点计划id
			addNodeShow: false, // 添加子节点
			addNodeVal: '', // 添加子节点val
			editNode: '', // 是否是编辑节点标题
			orderId: '', // 订单id
			orderInfo: {} ,// 订单信息
			recipeColumns: [], // 处方列表
			recipeShow: false,
			recipeName: "", // 处方名称
			recipeId: "", // 处方ID
			uid: "", // 用户id 
		};
	},
	async onLoad(e) {
		this.planId = e.id;
		this.orderId = e.orderId;
		await this.getTrainingDetailsEdit();
		await this.getRecipeList();
	},
	onShow() {
		
	},
	methods: {
		/* 获取运动处方列表 */
		getRecipeList() {
			return recipeList({
				uid: this.uid 
			}).then(res => {
				this.recipeColumns = [res.data]
			})
		},
		/* 选中处方 */
		selectRecipe(e) {
			this.recipeName = e.value[0].title;
			this.recipeId = e.value[0].id;
			this.recipeShow = false;
			/* 编辑训练计划标题 */
			coachTrainingEdit({
				prescription_id: e.value[0].id,
				title: this.editNode
					? this.addNodeVal
					: this.planTit,
				id: this.editNode
					? this.selectNodeId
					: this.planId,
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					message: res.msg
				});
			});
		},
		/* 赋值计划 */
		confirmFun() {
			if (!this.radioVal) {
				this.$refs.uToast.show({
					type: 'error',
					message: '请选择计划后保存！'
				});
				return;
			}
			setCourse({
				order_id: this.orderId,
				course_id: this.radioVal
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					message: res.msg
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			});
		},
		/* 修改计划名称 */
		editPlanName() {
			if (!this.planTit) {
				uni.showToast({
					title: '请输入标题',
					icon: 'error'
				});
				return;
			}
			/* 编辑训练计划标题 */
			coachTrainingEdit({
				training_id: this.planId,
				title: this.editNode
					? this.addNodeVal
					: this.planTit,
				id: this.editNode
					? this.selectNodeId
					: this.planId,
				order_id: this.orderId
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					message: res.msg
				});
				this.editNode = '';
				setTimeout(() => {
					this.getTrainingDetailsEdit();
				}, 1000);
			});
		},
		// 删除子节点计划
		delChildNode(item) {
			delPlanChildNode({
				id: item.id,
				order_id: this.orderId
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					message: res.msg
				});
				setTimeout(() => {
					this.getTrainingDetailsEdit();
					this.addNodeVal = '';
				}, 1000);
			});
		},
		// 选中子节点
		selectChildNode(e) {
			if (
				e.status == 0 ||
				e.status == 2 ||
				e.status == 3
			) {
				uni.navigateTo({
					url: `/pages/admin/pages/courseOutline/courseOutline?id=${
						e.id
					}`
				});
			} else if (e.status == 1) {
				uni.navigateTo({
					url: `/pages/myCenter/pages/trainingDetailEquipment/trainingDetailEquipment?courseId=${
						e.id
					}&roleType=other`
				});
			}
		},
		// 关闭增加子节点
		addNodeCancel() {
			this.addNodeShow = false;
		},
		// 添加子节点
		addNodeConfirm() {
			if (!this.addNodeVal) {
				uni.showToast({
					title: '请输标题',
					icon: 'none'
				});
				return;
			}
			this.addNodeCancel();
			/* 如果存在 代表编辑标题 */
			if (this.editNode) {
				this.editPlanName();
				return;
			}
			// 添加分组子节点
			addStairGrouping({
				pid: this.selectNodeId,
				title: this.addNodeVal,
				top_class: this.planId,
				order_id: this.orderId
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					message: res.msg
				});
				setTimeout(() => {
					this.getTrainingDetailsEdit();
				}, 1000);
			});
		},
		// 门店约课训练计划编辑 获取
		getTrainingDetailsEdit() {
			return trainingDetailsEdit({
				training_id: this.planId,
				order_id: this.orderId
			}).then(res => {
				this.planTit = res.data.top_data.title;
				this.uid = res.data.top_data.uid
				this.planList = res.data.list;
				this.addNodeVal = '';
				this.orderInfo = res.data.order;
				this.recipeId = res.data.top_data.prescription_id
				this.recipeName = res.data.top_data.prescription_name
			});
		},
		//选择模板
		tplLibrary(item) {
			uni.navigateTo({
				url: `/pages/admin/pages/coach/tplLibrary/tplLibrary?id=${
					this.planId
				}`
			});
		},
		//添加子节点
		childNodes(e, type) {
			if(e.status) {
				return
			}
			if (type) {
				this.addNodeVal = e.title;
			}
			this.editNode = type;
			this.selectNodeId = e.id;
			this.addNodeShow = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.li-center {
	font-size: 26rpx;
}
.course-box {
	.course-l {
		width: 65%;
	}
	.course-r {
		width: 35%;
	}
}
.editSty {
	border-radius: 10rpx;
	border: 1rpx solid #8a8c8e;
	color: #8a8c8e;
	font-size: 22rpx;
	padding: 8rpx 20rpx;
}
.nodeTxt {
	.nodeTxt-tit-bold {
		font-weight: bold;
	}
	.nodeTxt-tit-disabled {
		color: #999;
	}
	.nodeTxt-tit {
		width: 71%;
	}
	.btn-li {
		font-size: 20rpx !important;
	}
	width: 90%;
}
.w63 {
	width: 63%;
}
.w35 {
	width: 35%;
}
.bottom-btn {
	position: fixed;
	bottom: 30rpx;
	left: 50%;
	width: 90%;
	transform: translateX(-50%);
	height: 74rpx;
	background: #fe5e10;
	border-radius: 48rpx;
	color: #fff;
	font-size: 32rpx;
}
.page {
	padding-bottom: 200rpx;
	.bgfff {
		background-color: #fff;
	}
	.page-li {
		padding: 15rpx 35rpx;

		.lable {
			color: rgba(0, 0, 0, 0.9);
			font-size: 32rpx;
		}
		.btn {
			padding: 10rpx 15rpx;
			border-radius: 10rpx;
			font-size: 22rpx;
		}
		.add {
			color: #fe5e10;
			border: 1rpx solid #fe5e10;
		}
		.del {
			border: 1px solid rgba(0, 0, 0, 0.4);
			color: rgba(0, 0, 0, 0.4);
		}
	}

	.page-list {
		.page-li {
			border-radius: 20rpx;
			padding: 30rpx;
			position: relative;
		}
		.name {
			color: rgba(0, 0, 0, 0.9);
			font-size: 26rpx;
		}
		.btn-li {
			padding: 8rpx 10rpx;
			font-size: 22rpx;
			border-radius: 8rpx;
		}

		.add-child {
			color: #fff;
			background: #fe5e10;
		}
		.select-child {
			color: #fff;
			background: #fea41d;
		}
		.complete {
			color: #fe5e10;
			border: 1rpx solid #fe5e10;
			border-radius: 10rpx;
		}
		.no-complete {
			color: #fff;
			background: #d9d9d9;
			border-radius: 10rpx;
		}
	}
}
</style>
