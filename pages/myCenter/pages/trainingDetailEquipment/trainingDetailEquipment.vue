<template>
	<view>
		<head-nav
			title="训练计划课程详情"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="head padlr20 ">
			<view class="course-info ">
				<view class="corse-tit martb20  flex">
					{{ trainingList.data.title || "" }}
					<view class="course-status mar-l20">
						(<text v-if="trainingList.data.status == 0">
							未完成
						</text>
						<text v-if="trainingList.data.status == 1">
							已完成
						</text>
						<text v-if="trainingList.data.status == 2">
							已预约
						</text>
						<text v-if="trainingList.data.status == 3">
							进行中
						</text>)
					</view>
				</view>
				<view class="course-time mar-t20 flex">
					开始时间：
					{{ trainingList.data.starttime || '未设置' }}
				</view>
			</view>
		</view>
		<view class=" block ">
			<view class="padlr20 pad-b20">
				<view
					class=""
					v-for="(item,
					index) in trainingList.course_content"
					:key="index"
				>
					<!-- 热身训练 计划-->
					<!-- 训练 计划组件 -->
					<plane
						v-if="item.group.length"
						:courseData="item"
						@goVideo="goVideo"
					></plane>
				</view>
			</view>
			<!-- 如果不是教练身份进入查看训练计划详情就显示此模块 -->
			<view class="" v-if="!coachRole">
				<!-- 心肺表 -->
				<view class="data-box martb20">
					<!-- 已提交显示心率 等等数据模块 -->
					<heart-rate-chart
						ref="heartRef"
						v-if="trainingList.data.experience"
					></heart-rate-chart>
					<view class="shadow-box pad20">
						<!-- 条状图 组件 -->
						<strip-chart
							v-if="trainingList.aerobic_cylinder.length"
							:stripData="trainingList.aerobic_cylinder"
						></strip-chart>
						<!-- eacharts 图表 -->
						<view class="" v-if="!Array.isArray(trainingList.aerobic_diagram)">
							<echarts-chart :chartObj="trainingList.aerobic_diagram"></echarts-chart>
						</view>
						
					</view>
				</view>
				<!-- 心率、设备 模块 -->
				<heart-rate-module
					ref="heartRateRef"
					@getDuration="getDuration"
					@getSportsState="getSportsState"
					v-if="!trainingList.data.experience && roleType != 'other'"
				></heart-rate-module>

				<view class="pad20" v-if="!trainingList.data.experience && roleType != 'other'">
					<!-- 锻炼感受 -->
					<view
						class="feel-box mar-t40"
						
					>
						<view class="tit">请选择您的感受</view>
						<view
							class="feel-list flex-row flex-a mar-t20"
						>
							<view
								class="li flex-col flex-a"
								v-for="(item, index) in feelImgs"
								:key="index"
								:class="{
									'select-li':
										selectFeel == index
								}"
								@click="feelChange(index)"
							>
								<view class="img-box">
							<!-- 		<image
										:src="item.img"
										mode=""
									></image> -->
									<image
										:src="selectFeel == index ? item.imgSelected : item.img"
										mode=""
									></image>
								</view>

								<view class="li-txt mar-20">
									{{ item.txt }}
								</view>
							</view>
						</view>
					</view>
					<!-- 感受描述 -->
					<view
						class="area-box mar-t40"
						
					>
						<u--textarea
							v-model="areaVal1"
							maxlength="-1"
							height="250rpx"
							placeholder="请填写运动反馈"
							border="none"
						></u--textarea>
					</view>
				</view>
				<!-- 回复信息反馈 模块 -->
				<view
					class="message pad20 mar-t40"
					v-if="trainingList.data.experience"
				>
					<view class="tit martb">我发布的反馈</view>
					<view class="message-head pad20 martb20">
						<view class="avatat flex-row flex-a">
							<u-avatar
								size="90rpx"
								:src="
									feedbackChatData.feedback
										.avatar
								"
							></u-avatar>
							<view
								class="name-box mar-l20 flex-col ju-bt"
							>
								<view class="name">
									{{
										feedbackChatData.feedback
											.nickname
									}}
								</view>
								<view class="name-time">
									{{
										feedbackChatData.feedback
											.feedback_time
									}}
								</view>
							</view>
						</view>

						<view
							class="topics-box flex-row flex-a "
						>
							<view class="topics">
								#{{
									feedbackChatData.feedback
										.experience
								}}
							</view>
							<view class="topics-txt mar-l20">
								{{
									feedbackChatData.feedback
										.feedback || ''
								}}
							</view>
						</view>
					</view>
					<view
						class=""
						v-if="trainingList.data.experience"
					>
						<view
							class="message-list"
							v-for="(item,
							index) in feedbackChatData.data"
							:key="index"
						>
							<!-- 其他人消息 -->
							<view
								class="list-others list-info flex-row flex-a martb40"
								v-if="item.direction == 'left'"
							>
								<view
									class="others-avatar avatar flex-col ju-bt flex-a"
								>
									<u-avatar
										size="80rpx"
										:src="item.user.avatar"
									></u-avatar>
									<view
										class="name text-elpis"
									>
										{{ item.user.nickname }}
									</view>
								</view>
								<view
									class="message-info flex-col ju-bt "
								>
									<view class="info-time">
										{{ item.createtime }}
									</view>
									<view class="info-text">
										{{ item.content }}
									</view>
								</view>
							</view>

							<!-- 自己的消息 -->
							<view
								class="list-me list-info flex-row flex-a martb40"
								v-else
							>
								<view
									class="message-info flex-col ju-bt"
								>
									<view class="info-time">
										{{ item.createtime }}
									</view>
									<view class="info-text">
										{{ item.content }}
									</view>
								</view>
								<view
									class="my-avatar avatar flex-col flex-a ju-bt"
								>
									<u-avatar
										size="80rpx"
										:src="item.user.avatar"
									></u-avatar>
									<view
										class="name text-elpis"
									>
										{{ item.user.nickname }}
									</view>
								</view>
							</view>
						</view>
						<view class="area-box reply mar-t40">
							<u--textarea
								v-model="areaVal2"
								maxlength="-1"
								height="140rpx"
								placeholder="请输入您的回复"
								border="none"
							></u--textarea>
						</view>
					</view>
				</view>
				<view
					class="fot-box padlr20 pad-t20 pad-b40 mar-t20"
				>
					<view
						class="bot-btn flex"
						v-if="!trainingList.data.experience && roleType != 'other'"
						@click="submitFun"
					>
						提交
					</view>
					<view
						class="bot-btn flex"
						v-if="trainingList.data.experience"
						@click="sendFeedbackFun"
					>
						发布
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
// 心率表 回显数据组件
import heartRateChart from '@/components/heartRateChart/heartRateChart';
/* 心率表 操作组件 */
import heartRateModule from '@/components/heartRateModule/heartRateModule.vue';
// eacharts图表
import echartsChart from '@/pages/myCenter/pages/components/echartsChart/echartsChart.vue';
// 条状图 组件
import stripChart from '@/components/stripChart/stripChart.vue';
import {
	trainingProgramDetailPlan,
	userTrainingFeedback,
	getFeedbackChat,
	sendFeedback
} from '@/api/myCenter.js';
// 训练计划组件
import plane from './components/plan.vue';
// 引入modal组件
import modalTips from '@/components/modalTips/modalTips.vue';
/* 获取时间转换插件 */
import { timestampToTime } from '@/utils/util.js';
export default {
	components: {
		heartRateChart,
		echartsChart,
		stripChart,
		plane,
		modalTips,
		heartRateModule
	},
	data() {
		return {
			baseUrl: baseUrl,
			// 训练类型 数据
			trainingList: {},
			// 感受icons
			feelImgs: [
				{
					img: `${baseUrl}strenuous.png`,
					imgSelected: `${baseUrl}strenuous-selected.png`,
					txt: '难受'
				},
				{
					img: `${baseUrl}challenging.png`,
					imgSelected: `${baseUrl}challenging-selected.png`,
					txt: '有点累'
				},
				{
					img: `${baseUrl}just.png`,
					imgSelected: `${baseUrl}just-selected.png`,
					txt: '微喘'
				},
				{
					img: `${baseUrl}easy.png`,
					imgSelected: `${baseUrl}easy-selected.png`,
					txt: '轻松'
				}
			],
			// 当前选中的感受
			selectFeel: 3,
			// 描述val
			areaVal1: '',
			// 反馈val
			areaVal2: '',
			// 训练计划详情id
			courseId: '',
			// 反馈信息数据
			feedbackChatData: {},
			// 角色类型
			roleType: 'user',
			duration: 0, // 运动时长
			// 设备数据
			equipment: {},
			/* 是否是教练身份进入查看课程信息 */
			coachRole: false,
			backStatus: '' ,// 点击返回按钮时 获取页面运行状态
			platform: "", // 设备状态
		};
	},
	onLoad(eve) {
		/* roleType 代表 课程完成 教练进入此页面反馈信息 */
		this.roleType = eve.roleType ?? 'user';
		/* coachRole 存在 代表课程未完成 教练查看训练计划   */
		this.coachRole = eve.coachRole;
		this.courseId = eve.courseId;
		// 获取训练计划详情
		this.getTrainingProgramDetailPlan();
		/* 如果不是教练身份进入此页面查看信息就调用字组件回调 */
		if(!this.coachRole) {
			/* 获取心率组件强度列表 */
			this.$refs.heartRateRef.getIntensityListFun('training');
			/* 初始化组件音频实例 */
			this.$refs.heartRateRef.createInnerAudioFun();
		}
		
	},
	onUnload() {
		/* 页面卸载断开socket */
		if(!this.coachRole) {
			this.$refs.heartRateRef.onUnloadFun();
		}
		if (this.backStatus == 1 || this.backStatus == 2) {
			/* 调用组件更改按钮状态方法 */
			this.$refs.heartRateRef.onBtn(3, 'back');
		}
	},
	watch: {
		backStatus: {
			handler(newV, oldV) {
				if (newV == 1 || newV == 2) {
					wx.enableAlertBeforeUnload({
						message: '运动中，提前退出吗？'
					});
				} else {
					wx.disableAlertBeforeUnload();
				}
			},
			immediate: true,
			deep: true
		}
	},
	onShow() {
		this.platform = uni.getSystemInfoSync().platform;
		if(this.platform === 'ios') {
			this.$refs.heartRateRef.recordIosHideDate(this.platform)
		}
		/* 获取是否授权离开时获取定位 达到小程序离开不被杀死 */
		this.$refs.heartRateRef.getAuthorizeUserLocationBackground();
		uni.setKeepScreenOn({
		   keepScreenOn: true,
				fail() {
					uni.setKeepScreenOn({
						keepScreenOn: true
					});
				}
		});
	},
	methods: {
		/* 获取组件 开始按钮状态 */
		getSportsState(e) {
			/*
				是否正在 运动状态
				1 || 2 提示弹框
			*/
			this.backStatus = e;
		},
		/* 发布反馈信息 */
		sendFeedbackFun() {
			if (!this.areaVal2) {
				uni.showToast({
					title: '请输入内容！',
					icon: 'error'
				});
				return;
			}
			sendFeedback({
				course_id: this.courseId,
				content: this.areaVal2,
				identity: this.roleType
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					this.areaVal2 = '';
					this.getFeedbackChatFun();
				}, 1000);
			});
		},
		/* 获取反馈信息 */
		getFeedbackChatFun() {
			getFeedbackChat({
				course_id: this.courseId
			}).then(res => {
				this.feedbackChatData = res.data;
			});
		},
		/* 获取运动时长 */
		getDuration(data) {
			this.equipment = data;
		},
		// 提交
		submitFun() {
			if (
				this.equipment.btnState != 3 ||
				this.equipment.tiemDuration < 300
			) {
				uni.showToast({
					title:
						'运动时长达到五分钟和点击结束运动之后再打卡哦~',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			userTrainingFeedback({
				course_id: this.courseId,
				feedback: this.areaVal1,
				experience: this.feelImgs[this.selectFeel].txt,
				aerobic_heart_rate_arr: this.equipment
					.heartRateArr.length
					? this.equipment.heartRateArr.join(',')
					: '', // 心率数组
				speed: this.equipment.exerciseSpeed, // 运动速度
				length_time: this.equipment.tiemDurationDate, // 运动时长
				length_time_second: this.equipment.tiemDuration, // 时长秒数
				distance: this.equipment.totalDistance, // 运动距离
				calories: this.equipment.calories, // 消耗热量
				heart_rate: this.equipment.HRmean, // 平均心率
				burn_fat: this.equipment.burn_fat, // 燃烧脂肪
				training_intensity: this.equipment.strengName ,// 运动强度
				strength_statistics: JSON.stringify(this.equipment.strength_statistics), // 运动强度 统计
				steps: this.equipment.steps, // 心率带步数
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				/* 选中感受的下标 */
				this.selectFeel = 0;
				setTimeout(() => {
					this.getTrainingProgramDetailPlan();
				}, 1000);
			});
		},
		// 感受发生改变
		feelChange(index) {
			this.selectFeel = index;
		},
		// 获取训练计划详情
		getTrainingProgramDetailPlan() {
			trainingProgramDetailPlan({
				course_id: this.courseId
			}).then(res => {
				/* 
					this.courseType = sporty 运动管理师 -》 居家训练计划
				 */
				// 传递课程类型到组件
				this.$refs.heartRateRef.getCourseType(res.data.coachdata.type, res.data.data.starttime, this.courseId); 
				this.trainingList = res.data;
				if (this.trainingList.data.experience) {
					this.getFeedbackChatFun();
					setTimeout(() => {
						if(!this.coachRole) {
							this.$refs.heartRef.getData(
								res.data.data,
								'training'
							);
						}
						
					}, 300);
				}
			});
		},
		// 跳转视频讲解
		goVideo(eve) {
			uni.navigateTo({
				url: `/pages/myCenter/pages/videoExplain/videoExplain?courseId=${eve}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.btn {
	// height: 45rpx;
	border-radius: 20rpx;
	color: #fff;
	padding: 7rpx 25rpx;
	background-color: #3c9cff;
	font-size: 26rpx;
}
.message {
	.message-list {
		// .list-others
		.list-me {
			.message-info {
				.info-time {
					display: flex;
					justify-content: flex-end;
				}
				margin-right: 30rpx !important;
				margin-left: 0rpx !important;
			}
			.info-text {
				background-color: #ffa376 !important;
				&::after {
					content: '';
					left: 96.5% !important;
					transform: translateY(-50%);
					border-top: 20rpx solid transparent !important;
					border-bottom: 20rpx solid transparent !important;
					border-left: 40rpx solid #ffa376 !important;
					border-right: 40rpx solid transparent !important;
				}
			}
		}
		.list-info {
			.message-info {
				.info-text {
					margin-top: 10rpx;
					background: #f5f5f5;
					border-radius: 10rpx;
					padding: 20rpx;
					width: 100%;
					position: relative;
					z-index: 99;
					&::after {
						z-index: 0;
						content: '';
						position: absolute;
						left: -45rpx;
						top: 50%;
						transform: translateY(-50%);
						border-top: 20rpx solid transparent;
						border-bottom: 20rpx solid transparent;
						border-left: 20rpx solid transparent;
						border-right: 40rpx solid #f5f5f5;
					}
				}
				.info-time {
					font-weight: 400;
					color: #999999;
					font-size: 20rpx;
				}
				// height: 120rpx;
				margin-left: 50rpx;
				width: 100%;
			}
			.avatar {
				.name {
					font-weight: 400;
					color: #202020;
					font-size: 26rpx;
				}
				height: 130rpx;
			}
		}
	}
	.message-head {
		.topics-box {
			.topics-txt {
				font-weight: 400;
				color: #202020;
				font-size: 28rpx;
			}
			.topics {
				font-weight: 400;
				color: #fe5e10;
				font-size: 28rpx;
			}
			margin-top: 30rpx;
			margin-bottom: 10rpx;
		}

		.avatat {
			.name-box {
				.name-time {
					font-weight: 400;
					color: #999999;
					font-size: 20rpx;
				}
				.name {
					font-weight: 600;
					color: #202020;
					font-size: 28rpx;
				}
				height: 75rpx;
			}
		}
		background: #f5f5f5;
		border-radius: 20rpx;
	}
}
.shadow-box {
	width: 100%;
	box-shadow: 0rpx 0rpx 20rpx 1rpx #f5f5f5;
}
.start-btnBox {
	margin-top: 50rpx;
	.btn-txt {
		margin-left: 10rpx;
	}
}
.fot-box {
	.bot-btn {
		font-weight: 400;
		color: #fe5e10;
		font-size: 32rpx;
		border: 1px solid #fe5e10;
		border-radius: 40rpx;
		height: 80rpx;
	}
}
/deep/ .u-textarea {
	border-radius: 20rpx !important;
	background: #f5f5f5 !important;
	padding: 30rpx !important;
}
.tit {
	color: #202020;
	font-size: 28rpx;
}
.feel-box {
	.feel-list {
		.select-li {
			color: #fe5e10;
		}
		.li {
			font-size: 26rpx;
			margin-top: 10rpx;
			.img-box {
				image {
					width: 100%;
					height: 100%;
				}
				width: 50%;
				height: 90rpx;
			}
			width: 25%;
		}
		width: 100%;
	}
	width: 100%;
}

.head {
	background-color: #fff;
	border-radius: 20rpx;
}
.course-info {

	.course-time {
		font-weight: 400;
		color: #999999;
		font-size: 24rpx;
	}
	.corse-tit {
		.course-status {
			font-size: 26rpx;
			color: #999999;
		}
		
		font-size: 32rpx;
		color: rgba(0, 0, 0, 0.9);
	}
}
</style>
