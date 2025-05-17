<template>
	<view class="">
		<view class="block">
			<view
				class="block-li flex-col flex-a mar-t40"
			>
				<!-- 热身 -->
				<view
					v-if="courseData.field == 'warm_up'"
					class="block-head"
					:style="
						'background:url(' +
							baseUrl +
							'block4.png);background-size: 100% 100%;'
					"
				></view>
				<!-- 力量 -->
				<view
					class="block-head"
					v-if="
						courseData.field == 'strength_training'
					"
					:style="
						'background:url(' +
							baseUrl +
							'block1.png);background-size: 100% 100%;'
					"
				></view>
				<!-- 拉伸 -->
				<view
					class="block-head"
					v-if="courseData.field == 'stretching'"
					:style="
						'background:url(' +
							baseUrl +
							'block3.png);background-size: 100% 100%;'
					"
				></view>
				<view class="block-info padlr40 ">
					<view
						class="info-li pad-t20"
						v-for="(item, index) in courseData.group"
						:key="index"
					>
						<view
							class="li-top flex-row flex-a ju-bt"
						>
							<view class="top-l flex-row flex-a">
								<view class="l-tit">
									{{ item.title }}
								</view>
								<view
									class="l-tips flex-row flex-a mar-l20"
									@click="tipsFun(item)"
									v-if="item.motion_tips"
								>
									<u--image 
										:showLoading="true" 
										:src="baseUrl + 'tips.png'" 
										width="30rpx" 
										height="30rpx" 
									></u--image>
									<view
										class="tips-tit"
									>
										注意事项
									</view>
								</view>
							</view>
							<view
								class="top-r   flex-row flex-a"
								@click="goVideo(item)"
								v-if="item.video_url"
								:class="[
									{
										'videoTit-1':
											courseData.field ==
											'stretching'
									},
									{
										'videoTit-2':
											courseData.field ==
											'strength_training'
									},
									{
										'videoTit-3':
											courseData.field ==
											'warm_up'
									}
								]"
							>
								<view class="r-icon">
									<u--image
										:showLoading="true"
										:src="
											baseUrl +
												'block9.png'
										"
										v-if="
											courseData.field ==
												'stretching'
										"
										width="30rpx"
										height="30rpx"
										mode="scaleToFill"
									></u--image>
									<u--image
										:showLoading="true"
										:src="
											baseUrl +
												'block7.png'
										"
										v-if="
											courseData.field ==
												'strength_training'
										"
										width="30rpx"
										height="30rpx"
										mode="scaleToFill"
									></u--image>
									<u--image
										:showLoading="true"
										:src="
											baseUrl +
												'block6.png'
										"
										v-if="
											courseData.field ==
												'warm_up'
										"
										width="30rpx"
										height="30rpx"
										mode="scaleToFill"
									></u--image>
								</view>
								<view class="r-tit  mar-l20">
									视频指导
								</view>
							</view>
						</view>
						<view
							class="li-bom flex-row flex-a  martb20"
						>
							<view
								class="bom-tag flex-row flex-a mar-b20"
								v-for="(tagItem,
								tagIndex) in item.groupnum"
								:key="tagIndex"
								:class="[tagItem.name.type == 'count' || tagItem.name.type == 'second' ? 'w25' : 'w33']"
							>
								<view
									class="tag-serial flex"
								>
									{{ tagIndex + 1 }}
								</view>
								<view class="tag-val flex-row " v-if="tagItem.name.load">
									<view class="">
										{{ tagItem.name.load }}
									</view>
									<view class="unit">
										kg
									</view>
								</view>
								<view
									class="tag-val flex-row "
									v-if="tagItem.name.type == 'second' || tagItem.name.type == 'countAndSecond'"
								>
									<view class="">
										<text v-if="tagItem.name.load">×</text>{{ tagItem.name.second }}
									</view>
									<view class="unit">
										秒
									</view>
								</view>
								
								<view
									class="tag-val flex-row "
									v-if="tagItem.name.type == 'count' || tagItem.name.type == 'countAndSecond'"
								>
									<view class="">
										<text v-if="tagItem.name.load">×</text>{{ tagItem.name.num }}
									</view>
									<view class="unit">个</view>
								</view>
								
							</view>
							
							<view class="rest-box" v-if="item.rest_among">
								组间休息： {{ item.rest_among }}秒
							</view>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			:showCancelButton="false"
			confirmText="知道了"
			confirmColor="#FE5E10"
			@parentConfirm="modalConfirm"
			title="运动温馨小提示"
		>
			<view class="modalTxt pad-b40 ">
				{{ contentTips }}
			</view>
		</modal-tips>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
