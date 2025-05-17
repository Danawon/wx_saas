<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="会员卡管理"
		></head-nav>
		<view class="page">
			<view class="page-top padlr20 pad-b40 flex-a ju-bt">
				<view class="search-box">
					<view class="search-ipt">
						<u-search
							borderColor="#FE5E10"
							shape="round"
							bgColor="#fff"
							height="70rpx"
							v-model="searchVal"
							placeholder="搜索用户昵称"
							:showAction="false"
							:inputStyle="{
								'padding-right': '95rpx'
							}"
						></u-search>
					</view>
					<view
						class="search-btn flex"
						@click="searchFun"
					>
						搜索
					</view>
				</view>
			</view>
			<view class="page-nav flex-a ju-bt pad-b40">
				<view class="nav" @click="changeSort('card')">
					会员卡状态
				</view>
				<view class="nav" @click="changeSort('course')">
					已上课次数
				</view>
				<view class="nav" @click="changeSort('days')">
					剩余天数
				</view>
			</view>

			<view class="page-list">
				<view
					class="page-li "
					v-for="(item, index) in list"
					:key="index"
				>
					<view class="flex-j">
						<view class="img-box mar-r40">
							<u--image
								:src="item.user.avatar"
								width="128rpx"
								height="128rpx"
								shape="circle"
							></u--image>
						</view>

						<view class="li-center flex-col">
							<text class="name">
								{{ item.user.nickname }} <text class="idSty">(id: {{ item.user.id }})</text>
							</text>
							<text>
								会员卡名称：{{
									item.membercard.name || ''
								}}
							</text>
							<text>
								已约课/剩余次数：{{
									item.total_times -
										item.number
								}}/{{ item.number }}
							</text>
							<text>
								剩余天数：{{ item.shenday }}
							</text>
							<text>
								激活时间：{{
									item.activation_time
								}}
							</text>
							<text>
								购买时间：{{ item.createtime }}
							</text>
							<text>
								会员卡金额：{{
									item.membercardoreder
										.membercard_price
								}}
							</text>
							<text>
								会员卡状态：{{
									item.status_text
								}}
							</text>
							<view  v-for="(stopusingItem, stopusingIndex) in item.stopusing_list" :key="stopusingIndex">
								<view>
									停卡时间：{{
										stopusingItem.createtime
									}}
								</view>
								<view>
									停卡天数：{{
										stopusingItem.downday
									}}
								</view>
							</view>
							
						</view>
						<view class="li-right flex-col">
							<text
								class="title"
								v-if="
									item.membercardoreder
										.coach_id
								"
							>
								销售：{{
									item.membercardoreder
										.coachname
								}}
							</text>

							<text
								class="sb-tips btn flex"
								v-if="
									item.is_recording &&
										!roleType
								"
							>
								业绩申报中
							</text>
							<text
								class="sb-tips btn flex"
								v-if="
									item.is_examine && !roleType
								"
							>
								审核中
							</text>

							<!-- 财务端 -->
							<view
								class=""
								v-if="roleType == 'finance'"
							>
								<text
									class="sb btn flex"
									v-if="item.is_recording"
									@click="jump(item)"
								>
									业绩申报
								</text>
								<view v-if="item.is_examine && item.examine">
									<view
										class="btn zk"
										@click="
											operation(1, item)
										"
										v-if="item.examine.type == 'transfercard'"
									>
										转卡
									</view>
									<view
										class="btn"
										@click="
											operation(2, item)
										"
										v-if="item.examine.type == 'stopusing'"
									>
										停卡
									</view>
									<view
										class="btn tk"
										@click="
											operation(3, item)
										"
										v-if="item.examine.type == 'cardreturn'"
									>
										退卡
									</view>
								</view>
								<view
									v-if="item.examine.type === 'stopusing_update'"
									class="btn zk"
									@click="
										operation('editStopCard', item)
									"
								>
									更新停卡日期
								</view>
							</view>

							<!-- 店长端 -->
							<view class="" v-if="!roleType">
								<text
									class="sb btn flex"
									v-if="!item.is_recording"
									@click="jump(item)"
								>
									业绩申报
								</text>
								<view v-if="!item.is_examine && item.status == 1">
									<view
										class="btn zk"
										@click="
											operation(1, item)
										"
									>
										转卡
									</view>
									<view
										class="btn"
										@click="
											operation(2, item)
										"
									>
										停卡
									</view>
									<view
										class="btn tk"
										@click="
											operation(3, item)
										"
									>
										退卡
									</view>
								</view>
								<view
									v-if="item.status === 2"
									class="btn zk"
									@click="
										operation('editStopCard', item)
									"
								>
									停卡编辑
								</view>
								<view
									v-if="item.status <= 1 && !item.is_recording && !item.is_examine"
									class="btn zk"
									@click="
										cancellationCard(item)
									"
								>
									作废
								</view>
							</view>
						</view>
					</view>
					<view class="li-bottom flex-a ju-bt pad-b20">
						<view class="pad-l40 pad-t20">
							订单实付金额：
							<text class="num">
								{{
									item.membercardoreder
										.order_price
								}}元
							</text>
						</view>
						<view class="pad-l40 pad-t20">
							使用优惠券面额：
							<text class="num">
								{{
									item.membercardoreder
										.discount_price
								}}元
							</text>
						</view>
						<view class="pad-l40 pad-t20">
							线下补录金额：
							<text class="num">
								{{
									item.membercardoreder
										.additional_recording
								}}元
							</text>
						</view>
						<view class="pad-l40 pad-t20">
							补录后总金额：
							<text class="num">
								{{
									Number(
										item.membercardoreder
											.total_price
									) +
										Number(
											item.membercardoreder
												.additional_recording
										)
								}}元
							</text>
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
		<!-- 弹框 -->
		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			:title="modalTitle"
			:confirmText="roleType ? '通过' : '确定'"
			:cancelText="roleType ? '拒绝' : '取消'"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentConfirm="modalConfirm"
			@parentCancel="modalCancel"
		>
			<!-- 财务模块 -->
			<view
				class="finance-box mar-t20 pad-b40"
				v-if="roleType == 'finance'"
			>
				<view class="" v-if="modalType == 1">
					<view class="">
						转卡时间：{{
							selectCard.examine.createtime
						}}
					</view>
					<view class="mar-t20">
						转卡uid：{{
							selectCard.examine.transfer_uid
						}}
					</view>
				</view>
				<view class="" v-if="modalType == 3">
					<view class="">
						退卡时间：{{
							selectCard.examine.createtime
						}}
					</view>
					<view class="mar-t20">
						退卡金额：{{
							selectCard.examine.refund_amount
						}}
					</view>
				</view>
				<view class="" v-if="modalType == 2">
					<view class="">
						停卡时间：{{
							selectCard.examine.downdate
						}}
					</view>
					<view class="mar-t20">
						停卡天数：{{
							selectCard.examine.downday
						}}
					</view>
				</view>
				<view class="" v-if="modalType === 'editStopCard'">
					停卡天数：{{ selectCard.examine.downday	}} 
				</view>
				<view class="" v-if="modalType == 4">
					<view class="">
						申报时间：{{
							selectCard.supplement.createtime
						}}
					</view>
					<view class="mar-t20">
						补录金额：{{
							selectCard.supplement
								.additional_recording
						}}
					</view>
				</view>
			</view>

			<!-- 店长模块数据 -->
			<view class="" v-if="!roleType">
				<!-- 转卡 -->
				<view
					class="modalTxt pad-b40 flex"
					v-if="modalType === 'editStopCard'"
				>
					<view 
						class="mar-t20 w100" 
					>
						<u-input
							placeholder="请输入停卡天数"
							prefixIcon="clock"
							v-model="editStopCardDay"
							border="surround"
						></u-input>
					</view>
				</view>
				<!-- 转卡 -->
				<view
					class="modalTxt pad-b40 flex"
					v-if="modalType == 1"
				>
					<u-input
						placeholder="输入会员ID"
						v-model="userId"
						border="surround"
					></u-input>
				</view>
				<!-- 停卡 -->
				<view
					class="modalTxt pad-b40 "
					v-if="modalType == 2"
				>
					<u-input
						placeholder="输入停卡天数"
						v-model="stopDays"
						type="digit"
						border="surround"
					></u-input>
					<view
						class="mar-t20"
						@click="timeShow = true"
					>
						<u-input
							placeholder="选择时间（默认展示全部时间）"
							prefixIcon="clock"
							v-model="selectTime"
							border="surround"
							disabled
							disabledColor="#fff"
						></u-input>
					</view>
				</view>
				<!-- 退卡 -->
				<view
					class="modalTxt pad-b40 "
					v-if="modalType == 3"
				>
					<u-input
						placeholder="金额"
						border="surround"
						v-model="refundMoney"
						type="digit"
					></u-input>
					<u-gap height="10rpx" bgColor="#fff"></u-gap>
					<u-textarea
						placeholder="请输入备注"
						v-model="refundRemark"
					></u-textarea>
				</view>
			</view>
		</modal-tips>
		<u-datetime-picker
			:show="timeShow"
			mode="date"
			v-model="defaultSelectTime"
			:minDate="new Date().getTime()"
			@confirm="selectTimeFun"
			@close="timeShow = false"
			@cancel="timeShow = false"
		></u-datetime-picker>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import modalTips from '@/components/modalTips/modalTips.vue';
