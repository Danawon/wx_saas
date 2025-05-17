<template>
	<view>
		<head-nav
			title="优惠劵记录"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="search-box  pad20">
			<view class="search-ipt">
				<u-search
					borderColor="#FE5E10"
					shape="round"
					bgColor="#fff"
					height="70rpx"
					placeholder="搜索关键词"
					:showAction="false"
					:inputStyle="{
						'padding-right': '95rpx'
					}"
					v-model="searchCouponVal"
				></u-search>
			</view>
			<view class="search-btn flex" @click="searchCoupon">
				搜索
			</view>
		</view>
		<view class="list-box pad20">
			<view class="li mar-t40 " v-for="(item, index) in list" :key="index">
				
				<view class="li-info padlr20">
					<!-- 代金券名称 -->
					<view class="info-name flex-row flex-a ju-bt ">
						<view class="coupons-name flex-row flex-a">
							<view class="name">
								{{ item.name || ''}}
							</view>
							<view class="coupons-state mar-l20">
								<view class="state state1" v-if="item.is_use == 1">
									已使用
								</view>
								<view class="state state2" v-else>
									未使用
								</view>
							</view>
						</view>
						<!-- 发放人 -->
						<view class="peoplePaid">
							发放人：{{  item.grant_name}}
						</view>
					</view>
					<!-- 发放时间 -->
					<view class="provideTime flex-row">
						发放时间：{{ item.granttime }}
					</view>
					<!-- 价值 -->
					<view class=" txt-sty">
						面值：{{ item.bond_price }}元
					</view>
					<!-- 用户id -->
					<view class=" txt-sty">
						用户ID：{{ item.uid }}
					</view>
					<!-- 可用范围 -->
					<view class="flex-row flex-a ju-bt">
						<view class="txt-sty">
							可用范围：{{ item.grant_range_text }}
						</view>
						<view class="del-btn" v-if="!item.is_use"  @click="delCouponFun(item)">
							删除
						</view>
					</view>
					<!-- 有效期 -->
					<view class=" txt-sty">
						有效期：{{ item.usetime }}至{{ item.deadtime }}
					</view>
				</view>
				
				<view class="li-line">
					<u-line margin="30rpx 0"></u-line>
				</view>
			</view>
		</view>
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
	</view>
</template>

<script>
	import { couponRecord, delCoupon } from "@/api/admin.js"
	export default {
		data() {
			return {
				// 当前页
				current: 1,
				list: [],
				// 搜索优惠卷 val
				searchCouponVal: "",
			};
		},
		onLoad() {
			this.getCouponRecord();
		},
		onReachBottom() {
			this.current ++ 
			this.getCouponRecord();
		},
		methods: {
			// 删除优惠卷
			delCouponFun(e) {
				delCoupon({
					id: e.id
				}).then(res => {
					uni.showToast({
						title: res.msg,
					})
					setTimeout(() => {
						this.current = 1;
						this.list = [];
						this.getCouponRecord();
					}, 1000)
				})

			},
			// 搜索优惠卷
			searchCoupon() {
				this.current = 1;
				this.list = [];
				this.getCouponRecord();
			},
			// 获取优惠卷列表
			getCouponRecord() {
				couponRecord({
					page: this.current,
					list_rows: 20,
					keyword: this.searchCouponVal
				}).then(res => {
					this.list = [...this.list, ...res.data.data]
				})
			},
			// 跳转页面
			goRouter() {}
		}
	}
</script>

<style lang="scss" scoped>
	.li {
		.li-info{
			.del-btn {
				padding: 10rpx 20rpx;
				font-weight: 400;
				color: #FE5E10;
				font-size: 28rpx;
				border: 1px solid #FE5E10;
				border-radius: 10rpx;
			}
			.txt-sty {
				font-weight: 500;
				color: rgba(0,0,0,0.6);
				font-size: 24rpx;
				margin: 10rpx 0;
			}
			.provideTime {
				font-weight: 500;
				color: rgba(0,0,0,0.6);
				font-size: 24rpx;
				justify-content: flex-end;
				margin: 10rpx 0;
			}
			.info-name {
				.coupons-name {
					.coupons-state {
						.state2 {
							background-color: #FE5E10;
						}
						.state1 {
							background-color: #999999;
						}
						.state {
							font-weight: 500;
							color: #FFFFFF;
							font-size: 20rpx;
							border-radius: 6rpx;
							padding: 4rpx 10rpx;
						}
					}
					.name {
						font-weight: 600;
						color: #202020;
						font-size: 32rpx;
					}
				}
				.peoplePaid {
					font-weight: 400;
					color: #202020;
					font-size: 24rpx;
				}
			}
		}
	}
.search-box {
	.search-btn {
		width: 150rpx;
		height: 75rpx;
		color: #fff;
		font-size: 28rpx;
		margin-left: -20rpx;
		background: linear-gradient(
			102deg,
			#ff7c3c 0%,
			#fe5e10 100%
		);
		border-radius: 50rpx;
		position: absolute;
		top: 20rpx;
		right: 20rpx;
	}
	.search-ipt {
		width: 95%;
	}
	width: 100%;
	position: relative;
	// margin: 40rpx 0;
}
</style>
