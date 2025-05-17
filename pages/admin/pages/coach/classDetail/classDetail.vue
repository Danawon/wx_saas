<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="约课详情"
		></head-nav>
		<view class="page pad20 padtb40">
			<view class="page-top flex-a  pad-b20">
				<view class="img-box ">
					<u-image
						:src="info.user.avatar"
						width="132rpx"
						height="132rpx"
						shape="circle"
					></u-image>
				</view>
				<view class="top-r pad-l20">
					<view class="name">
						{{ info.user.nickname || '' }}
					</view>
					<view class="gray">
						手机号：{{ info.user.mobile ||'' }}
					</view>
				</view>
			</view>
			<view class="page-center pad-b20">
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>课程名称</text>
					<text>{{ info.product_name || '' }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>预约场地</text>
					<text>{{ info.store.name || '居家' }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>上课时间</text>
					<text>{{info.scan_time || '未上课' }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>预约时段</text>
					<text>{{ info.date_name || '' }} {{ info.period || '' }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>预约时间</text>
					<text>{{ info.paidtime || '' }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>上课教练</text>
					<text>{{ info.coach.name ||'' }}</text>
				</view>				
				<view
					class="flex-a ju-bt page-li pad20 bor"
					@click="jump(1)"
					v-if="info.product == 'private_teaching' || info.product ==  'home_training'"
					
				>
					<text>操作</text>
					<view class="icon-box">
						<u-icon
							name="arrow-right"
							color="#5ac725"
							size="30rpx"
							:label="info.course_id ? '编辑计划' : '发布计划'"
							labelColor="#5ac725"
							space="10rpx"
							labelPos="left"
						></u-icon>
					</view>
				</view>
				
				<view
					class="flex-a ju-bt page-li pad20 bor"
					@click="jump(2)"
					v-if="info.product == 'private_teaching' || info.product == 'home_training'"
				>
					<text>操作</text>
					<view class="icon-box">
						<u-icon
							name="arrow-right"
							color="#3c9cff"
							size="30rpx"
							label="查看训练计划"
							labelColor="#3c9cff"
							space="10rpx"
							labelPos="left"
						></u-icon>
					</view>
				</view>
				
				<view
					class="btn btn8 flex mar-t40"
					v-if="
						info.status == 3 &&
							info.product != 'home_training'
					"
					@click="scanCodeFun"
				>
					扫码签到
				</view>
				<view
					class="btn btn3 flex mar-t40"
					v-if="info.status == 4"
					@click="overCourseFun"
				>
					结束课程
				</view>
				<view
					class="btn btn4 flex mar-t20"
					v-if="info.status == -2"
				>
					已失效
				</view>
				<view
					class="btn btn2 flex mar-t20"
					v-if="info.status == 2"
				>
					已完成
				</view>

				<view
					class="btn btn3 flex mar-t20"
					v-if="info.status == -1"
				>
					已取消
				</view>
				<view
					class="btn btn1 flex mar-t20"
					v-if="info.status == 1"
				>
					未完成
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { courseOrderDetail } from '@/api/admin.js';
import { scanCode, overCourse } from '@/api/myCenter.js';
export default {
	data() {
		return {
			// 订单id
			orderId: '',
			info: {},
			roleId: '', // 身份id
			role: '' ,// 身份
			backOnShow: false,
		};
	},
	async onLoad(op) {
		/* 微信扫码进入当前页面 */
		if(op.q) {
			let qrData = decodeURIComponent(op.q).split('&').slice(1);
			/* 解析 后端需要二维码信息 */
			let encrypt = decodeURIComponent(op.q).split("=")[1].split("&")[0]
			this.orderId = this.getqrData(qrData[0]);
			this.roleId = this.getqrData(qrData[1]);
			this.role = this.getqrData(qrData[2]);
			this.backOnShow = true;
			await this.getCourseOrderDetail();
			await this.resolveQrCode(encrypt);
			
			return
		}
		this.orderId = op.orderId;
		this.roleId = op.role_id;
		this.role = op.role;
	},
	onShow() {
		if (this.roleId && this.role) {
			uni.setStorageSync('relation_id', this.roleId);
			uni.setStorageSync('role', this.role);
		}
		if(!this.backOnShow) {
			this.getCourseOrderDetail();
		}
	},
	methods: {
		/* 获取 二维码解析数据 */
		getqrData(e) {
			return e.split('=')[1]
		},
		/* 结束课程 */
		overCourseFun() {
			overCourse({
				order_id: this.orderId
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					this.getCourseOrderDetail();
				}, 1500);
			});
		},
		// 扫码签到
		scanCodeFun(eve) {
			this.backOnShow = true;
			uni.scanCode({
				success: res => {
					/* 解析 后端需要二维码信息 */
					let encrypt = decodeURIComponent(res.result).split("=")[1].split("&")[0]
					this.backOnShow = false;
					this.resolveQrCode(encrypt)
				},
				fail: err => {
					this.backOnShow = false;
				}
			});
			return;
		},
		/* 执行扫码签到 */
		resolveQrCode(eve) {
			scanCode({
				encrypt: decodeURIComponent(eve)
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					this.getCourseOrderDetail();
				}, 1500);
			});
		},
		// 获取订单详情
		getCourseOrderDetail() {
			courseOrderDetail({
				order_id: this.orderId
			}).then(res => {
				this.info = res.data.info;
			});
		},
		jump(type) {
			let url = ""
			if(type == 1) {
				/* 编辑训练计划 */
				url = `/pages/admin/pages/coach/trainingPlan/trainingPlan?uid=${
					this.info.uid
				}&orderId=${this.orderId}`
			}else {
				/* 查看训练计划 */
				url = `/pages/admin/pages/coach/coursePlan/coursePlan?uid=${
					this.info.uid
				}&orderId=${this.orderId}`
			}
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.btn8 {
	background-color: #fe5e10;
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
	height: 80rpx;
	border-radius: 40rpx;
	color: #fff;
	font-size: 28rpx;
}
.fs40 {
	font-size: 40rpx;
	font-weight: bold;
}
.page {
	.page-top {
		border-bottom: 1rpx solid #f5f5f5;
		position: relative;

		.top-r {
			.name {
				font-weight: 500;
				font-size: 30rpx;
				margin-bottom: 16rpx;
			}
			.gray {
				color: rgba(0, 0, 0, 0.6);
				font-size: 22rpx;
			}
		}
	}

	.page-center {
		.page-li {
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
			padding-top: 40rpx;

			.page-li text:last-child {
				color: #000;
			}

		}
		.color0 {
			color: #000;
			font-weight: bold;
		}

		.bor {
			border-bottom: 1rpx solid #f5f5f5;
		}

		.img-box {
			padding-top: 130rpx;
		}
	}
}
</style>
