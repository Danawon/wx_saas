<template>
	<view>
		<head-nav
			title="学员约课记录"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<!-- tabs模块 -->
		<view class="page-top-btn flex" @click="timeShow = true">{{ selectTimeVal.name }}</view>
		<u-tabs
			:list="courseStatusArr"
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
			lineWidth="55rpx"
			lineHeight="4rpx"
			:current="statusCurrent"
			@change="statusChange"
			:scrollable="false"
		></u-tabs>
		<view class="list-box pad20">
			<view
				class="li mar-b40"
				v-for="(item, index) in list"
				:key="index"
			>
				<view class=" flex-row">
					<view class="li-img flex">
						<u-image
							:src="item.user.avatar"
							shape="circle"
							width="128rpx"
							height="128rpx"
						></u-image>
					</view>
					<view
						class="li-info flex-row flex-a ju-bt padlr20"
					>
						<view class="info-l">
							<view class="card-name">
								{{ item.user.nickname }}
							</view>
							<view class="txt">
								状态：{{ item.status_text }}
							</view>
							<view class="txt">
								预约时间：{{ item.paidtime }}
							</view>
							<view class="txt">
								上课时间：{{ item.datename }} {{ item.period }}
							</view>
							<view class="txt flex-row flex-a ju-bt">
								<view class="">
									用户：{{ item.user.nickname }}<text class="uid">(id: {{ item.uid }})</text>
								</view>
								<view
									class="info-btn"
								>
									<view
										class="btn "
										@click.stop="goRouter(item)"
									>
										查看训练计划
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<u-line margin="40rpx 0"></u-line>
			</view>
			<u-empty
				v-if="!list.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>
		<u-action-sheet
			@select="selectTimeFun"
			:actions="timeSelect"
			title="日期"
			:show="timeShow"
			cancelText="取消"
			@close="timeShow = false"
			round="20rpx"
		></u-action-sheet>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { courseOrderAdmin } from '@/api/admin.js';
import timePopup from '@/components/timePopup/timePopup.vue';
export default {
	components: {
		timePopup
	},
	data() {
		return {
			baseUrl: baseUrl,
			// tabs当前选中
			tabsCurrent: 0,
			timeShow: false, // 选择时间 modal
			timeSelect: [
				{
					name: '最近7天',
					id: '7day'
				},
				{
					name: '最近1个月',
					id: '1month'
				},
				{
					name: '最近3个月',
					id: '3month'
				},
				{
					name: '最近1年',
					id: '1year'
				}
			],
			selectTimeVal: {
				name: '最近7天',
				id: '7day'
			}, // 选中时间
			current: 1, // 当前页
			list: [],
			courseStatusArr: [
				{
					name: '已预约',
					id: '1,3'
				},
				{
					name: '进行中',
					id: '4'
				},
				{
					name: '已完成',
					id: '2'
				},
				{
					name: '已失效',
					id: '-2'
				},
			],
			statusCurrent: 0,
		};
	},
	onLoad(op) {
		this.getCourseOrderAdmin();
		
	},
	onReachBottom() {
		this.current++;
		this.getCourseOrderAdmin();
	},
	methods: {
		statusChange(eve) {
			this.statusCurrent = eve.index;
			this.reset();
		},
		// 获取约课订单管理
		getCourseOrderAdmin() {
			courseOrderAdmin({
				product: "home_training",
				list_rows: 20,
				page: this.current,
				date: this.selectTimeVal.id,
				status: this.courseStatusArr[this.statusCurrent].id
			}).then(res => {
				this.list = [...this.list, ...res.data.data];
			});
		},
		// 选中时间
		selectTimeFun(e) {
			this.selectTimeVal = e;
			this.reset();
		},
		reset() {
			this.current = 1;
			this.list = [];
			this.getCourseOrderAdmin();
		},
		// 跳转详情
		goRouter(eve) {
			uni.navigateTo({
				url: `/pages/admin/pages/coach/classDetail/classDetail?orderId=${eve.order_id}`
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.page-top-btn {
	height: 80rpx;
	background: #fe5e10;
	border-radius: 8rpx;
	margin: 32rpx 32rpx 0;
	color: #ffffff;
	font-size: 28rpx;
}

.list-box {
	.li {
		.li-info {
			.info-btn {
				.btn {
					padding: 8rpx 20rpx;
					border-radius: 35rpx;
					font-size: 22rpx;
					color: #fff;
					background-color: #fe5e07;
				}
			}
			.info-l {
				.uid {
					font-size: 20rpx;
					color: #999;
				}
				.txt {
					font-weight: 400;
					color: rgba(0, 0, 0, 0.6);
					font-size: 24rpx;
					margin: 10rpx 0;
				}

				.card-name {
					font-weight: 550;
					color: #202020;
					font-size: 28rpx;
				}
				width: 100%;
			}

			width: 78%;
		}

		.li-img {
			image {
				width: 100%;
				height: 80rpx;
			}

			width: 22%;
			height: 200rpx;
		}
	}
}
</style>
