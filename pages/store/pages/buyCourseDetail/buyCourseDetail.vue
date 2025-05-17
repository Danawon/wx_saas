<template>
	<view class="wrap">
		<head-nav title="详情" goBack="true"></head-nav>
		<view class="content">
			<!-- 购课信息 -->
			<view class="course-info">
				<!-- 课程图片 和 price -->
				<view class="course-head flex-row flex-a">
					<view class="course-img flex-row flex-a">
						<!-- 私教课信息 -->
						<u--image
							v-if="
								parentData.card_type ==
									'private_teaching' ||
									parentData.card_type ==
										'home_training'
							"
							:showLoading="true"
							:src="courseData.coachinfo.avatar"
							radius="15rpx"
							width="150rpx"
							height="130rpx"
						></u--image>
						<!-- 私教课信息 到此 -->
						<!-- 自主课信息 -->
						<u--image
							v-if="
								parentData.card_type ==
									'autonomous_class'
							"
							:showLoading="true"
							:src="userInfo.avatar"
							radius="15rpx"
							width="150rpx"
							height="130rpx"
						></u--image>
						<!-- 自主课信息 到此 -->
						<!-- 团课信息 -->
						<u--image
							v-if="
								parentData.card_type ==
									'league_class'
							"
							:showLoading="true"
							:src="
								courseData.leagueclassinfo
									.template.image
							"
							radius="15rpx"
							width="150rpx"
							height="130rpx"
						></u--image>
						<!-- 团课信息 到此 -->
						<!-- 购卡img信息 -->
						<u--image
							v-if="parentData.type == 'typeCard'"
							:showLoading="true"
							:src="cardInfo.image"
							radius="15rpx"
							width="150rpx"
							height="130rpx"
						></u--image>
						<!-- 购卡img信息 到此 -->
						<view
							class="course-name flex-col mar-l20 "
						>
							<view class="name">
								<!-- 私教课信息 -->
								<text
									v-if="
										parentData.card_type ==
											'private_teaching' ||
											parentData.card_type ==
												'home_training'
									"
								>
									{{
										courseData.coachinfo
											.name || ''
									}}
								</text>
								<!-- 私教课信息 到此 -->
								<!-- 自主课信息 -->
								<text
									v-if="
										parentData.card_type ==
											'autonomous_class'
									"
								>
									{{ userInfo.nickname || '' }}
								</text>
								<!-- 自主课信息 到此 -->
								<!-- 团课信息 -->
								<view
									class="flex-row felx-a"
									v-if="
										parentData.card_type ==
											'league_class'
									"
								>
									<text>
										{{
											courseData
												.leagueclassinfo
												.template.name ||
												''
										}}
									</text>
									<view class="txt2 mar-l20">
										{{
											courseData
												.leagueclassinfo
												.template.min ||
												''
										}}人开团
									</view>
								</view>
								<!-- 团课信息 到此 -->
								<!-- 会员卡信息 -->
								<text
									v-if="
										parentData.type ==
											'typeCard'
									"
								>
									{{ cardInfo.name || '' }}
								</text>
								<!-- 团课信息 到此 -->
							</view>
							<view class="time">
								<view
									class=""
									v-if="
										parentData.card_type ==
											'private_teaching' ||
											parentData.card_type ==
												'autonomous_class' ||
											parentData.card_type ==
												'league_class' ||
											parentData.card_type ==
												'home_training'
									"
								>
									<!-- 私教课信息  自主课信息 -->
									<text>
										{{courseData.dayname || '' +' '}}
									</text>
									<text>
										{{ courseData.periodname || ''}}
									</text>
								</view>
								<!-- 私教课信息  自主课信息 到此 -->
								<!-- 会员卡信息 -->
								<text
									v-if="
										parentData.type ==
											'typeCard'
									"
								>
									{{ cardInfo.info || '' }}
								</text>
							</view>
						</view>
					</view>
					<view
						class="course-price flex"
						v-if="type == 'card'"
					>
						<u-icon
							top="5rpx"
							name="rmb"
							color="#FE5E10"
							size="26rpx"
						></u-icon>
						<text class="price-num">
							{{
								parentData.type == 'typeCard'
									? cardInfo.price
									: courseData.price
							}}
						</text>
					</view>
				</view>
				<!-- 私教课购买提示 -->
				<view
					class="quota-tips flex "
					v-if="parentData.type == 'typeCard'"
				>
					<text>
						剩余{{ cardInfo.total_quota || '' }}张
					</text>
					<text v-if="cardInfo.single_quota > 0">
						(每人限购{{
							cardInfo.single_quota || ''
						}}张)
					</text>
				</view>
				<u-line
					margin="20rpx 0"
					v-if="
						parentData.card_type ==
							'private_teaching' ||
							parentData.card_type ==
								'autonomous_class' ||
							parentData.card_type ==
								'league_class' ||
							parentData.type == 'typeCard' ||
							parentData.card_type ==
								'home_training'
					"
				></u-line>
				<!-- 预约场地 预约时间等等 -->
				<view class="subscribe-info">
					<!-- 预约时间 -->
					<view
						class="subscribe-time flex-row flex-a"
						v-if="
							parentData.card_type ==
								'private_teaching' ||
								parentData.card_type ==
									'home_training'
						"
					>
						<view class="time-tit subscribe-tit">
							预约时间
						</view>
						<view
							class="time-address subscribe-content"
						>
							<text class="mar-r20">
								{{ courseData.dayname || '' }}
							</text>
							<text>
								{{ courseData.periodname || '' }}
							</text>
						</view>
					</view>
					
					<!-- 上课次数 -->
					<view
						class="attendClass "
						v-if="parentData.type == 'typeCard'"
					>
						<view
							class=""
							v-if="
								cardInfo.product_type !=
									'custom_card'
							"
						>
							<view class="flex-row flex-a ju-bt">
								<view
									class="attendClass-tit subscribe-tit "
								>
									有效期
								</view>
								<view class="subscribe-content">
									<text>
										{{
											cardInfo.days || ''
										}}天
									</text>
								</view>
							</view>
							<view class="" v-if="cardInfo.times_show">
								<u-line margin="20rpx 0"></u-line>
								<view class="flex-row flex-a ju-bt" >
									<view
										class="attendClass-tit subscribe-tit flex-row "
									>
										约课次数
									</view>
									<view class="subscribe-content">
										<text>
											{{
												cardInfo.times || ''
											}}次
										</text>
									</view>
								</view>
							</view>
						</view>
						<view
							class=""
							v-if="
								cardInfo.product_type ==
									'custom_card'
							"
						>
							<view
								class="subscribe-content flex-row flex-a flex-a ju-bt customCardSty"
							>
								<view
									class="numTips flex"
									v-if="
										numberVal >=
											customData.min
									"
								>
									已满{{
										customData.min || 0
									}}次，
									<text
										v-if="
											customData.discount <
												10
										"
									>
										享{{
											customData.discount ||
												''
										}}折
									</text>
									<text
										v-if="
											customData.discount >=
												10
										"
									>
										无折扣
									</text>
								</view>
								<text>
									{{ customData.day || 0 }}天内
								</text>
								<u-number-box v-model="numberVal" @change="changeNum" iconStyle="width:100rpx;" ></u-number-box>
							</view>
						</view>
					</view>
					<u-line
						margin="20rpx 0"
						v-if="parentData.type == 'typeCard'"
					></u-line>
					<view
						class="attendClass flex-row flex-a"
						v-if="
							parentData.card_type ==
								'league_class'
						"
					>
						<view
							class="attendClass-tit subscribe-tit"
						>
							团课人数
						</view>
						<view
							class="attendClass-address subscribe-content"
						>
							当前已预约人数：{{
								courseData.leagueclassinfo
									.order_count
							}}/{{
								courseData.leagueclassinfo
									.template.max
							}}
						</view>
					</view>
					<u-line
						margin="20rpx 0"
						v-if="
							parentData.card_type ==
								'league_class'
						"
					></u-line>
				</view>
				<!-- 私教卡介绍 -->
				<view
					class="personalCard-introduce mar-t20"
					v-if="parentData.type == 'typeCard'"
				>
					<view class="introduce-tit info-tit mar-b20">
						私教卡介绍
					</view>

					<view
						class="introduce-img flex"
						v-if="cardInfo.product_image"
					>
						<image
							:src="cardInfo.product_image"
							mode=""
						></image>
					</view>
					<view class="white-space">
						{{ cardInfo.content || '' }}
					</view>
				</view>
				<!-- 课程介绍 -->
				<view
					class="course-introduce mar-t20"
					v-if="parentData.card_type == 'league_class'"
				>
					<view class="introduce-tit info-tit">
						课程介绍
					</view>
					<u-parse
						:content="courseData.introduce"
					></u-parse>
				</view>
				<!-- 购买 须知 和 约课规则 -->
				<view class="notice-box mar-t20">
					<view class="notice">
						{{
							buyType == 'course'
								? '约课规则'
								: '购买须知'
						}}
					</view>
					<view class="white-space mar-t20">
						<text v-if="parentData.type == 'typeCard'"> {{ cardInfo.instructions ||'' }}</text>
						<text v-else> {{ courseData.instructions ||'' }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="pad20" v-if="couponList.length">
			<u-cell-group :customStyle="{ background: '#fff' }">
				<u-cell
					title="优惠卷:"
					:value="couponName || '暂无'"
					:isLink="true"
					@click="couponShow = true"
				>
					<view class="" slot="icon">
						<u-icon
							name="coupon"
							size="22"
							color="#fe5e10"
						></u-icon>
					</view>
				</u-cell>
			</u-cell-group>
		</view>
		<!-- 支付方式 组件 -->
		<!-- 不是自定义购卡 -->
		<pay-way
			:type="buyType"
			ref="payWayRef"
			:butType="
				cardInfo.product_type == 'custom_card' ||
					couponId
			"
			:totalPrice="
				cardInfo.product_type == 'custom_card'
					? customData.total_price
					: totalPriceNum
			"
			:price="
				parentData.type == 'typeCard'
					? cardInfo.price
					: courseData.price
			"
			@payFun="payFun"
			@goAgreement="goAgreement"
		></pay-way>

		<u-action-sheet
			:actions="couponList"
			title="优惠卷列表"
			:show="couponShow"
			cancelText="关闭"
			@close="couponShow = false"
			@select="selectCoupon"
		></u-action-sheet>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
// 支付方式组件
import payWay from '@/components/payWay/payWay.vue';
import {
	getSelectCourseInfo,
	payForCourses,
	getCardDetail,
	payCard,
	getCardNumInfo
} from '@/api/storeApis.js';
export default {
	components: {
		payWay
	},
	data() {
		return {
			// ftp地址
			baseUrl: baseUrl,

			// 是否勾选协议
			agreementState: false,
			// 私教课购卡次数
			numberVal: 1,
			// 课程数据
			courseData: {},
			// 父级传递的参数
			parentData: {},
			// 自己信息
			userInfo: {},
			// 选中的支付方式
			selectPay: '',
			// 购卡信息
			cardInfo: {},
			// 购卡支付方式
			payCardType: [],
			// 自定义购卡次数数据
			customData: {},
			// 购买类型
			buyType: '',
			/* 使用优惠卷后总金额 */
			totalPriceNum: 0,
			// 优惠卷列表
			couponList: [],
			// 选择优惠卷show
			couponShow: false,
			/* 优惠卷id */
			couponId: '',
			/* 优惠卷名称 */
			couponName: '',
			firstCoupon: 0,
		};
	},
	onLoad(eve) {
		this.buyType = eve.type;
		this.userInfo = this.$store.getters.getUserInfo;
		this.parentData = JSON.parse(eve.parentData);
		if (this.parentData.type == 'typeCard') {
			// 购卡
			this.getCardInfo(); // 获取购卡info
		} else {
			this.getCourseInfo(); // 获取购课info
		}
	},
	methods: {
		/* 选中优惠卷 */
		selectCoupon(e) {
			this.couponName = e.name;
			this.couponId = e.id; // 优惠卷id
			if (this.parentData.type == 'typeCard') {
				// 购卡
				this.getCardInfo(); // 获取购卡info
			} else {
				this.getCourseInfo(); // 获取购课info
			}
		},
		// 获取会员卡详情
		getCardInfo() {
			getCardDetail({
				id: this.parentData.crad_id,
				coupon_id: this.couponId
			}).then(res => {
				this.payCardType = res.data.pay_type;
				this.$refs.payWayRef.getPayList(
					res.data.pay_type
				);
				/* 获取使用优惠卷之后的总金额 */
				this.totalPriceNum = res.data.total_price;
				this.cardInfo = res.data.data;
				if (res.data.coupon.length) {
					res.data.coupon.map(item => {
						item.name = `${item.name} (${
							item.bond_price
						}元)`;
					});
					this.couponList = res.data.coupon;
					if ((this.couponId === '' || this.couponId === undefined) && !this.firstCoupon) {
						this.firstCoupon = 1;
						this.couponName =
							res.data.coupon[0].name;
						this.couponId = res.data.coupon[0].id;
					}
				}
				if (
					this.cardInfo.product_type == 'custom_card'
				) {
					// 自定义购卡次数
					this.getCardNumInfo();
				}
			});
		},
		// 获取购买卡自定义次数数据
		getCardNumInfo() {
			getCardNumInfo({
				id: this.parentData.crad_id,
				num: this.numberVal,
				coupon_id: this.couponId
			}).then(res => {
				this.customData = res.data;
			});
		},
		// 购买私教卡数量发生改变
		changeNum(eve) {
			this.numberVal = eve.value
			this.getCardNumInfo();
		},
		// 支付
		payFun(eve) {
			if (!eve.selectPayType || !eve.agreementState) {
				uni.showToast({
					title: '请选择支付方式和勾选协议',
					icon: 'none'
				});
				return;
			}
			let payObj = {};
			if (
				this.parentData.card_type ==
					'private_teaching' ||
				this.parentData.card_type == 'home_training'
			) {
				// 私教课购买 ||  居家训练
				payObj = {
					coach_id: this.parentData.coach_id, // 教练id
					period: this.parentData.period, // 时间段id
					card_type: this.parentData.card_type, // 课程类型
					date: this.parentData.date, // 选中日期
					pay_type: eve.selectPayType, // 支付方式
					store_id: this.parentData.storeId, // 门店id
					card_id:
						eve.selectPayType == 'mbcard'
							? eve.card_id
							: '', // 会员卡id
					coupon_id: this.couponId
				};
			} else if (
				this.parentData.card_type == 'autonomous_class'
			) {
				// 自主练购课
				payObj = {
					period: this.parentData.period, // 时间段id
					card_type: this.parentData.card_type, // 课程类型
					date: this.parentData.date, // 选中日期
					pay_type: eve.selectPayType, // 支付方式
					card_id:
						eve.selectPayType == 'mbcard'
							? eve.card_id
							: '', // 会员卡id
					store_id: this.parentData.storeId, // 门店id
					autonomous_id: this.parentData.autonomous_id, // 自主练 课程id
					coupon_id: this.couponId
				};
			} else if (
				this.parentData.card_type == 'league_class'
			) {
				// 团课购课
				payObj = {
					coach_id: this.parentData.coach_id, // 教练id
					period: this.parentData.period, // 时间段id
					card_type: this.parentData.card_type, // 课程类型
					date: this.parentData.date, // 选中日期
					pay_type: eve.selectPayType, // 支付方式
					store_id: this.parentData.storeId, // 门店id
					card_id:
						eve.selectPayType == 'mbcard'
							? eve.card_id
							: '', // 会员卡id
					groupclass_id: this.parentData.groupclass_id, // 团课 课程id
					coupon_id: this.couponId
				};
			} else if (this.parentData.type == 'typeCard') {
				// 购卡
				payObj = {
					id: this.parentData.crad_id,
					pay_type: eve.selectPayType,
					num:
						this.cardInfo.product_type ==
						'custom_card'
							? this.numberVal
							: '',
					coupon_id: this.couponId
				};
			}
			uni.showModal({
				title: '提示',
				content:  this.buyType == 'course' ? '确定预约当前课程吗？' : '确定购买当前产品吗？',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						if (this.parentData.type == 'typeCard') {
							this.payCardFun(payObj);
						} else {
							this.payForCoursesFun(payObj);
						}
					}
				}
			});
		},
		/* 购课 */
		payForCoursesFun(eve) {
			// 购课
			payForCourses({
				...eve
			}).then(res => {
				if (
					res.data instanceof Object &&
					res.data.hasOwnProperty('order_sn') &&
					!res.data.hasOwnProperty('appId')
				) {
					uni.showToast({
						title: res.msg,
						icon: 'success'
					});
					setTimeout(() => {
						if (this.buyType == 'course') {
							uni.navigateTo({
								url: `/pages/myCenter/pages/appointmentRecord/appointmentRecord?type="course"`
							});
						}
					}, 1500);
				} else {
					this.wxPay(res.data);
				}
			});
		},
		/* 购卡 */
		payCardFun(eve) {
			// 购卡
			payCard({
				...eve
			}).then(res => {
				if (
					res.data instanceof Object &&
					res.data.hasOwnProperty('order_sn') &&
					!res.data.hasOwnProperty('appId')
				) {
					uni.showToast({
						title: res.msg,
						icon: 'success'
					});

					setTimeout(() => {
						uni.navigateTo({
							url: `/pages/store/pages/paySuccess/paySuccess?orderInfo=${JSON.stringify(
								res.data
							)}&type=1`
						});
					}, 1500);
				} else {
					this.wxPay(res.data);
				}
			});
		},
		// wx支付
		wxPay(eve) {
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: eve.timeStamp,
				nonceStr: eve.nonceStr,
				package: eve.package,
				signType: eve.signType,
				paySign: eve.paySign,
				success: function(res) {
					uni.showToast({
						title: '微信支付成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: `/pages/store/pages/paySuccess/paySuccess?order_sn=${
								eve.order_sn
							}&type=2`
						});
					}, 1500);
				},
				fail: function(err) {
					uni.showToast({
						title: '支付失败',
						icon: 'error'
					});
				}
			});
		},
		// 跳转购卡协议页面
		goAgreement() {
			uni.navigateTo({
				url:
					'/pages/store/pages/buyCardAgreement/buyCardAgreement'
			});
		},
		// 预览图片
		previewImage(img) {
			let arr = [img];
			uni.previewImage({
				current: 0, //预览图片的下标
				urls: arr //预览图片的地址，必须要数组形式
			});
		},
		// 获取课程详情
		getCourseInfo() {
			let _this = this;
			getSelectCourseInfo({
				...this.parentData
			}).then(res => {
				this.$refs.payWayRef.getPayList(
					res.data.pay_type,
					'buyCourse'
				);
				_this.courseData = res.data;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	/deep/ .u-number-box {
		.u-number-box__plus,
		.u-number-box__minus {
			// width: 45rpx !important;
			.u-icon__icon {
				width: auto !important;
				font-size: 24rpx !important;
			}
		}
		.u-number-box__input {
			font-size: 24rpx !important;
		}
	}
.white-space {
	white-space: pre-wrap;
}
.notice-box {
	font-size: 26rpx;

	.notice {
		font-weight: 600;
		font-size: 28rpx;
	}
}
.introduce-img {
	width: 100%;
	image {
		width: 95%;
	}
}
.customCardSty {
	.numTips {
		background-color: #f43333;
		border-radius: 20rpx;
		font-weight: 500;
		color: #ffffff;
		font-size: 20rpx;
		padding: 4rpx 0;
		min-width: 230rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		box-sizing: content-box;
		z-index: 99;
	}
	position: relative;
}
.txt2 {
	padding: 5rpx 15rpx;
	font-weight: 500;
	color: #fe5e10;
	font-size: 20rpx;
	background: #fff3ed;
	border-radius: 30rpx;
}
.minus {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	border: 1px solid #eee;
	@include flex;
	justify-content: center;
	align-items: center;
}

.input {
	padding: 0 10rpx;
}

.plus {
	width: 44rpx;
	height: 44rpx;
	background-color: #ccc;
	border-radius: 50%;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	justify-content: center;
	align-items: center;
}
.quota-tips {
	width: 100%;
	padding: 8rpx 0;
	background-color: #fe5e10;
	opacity: 1;
	border-radius: 8rpx;
	color: #fff;
	font-weight: 500;
	font-size: 28rpx;
	margin-top: 40rpx;
}
.course-introduce,
.personalCard-introduce {
	.introduce-img {
		margin-top: 30rpx;
	}
	.introduce-info {
		margin-top: 40rpx;
		font-weight: 400;
		color: #999999;
		font-size: 30rpx;
		line-height: 50rpx;
	}
	font-size: 26rpx;
}
.info-tit {
	font-weight: 600;
	color: rgba(32, 32, 32, 0.9);
	font-size: 28rpx;
}
.subscribe-info {
	.subscribe-content {
		font-weight: 500;
		color: rgba(0, 0, 0, 0.8);
		font-size: 26rpx;
	}
	.subscribe-tit {
		font-weight: 400;
		color: rgba(0, 0, 0, 0.6);
		font-size: 26rpx;
	}
	.site,
	.subscribe-time,
	.attendClass {
		justify-content: space-between;
	}
}
.content {
	.subscribe-info {
		justify-content: space-between;
	}
	.course-head {
		.course-price {
			.price-num {
				color: #fe5e10;
				font-size: 38rpx;
				font-family: DIN-Bold, DIN;
				font-weight: bold;
			}
		}
		.course-img {
			.course-name {
				.time {
					font-weight: 400;
					color: #999999;
					font-size: 22rpx;
				}
				.name {
					font-weight: bold;
					color: #2f2f2f;
					font-size: 30rpx;
				}
				height: 130rpx;
				justify-content: space-between;
			}
		}
		justify-content: space-between;
	}
	.course-info {
		width: 100%;
		background-color: #fff;
		padding: 30rpx 20rpx;
		border-radius: 20rpx;
	}
	padding: 20rpx;
}
.wrap {
	background-color: #f9f9f9;
	min-height: 100vh;
	width: 100%;
}
view {
	font-family: PingFang SC-Medium, PingFang SC;
}
</style>
