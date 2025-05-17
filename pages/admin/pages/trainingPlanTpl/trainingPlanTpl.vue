<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="训练计划模板"></head-nav>
		<view class="page"> 
			<u-gap height="20rpx" bgColor="#f5f5f5"></u-gap>
			<view class="page-list">
				 <view class="page-li flex-a ju-bt" @click="jump()">
					 <text>模板1</text>
					 <view class="icon-box">
					 	<u-icon name="arrow-right" size="40rpx"></u-icon>
					 </view>
				 </view>
			</view>

		 
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods:{
		jump(){
			uni.navigateTo({
				url:'/pages/admin/pages/planTemplate/planTemplate'
			})
		}
	}
};
</script>

<style lang="scss">
.page {
	padding: 36rpx 26rpx; 
 
	.page-list {
		 padding: 20rpx 26rpx ;
		 margin-bottom: 20rpx;
		 border-bottom: 1rpx solid #E7E7E7;
		 
	}
}
</style>
