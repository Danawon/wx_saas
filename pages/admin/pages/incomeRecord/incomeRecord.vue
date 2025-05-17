<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="门店收入"></head-nav>
		<view class="page">
			<view class="page-top flex-a">
				<view class="flex flex-col top-li" v-for="(item,index) in nav" :key="index"
					:class="{on:index==navIndex}" @click="navClick(index)">
					<text>{{item.name}}</text>
					<text class="bor"></text>
				</view>
			</view>
			<view class="padlr20 martb20">
				<u-input placeholder="选择时间（默认展示全部时间）" prefixIcon="clock" v-model="timeObj.name" @focus="time"></u-input>
			</view>
			<view class="page-center flex-a">
				<view class="center-box flex flex-col">
					<text class="num mar-b20 ">{{ statisticsData.private_teaching_money_7day }}</text>
					<text class="txt">本周收入</text>
				</view>
				<view class="center-box flex flex-col">
					<text class="num mar-b20 ">{{ statisticsData.private_teaching_money_1month }}</text>
					<text class="txt">本月收入</text>
				</view>
				<view class="center-box flex flex-col">
					<text class="num mar-b20 ">{{ statisticsData.private_teaching_money_3month }}</text>
					<text class="txt">本季度收入</text>
				</view>
				<view class="center-box flex flex-col">
					<text class="num mar-b20 ">{{ statisticsData.private_teaching_money_1year }}</text>
					<text class="txt">年收入</text>
				</view>
			</view>
			<view class="page-list pad20">
				<view class="page-li flex-a mar-240" v-for="(item,index) in list" :key="index">
					<view class="img-box">
						<u--image :src="item.product.image" width="128rpx" height="128rpx" shape="circle">
						</u--image>
					</view>
					<view class="msg-box pad-l20 flex-col">
						<view class="title">{{ item.product.name }}</view>
						<view class="time">购买时间：{{ item.product.createtime }}</view>
					</view>
					<view class="flex-a btn-box">
						￥ <text class="num"> {{ item.total_price }}</text>
					</view>

				</view>
				
				<u-empty
					v-if="!list.length"
					mode="list"
					text="暂无数据..."
				></u-empty>
			</view>
		</view>

	<timePopup :show="show" @change="determine" @close="close"></timePopup>
	</view>
</template>

<script>
	import { baseUrl } from '@/utils/baseUrl.js';
	import timePopup from '@/components/timePopup/timePopup.vue'
	import { storeIncome } from "@/api/storeApis.js"
	export default {
		components:{
			timePopup
		},
		data() {
			return {
				nav: [
					{
						name: "私教",
						id: "private_teaching"
					},{
						name: "自习",
						id: "autonomous_class"
					},{
						name: "团课",
						id: "league_class"
					},
				],
				navIndex: 0, //选中的导航
				baseUrl: baseUrl,
				show: false, //时间弹框显示隐藏
				popupItem: '', //弹框选中的值 
				timeObj: { // 选中日期
					name: "最近七天",
					value: "7day",
				}, 
				current: 1,
				list: [],
				statisticsData: {}, // 统计数据
			};
		},
		onLoad() {
			this.getStoreIncome();
		},
		methods: {
			// 获取门店收入
			getStoreIncome() {
				storeIncome({
					page: this.current,
					list_rows: 20,
					date: this.timeObj.value ?? "",
					product: this.nav[this.navIndex].id
				}).then(res => {
					this.list = [...this.list, ...res.data.list.data];
					this.statisticsData = res.data.statistics;
				})
			},
			//导航栏
			navClick(index) {
				this.navIndex = index
				this.current = 1;
				this.list = [];
				this.getStoreIncome();
			},
			//时间弹框打开
			time() {
				this.show = true
			},
			
			close() {
				this.show = false
			},
			
			determine(item) { 
				this.timeObj = item;
				this.close()
				this.current = 1;
				this.list = [];
				this.getStoreIncome();
			}, 
		}
	}
</script>

<style lang="scss">
	.page {
		.page-top {
			height: 92rpx;

			.top-li {
				height: 92rpx;
				font-size: 28rpx;
				color: rgba(0, 0, 0, 0.6);
				width: 33%;
				position: relative;

				.bor {
					width: 112rpx;
					height: 3rpx;
					background: #E7E7E7;
					position: absolute;
					bottom: 0;
					transform: translateX(-50%);
					left: 50%;
				}
			}

			.top-li.on {
				color: #FE5E10;
				font-weight: 600;

				.bor {
					background: #FE5E10;
				}
			}
		}

		.page-center {
			height: 322rpx;
			background: #FE5E10;
			flex-wrap: wrap;

			.center-box {
				width: 50%;
				height: 50%;
				color: #FFFFFF;

				.num {
					font-size: 40rpx;
					font-weight: 600;
				}

				.txt {
					font-size: 24rpx;
				}
			}
		}

		.page-list {

			.msg-box {
				font-size: 32rpx;

				.title {
					font-weight: bold;
					padding-bottom: 10rpx;
				}

				.time {
					font-size: 22rpx;
					color: rgba(0, 0, 0, 0.6);
				}
			}

			.btn-box {
				margin-left: auto;
				color: #FE5E10;
				white-space: nowrap;

				.num {
					font-weight: bold;
					font-size: 40rpx;
				}
			}
		}

	}

	.popup-box {
		background-color: #fff;

		font-size: 32rpx;

		.determine {
			color: #FE5E10;
		}

		.popup-top {
			height: 96rpx;
		}

		.popup-list {
			max-height: 800rpx;
			text-align: center;
			color: rgba(0, 0, 0, 0.26);
		}

		.popup-li.on {
			border-top: 1px solid #E7E7E7;
			border-bottom: 1px solid #E7E7E7;
			color: #202020;
		}
	}
</style>
