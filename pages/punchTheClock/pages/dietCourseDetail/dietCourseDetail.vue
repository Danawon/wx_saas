<template>
	<view>
		<head-nav
			title="课程详情(饮食)"
			:goBack="true"
		></head-nav>
		<view class="content ">
			<view class="head ">
				<view class="course-info ">
					<view class="corse-tit mar-b20 flex">
						<text>{{ courseInfo.title || '' }}</text>
						<text class="course-state mar-l20">{{ courseInfo.statusname || '' }}</text>
					</view>
					<view class="course-time mar-t20 flex">
						{{
							courseInfo.start_time || ''
						}}
					</view>
				</view>
				<u-line margin=" 5rpx 0 40rpx "></u-line>
				<!-- 教练信息 -->
				<view class="coach-info  flex-row flex-a">
					<view class="img-box ">
						<u--image
							:showLoading="true"
							shape="circle"
							:src="coachInfo.avatar"
							width="120rpx"
							height="120rpx"
						></u--image>
					</view>
					<view class="name-box flex-col ">
						<view class="name-info flex-row flex-a">
							<view class="name">
								{{ coachInfo.name || '' }}
							</view>
						</view>
						<view class="introduce-text text-elpis">
							{{ coachInfo.info || '暂无' }}
						</view>
					</view>
				</view>
				<u-line margin="40rpx 0 10rpx 0"></u-line>
			</view>
		</view>
		<view class="tabs-box">
			<u-tabs
				:list="tabList"
				:scrollable="false"
				:activeStyle="{
					color: '#434343',
					fontWeight: '600',
					transform: 'scale(1.05)'
				}"
				:inactiveStyle="{
					color: 'rgba(0,0,0,0.4000)',
					transform: 'scale(1)'
				}"
				@change="tabsChange"
				:current="tabsCurrent"
				lineColor="#434343"
				lineWidth="25rpx"
			></u-tabs>
			<u-line margin="10rpx 0 0rpx 0"></u-line>
			<view class="food-type ">
				<view class="">
					<view class="li padtb20 padlr40 flex-row flex-a ju-bt">
						<view class="time-lable lable">
							食物种类：
						</view>
						<view class="time-val lable-val flex-a flex-row ju-bt">
							<view class="val-box">
								<view class="" v-if="foodData.food_type">
									{{ foodData.food_type }}种
								</view>
								<view class="" v-else>
									暂无
								</view>
							</view>
							<view class="line"></view>
							<view class="describe-box">
								{{ foodData.food_type_description || '' }}
							</view>
						</view>
					</view>
					<view class="li  padtb20 padlr40 flex-row flex-a ju-bt">
						<view class="time-lable lable">
							蔬菜水果：
						</view>
						<view class="time-val lable-val flex-a flex-row ju-bt">
							<view class="val-box">
								<view class="" v-if="foodData.vegetable">
									{{ foodData.vegetable }}克
								</view>
								<view class="" v-else>
									暂无
								</view>
							</view>
							<view class="line"></view>
							<view class="describe-box">
								{{ foodData.vegetable_description || '' }}
							</view>
						</view>
					</view>
					<view class="li  padtb20 padlr40 flex-row flex-a ju-bt">
						<view class="time-lable lable">
							粗粮：
						</view>
						<view class="time-val lable-val flex-a flex-row ju-bt">
							<view class="val-box">
								<view class="" v-if="foodData.coarse_grain">
									{{ foodData.coarse_grain }}克
								</view>
								<view class="" v-else>
									暂无
								</view>
							</view>
							<view class="line"></view>
							<view class="describe-box">
								{{ foodData.coarse_grain_description || '' }}
							</view>
						</view>
					</view>
					<view class="li  padtb20 padlr40 flex-row flex-a ju-bt">
						<view class="time-lable lable">
							油脂：
						</view>
						<view class="time-val lable-val flex-a flex-row ju-bt">
							<view class="val-box">
								<view class="" v-if="foodData.grease">
									{{ foodData.grease }}克
								</view>
								<view class="" v-else>
									暂无
								</view>
							</view>
							<view class="line"></view>
							<view class="describe-box">
								{{ foodData.grease_description || '' }}
							</view>
						</view>
					</view>
					<view class="li  padtb20 padlr40 flex-row flex-a ju-bt">
						<view class="time-lable lable">
							盐：
						</view>
						<view class="time-val lable-val flex-a flex-row ju-bt">
							<view class="val-box">
								<view class="" v-if="foodData.salt">
									{{ foodData.salt }}克
								</view>
								<view class="" v-else>
									暂无
								</view>
							</view>
							<view class="line"></view>
							<view class="describe-box">
								{{ foodData.salt_description || '' }}
							</view>
						</view>
					</view>
					<view class="li  padtb20 padlr40 flex-row flex-a ju-bt">
						<view class="time-lable lable">
							其他：
						</view>
						<view class="time-val lable-val flex-a flex-row ju-bt">
							<view class="val-box">
								<view class="" v-if="foodData.other">
									{{ foodData.other }}克
								</view>
								<view class="" v-else>
									暂无
								</view>
							</view>
							<view class="line"></view>
							<view class="describe-box">
								{{ foodData.other_description || '' }}
							</view>
						</view>
					</view>
					<view class="li  padtb20 padlr40 flex-row flex-a ju-bt">
						<view class="time-lable lable">
							热量：
						</view>
						<view class="time-val lable-val flex-a flex-row ju-bt">
							<view class="val-box val-box-other">
								<view class="" v-if="foodData.calorie">
									{{ foodData.calorie }}千卡
								</view>
								<view class="" v-else>
									暂无
								</view>
							</view>
							<view class="line"></view>
							<view class="describe-box describe-box-other">
								{{ foodData.calorie_description || '' }}
							</view>
						</view>
					</view>
					<u-line margin="0"></u-line>
				</view>
			</view>
		</view>
		<view class="dietSuggest  pad40">
			<view class="tit">
				饮食建议
			</view>
			<view class="parse-box mar-t20" v-if="foodData.instructions">
				<u-parse :content="foodData.instructions"></u-parse>
			</view>
			<!-- <view class="textArea mar-t20">
				<u--textarea disabled maxlength="-1" height="200rpx" border="none" v-model="foodData.instructions" placeholder="这里是一段饮食建议" ></u--textarea>
			</view> -->
		</view>
		
		<view class="fot-btn flex " v-if="!btnStatus">
			<view class="btn flex" @click="goRouter">
				去上传
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { nutritionalPunchInfo } from "@/api/clockIn.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			tabList: [
				{
					name: '早餐',
					data: {},
				},
				{
					name: '午餐',
					data: {},
				},
				{
					name: '晚餐',
					data: {},
				},
				{
					name: '加餐',
					data: {},
				}
			],
			textareaVal: "", // 文本值
			taskId: "", // 任务id
			coachInfo: {}, // 教练信息
			courseInfo: {}, // 课程信息
			tabsCurrent: 0, // tabs下标
			// 食物数据
			foodData: {},
			btnStatus: 0,
		};
	},
	onLoad(eve) {
		this.taskId = eve.id;
		this.getNutritionalPunchInfo(); // 获取课程数据
	},
	methods: {
		// tabs发生改变
		tabsChange(eve) {
			this.tabsCurrent = eve.index;
			/* 获取当前数据是否已打卡 */
			this.btnStatus = Number(eve.data.status);
			this.foodData = eve.data; // 饮食数据
		},
		// 获取课程数据
		getNutritionalPunchInfo() {
			nutritionalPunchInfo({
				id: this.taskId
			}).then(res => {
				this.coachInfo = res.data.coachinfo;
				this.courseInfo = res.data.info;
				this.btnStatus = Number(res.data.meal_time.breakfast.status)
				this.tabList[0].data = res.data.meal_time.breakfast; // 早餐
				this.tabList[1].data = res.data.meal_time.lunch; // 午餐
				this.tabList[2].data = res.data.meal_time.dinner; // 晚餐
				this.tabList[3].data = res.data.meal_time.extra_meal; // 加餐
				this.foodData = this.tabList[0].data;
			});
		},
		goRouter() {
			uni.navigateTo({
				url: `/pages/punchTheClock/pages/nutritionClockin/nutritionClockin?id=${this.taskId}`
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	/deep/ video {
		width: 100% !important;
	}
	.course-time {
		font-size: 24rpx;
	}
	.li:nth-child(odd) {
		background-color: #f5f5f5;
		// border-radius: 20rpx;
	}
	
	.val-box-other {
		width: 24% !important;
	}
	.describe-box {
		width: 68% !important;
	}
	.line {
		height: 50rpx;
		width: 1px;
		background-color: #dadbde;
	}
	.time-val {
		width: 78%;
		.val-box {
			text-align: right;
			width: 20%;
			// background-color: #FE5E10;
		}
		.describe-box {
			width: 72%;
			// background-color: #333;
			font-size: 24rpx;
		}
		// background-color: #999;
	}
	.time-lable {
		width: 22%;
		// background-color: #f99;
	}
	.fot-btn{
		.btn {
			width: 100%;
			height: 80rpx;
			background-color: #FE5E10;
			border-radius: 40rpx;
			color: #fff;
			font-size: 27rpx;
		}
		width: 100%;
		padding: 20rpx 20rpx 40rpx 20rpx;
	}
	::v-deep .u-textarea {
		background-color: #F9F9F9 !important;
	}
.dietSuggest {
	.tit {
		font-size: 36rpx;
		font-weight: 400;
		color: rgba(0,0,0,0.9000);
	}
}
.food-type {
	.lable-val {
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

.coach-info {
	.img-box {
		width: 22%;
	}
	.name-box {
		.introduce-text {
			font-weight: 500;
			color: rgba(0, 0, 0, 0.6);
			font-size: 28rpx;
		}
		.name-info {
			.tag {
				font-weight: 500;
				color: #fe5e10;
				font-size: 22rpx;
				background: #fff3ed;
				opacity: 1;
				border-radius: 30rpx;
				padding: 4rpx 10rpx;
			}
			.name {
				font-weight: 400;
				color: rgba(32, 32, 32, 0.9);
				font-size: 34rpx;
			}
			width: 100%;
		}
		width: 78%;
		padding: 10rpx;
		justify-content: space-between;
		height: 110rpx;
	}
}
.course-info {
	.course-state {
		font-weight: 500;
		color: #fe5e10;
		font-size: 28rpx;
	}
	.corse-tit {
		font-weight: bold;
		font-size: 35rpx;
		color: rgba(0, 0, 0, 0.9);
	}
	// margin-top: 50rpx;
}
.head {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 0 20rpx;
}
</style>
