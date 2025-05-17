<template>
	<view class="wrap-min">
		<head-nav title="课程详情" :goBack="true"></head-nav>
		<view class="content pad20">
			
			<!-- 任务介绍 -->
			<view class="task-info pad20 ">
				<view class="title flex">
					第{{ courseInfo.stage || 0 }}次打卡目标
				</view>
				<view class="flex-row flex-a martb40 ju-bt">
					<view class="li-55 flex-row flex-a ">
						<view class="time-lable lable">
							任务形式：
						</view>
						<view class="time-val lable-val">
							{{ courseInfo.title || '' }}
						</view>
					</view>
					<view class="li-45 flex-row flex-a ">
						<view class="time-lable lable">
							训练时间：
						</view>
						<view class="time-val lable-val">
							{{ courseInfo.training_time || ''  }}分钟
						</view>
					</view>
				</view>
				<view class="flex-row flex-a martb40 ju-bt">
					<view class="li-55 flex-row flex-a ">
						<view class="time-lable lable">
							训练强度：
						</view>
						<view class="time-val lable-val">
							{{ courseInfo.motion_strength.name || ''  }}
						</view>
					</view>
					<view class="li-45 flex-row flex-a ">
						<view class="time-lable lable">
							消耗热量：
						</view>
						<view class="time-val lable-val">
							{{ courseInfo.calories  || '' }}千卡
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 心率表组件模块 -->
		<heart-rate-module
			ref="heartRateRef"
			@getDuration="getDuration"
			@getSportsState="getSportsState"
		></heart-rate-module>
		<view class="pad20">
			<view class="training-box mar-t20  pad20">
				<view class="task-tit pad-t20 flex">
					任务介绍
				</view>
				<!-- <view class="training-content mar-t40">
					{{ courseInfo.training_content || '' }}
				</view> -->
				<view
					class="parse-box mar-t20"
					v-if="courseInfo.training_content"
				>
					<u-parse
						:content="courseInfo.training_content"
					></u-parse>
				</view>
			</view>
			<view class="fot-btn martb40">
				<view
					class="btn flex"
					@click="submitEquipmentInfoFun"
				>
					我要打卡
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
/* 引入接口文件 */
import {
	nutritionalPunchInfo,
	submitEquipmentInfo
} from '@/api/clockIn.js';
/* 心率表模块组件 */
import heartRateModule from '@/components/heartRateModule/heartRateModule.vue';
export default {
	components: {
		heartRateModule
	},
	data() {
		return {
			baseUrl: baseUrl,
			taskId: '', // 任务id
			coachInfo: {}, // 教练信息
			courseInfo: {}, // 课程详情
			// 设备数据
			equipment: {},
			backStatus: '' ,// 点击返回按钮时 获取页面运行状态
			platform: "", // 设备状态
		};
	},
	onLoad(eve) {
		this.taskId = eve.id;
		this.getNutritionalPunchInfo();

		/* 获取心率组件强度列表 */
		this.$refs.heartRateRef.getIntensityListFun('clockIn');
		/* 初始化组件音频实例 */
		this.$refs.heartRateRef.createInnerAudioFun();
	},

	onShow() {
		this.platform = uni.getSystemInfoSync().platform;
		if(this.platform === 'ios') {
			this.$refs.heartRateRef.recordIosHideDate(this.platform)
		}
		this.equipment = {};
		/* 获取是否授权离开时获取定位 达到小程序离开不被杀死 */
		this.$refs.heartRateRef.getAuthorizeUserLocationBackground();
		/* 屏幕常亮 */
		uni.setKeepScreenOn({
			keepScreenOn: true,
			fail() {
				uni.setKeepScreenOn({
					keepScreenOn: true
				});
			}
		});
	},
	onUnload() {
		/* 页面卸载断开socket */
		this.$refs.heartRateRef.onUnloadFun();
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
	methods: {
		/* 获取组件 开始按钮状态 */
		getSportsState(e) {
			/*
				是否正在 运动状态
				1 || 2 提示弹框
			*/
			this.backStatus = e;
		},
		// 获取课程数据
		getNutritionalPunchInfo() {
			nutritionalPunchInfo({
				id: this.taskId
			}).then(res => {
				this.coachInfo = res.data.coachinfo;
				this.courseInfo = res.data.info;
			});
		},
		/* 获取运动时长 */
		getDuration(data) {
			this.equipment = data;
		},
		// 保存设备信息
		submitEquipmentInfoFun(eve) {
			// 设备数据
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
			submitEquipmentInfo({
				task_id: this.courseInfo.task_id,
				speed: this.equipment.exerciseSpeed, // 运动速度
				length_time: this.equipment.tiemDurationDate, // 运动时长
				length_time_second: this.equipment.tiemDuration, // 时长秒数
				distance: this.equipment.totalDistance, // 运动距离
				calories: this.equipment.calories, // 消耗热量
				heart_rate: this.equipment.HRmean, // 平均心率
				training_intensity: this.equipment.strengName, // 运动强度
				aerobic_heart_rate_arr: this.equipment
					.heartRateArr.length
					? this.equipment.heartRateArr.join(',')
					: '', // 心率数组
				burn_fat: this.equipment.burn_fat, // 燃烧脂肪
				strength_statistics: JSON.stringify(
					this.equipment.strength_statistics
				), // 运动强度 统计
				steps: this.equipment.steps, // 心率带步数
			}).then(res => {
				// 跳转训练打卡
				uni.navigateTo({
					url: `/pages/punchTheClock/pages/clockInTraining/clockInTraining?task_id=${
						this.courseInfo.task_id
					}`
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.title {
	font-weight: bold;
}
.li-55 {
	width: 55%;
}
.li-45 {
	width: 45%;
}
/deep/ video {
	width: 100% !important;
}

.echarts-box {
	width: 100%;
}
.fot-btn {
	.btn {
		width: 100%;
		height: 80rpx;
		border-radius: 50rpx;
		background-color: #fe5e10;
		color: #fff;
	}
}
.training-box {
	.training-content {
		font-weight: 500;
		color: rgba(0, 0, 0, 0.4);
		font-size: 30rpx;
		line-height: 50rpx;
	}
	width: 100%;
	background-color: #fff;
	border-radius: 30rpx;
}

.task-info {
	.lable-val {
		font-weight: 400;
		color: #434343;
		font-size: 30rpx;
	}
	.lable {
		font-weight: 500;
		color: #999999;
		font-size: 30rpx;
	}
	width: 100%;
	background-color: #fff;
	border-radius: 30rpx;
}
.task-tit {
	font-weight: 600;
	color: rgba(0, 0, 0, 0.9);
	font-size: 40rpx;
}


</style>
