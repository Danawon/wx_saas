<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="约课详情"></head-nav>
		<view class="page pad20 padtb40">
			<view class="page-top flex-a padlr40 pad-b20">
				<view class="img-box ">
					<u-avatar
						:src="info.coach.avatar"
						size="132rpx"
					></u-avatar>
				</view>
				<view class="top-r pad-l40 flex-col ju-bt">
					<view class="flex-a">
						<text class="name">{{ info.product_name || '' }}</text>
						<u-tag :text="info.status_text" borderColor="#fff" type="warning" color="#FE5E10" plain plainFill></u-tag>
					</view>
					<view class="time">
						今日 {{ info.period || ''  }}
					</view>
				</view>
				<text class="num">￥{{ info.total_price || '' }}</text>
			</view>
			<view class="page-center pad-b20">
				<view class="flex-a ju-bt page-li pad20">
					<text>用户昵称</text>
					<text class="name">{{ info.user.nickname }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20">
					<text>用户ID</text>
					<text class="name">{{ info.uid }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>预约场地 </text>
					<text>{{ info.store.name }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>预约教练 </text>
					<text>{{ info.coach.name }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>预约时间 </text>
					<text>{{ info.date_name }} {{ info.period }}</text>
				</view>

				<view class="flex-a ju-bt page-li pad20 bor">
					<text>支付方式 </text>
					<text>{{ info.pay_type_name }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>约课会员卡 </text>
					<text>{{ info.card_name }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>签到时间 </text>
					<text>{{ info.scan_time || '' }}</text>
				</view>
				<view class="flex-a ju-bt page-li pad20 bor">
					<text>课时费 </text>
					<text>{{ info.course_fee || 0 }}</text>
				</view>

			</view>
		</view>

	</view>
</template>

<script>
	import { storeCourseDetail } from "@/api/admin.js"
	export default {
		data() {
			return {
				orderId: "", // 订单id
				info: {},
			};
		},
		onLoad(e) {
			this.orderId = e.id;
			this.getStoreCourseDetail();
		},
		methods:{
			// 获取详情数据
			getStoreCourseDetail() {
				storeCourseDetail({
					order_id: this.orderId
				}).then(res => {
					this.info = res.data.info
				})
			},
			jump(){
				uni.navigateTo({
					url:'/pages/admin/pages/groupClass/groupClass'
				})
			}
		}
	}
</script>

<style lang="scss">
	.page {
		.page-top {
			border-bottom: 1rpx solid #f5f5f5;
			position: relative;

			.top-r {
				.name {
					font-size: 40rpx;
					font-weight: 600;
					color: #202020;
				}

				.time {
					font-size: 26rpx;
					font-weight: 400;
					margin-top: 20rpx;
					color: rgba(0, 0, 0, 0.4);
				}
			}

			.num {
				color: #FE5E10;
				font-size: 40rpx;
				position: absolute;
				top: 35%;
				right: 50rpx;
				font-weight: bold;
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

				.name {
					color: #FE5E10;
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
