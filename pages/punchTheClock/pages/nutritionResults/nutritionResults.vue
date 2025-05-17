<template>
	<view class="wrap">
		<head-nav
			title="营养结果分析"
			titColor="#fff"
			iconC="#fff"
			bgColor="rgba(0,0,0,0)"
			:goBack="true"
		></head-nav>
		<view class="head-bg"></view>
		<view class="head-satate flex">
			<view class="coach-info flex-col flex-a">
				<u-avatar :src="coachInfo.avatar" size="55"></u-avatar>
				<view class="info-name mar-t20">
					{{ coachInfo.name || '' }}
				</view>
			</view>
			<view class="flex-a flex-col">
				<view class="state-val">
					<text
						v-if="
							taskInfo.score == 'up_standard'
						"
					>
						未达标
					</text>
					<text
						v-if="taskInfo.score == 'no_score'"
					>
						未点评
					</text>
					<text
						v-if="taskInfo.score == 'standard'"
					>
						已达标
					</text>
					<text
						v-if="
							taskInfo.score == 'exceed_quota'
						"
					>
						超标
					</text>
				</view>
				<view class="state-time mar-t20">
					{{ taskInfo.scoretime || '' }}
				</view>
			</view>
		</view>
		<!-- 结果分析 -->
		<view class="result-content  mar-t40">
			<view class="tit feel-tit">营养师点评</view>
			<view class="cont-txt pad20 mar-t20">
				<view class="txt">
					{{ taskInfo.analysis || '暂无' }}
				</view>
				<view class="txt-time mar-t40">
					{{ taskInfo.scoretime || '' }}
				</view>
			</view>
		</view>
		<!-- 饮食感受 -->
		<view class="feel-box pad20">
			<view class="li-box mar-b40" v-for="(item, index) in nutritionObj" :key="index">
				<view class="feel-li  flex-row ju-bt flex-a">
					<view class="flex-row flex-a">
						<view class="li-tit">
							<text v-if="item.meal_time == 'breakfast'">早餐</text>
							<text v-if="item.meal_time == 'lunch'">午餐</text>
							<text v-if="item.meal_time == 'dinner'">晚餐</text>
							<text v-if="item.meal_time == 'extra_meal'">加餐</text>
							感受:</view>
						<view class="feel-imgbox flex-row flex-a  mar-l20">
							<view class="feel-txt ">{{ item.experience }}</view>
							<view class="feel-img mar-l20">
								<image
									:src="item.feelImg"
								></image>
							</view>
						</view>
					</view>
					<view class="result-box">
						<text class="result-txt1" v-if="item.score_text == '已达标'">{{ item.score_text }}</text>
						<text class="result-txt2" v-if="item.score_text == '未达标'">{{ item.score_text }}</text>
						<text  v-if="item.score_text == '未评分'">{{ item.score_text }}</text>
					</view>
				</view>
				<view class=" diet-img padlr20 pad-b20" v-if="item.clock_record">
					<image 
						:src="item.clock_record"
					></image>
				</view>
			</view>
			
		</view>
		<!-- 饮食类型 -->
		<view
			class="fot-state food-type pad-l40 pad-r40 pad-b40"
		>
			<view class="feel-tit">当日总数据</view>
			<view class="state-list">
				<view
					class=" martb40 flex-row flex-a ju-bt"
					v-for="(item,
					index) in totalData"
					:key="index"
				>
					<view class="time-lable lable">
						{{ item.name }}：
					</view>
					<view
						class="time-val lable-val flex-row flex-a"
					>

						<view class="">{{ item.value }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getAnalysisResults } from '@/api/clockIn.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 感受icons
			feelImgs: [
				{
					img: `${baseUrl}strenuous-selected.png`,
					txt: '有点撑'
				},
				{
					img: `${baseUrl}challenging-selected.png`,
					txt: '口味重'
				},
				{
					img: `${baseUrl}just-selected.png`,
					txt: '七分饱'
				},
				{
					img: `${baseUrl}easy-selected.png`,
					txt: '清淡'
				}
			],
			// 任务id
			taskId: '',
			// task 任务信息
			taskInfo: {},
			// 营养数据
			nutritionObj: [],
			/* 当日总数据 */
			totalData: [],
			/* 营养师信息 */
			coachInfo: {},
		};
	},
	onLoad(eve) {
		this.taskId = eve.taskId;
		this.getAnalysisResultsFun();
	},
	methods: {
		// 获取课程信息
		getAnalysisResultsFun() {
			getAnalysisResults({
				task_id: this.taskId
			}).then(res => {
				this.coachInfo = res.data.coachinfo
				this.taskInfo = res.data.info;
				this.totalData = res.data.daily_statistics
				for( let k in res.data.meal_time) {
					this.nutritionObj.push(res.data.meal_time[k])
					this.feelImgs.forEach((item, index) => {
						if(res.data.meal_time[k].experience == item.txt) {
							res.data.meal_time[k].feelImg = item.img
						}
					})
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.info-name {
		font-size: 26rpx;
	}
	.result-txt1 {
		color: #46cc4b;
	}
	.result-txt2 {
		color: #fac11c;
	}
	.feel-box {
		.li-box {
			box-shadow: 1px 1px 15rpx 0rpx #ccc;
			border-radius: 20rpx;
			.diet-img {
				width: 100%;
				image {
					width: 100%;
				}
			}
			.feel-li {
				.feel-txt {
					font-size: 28rpx;
					margin-left: 10rpx;
				}
				.feel-img {
					width: 60rpx;
					height: 60rpx;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.result-box {
					font-size: 27rpx;
				}
				padding: 20rpx 30rpx;
			}
			
		}
	}
.fot-state {
	.state-tag {
		font-weight: 400;
		color: #ed7735;
		font-size: 24rpx;
		width: 100rpx;
		height: 50rpx;
		margin-right: 10rpx;
		border-radius: 10rpx;
		border: 1px solid #ed7735;
	}
}

.feel-tit {
	font-weight: 550;
	color: rgba(0, 0, 0, 0.9); 
	font-size: 28rpx;
}
.food-type {
	.lable-val {
		font-weight: bold;
		color: #999999;
		font-size: 30rpx;
	}
	.lable {
		font-weight: 500;
		color: #434343;
		font-size: 30rpx;
	}

	width: 100%;
	background-color: #fff;
	border-radius: 30rpx;
}

.result-content {
	.cont-txt {
		.txt-time {
			font-weight: 300;
			color: #999999;
			font-size: 22rpx;
		}
		.txt {
			font-weight: 400;
			color: rgba(0,0,0,0.6);
			line-height: 44rpx;
			font-size: 26rpx;
		}
		width: 100%;
		border: 20rpx;
		background-color: #F5F5F5;
		border-radius: 20rpx;
	}
	padding: 20rpx 30rpx;
}
.head-satate {
	.coach-info {
		position: absolute;
		left: 50rpx;
		top: 10rpx;
	}
	.state-time {
		font-weight: 300;
		color: rgba(32, 32, 32, 0.5);
		font-size: 24rpx;
	}
	.state-val {
		font-size: 60rpx;
		font-weight: bold;
		margin-top: 50rpx;
	}
	position: relative;
	width: 100%;
	color: #fff;
	z-index: 99;
}
.head-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 450rpx;
	z-index: 1;
	background: linear-gradient(
		180deg,
		#0dbc14 0%,
		rgba(13, 188, 20, 0) 100%
	);
}
::v-deep .u-navbar__content {
	z-index: 99;
}
</style>
