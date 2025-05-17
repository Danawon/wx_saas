<template>
	<view>
		<head-nav
			title="灯光控制"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="page">
			<view class="flex-a ju-bt page-li   padtb20">
				<text>灯控名称：</text>
				<view class="ipt-box flex-j">
					<u--input
						placeholder="单行输入"
						border="none"
						v-model="nameVal"
					></u--input>
				</view>
			</view>
			<view class="btn flex" @click="editLampControlFun">
				保存
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import { editLampControl, getLightingDetail } from '@/api/storeApis.js';
export default {
	data() {
		return {
			nameVal: '',
			// 设备id
			deviceId: "",
		};
	},
	onLoad(e) {
		this.deviceId = e.id;
		this.getLightingDetailFun();
	},
	methods: {
		
		/* 获取灯控状态 */
		getLightingDetailFun() {
			getLightingDetail({
				id: this.deviceId
			}).then(res => {
				this.nameVal = res.data.name
			})
		},
		/* 编辑灯控 */
		editLampControlFun() {
			if(!this.nameVal) {
				uni.showToast({
					title: "请输入名称后保存！",
					icon: "none"
				})
				return
			}
			editLampControl({
				id: this.deviceId,
				name: this.nameVal
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			})
		}
	}
};
</script>

<style lang="scss">
.page {
	padding: 0 30rpx 30rpx;
	font-size: 28rpx;
	.ipt-box {
		height: 88rpx;
		width: 514rpx;
		background: #f5f5f5;
		border-radius: 24rpx;
		padding-left: 30rpx;
	}

	.btn {
		height: 82rpx;
		color: #fff;
		background: #fe5e10;
		border-radius: 54rpx;
		margin-top: 90rpx;
		font-size: 32rpx;
	}
}
</style>