import {
	vipCardList,
	cardAssignment,
	stopCard,
	refundCard,
	updateStopDate,
	membercardNullify
} from '@/api/storeApis.js';
import { timestampToTime } from '@/utils/util.js';
import { submitMembercardSupplement, auditCard } from "@/api/finance.js"
export default {
	components: {
		modalTips
	},
	data() {
		return {
			timestampToTime: timestampToTime,
			baseUrl: baseUrl,
			modalShow: false,
			modalType: 0, //弹框类型 1转  2停  3退卡
			modalTitle: '', //弹框标题
			current: 1,
			list: [],
			selectCard: {}, // 选中的会员卡
			userId: '', // 转卡会员id
			selectTime: '', // 选中时间
			stopDays: '', // 停卡天数
			timeShow: '', // 日期 show
			defaultSelectTime: '', // 默认时间
			refundMoney: '', // 退卡金额
			refundRemark: '', // 退卡备注
			searchVal: '', // 搜索val
			cardState: false, // 会员卡状态
			courseState: false, // 课程次数状态
			daysState: false, // 剩余天数状态
			/* 角色类型 */
			roleType: '',
			/* 门店id */
			storeId: '',
			editStopCardDay: "", // 编辑停卡天数
		};
	},
	onLoad(e) {
		if (e.role_id && e.role) {
			uni.setStorageSync('relation_id', e.role_id);
			uni.setStorageSync('role', e.role);
		}
		this.roleType = e.role ?? '';
		this.storeId = e.storeId;
		// this.getVipCardList();
	},
	onShow() {
		this.resetFun();
	},
	onReachBottom() {
		this.current++;
		this.getVipCardList();
	},
	methods: {
		/* 将卡设为作废状态 */
		cancellationCard(item) {
			let _this = this;
			uni.showModal({
				title: "提示",
				content: "确定将当前卡作废吗？",
				success(res) {
					if(res.confirm) {
						membercardNullify({
							id: item.id
						}).then(res => {
							_this.$refs.uToast.show({
								type: 'success',
								title: '成功主题',
								message: res.msg
							});
							setTimeout(() => {
								_this.resetFun();
							}, 1500);
						})
					}
				}
			})
		},
		/* 更新停卡日期 */
		updateStopCardDateFun() {
			updateStopDate({
				id: this.selectCard.id,
				downday: this.editStopCardDay
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					title: '成功主题',
					message: res.msg
				});
				setTimeout(() => {
					this.resetFun();
				}, 1500);
			})
		},
		/* 更改排序状态 */
		changeSort(e) {
			if (e == 'card') {
				this.cardState = !this.cardState;
			} else if (e == 'course') {
				this.courseState = !this.courseState;
			} else if (e == 'days') {
				this.daysState = !this.daysState;
			}
			this.resetFun();
		},
		// 选中时间
		selectTimeFun(eve) {
			this.timeShow = false;
			let date = timestampToTime(
				eve.value / 1000
			).split(' ')[0];
			this.selectTime = date;
		},
		// 搜索
		searchFun() {
			this.resetFun();
		},
		// 获取会员卡列表
		getVipCardList() {
			vipCardList({
				page: this.current,
				list_rows: 10,
				status: !this.cardState ? 'desc' : 'asc',
				number: !this.courseState ? 'desc' : 'asc',
				expirationtime: !this.daysState ? 'desc' : 'asc',
				keyword: this.searchVal,
				store_id: this.storeId
			}).then(res => {
				this.list = [...this.list, ...res.data.data];
				this.list.map(item => {
					if(item.examine) {
						item.examine.downdate = timestampToTime(item.examine.downdate)
					}
				})
			});
		},
		resetFun() {
			this.current = 1;
			this.list = [];
			this.getVipCardList();
		},
		// 业绩申报
		jump(e) {
			if (this.roleType) {
				this.modalTitle = '业绩申报';
				this.selectCard = e;
				this.modalType = 4; // 代表业绩申报
				this.modalShow = true;
				return;
			}
			uni.navigateTo({
				url: `/pages/admin/pages/resultsDeclare/resultsDeclare?id=${
					e.id
				}`
			});
		},
		// 停卡
		stopCardFun() {
			stopCard({
				downday: this.stopDays,
				downdate: this.selectTime,
				id: this.selectCard.id
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					title: '成功主题',
					message: res.msg
				});
				setTimeout(() => {
					this.resetFun();
				}, 1500);
			});
		},
		// 转卡
		cardAssignmentFun() {
			cardAssignment({
				uid: this.userId,
				id: this.selectCard.id
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					title: '成功主题',
					message: res.msg
				});
				setTimeout(() => {
					this.resetFun();
				}, 1500);
			});
		},
		// 退卡
		refundCardFun() {
			refundCard({
				id: this.selectCard.id,
				refund_memo: this.refundRemark,
				refund_amount: this.refundMoney
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					title: '成功主题',
					message: res.msg
				});
				setTimeout(() => {
					this.resetFun();
				}, 1500);
			});
		},
		//弹框取消
		modalCancel() {
			this.modalShow = false;
			this.operationFun(0);
		},
		/* 同意、拒绝封装 */
		operationFun(state) {
			/* 财务身份 进入*/
			if (this.roleType == 'finance') {
				if(this.modalType == 4) {
					/* 同意业绩申报 */
					this.submitPerformance(state);
				}else if(this.modalType == 1 ||this.modalType == 2 || this.modalType == 3 || this.modalType == 'editStopCard') {
					/* 转卡 | 停卡 |  退卡 | 更新停卡时间 */
					this.auditFun(state);
				}
			}
		},
		// 退卡 转卡 停卡 操作页面
		auditFun(state) {
			auditCard({
				id: this.selectCard.examine.id,
				status: state
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.resetFun();
				}, 1500);
			});
		},
		/* 财务操作 业绩申报 */
		submitPerformance(state) {
			// state -> 1 通过 0 -> 拒绝
			submitMembercardSupplement({
				id: this.selectCard.supplement.id,
				status: state
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {  
					this.resetFun();
				}, 1500)
			})
		},
		//弹框确认
		modalConfirm() {
			if (this.roleType == 'finance') {
				this.operationFun(1);
			} else {
				/* 店长模块 */
				if (this.modalType == 1) {
					if (!this.userId) {
						uni.showToast({
							title: '请输入转卡人会员ID',
							icon: 'none'
						});
						return;
					}
					// 转卡
					this.cardAssignmentFun();
				} else if (this.modalType == 2) {
					if (!this.stopDays || !this.selectTime) {
						uni.showToast({
							title: '请输入停卡完整信息',
							icon: 'none'
						});
						return;
					}
					// 停卡
					this.stopCardFun();
				} else if (this.modalType == 3) {
					if (!this.refundMoney) {
						uni.showToast({
							title: '请输入退卡完整信息',
							icon: 'none'
						});
						return;
					}
					// 退卡
					this.refundCardFun();
				}else if(this.modalType === "editStopCard") {
					if(!this.editStopCardDay) {
						uni.showToast({
							title: '请输入停卡天数',
							icon: 'none'
						});
						return;
					}
					this.updateStopCardDateFun();
				}
			}
			this.modalShow = false;
		},
		// 情况ipt数据
		removeValFun() {
			this.stopDays = '';
			this.selectTime = '';
			this.userId = '';
			this.refundMoney = '';
			this.refundRemark = '';
		},
		//调起弹框
		operation(type, item) {
			this.removeValFun();
			this.modalTitle =
				type == 1
					? '转卡'
					: type == 2
					? '停卡'
					: type == 3
					? '退卡'
					: '编辑停卡日期';
			this.selectCard = item;
			this.modalType = type;
			this.modalShow = true;
		}
	}
};
</script>

