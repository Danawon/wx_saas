<template>
	<view class=" pad20">
		<view class="title">功率车初始值校准:</view>
		<view
			class="block-item mar-t20 flex mar-t20 pad-l40"
			v-for="(item, index) in list"
			:key="item.id"
		>
			<view class="block-l">{{ item.tit }}:</view>
			<view class="block-r pad-l20">
				<u-parse :content="item.content"></u-parse>
			</view>
		</view>

		<view class="btn-box mar-t110 flex ">
			<view
				class="scan deviceSty flex"
				:class="{ selectDeviceSty: deviceState }"
				@click="scanQR"
			>
				<image
					v-if="deviceState"
					class="icon-state"
					:src="baseUrl + 'scan-1.png'"
					mode=""
				></image>
				<image
					v-else
					class="icon-state"
					:src="baseUrl + 'scan-2.png'"
					mode=""
				></image>
				<image
					v-if="deviceState"
					class="icon-success"
					:src="baseUrl + 'testSelecrt.png'"
					mode=""
				></image>
				<!-- 左侧设备电量 -->
				<view
					class="electric-quantity left-Kwh flex-row flex-a"
					v-if="deviceState"
				>
					<u--image
						v-if="leftKwh >= 50"
						:showLoading="true"
						:src="baseUrl + 'kwh.png'"
						width="85rpx"
						height="35rpx"
					></u--image>
					<u--image
						v-if="leftKwh < 50 && leftKwh > 10"
						:showLoading="true"
						:src="baseUrl + 'kwh50.png'"
						width="85rpx"
						height="35rpx"
					></u--image>
					<u--image
						v-if="leftKwh <= 10"
						:showLoading="true"
						:src="baseUrl + 'kwh10.png'"
						width="85rpx"
						height="35rpx"
					></u--image>
					<view
						class="electric-num"
						:class="{ kwhCor: leftKwh <= 10 }"
					>
						{{ leftKwh }}
					</view>
				</view>
				<!-- 右侧设备电量 -->
				<view
					class="electric-quantity right-Kwh flex-row flex-a"
					v-if="deviceState"
				>
					<u--image
						v-if="rightKwh >= 50"
						:showLoading="true"
						:src="baseUrl + 'kwh.png'"
						width="85rpx"
						height="35rpx"
					></u--image>
					<u--image
						v-if="rightKwh < 50 && rightKwh > 10"
						:showLoading="true"
						:src="baseUrl + 'kwh50.png'"
						width="85rpx"
						height="35rpx"
					></u--image>
					<u--image
						v-if="rightKwh <= 10"
						:showLoading="true"
						:src="baseUrl + 'kwh10.png'"
						width="85rpx"
						height="35rpx"
					></u--image>
					<view
						class="electric-num"
						:class="{ kwhCor: rightKwh <= 10 }"
					>
						{{ rightKwh }}
					</view>
				</view>
				<text>连接功率车</text>
			</view>
		</view>
		<view class="pad20 mar-t40" v-if="percentage && percentage <= 100" >
			<u-line-progress :percentage="percentage" ></u-line-progress>
		</view>

		<view class="val-box martb60 flex">
			<view 
				class="val-num flex"
				:class="{'connectSty': connect_status}"
			>
				<text class="num-tips tit-txt">左轴</text>
				<text class="num-val">{{ reviseValLeft }}</text>
				<text class="num-tips">校准值</text>
			</view>

			<view 
				class="val-num flex mar-l20"
				:class="{'connectSty': connect_status}"
			>
				<text class="num-tips tit-txt">右轴</text>
				<text class="num-val">{{ reviseValRight }}</text>
				<text class="num-tips">校准值</text>
			</view>
		</view>
		<view class="loading-sty" v-if="is_reset == 2">
			<u-loading-page
				loadingText="校准中..."
				bg-color="rgba(0,0,0,.5)"
				:loading="true"
				loadingColor="#333"
				fontSize="24"
				color="#999"
				
			></u-loading-page>
		</view>
		
		<view class="btn-box flex mar-t40">
			<view class="btn-item">
							<!-- !deviceState || !connect_status || is_reset == 2 -->
				<u-button
					type="success"
					:text="txtArr[is_reset]"
					throttleTime="1500"
					:disabled="percentage <= 100
					"
					:color="percentage <= 100 ? '#C9CACC' : '#6ac2f1'"
					@click="verifyFun"
				></u-button>
			</view>
		</view>
	</view>
