<template>
	<view>
		<head-nav
			title="积分商城"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="head-box pad20" >
			<view class="head-cont  flex-col ju-bt" :style="'background:url('+ baseUrl +'jf1.png);background-size: 100% 100%;'">
				<view class="tit-txt pad-l40">
					积分余额
				</view>
				<view class="num-box pad-l40 pad-r40 flex-row flex-a ju-bt">
					<view class="num-icon flex-row flex-a">
						<image :src="baseUrl+'jf4.png'" mode=""></image>
						<text class="num-val">{{ score }}</text>
					</view>
					<view class="detail flex" @click="goIntegrateDetail">
						积分明细
					</view>
				</view>
			</view>
		</view>
		<u-line margin="20rpx 0 0"></u-line>
		<view class="list-box flex-row flex-a">
			<view class="li pad20" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
				<image :src="item.image" mode=""></image>
				<view class="tit text-elpis">
					{{item.title }}
				</view>
				<view class="num-box yhj-box  flex-row flex-a ju-bt">
					<view class="num-icon flex-row flex-a">
						<image :src="baseUrl+'jf4.png'" mode=""></image>
						<text class="num-val">{{ item.price }}</text>
					</view>
					<view class="detail flex">
						库存 {{ item.stock }}
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { baseUrl } from '@/utils/baseUrl.js';
	import { integralProductList } from "@/api/integral.js"
	export default {
		data() {
			return {
				baseUrl: baseUrl,
				// 个人积分
				score: 0, 
				// 当期页
				current : 1,
				list: [],
			};
		},
		onLoad(e) {
			this.score = e.score ?? 0
			// this.getIntegralProductList();
		},
		onShow() {
			this.current = 1;
			this.list = [];
			this.getIntegralProductList();
		},
		onReachBottom() {
			this.current ++
			this.getIntegralProductList();
		},
		methods: {
			/* 获取积分列表 */
			getIntegralProductList() {
				integralProductList({
					list_rows: 20,
					page: this.current
				}).then(res => {
					this.list = [...this.list, ...res.data.data];  
				})
			},
			// 跳转积分明细
			goIntegrateDetail() {
				uni.navigateTo({
					url: "/pages/myCenter/pages/integralDetail/integralDetail" 
				})
			},
			// 跳转商品详情
			goDetail(e) {
				uni.navigateTo({
					url: `/pages/myCenter/pages/integrateGoodsDetail/integrateGoodsDetail?id=${e.id}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.list-box {
		.li:nth-of-type(odd){
		  //奇数行  
		  border-right: 1px solid #E7E7E7;
		} 
		.li:nth-of-type(even){
		  //偶数行 
		  // background-color: red;
		}
		.li {
			.yhj-box {
				.detail {
					font-weight: 300;
					color: #999999;
					font-size: 22rpx;
				}
				.num-val {
					font-size: 35rpx;
					font-weight: 500;
					color: #FE5E10;
					margin-left: 10rpx;
				}
				image {
					width: 30rpx;
					height: 30rpx;
				}
			}
			.tit {
				font-weight: 400;
				color: rgba(0,0,0,0.9);
				font-weight: 28rpx;
				margin: 10rpx 0;
				font-size: 26rpx;
			}
			image {
				width: 100%;
				height: 140rpx;
			}
			width: 50%;
			border-bottom: 1px solid #E7E7E7;
		}
		flex-wrap: wrap;
	}
	.head-box {
		.head-cont {
			.num-box {
				.detail {
					width: 150rpx;
					height: 50rpx;
					border-radius: 40rpx;
					font-size: 28rpx;
					border: 1px solid #fff;
				}
				.num-icon {
					.num-val {
						margin-left: 10rpx;
						font-size: 32rpx;
					}
					image {
						width: 45rpx;
						height: 45rpx;
					}
				}
				padding-bottom: 15rpx;
			}
			.tit-txt {
				margin-top: 40rpx;
				font-weight: 400;
				font-size: 28rpx;
			}
			width: 100%;
			height: 100%;
			color: #FFFFFF;
		}
		width: 100%;
		height: 270rpx;
	}

</style>
