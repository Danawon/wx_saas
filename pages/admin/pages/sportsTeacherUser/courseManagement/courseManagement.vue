<template>
	<view class="wrap-min">
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="课程管理"
		></head-nav>
		<view class="list">
			<view
				class="li flex-a"
				v-for="(item, index) in list"
				:key="index"
				@click="jump(item)"
			>
				<view class="img-box">
					<u--image
						:src="item.product.image"
						width="260rpx"
						height="200rpx"
					></u--image>
				</view>
				<view class="li-right">
					<view class="flex-a">
						<view class="title text-elpis">
							{{ item.product.title }}
						</view>
				
					</view>
					<view class="">购买用户：{{ item.nickname }}</view>
					<view class="">课程剩余天数：{{ item.shenday }}天</view>
					<view class="">当前进度：已打卡{{ item.task_num }}次</view>

					<view class="icon-box">
						<u-icon
							name="arrow-right"
							color="#999"
							size="34rpx"
						></u-icon>
					</view>
				</view>
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
import { aerobicCourseList } from '@/api/sportsTeacher.js';
import { baseUrl } from '@/utils/baseUrl.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			current: 1,
			list: []
		};
	},
	onLoad() {
		this.getAerobicCourseList();
	},
	onReachBottom() {
		this.current++;
		this.getAerobicCourseList();
	},
	methods: {
		// 获取
		getAerobicCourseList() {
			aerobicCourseList({
				page: this.current,
				list_rows: 20
			}).then(res => {
				this.list = [...this.list, ...res.data.data];
			});
		},
		//跳转页面
		jump(e) {
			uni.navigateTo({
				url: `/pages/admin/pages/sportsTeacherUser/taskList/taskList?id=${e.id}&uid=${e.uid}`
			});
		}
	}
};
</script>

<style lang="scss">
.list {
	// background-color: #f5f5f5;
	// height: 100vh;
	padding: 20rpx 0;

	.li {
		width: 100%;
		background-color: #fff;
		padding: 20rpx 26rpx 30rpx;
		font-size: 28rpx;
		font-size: 24rpx;
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
		}
	}
}
</style>
