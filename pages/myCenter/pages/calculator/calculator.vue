<template>
	<view>
		<head-nav
			title="减脂计算器"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="box pad20">
			<view class="head-box flex ju-bt">
				<view
					class="block-l  block flex-col flex-a pad20"
				>
					<view class="block-tit pad20">当前</view>
					<view
						class="current-weight flex-a flex-j mar-t20"
					>
						<view class="">体重</view>
						<view class="ipt-box marlr20">
							<u--input
								placeholder="请输入"
								border="surround"
								v-model="currentWeight"
								type="number"
								:customStyle="{
									height: '60rpx'
								}"
								color="#fff"
								placeholderStyle="color: #d3d7d4"
							></u--input>
						</view>

						<view class="">KG</view>
					</view>
					<view
						class="current-weight flex-a flex-j  mar-t40"
					>
						<view class="">体脂</view>
						<view class="ipt-box marlr20">
							<u--input
								placeholder="请输入"
								border="surround"
								v-model="currentBodyFat"
								type="number"
								:customStyle="{
									height: '60rpx'
								}"
								color="#fff"
								placeholderStyle="color: #d3d7d4"
							></u--input>
						</view>

						<view class="">%</view>
					</view>
				</view>

				<view
					class="block-r block flex-col flex-a pad20"
				>
					<view class="block-tit pad20">目标</view>
					<view
						class="current-weight flex-a flex-j mar-t20"
					>
						<view class="">体重</view>
						<view class="ipt-box marlr20">
							<u--input
								placeholder="请输入"
								border="surround"
								v-model="targetWeight"
								type="number"
								:customStyle="{
									height: '60rpx'
								}"
								color="#fff"
								placeholderStyle="color: #d3d7d4"
							></u--input>
						</view>

						<view class="">KG</view>
					</view>
					<view
						class="current-weight flex-a flex-j  mar-t40"
					>
						<view class="">体脂</view>
						<view class="ipt-box marlr20">
							<u--input
								placeholder="请输入"
								border="surround"
								v-model="targetBodyFat"
								type="number"
								:customStyle="{
									height: '60rpx'
								}"
								color="#fff"
								placeholderStyle="color: #d3d7d4"
							></u--input>
						</view>

						<view class="">%</view>
					</view>
				</view>
			</view>

			<view class="period-box pad20   flex flex-col">
				<view class="flex-row flex-a">
					<view class="">减脂周期：</view>
					<view
						class="ipt-box marlr20 flex-row flex-a"
						@click="monthShow = true"
					>
						<u--input
							placeholder="请选择"
							border="surround"
							v-model="periodVal"
							type="number"
							:customStyle="{ height: '60rpx' }"
							disabled
							
							disabledColor="#fff"
							placeholderStyle="color: #d3d7d4"
						></u--input>
					</view>
				</view>
			</view>
			<view class="recommend-bg">
				<!-- 计算模块 -->
				<view
					class="calculate-box flex-col flex-a mar-t40"
				>
					<view
						class="calculate-btn flex"
						@click="calculateResult"
					>
						点击计算
					</view>
					<view
						class="result-box pad40  mar-t40 flex-row flex-a ju-bt"
					>
						<view class="block-l flex-col flex-a">
							<view class="l-tit ">减脂重量</view>
							<view
						w class="l-val mar-t20 flex-row flex-a"
							>
								{{ reduceFat || '0' }}
								<view class="unit unit-sty">
									KG
								</view>
							</view>
						</view>
						<view class="block-r flex-col flex-a">
							<view class="r-tit">肌肉量变化</view>
							<view
								class="r-val mar-t20 flex-row flex-a"
							>
								{{ muscleMass || '0' }}
								<view class="unit-sty">KG</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 底部 推荐 模块 -->

				<view class="recommend-box pad-b20">
					<view class="tips">
						根据您的目标科学建议
					</view>
					<view
						class="suggest suggest-1 mar-t20 flex-row flex-a"
					>
						<view class="">每天多消耗热量：</view>
						<view
							class="ipt-box marlr20 flex-row flex-a"
						>
							<u--input
								placeholder="请输入"
								placeholderStyle="color: #d3d7d4"
								
								v-model="calories"
								type="number"
								color="#fff"
								:customStyle="{
									height: '60rpx'
								}"
							></u--input>
						</view>
						<view class="">KCAL</view>
					</view>
					<view
						class="suggest suggest-2 mar-t20 flex-row flex-a"
					>
						<view class="">每天饮食摄入量：</view>
						<view
					 	class="ipt-box marlr20 flex-row flex-a"
						>
							<u--input
								placeholder="请输入"
								placeholderStyle="color: #d3d7d4"
								
								v-model="diet"
								type="number"
								color="#fff"
								:customStyle="{
									height: '60rpx'
								}"
							></u--input>
						</view>
						<view class="">KCAL</view>
					</view>
					<view
						class="suggest suggest-3 mar-t20 flex-row flex-a"
					>
						<view class="">每天中强度运动：</view>
						<view
							class="ipt-box marlr20 flex-row flex-a"
						>
							<u--input
								placeholder="请输入"
								placeholderStyle="color: #d3d7d4"
								v-model="strength"
								type="number"
								
								color="#fff"
								:customStyle="{
									height: '60rpx'
								}"
							></u--input>
						</view>
						<view class="">分钟</view>
					</view>
				</view>
			</view>
			<view class="fot-tips">
				<view class="tit">健康小知识:</view>
				<view class="tips-txt">
					单一有氧运动消耗热量只占一天总消耗的20-30%，
					静息代谢耗能要占60-70%，静息代谢的提高，就
					需要科学力量训练以增强骨骼肌。每增加1KG肌肉，
					静息代谢会帮你每天多消耗100-110千卡热量。
					反之不做力量训练，肌肉组织每10年平均流失掉4.5斤，
					静息代谢下降3-8%。你一定要重视起来哦！
				</view>
			</view>
		</view>

		<!-- 选择月份 -->
		<u-action-sheet
			:actions="monthList"
			title="选择月份"
			@close="monthShow = false"
			@select="selectMonth"
			round="20rpx"
			:closeOnClickOverlay="true"
			:safeAreaInsetBottom="true"
			:closeOnClickAction="true"
			:show="monthShow"
			cancelText="取消"
		></u-action-sheet>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import {
	getBodyInfo,
	getReduceWeightCounter
} from '@/api/myCenter.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			currentWeight: '', // 当前体重
			currentBodyFat: '', // 当前体脂
			targetWeight: '', // 目标体重
			targetBodyFat: '', // 目标体脂
			periodVal: '', // 减脂周期
			monthId: '', // 周期id
			calories: '', // 热量
			diet: '', // 饮食摄入量
			strength: '', // 运动强度
			monthShow: false, // 月份show
			monthList: [
				{
					name: '1个月',
					id: 1
				},
				{
					name: '2个月',
					id: 2
				},
				{
					name: '3个月',
					id: 3
				},
				{
					name: '6个月',
					id: 6
				},
				{
					name: '12个月',
					id: 12
				}
			],

			reduceFat: '', // 减脂重量
			muscleMass: '' // 肌肉量
		};
	},
	onLoad() {
		this.getBodyInfoFun();
	},
	methods: {
		/* 选中月份 */
		selectMonth(e) {
			this.periodVal = e.name;
			this.monthId = e.id;
		},
		/* 获取结果 */
		calculateResult() {
			if (
				!this.currentWeight ||
				!this.currentBodyFat ||
				!this.targetWeight ||
				!this.targetBodyFat
			) {
				uni.showToast({
					title: '请输入完整的体重体脂信息',
					icon: 'none'
				});
				return;
			}
			if (!this.monthId) {
				uni.showToast({
					title: '请选择减肥周期',
					icon: 'none'
				});
				return;
			}
			getReduceWeightCounter({
				weight: this.currentWeight,
				fat: this.currentBodyFat,
				target_weight: this.targetWeight,
				target_fat: this.targetBodyFat,
				month: this.monthId
			}).then(res => {
				this.reduceFat = res.data.defatting_weight;
				this.muscleMass = res.data.muscle_mass;

				this.calories = res.data.calories; // 热量
				this.diet = res.data.dietary_intake; // 饮食摄入量
				this.strength = res.data.intensity_exercise; // 运动强度
			});
		},
		/* 获取身体信息 */
		getBodyInfoFun() {
			getBodyInfo().then(res => {
				this.currentWeight = res.data.weight;
				this.currentBodyFat = res.data.fat;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.fot-tips {
	.tit {
		font-size: 30rpx;
		font-weight: bold;
	}
	.tips-txt {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #999;
		line-height: 40rpx;
		text-indent: 2em;
	}
	padding: 20rpx 50rpx 30rpx;
}
.box {
	position: relative;
	height: 93vh;
}
.recommend-bg {
	// background-color: #f4f4f5;
	background-color: rgba(243, 108, 33, 0.7);
	box-shadow: 1px 1px 15rpx 10rpx #eee;
	border-radius: 20rpx;
	color: #fff;
}
.recommend-box {
	.tips {
		font-size: 28rpx;
	}
	.suggest {
		.ipt-box {
			width: 160rpx;
			border-radius: 10rpx;
			// border: 1px solid #fff;
			padding-left: 10rpx;
		}
		font-size: 26rpx;
		padding: 20rpx;
	}
	width: 80%;
	margin: 30rpx auto;
}
.calculate-box {
	.result-box {
		.unit-sty {
			color: #999;
			font-size: 24rpx;
			margin-left: 7rpx;
		}
		width: 80%;
		border-radius: 30rpx;
		margin: 40rpx auto;
		box-shadow: 1px 1px 15rpx 10rpx #fff;
	}
	.calculate-btn {
		width: 150rpx;
		height: 60rpx;
		background-color: #009ad6;
		border-radius: 20rpx;
		font-size: 26rpx;
		color: #fff;
		margin-top: 20rpx;
		line-height: 60rpx;
	}
}
.period-box {
	box-shadow: 1px 1px 20rpx 5rpx #ccc;
	border-radius: 0 0 40rpx 40rpx;
	background-color: rgba(243, 108, 33, 0.7);
	margin-top: 25rpx;
	color: #fff;
}
.head-box {
	.block-l {
		background-color: rgba(243, 108, 33, 0.7);
		border-radius: 50rpx 0 0rpx 0;
	}
	.block-r {
		background-color: rgba(243, 108, 33, 0.7);
		border-radius: 0 50rpx 0rpx 0;
	}
	.block {
		.current-weight {
			.ipt-box {
				width: 160rpx;
			}
			font-size: 26rpx;
			width: 100%;
		}
		color: #fff;
		height: 300rpx;
		width: 48%;
		box-shadow: 1px 1px 20rpx 5rpx #ccc;
	}
}
</style>
