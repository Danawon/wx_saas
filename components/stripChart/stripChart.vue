<template>
	<view class="wrap">
		<view class="chart-box mar-t40 padtb20">
			<view class="chart5 chart flex-row flex-a martb20" v-for="(item, index) in stripData" :key="index">
				<view class="tit">
					{{ item.name }}
				</view>
				<view class="line-box">
					<view class="line1 line" :style="'width:' + item.percentage +'%;'" v-if="item.field == 'low'"></view>
					<view class="line2 line" :style="'width:' + item.percentage +'%;'" v-if="item.field == 'm_low'"></view>
					<view class="line3 line" :style="'width:' + item.percentage +'%;'" v-if="item.field == 'medium'"></view>
					<view class="line4 line" :style="'width:' + item.percentage +'%;'" v-if="item.field == 'm_high'"></view>
					<view class="line5 line" :style="'width:' + item.percentage +'%;'" v-if="item.field == 'm_high+'"></view>
					<view class="line6 line" :style="'width:' + item.percentage +'%;'" v-if="item.field == 'high'"></view>
					
				</view>
				<view class="numerical">
					{{ item.minute || ""}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"stripChart",
		props: {
			stripData: {
				type: Array,
				default: {}
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.chart-box {
	.chart {
		.numerical {
			width: 13%;
			font-size: 26rpx;
			font-weight: 400;
		}
		.line-box {
			.line {
				border-radius: 20rpx;
				opacity: 1;
				height: 100%;
			}
			.line1 {
				background: #17c816;
				
			}
			.line2 {
				background-color: #86dd2c;
			}
			.line3 {
				background-color: #fdcb2e;
			}
			.line4 {
				background-color: #fd9b20;
			}
			.line5 {
				background-color: #ff6d10;
			}
			.line6 {
				background-color: #f5561f;
			}
			width: 65%;
			height: 17rpx;
			border-radius: 20rpx;
			background: rgba(255,225,210,0.5000);
		}
		.tit {
			width: 18%;
			font-weight: 400;
			color: #999999;
			font-size: 25rpx;
		}
		justify-content: space-between;
		width: 100%;
		color: #000000;
	}
	// width: 100%;
	
}
</style>