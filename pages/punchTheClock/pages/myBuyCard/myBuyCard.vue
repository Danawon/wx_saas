<template>
	<view class="wrap-min">
		<head-nav title="我购买的"   :goBack="!ifPayGetHere"
			:goIndex="ifPayGetHere"></head-nav>
		<!-- tabs 盒子 -->
		<u-sticky bgColor="#fff">
			<u-tabs
				:list="tabsList"
				lineColor="#FE5E10"
				:scrollable="false"
				:activeStyle="{
					color: '#FE5E10',
					fontWeight: 'bold',
					transform: 'scale(1.05)'
				}"
				:inactiveStyle="{
					color: 'rgba(0,0,0,0.6000)',
					transform: 'scale(1)'
				}"
				:current="selectTabs"
				@change="changeTabs"
			></u-tabs>
		</u-sticky>
		
		<view class="list-box mar-t20 pad20" >
			<view class="list-li mar-b20" v-for="(item, index) in courseList" :key="index" @click="goRouter(item)">
				<view class="li-top mar-b40 flex-row flex-a">
					<view class="top-buyTime">
						购买时间: {{ item.paidtime }}
					</view>
					<view class="top-state">
						<text class="state1 state" v-if="item.status == 2">{{ item.statusname }}</text>
						<text class="state2 state" v-if="item.status == 3 || item.status == -1">{{ item.statusname }}</text>
						<text class="state1 state" v-if="item.status == 1">{{ item.statusname }}</text>
					</view>
				</view>
				<view class="li-bom flex-row flex-a">
					<view class="bom-img">
						<u--image
							:showLoading="true"
							:src="item.product.image"
							width="100%"
							height="230rpx"
							radius="20rpx"
						></u--image>
					</view>
					<view class="bom-rInfo pad20 flex-col">
						<view class="card-title text-elpis">
							{{ item.product.title }}
						</view>
						<view class="card-activateTime text-elpis">
							激活时间: {{ item.activation_time || '未激活' }} 
						</view>
						<view class="card-residueDays text-elpis">
							课程剩余天数：{{ item.shenday }}天
						</view>
						<!-- 进度 -->
						<view class="card-schedule text-elpis">
							<text>当前进度：</text>
							<text>已上课{{ item.task_status1 }}次</text>
							<text class="residue-days">剩余{{ item.task_status0 }}次</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-empty
			v-if="!courseList.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getMyCourse } from "@/api/clockIn.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// tabs
			tabsList: [
				{
					name: '全部',
					id: "",
				},
				{
					name: '待激活',
					id: 1
				},
				{
					name: '进行中',
					id: 2
				},
				{
					name: '已完成',
					id: 3
				},
			],
			// 选中的tabs下标
			selectTabs: 0,
			// 课程列表
			courseList: [],
			// 当前页
			current: 1,
			// 是否是支付成功跳转到此 如果其返回按钮到首页
			ifPayGetHere: "",
			
		};
	},
	onLoad(eve) {
		if(eve.selectType) {
			this.selectTabs = Number(eve.selectType)
		}
		/* 是否是支付成功跳转到此 如果其返回按钮到首页 */
		this.ifPayGetHere = eve.type
		this.getMyCourseList();
	},
	onReachBottom() {
		this.current ++ 
		this.getMyCourseList();
	},
	methods: {
		// 跳转课程详情
		goRouter(eve) {
			uni.navigateTo({
				url: `/pages/punchTheClock/pages/courseTask/courseTask?id=${eve.id}`
			})
		},
		// tabschange
		changeTabs(eve) {
			this.selectTabs = eve.index
			this.courseList = [];
			this.current = 1;
			this.getMyCourseList();
		},
		// 获取我的课程
		getMyCourseList() {
			getMyCourse({
				page: this.current,
				list_rows: 20,
				status: this.tabsList[this.selectTabs].id
			}).then(res => {
				this.courseList = [...this.courseList, ...res.data.data]
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	.list-li {
		.li-bom {
			.bom-rInfo {
				.card-schedule {
					.residue-days {
						color: #FE5E10;
						margin-left: 10rpx;
					}
				}
				.card-activateTime,
				.card-residueDays,
				.card-schedule {
					width: 100%;
					font-weight: 300;
					color: rgba(0,0,0,0.6000);
				}
				.card-title {
					font-size: 33rpx;
					font-weight: 600;
					color: rgba(0,0,0,0.9000);
				}
				width: 60%;
				height: 230rpx;
				font-size: 26rpx;
				justify-content: space-between;
			}
			.bom-img {
				width: 40%;
			}
			width: 100%;
			justify-content: space-between;
		}
		.li-top {
			.top-state {
				.state {
					font-weight: 400;
					font-size: 33rpx;
				}
				.state1 {
					color: rgba(13,188,20,0.9000);
				}
				.state2 {
					color: #eee;
				}
			}
			.top-buyTime {
				font-weight: 400;
				color: rgba(0,0,0,0.6000);
				font-size: 28rpx;
			}
			justify-content: space-between;
		}
		width: 100%;
		// height: 300rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx 20rpx;
	}
</style>
