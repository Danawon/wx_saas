<template>
	<view class="">
		<!-- 查看分组数据 -->
			<view class="date-box  flex-a ju-bt padlr20">
				<view class="data-title">查看日期：</view>
				<view class="date-picker flex-row ju-ar">
					<view class="picker-start pad-l20 flex" @click="onPickerDate('start')">
						{{ startDate || '开始日期' }}
					</view>
					<view class="picker-scope flex">
						至
					</view>
					<view class="picker-end pad-l20 flex" @click="onPickerDate('end')">
						{{ endDate || '结束日期' }}
					</view>
					<view class="clear-btn" @click="resetDate" v-if="startDate || endDate">
						<u-icon name="close-circle-fill" size="34rpx"></u-icon>
					</view>
				</view>
			</view>
		<view class="mar-t20" v-if="chartState">
			<qiun-data-charts
				type="line"
				:opts="opts"
				:chartData="chartData"
			/>
		</view>
		
		<!-- 查看详细数据 -->
		<view class="pad20 table-box" >
			<view class="title flex">
				详细数据
			</view>
			<view class="mar-t20">
				<view class="box-tr flex-row flex-a">
					<view class="tr flex">
						会员列表
					</view>
					<view class="tr flex-row flex-a flex-j" @click="sortChange('original')">
						原始值
						<u-icon name="arrow-down-fill"  size="16"></u-icon>
					</view>
					<view class="tr flex-row flex-a flex-j" @click="sortChange('present')">
						当前值
						<u-icon name="arrow-down-fill"  size="16"></u-icon>
					</view>
					<view class="tr flex-row flex-a flex-j" @click="sortChange('differ')">
						变化值
						<u-icon name="arrow-down-fill"  size="16"></u-icon>
					</view>
				</view>
				<view 
					class="box-td flex-row flex-a"
					v-for="(item, index) in tableList"
					:key="index"
				>
					<view class="td flex">
						{{ item.nickname }}
					</view>
					<view class="td flex">
						{{ item.original }}
					</view>
					<view class="td flex">
						{{ item.present }}
					</view>
					<view class="td flex">
						{{ item.differ }}
					</view>
		
				</view>
			</view>
			<u-empty
				v-if="!tableList.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>
		
		<u-empty
			v-if="!chartState"
			mode="list"
			text="暂无数据..."
		></u-empty>
		<u-datetime-picker
			:show="pickerShow"
			v-model="pickerVal"
			mode="year-month"
			@confirm="dateChange"
			@close="pickerShow = false"
			@cancel="pickerShow = false"
			:closeOnClickOverlay="true"
		></u-datetime-picker>
	</view>
</template>

<script>
import { storeDataDisplay, groupingList } from '@/api/admin.js';
import { timestampToTime } from '@/utils/util.js';
export default {
	data() {
		return {
			chartData: {},
			//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
			opts: {
				color: [
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
				padding: [15, 10, 0, 15],
				legend: {},
				xAxis: {
					disableGrid: true
				},
				yAxis: {
					gridType: 'dash',
					dashLength: 2
				},
				extra: {
					line: {
						type: 'straight',
						width: 2
					}
				}
			},
			startDate: "", // 开始日期
			endDate: "", // 结束日期
			prckerType: "", // 选择日期类型
			pickerShow: false, 
			pickerVal: Number(new Date()), // 选中日期
			chartState: false,
			storeId: '', // 门店id
			field: "", 
			sort: '', // 排序类型
			tableList: [],
			sortType: false,
			current: 1, // 当前页
		}
	},
	methods: {
		/* 排序改变 */
		sortChange(e) {
			if(this.sort == e) {
				this.sortType  = !this.sortType
			}else {
				this.sortType  = false;
			}
			this.sort = e;
			this.current = 1;
			this.tableList = [];
			this.getGroupingList();
		},
		/* 选择日期 */
		onPickerDate(type) {
			this.prckerType = type;
			this.pickerShow = true;
		},
		/* 重置日期 */
		resetDate() {
			this.startDate = '';
			this.endDate = ''
			this.current = 1;
			this.tableList = [];
			this.getGroupingList();
			this.getStoreDataDisplay();
		},
		/* 分页 */
		changePage() {
			this.current ++ 
			this.getGroupingList();
		},
		/* 获取门店你分组 */
		getGroupingList() {
			groupingList({
				type: this.field,
				store_id: this.storeId,
				time: this.startDate && this.endDate ? `${this.startDate},${this.endDate}` : '',
				list_rows: 10,
				page: this.current,
				order: `${this.sortType ? 'asc' : 'desc'}` ,
				order_field: `${this.sort}`
			}).then(res => {
				this.tableList= [...this.tableList, ...res.data.data]
			})
		},
		// 选中发布日期
		dateChange(eve) {
			let date = `${timestampToTime(eve.value / 1000).split(' ')[0].split("-")[0]}-${timestampToTime(eve.value / 1000).split(' ')[0].split("-")[1]}`
			if(this.prckerType === 'start') {
				this.startDate = date;
			}else {
				this.endDate = date;
			}
			if(this.startDate && this.endDate) {
				this.getStoreDataDisplay();
				this.current = 1;
				this.tableList = [];
				this.getGroupingList();
			}
			this.pickerShow = false;
		},
		/* 获取门店分组信息 */
		getStoreDataDisplay(field, storeId) {
			this.storeId = storeId ?? this.storeId;
			this.field = field ?? this.field
			storeDataDisplay({
				type: this.field,
				store_id: this.storeId,
				time: this.startDate && this.endDate ? `${this.startDate},${this.endDate}` : ''
			}).then(res => {
				this.setData(res);
				/* 应后端要求请求两次 */
				this.getGroupingList();
			})
		},
		setData(res) {
			let scope =
				res.data.categorize[0] +
				' - ' +
				res.data.categorize[0];
			
			if (res.data.data.length) {
				let data = {
					categories: res.data.categorize,
					series: [
						{
							name: scope,
							data: [
								res.data.data[0].data,
								res.data.data[1].data
							]
						}
					]
				};
				this.chartData = JSON.parse(
					JSON.stringify(data)
				);
				this.chartState = true;
			} else {
				this.chartState = false;
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.charts-box {
	width: 700rpx;
	height: 350rpx;
}
.table-box {
	font-size: 26rpx;
	.box-td {
		.td {
			border-bottom: 1px solid #ccc;
		}
	}
	.box-tr, .box-td {
		.tr, .td {
			width: 25%;
			height: 55rpx;
		}
	}
	.title {
		background-color: #f1f1f1;
		border-radius: 8rpx;
		height: 60rpx;
	}
}
.date-box {
	.data-title {
		width: 25%;
	}
	.date-picker {
		.clear-btn {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 10rpx;
		}
		.picker-start,
		.picker-end {
			width: 45%;
			height: 55rpx;
		}
		.picker-scope {
			width: 10%;
		}
		border-radius: 8rpx;
		font-size: 24rpx;
		border: 1px solid #ccc;
		width: 75%;
		position: relative;
	}
}
</style>