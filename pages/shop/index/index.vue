<template>
	<view class="wrap-min">
		<head-nav
			:leftSlot="true"
			title="购物商城"
			:goBack="false"
		>
			<slot><u-icon name="map" size="0rpx"></u-icon></slot>
		</head-nav>

		<!-- tabs 盒子 -->
		<u-sticky bgColor="#fff">
			<u-tabs
				:list="tabsList"
				lineColor="#FE5E10"
				:activeStyle="{
					color: '#FE5E10',
					fontWeight: 'bold',
					transform: 'scale(1.05)'
				}"
				:inactiveStyle="{
					color: 'rgba(0,0,0,0.6000)',
					transform: 'scale(1)'
				}"
				:current="tabsCurrent"
				@change="tabsChange"
			></u-tabs>
		</u-sticky>

		<!-- 商品列表 -->
		<view class="commodity-list pad20">
			<view class="list flex-row flex-a">
				<view
					class="li mar-b20 pad-b20"
					v-for="(item, index) in list"
					:key="index"
					@click="goDetail(item)"
				>
					<view class="img-box">
						<u--image
							:showLoading="true"
							:src="item.image"
							width="100%"
							height="380rpx"
						></u--image>
					</view>

					<view
						class="li-tit mar-t20 mar-b20 pad-l20 pad-r20"
					>
						{{ item.title }}
					</view>
					<view
						class="price-box flex-row flex-a pad-l20 pad-r20"
					>
						<!-- 当前价 -->
						<view
							class="current-price flex-row flex-col"
						>
							<u-icon
								name="rmb"
								size="30rpx"
								color="#FF0D0E"
								:bold="true"
								top="5rpx"
							></u-icon>
							<view class="price-num">{{ item.sales_price }}</view>
						</view>
						<!-- 划线价 -->
						<view class="lineation-price mar-l20">
							¥{{ item.market_price }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { productList, productScreening } from "@/api/mall.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// tabs  分类列表
			tabsList: [ 
			],
			current: 1,
			// 商品列表
			list: [],
			tabsCurrent: 0, // tabs index
			
		};
	},
	onLoad() {
		// this.getProductScreening();
	},
	onReachBottom() {
		this.current ++
		this.getProductList();
	},
	onShow() {
		this.getProductScreening();
	},
	methods: {
		// 获取分类列表
		getProductScreening() {
			productScreening().then(res => {
				this.tabsList = res.data;
				this.tabsList.unshift({name: "全部", id: ""})
				this.current = 1;
				this.list = [];
				this.getProductList();
			})
		},
		// tab change
		tabsChange(eve) {
			this.tabsCurrent = eve.index;
			this.current = 1;
			this.list = [];
			this.getProductList();
		},
		// 获取列表
		getProductList() {
			productList({
				list_rows:20,
				page: this.current,
				cid: this.tabsList[this.tabsCurrent].id ?? ""
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			})
		},
		// 跳转商品详情
		goDetail(eve) {
			uni.navigateTo({
				url: `/pages/shop/pages/commodityDetail/commodityDetail?id=${eve.id}`
			})
		},
	}
};
</script>

<style lang="scss" scoped>
.commodity-list {
	.list {
		.li {
			.img-box {
				height: 380rpx;
				width: 100%;
			}
			.price-box {
				.lineation-price {
					font-family: DIN-Medium, DIN;
					font-weight: 500;
					color: rgba(0, 0, 0, 0.26);
					font-size: 26rpx;
					text-decoration: line-through;
					margin-top: 6rpx;
				}
				.current-price {
					.price-num {
						font-family: DIN-Medium, DIN;
						font-weight: bold;
						color: #ff0d0e;
						font-size: 40rpx;
					}
				}
			}
			.li-tit {
				// padding: 0 10rpx;
				font-weight: 400;
				color: rgba(32, 32, 32, 0.9);
				line-height: 20px;
				font-size: 28rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				-webkit-background-clip: text;
				line-height: 40rpx;
			}
			width: 49%;
			border-radius: 20rpx;
			overflow: hidden;
			background-color: #fff;
		}
		justify-content: space-between;
		flex-wrap: wrap;
	}
}

</style>
