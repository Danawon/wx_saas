<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="自习课管理"
		></head-nav>
		<view class="page pad20">			
			<view class="page-li  flex-a ju-ar mar-t20">
				<view class="data-title">查看日期：</view>
				<view class="w80 viewDate">
					<uni-datetime-picker
						:clear-icon="false"
						v-model="viewDateRange"
						@change="viewDateChange"
						type="date"
						return-type=""
						rangeSeparator="至"
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
					v-for="(item, index) in list"
					:key="index"
				>
					<view class="info-box">
						<view class="">
							{{ item.field }}
						</view>
						<view class="ipt-box mar-t20 w80 flex-row flex-a">
							<text class="lable">限</text>
							<u-input
								fontSize="24rpx"
								suffixIcon="人"
								:suffixIconStyle="{fontSize: '20rpx'}"
								:customStyle="{height: '50rpx'}"
								
								placeholderStyle="font-size: 20rpx"
								v-model="item.number"
								type="number"
							></u-input>
						</view>
					</view>
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
				<view class="w80">
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
			<view class="btn-box mar-t40">
				<view class="btn flex" @click="confirmFun">发布</view>
			</view>
		</view>
	</view>
</template>

<script>
import { timestampToTime } from '@/utils/util.js';
import { selfStudyCourseInfo, editSelfStudyCourse } from "@/api/admin.js"
export default {
	data() {
		return {
			list: [], // 列表
			/* 查看日期 val */
			viewDateRange: "",
			/* 日期val */
			dateRange: [],
			/* 日期最小值 */
			startDate: "",
		};
	},
	onLoad() {
		this.startDate = timestampToTime(new Date().getTime() / 1000).split(' ')[0]
		/* 发布日期 默认选中当天 */
		this.dateRange = [
			timestampToTime(new Date().getTime() / 1000).split(' ')[0], 
			timestampToTime(new Date().getTime() / 1000).split(' ')[0]
		]
		this.viewDateRange =
			timestampToTime(new Date().getTime() / 1000).split(' ')[0]
		
		// 获取自习课
		this.getSelfStudyCourseInfo();
	},
	methods: {
		/* 训中查看日期 */
		viewDateChange(eve) {
			this.viewDateRange = eve;
			this.getSelfStudyCourseInfo();
		},
		// 获取上/下 天教练时段
		setNextTime(type) {
			if(type == 'after') {
				/* 下一天 */
				this.viewDateRange = timestampToTime((new Date(this.viewDateRange).getTime() / 1000) + 86400).split(' ')[0];
			}else if(type == 'before') {
				/* 上一天 */
				this.viewDateRange = timestampToTime((new Date(this.viewDateRange).getTime() / 1000) - 86400).split(' ')[0];
			}
			this.getSelfStudyCourseInfo();	
		},
		// 选中发布日期
		dateChange(eve) {
			this.dateRange = eve;
		},
		// 确定
		confirmFun() {
			let arr = [];
			let state = true;
			this.list.forEach(item => {
				if(item.is_set) {
					arr.push({
						period : item.period_id,
						number : item.number,
					})
					if(!item.period_id || !item.number) {
						state = false
					}
				}
			})
			if(!state) {
				uni.showToast({
					title: "请输入开始时间段的所有信息后保存",
					icon: "none"
				})
				return
			}
			if(!arr.length) {
				uni.showToast({
					title: "请选择开启时间段",
					icon: "none"
				})
				return
			}
			
			editSelfStudyCourse({
				date: this.dateRange.join(","),
				data: arr,
			}).then(res => {
				uni.showToast({
					title: res.msg,
					mask: true
				})
				setTimeout(() => {
					this.getSelfStudyCourseInfo();
				},1500)
			})
		},
		// 获取自习课
		getSelfStudyCourseInfo() {
			selfStudyCourseInfo({
				date: this.viewDateRange
			}).then(res => {
				this.list = res.data;
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	/deep/ .uni-date__x-input{
		padding: 0 !important;
		margin-left: 10rpx;
	}
	/deep/.uni-date-x {
		padding: 0 0 0 10rpx;
	}
	.data-title {
		width: 20%;
	}
	.w80 {
		width: 80%;
	}
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
	.page-list {
		flex-wrap: wrap;
		.page-li {
			padding: 10rpx 20rpx;
			width: 50%;
			font-size: 28rpx;
			border-bottom: #e7e7e7 1rpx solid;
			.info-box {
				width: 50%;
				.lable {
					font-size: 24rpx;
					margin-right: 10rpx;
				}
			}
		}
		.switch-box {
			color: #0dbc14;
			font-size: 24rpx;
		}
	}
	.btn-box {
		.btn {
			color: #fff;
			background: #fe5e10;
			font-size: 32rpx;
			height: 76rpx;
			border-radius: 96rpx;
			width: 100%;
		}
	}
</style>
