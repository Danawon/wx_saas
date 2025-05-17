<template>
	<view class="wrap">
		<head-nav title="训练打卡" :goBack="true"></head-nav>
		<u-line></u-line>
		<view class="pad20">
			<!-- 任务开始时间 -->
			<view class=" head-info flex-row flex-a ju-bt ">
				<view class="time-lable ">
					打卡时间：
				</view>
				<view class="time-val ">
					{{ courseInfo.finishtime || '' }}
				</view>
			</view>	
			</view>
			<!-- 心率表组件 -->
			<heart-rate-chart
				ref="heartRef"
			></heart-rate-chart>
			<view
				class="shadow-box padlr20"
			>
				<!-- 条状图 组件 -->
				<strip-chart
					v-if="aerobicCylinder.length"
					:stripData="aerobicCylinder"
				></strip-chart>
				<!-- eacharts 图表 -->
				<view class="echarts-box" v-if="!Array.isArray(aerobicDiagram)">
					<echarts-chart :chartObj="aerobicDiagram"></echarts-chart>
				</view>
			</view>
			<view class="pad20">
			<view class="feel-box">
				<view class="feel-tit mar-b20">请选择您的感受</view>
				<view class="feel-list flex-row flex-a mar-t20">
					<view
						class="li flex-col flex-a"
						v-for="(item, index) in feelImgs"
						:key="index"
						:class="{
							'select-li': selectFeel == index
						}"
						@click="selectFeelChange(index)"
					>
						<view class="img-box">
							<image
								:src="selectFeel == index ? item.imgSelected : item.img"
								mode=""
							></image>
						</view>

						<view class="li-txt ">
							{{ item.txt }}
						</view>
					</view>
				</view>
			</view>
			<u-line margin="40rpx 0"></u-line>
			<!-- 底部按钮 -->
			<view class="fot-btn mar-t40 pad-b20">
				<view class="btn flex" @click="confirmFun">
					提交打卡
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
// 心率表组件
import heartRateChart from '@/components/heartRateChart/heartRateChart';
// eacharts图表
import echartsChart from '@/pages/punchTheClock/pages/components/echartsChart/echartsChart.vue';
// 条状图 组件
import stripChart from '@/components/stripChart/stripChart.vue';
import { clockInCourse, upLoadImg, getSubmitEquipmentInfo } from '@/api/clockIn.js';
export default {
	components: {
		heartRateChart,
		echartsChart,
		stripChart
	},
	data() {
		return {
			baseUrl: baseUrl,
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
			// 选中训练感受
			selectFeel: 3,
			task_id: {} ,// 课程任务id
			courseInfo: {}, // 详细数据
			/* 强度图表数据 */
			aerobicCylinder: "",
			/* 心率图表 数据 */
			aerobicDiagram: {},
		};
	},
	onLoad(eve) {
		this.task_id = eve.task_id;
		/* 设备图表组件 数据传参 */
		this.getSubmitEquipmentInfoFun();
	},
	methods: {
		/* 获取提交的设备信息 */
		getSubmitEquipmentInfoFun() {
			getSubmitEquipmentInfo({
				task_id: this.task_id
			}).then(res => {
				this.aerobicDiagram= res.data.aerobic_diagram;
				this.courseInfo = res.data.info;
				this.aerobicCylinder= res.data.aerobic_cylinder
				this.$refs.heartRef.getData(this.courseInfo, 'clockIn');
			}) 
		},
		// 选择感受发生改变
		selectFeelChange(index) {
			this.selectFeel = index;
		},
		/* 提交打卡 */
		confirmFun() {
			let _this = this;
			uni.showModal({
				title: "打卡提示",
				content: "确定提交打卡吗？",
				cancelText: "重新打卡",
				confirmText: "确定打卡",
				success(e) {
					if(e.confirm) {
						_this.clockInCourseFun();
					}else {
						uni.navigateBack()
					}
				}
			})
		},
		// 打卡课程
		clockInCourseFun() {
			clockInCourse({
				id: this.courseInfo.task_id, // 任务id
				experience: this.feelImgs[this.selectFeel].txt, // 训练感受
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					// 跳转打卡结果页面
					uni.navigateBack({
						delta: 2
					})
				}, 1500);
			});
		},


	}
};
</script>

<style lang="scss" scoped>
.head-info {
	color: #333;
	font-size: 28rpx;
}
.shadow-box {
	box-shadow: 0rpx 0rpx 20rpx 1rpx #f5f5f5;
}
.fot-btn {
	.btn {
		width: 100%;
		height: 80rpx;
		border-radius: 40rpx;
		color: #fff;
		background-color: #fe5e10;
	}
}
.feel-tit {
	color: rgba(0, 0, 0, 0.9);
	font-weight: bold;
	font-size: 33rpx;
}
.feel-box {
	.feel-list {
		.select-li {
			color: #fe5e10;
		}
		.li {
			.li-txt {
				font-size: 26rpx;
				margin-top: 10rpx;
			}
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
</style>
