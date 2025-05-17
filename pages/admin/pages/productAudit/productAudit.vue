<template>
	<view>
		<head-nav
			title="产品审批"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<!-- tabs模块 -->
		<u-tabs
			:list="tabsArr"
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
			lineWidth="55rpx"
			lineHeight="4rpx"
			:current="tabsCurrent"
			@change="tabsChange"
			:scrollable="false"
		></u-tabs>
		<view class="list-box pad20">
			<view class="li mar-b40" v-for="(item, index ) in list" :key="index" @click="goRouter(item)">
				<view class=" flex-row">
					<view class="li-img flex">
						<image
							:src="item.image"
							mode=""
						></image>
					</view>
					<view
						class="li-info flex-row flex-a ju-bt padlr20"
					>
						<view class="info-l">
							<view class="card-name">
								{{ item.name }}
							</view>
							<view class="txt">现价：{{ item.price }}</view>
							<view class="txt">原价：{{ item.ot_price }}</view>
							<view class="txt">次数：{{ item.times }}</view>
							<view class="txt">天数：{{ item.days }}</view>
							<view 
								class="txt" 
								v-if="item.remark"
							>
								备注：{{ item.remark }}
							</view>
						</view>
						<view class="info-r" v-if="!tabsCurrent">
							<view class="btn btn1" @click.stop="operationFun('reject', item)">驳回</view>
							<view class="btn btn2" @click.stop="operationFun('pass', item)">通过</view>
							<view 
								v-if="item.remark" 
								class="btn btn2" 
								@click.stop="editCardShop(item)"
							>
								修改多店
							</view>
						</view>
					</view>
				</view>
				<u-line margin="40rpx 0"></u-line>
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
import { baseUrl } from '@/utils/baseUrl.js';
import { productAudit, productOperation } from "@/api/admin.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			tabsArr: [
				{
					name: '待审核',
					id: 0
				},
				{
					name: '已通过',
					id: 1
				},
				{
					name: '未通过',
					id: -1
				}
			],
			// tabs当前选中
			tabsCurrent: 0,
			current: 1,
			list: [],
		};
	},
	onLoad(e) {
		if (e.role_id && e.role) {
			uni.setStorageSync('relation_id', e.role_id);
			uni.setStorageSync('role', e.role);
		}
	},
	onShow() {
		this.tabsChange({index: 0})
	},
	onReachBottom() {
		this.current ++;
		this.getProductAudit();
	},
	methods: {
		// 修改多店
		editCardShop(eve) {
			uni.navigateTo({
				url: `/pages/livingAtHomeTraining/pages/editCardShop/editCardShop?ids=${eve.multiple_stores}&cardId=${eve.id}`
			})
		},
		// 驳回 或通过
		operationFun(type, item) {
			productOperation({
				operation: type,
				id: item.id
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.current = 1;
					this.list =[];
					this.getProductAudit();
				},1500)
			})
		},
		// 获取审核列表
		getProductAudit() {
			productAudit({
				page:this.current,
				list_rows: 20,
				status: this.tabsArr[this.tabsCurrent].id
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			})
		},
		// 跳转详情
		goRouter(eve) {
			uni.navigateTo({
				url: `/pages/admin/pages/productDetail/productDetail?id=${eve.id}`
			})
		},
		// tabschange改变
		tabsChange(eve) {
			this.tabsCurrent = eve.index;
			this.current = 1;
			this.list =[];
			this.getProductAudit();
		}
	}
};
</script>

<style lang="scss" scoped>
.list-box {
	.li {
		.li-info {
			.info-r {
				.btn1 {
					color: #fe5e10;
					border: 1px solid #fe5e10;
				}
				.btn2 {
					background-color: #fe5e10;
					color: #fff;
				}
				.btn {
					padding: 5rpx 20rpx;
					border-radius: 35rpx;
					font-weight: 400;
					font-size: 26rpx;
					margin-bottom: 15rpx;
					text-align: center;
				}
			}
			.info-l {
				width: 70%;
				.txt {
					font-weight: 400;
					color: rgba(0, 0, 0, 0.6);
					font-size: 24rpx;
					margin: 10rpx 0;
				}
				.card-name {
					font-weight: 550;
					color: #202020;
					font-size: 28rpx;
				}
			}
			width: 78%;
		}
		.li-img {
			image {
				width: 100%;
				height: 80rpx;
			}
			width: 22%;
			height: 200rpx;
		}
	}
}
</style>
