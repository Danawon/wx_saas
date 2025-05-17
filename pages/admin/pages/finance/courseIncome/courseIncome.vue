<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="销售收入统计"></head-nav>
		<view class="pad20">
			<u-cell-group>
				<view class="" @click="storeShow = true">
					<u-cell title="选择门店" :isLink="true" :value="storeName" arrow-direction="down"></u-cell>
				</view>
			</u-cell-group>
			<view class="martb20">
				<u-cell-group >
					<view class="" @click="coachShow = true">
						<u-cell title="选择教练" :isLink="true" :value="coachTxt" arrow-direction="down"></u-cell>
					</view>
				</u-cell-group>
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
		</view>
		<view class="page">
			<view class="page-top flex-a">
				<view class="flex flex-col top-li" v-for="(item,index) in nav" :key="index"
					:class="{on:index==navIndex}" @click="navClick(index)">
					<text>{{ item.name }}</text>
					<text class="bor"></text>
				</view>
			</view>
			<view class="page-center padtb20 flex-a">
				<view class="center-box flex flex-col">
					<text class="num mar-b20 ">{{ statisticsObj['7day'] }}</text>
					<text class="txt">本周收入</text>
				</view>
				<view class="center-box flex flex-col">
					<text class="num mar-b20 ">{{ statisticsObj['1month'] }}</text>
					<text class="txt">本月收入</text>
				</view>
				<view class="center-box flex flex-col">
					<text class="num mar-b20 ">{{ statisticsObj['3month'] }}</text>
					<text class="txt">本季度收入</text>
				</view>
				<view class="center-box flex flex-col">
					<text class="num mar-b20 ">{{ statisticsObj['1year'] }}</text>
					<text class="txt">年收入</text>
				</view>
			</view>
			<view class="page-list padtb40 padlr40">
				<view class="page-li flex-a mar-b40" v-for="(item,index) in list" :key="index">
					<view class="img-box">
						<u-avatar shape="square" :src="item.membercard_image" size="128rpx"></u-avatar>
					</view>
					<view class="msg-box pad-l20 flex-col">
						<text class="time">卡名称：{{ item.membercard_name }}</text>
						<text class="time">销售：{{ item.coachname }}</text>
						<text class="time ">购买时间：{{ item.paidtime }}</text>
						<text class="time">门店：{{ item.storename }}</text>
						<text class="time">激活时间：{{ item.usermembercard.activation_time }}</text>
						<text class="time">会员卡状态：{{ item.usermembercard.status_text }}</text>
						<text class="time">停卡次数：{{ item.stopusing_count }}</text>
						<text class="time">会员ID：{{ item.uid }}</text>
					</view>

					<view class="flex-a btn-box">
						￥ <text class="num"> {{ Number(item.total_price) + Number(item.additional_recording) }}</text>
					</view>

				</view>
			</view>
			<u-empty
			v-if="!list.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>
	<u-picker
		title="选择教练"
		:show="coachShow" 
		:columns="coachList" 
		@confirm="selectCoach"
		@close="coachShow = false"
		@cancel="coachShow = false"
		keyName="name"
		:closeOnClickOverlay="true"
	></u-picker>
	<!-- 选择门店 -->
	 <u-picker 
		title="选择门店"
		:show="storeShow" 
		:columns="storeList" 
		@confirm="selectStore"
		@close="storeShow = false"
		@cancel="storeShow = false"
		keyName="name"
		:closeOnClickOverlay="true"
	></u-picker>
	</view>
</template>

<script>
	import { baseUrl } from '@/utils/baseUrl.js';
	import { getCoachList } from "@/api/storeApis.js";
	import { investorData } from "@/api/finance.js"
	import { shopList } from "@/api/admin.js"
	export default {
		components:{
			
		},
		data() {
			return {
				baseUrl: baseUrl,
				 //导航栏
				nav: [
					{
						name: "私教卡",
						id: "private_teaching"
					},{
						name: "自习卡",
						id: "autonomous_class"
					},{
						name: "团课卡",
						id: "league_class home_training"
					},
				],
				navIndex: 0, //选中的导航
				coachShow: false, // 选择教练 show
				coachList: [], // 教练列表
				coachId: "", // 教练id
				coachTxt: "全部", // 教练文本
				current: 1,
				list: [],
				statisticsObj: {}, // 统计数据
				storeName: "",
				// 门店id
				storeId: "", 
				/* 选择门店show */
				storeShow: false,
				/* 门店列表 */
				storeList: [],
				/* 选中时间范围 */
				dateRange: [],
				
			};
		},
		async  onLoad(e) {
			var now = new Date();
			var fd = new Date(now.getFullYear(), now.getMonth()-1 ,1).toLocaleDateString();
			var ed = new Date(now.getFullYear(), now.getMonth(), 0).toLocaleDateString();
			this.dateRange = [fd, ed]
			/* 获取门店列表 */
			await this.getShopList();
			await this.getCoachListFun();
		},
		onReachBottom() {
			this.current ++;
			this.getInvestorData();
		},
		methods: {
			/* 选中日期范围*/
			dateChange(eve) {
				this.dateRange = eve;
				this.resetFun();
			},
			// 获取门店列表
			getShopList() {
				return shopList().then(res => {
					this.storeList = [res.data];
					this.storeId = res.data[0].id;
					this.storeName = res.data[0].name;
				})
			},
			/* 选中门店 */
			selectStore(e) {
				this.storeId = e.value[0].id;
				this.storeName = e.value[0].name;
				this.coachId = "";
				this.coachTxt = "全部";
				this.storeShow = false;
				this.getCoachListFun();
			},
			/* 重置数据 */
			resetFun() {
				this.current = 1;
				this.list = [];
				this.getInvestorData();
			},
			// 获取统计
			getInvestorData() {
				return investorData({
					page: this.current,
					list_rows: 10,
					coach_id: this.coachId,
					date: this.dateRange.join(","),
					product: this.nav[this.navIndex].id,
					store_id: this.storeId
				}).then(res => {
					this.list = [...this.list,...res.data.list.data];
					this.statisticsObj = res.data.statustucs_time;
				})
			},
			// 获取教练列表
			getCoachListFun() {
				let _this = this;
				return getCoachList({
					store_id: this.storeId
				}).then(res => {
					res.data.unshift({name: '全部', id: ''})
					_this.coachList = [res.data];
					this.resetFun();
				});
			},
			// 选中教练
			selectCoach(e) {
				this.coachId = e.value[0].id;
				this.coachTxt = e.value[0].name;
				this.coachShow = false;
				this.resetFun();
			},
			//导航栏
			navClick(index) {
				this.navIndex = index
				this.resetFun();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.text {
		font-weight: 400;
		color: rgba(0,0,0,0.9);
		font-size: 32rpx;
	}
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
			height: 280rpx;
			background: #FFE6DA;
			flex-wrap: wrap;

			.center-box {
				width: 50%;
				height: 50%;
				color: #FFFFFF;

				.num {
					font-size: 40rpx;
					font-weight: 600;
					color: rgba(0,0,0,0.9);
				}

				.txt {
					font-size: 22rpx;
					font-weight: 400;
					color: rgba(0,0,0,0.6);
				}
			}
		}

		.page-list {

			.msg-box {
				.time {
					font-size: 22rpx;
					color: rgba(0, 0, 0, 0.6);
					margin-top: 10rpx;
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
