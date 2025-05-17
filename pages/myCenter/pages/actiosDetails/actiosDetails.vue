<template>
	<view>
		<head-nav
			title="动作详情"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="video-box">
			<video
				id="myVideo"
				:poster="info.article_images"
				:src="info.video_url"
				controls
				object-fit="fill"
				:loop="true"
				@fullscreenchange="fullscreenchange"
				@play="playVideo"
				objectFit="contain"
			></video>
		</view>
		<!-- objectFit="contain" -->
		<view class="content pad20">
			<view class="tit">
				{{ info.article_title }}
			</view>
			<u-line margin="20rpx 0"></u-line>
			<!-- 描述列表 -->
			<view class="list">
				<u-parse :content="info.article_content"></u-parse>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { actionLibraryDetail } from "@/api/myCenter.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			id: "", // 动作id
			info: {}, // 详情信息
			videoContext: "", // 视频控件
		};
	},
	onLoad(eve) {
		this.id = eve.id;
		this.getActionLibraryDetail();
	},
	onShareAppMessage() {
		return {
			title: this.info.article_title,
			path: `/pages/myCenter/pages/actiosDetails/actiosDetails?id=${this.id}`
		};
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
		// 获取动作库详情
		getActionLibraryDetail() {
			let _this = this;
			actionLibraryDetail({
				id: _this.id
			}).then(res => {
				_this.info = res.data
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	.content {
		.list {
			.li {
				margin-bottom: 10rpx;
			}
			font-weight: 400;
			color: #999999;
			font-size: 28rpx;
			line-height: 45rpx;
		}
		.tit {
			font-weight: bold;
			font-size: 36rpx;
			color: #202020;
		}
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
