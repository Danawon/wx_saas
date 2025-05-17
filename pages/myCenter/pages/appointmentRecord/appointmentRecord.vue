<template>
	<view class="wrap-min">
		<head-nav
			title="约课记录"
			bgColor="#fff"
			:goBack="!type"
			:goIndex="type"
		></head-nav>
		<view class="search-box  pad20">
			<view class="search-ipt">
				<u-search
					borderColor="#FE5E10"
					shape="round"
					bgColor="#fff"
					height="70rpx"
					placeholder="搜索关键词"
					:showAction="false"
					:inputStyle="{
						'padding-right': '95rpx'
					}"
					v-model="searchCoachVal"
				></u-search>
			</view>
			<view class="search-btn flex" @click="searchCoach">
				搜索
			</view>
		</view>
		<view class="content pad20">
			<u-tabs
				:scrollable="false"
				:list="tabList"
				lineColor="#FE5E10"
				:activeStyle="{
					color: '#FE5E10',
					fontWeight: 'bold',
					transform: 'scale(1.05)'
				}"
				:inactiveStyle="{
					color: '#606266',
					transform: 'scale(1)'
				}"
				:current="tabsCurrent"
				@change="tabsChange"
			></u-tabs>
			<view class="tab-list ">
				<view
					class="li mar-t20"
					v-for="(item, index) in courseList"
					:key="index"
					@click="goRouter(item)"
				>
					<view class="time-state flex-r flex-a ju-bt">
						<view class="time">
							{{ item.createtime }}
						</view>
						<view class="state">
							<text
								class="state1 state-txt"
								v-if="item.status == 1 || item.status == 3"
							>
								{{ item.status_text }}
							</text>
							<text
								class="state2 state-txt"
								v-if="item.status == 2"
							>
								已完成
							</text>
							<text
								class="state2 state-txt"
								v-if="item.status == 4"
							>
								进行中
							</text>
							<text
								class="state3 state-txt"
								v-if="item.status == -1"
							>
								已取消
							</text>
							<text
								class="state4 state-txt"
								v-if="item.status == -2"
							>
								已失效
							</text>
						</view>
					</view>
					<view
						class="task-info flex-row flex-a mar-t20"
					>
						<view class="bom-img">
							<u--image
								:showLoading="true"
								:src="item.class_image"
								width="150rpx"
								height="150rpx"
								radius="20rpx"
							></u--image>
						</view>
						<view class="bom-rInfo  flex-col pad20">
							<view class="card-title text-elpis">
								{{ item.class_name || '' }}
							</view>
							<view
								class="card-residueDays text-elpis mar-t15"
							>
								预约时间：{{ item.datename }} {{ item.period }}
							</view>
							<view
								class="card-residueDays text-elpis "
							>
								教练：{{ item.coach.name || '无' }}
							</view>
							<!-- 进度 -->
							<view
								class="card-schedule text-elpis"
							>
								上课地点：{{
									item.storename
								}}
							</view>
						</view>
					</view>
					<u-line margin="20rpx 0"></u-line>
				</view>
			</view>

			<u-empty
				v-if="!courseList.length"
				mode="list"
				text="暂无记录..."
			></u-empty>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getSubscribeCourse } from '@/api/myCenter.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 搜索框val
			searchCoachVal: '',
			tabList: [
				{
					name: '未完成',
					status: 1
				},
				{
					name: '已完成',
					status: 2
				},{
					name: '进行中',
					status: 4
				},
				{
					name: '已取消',
					status: -1
				},
				{
					name: '已失效',
					status: -2
				}
			],
			// tabs当前页
			tabsCurrent: 0,
			// 数据当前页
			current: 1,
			// 课程列表
			courseList: [],
			// 上一级页面类型 是否返回首页
			type: "",
		};
	},
	onLoad(e) {
		this.type = e.type ?? ''
	},
	onShow() {
		this.resetFun();
	},
	onReachBottom() {
		this.current++;
		this.getSubscribeCourseFun();
	},
	methods: {
		// 获取约课记录
		getSubscribeCourseFun() {
			getSubscribeCourse({
				list_rows: 20,
				page: this.current,
				status: this.tabList[this.tabsCurrent].status
			}).then(res => {
				this.courseList = [
					...this.courseList,
					...res.data.data
				];
			});
		},
		// 数据重置
		resetFun() {
			this.current = 1;
			this.courseList = [];
			this.getSubscribeCourseFun();
		},
		goRouter(eve) {
			uni.navigateTo({
				url: `/pages/myCenter/pages/appointmentDetails/appointmentDetails?orderId=${
					eve.order_id
				}`
			});
		},
		// tabsChange
		tabsChange(eve) {
			this.tabsCurrent = eve.index;
			this.resetFun();
		}
	}
};
</script>

<style lang="scss" scoped>
.tab-list {
	.li {
		.task-info {
			.bom-rInfo {
				.mar-t15 {
					margin-top: 15rpx;
				}
				.card-activateTime,
				.card-residueDays,
				.card-schedule {
					width: 100%;
					font-size: 24rpx;
					color: rgba(32, 32, 32, 0.6);
				}
				.card-title {
					font-size: 33rpx;
					font-weight: 600;
					color: rgba(0, 0, 0, 0.9);
				}
				width: 70%;
				font-size: 26rpx;
				justify-content: space-between;
			}
			.bom-img {
				width: 22%;
			}
			width: 100%;
		}
		.time-state {
			.state {
				.state1 {
					color: #0dbc14;
				}
				.state2 {
					color: #fe5e10;
				}
				.state3 {
					color: #ef0708;
				}
				.state4 {
					color: #999999;
				}
				.state-txt {
					font-weight: 400;
					font-size: 28rpx;
				}
			}
			.time {
				font-weight: 300;
				color: #999999;
				font-size: 24rpx;
			}
		}
	}
}
.content {
	background-color: #fff;
}
.search-box {
	.search-btn {
		width: 150rpx;
		height: 75rpx;
		color: #fff;
		font-size: 28rpx;
		margin-left: -20rpx;
		background: linear-gradient(
			102deg,
			#ff7c3c 0%,
			#fe5e10 100%
		);
		border-radius: 50rpx;
		position: absolute;
		top: 20rpx;
		right: 20rpx;
	}
	.search-ipt {
		width: 95%;
	}
	width: 100%;
	position: relative;
	background-color: #fff;
}
</style>
