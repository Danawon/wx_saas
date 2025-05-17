<template>
	<view>
		<!-- 有柜子背景 -->
		<image
			v-if="lockerInfo.length"
			:src="baseUrl + '/manager/lockerBg.png'"
			mode=""
			class="lockerBg"
		></image>
		<!-- 没柜子背景 -->
		<image
			v-else
			:src="baseUrl + '/manager/lockerNo.png'"
			mode=""
			class="lockerBg"
		></image>
		<view class="page">
			<head-nav
				iconC="#fff"
				titColor="#fff"
				title="储物柜列表"
				bgColor="transparent"
				:goBack="true"
			></head-nav>
			<view class="head-tit  pad20" @click="goRouter">
				租赁记录
			</view>
			<view
				class="box-ipt mar-b40"
				style="margin-bottom: 40rpx;"
				v-if="!lockerInfo.length"
			>
				<view class="flex pad-b40">暂无储物柜</view>
			</view>
			<!-- 有柜子 -->
			<view class="box-ipt" v-if="lockerInfo.length">
				<view class="tabs-box flex">
					<u-tabs
						:list="lockerInfo"
						:current="currentLocker"
						@change="lockerChange"
					></u-tabs>
				</view>
				<view class="time flex">
					有效期：{{
						lockerInfo[currentLocker].validity_text
					}}
				</view>
				<view
					class="reset-box flex mar-t40"
					@click="modalShow = true"
				>
					重置密码
				</view>
				<view
					class="ipt-btn flex"
					@click="openLockerFun"
				>
					开柜
				</view>
			</view>
			<!-- <view class="list-title flex-a mar-l40 mar-b40">
				<u-icon slot="prefix" size="38rpx" :name="baseUrl + '/manager/lockerIcon.png'"></u-icon>
				更多储物柜
			</view> -->
			<view
				class="list-box   mar-t20 mar-l20 mar-r20 mar-b20"
			>
				<view
					class="lists"
					v-for="(itme, index) in lockerList"
					:key="index"
				>
					<view class="li-tit mar-b20 flex-row flex-a">
						<u-icon
							slot="prefix"
							size="38rpx"
							:name="
								baseUrl +
									'/manager/lockerIcon.png'
							"
						></u-icon>
						<view class="mar-l20">
							{{ itme.cabinetName }}
						</view>
					</view>
					<view class="lists-item felx-row flex-a">
						<view
							class="li flex-col ju-bt flex-a mar-b40"
							v-for="(liItme,
							liIndex) in itme.list"
							:key="liIndex"
						>
							<view class="li-tit">
								{{ liItme.boxNo }}号柜
							</view>
							<view class="li-img martb20">
								<u--image
									:showLoading="true"
									:src="
										baseUrl + 'locker1.png'
									"
									width="100rpx"
									height="75rpx"
									mode="scaleToFill"
								></u--image>
							</view>
							<view class="btn-state flex">
								<view
									class="stat1 btn"
									v-if="liItme.status == 1"
								>
									已租
								</view>
								<view
									class="stat2 btn"
									v-else
									@click.stop="
										leaseLocker(liItme)
									"
								>
									租赁
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-empty
				v-if="!lockerList.length"
				mode="list"
				text="暂无储物柜数据..."
			></u-empty>
		</view>

		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			title="密码重置"
			confirmText="确定"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentConfirm="modalConfirm"
			@parentCancel="modalCancel"
		>
			<view class="modalTxt pad-b40 flex">
				<view class="lable ">重置密码:</view>
				<u--input
					placeholder="请输入重置密码"
					border="surround"
					v-model="passWord1"
					maxlength="4"
					type="number"
				></u--input>
			</view>
			<view class="modalTxt martb20 pad-b40 flex">
				<view class="lable ">确认密码:</view>
				<u--input
					placeholder="请输入重置密码"
					border="surround"
					v-model="passWord2"
					maxlength="4"
					type="number"
				></u--input>
			</view>
		</modal-tips>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import {
	getLockerListUser,
	myLockerInfo,
	openLocker,
	resetPassword
} from '@/api/myCenter.js';
import modalTips from '@/components/modalTips/modalTips.vue';
export default {
	components: {
		modalTips
	},
	data() {
		return {
			baseUrl: baseUrl,

			// 门店id
			storeId: '',
			// 储物柜列表
			lockerList: [],
			// 租赁信息
			lockerInfo: {},

			// 当前页
			current: 1,
			currentLocker: 0,
			modalShow: false, // modalshow
			passWord1: '', // 重置密码
			passWord2: '' // 确认重置密码
		};
	},
	onLoad(eve) {
		this.storeId = eve.id;
	},
	onShow() {
		this.lockerList = [];
		this.current = 1;
		this.getMyLockerInfo();
		this.getLockerListFun();
	},
	// onReachBottom() {
	// 	this.current ++
	// 	this.getLockerListFun();
	// },
	methods: {
		/* modal确定 */
		modalConfirm() {
			if (!this.passWord1 || !this.passWord2) {
				uni.showToast({
					title: '请输入重置密码',
					icon: 'none'
				});
				return;
			}
			if (
				this.passWord1.length < 4 ||
				this.passWord2.length < 4
			) {
				uni.showToast({
					title: '密码不可小于四位数',
					icon: 'none'
				});
				return;
			}
			if (this.passWord1 != this.passWord2) {
				uni.showToast({
					title: '输入密码不一致',
					icon: 'none'
				});
				return;
			}
			resetPassword({
				id: this.lockerInfo[this.currentLocker].id,
				password: this.passWord1,
				password_again: this.passWord2,
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				this.modalCancel();
				this.passWord1 = "";
				this.passWord2 = "";
			})
		},
		/* modal取消 */
		modalCancel() {
			this.modalShow = false;
		},
		/* 柜子tabschange */
		lockerChange(e) {
			this.currentLocker = e.index;
		},
		// 开柜
		openLockerFun() {
			
			openLocker({
				id: this.lockerInfo[this.currentLocker].id,
			
			}).then(res => {
				uni.showToast({
					title: '打开成功'
				});

			});
		},
		// 获取我的租赁信息
		getMyLockerInfo() {
			myLockerInfo({
				store_id: this.storeId
			}).then(res => {
				this.lockerInfo = res.data;
			});
		},
		// 获取储物柜列表
		getLockerListFun() {
			getLockerListUser({
				store_id: this.storeId
			}).then(res => {
				this.lockerList = [
					...this.lockerList,
					...res.data
				];
			});
		},
		// 跳转
		goRouter() {
			uni.navigateTo({
				url: `/pages/myCenter/pages/LeaseRecord/LeaseRecord?storeId=${
					this.storeId
				}`
			});
		},
		// 跳转柜子租赁
		leaseLocker(eve) {
			uni.navigateTo({
				url: `./leaseLocker?id=${eve.id}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.modalTxt {
	.lable {
		width: 30%;
	}
}
.reset-box {
	color: #ccc;
	font-size: 26rpx;
	justify-content: flex-end;
}
.lockerBg {
	width: 100%;
	height: 634rpx;
	position: absolute;
	top: 0%;
	left: 0;
}
.page {
	position: relative;
}
.box-ipt {
	margin: 382rpx 40rpx 0;
	.time {
		margin-top: 20rpx;
		color: rgba(0, 0, 0, 0.4);
		font-size: 22rpx;
	}

	.ipt-btn {
		width: 554rpx;
		margin: 70rpx auto;
		height: 74rpx;
		background: #fe5e10;
		color: #ffffff;
		font-size: 32rpx;
		border-radius: 54rpx;
	}
}
.list-title {
	font-weight: 500;
	color: #333333;
	font-size: 30rpx;
}
.list-box {
	.lists {
		.li-tit {
			font-size: 30rpx;
			font-weight: bold;
		}
		.lists-item {
			flex-wrap: wrap;
		}
	}
	.li {
		.btn-state {
			.stat2 {
				background: linear-gradient(
					272deg,
					#fe5e10 0%,
					rgba(254, 94, 16, 0.5) 100%
				);
			}
			.stat1 {
				background-color: #c9caca;
			}
			.btn {
				font-weight: 400;
				font-size: 24rpx;
				color: #fff;
				width: 75%;
				padding: 7rpx 0;
				text-align: center;
				display: inline-block;
				border-radius: 40rpx;
			}
			width: 100%;
		}
		.li-tit {
			font-weight: 400;
			color: #202020;
			font-size: 28rpx;
		}
		width: 20%;
	}
	flex-wrap: wrap;
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
		top: 20rpx;
		right: 20rpx;
	}
	.search-ipt {
		width: 95%;
	}
	width: 100%;
	position: relative;
	// margin: 40rpx 0;
}
.head-tit {
	display: flex;
	justify-content: flex-end;
	font-weight: 400;
	color: #fff;
	font-size: 28rpx;
}
</style>
