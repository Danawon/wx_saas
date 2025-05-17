<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="私教时段发布"
		></head-nav>
		<view class="page padlr20">
			<view class="page-li  flex-a ju-ar mar-t20">
				<view class="data-title">查看日期：</view>
				<view class="date-picker viewDate">
					<uni-datetime-picker
						:clear-icon="false"
						v-model="viewDateRange"
						@change="viewDateChange"
						type="date"
						return-type=""
						rangeSeparator="至"
						:start="startDate"
					/>
				</view>
				<view class="btn-options flex-row felx-a ju-bt">
					<view class="btn flex" @click="setNextTime('before')">
						前一天
					</view>
					<view class="btn flex" @click="setNextTime('after')">
						后一天
					</view>
				</view>
			</view>
			<view class="page-list flex-row flex-a mar-t20">
				<view
					class="page-li flex-a ju-bt padlr40"
					v-for="(item, index) in timeArr"
					:key="index"
				>
					<text>{{ item.field }}</text>

					<view class="switch-box flex-a">
						<u-switch
							activeColor="#0DBC14"
							v-model="item.is_set"
						></u-switch>
					</view>
				</view>
			</view>
			
			<view class="page-li  flex-a ju-bt mar-t40">
				<view class="data-title">发布日期：</view>
				<view class="date-picker">
					<uni-datetime-picker
						:clear-icon="false"
						v-model="dateRange"
						@change="dateChange"
						type="daterange"
						return-type=""
						rangeSeparator="至"
						:start="startDate"
					/>
				</view>
			</view>
			<view class="btn-box ">
				<view class="btn flex" :class="{forbidden: timeAuthorization == 2}" @click="releaseTimeFun">发布</view>
			</view>
		</view>
	</view>
</template>

<script>
import { timestampToTime } from '@/utils/util.js';
import { coachTimeFrame, releaseTime } from '@/api/admin.js';
export default {
	data() {
		return {
			// 时间段列表
			timeArr: [],
			curNow: '',
			// 教练id
			coachId: '',
			/* 日期val */
			dateRange: [],
			/* 日期最小值 */
			startDate: "",
			/* 查看日期 val */
			viewDateRange: "",
			/* 是否有权限发布时段 */
			timeAuthorization: 1,
		};
	},
	onLoad(eve) {
		this.startDate = timestampToTime(new Date().getTime() / 1000).split(' ')[0]
		this.coachId = eve.id;
		/* 发布日期 默认选中当天 */
		this.dateRange = [
			timestampToTime(new Date().getTime() / 1000).split(' ')[0], 
			timestampToTime(new Date().getTime() / 1000).split(' ')[0]
		]
		this.viewDateRange = 
			timestampToTime(new Date().getTime() / 1000).split(' ')[0]
		
		this.getCoachTimeFrame();
	},
	methods: {
		/* 训中查看日期 */
		viewDateChange(eve) {
			this.viewDateRange = eve;
			this.getCoachTimeFrame();
		},
		// 选中发布日期
		dateChange(eve) {
			this.dateRange = eve;
		},
		// 获取上 下 教练时段
		setNextTime(type) {
			if(type == 'after') {
				/* 下一天 */
				this.viewDateRange = timestampToTime((new Date(this.viewDateRange).getTime() / 1000) + 86400).split(' ')[0];
			}else if(type == 'before') {
				/* 上一天 */
				this.viewDateRange = timestampToTime((new Date(this.viewDateRange).getTime() / 1000) - 86400).split(' ')[0];
			}
			this.getCoachTimeFrame();	
		},
		// 发布时段
		releaseTimeFun() {
			if(this.timeAuthorization == 2) {
				return
			}
			let periodStr = "";
			this.timeArr.forEach((item, index) => {
				if(item.is_set) {
					periodStr = periodStr + item.id + ','
				}
			})
			periodStr = periodStr.slice(0, -1);
			releaseTime({
				coach_id: this.coachId,
				date: this.dateRange.join(","),
				period: periodStr,
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			})
		},
		// 获取教练时段
		getCoachTimeFrame(arr) {
			coachTimeFrame({
				coach_id: this.coachId,
				date: this.viewDateRange
			}).then(res => {
				this.timeArr = res.data.time;
				this.timeAuthorization= res.data.info.is_set
			});
		},
	}
};
</script>

<style lang="scss" scoped>
	.forbidden {
		background-color: #999 !important;
	}
	/deep/ .uni-date__x-input{
		padding: 0 !important;
	}
	/deep/.uni-date-x {
		padding: 0 0 0 10rpx;
	}
	.data-title {
		width: 20%;
	}
	.date-picker {
		width: 80%;
	}
.page {
	padding-left: 26rpx;
	padding-bottom: 30rpx;
	
	.page-li {
		.btn-options {
			width: 30%;
			font-size: 26rpx;
			.btn {
				border-radius: 10rpx;
				height: 60rpx;
				width: 47%;
				background-color: #9fc1e4;
				color: #fff;
			}
		}
		.viewDate {
			width: 44%;
		}
		font-size: 28rpx;
		font-weight: 400;
		color: rgba(32, 32, 32, 0.9);
	}
	.nav {
		height: 88rpx;
	}
	.page-list {
		flex-wrap: wrap;
		.page-li {
			width: 50%;
			height: 94rpx;
			font-size: 28rpx;
			border-bottom: #e7e7e7 1rpx solid;
			margin-bottom: 0;
		}
		.switch-box {
			color: #0dbc14;
			font-size: 24rpx;
		}
	}
	.btn-box {
		margin: 72rpx 36rpx;
		.btn {
			color: #fff;
			background: #fe5e10;
			font-size: 32rpx;
			height: 76rpx;

			border-radius: 96rpx;
			width: 100%;
		}
	}
}
</style>
