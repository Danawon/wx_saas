<template>
	<view>
		<!-- 心率数据模块 -->
		<view class="heartRate-box ">
			<view
				class="heartRateBg"
				:style="{
					background:
						'url(' + baseUrl + 'heartRateIcon.png)',
					'background-size': '100% 100% '
				}"
			>
				<!-- 心率检测模块 -->
				<view class="heart-num flex-col flex-a">
					<view class="num-val">{{ dataInfo.heart_rate }}</view>
					<view class="num-tit mar-t20">平均心率</view>
				</view>

				<!-- 消耗热量模块 -->
				<view class="calories-box comon-abs ">
					<view class="val-box flex mar-t20">
						<view class="vale">{{ dataInfo.calories }}</view>
					</view>
					<view class="tit flex ">卡路里</view>
				</view>

				<!-- 运动时间模块 -->
				<view class="times-box comon-abs ">
					<view class="val-box flex mar-t20">
						<view class="vale">{{ dataInfo.length_time }}</view>
					</view>
					<view class="tit flex ">分钟</view>
				</view>
				<view
					class="distanceAndSpeed heart-other flex-row ju-bt"
				>
					<view class="distance">
						<view class="tit">运动距离</view>
						<view class="val-box flex-row flex-a ">
							<view class="vale">{{ dataInfo.distance }}</view>
							<view class="unit">km</view>
						</view>
					</view>
					<view class="speed">
						<view class="tit">运动速度</view>
						<view class="val-box flex-row flex-a ">
							<view class="vale">{{ dataInfo.speed }}</view>
							<view class="unit">km/H</view>
						</view>
					</view>
				</view>

				<view class="heart-other flex-row ju-ar">
					<view class="other-item">
						<view class="tit">燃烧脂肪</view>
						<view class="val-box flex-row flex-a ">
							<view class="vale">{{ dataInfo.burn_fat }}</view>
							<view class="unit">克</view>
						</view>
					</view>
					<view class="other-item">
						<view class="tit">最大心率</view>
						<view class="val-box flex-row flex-a ">
							<view class="vale">{{ dataInfo.max_heart_rate || 0 }}</view>
							<view class="unit"></view>
						</view>
					</view>
					<view class="other-item">
						<view class="tit">最小心率</view>
						<view class="val-box flex-row flex-a ">
							<view class="vale">{{ dataInfo.min_heart_rate || 0 }}</view>
							<view class="unit"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';

export default {
	name: 'heartRateChart',
	components: {},
	data() {
		return {
			baseUrl: baseUrl,
			dataInfo: {}, 
			type: "", // 类型判断 是有氧还是力量
		};
	},
	onReady() {},
	methods: {
		/* 获取父级页面数据 */
		getData(e, type) {
			this.dataInfo = e;
			/* 
			 type -> clockIn 我要打卡 页面
			 */
			this.type = type;
		},
	},
};
</script>

<style lang="scss" scoped>
.times-box {
	right: 82rpx;
	.tit {
		margin-right: 25rpx;
	}
}
.calories-box {
	left: 85rpx;
	.tit {
		margin-left: 25rpx;
	}
}
.comon-abs {
	.val-box {
		color: #fff;
		font-size: 40rpx;
		font-weight: bold;
	}
	.tit {
		font-size: 20rpx;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.9);
		margin-top: 32rpx;
	}
	width: 115rpx;
	height: 115rpx;
	position: absolute;
	top: 179rpx;
}

.heartRate-box {
	.heartRateBg {
		.calories-tips {
			position: absolute;
			bottom: 100rpx;
			left: 50%;
			transform: translateX(-50%);
			color: #fff;
			font-size: 25rpx;
		}
		.distanceAndSpeed {
			top: 35rpx;
			padding: 0 90rpx;
		}
		.heart-num {
			.num-tit {
				font-size: 20rpx;
				font-weight: 300;
				color: rgba(255, 255, 255, 0.9);
			}
			.num-val {
				font-size: 64rpx;
				font-weight: bold;
			}
			position: absolute;
			left: 320rpx;
			top: 180rpx;
			color: #fff;
			width: 120rpx;
			height: 120rpx;
		}
		.heart-other {
			.other-item {
				.tit {
					text-align: center;
				}
				width: 33.33%;
			}
			.val-box {
				.unit {
					font-size: 20rpx;
					color: rgba(255, 255, 255, 0.9);
					margin-left: 5rpx;
				}
				marign-top: 12rpx;
				justify-content: center;
			}
			.tit {
				font-size: 26rpx;
			}
			position: absolute;
			bottom: 90rpx;
			left: 0;
			width: 100%;
			color: #fff;
		}
		position: relative;
		height: 610rpx;
	}
}
</style>
