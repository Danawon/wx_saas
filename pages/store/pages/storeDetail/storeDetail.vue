<template>
	<view class="wrap pad-b20">
		<head-nav title="门店详情" goBack="true"></head-nav>
		<!-- 头部模块 -->
		<view class="head-box pad20 flex-row flex-a">
			<view class="place flex-row flex-a">
				<u-avatar
					:src="baseUrl + 'locatio.png'"
					size="40rpx"
				></u-avatar>
				<text class="place-txt">
					{{ storeDeatil.name || '' }}
				</text>
			</view>
			<view class="distance flex" @click="navigationFun">
				<text class="distance-txt">
					距离{{
						(
							storeDeatil.store_distance / 1000
						).toFixed(2) || ''
					}}公里
				</text>
				<u-avatar
					:src="baseUrl + 'slice.png'"
					size="40rpx"
				></u-avatar>
			</view>
		</view>
		<!-- 教练模列表 组件 -->
		<coach-list :coachList="coachList"></coach-list>

		<!-- 约课模块 -->
		<view class="appointment-course ">
			<!-- 节假日信息 -->
			<view class="pad20" v-if="is_holiday">
				<view class="holiday-box flex-col flex-a pad20">
					<view class="content mar-t20">
						{{ holidayInfo.content }}
					</view>
					<view class="img-box">
						<image
							:src="holidayInfo.image"
							mode=""
						></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 购卡模块 -->
		<view class="purchaseCard">
			<view class="card-txt pad20">选购会员卡</view>
			<!-- 购卡tbas -->
			<view class="pad-l20 pad-r20">
				<view class="card-box ">
					<view
						class="course-tabs flex-a"
						:style="{
							background:
								'url(' + baseUrl + 'jb.png)',
							'background-size': '100%'
						}"
					>
						<view
							class="tabs-item flex"
							v-for="(cardItem,
							cardIndex) in cardTypeTabs"
							:key="cardIndex"
							:class="{
								selectTabs:
									cardIndex ==
									selectCardTypeIndex
							}"
							@click="cardTypeChange(cardIndex)"
						>
							{{ cardItem.name }}
						</view>
					</view>
					<view
						class="cart-list flex-row flex-a"
						v-for="(listItem,
						listIndex) in currentCardList"
						:key="listIndex"
						@click="selectCard(listItem)"
					>
						<view class="list-img">
							<u--image
								:showLoading="true"
								:src="listItem.image"
								width="210rpx"
								height="160rpx"
								radius="10rpx"
							></u--image>
						</view>
						<view class="cart-info flex-col">
							<view class="info-tit">
								{{ listItem.name }}
							</view>
							<view class="info-tips">
								{{ listItem.info }}
							</view>
						</view>
						<view class="cart-buy flex-col ">
							<view class="cart-price flex-row">
								<u-icon
									top="4rpx"
									name="rmb"
									color="#FE5E10"
									size="24rpx"
								></u-icon>
								<text class="price-num">
									{{ listItem.price }}
								</text>
							</view>
							<view
								class="cart-buy-btn flex mar-t20"
							>
								购买
							</view>
						</view>
					</view>
					<view
						class=""
						v-if="!currentCardList.length"
					>
						<u-empty
							mode="list"
							text="暂无数据..."
						></u-empty>
					</view>
				</view>
			</view>
		</view>
		<!-- 	<view class="swiper-box padlr20 padtb20">
			<u-swiper
				:list="storeDeatil.images"
				height="220rpx"
				imgMode="widthFix"
			></u-swiper>
		</view> -->
		<!-- 门店介绍 -->
		<view class="store-introduce pad20">
			<view class="card-txt ">门店介绍</view>
			<view class="content-box">
				<view class="white-space">
					{{ storeDeatil.content || '' }}
				</view>
				<view class="introduce-img flex-row mar-t20" >
					<image
						v-for="(item,
						index) in storeDeatil.content_images"
						:key="index"
						:src="item"
						mode=""
						@click="previewFun(item)"
					></image>
				</view>
			</view>
		</view>
		<!-- 门店器械介绍 -->
		<view class="store-introduce pad20">
			<view class="card-txt ">器械介绍</view>
			<view class="content-box">
				<view class="white-space">
					{{ storeDeatil.sports_content || '' }}
				</view>
				<view class="introduce-img flex-row mar-t20" >
					<image
						v-for="(item,
						index) in storeDeatil.sports_content_images"
						:key="index"
						:src="item"
						mode=""
						@click="previewFun(item)"
					></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
