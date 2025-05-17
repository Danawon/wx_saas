<template>
	<view class="wrap ">
		<head-nav
			:leftSlot="true"
			title="翰思运动健康"
			:goBack="false"
		>
			<slot>
				<u-icon name="map" size="40rpx"></u-icon>
				<text class="map-txt">{{ cityName }}</text>
			</slot>
		</head-nav>
		<!-- 搜索模块 -->
		<view class="search-box flex">
			<view class="search-l" v-if="!face_open"></view>
			<view
				class=" flex-col flex-a"
				@click="onsScanFace"
				v-if="face_open"
			>
			<!-- @click="scanQr" -->
				<!-- <u-icon
					name="scan"
					size="60rpx"
					labelPos="bottom"
					color="#000000"
				></u-icon> -->
				<u--image
					:showLoading="true" 
					:src="baseUrl + 'scanFace.png'" 
					width="60rpx" 
					height="60rpx" 
					
				></u--image>
				<!-- <text>扫脸开门</text> -->
			</view>
			<view class="search-ipt">
				<u-search
					@click="goSearch"
					placeholder="请输入场馆名称"
					shape="round"
					border="none"
					disabled
					bgColor="#fff"
					:showAction="false"
					height="76rpx"
				></u-search>
			</view>
			<view
				class="search-r flex-col flex-a"
				@click="goService"
			>
				<u-icon
					size="54rpx"
					name="kefu-ermai"
					color="#000000"
					labelPos="bottom"
				></u-icon>
				<text>客服</text>
				<view class="tips-icon" v-if="is_reply">
					<image :src="baseUrl + 'tips-icon.png'" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 门店列表 组件模块 -->
		<shop-list
			ref="shopListRef"
			:locatingObj="{ latitude, longitude }"
		></shop-list>

		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			title="门禁入场码"
			confirmText="确定"
			:showCancelButton="false"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentConfirm="modalConfirm"
		>
			<view class="modalTxt pad-b40 flex">
				<view
					class="swiper-box "
					v-if="qrUrl"
				>
					<u--image 
						:showLoading="true" 
						:src="qrUrl" 
						width="100%" 
						height="400rpx" 
					></u--image>
				</view>
				<u-empty
					v-if="!qrUrl"
					mode="list"
					text="暂无门禁码..."
				></u-empty>
			</view>
		</modal-tips>
	</view>
</template>

