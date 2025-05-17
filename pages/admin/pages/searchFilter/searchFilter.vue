<template>
	<view>
		<head-nav
			title="用户查询"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="tabs flex-row flex-a ju-ar pad20 mar-b20">
			<view
				class="tab-li flex-row flex-a"
				v-for="(item, index) in tabsList"
				:key="index"
				:class="{ selectTabs: currentTabs == index }"
			>
				<view class="li-tit">{{ item.tit }}</view>
				<u-icon
					top="2rpx"
					name="arrow-down-fill"
					:color="
						currentTabs == index
							? '#FE5E10'
							: '#696969'
					"
					size="24rpx"
				></u-icon>
			</view>
		</view>
		<view class="pad20">
			<!-- 筛选门店 -->
			<view class="tit mar-t20 mar-b20">门店</view>
			<view class="shopList-box flex-row flexa ju-bt">
				<view
					class="li  flex"
					v-for="(item, index) in shopList"
					:key="index"
					:class="{ selectShop: shopIndex === index }"
					@click="selectShop(item, index)"
				>
					{{ item.name }}
				</view>
			</view>
			<!-- 筛选次数 -->
			<view class="tit mar-t40 mar-b20">剩余次数</view>
			<view class="count-box flex-row flex-a mar-t20">
				<view class="startCount count">
					<u-input
						placeholder="请输入"
						border="surround"
						v-model="startCountVal"
						inputAlign="center"
						type="digit"
					>
						<text slot="suffix">次</text>
					</u-input>
				</view>
				<view class="txt marlr20">至</view>
				<view class="endCount count">
					<u-input
						placeholder="请输入"
						border="surround"
						v-model="endCountVal"
						inputAlign="center"
						type="digit"
					>
						<text slot="suffix">次</text>
					</u-input>
				</view>
			</view>
			<!-- 会员卡有效期 -->
			<view class="tit mar-t40 mar-b20">会员卡有效期</view>
			<view class="count-box flex-row flex-a mar-t20">
				<view class="startCount count">
					<u-input
						placeholder="请输入"
						border="surround"
						v-model="startDay"
						inputAlign="center"
						type="digit"
					>
						<text slot="suffix">天</text>
					</u-input>
				</view>
				<view class="txt marlr20">至</view>
				<view class="endCount count">
					<u-input
						placeholder="请输入"
						border="surround"
						v-model="endDay"
						inputAlign="center"
						type="digit"
					>
						<text slot="suffix">天</text>
					</u-input>
				</view>
			</view>

			<!-- 激活会员卡 -->
			<view class="tit mar-t40 mar-b20">激活会员卡</view>
			<view class="activateDays-sty  felx-row flex-a">
				<text class="txt-sty mar-r20">未激活超过</text> 
				<u-input
					placeholder="请输入"
					border="surround"
					v-model="activateDays"
					inputAlign="center"
					:customStyle="{width: '150rpx'}"
					type="digit"
				>
					<text slot="suffix">天</text>
				</u-input>
			</view>
		</view>
		
		<view class="fot-box flex-row">
			<view class="reset-btn flex" @click="resetFun">
				重置
			</view>
			<view class="confirm-btn flex" @click="confirmFun">
				确定
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { shopList } from "@/api/admin.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 当前选中 tabs
			currentTabs: 0,
			tabsList: [
				{
					tit: '门店',
					id: 1
				},
				{
					tit: '剩余次数',
					id: 2
				},
				{
					tit: '会员卡有效期',
					id: 3
				},
				{
					tit: '是否激活会员',
					id: 4
				}
			],

			// 门店列表
			shopList: [],
			// 选中的门店下标
			shopIndex: "",
			// 选中的门店
			shopId: "",
			// 开始次数
			startCountVal: '',
			// 结束次数
			endCountVal: '',
			// 开始天
			startDay: '',
			// 结束天
			endDay: '',
			// 激活会员卡天
			activateDays: "",
		};
	},
	onLoad() {
		this.getShopList();
	},
	methods: {
		
		// 选中门店
		selectShop(item, index) {
			this.shopIndex = index;
			this.shopId = item.id;
		},
		// 获取门店id
		getShopList() {
			shopList().then(res => {
				this.shopList = res.data;
			})
		},
		// 重置筛选
		resetFun() {
			this.shopId = "";
			this.shopIndex = "";
			this.startCountVal = "";
			this.endCountVal = "";
			this.startDay = "";
			this.endDay = "";
			this.activateDays = "";
		},
		// 确定搜索
		confirmFun() {
			uni.$emit("filterFun", {
				isActivation: this.activateDays,
				storeId: this.shopId,
				residueDegree: this.startCountVal && this.endCountVal ?  this.startCountVal + ',' + this.endCountVal : '',
				validity: this.startDay && this.endDay ? this.startDay + ',' + this.endDay : "",
			})
			uni.navigateBack()
		},
	}
};
</script>

<style lang="scss" scoped>
	.txt-sty {
		font-size: 26rpx;
	}
	.activateDays-sty {
		width: 55%;
	}
	.fot-box {
		.confirm-btn {
			width: 60%;
			color: #fff;
			background-color: #fe5e10;
			height: 90rpx;
		}
		.reset-btn {
			font-weight: 400;
			color: #999999;
			font-size: 28rpx;
			width: 40%;
			height: 90rpx;
		}
		position: fixed;
		bottom: 50rpx;
		left: 0;
		width: 100%;
	}
.count {
	width: 240rpx;
}
.shopList-box {
	.selectShop {
		border: 1px solid #fe5e10 !important;
		color: #fe5e10 !important;
	}
	.li {
		// width: 35%;
		padding: 0 20rpx;
		height: 60rpx;
		border-radius: 10rpx;
		border: 1px solid rgba(0, 0, 0, 0.6);
		margin: 15rpx 0;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.6);
		font-size: 28rpx;
	}
	flex-wrap: wrap;
}
.tit {
	font-weight: 600;
	color: rgba(0, 0, 0, 0.9);
	font-size: 32rpx;
}
.selectTabs {
	font-weight: 500 !important;
	color: #fe5e10 !important;
}
.tab-li {
	.li-tit {
		margin-right: 6rpx;
	}
	font-size: 28rpx;
	font-weight: 400;
	color: #999999;
}
</style>
