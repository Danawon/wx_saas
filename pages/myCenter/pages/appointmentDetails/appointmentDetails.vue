<template>
	<view>
		<head-nav
			title="约课详情"
			bgColor="#fff"
			:goBack="!type"
			:goIndex="type"
		></head-nav>
		<view class="course-info pad40 flex-row flex-a ju-bt">
			<view class="info-l flex-row flex-a">
				<view class="avatar mar-r40">
					<u-avatar
						:src="courseInfo.product == 'private_teaching' ? courseInfo.coach.avatar : courseInfo.user.avatar"
						size="140rpx"
					></u-avatar>
				</view>
				<view class="course-name flex-col ju-bt ">
					<view class="name">
						{{ courseInfo.product_name || '' }}
					</view>
					<view class="time">
						{{ courseInfo.date_name || '' }}
						{{ courseInfo.period || '' }}
					</view>
				</view>
			</view>
		</view>
		<view class="li-box pad-l20 pad-r20">
			<u-line margin="20rpx 0"></u-line>
			<view class="group">
				<u-cell-group
					:border="false"
					:customStyle="{ 'font-size': '50rpx' }"
				>
					<u-cell
						title="预约场地"
						:titleStyle="{ color: '#999999' }"
						:value="courseInfo.product == 'home_training' ? '居家' : courseInfo.store.name"
					></u-cell>
					<u-cell
						title="预约教练"
						:titleStyle="{ color: '#999999' }"
						:value="courseInfo.coach.name || '无'"
					></u-cell>
					<u-cell
						title="上课时间"
						:titleStyle="{ color: '#999999' }"
						:value="courseInfo.scan_time || ''"
					></u-cell>
					<u-cell
						title="约课卡名"
						:titleStyle="{ color: '#999999' }"
						:value="courseInfo.card_name"
					></u-cell>
				</u-cell-group>
			</view>
		</view>
		<!-- 查看合成内容 -->
		<view class="viewContent flex mar-t40 mar-b20" v-if="courseInfo.course_id">
			<view class="viewBtn flex" @click="viewCourseContent">
				查看课程内容
			</view>
		</view>

		<view class="fot-btns padlr20">
			<view
				class=" flex  flex-col"
				v-if="courseInfo.status == 3 && courseInfo.product != 'home_training'"
			>
				<view class="tips-box mar-b20 padlr40">
					<view class="">
						温馨提示
					</view>
					<view class="">
						扫码成功系统即确定您已开始上课。不建议线上转发二维码给教练签到，以免造成您的损失!
					</view>
				</view>
				<!-- 二维码 -->
				<!-- <u-avatar
					:src="qrUrl"
					size="280rpx"
					shape="square"
				></u-avatar> -->
				<u--image
					:showLoading="true" 
					:src="qrUrl" 
					width="280rpx" 
					height="280rpx" 
				></u--image>
				<view
					class="refreshQr mar-t20"
					@click="getCourseQRFun"
				>
					刷新二维码
				</view>
			</view>

			<view
				class="btn btn2 flex mar-t20"
				v-if="courseInfo.status == 4"
			>
				进行中
			</view>
			<view
				class="btn btn4 flex mar-t20"
				v-if="courseInfo.status == -2"
			>
				失效
			</view>
			<view
				class="btn btn5 flex mar-t20"
				v-if="courseInfo.status == 2"
			>
				完成
			</view>
			<view
				class="btn btn4 flex mar-t20"
				v-if="courseInfo.status == -1"
			>
				已取消
			</view>
			<view
				class="btn btn6 flex mar-t20"
				v-if="
					(courseInfo.status == 1 ||
						courseInfo.status == 3) && courseInfo.product != 'home_training'
				"
				@click="cancelCourse"
			>
				取消
			</view>
			<view
				class="btn btn2 flex mar-t20"
				v-if="courseInfo.status == 5"
			>
				已签到
			</view>
			<view class="btn btn8 flex mar-t20" v-if="courseInfo.status == 1 && courseInfo.product == 'league_class'" @click="scanCodeFun">
				扫码签到
			</view>
		</view>
	</view>
