<template>
	<view>
		<head-nav :title="title" bgColor="#fff" :goBack="true"></head-nav>
		<view class="list-box padlr20 pad-t20">
			<view class="li " v-for="(item, index) in list" :key="index">
				<view class="flex-row flex-a">
					<view class="li-avatar">
						<u-avatar :src="item.avatar" size="150rpx"></u-avatar>
					</view>
					<view class="li-info flex-row flex-a ju-bt">
						<view class="info-l flex-col ju-ar">
							<view class="info-name">
								{{ item.name || 'xxxx' }}
							</view>
							<view class="account">
								手机号：{{ item.mobile }}
							</view>
							<view class="sdfjj-num">
								已授权门店：{{
									item.manage_store_name
								}}
							</view>
						</view>

						<view class="info-btn">
							<view class="btn" @click="delFun(item)">
								删除
							</view>
							<view
								class="btn edit-btn mar-t20"
								@click="editFun(item)"
							>
								编辑
							</view>
							<view
								class="btn add-btn mar-t20"
								v-if="type == 4"
								@click="allocationFun(item)"
							>
								分配患者
							</view>
						</view>
					</view>
				</view>
				<u-line margin="40rpx 0"></u-line>
			</view>
			<u-empty v-if="!list.length" mode="list" text="暂无数据..."></u-empty>
		</view>
		<view class="fot-btn pad20">
			<view class="btn flex" @click="goRouter('add')">
				新增人员
			</view>
		</view>
	</view>
</template>

<script>
	import {
		baseUrl
	} from '@/utils/baseUrl.js';
	import {
		shopManagerList,
		delShopManager,
		financeList,
		deleteFinance,
		investorList,
		deleteInvestor,
		doctorList,
		deleteDoctor,
	} from '@/api/admin.js'; 
	export default {
		data() {
			return {
				baseUrl: baseUrl,
				title: '分区财务管理',
				// 身份类型
				type: '',
				list: [],
				// 门店id
				storeId: '',
			};
		},
		onLoad(eve) {
			this.storeId = eve.storeId;
			this.type = eve.type
			if (eve.type == 1) {
				this.title = '分区财务管理';
			} else if (eve.type == 2) {
				this.title = '投资人管理';
			} else if (eve.type == 3) {
				this.title = '店长管理';
			} else if (eve.type == 4) {
				this.title = '医生管理';
			}
		},
		onShow() {
			if (this.type == 3) {
				// 店长管理列表
				this.getShopManagerList();
			} else if (this.type == 1) {
				// 获取分区财务列表
				this.getFinanceList();
			} else if (this.type == 2) {
				// 获取投资人
				this.getInvestorList();
			} else if (this.type == 4) {
				// 获取医生列表
				this.getDoctorList();
			}
		},
		methods: {
			/* 分配患者 */
			allocationFun(e) {
				uni.navigateTo({
					url: `/pages/admin/pages/selectUserHealth/selectUserHealth?storeId=${this.storeId || ''}&type=patient&doctorId=${e.id}`
				})
			},
			// 获取医生列表
			getDoctorList() {
				doctorList().then(res => {
					this.list = res.data;
				})
			},
			editFun(e) {
				this.goRouter('edit', e.id)
			},
			// 删除店长
			delShopManagerFun(eve) {
				delShopManager({
					id: eve
				}).then(res => {
					uni.showToast({
						title: res.msg
					});
					setTimeout(() => {
						// this.list = []
						this.getShopManagerList();
					}, 1000);
				});
			},
			// 删除分区财务
			delFinance(eve) {
				deleteFinance({
					id: eve
				}).then(res => {
					uni.showToast({
						title: res.msg
					});
					setTimeout(() => {
						this.getFinanceList();
					}, 1000);
				});
			},
			// 删除医生
			delDoctorFun(eve) {
				deleteDoctor({
					id: eve
				}).then(res => {
					uni.showToast({
						title: res.msg
					});
					setTimeout(() => {
						this.getDoctorList();
					}, 1000);
				});
			},
			// 删除投资人
			delInvestor(eve) {
				deleteInvestor({
					id: eve
				}).then(res => {
					uni.showToast({
						title: res.msg
					});
					setTimeout(() => {
						this.getInvestorList();
					}, 1000);
				});
			},
			// 删除分区财务
			delFinance(eve) {
				deleteFinance({
					id: eve
				}).then(res => {
					uni.showToast({
						title: res.msg
					})
					setTimeout(() => {
						this.getFinanceList();
					}, 1000)
				})
			},
			// 删除
			delFun(eve) {
				let markArr = {
					1: this.delFinance, // 删除分区财务
					2: this.delInvestor, // 删除投资人
					3: this.delShopManagerFun, // 删除店长
					4: this.delDoctorFun, // 删除医生
				}
				uni.showModal({
					title: "提示",
					content: "确定删除吗？",
					success: res => {
						if(res.confirm) {
							markArr[this.type](eve.id)
						}
					}
				})
			},
			// 获取分区店长列表
			getShopManagerList() {
				shopManagerList({
					store_id: this.storeId
				}).then(res => {
					this.list = res.data;
				});
			},
			// 获取投资人列表
			getInvestorList() {
				investorList().then(res => {
					this.list = res.data;
				});
			},
			// 获取分区财务列表 
			getFinanceList() {
				financeList().then(res => {
					this.list = res.data;
				});
			},
			goRouter(operateType, id) {
				uni.navigateTo({
					url: `/pages/admin/pages/addFinance/addFinance?type=${this.type}&id=${id}&operateType=${operateType}&storeId=${this.storeId}`
				});
				
			}
		}
	};
</script>

<style lang="scss" scoped>
	.list-box {
		padding-bottom: 100rpx;
	}

	.fot-btn {
		.btn {
			height: 80rpx;
			border-radius: 40rpx;
			color: #fff;
			background: #fe5e10;
			font-weight: 400;
			font-size: 32rpx;
		}

		position: fixed;
		bottom: 20rpx;
		width: 100%;
		left: 0;
		background-color: #fff;
	}

	.li {
		.li-info {
			.info-btn {
				.btn {
					font-weight: 400;
					color: #fe5e10;
					font-size: 26rpx;
					border-radius: 15rpx;
					padding: 6rpx 30rpx;
					border: 1px solid #fe5e10;
					text-align: center;
				}
				.edit-btn {
					color: #33a3dc;
					border: 1px solid #33a3dc;
				}
				.add-btn {
					color: #19be6b;
					border: 1px solid #19be6b;
				}
			}

			.info-l {
				.info-name {
					font-weight: 400;
					color: #202020;
					font-size: 32rpx;
				}

				font-weight: 300;
				color: rgba(0, 0, 0, 0.6);
				font-size: 24rpx;
				height: 100%;
				width: 65%;
			}

			width: 75%;
			height: 170rpx;
		}

		.li-avatar {
			width: 25%;
		}
	}
</style>
