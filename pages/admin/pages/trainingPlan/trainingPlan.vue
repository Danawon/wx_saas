<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="训练计划模板"></head-nav>
		<view class="page">
			<view class="top-btn flex" @click="jump">选择训练计划模板</view>

			<view class="page-list mar-b20" v-for="(item, index) in list" :key="index">
				<view class="page-li mar-b20 mar-l20 mar-r20 flex-a">
					<view class="li-l">
						<view class="title text-elpis">{{ item.title }}</view>
						<view class="msg text-elpis">已设置课程x个，共x个计划</view>
					</view>
					<view class="li-r">
						<view class="release btn flex">发布</view>
						<view class="edit btn flex">编辑</view>
					</view>
				</view>
			</view>
			
			<u-empty
				v-if="!list.length"
				mode="list"
				text="暂无数据..."
			></u-empty>

			<view class="sub flex">提交</view>
		</view>
	</view>
</template>

<script>
	import { trainingProgramList } from "@/api/storeApis.js"
export default {
	data() {
		return {
			current: 1,
			list: [],
		};
	},
	onLoad() {
		this.getTrainingProgramList();
	},
	onReachBottom() {
		this.current ++ 
		this.getTrainingProgramList();
	},
	methods:{
		// 获取训练计划模板
		getTrainingProgramList() {
			trainingProgramList({
				page: this.current,
				list_rows:20,
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			})
		},
		jump(){
			uni.navigateTo({
				url:'/pages/admin/pages/trainingPlanTpl/trainingPlanTpl'
			})
		}
	}
};
</script>

<style lang="scss">
.page {
	padding: 36rpx 26rpx;
	background-color: #f9f9f9;
	height: 100vh;

	.top-btn {
		height: 80rpx;
		background: #fe5e10;
		border-radius: 8rpx;
		margin-bottom: 30rpx;
		color: #ffffff;
		font-weight: 500;
		font-size: 28rpx;
	}

	.sub {
		position: absolute;
		bottom: 70rpx;
		left: 50%;
		width: 90%;
		height: 74rpx;
		border-radius: 46rpx;
		transform: translateX(-50%);
		font-size: 32rpx;
		color: #fe5e10;
		border: 2rpx solid #fe5e10;
	}

	.page-list {
		// padding-bottom: 150rpx;
		.page-li {
			background: #ffffff;
			border-radius: 24rpx;

			.title {
				font-size: 32rpx;
				font-weight: 600;
				padding: 40rpx 20rpx 0 24rpx;
			}

			.msg {
				font-size: 22rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.6);
				padding: 42rpx 20rpx 54rpx 24rpx;
			}
			.li-r {
				margin-left: auto;
				margin-right: 24rpx;
			}

			.btn {
				height: 60rpx;
				font-size: 28rpx;
				border-radius: 42rpx;
				width: 164rpx;
				color: rgba(0, 0, 0, 0.4);
				border: 1px solid rgba(0, 0, 0, 0.4);
				margin-bottom: 10rpx;
			}
			.release {
				color: #fe5e10;
				border: 1px solid #fe5e10;
			}
		}
	}
}
</style>
