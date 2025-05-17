<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="发布团课"
		></head-nav>
		<view class="page padtb20 padlr40">
			<view class="title pad-b40">选择日期</view>
			<view class="date-box flex-a">
				<view
					class="top-li flex-col flex"
					v-for="(item, index) in dateList"
					:key="index"
					:class="{ on: navIndex == index }"
					@click="selectDateFun(item, index)"
				>
					<text class="fs28">{{ item.name }}</text>
					<text class="fs20">{{ item.date }}</text>
				</view>
			</view>
			<view class="title pad-b40 pad-t40">选择时间</view>
			<view class="time-box pad40 flex-a ju-bt">
				<view
					class="time-btn flex"
					v-for="(item, index) in periodList"
					:key="index"
					@click="selectPeriodFun(item)"
					:class="{ on: selectPeriod == item.id, disabled: item.is_set }"
				>
					{{ item.field }}
				</view>
			</view>

			<view 
				class="btn flex" 
				:class="{disabled: !selectPeriod}" 
				@click="submitFun"
			>确定发布</view>
		</view>
	</view>
</template>

<script>
import { timestampToTime } from "@/utils/util.js";
import { templatePeriod, leagueclassPublish } from "@/api/admin.js"
export default {
	data() {
		return {
			navIndex: 0, //日期选择 inedx
			timeIndex: "", //时间 index
			dateList: [], // 日期列表
			periodList: [], // 时段列表
			templateId: '' ,// 课程模板id
			selectDate: "", // 日期
			selectPeriod: "", // 选中时段
		};
	},
	onLoad(e) {
		this.templateId = e.id; 
		this.selectDate = timestampToTime(new Date().getTime() / 1000).split(" ")[0];
		this.getTemplatePeriod();
	},
	methods: {
		submitFun() {
			if(!this.selectPeriod) {
				return
			}
			leagueclassPublish({
				template_id: this.templateId,
				date: this.selectDate,
				period: this.selectPeriod,
			}).then(res => {
				uni.showToast({
					title:res.msg
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			})
		},
		// 选中时段
		selectPeriodFun(item) {
			if(item.is_set) {
				this.selectPeriod = "";
				return
			}
			this.selectPeriod = item.id;
		},
		// 选中日期
		selectDateFun(item, index) {
			this.navIndex = index;
			this.selectDate = item.new_date
			this.selectPeriod = "";
			this.getTemplatePeriod();
		},
		// 获取时段列表
		getTemplatePeriod() {
			templatePeriod({
				template_id: this.templateId,
				date: this.selectDate
			}).then(res => {
				this.dateList =res.data.date;
				this.periodList =res.data.time;
			})
		},
	}
};
</script>

<style lang="scss">
	.disabled {
		border: none !important;
		color: #999 !important;
		background: #eeeeef !important;
	}
	.date-box {
		flex-wrap: nowrap;
		overflow-x: scroll;
	}
.page {
	.title {
		font-size: 28rpx;
		font-weight: 600;
		color: #202020;
	}

	.fs28 {
		font-size: 28rpx;
		font-weight: 600;
	}
	.fs20 {
		font-size: 20rpx;
		margin-top: 10rpx;
	}
	.top-li {
		width: 20%;
		color: rgba(0, 0, 0, 0.26);
		 flex-shrink: 0;
	}
	.top-li.on {
		color: #000;
	}
	.btn {
		height: 74rpx;
		background: #fe5e10;
		font-size: 32rpx;
		color: #ffffff;
		margin-top: 150rpx;
		border-radius: 54rpx;
	}
	.time-box {
		flex-wrap: wrap;
		padding-top: 0;

		.time-btn {
			width: 40%;
			height: 68rpx;
			font-size: 28rpx;
			border-radius: 8rpx;
			border: 1px solid rgba(0, 0, 0, 0.6);
			color: rgba(0, 0, 0, 0.6);
			margin-bottom: 26rpx;
		}
		.time-btn.on {
			color: #ffffff;
			background: #fe5e10;
			border-color: #fe5e10;
		}
	}
}
</style>
