<template>
	<view>
		<u-popup
			:show="timeShow"
			@close="closeSelectTime"
			round="30rpx"
			:safeAreaInsetBottom="false"
		>
			<view class="time-box">
				<view class="title">选择时段</view>
				<view class="scroll">
					<view
						class="time-list "
						
						v-for="(item, index) in dateList"
						:key="index"
						
					>
						<view class="list-box flex-row padtb20" :class="{'selectIndexSty': selectIndex === index}">
							<view class="time-l flex-row flex-a">
								<view class="time-day">
									{{ item.datename }}
								</view>
								<view
									class="time-frame flex-row flex-a"
								>
									<text
										style="margin-right: 10rpx;"
									>
										{{ item.field }}
									</text>
								</view>
							</view>
							<view class="time-r flex-row flex-a">
								<view class="info-tips">
									<text v-if="item.appointment_count > 0 && type == 'store' && !(item.appointment_count === 1 && item.max_appointment_count === 1)  ">
										已约{{ item.appointment_count }}人/{{ item.max_appointment_count }}人
									</text>
									
								</view>
								<view class="btn-box">
									<view
										class="btn-full flex"
										v-if="item.appointment_status_code == 1"
									>
										已约满
									</view>
									<view
										class="btn-appointmen flex"
										v-if="item.appointment_status_code == 2"
										@click="selectTimeFun(item, index)"
									>
										预约
									</view>
									<view
										class="btn-already-appointmen flex"
										v-if="item.appointment_status_code == 3"
									>
										已预约
									</view>
									<view
										class="btn-already-appointmen flex"
										v-if="item.appointment_status_code == 4"
									>
										不可预约
									</view>
								</view>
							</view>
						</view>
						<u-line margin="10rpx 0" v-if="index != dateList.length -1"></u-line>
					</view>
				</view>
				<u-line margin="40rpx 0 35rpx"></u-line>
				<view class="btn-box flex-row flex-a ju-ar">
					<view class="fot-btn flex" @click="timeShow = false">
						退出
					</view>
					<view class="fot-btn flex" @click="confirmFun">
						确定
					</view>
				</view>
			
			</view>
		</u-popup>
	</view>
</template>

<script>
import { getCoachSelectTime } from '@/api/storeApis.js';
export default {
	// 选择预约时间组件
	name: 'selectTime',
	props: {
		type: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			timeShow: false,
			dateList: [],
			// 选中时间段下标
			selectIndex: "",
			// 选中时间段id
			selectTimeId: "",
			// 课程类型
			courseType: "",
			// 教练id
			coachId: '',
			// 选中日期
			selectDate: '',
			// 是否是居家调用
			homeState: false,
		};
	},
	methods: {
		// 选中预约时间段
		selectTimeFun(item, index) {
			// 选中时间段下标
			this.selectIndex = index;
			// 选中时间段id
			this.selectTimeId = item.id;
		},
		// 获取教练选择时间段
		getSelectTime() {
			let _this = this;
			getCoachSelectTime({
				coach_id: _this.coachId,
				date: _this.selectDate,
				product: this.homeState ? "home_training" : ""
			}).then(res => {
				_this.dateList = res.data;
			});
		},
		// 点击确定
		confirmFun() {
			if(!this.selectTimeId) {
				return
			}
			this.closeSelectTime();
			let selectObj = {
				period: this.selectTimeId, // 选中时间段 id
				card_type: this.courseType	,// 课程类型
				date: this.selectDate,	// 选中日期
				coach_id: this.coachId,	// 教练
				storeId: this.storeId, // 门店id
			}
			uni.navigateTo({
				url:
					`/pages/store/pages/buyCourseDetail/buyCourseDetail?parentData=${JSON.stringify(selectObj)}&type=course`
			});
		},
		openSelectTime(obj) {
			// 清空历史选中时间段
			this.selectIndex = "";
			this.selectTimeId = "";
			this.timeShow = !this.timeShow;
			// 课程类型
			this.courseType = obj.courseType
			// 选中日期
			this.selectDate = obj.selectDate;
			// 当前选中教练id
			this.coachId = obj.coachId;
			// 门店id
			this.storeId = obj.storeId;
			// 是否是居家调用
			this.homeState = obj.homeState ?? false
			// 获取可选择时间段
			this.getSelectTime();
		},
		closeSelectTime() {
			this.timeShow = !this.timeShow;
		}
	}
};
</script>

<style lang="scss" scoped>
	.fot-btn {
		width: 40%;
		height: 50rpx;
		box-shadow: 0 0 10rpx 5rpx #eee;
		border-radius: 10rpx;
	}
.selectIndexSty {
	background: linear-gradient(100deg, #FFA376 0%, rgba(255,163,118,0) 100%);
	border-radius: 10rpx;
}
.time-list {
	.time-r {
		.btn-box {
			.btn-full {
				color: #ef0708;
				border: 1px solid #ef0708;
			}
			.btn-appointmen {
				color: #0dbc14;
				border: 1px solid #0dbc14;
			}
			.btn-already-appointmen {
				color: #999999;
				border: 1px solid #999999;
			}
			.btn-full,
			.btn-appointmen,
			.btn-already-appointmen {
				padding: 5rpx 10rpx;
				// width: 110rpx;
				border-radius: 10rpx;
				font-size: 27rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
			}
		}
		.info-tips {
			font-family: PingFang SC-Light, PingFang SC;
			font-weight: 300;
			color: rgba(32, 32, 32, 0.9);
			font-size: 23rpx;
			margin-right: 10rpx;
		}
		width: 50%;
		justify-content: flex-end;
	}
	.time-l {
		.time-frame {
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #202020;
			font-size: 28rpx;
		}
		.time-day {
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			font-size: 28rpx;
		}
		width: 43%;
		justify-content: space-between;
	}
	justify-content: space-between;
	// margin: 20rpx 0;
}

.title {
	font-family: PingFang SC-Medium, PingFang SC;
	font-weight: bold;
	color: #202020;
	font-size: 33rpx;
	text-align: center;
	margin-bottom: 30rpx;
}
.scroll {
	max-height: 600rpx;
	overflow-y: scroll;
}
.time-box {
	padding: 30rpx;
}
</style>
