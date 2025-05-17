<template>
	<view class="wrap">
		<head-nav title="搜索门店" goBack="true"></head-nav>
		<view class="search-box">
			<u-search
				placeholder="请输入场馆名称"
				shape="round"
				border="none"
				actionText="搜索"
				bgColor="#fff"
				:actionStyle="{ color: '#FE5E10' }"
				height="76rpx"
				v-model="searchVal"
				@search="searchFun"
				@custom="searchFun"
			></u-search>
		</view>
		<!-- 门店列表 组件模块 -->
		<shop-list
			ref="shopListRef"
			v-if="!searchData.length"
		></shop-list>
		<!-- 为空状态 -->
		<u-empty
			mode="search"
			marginTop="200rpx"
			text="暂无数据..."
			v-else
		></u-empty>
	</view>
</template>

<script>
// 门店列表组件
import shopList from '@/components/shopList/shopList.vue';
import { searchShop } from '@/api/storeApis.js';
export default {
	components: {
		shopList
	},
	data() {
		return {
			// 搜索val
			searchVal: '',
			// 搜索门店数据
			searchData: [],
			latitude: "",
			longitude: "",
		};
	},
	onLoad(e) {
		this.latitude = e.latitude
		this.longitude = e.longitude
		this.searchShop();
	},
	methods: {
		// 搜索发生改变
		searchFun() {
			this.searchShop();
		},
		// 搜索门店
		searchShop() {
			let _this = this;
			searchShop({
				keyword: _this.searchVal,
				latitude: _this.latitude,
				longitude: _this.longitude,
			}).then(res => {
				this.$refs.shopListRef.getParentList(res.data);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.search-box {
	padding: 20rpx;
}
.wrap {
	height: 100vh;
	background-color: #f9f9f9;
	padding-bottom: 20rpx;
}
view {
	box-sizing: border-box;
}
</style>
