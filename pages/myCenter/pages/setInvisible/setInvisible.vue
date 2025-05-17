<template>
	<view class="wrap-min">
		<head-nav
			title="设置不可见人员"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<u-sticky bgColor="#fff">
			<view class="pad20">
				<u-search
					placeholder="搜索"
					:showAction="false"
					height="70rpx"
					shape="square"
					v-model="searchVal"
					@search="searchFun"
					@clickIcon="searchFun"
				></u-search>
			</view>
		</u-sticky>
		<view class="content pad20">
			<view class="speedy-box flex-row ju-bt">
				<view
					class="btn btn1 flex"
					@click="toggleAuth(true)"
				>
					一键授权
				</view>

				<view
					class="btn btn2 flex"
					@click="toggleAuth(false)"
				>
					一键取消授权
				</view>
			</view>
			<view
				class="li-box mar-t20 pad-t20 pad-b40 padlr20 "
			>
				<view
					class="filter-box padlr20 martb20 flex-row flex-a ju-bt"
				>
					<view class="filter-state flex-row flex-a">
						<view
							@click="changeState(1)"
							class="state1 mar-r40 state"
							:class="{
								selectState: stateVal == 1
							}"
						>
							已授权
						</view>
						<view
							@click="changeState(0)"
							class="state1 state "
							:class="{
								selectState: stateVal == 0
							}"
						>
							未授权
						</view>
					</view>
					<view
						class="fil-r flex-row flex-a ju-bt"
						@click="storeShow = true"
					>
						<view class="tit mar-r20">
							{{
								storeList[0][selectStoreIndex]
									.name
							}}
						</view>
						<u-icon
							name="arrow-down"
							top="4rpx"
							color="#999999"
							size="28rpx"
							:bold="true"
						></u-icon>
					</view>
				</view>
				<view
					class="li martb40 flex-row flex-a ju-bt"
					v-for="(item, index) in list"
					:key="index"
				>
					<view class="img-box flex-row flex-a ju-bt">
						<view class="img">
							<u-avatar
								:src="item.avatar"
								size="100%"
							></u-avatar>
						</view>
						<view
							class="name-info flex-col ju-bt padtb20 "
						>
							<view class="name text-elpis">
								{{ item.name }}
							</view>
							<view class="identity">
								{{ item.position }}
							</view>
						</view>
					</view>
					<view class="btn-box flex">
						<view
							class="btn "
							v-if="stateVal == 1"
							@click="cancelPrivacyAuthFun(item)"
						>
							取消授权
						</view>
						<view
							class="btn btn-2 "
							v-else
							@click="setPrivacyAuthFun(item)"
						>
							设置授权
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
		<!-- 选择门店 -->
		<u-picker
			:show="storeShow"
			:columns="storeList"
			keyName="name"
			@confirm="selectStoreFun"
			@cancel="storeShow = false"
		></u-picker>

		<!-- 选择角色 -->
		<u-picker
			:show="roleShow"
			:columns="roleList"
			keyName="name"
			@confirm="selectRoleFun"
			@cancel="roleShow = false"
		></u-picker>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import {
	shopList,
	getPrivacyAuthList,
	getAdminList,
	cancelPrivacyAuth,
	setPrivacyAuth
} from '@/api/admin.js';
import { onekeyPrivacyAuth } from "@/api/myCenter.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			searchVal: '', // 搜索
			stateVal: 1, // 是否授权
			// 门店列表
			storeList: [],
			// 门店选择show
			storeShow: false,
			// 选中门店下标、
			selectStoreIndex: 0,
			// 角色选择show
			roleShow: false,
			// 角色列表
			roleList: [],
			// 选中的角色下标
			selectRoleIndex: 0,
			// 当前页
			current: 1,
			list: []
		};
	},
	async onLoad() {
		await this.getShopList();
		await this.getAdminListFun();
		await this.getPrivacyAuthListFun();
	},
	onReachBottom() {
		this.current++;
		this.getPrivacyAuthListFun();
	},
	methods: {
		/* 快捷键操作 */
		toggleAuth(e) {
			onekeyPrivacyAuth({
				store_id: this.storeList[0][
					this.selectStoreIndex
				].id,
				keyword: this.searchVal,
				type: e ? 'set' : 'cancel'
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				this.delayRequest();
			})
		},
		/* 取消权限 */
		cancelPrivacyAuthFun(e) {
			cancelPrivacyAuth({
				position_id: e.id
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					message: res.msg
				});
				this.delayRequest();
			});
		},
		/* 设置权限 */
		setPrivacyAuthFun(e) {
			setPrivacyAuth({
				position_id: e.id
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					message: res.msg
				});
				this.delayRequest();
			});
		},
		delayRequest() {
			setTimeout(() => {
				this.resetFun();
			}, 1500);
		},
		/* 获取身份角色列表 */
		getAdminListFun() {
			return	getAdminList().then(res => {
					this.roleList = [
						[
							{
								name: '全部',
								field: ''
							},
							...res.data
						]
					];
				});
		},
		/* 重置搜索 */
		resetFun() {
			this.current = 1;
			this.list = [];
			this.getPrivacyAuthListFun();
		},
		/* 搜索框搜索 */
		searchFun() {
			this.resetFun();
		},
		/* 获取不可见人员列表 */
		getPrivacyAuthListFun() {
			return	getPrivacyAuthList({
					auth: this.stateVal,
					store_id: this.storeList[0][
						this.selectStoreIndex
					].id,
					list_rows: 20,
					page: this.current,
					position_type: this.roleList[0][
						this.selectRoleIndex
					].field,
					keyword: this.searchVal
				}).then(res => {
					this.list = [...this.list, ...res.data.data];
				});
		},
		/* 选中角色 */
		selectRoleFun(e) {
			/* 选中的角色下标 */
			this.selectRoleIndex = e.indexs[0];
			this.roleShow = false;
			this.resetFun();
		},
		/* 更改授权状态 */
		changeState(e) {
			this.stateVal = e;
			this.resetFun();
		},
		/* 选中门店 */
		selectStoreFun(e) {
			/* 选中门店下标的 */
			this.selectStoreIndex = e.indexs[0];
			this.storeShow = false;
			this.resetFun();
		},
		/* 获取门店列表 */
		getShopList() {
			return	shopList().then(res => {
					this.storeList = [
						[
							{
								name: '全部',
								id: ''
							},
							...res.data
						]
					];
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.speedy-box {
	.btn {
		width: 48%;
		height: 60rpx;
		border-radius: 10rpx;
		color: #fff;
		font-size: 24rpx;
	}
	.btn1 {
		background-color: #fe5e10;
	}
	.btn2 {
		background-color: #999999;
	}
}
.btn-2 {
	background-color: rgba(90, 199, 37, 0.8) !important;
	color: #fff !important;
	border: none !important;
}
.li {
	.btn-box {
		width: 26%;
		.btn {
			padding: 8rpx 15rpx;
			border: 1px solid #999999;
			border-radius: 8rpx;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.4);
			font-size: 24rpx;
			display: inline-block;
		}
	}
	.img-box {
		.name-info {
			.identity {
				font-weight: 400;
				color: #fe5e10;
				font-size: 26rpx;
			}
			.name {
				font-weight: 550;
				color: #202020;
				font-size: 33rpx;
			}
			height: 160rpx;
			width: 64%;
		}
		.img {
			width: 33%;
			height: 160rpx;
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		width: 74%;
	}
}
.filter-state {
	.selectState {
		background-color: #ffa376 !important;
		color: #fff !important;
	}
	.state {
		display: inline-block;
		padding: 7rpx 20rpx;
		font-size: 26rpx;
		color: #202020;
		background-color: #dadada;
		border-radius: 15rpx;
	}
}
.li-box {
	.tit {
		color: #999999;
	}
	background-color: #fff;
	border-radius: 20rpx;
	// height: 100rpx;
}
</style>