</template>

<script>
import {
	getCourseInfo,
	userScanCode,
	getCourseQR,
	userCancelCourse,
} from '@/api/myCenter.js';
export default {
	data() {
		return {
			type: '', // 是否是支付成功页跳转到此
			orderId: '', // 订单id
			courseInfo: {}, // 课程详情
			qrUrl: '' // 二维码
		};
	},
	onLoad(eve) {
		// 是否是支付成功页跳转到此
		this.type = eve.type ?? '';
		this.orderId = eve.orderId;
		this.getOrderInfo();
	},

	methods: {
		
		/* 查看课程内容 */
		viewCourseContent() {
			uni.navigateTo({
				url:
					`/pages/myCenter/pages/trainingDetailEquipment/trainingDetailEquipment?courseId=${this.courseInfo.course_id}`
			});
		},
		/* 取消约课 */
		cancelCourse() {
			userCancelCourse({
				order_id: this.orderId
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.getOrderInfo();
				},1500)
			})
		},
		// 获取二维码
		getCourseQRFun() {
			let _this = this;
			uni.showLoading({
				title: "获取定位中..."
			})
			uni.getLocation({
				type: 'gcj02',
				// type: 'wgs84',
				isHighAccuracy: true,
				success: (lotRes)=> {
					getCourseQR({
						order_id: _this.orderId,
						longitude:lotRes.longitude,
						latitude: lotRes.latitude
					}).then(res => {
						_this.qrUrl = res.data;
					});
				},
				fail(err) {
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
				},
				complete() {
					uni.hideLoading()
				},
			})
			
		},
		// 扫码签到
		scanCodeFun() {
			uni.scanCode({
				success: res => {
					let id = res.result.split('=')[1].split('&')[0]
					let timestamp =  res.result.split('=')[2]
					userScanCode({
						id: id,
						uid: this.courseInfo.uid,
						timestamp: timestamp,
					}).then(res => {
						uni.showToast({
							title: res.msg
						});
						setTimeout(() => {
							this.getOrderInfo();
						}, 1500);
					});
				}
			});
			return;
		},
		// 获取信息
		getOrderInfo() {
			getCourseInfo({
				order_id: this.orderId
			}).then(res => {
				this.courseInfo = res.data.info;
				if (this.courseInfo.status == 3) {
					this.getCourseQRFun();
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.viewContent {
		.viewBtn {
			width: 80%;
			height: 70rpx;
			background-color: #3fa24e;
			border-radius: 40rpx;
			color: #fff;
		}
	}
.refreshQr {
	padding: 15rpx 30rpx;
	border-radius: 30rpx;
	color: #fff;
	background-color: #24a1e7;
	font-size: 26rpx;
}
.fot-btns {
	.tips-box {
		color: #e48c68;
		font-size: 24rpx;
		line-height: 40rpx;
		text-align: center;
	}
	.btn8 {
		background-color: #fe5e10;
	}
	.btn6 {
		background-color: #ff0d0e;
	}
	.btn5 {
		background-color: #03d0e5;
	}
	.btn4 {
		background-color: #c9caca;
	}
	.btn3 {
		background-color: #fe5e10;
	}
	.btn2 {
		background-color: #0dbc14;
	}
	.btn1 {
		background-color: #fbc300;
	}
	.btn {
		width: 100%;
		height: 70rpx;
		border-radius: 40rpx;
		color: #fff;
		font-size: 28rpx;
	}
}
/deep/ .u-cell__value {
	font-weight: bold;
}
.course-info {

	.info-l {
		.course-name {
			.time {
				font-size: 26rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.4);
			}
			.name {
				font-weight: 600;
				color: #202020;
				font-size: 36rpx;
			}
			height: 140rpx;
			padding: 10rpx 0;
		}
	}
}
</style>
