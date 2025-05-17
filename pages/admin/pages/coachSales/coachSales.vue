<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="会员卡购买记录"></head-nav>
		<view class="page">
			<view class="page-top">
				<view class="padlr20 mar-b20" @click="coachShow = true">
					<u-input disabledColor="#fff" v-model="coachTxt" placeholder="选择教练" disabled prefixIcon="account" suffixIcon="arrow-down"></u-input>
				</view>
				<view class="padlr20" @click="timeShow = true">
					<u-input disabledColor="#fff" v-model="selectTime.name" placeholder="选择时间（默认展示全部时间）" disabled prefixIcon="clock"></u-input>
				</view>
			</view>

			<view class="mar40 total pad40">
				<view class=""> 消费小计：{{ consumeSubtotal }}元 </view>
				<view class="mar-t40"> 销售小计：{{ saleSubtotal }}元</view>
			</view>

			<view class="page-nav flex-a">
				<view class="flex flex-col top-li" v-for="(item,index) in nav" :key="index"
					:class="{on:index==navIndex}" @click="navClick(index)">
					<text>{{item.name}}</text>
					<text class="bor"></text>
				</view>
			</view>

			<view class="page-list padtb40 padlr40">
				<view class="page-li padtb40 flex-a" v-for="(item, index) in list" :key="index">
					<view class="img-box">
						<u--image :src="item.user.avatar" width="128rpx" height="128rpx" shape="circle">
						</u--image>
					</view>
					<view class="msg-box pad-l40 flex-col">
						<text class="name">{{ item.user.nickname }}</text>
						<text class="time">会员卡名称：{{ item.membercardoreder.membercard_name }}</text>
						<text class="time">剩余天数：{{ item.shenday }}天</text>
						<text class="time">当前剩余：{{ item.used_number }}/{{ item.number }}次</text>
						<text class="time">激活时间：{{ item.activation_time }}</text>
						<text class="time">销售金额：{{ Number(item.membercardoreder.additional_recording) +  Number(item.membercardoredertotal_price)}}</text>
					</view>
				</view>
			</view>
		</view>
		<timePopup :show="timeShow" @change="determine" @close="close"></timePopup>
		<u-action-sheet
			@select="selectCoach"
			:actions="coachList"
			title="教练列表"
			:show="coachShow"
			cancelText="取消"
			@close="coachShow = false"
			round="20rpx"
		></u-action-sheet>
	</view>
</template>

<script>
	import { getCoachList,getBuyCardRecord } from "@/api/storeApis.js";
	import timePopup from '@/components/timePopup/timePopup.vue';
	export default {
		components: {
			timePopup
		},
		data() {
			return {
				nav: [
					{
						name: '私教卡',
						id: 'private_teaching'
					},	
					{
						name: '自习卡',
						id: 'autonomous_class'
					},	
					{
						name: '团课卡',
						id: 'league_class'
					},
				], //导航栏
				navIndex: 0, //选中的导航
				storeId: "", // 门店id
				coachList: [], // 教练列表
				coachShow: false, // 教练show
				coachId: "", // 选中教练id
				coachTxt: "", // 选中教练文本
				timeShow: false, // 时间 show
				selectTime: {
					name: "最近七天",
					value: "7day",
				}, // 选中时间
				current: 1, // 当前页
				list: [],
				consumeSubtotal: 0, // 消费小计
				saleSubtotal: 0, // 销售小计
			};
		},
		onLoad(e) {
			this.storeId = e.storeId;
			this.getCoachListFun();
			this.getBuyCardRecordFun();
		},
		onReachBottom() {
			this.current ++;
			this.getBuyCardRecordFun();
		},
		methods: {
			/* 获取会员卡购买记录 */
			getBuyCardRecordFun() {
				getBuyCardRecord({
					page: this.current,
					list_rows: 20,
					coach_id: this.coachId,
					product: this.nav[this.navIndex].id,
					date: this.selectTime.value || ''
				}).then(res => {
					this.consumeSubtotal = res.data.total_price
					this.saleSubtotal = res.data.additional_recording
					this.list = [...this.list, ...res.data.data.data]
				})
			},
			onReset() {
				this.current = 1;
				this.list = [];
				this.getBuyCardRecordFun();
			},
			//关闭
			close() {
				this.timeShow = false
			},
			// 选中时间
			determine(item) {
				this.selectTime = item
				this.close()
				this.onReset();
			}, 
			//导航栏
			navClick(index) {
				this.navIndex = index
				this.onReset();
			},
			// 获取教练列表
			getCoachListFun() {
				getCoachList({
					store_id: this.storeId
				}).then(res => {
					this.coachList = res.data;
				});
			},
			// 选中教练
			selectCoach(e) {
				this.coachId = e.id;
				this.coachTxt = e.name
				this.onReset();
			},
		}
	}
</script>

<style lang="scss">
	.page {
		.total {
			background-color: #FFE6DA;
			font-size: 28rpx;
			color: #202020;
		}

		.page-nav {
			height: 92rpx;
			border-bottom: 1rpx solid #E7E7E7;

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

		.page-list {
			.page-li {
				border-bottom: 1rpx solid #E7E7E7;
				align-items: flex-start;

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
			}
		}
	}
</style>
