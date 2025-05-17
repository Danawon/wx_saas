<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="消课记录"></head-nav>
		<view class="page">
			<view class="page-top flex-a padtb40">
				<view class="img-box">
					<u--image :src="headInfo.user.avatar" width="128rpx" height="128rpx" shape="circle"></u--image>
				</view>
				<view class="msg-box pad-l40 flex-col">
					<text class="name">{{ headInfo.user.nickname }}</text>
					<text class="time">{{ headInfo.membercard_name }}</text>
					<text class="time text-elpis">约课次数/总次数：{{ headInfo.total_times - headInfo.number  }}/{{ headInfo.total_times }}</text>
				</view>
				<view class="msg-box pad-l40 flex-col" style="margin-left: auto;">
					<view class="">
						<text class="name">{{ headInfo.membercard_price }}</text>
						元
					</view>
					<text class="time">剩余天数：{{ headInfo.shenday }}</text>
					<text class="time text-elpis">激活时间：{{ headInfo.activation_time }}</text>
				</view>
			</view>
			<view class="calendar-box flex-a">
				<uni-datetime-picker
					v-model="dateRange"
					@change="dateChange"
					type="daterange"
					return-type=""
					rangeSeparator="至"
				/>
			</view>
			<view class="statistical-box flex-col">
				<text>数据总计</text>
				<view class="flex-a ju-bt">
					<view class="flex-col w50 flex">
						<view class="">
							<text class="num">{{ statisticsInfo.count }}</text>
							次
						</view>
						<view class="txt">消课总计</view>
					</view>
					<view class="flex-col w50 flex">
						<view class="">
							￥
							<text class="num">{{ statisticsInfo.total_course_fee }}</text>
						</view>
						<view class="txt">消课金额</view>
					</view>
				</view>
			</view>

			<view class="page-list ">
				<view class="page-li pad20 " v-for="(item, index) in list">
					<view class="flex-a ju-bt pad-b20">
						<text class="time">消课时间：{{ item.scan_time }}</text>
						<text class="text">销售：{{ item.sale_name }}</text>
					</view>
					<view class="flex-a">
						<view class="img-box">
							<u--image :src="item.coach.avatar" width="150rpx" height="150rpx" radius="20rpx"></u--image>
						</view>
						<view class="msg-box pad-l40 flex-col">
							<text class="name">{{ item.productname }}</text>
							<text class="time">会员卡名称：{{ headInfo.membercard_name }}</text>
							<text class="time text-elpis" >预约场地︰{{ item.storename }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
	</view>
</template>

<script>
import { cardCancelClasses, getCoachList, cancel_classes_detail, cancel_classes_list } from '@/api/storeApis.js';
export default {
	data() {
		return {
			/* 会员卡id */
			card_id: '', 
			/* 当前页 */
			current: 1,
			list: [],
			/* 选中日期 */
			dateRange: "",
			// 页头信息
			headInfo: {}, 
			/* 统计信息 */
			statisticsInfo: {},
			/* 教练id */
			coachId: "",
			/* 父级页面日期 */
			date: ""
		};
	},
	onLoad(e) {
		this.coachId = e.coachId
		this.card_id = e.card_id;
		this.date = e.date
		this.get_cancel_classes_detail();
		/* 获取消课列表 */
		this.get_cancel_classes_list();
	},
	onReachBottom() {
		this.current ++
		this.get_cancel_classes_list();
	},
	methods: {
		// 选中日期
		dateChange(eve) {
			this.dateRange = eve.join(',');
			this.list = [];
			this.current = 1;
			this.get_cancel_classes_list();
			// this.onReset();
		},
		/* 获取消课详情列表 */
		get_cancel_classes_list() {
			cancel_classes_list({
				user_membercard_id: this.card_id,
				list_rows: 20,
				page: this.current,
				date: this.dateRange.length ? this.dateRange : this.date,
				coach_id: this.coachId,
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			})
		},
		/* 获取消课详情 */
		get_cancel_classes_detail() {
			cancel_classes_detail({
				user_membercard_id: this.card_id,
				coach_id: this.coachId,
				date: this.date
			}).then(res => {
				this.headInfo= res.data.info;
				this.statisticsInfo = res.data.statistics
			})
		},
	}
};
</script>

<style lang="scss">
.page {
	padding: 28rpx;
	background: #f9f9f9;

	.page-top {
		align-items: flex-start;
		border-bottom: 1rpx solid #e7e7e7;

		.name {
			font-size: 32rpx;
			font-weight: 500;
			color: #202020;
		}

		.time {
			margin-bottom: 10rpx;
			font-weight: 400;
			font-size: 22rpx;
			color: #999999;
		}
		.li-right {
			margin-left: auto;
			height: 230rpx;
		}
		.text {
			color: #fe5e10;
			font-size: 24rpx;
		}
	}

	.coach-box {
		text {
			margin-right: 30rpx;
		}
		.ipt-box {
			border-radius: 8rpx;
			background: #f9f9f9;
			width: 75%;
			flex-shrink: 0;
			padding: 14rpx 0 14rpx 34rpx;
		}
	}

	.btn {
		font-size: 32rpx;
		color: #ffffff;
		height: 74rpx;
		background: #fe5e10;
		border-radius: 58rpx;
	}

	.statistical-box {
		background-color: #ffe6da;
		border-radius: 24rpx;
		margin: 30rpx 0;
		padding-bottom: 26rpx;

		text {
			padding: 26rpx;
			margin-bottom: 10rpx;
			font-size: 32rpx;
			text-align: center;
			color: #202020;
		}

		.txt {
			font-size: 22rpx;
			color: #999999;
		}
		.num {
			font-weight: 600;
			padding: 0;
			font-size: 40rpx;
		}
	}

	.page-list {
		.page-li {
			align-items: flex-start;
			border-radius: 32rpx;
			background: #ffffff;
			margin-bottom: 20rpx;

			.name {
				font-size: 32rpx;
				font-weight: 500;
				color: #202020;
			}

			.time {
				margin-bottom: 10rpx;
				font-weight: 400;
				font-size: 22rpx;
				color: #999999;
			}
			.li-right {
				margin-left: auto;
				height: 230rpx;
			}
			.text {
				color: #fe5e10;
				font-size: 24rpx;
			}
			.look {
				border: #999999 1rpx solid;
				border-radius: 8rpx;
				color: #999999;
				width: 176rpx;
				height: 58rpx;
				font-size: 28rpx;
			}
		}
	}
}
</style>
