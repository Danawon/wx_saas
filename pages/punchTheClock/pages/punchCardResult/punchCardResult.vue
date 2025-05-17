<template>
	<view class="wrap pad-b40">
		<head-nav
			title="结果分析"
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
						v-if="resultInfo.score == 'up_standard'"
					>
						未达标
					</text>
					<text v-if="resultInfo.score == 'standard'">
						达标
					</text>
					<text
						v-if="resultInfo.score == 'exceed_quota'"
					>
						超标
					</text>
					<text v-if="resultInfo.score == 'no_score'">
						未点评
					</text>
				</view>
				<view class="state-time mar-t20">
					{{ resultInfo.scoretime || '' }}
				</view>
			</view>
		</view>
		<!-- 教练点评 -->
		<view class="result-content pad20 mar-t40">
			<view class="tit">教练点评</view>
			<view class="cont-txt pad20 mar-t20">
				<view class="txt">
					{{ resultInfo.analysis || '暂无' }}
				</view>
				<view class="txt-time mar-t40">
					{{ resultInfo.scoretime || '' }}
				</view>
			</view>
		</view>
		<!-- 打卡数据模块 -->
		<view class="data-box ">
			<view class="chart-box mar-b20" v-if="resultInfo">
				<!-- 心率表组件 -->
				<heart-rate-chart
					ref="heartRef"
				></heart-rate-chart>
				<!-- 条状图 组件 -->
				<view class="padlr20">
					<strip-chart
						v-if="resultInfo.aerobic_cylinder.length"
						:stripData="resultInfo.aerobic_cylinder"
					></strip-chart>
					<!-- eacharts 图表 -->
					<view class="echarts-box" v-if="!Array.isArray(resultInfo.aerobic_diagram)">
						<echarts-chart :chartObj="resultInfo.aerobic_diagram"></echarts-chart>
					</view>
				</view>
			</view>
			<view class="line martb20"></view>
			
		</view>
	</view>
</template>

<script>
// eacharts图表
import echartsChart from '@/pages/punchTheClock/pages/components/echartsChart/echartsChart.vue';
// 条状图 组件
import stripChart from '@/components/stripChart/stripChart.vue';
//心率图
import heartRateChart from '@/components/heartRateChart/heartRateChart.vue';
import { baseUrl } from '@/utils/baseUrl.js';
import { getAnalysisResults } from '@/api/clockIn.js';
export default {
	components: {
		echartsChart,
		stripChart,
		heartRateChart
	},
	data() {
		return {
			baseUrl: baseUrl,
			// 任务id
			taskId: '',
			resultInfo: {}, // 结果数据
			coachInfo: {}, // 教练信息
		};
	},
	onLoad(eve) {
		this.taskId = eve.id;
		this.getAnalysisResultsFun(); // 获取分析结果
	},
	methods: {
		// 图片预览
		previewFun(img) {
			// 预览图片
			uni.previewImage({
				urls: [img],
				longPressActions: {
					success: function(data) {},
					fail: function(err) {
					}
				}
			});
		},
		// 获取分析结果
		getAnalysisResultsFun() {
			getAnalysisResults({
				task_id: this.taskId
			}).then(res => {
				this.resultInfo = res.data.info;
				this.coachInfo = res.data.coachinfo;
				this.$refs.heartRef.getData(
					this.resultInfo,
					'result'
				);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.info-name {
		font-size: 26rpx;
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
.result-content {
	.tit {
		font-weight: 550;
		color: rgba(0, 0, 0, 0.9);
		font-size: 28rpx;
	} 
	.cont-txt {
		.txt-time {
			font-weight: 300;
			color: #999999;
			font-size: 22rpx;
		}
		.txt {
			font-weight: 400;
			color: #202020;
			line-height: 44rpx;
			font-size: 26rpx;
		}
		width: 100%;
		border: 20rpx;
		background-color: #f9f9f9;
		border-radius: 20rpx;
	}
}
.line {
	width: 100%;
	height: 15rpx;
	background-color: #f5f5f5;
}

.lable {
	font-weight: 500;
	color: #999999;
	font-size: 30rpx;
}
.lable-val {
	font-weight: 400;
	color: #434343;
	font-size: 30rpx;
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
::v-deep .u-navbar__content {
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
.wrap {
	background-color: #fff;
}
</style>
