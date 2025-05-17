<template>
	<view :class="{'pad-b100': !tabsCurrent}">
		<head-nav
			title="会员卡管理"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="pad20" >
			<u-button text="添加会员卡" color="#fe5e10" @click="jump('add')"></u-button> 
		</view>
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
			<u-checkbox-group
			    v-model="multipleIds"
				placement="column"
			>
				<view
					class="li mar-b40"
					v-for="(item, index) in list"
					:key="index"
					@click="goRouter(item)"
				>
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
								<view class="txt">次数：{{item.times }}</view>
								<view class="txt">天数：{{item.days }}</view>
							</view>
							<view
								class="info-r"
							>
								<view class="flex pad-b20" v-if="tabsCurrent === 1" @click.stop="sortUpFun(item)">
									<u-avatar :src="baseUrl + 'sortUp.png'" size="50rpx"></u-avatar>
								</view>
									
							   <u-checkbox
									v-if="!tabsCurrent && !item.is_examine"
									:customStyle="{marginBottom: '40rpx', 'justify-content': 'center'}"
									:name="item.id"
								>
								</u-checkbox>
								<view class="btn btn1" v-if="!item.is_examine && tabsCurrent === 3" @click.stop="addedFun(item)">上架</view>
								<view class="btn btn1" v-if="tabsCurrent === 1" @click.stop="soldOutFun(item)">下架</view>
								<view class="btn btn2" v-if="tabsCurrent !== 3" @click.stop="jump('edit',item)">编辑</view>
								<view class="btn btn2" v-if="tabsCurrent === 2" @click.stop="addedFun(item)">提交</view>
								<view class="btn btn3" v-if="tabsCurrent === 3" @click.stop="delFun(item)">删除</view>
							</view>
						</view>
					</view>
					<u-line margin="40rpx 0"></u-line>
				</view>
			</u-checkbox-group>
			<u-empty
				v-if="!list.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>
		
		<view class="btn-box " v-if="!tabsCurrent">
			<view class="btn flex" :class="{forbidden: !multipleIds.length}" @click="submitAudit">确定上架</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { storeVipCard, addedCard, soldOutCard, delCard, sortUp } from '@/api/admin.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			tabsArr: [
				{
					name: '待审核',
					state: 0,
				},
				{
					name: '已通过',
					state: 1,
				},
				{
					name: '未通过',
					state: -1,
				},
				{
					name: '已下架',
					state: -2
				}
			],
			// tabs当前选中
			tabsCurrent: 0,
			// 当前页
			current: 1,
			list: [],
			/* 上架的ids */
			multipleIds: [],
		};
	},
	onLoad() {
		
	},
	onShow() {
		this.resetFun();
		this.getStoreVipCard();
	},
	onReachBottom() {
		this.current ++ 
		this.getStoreVipCard();
	},
	methods: {
		/* 上架 */
		submitAudit() {
			if(this.multipleIds.length) {
				this.addedFun({id: this.multipleIds.join(",")});
			}
		},
		/* 向上排序 */
		sortUpFun(e) {
			sortUp({id: e.id}).then(res => {
				uni.showToast({
					title: res.msg,
				})
				setTimeout(() => {
					this.resetFun();
					this.getStoreVipCard();
				},1500)
			})
		},
		// 删除会员卡
		delFun(eve) {
			delCard({
				id: eve.id,
			}).then(res => {
				uni.showToast({
					title: res.msg,
					icon: "none"
				})
				setTimeout(() => {
					this.resetFun();
					this.getStoreVipCard();
				},1000)
			})
		},
		// 下架会员卡
		soldOutFun(eve) {
			soldOutCard({
				id: eve.id,
			}).then(res => {
				uni.showToast({
					title: res.msg,
					icon: "none"
				})
				setTimeout(() => {
					this.resetFun();
					this.getStoreVipCard();
				},1000)
			})
		},
		// 会员卡上架审核
		addedFun(eve) {
			addedCard({
				id: eve.id
			}).then(res => {
				uni.showToast({
					title: res.msg,
					icon: "none"
				})
				
				setTimeout(() => {
					this.multipleIds= [];
					this.resetFun();
					this.getStoreVipCard();
				},1000)
			})
		},
		// 获取会员卡列表
		getStoreVipCard() {
			storeVipCard({
				list_rows: 20,
				page: this.current,
				status: this.tabsArr[this.tabsCurrent].state
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			});
		},
		// 重置数据
		resetFun() {
			this.current = 1;
			this.list = [];
		},
		// 跳转详情
		goRouter(eve) {
			uni.navigateTo({
				url: `/pages/admin/pages/productDetail/productDetail?id=${eve.id}`
			});
		},
		// tabschange改变
		tabsChange(eve) {
			this.resetFun();
			this.tabsCurrent = eve.index;
			this.getStoreVipCard();
		},
		//跳转发布会员卡
		jump(type, item) {
			let url = "";
			if(type== "add") {
				url = `/pages/admin/pages/releaseMember/releaseMember?type=add`
			}else {
				url = `/pages/admin/pages/releaseMember/releaseMember?type=edit&id=${item.id}`
			}
			
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.forbidden {
	background-color: #999 !important;
}
.pad-b100 {
	padding-bottom: 100rpx;
}
.btn-box {
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 20rpx;
	width: 100%;
	background-color: #fff;
	.btn {
		color: #fff;
		background: #fe5e10;
		font-size: 32rpx;
		height: 76rpx;
		border-radius: 96rpx;
		width: 100%;
	}
}
.list-box {
	.li {
		.li-info {
			.info-r {
				.btn1 {
					color: #fe5e10;
					border: 1px solid #fe5e10;
					margin-bottom: 15rpx;
				}

				.btn2 {
					background-color: #fe5e10;
					color: #fff;
				}

				.btn3 {
					background-color: #ff0d0e;
					color: #fff;
				}

				.btn {
					padding: 8rpx 35rpx;
					border-radius: 35rpx;
					font-weight: 400;
					font-size: 24rpx;
					margin-bottom: 10rpx;
				}
			}

			.info-l {
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
				height: 140rpx;
			}

			width: 22%;
			height: 200rpx;
		}
	}
}
</style>