</template>
<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { ws } from '@/common/ws.js';
import {
	calibration, // 蓝牙矫正
	ellipticalsIndex // 加入分组
} from '@/api/myCenter.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			list: [
				{
					tit: '第一步',
					content: `匀速踩动功率车，待功率车启动上电后，持续踩动功率车，再点击扫码连接功率车，等待功率车连接成功。`,
					id: 1
				},
				{
					tit: '第二步',
					content:'功率车连接成功后，校准按钮生效。停止踩功率车，并调整脚踏曲柄轴，使其垂直于地面。然后双脚离开踏板，保持脚踏曲柄处于静止状态。再点击校准按钮。',
					id: 2
				}
			],
			leftKwh: 100, // 左侧电量
			rightKwh: 100, // 右

			/* 避免重复链接 */
			linkNums: 0,
			// socket 是否链接
			wsConnectState: false,
			socketData: {}, // socket 数据
			device_id: '', // 设备id
			deviceState: false, // 是否接入分组成功 || 蓝牙设备是否连接成功
			groupId: '', // 加入分组返回的id  用户矫正
			// 定时器容器
			timer: '',
			reviseValLeft: '--', // 校正数值 left
			reviseValRight: '--', // right
			is_reset: 0, // 是否重新校准
			txtArr: ['校准', '重新校准', '校准中'],
			connect_status: 0 ,// 是否两个脚踏板蓝牙都连接正常
			percentage: 0, // 连接进度条
		};
	},
	options: {
		styleIsolation: 'shared' // 解除样式隔离
	},
	onLoad() {},
	methods: {
		clostSocket() {
			this.percentage = 0;
			if (this.wsConnectState || this.deviceState) {
				ws.stop(() => {
					this.deviceState = false;
					this.wsConnectState = false;
					this.linkNums = 0;
				});
			}
		},
		/*  扫码链接数据 */
		scanQR() {
			/* 设备链接成功避免重复链接 */
			if (this.wsConnectState) {
				return;
			}
			/* 扫码 */
			uni.scanCode({
				success: res => {
					let resultType = res.result
						.split('#')[0]
						.split('=')[1];
					if (
						resultType != 'ellipticals' &&
						resultType != 'bt_ellipticals'
					) {
						uni.showModal({
							title: '请扫描功率车设备二维码哦~',
							showCancel: false
						});
						return;
					}

					uni.showLoading({
						title: '链接设备中,请稍等...'
					});
					// 设备id
					this.device_id = res.result.split('=')[1];
					this.connectRequest();
				},
				fail: err => {}
			});
		},
		/* socket连接请求 */
		connectRequest() {
			// 链接socket
			ws.socket(
				eve => {
					this.deviceState = false;
					this.linkNums = 0;
					uni.showLoading({
						title: '链接设备中...'
					});
				},
				() => {
					uni.hideLoading();
				},
				this.wsMessageFun
			);
		},
		// 接收socket数据
		wsMessageFun(eve) {
			uni.hideLoading();
			/* socket更改状态 */
			this.wsConnectState = true;
			/* socket解析数据 */
			this.socketData = JSON.parse(eve);
			// 功率车电量
			if (
				this.socketData.status &&
				this.socketData.status == 1
			) {
				this.leftKwh = Number(
					this.socketData.deputy_electric_quantity
				);
				this.rightKwh = Number(
					this.socketData.main_electric_quantity
				);
				
			}
			if(this.socketData.connect_status && !this.connect_status) {
				/* 是否两个脚踏板都连接正常 */
				this.connect_status = this.socketData.connect_status;
				this.timerFun();
				// this.percentage = 100;
			}
			/* 客户端id */
			this.client_id = this.socketData.client_id ?? '';
			if (this.client_id && !this.linkNums) {
				this.linkNums = 1;
				this.ellipticalsIndexFun();
			}
		},
		// 椭圆机加入分组 跑步机
		ellipticalsIndexFun() {
			this.percentage = 10;
			ellipticalsIndex({
				device_id: this.device_id,
				client_id: this.client_id
			}).then(res => {
				this.timerFun();
				this.deviceState = true; // 加入分组代表链接设备成功
				this.groupId = res.data.id;
			})
			.catch(err => {
				if (err.code == 400) {
					uni.showToast({
						title: "扫描超时",
						icon: "error"
					})
					this.clostSocket();
				}
			});
		},
		timerFun() {
			let timer = null;
			let timerNum = 1;
			timer = setInterval(() => {
				this.percentage += 10
				if(this.percentage >= 100) {
					setTimeout(() => {
						this.percentage = 110
					},1000)
				}
				if(timerNum >= 5) {
					clearInterval(timer)
				}
				timerNum ++
			},1000)
		},
		/* 点击矫正 */
		verifyFun() {
			this.is_reset = 2;
			calibration({
				id: this.groupId
			})
				.then(res => {
					this.reviseValLeft = res.data.left;
					this.reviseValRight = res.data.right;
					this.is_reset = 1;
				})
				.catch(err => {
					this.is_reset = 1;
				});
		}
	}
};
</script>
<style lang="scss" scoped>
.loading-sty {
	width: 100vw;
	height: 100vh;
	z-index: 99;
	position: absolute;
	top: 0;
}
.martb60 {
	margin: 60rpx 0;
}
.bold-txt {
	font-weight: bold;
}
.kwhCor {
	color: #f00 !important;
}
.electric-quantity {
	.electric-num {
		font-weight: 400;
		color: #fff;
		// color: #f99;
		font-size: 19rpx;
		// margin-left: 10rpx;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	position: absolute;
	// right: 15rpx;
	// top: -19rpx;
}
.right-Kwh {
	right: -25rpx;
	top: -15rpx;
}
.left-Kwh {
	top: -15rpx;
	left: -25rpx;
}
.selectDeviceSty {
	border: 1px solid #6ac2f1;
	color: #6ac2f1 !important;
	background: #f2fbff !important;
}
.deviceSty {
	.icon-success {
		width: 35rpx;
		height: 35rpx;
		position: absolute;
		right: -1px;
		bottom: -1px;
		z-index: 99;
	}
	.icon-state {
		width: 55rpx;
		height: 55rpx;
		position: absolute;
		top: -25rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 99;
	}
	width: 35%;
	height: 90rpx;
	border-radius: 15rpx;
	background-color: #f8f8f8;
	color: #999999;
	font-size: 26rpx;
	position: relative;
	text {
		margin-top: 10rpx;
	}
}
.val-box {
	.val-num {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		border: 2px solid #C9CACC;
		flex-direction: column;
		position: relative;
		.num-val {
			font-size: 35rpx;
			font-weight: bold;
		}
		.num-tips {
			color: #999999;
			font-size: 22rpx;
			position: absolute;
			bottom: 30rpx;
			left: 50%;
			transform: translateX(-50%);
		}
		.tit-txt {
			top: 30rpx;
		}
	}
	.connectSty {
		border: 2px solid #6ac2f1;
	}
}
.btn-box {
	.btn-item {
		width: 60%;
	}
}
.mar-t110 {
	margin-top: 110rpx;
}
.block-item {
	font-size: 26rpx;
	.block-l {
		width: 20%;
	}
	.block-r {
		width: 80%;
		line-height: 50rpx;
	}
}
.title {
	font-size: 30rpx;
}
</style>
