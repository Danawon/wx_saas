<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="课程打卡管理"></head-nav>
		<view class="list">
			<view class="li flex-a" v-for="(item, index) in list" :key="index" @click="jump('/pages/admin/pages/dietitian/taskList/taskList?id='+item.id)">
				<view class="img-box"><u--image :src="item.product.image" width="260rpx" height="200rpx"></u--image></view>
				<view class="li-right">
					<view class="flex-a">
						<view class="title text-elpis">{{item.product.title}}</view>
						<!-- <view class="tip ">v1.0</view> -->
					</view>
					<view class="">购买用户：{{item.nickname}}</view>
					<view class="">课程剩余天数：{{item.shenday || 0}}天</view>
					<view class="">当前进度：已打卡{{item.task_num || 0}}次</view>

					<view class="icon-box"><u-icon name="arrow-right" color="#999" size="34rpx"></u-icon></view>
				</view>
			</view>
			<u-empty v-if="!list.length" mode="list"></u-empty>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { nutritionList } from '@/api/dietician.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			last_page: 0,
			params: {
				list_rows: 20, //条数
				page: 1 //页码
			},
			list: []
		};
	},
	onShow() {
		this.params.page = 1;
		this.list = [];
		this.init();
	},
	onPullDownRefresh() {
		if (this.params.page < this.last_page) {
			this.params.page++;
			this.init();
		}
	},
	methods: {
		//跳转页面
		jump(url) {
			uni.navigateTo({
				url: url
			});
		},
		init() {
			nutritionList(this.params).then(res => {
				this.last_page = res.data.last_page;
				this.list = res.data.data; 
			});
		}
	}
};
</script>

<style lang="scss">
.list {
	background-color: #f5f5f5;
	height: 100vh;
	padding: 20rpx 0;

	.li {
		width: 100%;
		background-color: #fff;
		padding: 20rpx 26rpx 30rpx;
		font-size: 28rpx;
		font-size: 24rpx;
		margin-bottom: 30rpx;
		font-weight: 300;
		color: #999999;
		border-bottom: #999999 solid #ccc;
		line-height: 48rpx;
		.li-right {
			width: 60%;
			position: relative;
			margin-left: 15rpx;

			.icon-box {
				position: absolute;
				right: 0rpx;
				top: 50%;
				transform: translateY(-50%);
			}

			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #202020;
			}
			.tip {
				color: #fe5e10;
				border: #fe5e10 1rpx solid;
				border-radius: 10rpx;
				padding: 0 10rpx;
				font-size: 22rpx;
			}
		}
	}
}
</style>
