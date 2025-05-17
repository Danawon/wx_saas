<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="智能门禁控制"></head-nav>
		<view class="page">
			<view class="btn flex" @click="add">添加门禁</view>

			<view class="page-list">
				<view class="page-li  flex-a ju-bt">
					<text>大门</text>
					<view class="switch-box flex-a"><u-switch v-model="switchIndex" :activeValue="1" :inactiveValue="0" activeColor="#0DBC14"></u-switch></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			switchIndex:0
		};
	},
	methods:{
		add(){
			uni.navigateTo({
				url:'/pages/admin/pages/entranceGuardAdd/entranceGuardAdd'
			})
		}
	}
};
</script>

<style lang="scss">
.page {
	padding: 20rpx 26rpx 30rpx;

	.btn {
		height: 80rpx;
		background: #fe5e10;
		font-weight: 500;
		color: #ffffff;
		font-size: 28rpx;
		border-radius: 8rpx;
	}

	.page-list {
		padding-top: 30rpx;

		.page-li {
			padding: 36rpx 26rpx 32rpx 0;
			border-bottom: #e7e7e7 1rpx solid;
			font-size: 28rpx;
			font-weight: 400;
			color: rgba(32, 32, 32, 0.9);
			margin-bottom: 30rpx;
		}
	}
}
</style>
