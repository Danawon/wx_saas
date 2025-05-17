<template>
	<view>
		<head-nav
			title="编辑储物柜设备"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="page">
			<view class="flex-a ju-bt page-li  padtb20">
				<text>设备名称：</text>
				<view class="ipt-box flex-j">
					<u-input
						placeholder="单行输入"
						v-model="deviceName"
						border="none"
					></u-input>
				</view>
			</view>
			<view class="flex-a ju-bt page-li  padtb20">
				<text>文案1：</text>
				<view class="ipt-box flex-j">
					<u-input
						placeholder="单行输入"
						v-model="text1"
						border="none"
					></u-input>
				</view>
			</view>
			<view class="flex-a ju-bt page-li  padtb20">
				<text>文案2：</text>
				<view class="ipt-box flex-j">
					<u-input
						placeholder="单行输入"
						v-model="text2"
						border="none"
					></u-input>
				</view>
			</view>

			<view class="flex-a ju-bt page-li  padtb20">
				<text>文案3：</text>
				<view class="ipt-box flex-j">
					<u-input
						placeholder="单行输入"
						v-model="text3"
						border="none"
					></u-input>
				</view>
			</view>

			
			<view class="flex-a ju-bt page-li  padtb20">
				<text>设备状态：</text>
				<view class="ipt-boxx flex-a">
					<u-switch v-model="switchState" ></u-switch>
				</view>
			</view>
			<view class="flex-a ju-bt page-li  padtb20">
				<text>二维码跳转路径：</text>
				<view class="textarea-box ">
					<u--textarea v-model="qrCode" height="100" placeholder="请输入内容" ></u--textarea>
				</view>
			</view>

			<view class="btn flex" @click="confirm">保存</view>
		</view>
	</view>
</template>

<script>
import { getEditLockerInfo , editLockerDevice } from '@/api/admin.js';
export default {
	data() {
		return {
			deviceId: '', // 设备id
			qrCode: "", // 二维码路径
			deviceName: "", // 设备名称
			text1: "", // 文案1
			text2: "", // 文案1
			text3: "", // 文案1
			switchState: false, // 设备状态
		};
	},
	onLoad(e) {
		this.deviceId = e.id;
		this.getEditLockerInfoFun();
	},
	methods: {
		/* 获取储物柜设备信息 */
		getEditLockerInfoFun() {
			
			getEditLockerInfo({
				id: this.deviceId
			}).then(res => {
				this.text1 = res.data.text1;
				this.text2 = res.data.text2;
				this.text3 = res.data.text3;
				this.qrCode = res.data.qrCode;
				this.deviceName = res.data.cabinetName;
				this.switchState = Boolean(Number(res.data.status))
			});
		},
		/* 确定 */
		confirm() {
			if (!this.deviceId) {
				uni.showToast({
					title: '请输入设备id',
					icon: 'none'
				});
				return;
			}
			this.editLockerDeviceFun();
		},
		// 新增储物柜设备
		editLockerDeviceFun() {
			editLockerDevice({
				id: this.deviceId,
				cabinetName: this.deviceName,
				text1: this.text1,
				text2: this.text2,
				text3: this.text3,
				qrCode: this.qrCode,
				status: Number(this.switchState)
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			});
		}
	}
};
</script>

<style lang="scss">
.page {
	padding: 0 30rpx 30rpx;
	font-size: 28rpx;
	.textarea-box{
		width: 65%;
		background: #f5f5f5;
		border-radius: 24rpx;
	}
	.ipt-boxx {
		height: 88rpx;
		width: 65%;
	}
	.ipt-box {
		height: 88rpx;
		background: #f5f5f5;
		border-radius: 24rpx;
		padding-left: 30rpx;
		width: 65%;
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
