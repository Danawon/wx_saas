<template>
	<view class="wrap-min">
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="储物柜设备列表"
		></head-nav>
		<view class="page-top-btn flex" @click="goAdd">
			新增储物柜设备
		</view>
		<view class="box">
			<view
				class="list-box "
				v-for="(item, index) in list"
				:key="index"
				@click="goDetail(item.cabinetId)"
			>
				<view class="list pad20">
					<view class="name ">
						设备名称：{{ item.cabinetName }}
					</view>
					<view class="device mar-t20">
						设备id：{{ item.cabinetId }}
					</view>
					<view class="btn-box flex-row flex-a">
						<view class="del-btn btn-sty flex" @click.stop="delLockerFun(item.id)">
							删除
						</view>
						<view class="edit-btn btn-sty mar-l20 flex" @click.stop="editFun(item.id)">
							编辑
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
	</view>
</template>

<script>
import {
	lockersEquipmentLst,
	delLockerDevice
} from '@/api/admin.js';
export default {
	data() {
		return {
			list: [],
		};
	},
	onShow() {
		this.getLockersEquipmentLst();
	},
	methods: {
		/* 删除储物柜设备 */
		delLockerFun(id) {
			delLockerDevice({
				id
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					this.getLockersEquipmentLst();
				}, 1500);
			});
		},
		/* 编辑 */
		editFun(id) {
			uni.navigateTo({
				url: `/pages/admin/pages/editLocker/editLocker?id=${id}`
			});
		},
		/* 新增柜子设备 */
		goAdd() {
			uni.navigateTo({
				url: `/pages/admin/pages/addLocker/addLocker`
			});
		},
		/* 详情 */
		goDetail(cabinetId) {
			uni.navigateTo({
				url: `/pages/admin/pages/storageArk/storageArk?cabinetId=${cabinetId}`
			});
		},
		/* 获取储物柜设备列表 */
		getLockersEquipmentLst() {
			lockersEquipmentLst().then(res => {
				this.list = res.data;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.btn-box {
	justify-content: flex-end;
	.del-btn {
		background-color: #c63c26;
	}
	.edit-btn {
		background-color: #e0861a;
	}
	.btn-sty {
		color: #fff;
		font-size: 26rpx;
		width: 100rpx;
		height: 50rpx;
		border-radius: 10rpx;
	}
}
/deep/ .u-swipe-action-item {
	border-radius: 10rpx;
}
.list {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
}
.list-box {
	padding: 20rpx;
}
.page-top-btn {
	height: 80rpx;
	background: #fe5e10;
	color: #ffffff;
	font-size: 28rpx;
}
</style>
