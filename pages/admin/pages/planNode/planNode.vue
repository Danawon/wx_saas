<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="计划模板"></head-nav>
		<view class="page">
			<view class="page-box  ">
				<view class="page-list">
					<view class="page-li ">
						<view class="flex-a ju-bt li"><text class="fs32">节点1</text></view>
						<u-line></u-line>
						<view class="flex-a ju-bt li"><text class="fs32">节点1</text></view>
						<u-line></u-line>
						<view class="flex-a ju-bt li28">
							<view class="flex-a">
								<u-radio-group v-model="radiovalue1" activeColor="#FE5E10" ><u-radio shape="circle" label="好好吃饭"></u-radio></u-radio-group>
							</view>
							<view class="btn-box flex-a">
								<view class="btn flex">查看</view>
								<view class="btn flex">已开始</view>
							</view>
						</view>
						<view class="flex-a ju-bt li28">
							<view class="flex-a">
								<u-radio-group v-model="radiovalue1" activeColor="#FE5E10"><u-radio shape="circle" label="好好吃饭"></u-radio></u-radio-group> 
							</view>
							<view class="btn-box"><view class="  flex no">未开始</view></view>
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
		return {
			radiovalue1: ''
		};
	},
	methods: {}
};
</script>

<style lang="scss">
.page {
	padding-bottom: 20rpx;

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
			.li28 {
				padding: 28rpx 0;
			}
			.btn-box {
				margin-left: auto;

				font-size: 22rpx;
			}
			.btn {
				color: #fe5e10;
				background: #fff;
				border-radius: 58rpx;
				margin-right: 18rpx;
				padding: 0 8rpx;
				height: 46rpx;
				font-size: 26rpx;
				border: #fe5e10 1rpx solid;
			}

			.no {
				width: 146rpx;
				height: 46rpx;
				background: #d9d9d9;
				color: #ffffff;
				border-radius: 58rpx;
			}
		}
	}
}
</style>
