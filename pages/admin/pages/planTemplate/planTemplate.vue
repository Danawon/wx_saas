<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="计划模板"></head-nav>
		<view class="page">
			<view class="page-top">
				<view class="ipt-box flex-a   mar-b40">
					<text>模板名称</text>
					<view class="ipt flex-col"><u-input placeholder="模板1" border="surround" /></view>
				</view>
				<view class="add-btn flex">添加分组</view>
			</view>

			<view class="page-box pad20">
				<view class="page-list">
					<view class="page-li ">
						<view class="flex-a ju-bt li">
							<text class="fs32">第一月</text>
							<view class="btn-box flex-a">
								<view class="add-grouping flex btn ">添加子分组</view>
								<view class="del flex">删除</view>
							</view>
						</view>
						<u-line></u-line>
						<view class="flex-a ju-bt li">
							<text class="fs28">第一月</text>
							<view class="btn-box flex-a">
								<view class="add-child flex btn" @click="jump">添加子节点</view>
								<view class="del flex">删除</view>
							</view>
						</view>
						<u-line></u-line>
						<view class="flex-a ju-bt li">
							<text class="fs28 gray">1.好好吃饭</text>
							<view class="btn-box"><view class="del flex">删除</view></view>
						</view>
					</view>
				</view>

			</view>
			<view class="sub-btn flex">保存</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		jump(){
			uni.navigateTo({
				url:'/pages/admin/pages/planNode/planNode'
			})
		}
	}
};
</script>

<style lang="scss">
.page {
	padding-bottom: 20rpx;

	.page-top {
		padding: 10rpx 34rpx 30rpx;
		background-color: #fff;
		.ipt-box {
			font-size: 28rpx;
			
			 
			
			.ipt {
				margin-left: 66rpx;
			}
		}
		.add-btn {
			width: 144rpx;
			height: 60rpx;
			font-size: 26rpx;
			color: #fe5e10;
			border-radius: 42rpx;
			margin-left: 180rpx;
			border: 1px solid #fe5e10;
		}
	}
	
	.sub-btn {
		height: 80rpx;
		background: #fe5e10;
		border-radius: 48rpx;
		font-size: 32rpx;
		color: #ffffff;
		width: 90%;
		position: absolute;
		bottom: 60rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.page-box {
		background-color: #f9f9f9;
		height: 80vh;

		.fs32 {
			font-size: 32rpx;
		}
		.fs28 {
			font-size: 28rpx;
		}
		.gray {
			color: #999999;
		}
		.page-list {
			.page-li {
				background-color: #fff;
				border-radius: 24rpx;
				padding: 0 24rpx;
			}

			.li {
				padding: 36rpx 0;
			}
			.btn-box {
				margin-left: auto;

				font-size: 22rpx;
			}
			.btn {
				color: #ffff;
				background: #fe5e10;
				border-radius: 8rpx;
				margin-right: 18rpx;
				padding: 0 8rpx;
				height: 56rpx;
			}

			.add-child {
				background-color: #fea41d;
			}

			.del {
				color: #ffff;
				width: 112rpx;
				height: 46rpx;
				background: #ef0708;
				border-radius: 58rpx;
			}

			
		}
	
	}
}
</style>
