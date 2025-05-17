<template>
	<view>
		<head-nav
			title="区域投资人"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="head-filter pad40">
			<view class="filter-shop filter pad20 flex-row flex-a ju-bt mar-b20" @click="storeShow = true">
				<view class="shop-l flex-row flex-a">
					<u-image :showLoading="true" :src="baseUrl+ 'investor2.png'" width="34rpx" height="34rpx" ></u-image>
					<view class="txt">
						{{ selectStoreTxt || '请选择门店（默认展示所有门店数据）' }}
					</view>
				</view>
				<view class="shop-icon">
					<u-icon name="arrow-down" color="rgba(0,0,0,0.4)" size="28rpx" top="3rpx" :bold="true"></u-icon>
				</view>
			</view>	
			<view class="filter-shop filter pad20 flex-row flex-a ju-bt mar-b20" @click="timeShow = true">
				<view class="shop-l flex-row flex-a">
					<u-image :showLoading="true" :src="baseUrl+ 'investor1.png'" width="32rpx" height="32rpx" ></u-image>
					<view class="txt">
						{{ timeTxt || '选择时间（默认展示全部时间）' }} 
					</view>
				</view>
			</view>
			<view class="allPrice flex martb20" >
				全部金额：{{ moneyData.total_money }}元
			</view>
			<view class="price2 allPrice flex martb20" >
				会员卡{{ moneyData.membercard_money }}元，私教课{{ moneyData.private_money }}元，自习课{{ moneyData.autonomous_money }}元，团课{{ moneyData.league_money }}元
			</view>
		</view>
		<view class="tabs-box mar-t20">
			<!-- tabs模块 -->
			<u-tabs
				:list="tabsArr"
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
				:current="tabsCurrent"
				@change="tabsChange"
				:scrollable="false"
			></u-tabs>
			<u-line></u-line>
		</view>
		<view class="lis-box pad20">
			<view class="li mar-t20 " v-for="(item, index) in list" :key="index">
				<view class="flex-row flex-a">
					
				<view class="li-img">
					<u-image v-if="!tabsCurrent" :showLoading="true" :src="item.membercard_image" width="150rpx" height="150rpx" ></u-image>
					<u-image v-else :showLoading="true" :src="item.uidavatar" width="150rpx" height="150rpx" ></u-image>
				</view>
				<view class="li-info">
					<view class="info_name">
						<text v-if="!tabsCurrent">{{ item.nickname }}</text>
						<text v-else>{{ item.uidnickname }}</text>
					</view>
					<view class="info-txt">
						购买时间：{{ item.paidtime }}
					</view>
					<view class="info-txt">
						购买门店：{{ item.storename }}
					</view>
					<view class="info-txt" v-if="!tabsCurrent">
						购买产品：{{ item.membercard_name }}
					</view>
					<view class="info-txt">
						订单金额：{{ item.total_price }}元
					</view>
				</view>
				<view class="li-state">
					<view class="" v-if="!tabsCurrent">
						<view class="state" v-if="item.is_coupon">
							已使用优惠券
						</view>
						<view class="state" v-else>
							未使用优惠券
						</view>
					</view>
					<view class="" v-else>
						<view class="state" v-if="item.is_use">
							已使用会员卡
						</view>
						<view class="state" v-else>
							未使用会员卡
						</view>
					</view>
				</view>
				</view>
				<u-line margin="40rpx 0 "></u-line>
			</view>
		</view>
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
		<u-action-sheet
			@select="selectStoreFun"
			:actions="storeList"
			title="门店"
			:show="storeShow"
			cancelText="取消"
			@close="storeShow = false"
			round="20rpx"
		></u-action-sheet>
		
		<timePopup :show="timeShow" @change="determine" @close="close"></timePopup>
	</view>
</template>

<script>
	import { baseUrl } from '@/utils/baseUrl.js';
	import { managerStoreSelect} from "@/api/admin.js"
	import timePopup from '@/components/timePopup/timePopup.vue';
	import { investorData, fundstatisticsDetails } from "@/api/investor.js"
	export default {
		components: {
			timePopup
		},
		data() {
			return {
				baseUrl: baseUrl,
				tabsArr: [
					{
						name: '会员卡',
						id:　"membercard",
					},
					{
						name: '私教',
						id:　"private",
					},
					{
						name: '自习课',
						id:　"autonomous",
					},
					{
						name: '团课',
						id:　"league",
					}
				],
				// tabs当前选中
				tabsCurrent: 0,
				// 门店列表
				storeList: [],
				storeShow: false, // 门店选择show
				selectStoreId: "", // 选中门店id
				selectStoreTxt: "", // 选中门店文本
				timeShow: false, // 时间选择 show
				timeTxt: "最近七天", // 选中时间文本
				timeId: "7day", // 选中时间id
				current: 1, // 当前页
				moneyData: {}, // 金额集合
				list: [], // 
			};
		},
		onLoad() {
			this.getManagerStoreSelect();
			this.getInvestorData();
			this.getFundstatisticsDetails();
		},
		onReachBottom() {
			this.current ++ 
			this.getInvestorData();
		},
		methods:{
			reset() {
				this.current = 1;
				this.list = [];
				this.getInvestorData();
				this.getFundstatisticsDetails();
			},
			/* 获取投资人统计信息 */
			getFundstatisticsDetails() {
				fundstatisticsDetails({
					store_id: this.selectStoreId,
					date: this.timeId,
					product: this.tabsArr[this.tabsCurrent].id
				}).then(res => {
					this.moneyData = res.data;
				})
			},
			// 获取投资人数据
			getInvestorData() {
				investorData({
					page: this.current,
					list_rows: 10,
					store_id: this.selectStoreId,
					date: this.timeId,
					product: this.tabsArr[this.tabsCurrent].id
				}).then(res => {
					this.list = [...this.list, ...res.data.data];
				})
			},
			// 选中门店
			selectStoreFun(e) {
				this.selectStoreId = e.id;
				this.selectStoreTxt = e.name;
				this.reset();
			},
			// 获取选择门店列表
			getManagerStoreSelect() {
				managerStoreSelect().then(res => {
					this.storeList= res.data;
				})
			},
			// tabschange改变
			tabsChange(eve) {
				this.tabsCurrent = eve.index;
				this.reset();
			},
			//关闭
			close() {
				this.timeShow = false
			},
			//确定
			determine(item) { 
				this.timeId = item.value;
				this.timeTxt = item.name;
				this.close()
				this.reset();
			}, 
		}
	}
</script>

<style lang="scss" scoped>
	.lis-box {
		.li {
			.li-state {
				.state {
					font-weight: 300;
					color: #FE5E10;
					font-size: 24rpx;
				}
				width: 20%;
				height: 200rpx;
				// background-color: #f99;
			}
			.li-info{
				.info-txt {
					font-weight: 400;
					color: rgba(0,0,0,0.6);
					font-size: 22rpx;
					margin: 10rpx 0;
				}
				.info_name {
					font-weight: 400;
					color: #202020;
					font-size: 32rpx;
				}
				width: 55%;
			}
			.li-img {
				width: 25%;
			}
		}
	}
	.allPrice {
		font-weight: 400;
		color: #FE5E10;
		font-size: 26rpx;
	}
	.price2 {
		color: rgba(0,0,0,0.9);
	}
	.txt {
		font-weight: 400;
		color: rgba(0,0,0,0.4);
		font-size: 28rpx;
		margin-left: 10rpx;
	}
.filter {
	border-radius: 15rpx;
	border: 1px solid rgba(0,0,0,0.4);
}
</style>
