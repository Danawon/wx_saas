<template>
	<view class="box">
		<view class="charts-box ">
			<uni-ec-canvas
				class="uni-ec-canvas"
				id="line-chart"
				ref="canvas"
				canvas-id="lazy-load-chart"
				:ec="ec"
			></uni-ec-canvas>
		</view>
		<view class="coordinates-list flex-row flex-a">
			<view class="li flex pad-t20" v-for="(item, index) in list" :key="index">
				{{ item }}
			</view>
		</view>
	</view>
</template>
<script>
import uniEcCanvas from '../uni-ec-canvas/uni-ec-canvas.vue';
export default {
	components: {
		uniEcCanvas
	},
	props: {
		chartObj: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			list: [
				'00:00',
				'00:00',
				'00:00',
				'00:00',
				'00:00',
				'00:00',
			],
			ec: {
			 lazyLoad: true,
				option: {
					title: {
						text: ''
					},
					legend: {
						data: ['心率'],
						left: 'center',
						show: true,
						textStyle: {
							color: '#ff8448'
						},
						icon: 'none'
					},
					grid: {
						left: '0%',
						right: '2%',
						top: '3%',
						bottom: '0%',
						containLabel: true
					},
					tooltip: {
						show: true,
						trigger: 'axis'
					},
					xAxis: {
						type: 'category',
						boundaryGap: true,
						show: false
					},
					yAxis: {
						type: 'value',
						// show: false
						gridIndex: 0,
						min: '80'
						// max: '180'
					},
			 	series: [
						{
							name: '心率',
							type: 'line',
							smooth: true,
							showSymbol: false,
							color: '#ff8448',
							data: []
						}
					]
				}
			}
		};
	},
	watch: {
		chartObj: {
			handler(newV, oldV) {
				this.getServerData();
			},
			immediate: false,
			deep: true
		}
	},
	onReady() {},
	methods: {
		getServerData() {
			this.ec.option.series[0].data = this.chartObj.heart_rate;
			this.list = this.chartObj.abscissa
			this.ec.option.yAxis.min =
				Math.min(...this.chartObj.heart_rate) - 5;
			this.$refs['canvas'].init();
		}
	}
};
</script>
<style lang="scss" scoped>
	.coordinates-list {
		padding-left: 50rpx;
		position: relative;
		&::after {
			content: "";
			height: 17rpx;
			width: 1px;
			background-color: #ccc;
			position: absolute;
			top: -15rpx;
			left: 50rpx;
		}
		.li {
			position: relative;
			border-top: 1px solid #ccc;
			width: 16.66%;
			font-size: 26rpx;
			&::after {
				content: "";
				height: 15rpx;
				width: 1px;
				background-color: #ccc;
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
				
			}
		}
	}
.uni-ec-canvas {
	width: 100%;
	height: 100%;
	display: block;
}
/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
.charts-box {
	width: 100%;
	height: 350rpx;
}
</style>
