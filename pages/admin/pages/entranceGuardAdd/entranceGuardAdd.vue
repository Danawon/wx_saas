<template>
	<view>
		<head-nav title="添加门禁控制" bgColor="#fff" :goBack="true"></head-nav>
		<view class="page">
			<view class="flex-a ju-bt page-li   padtb20">
				<text>门禁名称：</text>
				<view class="ipt-box flex-j"><u-input placeholder="单行输入" border="none"></u-input></view>
			</view>
			<view class="flex-a ju-bt page-li   padtb20">
				<text>服务器IP：</text>
				<view class="ipt-box flex-j"><u-input placeholder="单行输入" border="none"></u-input></view>
			</view>
			<view class="flex-a ju-bt page-li  padtb20">
				<text>门禁端口：</text>
				<view class="ipt-box flex-j"><u-input placeholder="5/天" border="none"></u-input></view>
			</view>
			
			<view class="btn flex">
				保存
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style lang="scss">
.page {
	padding:0 30rpx 30rpx;
	font-size: 28rpx;
	.ipt-box {
		height: 88rpx;
		width: 514rpx;
		background: #f5f5f5;
		border-radius: 24rpx;
		padding-left: 30rpx;
	}
	
	.btn {
		height: 82rpx;
		color: #fff;
		background: #FE5E10;
		border-radius: 54rpx;
		margin-top: 90rpx;
		font-size:  32rpx;
                  
	}
}
</style>
