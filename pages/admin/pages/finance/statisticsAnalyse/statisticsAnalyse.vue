<template>
	<view>
		<head-nav
			title="统计分析报表"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="list pad20" v-for="(listItem, listK) in list" :key="listK">
			<view class="title flex martb20">{{ listItem.title }}</view>
			<view class="li pad40 mar-t20 flex-row ju-ar flex-a" v-for="(item, index) in listItem.arr" :key="index">
				<view class="lable">{{ item.tit }}</view>
				<view
					class="li-item flex-col flex-a"
					v-for="(kIiem, kIndex) in item.list"
					:key="kIndex"
				>
					<view class="val-sty">{{ kIiem.num }}</view>
					<view class="val-tit mar-t20">{{ kIiem.lable }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { statisticsAnalyseList } from "@/api/finance.js"
export default {
	data() {
		return {
			list: [
				{
					title: "课程收入",
					arr: [
						{
							tit: "私教课",
							list: [
								{
									lable: "本周收入",
									num: "73"
								},
								{
									lable: "本月收入",
									num: "17373"
								},
								{
									lable: "年收入",
									num: "73"
								},
							]
						},
						{
							tit: "自习课",
							list: [
								{
									lable: "本周收入",
									num: "73"
								},
								{
									lable: "本月收入",
									num: "17373"
								},
								{
									lable: "年收入",
									num: "73"
								},
							]
						},
						{
							tit: "团课",
							list: [
								{
									lable: "本周收入",
									num: "73"
								},
								{
									lable: "本月收入",
									num: "17373"
								},
								{
									lable: "年收入",
									num: "73"
								},
							]
						},
					],
				},	
				{
					title: "会员卡收入",
					arr: [
						{
							tit: "私教课",
							list: [
								{
									lable: "本周收入",
									num: "73"
								},
								{
									lable: "本月收入",
									num: "17373"
								},
								{
									lable: "年收入",
									num: "73"
								},
							]
						},{
							tit: "自习课",
							list: [
								{
									lable: "本周收入",
									num: "73"
								},
								{
									lable: "本月收入",
									num: "17373"
								},
								{
									lable: "年收入",
									num: "73"
								},
							]
						},{
							tit: "团课",
							list: [
								{
									lable: "本周收入",
									num: "73"
								},
								{
									lable: "本月收入",
									num: "17373"
								},
								{
									lable: "年收入",
									num: "73"
								},
							]
						},
					],
				},
			]
		};
	},
	onLoad() {
		this.getStatisticsAnalyseList();
	},
	methods: {
		// 获取
		getStatisticsAnalyseList() {
			statisticsAnalyseList().then(res => {
				let data = res.data
				// 私教课
				this.list[0].arr[0].list[0].num = data.course.private_teaching_money_7day
				this.list[0].arr[0].list[1].num = data.course.private_teaching_money_1month
				this.list[0].arr[0].list[2].num = data.course.private_teaching_money_1year
				// 自习课
				this.list[0].arr[1].list[0].num = data.course.autonomous_class_money_7day
				this.list[0].arr[1].list[1].num = data.course.autonomous_class_money_1month
				this.list[0].arr[1].list[2].num = data.course.autonomous_class_money_1year
				// 团课
				this.list[0].arr[2].list[0].num = data.course.league_class_money_7day
				this.list[0].arr[2].list[1].num = data.course.league_class_money_1month
				this.list[0].arr[2].list[2].num = data.course.league_class_money_1year
				// 会员卡
				
				// 私教课
				this.list[1].arr[0].list[0].num = data.membercard.private_teaching_money_7day
				this.list[1].arr[0].list[1].num = data.membercard.private_teaching_money_1month
				this.list[1].arr[0].list[2].num = data.membercard.private_teaching_money_1year
				// 自习课
				this.list[1].arr[1].list[0].num = data.membercard.autonomous_class_money_7day
				this.list[1].arr[1].list[1].num = data.membercard.autonomous_class_money_1month
				this.list[1].arr[1].list[2].num = data.membercard.autonomous_class_money_1year
				// 团课
				this.list[1].arr[2].list[0].num = data.membercard.league_class_money_7day
				this.list[1].arr[2].list[1].num = data.membercard.league_class_money_1month
				this.list[1].arr[2].list[2].num = data.membercard.league_class_money_1year
			})
		},
	}
};
</script>

<style lang="scss" scoped>
.li {
	.li-item {
		.val-tit {
			font-weight: 400;
			color: rgba(0, 0, 0, 0.6);
			font-size: 22rpx;
		}
		.val-sty {
			font-weight: 500;
			color: rgba(0, 0, 0, 0.9);
			font-size: 40rpx;
		}
	}
	.lable {
		font-weight: 600;
		color: rgba(0, 0, 0, 0.9);
		font-size: 28rpx;
	}
	border-radius: 20rpx;
	background-color: #ffeee5;
}
.title {
	font-weight: 600;
	color: rgba(0, 0, 0, 0.9);
	font-size: 32rpx;
}
</style>
