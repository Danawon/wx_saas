<template>
	<view>
		<head-nav
			title="新增灯光"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="page">
			<view class="flex-a ju-bt page-li   padtb20">
				<text>设备名称：</text>
				<view class="ipt-box flex-j" @click="showPicker">
					<u--input
						placeholder="选择设备"
						border="none"
						v-model="deviceName"
						disabled
					></u--input>
				</view>
			</view>
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
			<view class="flex-a ju-bt page-li   padtb20">
				<text>地址：</text>
				<view class="ipt-box flex-j">
					<u-input
						placeholder="单行输入"
						border="none"
						v-model="address"
						maxlength="2"
					></u-input>
				</view>
			</view>

			<!-- 输入线路 -->
			<view class="flex-a ju-bt page-li  padtb20" >
				<text>线路：</text>
				<view class="ipt-box flex-j">
					<u-input
						placeholder="请输入"
						border="none"
						v-model="wiringTxt"
						type="number"
						maxlength="4"
					></u-input>
				</view>
			</view>
			<view class="btn flex" @click="addLightingFun">
				保存
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
		
		<u-picker
			title="设备名称"
			:show="show" 
			:columns="deviceList" 
			@confirm="selectDevice"
			@close="show = false"
			@cancel="show = false"
			keyName="name"
			:closeOnClickOverlay="true"
		></u-picker>
	</view>
</template>

<script>
import { editLampControl, getLightingDetail, lightingSwitch, addLighting, getDeviceList,equipmentList } from '@/api/storeApis.js';
export default {
	data() {
		return {
			nameVal: '',
			address: '', // 地址
			wiringTxt: '', // 训中线路
			deviceName: "", // 设备名称
			deviceId: "", // 设备id
			show: false,
			deviceList: [],
		};
	},
	onLoad(e) {

	},
	methods: {
		showPicker() {
			this.show = true;
			this.getDeviceListFun();
		},
		/* 选中设备 */
		selectDevice(e) {
			this.deviceId = e.value[0].device_id;
			this.deviceName = e.value[0].name;
			this.show = false;
		},
		/* 获取设备列表 */
		getDeviceListFun() {
			equipmentList().then(res => {
				this.deviceList = [res.data]
			})
		},
		addLightingFun() {
			if (
				!this.nameVal ||
				!this.address ||
				!this.wiringTxt ||
				!this.deviceId
			) {
				uni.showToast({
					title: '请输入完整信息后提交！',
					icon: 'none'
				});
				return;
			}
			addLighting({
				name: this.nameVal,
				address: this.address,
				line: this.wiringTxt,
				device_id: this.deviceId
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					title: '成功主题(带图标)',
					message: res.msg
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
