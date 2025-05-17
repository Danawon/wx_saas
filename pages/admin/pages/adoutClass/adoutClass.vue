<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="约课记录"
		></head-nav>
		<view class="page pad-b20">
			<view class="page-top">
				<view class="time-btn marlr20 mar-b40 flex" @click="timeShow = true">
					选择时间
				</view>
				<view class="flex-a">
					<view
						class="flex flex-col top-li"
						v-for="(item, index) in nav"
						:key="index"
						:class="{ on: index == navIndex }"
						@click="navClick(index, item)"
					>
						<text>{{ item.name }}</text>
						<text class="bor"></text>
					</view>
				</view>
			</view>

			<view class="page-center">
				<view
					class="center-box padlr20 pad-b40"
					@click="jump(item)"
					v-for="(item, index) in list"
					:key="index"
				>
					<view class="flex-a ju-bt padtb20 box-top">
						<text class="time">
							{{ item.createtime }}
						</text>
						<text class="coach">教练：{{ item.coach.name }}</text>
					</view>
					<view class="box flex-a">
						<view class="img-box">
							<u-avatar
								:src="item.coach.avatar"
								size="180rpx"
							></u-avatar>
						</view>
						<view class="box-r pad-l40 flex-col">
							<text class="name">
								用户：{{ item.user.nickname }}
							</text>
							<text>用户id：{{ item.uid }}</text>
							<text>支付方式：{{ item.paytypename }}</text>
							<text>时段：{{ item.datename }} {{ item.period }}</text>
							<text>
								门店名称：{{ item.store.name == null ? '居家' : item.store.name }}
							</text>
							<text>约课会员卡：{{ item.card_name }}</text>
							<view class="tip ">{{ item.productname }}</view>
						</view>
					</view>
				</view>
				<u-empty
					v-if="!list.length"
					mode="list"
					text="暂无数据..."
				></u-empty>
			</view>
			
			
			
		</view>
		
		<u-action-sheet
			@select="selectTimeFun"
			:actions="timeSelect"
			title="选择"
			:show="timeShow"
			cancelText="取消"
			@close="timeShow = false"
			round="20rpx"
		></u-action-sheet>
	</view>
</template>

<script>
import { storeCourseRecord } from '@/api/admin.js';
export default {
	data() {
		return {
			//导航栏
			nav: [
				{
					name: '全部',
					id: ''
				},
				{
					name: '私教课',
					id: 'private_teaching'
				},
				{
					name: '自习课',
					id: 'league_class'
				},
				{
					name: '团课',
					id: 'autonomous_class'
				}
			], //导航栏
			navIndex: 0, //选中的导航
			
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
			selectTimeVal: "", // 选中时间
			current: 1, // 当前页
			list: [],
		};
	},
	onLoad() {
		this.getstoreCourseRecord();
	},
	onReachBottom() {
		this.current ++ 
		this.getstoreCourseRecord();
	},
	methods: {
		// 选中时间
		selectTimeFun(e) {
			this.selectTimeVal = e.id;
			this.reset();
			this.getstoreCourseRecord();
		},
		reset() {
			this.list = [];
			this.current = 1;
		},
		// 获取门店约课记录
		getstoreCourseRecord() {
			storeCourseRecord({
				page: this.current,
				list_rows: 20,
				product: this.nav[this.navIndex].id,
				date: this.selectTimeVal
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			});
		},
		//导航栏
		navClick(index, item) {
			this.reset()
			this.navIndex = index;
			this.getstoreCourseRecord();
		},
		//跳转详情
		jump(e) {
			uni.navigateTo({
				url:
					`/pages/admin/pages/adoutClassDetail/adoutClassDetail?id=${e.order_id}`
			});
		}
	}
};
</script>

<style lang="scss">
.page {
	.page-top {
		.time-btn {
			height: 80rpx;
			background: #fe5e10;
			border-radius: 8rpx;
			color: #ffffff;
			font-size: 28rpx;
			font-weight: 500;
		}

		.top-li {
			height: 92rpx;
			font-size: 28rpx;
			color: #999999;
			width: 33%;
			position: relative;
			background: #e7e7e7;

			.bor {
				width: 112rpx;
				height: 3rpx;

				position: absolute;
				bottom: 0;
				transform: translateX(-50%);
				left: 50%;
			}
		}

		.top-li.on {
			color: #fe5e10;
			font-weight: 600;

			.bor {
				background: #fe5e10;
			}
		}
	}

	.page-center {
		height: 76vh;
		background-color: #e7e7e7;

		.center-box {
			background-color: #fff;
			margin-bottom: 8rpx;
			padding-bottom: 30rpx;

			.box-top {
				.time {
					font-size: 24rpx;
					font-weight: 300;
					color: #202020;
				}

				.coach {
					font-size: 28rpx;
					font-weight: 400;
					color: #fe5e10;
				}
			}

			.box {
				position: relative;

				.box-r {
					font-size: 24rpx;
					font-weight: 300;
					color: #999999;
					margin-bottom: 5rpx;
					line-height: 46rpx;

					.name {
						font-size: 30rpx;
						font-family: PingFang SC-Medium,
							PingFang SC;
						font-weight: 500;
						color: #fe5e10;
					}

					.tip {
						position: absolute;
						right: 28rpx;
						top: 30%;
						padding: 0rpx 18rpx;
						font-size: 18rpx;
						color: #ffffff;
						background: #fea41d;
						border-radius: 8rpx;
					}

					.tip.zx {
						background: #fcc505;
					}

					.tip.tk {
						background: rgba(138, 196, 63, 0.9);
					}
				}
			}
		}
	}

	.msg {
		width: 80%;
		padding: 5rpx 0;
		margin: 20rpx auto 0;
		background: rgba(255, 163, 118, 0.4);
		border-radius: 70rpx;
		text-align: center;
		font-size: 24rpx;

		.num {
			color: #fe5e10;
			font-size: 28rpx;
		}
	}
}
</style>
