<template>
	<view class="wrap-min">
		<head-nav title="购买详情" goBack="true"></head-nav>
		<view class="box pad20">
			<view class="head-info flex-row flex-a">
				<view class="bom-img">
					<u--image
						:showLoading="true"
						:src="courseInfo.image"
						width="100%"
						height="200rpx"
						radius="20rpx"
					></u--image>
				</view>
				<view class="bom-rInfo padlr20  flex-col">
					<!-- 卡 标题 -->
					<view class="card-title text-elpis">
						{{ courseInfo.title || '' }}
					</view>
					<!-- 摘要 -->
					<view class="card-activateTime text-elpis2 text-elpis4">
						{{ courseInfo.abstract || '' }}
					</view>
				</view>
			</view>
			<!-- 教练列表组件 -->
			<coach-list :coachList="coachList" :clockIn="true" @selectCoach="selectCoach"></coach-list>
			<!-- 产品介绍页 -->
			<view class="product-introduce">
				<view class="tit">
					产品介绍
				</view>
				<view class="mar-t20">
					<u-parse :content="courseInfo.introduce"></u-parse>
				</view>
				
			</view>
		</view>
		<view class="pad20" v-if="couponList.length">
			<u-cell-group :customStyle="{background: '#fff'}">
				<u-cell   title="优惠卷:" :value="couponName || '暂无'" :isLink="true" @click="couponShow = true">
					<view class="" slot="icon">
						<u-icon name="coupon" size="22" color="#fe5e10"></u-icon>
					</view>
				</u-cell>
			</u-cell-group>
		</view>
		<!-- 选择支付方法组件 -->
		<view class="">
			<pay-way
				ref="payWayRef"
				:butType="couponId"
				:totalPrice="totalPriceNum"
				:price="courseInfo.price"
				@payFun="payFun"
			></pay-way>
		</view>
		
		<u-action-sheet
			:actions="couponList"
			title="优惠卷列表"
			:show="couponShow"
			cancelText="关闭"
			@close="couponShow = false"
			@select="selectCoupon"
		></u-action-sheet>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';

// 支付方式组件
import payWay from '@/components/payWay/payWay.vue';
// 教练列表组件
import coachList from '@/components/coachList/coachList.vue';
import { buyCourseInfo, buyCourse } from "@/api/clockIn.js"
export default {
	name: 'buyCard',
	components: {
		payWay,
		coachList
	},
	data() {
		return {
			baseUrl: baseUrl,
			// 课程id
			courseId: "", 
			// 教练列表
			coachList: [],
			// 课程信息
			courseInfo: {},
			// 选中教练关系id
			id: "",
			// 选中教练id
			coachId: "",
			/* 使用优惠卷后总金额 */
			totalPriceNum: 0,
			// 优惠卷列表
			couponList: [], 
			 // 选择优惠卷show
			couponShow: false,
			/* 优惠卷id */
			couponId: "",
			/* 优惠卷名称 */
			couponName: "",
		};
	},
	onLoad(eve) {
		this.courseId = eve.id;
		this.getCourseInfo();
	},
	methods: {
		/* 选中优惠卷 */
		selectCoupon(e) {
			this.couponName = e.name;
			this.couponId = e.id; // 优惠卷id
			this.getCourseInfo();
		},
		// 组件选中教练
		selectCoach(id, coachId) {
			/* 
				id ==> 教练关系id
				coachId ==> 教练id
			 */
			this.coachId = coachId;
			this.id = id;
			
		},
		// 组件点击支付
		payFun(eve) {
			if (!eve.selectPayType || !eve.agreementState) {
				uni.showToast({
					title: '请选择支付方式和勾选协议',
					icon: 'none'
				});
				return;
			}
			if(!this.courseId || !this.coachId) {
				uni.showToast({
					title: '请选择教练',
					icon: 'none',
					mask: true
				});
				return;
			};
			let payObj = {
				product_id: this.courseId,
				withcoach_id: this.id,
				pay_type: eve.selectPayType,
				coach_id: this.coachId,
				coupon_id: this.couponId
			};
			// return
			uni.showModal({
				title: "提示",
				content: "确定购买当前产品吗？",
				confirmText: "确定购买",
				success: res => {
					if(res.confirm) {
						this.buyCourseFun(payObj);
					}
				}
			})
		},
		buyCourseFun(data) {
			// 购课
			buyCourse({
				...data
			}).then(res => {
				if (
					res.data instanceof Object &&
					res.data.hasOwnProperty('order_sn') &&
					!res.data.hasOwnProperty('appId')
				) {
					uni.showToast({
						title: res.msg,
						icon: 'success',
						mask: true
					});
					setTimeout(() => {
						uni.navigateTo({
							url: `/pages/store/pages/paySuccess/paySuccess?orderInfo=${
								JSON.stringify(res.data)
							}&type=1`
						});
					}, 1500);
				} else {
					this.wxPay(res.data);
				}
			});
		},
		// wx支付
		wxPay(eve) {
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: eve.timeStamp,
				nonceStr: eve.nonceStr,
				package: eve.package,
				signType: eve.signType,
				paySign: eve.paySign,
				success: function(res) {
					uni.showToast({
						title: '微信支付成功',
						icon: 'success',
						mask: true
					});
					setTimeout(() => {
						uni.navigateTo({
							url: `/pages/store/pages/paySuccess/paySuccess?order_sn=${
								eve.order_sn
							}&type=2`
						});
					}, 1500);
				},
				fail: function(err) {
					uni.showToast({
						title: '支付失败',
						icon: 'error',
						mask: true
					});
				}
			});
		},
		// 获取课程信息
		getCourseInfo() {
			buyCourseInfo({
				id: this.courseId,
				coupon_id: this.couponId
			}).then(res => {
				if(res.data.coupon.length) {
					res.data.coupon.map(item => {
						item.name = `${item.name} (${item.bond_price}元)`
					})
					this.couponList = res.data.coupon
					if(this.couponId === '' || this.couponId === undefined) {
						this.couponName = res.data.coupon[0].name
						this.couponId = res.data.coupon[0].id
					}
				}
				this.totalPriceNum= res.data.total_price
				this.coachList = res.data.withcoach;
				this.courseInfo = res.data.info;
				this.$refs.payWayRef.getPayList(res.data.pay_type);
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	.text-elpis4 {
		-webkit-line-clamp: 4;
	}
	.product-introduce {
		.product-img {
			.img-li {
				width: 32%;
			}
			justify-content: space-between;
			width: 100%;
		}
		.product-txt {
			width: 100%;
			font-weight: 400;
			color: #999999;
			font-size: 26rpx;
			line-height: 50rpx;
		}
		.tit {
			font-weight: bold;
			color: rgba(32,32,32,0.9000);
			font-size: 33rpx;
		}
		width: 100%;
	}
.head-info {
	.bom-rInfo {
		.card-activateTime{
			width: 100%;
			color: rgba(0, 0, 0, 0.6);
			font-size: 22rpx;
			margin-top: 10rpx;
		}
		.card-title {
			font-size: 33rpx;
			font-weight: 600;
			color: rgba(0, 0, 0, 0.9);
		}
		width: 65%;
		height: 200rpx;
		font-size: 26rpx;
		padding-top: 10rpx;
	}
	.bom-img {
		width: 35%;
	}
	width: 100%;
	justify-content: space-between;
}
</style>
