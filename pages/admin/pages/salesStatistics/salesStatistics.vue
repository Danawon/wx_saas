<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="教练月销售统计"
		></head-nav>
		<view class="page padtb20">
			<view
				class="ipt-box padlr20"
				@click="dateShow = true"
			>
				<u-input
					disabled
					placeholder="请选择"
					border="surround"
					suffixIcon="calendar"
					disabledColor="#fff"
					v-model="selectDate"
				></u-input>
			</view>
			<view class="pad40">
				<view
					class="page-li flex-a"
					v-for="(item, index) in list"
					:key="index"
				>
					<view class="li-left flex">{{ item.title }}</view>
					<view class="li-right   flex-col">
						<text>销售数量：{{ item.num }} </text>
						<text>销售额：{{ item.salePrice }}</text>
					</view>
				</view>
			</view>
		</view>
		<u-datetime-picker
			:show="dateShow"
			v-model="dateVal"
			mode="year-month"
			@confirm="selectDateFun"
			@close="dateShow = false"
			@cancel="dateShow = false"
		></u-datetime-picker>
	</view>
</template>

<script>
import { coachMoneysaleReport } from '@/api/storeApis.js';
import { timestampToTime } from '@/utils/util.js';
export default {
	data() {
		return {
			list: [
				{
					title: '私教卡',
					num: '',
					salePrice: ''
				},
				{
					title: '自习卡',
					num: '',
					salePrice: ''
				},
				{
					title: '团课卡',
					num: '',
					salePrice: ''
				},
				{
					title: '销售总和',
					num: '',
					salePrice: ''
				}
			],
			dateVal: Number(new Date()),
			dateShow: false,
			selectDate: ''
		};
	},
	onLoad() {
		this.getCoachMoneysaleReport();
	},
	methods: {
		// 选中日期
		selectDateFun(eve) {
			this.dateShow = false;
			let data = timestampToTime(eve.value / 1000)
				.split(' ')[0]
				.split('-');
			this.selectDate = data[0] + '-' + data[1];
			this.getCoachMoneysaleReport();
		},
		getCoachMoneysaleReport() {
			coachMoneysaleReport({
				date: this.selectDate
			}).then(res => {
				this.list[0].num = res.data.private_teaching.sale_count
				this.list[0].salePrice = res.data.private_teaching.sale_price
				this.list[1].num = res.data.autonomous_class.sale_count
				this.list[1].salePrice = res.data.autonomous_class.sale_price
				this.list[2].num = res.data.league_class.sale_count
				this.list[2].salePrice = res.data.league_class.sale_price
				this.list[3].num = res.data.total.sale_count
				this.list[3].salePrice = res.data.total.sale_price
			});
		}
	}
};
</script>

<style lang="scss">
.page {
	.page-li {
		height: 200rpx;
		background-color: #fff;
		width: 100%;
		margin-bottom: 20rpx;
	}
	.li-left {
		border-radius: 20rpx 0 0 20rpx;
		width: 198rpx;
		flex-shrink: 0;
		height: 100%;
		background: #ffc8ad;
		margin-right: 10rpx;
	}
	.li-right {
		border-radius: 0 20rpx 20rpx 0;
		flex: auto;
		line-height: 46rpx;
		font-size: 26rpx;
		color: rgba(0, 0, 0, 0.6);
		padding-left: 46rpx;
		padding-top: 40rpx;
		flex-shrink: 0;
		height: 100%;
		background: #ffc8ad;
	}
}
</style>