<style lang="scss" scoped>
	.w100 {
		width: 100%;
	}
	.idSty {
		font-size: 24rpx;
		color: #999;
	}
.sb-tips {
	font-size: 24rpx;
	color: #ccc;
	border: none !important;
}
.page {
	.page-top {
		.date-img {
			width: 52rpx;
			height: 50rpx;
			margin-right: 28rpx;
		}

		.search-box {
			.search-btn {
				width: 150rpx;
				height: 75rpx;
				color: #fff;
				font-size: 28rpx;
				margin-left: -20rpx;
				background: linear-gradient(
					102deg,
					#ff7c3c 0%,
					#fe5e10 100%
				);
				border-radius: 50rpx;
				position: absolute;
				top: 0rpx;
				right: 20rpx;
			}

			.search-ipt {
				width: 95%;
			}

			width: 100%;
			position: relative;
		}
	}

	.page-nav {
		padding: 0 26rpx;
		color: #999999;
		font-weight: 400;

		.nav {
			padding: 10rpx 20rpx;
			background: #f5f5f5;
			box-shadow: inset 0px 0px 10rpx 4rpx
				rgba(0, 0, 0, 0.15);
			border-radius: 20rpx;
			font-size: 28rpx;
			border: 1rpx solid rgba(153, 153, 153, 0.5);
		}
	}

	.page-list {
		padding: 0 32rpx 30rpx;

		.page-li {
			padding: 30rpx 0 40rpx;
			color: #999999;
			line-height: 48rpx;
			font-size: 22rpx;
			border-bottom: #e7e7e7 1rpx solid;

			.li-right {
				margin-left: auto;
			}
			.btn {
				width: 190rpx;
				font-size: 24rpx;
				border: 1rpx solid #999;
				border-radius: 6rpx;
				margin-bottom: 20rpx;
				text-align: center;
			}
			.sb {
				width: 190rpx;
				height: 48rpx;
				border: 1rpx solid #fe5e10;
				color: #fe5e10;
			}

			.name {
				color: #202020;
				font-size: 32rpx;
			}

			.title {
				font-weight: 500;
				font-size: 24rpx;
				color: #fe5e10;
			}

			.btn.zk {
				border-color: #ffa376;
				color: #ffa376;
			}
			.btn.tk {
				border-color: #ef0708;
				color: #ef0708;
			}
			.li-bottom {
				margin-top: 26rpx;
				border-radius: 20rpx;
				opacity: 1;
				flex-wrap: wrap;
				padding-right: 48rpx;
				font-size: 24rpx;
				border: 2rpx solid #fe5e10;

				.num {
					color: #ef0708;
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>
