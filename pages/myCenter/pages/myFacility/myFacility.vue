<template>
	<view class="">
		<head-nav
			title="我的设备"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		 <u-tabs 
			:list="tabList" 
			@click="clicktabs"
			:current="tabsCurrent"
			:scrollable="false"
		></u-tabs>
		<view class="" v-if="!tabsCurrent">
			<view class="scanDevice-box pad20 flex-row flex-a">
				<view class="scan-lable">绑定设备:</view>
				<u-radio-group
					v-model="selectedScanDevice"
					placement="row"
				>
					<u-radio
						v-for="(item, index) in deviceType"
						:key="index"
						:customStyle="{ marginRight: '20rpx' }"
						:label="item.id"
						:name="item.id"
					></u-radio>
				</u-radio-group>
			</view>
			<view class="fot-btn ">
				<view class="btn flex flex-a" @click="scanDevice">
					<u-icon
						:name="baseUrl + 'bluetoothIcon.png'"
						color="#FE5E10"
						size="35rpx"
					></u-icon>
					<view class="btn-txt mar-l20">心率带蓝牙绑定</view>
				</view>
			</view>
			<view class="list-box">
				<u-swipe-action>
					<u-swipe-action-item
						:options="options2"
						v-for="(item, index) in list"
						:index="index"
						:key="index"
						@click="onActionItem"
						:name="item.sign"
					>
						<view
							class="li martb20 flex-row flex-a ju-bt "
						>
							<view class="li-l flex-row flex-a">
								<view class="lable">设备名称：</view>
								<view class="lable-val">
									{{ item.name || item.deviceId }}
									<text class="tips">
										（向左滑动编辑）
									</text>
								</view>
							</view>
							<view 
								class="li-set" 
								v-if="item.is_connect"
								@click="setAlarmMax"
							>
								<u--image 
									:showLoading="true" 
									:src="baseUrl + 'set-icon.png'" 
									width="35rpx" 
									height="35rpx" 
								></u--image>
							</view>
							<u-icon
								name="arrow-right"
								color="#999999"
								:bold="true"
								size="28rpx"
							></u-icon>
						</view>
						<u-line></u-line>
					</u-swipe-action-item>
				</u-swipe-action>
			</view>
			
			<u-empty
				v-if="!list.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>
		
		<!-- 功率车组件 -->
		<electric-quantity 
			v-show="tabsCurrent" 
			ref="electricQuantityRef"
		></electric-quantity>
		
		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			title="修改信息"
			confirmText="确定"
			cancelText="取消"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentConfirm="modalConfirm"
			@parentCancel="modalCancel"
		>
			<view class="modalTxt pad-b40 flex">
				<u-input
					placeholder="请输入昵称"
					border="surround"
					v-model="nickname"
				></u-input>
			</view>
		</modal-tips>
		<!-- 心率设备列表 -->
		<modal-tips
			:modalShow="equipmentObj.modalShow"
			title="设备列表"
			:showConfirmButton="true"
			:showCancelButton="false"
			confirmText="关闭"
			@parentConfirm="devicemodalConfirm"
		>
			<view class="li-box pad20">
				<view
					class="li "
					v-for="(item, index) in deviceList"
					:key="index"
				>
					<view class="flex-row ju-bt modal-box">
						<view class="name">
							{{ item.deviceName || item.name }}
							<!-- {{ item.deviceName }} -->
						</view>
						<view
							class="btn"
							@click="_connect(item)"
						>
							链接
						</view>
					</view>
					<u-line margin="20rpx 0 40rpx"></u-line>
				</view>
			</view>
		</modal-tips>
		
		<modal-tips
			:modalShow="maxShow"
			title="设置报警最大心率"
			:showConfirmButton="true"
			:showCancelButton="true"
			confirmText="确定"
			@parentConfirm="confirmSetMax"
			@parentCancel="() => maxShow = false"
		>
			<view class="li-box pad20">
				 <u--input
				    placeholder="请输入最大心率"
				    border="surround"
				    v-model="maxVal"
					type="number"
				  ></u--input>
				  <view class="mar-t20"></view>
			</view>
		</modal-tips>
	</view>
</template>