// 头部导航
import headNav from '@/components/headNav/headNav.vue';
// 门店列表组件
import appointmentOurse from '@/components/appointmentOurse/appointmentOurse.vue';
// 教练列表组件
import coachList from '@/components/coachList/coachList.vue';
import {
	getCoachList,
	getVipCard,
	getStoreDetail
} from '@/api/storeApis.js';
export default {
	components: {
		headNav,
		appointmentOurse,
		coachList
	},
	data() {
		return {
			// ftp地址
			baseUrl: baseUrl,
			// 课程选择 tbas
			cardTypeTabs: [
				{
					name: '私教课',
					type: 'private_teaching'
				},
				{
					name: '自主练',
					type: 'autonomous_class'
				},
				{
					name: '团课',
					type: 'league_class'
				}
			],
			// 门店信息
			storeDeatil: {},
			// 门店id
			storeId: '',
			// 教练列表
			coachList: [],
			// 选中卡的类型
			selectCardTypeIndex: 0,
			// 会员卡列表
			cardList: [],
			// 当前的会员卡列表
			currentCardList: [],
			/* 节假日信息 */
			holidayInfo: {},
			is_holiday: false
		};
	},
	onLoad(eve) {
		this.storeId = eve.store_id;
		this.latitude = eve.latitude ?? 0;
		this.longitude = eve.longitude ?? 0;
		// 获取教练列表
		this.getCoach();
		// 获取会员卡数据
		this.getVipCardList();
		// 获取门店详情
		this.getStoreInfo();
	},
	methods: {
		// 图片预览
		previewFun(url) {
			// 预览图片
			uni.previewImage({
				urls: [url],
				longPressActions: {
					success: function(data) {},
					fail: function(err) {
					}
				}
			});
		},
		// 导航
		navigationFun() {
			let _this = this;
			uni.openLocation({
				latitude: Number(this.storeDeatil.latitude), //纬度
				longitude: Number(this.storeDeatil.longitude), //经度
				name: this.storeDeatil.name,
				address: this.storeDeatil.address
			});
		},
		// 获取门店详情
		getStoreInfo() {
			getStoreDetail({
				id: this.storeId,
				latitude: this.latitude,
				longitude: this.longitude
			}).then(res => {
				this.storeDeatil = res.data;
				this.is_holiday = res.data.is_holiday;
				/* 节假日信息 */
				this.holidayInfo = res.data.holiday;
			});
		},
		/* 选中要购买的卡 */
		selectCard(eve) {
			uni.navigateTo({
				url: `/pages/store/pages/buyCourseDetail/buyCourseDetail?parentData=${JSON.stringify(
					{ crad_id: eve.id, type: 'typeCard' }
				)}&type=card`
			});
		},
		/* 卡类型change */
		cardTypeChange(eve) {
			this.selectCardTypeIndex = eve;
			// 当前选中的卡数据
			this.currentCardList =
				this.cardList[this.selectCardTypeIndex].list ??
				[];
		},
		// 获取会员卡数据
		getVipCardList() {
			getVipCard({
				id: this.storeId
			}).then(res => {
				this.cardList = res.data;
				this.currentCardList =
					this.cardList[this.selectCardTypeIndex]
						.list ?? [];
			});
		},
		// 获取教练列表
		getCoach() {
			let _this = this;
			getCoachList({
				store_id: this.storeId
			}).then(res => {
				_this.coachList = res.data;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.white-space {
	white-space: pre-wrap;
}
.introduce-img {
	flex-wrap: wrap;
	image {
		width: 32%;
		margin-left: 5rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}
}
.holiday-box {
	width: 100%;
	box-shadow: 1px 1px 10rpx 5rpx #ccc;
	border-radius: 10rpx;
	.img-box {
		width: 100%;
		image {
			width: 100% !important;
		}
	}
	.content {
		font-size: 28rpx;
		color: #646464;
		line-height: 45rpx;
	}
}
.store-introduce {
	.content-box {
		.content-img {
			width: 100%;
			height: 400rpx;
		}
		background-color: #fff;
		padding: 30rpx 20rpx;
		border-radius: 25rpx;
		margin-top: 30rpx;
	}
	font-size: 26rpx;
	width: 100%;
}
.cart-list {
	.cart-buy {
		.cart-buy-btn {
			width: 130rpx;
			height: 50rpx;
			color: #fff;
			font-size: 24rpx;
			background: #fe5e10;
			border-radius: 40rpx;
		}
		.cart-price {
			.price-num {
				font-family: DIN-Medium, DIN;
				font-weight: 600;
				color: #fe5e10;
				font-size: 34rpx;
			}
		}
		padding-top: 20rpx;
		height: 150rpx;
		align-items: flex-end;
	}
	.cart-info {
		.info-tips {
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.4);
			font-size: 24rpx;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
		.info-tit {
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 600;
			color: #2f2f2f;
			font-size: 30rpx;
		}
		width: 50%;
		margin-left: 20rpx;
		height: 150rpx;
		justify-content: space-between;
	}
	padding: 0 30rpx;
	margin-top: 30rpx;
	margin-bottom: 40rpx;
}
.card-box {
	.course-tabs {
		.tabs-item {
			background-color: #ffc8ad;
			border-radius: 20rpx;
			color: #fff;
			padding: 10rpx 30rpx;
			font-size: 27rpx;
		}
		.selectTabs {
			background-color: #fe5e10;
		}
		width: 100%;
		height: 100rpx;
		justify-content: space-around;
	}
	width: 100%;
	min-height: 400rpx;
	background-color: #fff;
	overflow-x: hidden;
	border-radius: 30rpx;
	box-shadow: 0px 0px 15rpx 15rpx #eee;
}
.card-txt {
	font-family: PingFang SC-Medium, PingFang SC;
	font-weight: 600;
	color: #202020;
	font-size: 28rpx;
}
.head-box {
	.distance {
		.distance-txt {
			font-size: 23rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.4);
			margin-right: 10rpx;
		}
	}
	.place-txt {
		margin-left: 10rpx;
	}
	background-color: #fff;
	font-family: PingFang SC-Regular, PingFang SC;
	font-weight: 400;
	color: #434343;
	font-size: 31rpx;
	justify-content: space-between;
}
.wrap {
	height: 100vh;
	background-color: #f9f9f9;
	overflow-x: hidden;
}
</style>