// modal弹框
import modalTips from '@/components/modalTips/modalTips.vue';
export default {
	components: {
		modalTips: modalTips
	},
	props: {
		// 课程信息
		courseData: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			baseUrl: baseUrl,
			// modal弹框
			modalShow: false,

			contentTips: '' // 注意事项
		};
	},
	onReady() {
		setTimeout(() => {
		}, 300);
	},
	watch: {},
	methods: {
		/* 点击注意事项 */
		tipsFun(e) {
			this.contentTips = e.motion_tips;
			this.modalShow = true 
		},
		goVideo(eve) {
			this.$emit('goVideo', eve.id);
		},
		// 点击弹框确定
		modalConfirm() {
			this.modalShow = false;
		}
	}
};
</script>

<style lang="scss" scoped>
	.rest-box {
		width: 100%;
		font-size: 22rpx;
		padding-left: 35rpx;
	}
.scan-btn {
	background: rgba(251, 217, 201, 0.4);
	border-radius: 20rpx;
	height: 100rpx;
	box-shadow: 0rpx 0rpx 20rpx 8rpx #fbd9c9;
	font-weight: 400;
	color: #fe5e10;
	font-size: 32rpx;
}
.videoTit-1 {
	.r-tit {
		color: #2bc2d1 !important;
	}
	border: 1px solid #2bc2d1 !important;
}
.videoTit-2 {
	.r-tit {
		color: #8ac43f !important;
	}
	border: 1px solid #8ac43f !important;
}
.videoTit-3 {
	.r-tit {
		color: #857be7 !important;
	}
	border: 1px solid #857be7 !important;
}
.start-btnBox {
	margin-top: 50rpx;
	.btn-txt {
		margin-left: 10rpx;
	}
}
.block {
	.block-info {
		.info-li {
			.li-bom {
				.bom-tag {
					.unit {
						font-size: 18rpx;
					}
					.tag-val {
						font-size: 24rpx;
						
						align-items: flex-end;
					}
					.tag-serial {
						width: 25rpx;
						height: 30rpx;
						background-color: #f8f8f8;
						font-size: 18rpx;
						color: #959595;
						border-radius: 8rpx;
						margin-right: 10rpx;
					}
					flex-shrink: 0; //子元素添加
					color: #333;
					// width: 33.33%;
				}
				.w33 {
					width: 33.33%;
				}
				.w25 {
					width: 25%;
				}
				flex-wrap: wrap;
			}
			.li-top {
				.top-r {
					.r-tit {
						color: #857be7;
						font-size: 24rpx;
					}
					padding: 8rpx 16rpx;
					border-radius: 10rpx;
					border: 1px solid #857be7;
				}
				.top-l {
					.l-tips {
						.tips-tit {
							color: #fcaf17;
							font-size: 20rpx;
							margin-left: 10rpx;
						}
						border-radius: 8rpx;
						padding: 4rpx 15rpx;
					}
					.l-tit {
						font-weight: 600;
						color: #202020;
						font-size: 28rpx;
					}
				}
			}
		}
		background: #ffffff;
		box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.25);
		border-radius: 24rpx;
		width: 100%;
		margin-top: -40rpx;
		padding-top: 40rpx;
	}
	.block-head {
		width: 70%;
		height: 85rpx;
		z-index: 99;
	}
	width: 100%;
}
</style>
