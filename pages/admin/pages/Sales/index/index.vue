<template>
	<view>
		<!-- 营养师 -->
		<view class="page">
			<img :src="baseUrl+'manager/topBg.png'" class="img-bg">
			<head-nav bgColor="rgba(0,0,0,0)" :goBack="true" titColor="#fff" title=" "></head-nav>
			<view style="position: relative;">
				<!-- 头部 -->
				<view class="page-top" @click="jump('/pages/admin/pages/Sales/info/info')">
					<view class="img-box">
						<u--image :src="salesData.avatar" width="96rpx" height="96rpx" shape="circle"></u--image>
					</view>
					<text class="head-txt">{{salesData.name}}</text>
					<view class="icon-right">
						<u-icon name="arrow-right" color="#fff" size="40rpx"></u-icon>
					</view>
				</view>
				<view class="page-center flex-row">
					<view
						class="center-box flex flex-col pad-t40 pad-b20"
						v-for="(item, index) in setList"
						@click="jump(item.url)"
						:key="index"
					>
						<u--image
							:src="item.image"
							width="66rpx"
							height="66rpx"
						></u--image>
						<text class="pad-t20">
							{{ item.name }}
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseUrl } from '@/utils/baseUrl.js';
	import {getInfo} from '@/api/sales.js'
	export default {
		data() {
			return {
				baseUrl: baseUrl, 
				salesData:{}, //页面数据
				//系统设置
				setList: [{
						image: baseUrl + 'applyStore.png',
						name: '申请店面',
						url: '/pages/admin/pages/Sales/shop/shop?type=sale'
					},
					{
						image: baseUrl + 'performance.png',
						name: '销售业绩',
						url: '/pages/admin/pages/Sales/results/results'
					},
					 {
					 	image: baseUrl + 'materialAmend.png',
					 	name: '门店会员',
					 	url:
					 		'/pages/admin/pages/searchUser/searchUser',
					 },
					 {
					 	image: baseUrl + 'potentialMember.png',
					 	name: '潜在会员',
					 	url:
					 		'/pages/admin/pages/searchUser/searchUser?type=potential',
					 },
				]
			};
		},
		onShow() {
			this.getInfo()
		},
		methods: {
			//跳转页面
			jump(url) {
				uni.navigateTo({
					url: `${url}?type=store&storeId=${this.salesData.store_id}`
				})
			},
			//获取基本信息
			getInfo(){
				getInfo().then(res=>{
					if(res.code==200){
						this.salesData = res.data
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-center {
		flex-wrap: wrap;
		.center-box {
			width: 25%;
			font-size: 24rpx;
	
			.image-center {
				height: 66rpx;
				width: 66rpx;
			}
		}
	}
	.page {
		// background-color: #FF925D; 

		.img-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 352rpx;
		}

		.page-top {
			width: 100%;
			padding: 38rpx 34rpx 50rpx 26rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;

			.head-txt {
				font-size: 36rpx;
				font-family: PingFang SC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
				margin-left: 32rpx;
			}

			.icon-right {
				margin-left: auto;
			}
		}

		.pad-t80{
			padding-top: 80rpx;
		}
	}
</style>