<script>
import {
	getDeviceRecord,
	editDeviceName,
	delDevice,
	addDeviceRecord
} from '@/api/myCenter.js';
import modalTips from '@/components/modalTips/modalTips.vue';
// 心率带设备1 js文件
import heartRateBelt from '@/common/heartRateBelt.js';
// 心率带设备2 js文件
import heartRateBelt2 from '@/common/heartRateBelt2.js';
import { authorizationBluetoothStatus } from '@/common/common.js';
import { baseUrl } from '@/utils/baseUrl.js';
/* 功率车校验 组件 */
import  electricQuantity  from "../components/electricQuantity/electricQuantity.vue"
export default {
	components: {
		modalTips,
		electricQuantity
	},
	data() {
		return {
			baseUrl: baseUrl,
			options2: [
				{
					text: '编辑',
					style: {
						backgroundColor: '#3c9cff'
					}
				},
				{
					text: '删除',
					style: {
						backgroundColor: '#f56c6c'
					}
				}
			],
			list: [],
			modalShow: false,
			selectDeviceId: '', // 选中的设备id
			nickname: '',
			deviceType: [{ id: 'CL' }, { id: 'HW' }],
			selectedScanDevice: '', // 默认扫描 设备val
			deviceList: [], // 扫描到的设备列表
			equipmentObj: {}, // 设备信息
			devicesLength: 0 ,// 扫描到的设备长度
			tabList: [
				{
					name: '心率带',
				}, 
				{
					name: '功率车',
				}, 
			],
			tabsCurrent: 0,
			connectName: "", // 当前连接的设备名称
			maxShow: false,
			maxVal: "", // 最大心率
		};
	},
	onLoad() {
		/* 初始化蓝牙 */
		heartRateBelt.init_fmanager();
		if (uni.getStorageSync('selectedScanDevice')) {
			this.selectedScanDevice = uni.getStorageSync(
				'selectedScanDevice'
			);
		}
		this.getDeviceRecordFun();
	},
	onUnload() {
		this.devicemodalConfirm()
		if (this.tabsCurrent){
			this.$refs.electricQuantityRef.clostSocket();
		}
	},
	methods: {
		confirmSetMax() {
			if(!this.maxVal) {
				uni.showToast({
					title: "请输入正确的数值！",
					icon: "none"
				})
				return
			}
			if (this.selectedScanDevice === 'HW') {
				heartRateBelt2.sendsetShockFun(this.maxVal);
			} else if (this.selectedScanDevice === 'CL') {
				heartRateBelt.setHeartRateSetting(this.maxVal);
			}
			this.maxShow = false;
		},
		/* 设置报警心率 */
		setAlarmMax() {
			this.maxShow = true;
		},
		/* 选中tabs*/
		clicktabs(eve) {
			this.current = eve;
			this.tabsCurrent = eve.index;
		},
		// 关闭modal
		devicemodalConfirm() {
			if (this.selectedScanDevice === 'HW') {
				heartRateBelt2.closeBluetoothAdapter();
			} else if (this.selectedScanDevice === 'CL') {
				wx.closeBluetoothAdapter();
				heartRateBelt._disconnect();
			}
		},
		/* 扫描设备 */
		scanDevice() {
			if (!this.selectedScanDevice) {
				uni.showToast({
					title: '请选择要绑定的设备后再扫描！',
					icon: 'none'
				});
				return;
			}
			this.devicesLength = 0;
			this.scanningLinks();
		},
		/* 扫描附近心率带 */
		scanningLinks() {
			/* 判断是否授权使用蓝牙 */
			authorizationBluetoothStatus();
			if (this.selectedScanDevice === 'HW') {
				/* 连接新设备 心率带2 */
				heartRateBelt2.openBluetoothAdapter(
					this.heartRateEquipmentInfo,
					this.heartChange
				);
			} else if (this.selectedScanDevice === 'CL') {
				wx.openBluetoothAdapter({
					success: res => {
						/* 心率带设备1链接 */
						heartRateBelt._scan(
							this
								.heartRateEquipmentInfo,
							this.heartChange
						);
					},
					fail: err => {
						if(err.errCode === 10001) {
							uni.showModal({
								title: "蓝牙异常提示",
								content: JSON.stringify(err)
							})
							// wx.showToast({
							// 	title: "蓝牙未打开",
							// 	icon: "error"
							// })
						}
						//调用失败直接提示信息
					}
				});
			}
		},
		heartChange() {},
		/* 心率带设备推送信息 */
		heartRateEquipmentInfo(e, txt, type) {
			if (this.selectedScanDevice === 'HW') {
				this.equipmentObj = { ...e };
			} else if (this.selectedScanDevice === 'CL') {
				let {
					step, // 步数
					distance, // 步行距离
					calorie, // 卡路里
					heartrate, // 心率数据
					devices, // 扫描到的设备
					connected, // 蓝牙是否连接
					modalShow, // 显示设备列表modal
					intervals, // 间隔
					battery, // 电量
					hrList, // 日期历史列表
					hrData // 指定日期下的心率列表
				} = e;
				this.equipmentObj = {
					step, // 步数
					distance, // 步行距离
					calorie, // 卡路里
					heartrate, // 心率数据
					devices, // 扫描到的设备
					connected, // 蓝牙是否连接
					modalShow, // 显示设备列表modal
					intervals, // 间隔
					battery, // 电量
					hrList, // 心率日期历史列表
					hrData // 指定日期下的心率列表
				};
			}
			if (type == 'discover') {
				if (
					this.equipmentObj.devices.length &&
					this.devicesLength != e.devices.length
				) {
					this.devicesLength = e.devices.length;
					getDeviceRecord().then(res => {
						this.equipmentObj.devices.map(
							(deItem, deIndex) => {
								res.data.map(
									(resItem, resIndex) => {
										if (
											deItem.name ==
											resItem.deviceId
										) {
											deItem.deviceName =
												resItem.name;
										}
									}
								);
							}
						);
						this.deviceList = JSON.parse(
							JSON.stringify(
								this.equipmentObj.devices
							)
						);
					});
				}
			}
			/* 心率带连接成功 */
			if (type == 'success') {
				/* 添加设备链接记录 */
				addDeviceRecord({
					deviceId: e.device ? e.device.name : e.name
				}).then(res => {
					uni.setStorageSync(
						'selectedScanDevice',
						res.data.deviceType
					);
					uni.setStorageSync("armletInfo", JSON.stringify(e.device ? e.device : e))
					this.connectName = e.device ? e.device.name : e.name;
					wx.showToast({
						title: '连接成功'
					});
					// setTimeout(() => {
					// 	this.devicemodalConfirm();
					// }, 500);
					setTimeout(() => {
						this.getDeviceRecordFun();
					}, 1000);
				});
			}
		},
		// 链接设备
		_connect(item) {
			if (this.selectedScanDevice === 'HW') {
				heartRateBelt2.createBLEConnectionFun(item);
			} else {
				heartRateBelt._connect(item);
			}
		},
		/* 选中操作 */
		onActionItem(e) {
			if (e.index) {
				delDevice(e.name).then(res => {
					uni.showToast({
						title: res.msg
					});
					setTimeout(() => {
						this.getDeviceRecordFun();
					}, 1500);
				});
			} else {
				this.selectDeviceId = e.name;
				this.modalShow = true;
			}
		},
		// modal 确定
		modalConfirm() {
			if (!this.nickname) {
				uni.showToast({
					title: '请输入后提交',
					icon: 'error'
				});
				return;
			}
			editDeviceName({
				sign: this.selectDeviceId,
				name: this.nickname
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					this.getDeviceRecordFun();
				}, 1500);
				this.modalCancel();
			});
		},
		modalCancel() {
			this.modalShow = false;
		},
		/* 获取我的设备列表 */
		getDeviceRecordFun() {
			getDeviceRecord().then(res => {
				this.list = res.data;
				this.list.forEach(item => {
					if(item.deviceId == this.connectName) {
						item.is_connect = true
					}
				})
				// this.list[1].is_connect = true;
			});
		},
		goRoute(eve) {
			this.selectDevice = eve;
			this.modalShow = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.modal-box {
	.btn {
		border-radius: 20rpx;
		color: #fff;
		padding: 7rpx 25rpx;
		background-color: #3c9cff;
		font-size: 26rpx;
	}
}
.scan-lable {
	width: 180rpx;
}
.tips {
	font-size: 20rpx;
	color: #ccc;
}

.fot-btn {
	.btn {
		width: 100%;
		height: 80rpx;
		border-radius: 8rpx;
		opacity: 1;
		border: 1px solid #fe5e10;
		color: #fe5e10;
		font-size: 24rpx;
	}
	width: 100%;
	padding: 20rpx 20rpx 40rpx;
	background-color: #fff;
}
.list-box {
	.li {
		position: relative;
		.li-l {
			.lable-val {
				color: #202020;
			}
			.lable {
				font-weight: 400;
				color: #999999;
			}
			font-size: 32rpx;
		}
		padding: 30rpx;
		background-color: #fff;
		.li-set {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 65rpx;
		}
	}
}
</style>
