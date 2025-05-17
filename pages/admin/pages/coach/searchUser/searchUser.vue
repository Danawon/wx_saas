<template>
	<!-- 此页面废弃 暂未删除 -->
	<view>
		<!-- 教练查询用户 -->
		<head-nav
			:title="pageType"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="tabs flex-row flex-a ju-ar pad20 mar-b20">
			<view
				class="tab-li flex-row flex-a"
				v-for="(item, index) in tabsList"
				:key="index"
				:class="{ selectTabs: currentTabs == index }"
				@click="clickTabs(index)"
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
					:disabled="true"
					@click="goRouter(1)"
				></u-search>
			</view>
			<view class="search-btn flex" @click="goRouter(1)">
				搜索
			</view>
		</view>
		<view class="list-box pad20 mar-t20">
			<view
				class="li "
				v-for="(item, index) in 5"
				:key="index"
			>
				<view class="flex-row flex-a ju-bt">
					<view class="li-avatar flex-row flex-a">
						<u-avatar
							:src="baseUrl + 'avatar2.png'"
							size="100rpx"
						></u-avatar>
						<view class="name mar-l20">尔康</view>
					</view>
					<view class="li-r">
						<view class="btn flex" @click="goRouter(2)">查看</view>
					</view>
				</view>
				<u-line margin="40rpx 0"></u-line>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			pageType:'用户查询',
			// 当前选中 tabs
			currentTabs: 0,
			tabsList: [
				 
				{
					tit: '余额',
					id: 2
				},
				{
					tit: '会员卡有效期',
					id: 3
				},
				{
					tit: '激活会员卡',
					id: 4
				}
			],
		};
	},
	onLoad(op) {
		this.pageType = op.type=='VIP'?'潜在会员查询':'用户查询'
	},
	methods: {
		// 选中tabs
		clickTabs(eve) {
			this.currentTabs = eve;
		},
		// 跳转搜索筛选页面
		goRouter(type) {
			if(type == 1) {
				uni.navigateTo({
					url: "/pages/admin/pages/searchFilter/searchFilter"
				})
			}else if(type) {
				uni.navigateTo({
					url: "/pages/admin/pages/userDetail/userDetail"
				})
			}
			
		},
	}
};
</script>

<style lang="scss" scope>
.list-box {
	.li {
		.li-r {
			.btn {
				font-weight: 400;
				color: #fe5e10;
				font-size: 28rpx;
				width: 120rpx;
				height: 60rpx;
				border-radius: 15rpx;
				border: 1px solid #fe5e10;
			}
		}
		.li-avatar {
			.name {
				font-weight: 400;
				color: #202020;
				font-size: 32rpx;
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
