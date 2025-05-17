<template>
	<view class="wrap-min">
		<head-nav title="地址列表" :goBack="true"></head-nav>
		<view class="list pad20">
			<view class="li pad20 mar-b20 flex-row " v-for="(item, index) in list" :key="index" @click="selectAddress(item)">
				<view class="icon mar-t40">
					<u-icon name="map-fill" color="#f14175" size="22"></u-icon>
				</view>
				<view class="li-info mar-l20 pad-r20">
					<view class="info-name flex-row">
						<view class="name">
							{{ item.name }}
						</view>
						<view class="tel mar-l20">
							{{ item.mobile }}
						</view>
					</view>
					<view class="address  ">
						{{ item.province }}{{ item.city }}{{ item.area }}{{ item.address }}
					</view>
					<u-line margin="30rpx 0"></u-line>
					<view class="options flex-row ">
						<view class="edit" @click.stop="editFun(item)">
							<image :src="baseUrl + 'edit.png'" mode=""></image>
						</view>
						<view class="del mar-l40" @click.stop="deleteFun(item)">
							<image :src="baseUrl + 'del.png'" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="fot-btn padlr20 pad-t20 pad-b40">
			<view class="btn flex" @click="addAddress">
				新增收货地址
			</view>
		</view>
		
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { baseUrl } from '@/utils/baseUrl.js';
	import { addressList, deleteAddress } from "@/api/mall.js"
	export default {
		data() {
			return {
				baseUrl: baseUrl,
				list: [], // 地址列表
			};
		},
		onShow() {
			this.getAddressList();
		},
		methods: {
			// 选中地址
			selectAddress(e) {
				uni.$emit("selectAddress", e)
				uni.navigateBack()
			},
			// 新增地址
			addAddress() {
				uni.navigateTo({
					url: "/pages/shop/pages/addressManage/addressManage"
				})
			},
			// 删除
			deleteFun(e) {
				deleteAddress({
					id: e.id
				}).then(res => {
					this.$refs.uToast.show({
						type: 'success',
						title: '成功主题(带图标)',
						message: res.msg
					});
					setTimeout(() => {
						this.getAddressList();
					},1500)
				})
			},
			// 编辑
			editFun(e) {
				uni.navigateTo({
					url: `/pages/shop/pages/addressManage/addressManage?id=${e.id}`
				})
			},
			// 获取
			getAddressList() {
				addressList().then(res => {
					this.list = res.data;
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.list {
		padding-bottom: 130rpx;
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
		bottom: 0rpx;
		width: 100%;
		left: 0;
		background-color: #fff;
	}
	.name {
		font-weight: 500;
		color: #333333;
		font-size: 30rpx;
	}
	.tel {
		font-weight: 400;
		color: #333333;
		font-size: 26rpx;
	}
	.address {
		line-height: 45rpx;
		font-weight: 400;
		color: #333333;
		font-size: 26rpx;
		margin-top: 10rpx;
	}
	.options {
		.edit,
		.del {
			width: 45rpx;
			height: 45rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		justify-content: flex-end;
	}
.li {
	background-color: #fff;
	border-radius: 20rpx;
	.li-info {
		width: 90%;
	}
	
}
</style>
