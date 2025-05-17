<template>
	<view>
		<head-nav
			title="视频讲解"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="video-box">
			<video
				id="myVideo"
				:poster="videoInfo.video_image"
				:src="videoInfo.video_url"
				controls
				object-fit="fill"
				objectFit="contain"
				:loop="true"
				@fullscreenchange="fullscreenchange"
				@play="playVideo"
			></video>
		</view>
		<view class="box-list pad20">
			<view class="tit-txt">{{ videoInfo.title }}</view>
			<u-line margin="20rpx 0"></u-line>
			<view class="ll-box">
				<view class="list">
					<u-parse :content="videoInfo.video_content"></u-parse>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getVideoExplain } from '@/api/myCenter.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			videoInfo: [], // 视频数据
			courseId: '' ,// 课程id
			videoContext: "", // 视频控件
		};
	},
	onLoad(eve) {
		this.courseId = eve.courseId;
		this.getVideoExplainFun();
	},
	methods: {
		/* 全屏开始播放视频 */
		playVideo(e) {
			/* 视频全屏播放 */
			this.videoContext = uni.createVideoContext(e.currentTarget.id,this);
			this.videoContext.requestFullScreen();
		},
		/* 退出全屏暂停播放 */
		fullscreenchange (e){
		   if(!e.detail.fullScreen){
		      this.videoContext.pause()
		   }
		},
		// 获取视频指导
		getVideoExplainFun() {
			getVideoExplain({
				id: this.courseId
			}).then(res => {
				this.videoInfo = res.data;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.list:not(:first-child) {
	margin-top: 60rpx;
}

.list-li {
	.li {
		.li-val {
			font-weight: 400;
			color: #999999;
			font-size: 28rpx;
			width: 93%;
			line-height: 50rpx;
		}
		.li-circle {
			.circle {
				background: #202020;
				border-radius: 50%;
				height: 16rpx;
				width: 16rpx;
			}
			padding-top: 17rpx;
			width: 6%;
		}
	}
}
.tit {
	font-weight: 600;
	color: #202020;
	font-size: 28rpx;
}
.tit-txt {
	font-weight: 600;
	color: #202020;
	font-size: 36rpx;
}
#myVideo {
	width: 100%;
	height: 100%;
}
.video-box {
	width: 100%;
	height: 500rpx;
	background-color: #f99;
}
</style>
