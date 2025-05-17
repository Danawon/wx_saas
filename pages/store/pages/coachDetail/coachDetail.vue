<template>
	<view class="wrap">
		<head-nav title="教练详情" goBack="true"></head-nav>
		<view class="content-box pad20">
			<view class="content">
				<view class="course-head flex-row flex-a">
					<u--image
						:showLoading="true"
						:src="coachInfo.avatar"
						shape="circle"
						width="130rpx"
						height="130rpx"
					></u--image>
					<view
						class="course-name flex-col mar-l20 "
					>
						<view class="name">
							{{ coachInfo.name || '' }}
						</view>
						<view class="levelTxt" v-if="!roleType">
							教练等级：{{ coachInfo.level_text || '' }}
						</view>
						<view class="tag flex-row flex-a">
							<view 
								class="tag-li" 
								v-for="(item, index) in coachInfo.label"
								:key="index"
							>
								{{ item }}
							</view>
						</view>
					</view>
					<!-- </view> -->
			
				</view>
				<u-line margin="40rpx 0"></u-line>
				<view class="self-introduce">
					<view class="introduce-tit flex-row flex-a mar-t20">
						<u--image 
							:showLoading="true" 
							:src="baseUrl + 'self.png'" 
							width="50rpx" 
							height="50rpx" 
						></u--image>
						<view class="tit-txt mar-l20">
							个人介绍
						</view>
					</view>
					<view class="introduce-text white_space_pre-wrap mar-t20">
						{{ coachInfo.info || '' }}
					</view>
				</view>
				<view class="introduce-img flex-row ">
					<view 
						class="img-list mar-b20 mar-r20" 
						v-for="(item, index) in coachInfo.info_image" 
						:key="index"
						@click="previewImage(item)"
					>
						<u--image
							:showLoading="true" 
							:src="item" 
							width="100%" 
							height="370rpx" 
							radius="15rpx"
						></u--image>
					</view>
					
				</view>
				<view class="student-record">
					<view class="student-tit flex-row flex-a mar-t20">
						<u--image 
							:showLoading="true" 
							:src="baseUrl + 'img7.png'" 
							width="45rpx" 
							height="45rpx" 
						></u--image>
						<view class="tit-txt mar-l20">
							学员档案
						</view>
					</view>
					<view class="student-imgs flex-row">
						<view
							class="img-list mar-b20 mar-r20" 
							v-for="(item, index) in coachInfo.case_image" 
							:key="index"
							@click="previewImage(item)"
						>
							<u--image
								:showLoading="true" 
								:src="item" 
								width="100%" 
								height="370rpx" 
								radius="15rpx"
							></u--image>
						</view>
					</view>
					<view class="student-txt white_space_pre-wrap">
						{{ coachInfo.case || '' }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getCoachDetail } from "@/api/storeApis.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 教练数据
			coachInfo: {},
		};
	},
	onLoad(eve) {
		this.roleType = eve.roleType;
		this.getCoachInfo(eve.coachId);
	},
	methods: {
		// 获取教练数据
		getCoachInfo(eve) {
			getCoachDetail({
				id: eve
			}).then(res => {
				this.coachInfo = res.data
			})
		},
		// 预览图片
		previewImage(img) {
			let arr = [img];
			uni.previewImage({
				current: 0, //预览图片的下标
				urls: arr //预览图片的地址，必须要数组形式
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	.white_space_pre-wrap {
		white-space: pre-wrap;
	}
	.student-record {
		.student-txt {
			font-weight: 400;
			color: #999999;
			font-size: 28rpx;
			line-height: 50rpx;
		}
		.student-imgs {
		}
	}
	.tit-txt {
		font-weight: 550;
		color: rgba(32,32,32,0.9000);
		font-size: 35rpx;
	}
	.introduce-img,
	.student-imgs {
		.img-list {
			width: 43%;
		}
		width: 100%;
		margin-top: 50rpx;
		flex-wrap: wrap;
	}
	.self-introduce {
		.introduce-text {
			
			font-weight: 400;
			color: #999999;
			line-height: 50rpx;
			font-size: 30rpx;
		}
	}
.content-box {
	.content {
		.course-head {
			.course-name {
				.tag {
					.tag-li {
						padding: 5rpx 10rpx;
						color: #FE5E10;
						background: rgba(254,94,16,0.1);
						border-radius: 5rpx;
						font-size: 22rpx;
						margin-right: 10rpx;
						
					}
					font-weight: 400;
					color: #999999;
					font-size: 26rpx;
				}
				.levelTxt {
					font-size: 24rpx;
				}
				.name {
					font-weight: bold;
					color: #2f2f2f;
					font-size: 30rpx;
				}
				height: 130rpx;
				justify-content: space-between;
			}
   		}
		padding: 40rpx 20rpx;
		border-radius: 20rpx;
		width: 100%;
		background-color: #fff;
	}
}
.wrap {
	min-height: 100vh;
	background-color: #f9f9f9;
}
</style>