<script>
// 头部导航
import headNav from '@/components/headNav/headNav.vue';
// 门店列表
import shopList from '@/components/shopList/shopList.vue';
// 获取接口
import {
	getShopList,
	getLocation,
	entranceGuard,
	getQrCode,
	refreshQr,
	bindingUid,
	base_config
} from '@/api/storeApis.js';
import { baseUrl } from '@/utils/baseUrl.js';
import modalTips from '@/components/modalTips/modalTips.vue';
/* 引入socket公共服务 */
import { ws } from '@/common/ws.js';
export default {
	components: {
		headNav,
		shopList,
		modalTips
	},
	data() {
		return {
			// ftp地址
			baseUrl: baseUrl,
			// 当前页
			current: 1,
			// city name
			cityName: '',
			latitude: '', // 维度
			longitude: '', // 经度
			modalShow: false, // modalshow
			timer: '', // 请求定时器
			is_reply: 0, // 客服是否回复
			qrUrl: "", // 门禁码
			qrId: "", // 门禁id
			linkNums: 1, // 连接次数
			existConnectSocket: false, // 是否存在socket实例
			face_open: 0,
		};
	},
	onLoad(e) {
		if (!uni.getStorageSync('token')) {
			uni.setStorageSync('uid', e.uid);
		}
		if (e.q) {
			/* 二维码进入 */
			if (!uni.getStorageSync('token')) {
				uni.setStorageSync(
					'uid',
					decodeURIComponent(e.q)
						.split('&')[1]
						.split('=')[1]
				);
			}
		}
	},
	onShow() {
		// 获取当前位置经纬度
		this.getLocationFun();
		this.getBase_config();
	},
	onPullDownRefresh() {
		// 获取当前位置经纬度 下拉刷新
		this.getLocationFun();
	},
	onReachBottom() {},
	methods: {
		getBase_config() {
			base_config().then(res => {
				this.face_open = res.data.face_open
			})
		},
		/* 点击人脸扫描 */
		onsScanFace() {
			uni.navigateTo({
				url: "/pages/store/pages/faceRecording/faceRecording"
			})
		},
		/* 链接socket */
		connectSocket() {
			/* 存在socket实例 */
			this.existConnectSocket = true;
			// 链接socket
			ws.socket(
				eve => {
					/* socket抛出错误的回调 */
					this.linkNums = 1;
					uni.showLoading({
						title: '连接设备中,请稍等...'
					});
				},
				() => {
					uni.hideLoading();
				},
				this.wsMessageFun
			);
		},
		
		/* 接收socket服务数据 */
		wsMessageFun(e) {
			this.socketData = JSON.parse(e);
			if(!this.client_id && this.socketData.client_id) {
				this.client_id = this.socketData.client_id ;
			}
			if(this.socketData.status === "warning_tips") {
				this.modalConfirm();
				uni.showModal({
					title: "异常提示",
					content: this.socketData.text,
					showCancel: false,
					confirmText: "知道了",
					success: e => {
					}
				})
			}
			if (
				this.client_id &&
				this.linkNums <= 1 
			) {
				this.bindingUidFun();
				this.linkNums += 1;
			}
		},
		/* socket绑定uid */
		bindingUidFun() {
			bindingUid({
				client_id: this.client_id,
			}).then(res => {
			}) 
		},
		/* 刷新二维码 */
		refreshQrFun(id) {
			refreshQr({ id }).then(res => {
				this.getRrCodeFun();
			});
		},
		/* 获取门禁码信息 */
		getRrCodeFun() {
			getQrCode({
				longitude: this.longitude,
				latitude: this.latitude,
			}).then(res => {
				this.qrUrl = res.data.image;
				this.qrId = res.data.id
				if(!Array.isArray( res.data)) {
					this.connectSocket();
				}
			});
		},
		/* 点击modal确定 */
		modalConfirm() {
			if(this.existConnectSocket) {
				ws.stop(() => {
					this.client_id = "";
					this.linkNums = 1;
					this.existConnectSocketS = false
				});
			}
			this.modalShow = false;
			/* 关闭二维码定时刷新 */
			clearInterval(this.timer);
		},
		// 获取位置
		getLocationFun() {
			uni.showLoading({
				title: '正在获取当前定位请稍等...'
			});
			let _this = this;
			uni.getLocation({
				type: 'gcj02',
				// type: 'wgs84',
				isHighAccuracy: true,
				success: function(lotRes) {
					_this.latitude = lotRes.latitude; // 维度
					_this.longitude = lotRes.longitude; // 经度
					uni.setStorageSync(
						'latitude',
						lotRes.latitude
					);
					uni.setStorageSync(
						'longitude',
						lotRes.longitude
					);
					// getLocation({
					// 	latitude: lotRes.latitude,
					// 	longitude: lotRes.longitude
					// }).then(res => {
					// 	_this.cityName = res.data.city;
					// 	_this.is_reply = res.data.is_reply
					// 	uni.hideLoading();
					// 	// 获取门店列表
					// 	_this.getShop();
					// });
				},
				fail: err => {
					if(err.errMsg == "getLocation:fail:ERROR_NETWORK" || err.errMsg == "getLocation:fail:timeout") {
						uni.showModal({
							title: `提示异常`,
							content:`您当前网络不佳，建议您切换一下网络后重新进入小程序!${err.errMsg}`,
							showCancel: false,
							confirmText: '确定',
							success(res) {
							
							}
						});
					}else {
						uni.showModal({
							title: `提示异常`,
							content: `您当前未授权定位，如不授权，将无法正常使用定位功能！`,
							confirmText: '去授权',
							success(res) {
								if (res.confirm) {
									// 选择弹框内授权
									uni.openSetting({
										success(res) {}
									});
								} 
							}
						});
					}
					
					uni.hideLoading();
				}
			});
		},
		// 获取门店列表
		getShop() {
			let _this = this;
			getShopList({
				longitude: this.longitude,
				latitude: this.latitude
			}).then(res => {
				uni.stopPullDownRefresh();
				_this.$refs.shopListRef.getParentList(res.data);
			});
		},
		// 扫码开门
		scanQr() {
			let _this = this;
			this.modalShow = true;
			
			/* 请求获取二维码 */
			this.getRrCodeFun();
			/* 如果不存在qrid 不启用定时器 */
			if(!this.qrId) return
			this.timer = setInterval(() => {
				this.refreshQrFun(this.qrId);
			}, 30000);
		},
		// 跳转客服页
		goService() {
			uni.navigateTo({
				url: '/pages/store/pages/serviceMessage/serviceMessage'
			});
		},
		// 跳转搜索
		goSearch() {
			uni.navigateTo({
				url: `/pages/store/pages/searchShop/searchShop?longitude=${
					this.longitude
				}&latitude=${this.latitude}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.swiper-box {
	width: 400rpx;
}
.search-box {
	.search-ipt {
		width: 76%;
		padding: 0 20rpx;
	}

	.search-r,
	.search-l {
		width: 10%;
		font-size: 24rpx;
	}
	.search-l {
		width: 14%;
		color: #000;
	}
	.search-r {
		.tips-icon {
			position: absolute;
			top: -10rpx;
			right: 0rpx;
			width: 35rpx;
			height: 35rpx;
			image {
				width: 100% !important;
				height: 100% !important;
			}
		}
		position: relative;
		color: rgba(0, 0, 0, 0.4);
	}
	width: 100%;
	padding: 20rpx;
}
.map-txt {
	margin-left: 10rpx;
}
.wrap {
	min-height: 100vh;
	background-color: #f9f9f9;
	overflow-x: hidden;
	// padding: 0rpx 0rpx 20rpx;
	padding-top: 0;
	padding-left: 0;
	padding-right: 0;
}
view {
	box-sizing: border-box;
}
</style>
