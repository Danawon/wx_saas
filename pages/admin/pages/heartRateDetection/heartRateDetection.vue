<template>
	<view class="container">
		<view
			class="bg-box"
			:class="{ bgrotate90: !cloAndRow }"
			:style="{
				background: 'url(' + bgUrl + ')',
				'background-size': '100% 100%'
			}"
		></view>
		<head-nav
			bgColor="rgba(0,0,0,0)"
			:goBack="true"
			titColor="#fff"
			iconC="#fff"
			title="心率监控系统"
		></head-nav>
		<!-- 竖屏组件 -->
		<col-screen
			v-show="cloAndRow"
			@toggleStatus="toggleStatus"
			ref="colRefs"
			:qrurl="qrurl"
		></col-screen>
		<rowScreen
			v-show="!cloAndRow"
			@toggleStatus="toggleStatus"
			ref="rowRefs"
			:qrurl="qrurl"
		></rowScreen>
		
		<!-- 授权使用位置信息 -->
		<modal-tips
			:modalShow="locationBackgroundShow"
			title="开启位置"
			:showConfirmButton="true"
			:showCancelButton="false"
			confirmText="去开启"
			confirmColor="#ff7d3d"
			@parentConfirm="goLocationBackgroundShow"
			:confirmButtonShape="{ fontWeight: 'bold' }"
		>
			<view class="flex-col flex-a">
				<view class="">请选择</view>
				<view class="martb20">
					【使用小程序期间和离开小程序后】
				</view>
				<view class="mar-b40">才能正常使用</view>
			</view>
		</modal-tips>
	</view>
</template>

<script>
import colScreen from './components/colScreen.vue';
import rowScreen from './components/rowScreen.vue';
// 引入modal组件
import modalTips from '@/components/modalTips/modalTips.vue';
/* 引入socket公共服务 */
import { ws } from '@/common/ws.js';
import { unGroup, getScreenQr } from '@/api/admin.js';
/* 引入公共js文件 */
import {
	authorizationBluetoothStatus,
	getAuthorizeUserLocationBackgroundState,
	createInnerAudio,
	audioPlay,
	audioDestroy,
	startLocationUpdateBackground,
	closeLocaionListener
} from '@/common/common.js';
export default {
	components: {
		colScreen,
		rowScreen,
		modalTips
	},
	data() {
		return {
			cloAndRow: true,
			/* 链接socket状态 */
			connectSocketStatus: false,
			/* 扫描二维码 */
			qrurl: '',
			/* 背景图片 竖屏 */
			bgUrlCol: '',
			/* 背景图片 横屏 */
			bgUrlRow: '',
			bgUrl: '',
			/* 授权位置信息modal */
			locationBackgroundShow: false,
			locationUpdate: false,
		};
	},
	onLoad() {
		// if (!this.autoLocationStatus()) {
		// 	return;
		// }
		this.connectSocket();
		this.getNewDate();
		this.timer = setInterval(() => {
			this.getNewDate();
		}, 1000);
		/* 获取投屏数据 */
		this.getScreenQrFun();
	},
	onShow() {
		this.getAuthorizeUserLocationBackground();
		/* 屏幕常亮 */
		uni.setKeepScreenOn({
			keepScreenOn: true,
			fail() {
				uni.setKeepScreenOn({
					keepScreenOn: true
				});
			}
		});
	},
	onUnload() {
		clearInterval(this.timer);
		this.closeLocaionListenerFun();
		this.unGroupFun();
		if (this.connectSocketStatus) {
			ws.stop(() => {});
		}
	},
	methods: {
		/* 去授权实时定位 */
		goLocationBackgroundShow() {
			this.locationBackgroundShow = false;
			wx.openSetting({
				success: res => {}
			});
		},
		/* 结束监听位置变化 */
		closeLocaionListenerFun() {
			if (this.locationUpdate) {
				this.locationUpdate = false;
				closeLocaionListener();
			}
		},
		/* 开始位置更新 */
		startLocationUpdateBackgroundFun() {
			this.locationUpdate = true;
			startLocationUpdateBackground();
		},
		/* 获取授权位置信息状态 */
		getAuthorizeUserLocationBackground() {
			let _this = this;
			getAuthorizeUserLocationBackgroundState(eve => {
				if(!eve) {
					_this.locationBackgroundShow = true;
				}else {
					_this.locationBackgroundShow = false;
					_this.startLocationUpdateBackgroundFun();
				}
			});
		},
		/* 获取投屏二维码 */
		getScreenQrFun() {
			getScreenQr().then(res => {
				/* 扫描二维码 */
				this.qrurl = res.data.qrcode64;
				this.bgUrl = res.data.background;
				/* 背景图片 竖屏 */
				this.bgUrlCol = res.data.background;
				/* 横屏 */
				this.bgUrlRow = res.data.bigbackground;
			});
		},
		/* 解散分组 */
		unGroupFun() {
			unGroup();
		},
		/* 获取时间 */
		getNewDate() {
			let date = `${
				new Date().getHours() < 10
					? '0' + new Date().getHours()
					: new Date().getHours()
			}:${
				new Date().getMinutes() < 10
					? '0' + new Date().getMinutes()
					: new Date().getMinutes()
			}`;
			if (this.cloAndRow) {
				this.$refs.colRefs.getDate(date);
			} else {
				this.$refs.rowRefs.getDate(date);
			}
		},
		/* 切换状态 */
		toggleStatus() {
			this.cloAndRow = !this.cloAndRow;
			this.bgUrl = this.cloAndRow
				? this.bgUrlCol
				: this.bgUrlRow;
		},
		/* 链接socket */
		connectSocket() {
			// 链接socket
			ws.socket(
				eve => {
					/* socket抛出错误的回调 */
					uni.showLoading({
						title: '连接设备中,请稍等...'
					});
				},
				() => {
					this.connectSocketStatus = true;
					this.sendMsgFun();
					uni.hideLoading();
				},
				this.wsMessageFun
			);
		},
		/* 接收socket消息 */
		wsMessageFun(e) {
			// this.sendMsgFun();
			this.socketData = JSON.parse(e);
			if (this.socketData.data) {
				if (this.cloAndRow) {
					this.$refs.colRefs.getParentData(
						this.socketData.data
					);
				} else {
					this.$refs.rowRefs.getParentData(
						this.socketData.data
					);
				}
			}
		},
		/* 发送消息 到socket端 */
		sendMsgFun(heart) {
			ws.sendMsg(
				JSON.stringify({
					type: 'create_system',
					relationid: uni.getStorageSync(
						'relation_id'
					),
					role: uni.getStorageSync('role')
				})
			);
		}
	}
};
</script>

