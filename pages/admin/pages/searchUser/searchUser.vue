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
				@click="goRouter(1)"
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
					v-model="searUserVal"
				></u-search>
			</view>
			<view class="search-btn flex" @click="searchUserFun">
				搜索
			</view>
		</view>
		<view class="list-box pad20 mar-t20">
			<view
				class="li "
				v-for="(item, index) in list"
				:key="index"
			>
				<view class="flex-row flex-a ju-bt">
					<view class="li-avatar flex-row flex-a">
						<u-avatar
							:src="item.avatar"
							size="100rpx"
						></u-avatar>
						<view class="name mar-l20">
							<view class="">
								{{ item.nickname }}
							</view>
							<view class="mar-t">
								电话: {{ item.mobile || '未授权' }}
							</view>
							<view class="mar-t">
								ID: {{ item.id }}
							</view>
						</view>
					</view>
					<view class="li-r">
						<view class="btn flex" @click="goRouter(2, item)">查看</view>
					</view>
				</view>
				<u-line margin="20rpx 0"></u-line>
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
import { searchUserGet, searchUserPost } from "@/api/admin.js"
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
			// 搜索框输入值
			searUserVal: "",
			// 当前页
			current: 1,
			// 是否激活会员
			isActivation: "",
			// 有效期
			validity: "",
			// 剩余次数
			residueDegree: "",
			// 门店id
			storeId: "",
			// 列表
			list: [],
			/* 查询 指定类型会员 */
			parentType: "", 
		};
	},
	onLoad(e) {
		this.storeId = e.storeId ?? "";
		this.parentType = e.type
		this.getSearchList("get");
	},
	onReachBottom() {
		this.current ++
		if(this.storeId && this.isActivation) {
			this.getSearchList("post");
		}else {
			this.getSearchList("get");
		}
	},
	onShow() {
		let _this = this;
		uni.$off();
		uni.$on("filterFun",eve => {
			this.resetFun();
			this.searUserVal = "";
			_this.isActivation = eve.isActivation; // 激活会员卡天数
			_this.validity = eve.validity;
			_this.residueDegree = eve.residueDegree;
			_this.storeId = eve.storeId;
			this.getSearchList("post");
		});
	},
	methods: {
		// 重置筛选
		resetFun() {
			this.list = [];
			this.current = 1;
			this.isActivation = "";
			this.validity = "";
			this.residueDegree = "";
			// this.storeId = "";
		},
		// 搜索数据
		getSearchList(type) {
			if(type == "get") {
				searchUserGet({
					page: this.current,
					list_rows: 20,
					keyword: this.searUserVal,
					condition: this.parentType || '',
					store_id: this.storeId,
				}).then(res => {
					this.list = [...this.list, ...res.data.data];
				})
			} else {
				searchUserPost({
					page: this.current,
					list_rows: 20,
					is_activation: this.isActivation,
					validity: this.validity,
					residue_degree: this.residueDegree,
					store_id: this.storeId,
					condition: this.parentType || '',
				}).then(res => {
					this.list = [...this.list, ...res.data.data];
				})
			}
		},
		// 搜索
		searchUserFun() {
			this.resetFun();
			this.getSearchList("get");
		},
		// 选中tabs
		clickTabs(eve) {
			this.currentTabs = eve;
		},
		// 跳转搜索筛选页面
		goRouter(type, item) {
			if(type == 1) {
				uni.navigateTo({
					url: "/pages/admin/pages/searchFilter/searchFilter"
				})
			}else if(type) {
				uni.navigateTo({
					url: `/pages/admin/pages/userDetail/userDetail?id=${item.id}`
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
				font-size: 24rpx;
				width: 120rpx;
				height: 45rpx;
				border-radius: 10rpx;
				border: 1px solid #fe5e10;
			}
		}
		.li-avatar {
			.name {
				font-weight: 400;
				color: #202020;
				font-size: 32rpx;
				.mar-t{
					margin-top: 10rpx;
					font-size: 26rpx;
					color: #999;
				}
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
