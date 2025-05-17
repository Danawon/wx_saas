<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="会员打卡数据"></head-nav>

			<!-- 心率表组件 -->
			<heart-rate-chart
				ref="heartRef"
			></heart-rate-chart>
			<view class="pad20 flex ju-bt" v-if="role == 'administrator'">
				<u-button 
					type="primary" 
					text="有氧" 
					shape="circle"
					@click="onOperate('aerobic')"
				></u-button>
				<u-button 
					type="primary" 
					text="力量" 
					shape="circle"
					@click="show = true"
				></u-button>
				<u-button 
					type="primary" 
					text="综合" 
					shape="circle"
					@click="onOperate('unknown')"
				></u-button>
			</view>
			<view class="box padlr20">
				<!-- 条状图 -->
				<view class="" style="margin-top: -40rpx;">
					<strip-chart 
						v-if="data.aerobic_cylinder && data.aerobic_cylinder.length"
						:stripData="data.aerobic_cylinder"
					>
					</strip-chart >
				</view>
				<view class="type-box pad-b15 flex ju-bt" v-if="role != 'administrator'">
					<view class=""></view>
					<view class="exercise-type-txt">
						运动类型: {{ data.type_text }}
					</view>
					<view class="">
						<view 
							class="exercise-type-btn"
							v-if="!data.is_sign" 
							@click="typeShow = true"
						>
							我要修改
						</view>
					</view>
				</view>
				<!-- eartch -->
				<view class="echarts-box pad-b40" v-if="!Array.isArray(data.aerobic_diagram)">
					<echarts-chart :chartObj="data.aerobic_diagram"></echarts-chart>
				</view>
			</view>
			<u-action-sheet 
				:actions="powerList" 
				title="力量类型" 
				:show="show"
				@close="show = false"
				@select="selectPower"
			></u-action-sheet>
			<u-action-sheet
				:actions="typeList" 
				title="运动类型" 
				:show="typeShow"
				@close="typeShow = false"
				@select="selectPower"
			></u-action-sheet>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
// eacharts图表
import echartsChart from '@/pages/admin/pages/components/echartsChart/echartsChart.vue';
// 条状图 组件
import stripChart from '@/components/stripChart/stripChart.vue';
//心率图
import heartRateChart from '@/components/heartRateChart/heartRateChart.vue';
import { againAdminSports } from "@/api/admin.js"
export default {
	components: {
		echartsChart,
		stripChart,
		heartRateChart,
		
	},
	data() {
		return {
			baseUrl: baseUrl,
			data: {},
			role: uni.getStorageSync("role"),
			powerList: [
				{
					name:'力量适应',
					key: "power_adapt"
				},
				{
					name:'力量耐力',
					key: "power_stamina"
				},
				{
					name:'力量塑形',
					key: "power_shape"
				},
				{
					name:'力量肌力',
					key: "power_myodynamia"
				},
				{
					name:'力量爆发',
					key: "power_euption"
				},
			],
			show: false,
			typeList: [
				{
					name:'力量运动',
					key: "power"
				},
				{
					name:'有氧运动',
					key: "aerobic"
				},
				{
					name:'综合运动',
					key: "unknown"
				},
			],
			typeShow: false
		};
	},
	onLoad(eve) {
		this.data = JSON.parse(decodeURIComponent(decodeURIComponent(eve.data)))
		this.$refs.heartRef.getData(this.data, 'adminExamine');
	},
	methods: {
		selectPower(eve) {
			this.onOperate(eve.key);
		},
		onOperate(key) {
			againAdminSports({
				sports_id: this.data.id,
				type: key
			}).then(res => {
				uni.showToast({
					title: res.msg,
				})
				setTimeout(() => {
					uni.navigateBack()
				},1000)
			})
		},
	
		//跳转页面
		jump(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.type-box {
		margin-top: -20rpx;
	}
	.exercise-type-txt {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #BFBFBF;
	}
	.exercise-type-btn {
		background-color: #FC9C6B;
		height: 46rpx;
		border-radius: 28rpx;
		width: 134rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		color: #fff;
		text-align: center;
		line-height: 46rpx;
	}
	/deep/ .u-button {
		width: 25% !important;
		height: 60rpx !important;
	}
.box {
	z-index: 1;
 background: #FFFFFF;
 box-shadow: 0px 0px 20rpx 0px rgba(201,202,202,1);
 border-radius: 10rpx 10rpx 10rpx 10rpx;
}

</style>