<style lang="scss">
.container {
	height: 100vh;
	position: relative;
	.bg-box {
		width: 100vw;
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.bgrotate90 {
		transform: rotate(90deg);
		transform-origin: top left;
		transform: rotate(90deg) translateY(-100%);
		width: 100vh !important;
		height: 100vw !important;
	}
	// background-color: #808080;
}
.user-box {
	/* 长度列表 为9以上*/
	.unit16 {
		font-size: 16rpx;
	}
	.li16 {
		width: 25%;
		height: 25%;
	}
	.img16 {
		width: 60rpx;
		height: 60rpx;
	}
	.heart16 {
		font-size: 45rpx;
	}
	.size16 {
		font-size: 18rpx;
	}
	.icon16 {
		width: 30rpx;
		height: 30rpx;
	}
	.infoIcon16 {
		width: 20rpx;
		height: 20rpx;
	}
	.userName16 {
		font-size: 16rpx;
	}
	/* 到此 */
	/* 列表长度为4以上 9一下 */
	.unit9 {
		font-size: 18rpx;
	}
	.li9 {
		width: 33.33%;
		height: 33.33%;
	}
	.img9 {
		width: 100rpx;
		height: 100rpx;
	}
	.heart9 {
		font-size: 55rpx;
	}
	.size9 {
		font-size: 24rpx;
	}
	.icon9 {
		width: 45rpx;
		height: 45rpx;
	}
	.infoIcon9 {
		width: 30rpx;
		height: 30rpx;
	}
	/* 到此 */

	/* 列表长度为4 */
	.unit4 {
		font-size: 22rpx;
	}
	.size4 {
		font-size: 35rpx;
	}
	.li4 {
		width: 50%;
		height: 50%;
	}
	.img4 {
		width: 170rpx;
		height: 170rpx;
	}
	.heart4 {
		font-size: 75rpx;
	}
	.icon4 {
		width: 40rpx;
		height: 40rpx;
	}
	.infoIcon4 {
		width: 35rpx;
		height: 35rpx;
	}
	.li {
		.heart-box {
			.icon-box {
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		.info-box {
			.info-block {
				.icon-box {
					image {
						width: 100%;
						height: 100%;
					}
				}
				width: 50%;
				height: 50%;
			}
			flex-wrap: wrap;
		}
		.avatar-box {
			.user-name {
				font-size: 24rpx;
			}
			.avatar {
				height: 70%;
				width: 80%;
				image {
					border-radius: 50%;
				}
			}
		}
		padding: 10rpx;
	}
	.li-bg {
		border-radius: 20rpx;
		height: 100%;
	}
}
.mar-t10 {
	margin-top: 10rpx;
}
.head-strength {
	.strength-child {
		.strength-img {
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			margin-right: -14rpx;
			z-index: 99;
			image {
				width: 80%;
				height: 80%;
			}
		}
		.strength-tit {
			height: 40rpx;
			width: 70%;
			border-radius: 10rpx;
			font-size: 24rpx;
		}
	}
	.strength-1,
	.strength-2 {
		.strength-child {
			height: 50rpx;
		}
	}
	.strength-3 {
		.time {
			font-size: 60rpx;
		}
		.toggle-btn {
			margin-top: 10rpx;
		}
	}
	.strength-qr {
		.img-box {
			width: 100%;
			height: 150rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		padding-top: 10rpx;
	}
	.w25 {
		width: 25%;
	}
}
.col1 {
	background-color: rgba(23, 200, 21, 0.8);
}
.col2 {
	background-color: rgba(135, 220, 41, 0.8);
}
.col3 {
	background-color: rgba(253, 203, 44, 0.8);
}
.col4 {
	background-color: rgba(253, 155, 30, 0.8);
}
.col5 {
	background-color: rgba(167, 20, 133, 0.8);
}
.col6 {
	background-color: rgba(244, 85, 29, 0.8);
}
</style>
