<template>
	<view class="wrap-min ">
		<head-nav
			:leftSlot="true"
			title="翰思运动健康"
			:goBack="false"
		>
			<slot><u-icon name="map" size="0rpx"></u-icon></slot>
		</head-nav>
		<view class="content pad20 ">
			<view
				class="head-tips flex mar-b20"
				:style="{
					background:
						'url(' +
						baseUrl +
						'ckock-bg.png) no-repeat',
					'background-size': '100% 100%'
				}"
			>
				<view class="tip-img">
					<u--image
						:showLoading="true"
						:src="baseUrl + 'clock2.png'"
						width="100rpx"
						height="100rpx"
						shape="circle"
					></u--image>
				</view>
				<view class="tip-txt">
					温馨小提示：打卡产品可多次购买，购买时可选择教练随时激活使用。
				</view>
			</view>

			<!-- 我要打卡 -->
			<view
				class="my-punchCard pad-t20 pad-b40 pad-l40 pad-r40 mar-t40"
				v-if="clockInList.length"
			>
				<view class="card-tit mar-b40">我要打卡</view>
				<view
					class="card-list "
					v-for="(item, index) in clockInList"
					:key="index"
				>
					<view class="list-li flex-row flex-a">
						<view class="list-l">
							<view class="l-tit">
								{{ item.title }}
							</view>
							<view class="l-tips">
								{{ item.abstract || '' }}
							</view>
						</view>
						<view
							class="list-btn flex"
							@click="gopunchTheClock(item)"
						>
							去打卡
						</view>
					</view>
					<u-line
						margin="30rpx 0"
						v-if="index != myCardList.length - 1"
					></u-line>
				</view>
			</view>
			<!-- 我购买的卡课 -->
			<view
				class="my-buy pad-t20 pad-l40 pad-r40 pad-b40 mar-t20"
			>
				<view class="tit-box flex-row flex-a mar-b40">
					<view class="card-tit ">我购买的</view>
					<view
						class="look-all flex-row flex-a "
						@click="lookAllCard"
					>
						<text>查看全部</text>

						<u-icon
							name="arrow-right-double"
							top="2rpx"
							size="28rpx"
							color="rgba(0,0,0,0.4000)"
						></u-icon>
					</view>
				</view>
				<view class="cardState mar-t40 flex-row fla-a">
					<view
						class="state-list flex-col flex-a"
						v-for="(item, index) in cardStateArr"
						:key="index"
						@click="selectOptions(item)"
					>
						<view class="card-num">
							{{ item.num }}
						</view>
						<view class="card-tit mar-t20">
							{{ item.name }}
						</view>
					</view>
				</view>
			</view>
			<!-- tabs 各种打卡模块 -->
			<view class="tabs-box mar-t20">
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
			</view>
			<view class="sundry-card">
				<view
					class="sundry-list list-info-list mar-t20 "
					v-for="(item, index) in myCardList[
						tabsCurrent
					]"
					:key="index"
					@click="goBuyCard(item)"
				>
					<view class="list-li flex-row flex-a">
						<view class="li-img">
							<u--image
								:showLoading="true"
								:src="item.image"
								width="100%"
								height="160rpx"
								radius="20rpx"
							></u--image>
						</view>
						<view class="li-cardInfo flex-col">
							<view class="cardInfo-t">
								<view class="t-tit">
									{{ item.title }}
								</view>
								<view class="t-tips">
									{{
										item.expirationday
									}}日内有效 可训练{{
										item.total_quota
									}}次
								</view>
							</view>
							<view
								class="cardInfo-b flex-row flex-a"
							>
								<view
									class="card-price flex-row"
								>
									<u-icon
										name="rmb"
										top="3rpx"
										size="25rpx"
										color="#FF0D0E"
										bold="true"
									></u-icon>
									<view class="price-num">
										{{ item.price }}
									</view>
								</view>
								<view class="buy-btn ">
									<view
										class="btn flex"
										
									>
										去购买
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<u-empty
				v-if="!myCardList[tabsCurrent].length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getIndexInfo, getClockInList, mobileLogin } from '@/api/clockIn.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,

			// 卡状态数据
			cardStateArr: [
				{
					name: '待激活',
					num: 2,
					id: 1
				},
				{
					name: '正在进行',
					num: 1,
					id: 2
				},
				{
					name: '已完成/过期',
					num: 14,
					id: 3
				}
			],
			// 打卡数据
			clockInInfo: {},
			// 我要打卡数据
			clockInList: [],
			tabsArr: [
				{
					name: '运动打卡'
				},
				{
					name: '饮食打卡'
				}
			],
			tabsCurrent: 0,
			// 购买有氧 饮食 打卡列表
			myCardList: [{}, {}],
			/* 是否直接请求数据 */
			launchRequest: true,
		};
	},
	onLoad(e) {
		if(e.type == 'junling') {
			this.launchRequest = false;
			this.freeLogin(e.mobile,e.usercode);
		}
	},
	onShow() {
		if(this.launchRequest) {
			this.getIndexInfo(); // 获取打卡数据
			this.getClockInListFun(); // 我要打卡列表
		}
	},
	methods: {
		/* 免登录 */
		freeLogin(mobile,usercode) {
			mobileLogin({mobile, usercode}).then(res => {
				let loginData = res.data;
				this.$store.dispatch(
					'setUserInfo',
					loginData.user
				);
				uni.setStorageSync(
					'token',
					loginData.tokenConfig.token
				);
				/* 记录安静心率 */
				uni.setStorageSync("rhr", loginData.user.rhr)
				/* 体重 */
				uni.setStorageSync("weight", loginData.user.weight)
				this.getIndexInfo(); // 获取打卡数据
				this.getClockInListFun(); // 我要打卡列表
			})
		},
		// tabschange改变
		tabsChange(eve) {
			this.tabsCurrent = eve.index;
		},
		/* 选中操作 */
		selectOptions(e) {
			uni.navigateTo({
				url: `/pages/punchTheClock/pages/myBuyCard/myBuyCard?selectType=${
					e.id
				}`
			});
		},
		// 获取我要打卡列表
		getClockInListFun() {
			getClockInList().then(res => {
				this.clockInList = res.data;
			});
		},
		// 获取打卡数据
		getIndexInfo() {
			getIndexInfo().then(res => {
				this.clockInInfo = res.data;
				this.cardStateArr[0].num =
					res.data.purchases.status1;
				this.cardStateArr[1].num =
					res.data.purchases.status2;
				this.cardStateArr[2].num =
					res.data.purchases['status3-1'];
				this.myCardList = [
					res.data.aerobic_list,
					res.data.nutrition_list
				];
			});
		},

		// 跳转打卡详情页
		gopunchTheClock(eve) {
			if (eve.product_type == 'nutrition_punch') {
				// 饮食打卡
				uni.navigateTo({
					url: `/pages/punchTheClock/pages/dietCourseDetail/dietCourseDetail?id=${
						eve.id
					}`
				});
			} else if (eve.product_type == 'aerobic_punch') {
				// 有氧打卡
				uni.navigateTo({
					url: `/pages/punchTheClock/pages/courseDetails/courseDetails?id=${
						eve.id
					}`
				});
			}
		},
		// 跳转购买页
		goBuyCard(eve) {
			uni.navigateTo({
				url: `/pages/punchTheClock/pages/buyCard/buyCard?id=${
					eve.id
				}`
			});
		},
		// 跳转所有已购买的卡
		lookAllCard() {
			uni.navigateTo({
				url:
					'/pages/punchTheClock/pages/myBuyCard/myBuyCard'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.tabs-box {
	background-color: #fff;
	border-radius: 20rpx 20rpx 0 0;
}
.sundry-card {
	.sundry-list {
		background-color: #fff;
		border-radius: 20rpx;
		width: 100%;
		padding: 30rpx;
	}
	.list-info-list {
		.list-li {
			.li-cardInfo {
				.cardInfo-b {
					.buy-btn {
						.btn {
							color: #fff;
							font-size: 23rpx;
							width: 120rpx;
							height: 49rpx;
							border-radius: 40rpx;
							background-color: #fe5e10;
						}
					}
					.card-price {
						.price-num {
							color: #ff0d0e;
							font-size: 30rpx;
							font-family: DIN-Medium, DIN;
							font-weight: bold;
						}
					}
					justify-content: space-between;
				}
				.cardInfo-t {
					.t-tips {
						font-weight: 500;
						color: rgba(254, 94, 16, 0.5);
						font-size: 24rpx;
						margin-top: 10rpx;
					}
					font-weight: 600;
					color: rgba(0, 0, 0, 0.9);
					font-size: 28rpx;
				}
				width: 56%;
				height: 160rpx;
				padding-top: 7rpx;
				justify-content: space-between;
			}
			.li-img {
				width: 40%;
			}
			width: 100%;
			justify-content: space-between;
		}
		width: 100%;
	}
	width: 100%;
}
.my-buy {
	.cardState {
		.state-list {
			.card-tit {
				font-size: 26rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.4);
			}
			.card-num {
				font-family: DIN-Medium, DIN;
				font-weight: bold;
				color: #fe5e10;
				margin-top: 15rpx;
			}
			width: 33.33;
		}
		justify-content: space-around;
	}
	.tit-box {
		.look-all {
			text {
				margin-right: 6rpx;
			}
			font-size: 26rpx;
			color: rgba(0, 0, 0, 0.4);
		}
		justify-content: space-between;
	}
	background-color: #fff;
	width: 100%;
	border-radius: 20rpx;
}
.my-punchCard {
	.list-btn {
		width: 130rpx;
		height: 55rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 25rpx;
		background-color: #fe5e10;
	}
	.list-l {
		.l-tips {
			font-weight: 400;
			color: rgba(0, 0, 0, 0.41);
			margin-top: 10rpx;
			font-size: 26rpx;
		}
		.l-tit {
			font-weight: 600;
			color: rgba(0, 0, 0, 0.9);
			font-size: 30rpx;
		}
	}
	.card-list {
		.list-li {
			justify-content: space-between;
		}
	}
	background-color: #fff;
	width: 100%;
	border-radius: 20rpx;
}
.card-tit {
	font-weight: 500;
	color: rgba(32, 32, 32, 0.9);
	font-weight: bold;
	font-size: 32rpx;
}
.head-tips {
	.tip-txt {
		width: 60%;
		height: 100rpx;
		color: #fff;
		font-weight: 500;
		line-height: 50rpx;
		font-size: 26rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.tip-img {
		width: 17%;
	}
	width: 100%;
	height: 200rpx;
	background-color: #f99;
	position: relative;
}
</style>
