<template>
	<view class="charts-box">
		<qiun-data-charts
			type="gauge"
			:opts="opts"
			:chartData="chartData"
		/>
	</view>
</template>

<script>
export default {
	props: {
		numberVal: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			chartData: {},
			//您可以通过修改 config-ucharts.js 文件中下标为 ['gauge'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
			opts: {
				color: [
					"#f99",
					'#1890FF',
					'#91CB74',
					'#FAC858',
					'#EE6666',
					'#73C0DE',
					'#3CA272',
					'#FC8452',
					'#9A60B4',
					'#ea7ccc'
				],
				padding: undefined,
				title: {
					name: this.numberVal + '分',
					fontSize: 20,
					color: '#f47920',
					offsetY: 50,
				},
				subtitle: {
					name: '',
					fontSize: 15,
					color: '#666666',
					offsetY: -50
				},
				
				extra: {
					gauge: {
						type: 'default',
						width: 20,
						labelColor: '#666666',
						startAngle: 0.75,
						endAngle: 0.25,
						startNumber: 0,
						endNumber: 100,
						labelFormat: '',
						splitLine: {
							fixRadius: 0,
							splitNumber: 10,
							width: 30,
							color: '#FFFFFF',
							childNumber: 5,
							childWidth: 12
						},
						pointer: {
							width: 24,
							color: 'auto'
						}
					}
				}
			}
		};
	},
	onReady() {
		this.getServerData();
	},
	methods: {
		getServerData() {
			//模拟从服务器获取数据时的延时
			setTimeout(() => {
				//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				let res = {
					categories: [
						{ value: 0.2, color: '#f5453f' },
						{ value: 0.5, color: '#29cb2b' },
						{ value: 0.8, color: '#9a91ed' },
						{ value: 1, color: '#127aff' }
					],
					series: [
						{
							name: '完成率',
							data: this.numberVal / 100
						}
					]
				};
				this.chartData = JSON.parse(JSON.stringify(res));
			}, 500);
		}
	}
};
</script>

<style scoped>
/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
.charts-box {
	width: 400rpx;
	height: 350rpx;
}
</style>
