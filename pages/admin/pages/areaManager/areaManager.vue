<template>
	<view>
		<head-nav
			title="分区经理管理"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="list-box padlr20 pad-t20">
			<view
				class="li "
				v-for="(item, index) in list"
				:key="index"
			>
				<view class="flex-row flex-a">
					<view class="li-avatar">
						<u-avatar
							:src="item.avatar"
							size="150rpx"
						></u-avatar>
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
							<view
								class="btn"
								@click="deleteFun(item)"
							>
								删除
							</view>
							<view
								class="btn edit-btn mar-t20"
								@click="editFun(item)"
							>
								编辑
							</view>
						</view>
					</view>
				</view>
				<u-line margin="40rpx 0"></u-line>
			</view>
			<u-empty
				v-if="!list.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>
		<view class="fot-btn pad20">
			<view class="btn flex" @click="goRouter('add')">
				新增人员
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { managerList, delManager } from '@/api/admin.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			list: []
		};
	},
	onLoad() {
		// this.getManagerList();
	},
	onShow() {
		this.getManagerList();
	},
	methods: {
		/* 点击编辑 */
		editFun(e) {
			this.goRouter('edit', e.id)
		},
		// 删除分区经理
		deleteFun(eve) {
			delManager({
				id: eve.id
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					this.getManagerList();
				}, 500);
			});
		},
		// 获取分区经理列表
		getManagerList() {
			managerList().then(res => {
				this.list = res.data;
			});
		},
		goRouter(type, id) {
			uni.navigateTo({
				url: `/pages/admin/pages/addAreaManager/addAreaManager?type=${type}&id=${id}`
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
			}
			.edit-btn {
				color: #33a3dc;
				border: 1px solid #33a3dc;
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
			width: 75%;
		}
		width: 75%;
		height: 170rpx;
	}
	.li-avatar {
		width: 25%;
	}
}
</style>
