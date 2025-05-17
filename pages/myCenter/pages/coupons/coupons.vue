<template>
	<view class="wrap-min">
		<head-nav
			title="优惠劵"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<u-sticky bgColor="#fff">
			<u-tabs
				:scrollable="false"
				:list="tabList"
				lineColor="#FE5E10"
				:activeStyle="{
					color: '#FE5E10',
					fontWeight: 'bold',
					transform: 'scale(1.05)'
				}"
				:inactiveStyle="{
					color: '#606266',
					transform: 'scale(1)'
				}"
				:current="tabsCurrent"
				@change="tabsChange"
			></u-tabs>
		</u-sticky>
		<view class="list-box pad20">
			<view class="li mar-b40   pad40" v-for="(item, index) in list" :key="index" :style="
				'background:url(' +
					baseUrl +
					'yhj2.png);background-size: 100% 100%;'
			">
				<view class="li-t flex-row flex-a mar-t20">
					<view class="li-price flex-row flex-a">
						<view class="price-icon ">
							¥
						</view>
						<view class="price-num">
							{{ item.bond_price }}
						</view>
					</view>
					<view class="li-name">
						{{ item.name }}
					</view>
				</view>
				<view class="li-b flex-row flex-a mar-t20 ju-bt">
					<view class="b-tips">
						{{ item.type_name }}
					</view>
					<view class="b-validity">
						有效期：{{ item.granttime }} - {{ item.deadtime }}
					</view>
				</view>
			</view>
			<u-empty
				v-if="!list.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { couponList } from "@/api/myCenter.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			tabList: [
				{
					name: '未使用',
					id: 1,
				},
				{
					name: '已使用',
					id: 2,
				},
				{
					name: '已过期',
					id: 3,
				}
			],
			current: 1,
			list: [],
			// tabs当前选中
			tabsCurrent: 0,
		};
	},
	onLoad() {
		this.getCouponList();
	},
	onReachBottom() {
		this.current ++
		this.getCouponList();
	},
	methods: {
		// 获取优惠卷列表
		getCouponList() {
			couponList({
				status: this.tabList[this.tabsCurrent].id,
				page: this.current,
				list_rows: 20,
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			})
		},
		// tabschange改变
		tabsChange(eve) {
			this.tabsCurrent = eve.index;
			this.current = 1;
			this.list = [];
			this.getCouponList();
		},
	},
};
</script>

<style lang="scss" scoped>
	.list-box {
		.li {
			.li-b {
				.b-tips {
					width: 29%;
				}
				.b-validity {
					width: 60%;
					font-size: 22rpx;
				}
				font-size: 24rpx;
				color: rgba(255,255,255,.7);
				width: 100%;
			}
			.li-t {
				.li-name {
					width: 60%;
					font-size: 35rpx;
				}
				.li-price {
					.price-icon {
						margin-right: 10rpx;
					}
					.price-num {
						font-size: 45rpx;
						font-weight: bold;
					}
					width: 40%;
				}
				width: 100%;
			}
			width: 100%;
			height: 250rpx;
			color: #fff;
		}
		width: 100%;
	}
</style>
