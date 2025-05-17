<template>
	<view>
		<view class="imgs" v-if="images">
			 <u-album 
				:urls="images"
				 singleSize="100"
				 multipleSize="100"
				 maxCount="3"
			></u-album>
		</view>
		<u-cell-group>
			<u-cell icon="calendar" title="体检时间" :value="dateRecord.supplemental_time"></u-cell>
			<u-cell icon="calendar" title="体侧记录日期" :value="dateRecord.date"></u-cell>
		</u-cell-group>
		<view class="list-box mar-5 flex-row ju-bt">
			<view
				class="li martb20 pad20 flex-row flex-a ju-bt"
				v-for="(item, index) in listData"
				:key="index"
			>
				<view class="li-l flex-row flex-a">
					<view class="l-icon">
						<image :src="item.icon" mode=""></image>
					</view>
					<view class="l-info flex-col ju-bt mar-l40">
						<view class="info-tit">
							{{ item.tit }}
						</view>
						<view class="info-num flex-row flex-a">
							{{ item.info || 0 }}
							<view class="info-tit">
								{{ item.unit }}
							</view>
						</view>
						
					</view>
				</view>
				<view class="li-r flex ">{{ item.state }}</view>
			</view>
		</view>
		<!-- area -->
		<view class="area-box">
			<u--textarea
				v-model="desc"
				border="none"
				placeholder="其他反馈"
				height="140rpx"
				maxlength="-1"
			></u--textarea>
		</view>
		<!-- <view class="fot-btn ">
			<view class="btn flex">保存</view>
		</view> -->
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			listData: [
				{
					icon: `${baseUrl}health2.png`,
					tit: '收缩压',
					info: '40kg',
					iptVal: '',
					state: "",
					unit: "(mmHg)"
				},
				{
					icon: `${baseUrl}health3.png`,
					tit: '舒张压',
					info: '40kg',
					iptVal: '',
					state: "",
					unit: "(mmHg)"
				},
				{
					icon: `${baseUrl}health4.png`,
					tit: '总胆固醇 ',
					info: '40kg',
					iptVal: '',
					state: "",
					unit: "(mmol/L)"
				},
				{
					icon: `${baseUrl}health5.png`,
					tit: '甘油三酯',
					info: '40kg',
					iptVal: '',
					state: "",
					unit: "(mmol/L)"
				},
				{
					icon: `${baseUrl}health6.png`,
					tit: '低密度脂蛋白',
					info: '40kg',
					iptVal: '',
					state: "",
					unit: "(mmol/L)"
				},
				{
					icon: `${baseUrl}health6.png`,
					tit: '高密度脂蛋白',
					info: '40kg',
					iptVal: '',
					state: "",
					unit: "(mmol/L)"
				},
				{
					icon: `${baseUrl}health7.png`,
					tit: '空腹血糖',
					info: '40kg',
					iptVal: '',
					state: "",
					unit: "(mmol/L)"
				},
				{
					icon: `${baseUrl}health7.png`,
					tit: '餐后2H血糖',
					info: '40kg',
					iptVal: '',
					state: "",
					unit: "(mmol/L)"
				},
				{
					icon: `${baseUrl}health8.png`,
					tit: '糖化血红蛋白',
					info: '40kg',
					iptVal: '',
					state: "",
					unit: "(5.6%)"
				},
				{
					icon: `${baseUrl}health9.png`,
					tit: '尿酸',
					info: '40kg',
					iptVal: '',
					state: "",
					unit: "(umol/L)"
				},
				{
					icon: `${baseUrl}health9.png`,
					tit: '血氧饱和度',
					info: '40kg',
					iptVal: '',
					state: "",
					unit: "(95 ~ 99%)"
				}
			],
			desc: '描述',
			images: [],
			dateRecord: {
				date: "",
				supplemental_time: "",
			},
		};
	},
	methods: {
		/* 获取数据 */
		getData(eve) {
			console.log(eve, "--eve");
			this.dateRecord.date = eve.date;
			this.dateRecord.supplemental_time = eve.supplemental_time;
			this.images = eve.images;
			// 收压缩
			this.listData[0].info = eve.systolic_pressure_standard.value;
			this.listData[0].state = eve.systolic_pressure_standard.name;
			// 舒张压
			this.listData[1].info = eve.diastolic_pressure_standard.value;
			this.listData[1].state = eve.diastolic_pressure_standard.name;
			// 总胆固醇
			this.listData[2].info = eve.cholesterol_standard.value;
			this.listData[2].state = eve.cholesterol_standard.name;
			// 甘油三酯
			this.listData[3].info = eve.triglyceride_standard.value;
			this.listData[3].state = eve.triglyceride_standard.name;
			// 低密度脂蛋白
			this.listData[4].info = eve.low_density_lipoprotein_standard.value;
			this.listData[4].state = eve.low_density_lipoprotein_standard.name;	
			// 高密度脂蛋白
			this.listData[5].info = eve.high_density_lipoprotein_standard.value;
			this.listData[5].state = eve.high_density_lipoprotein_standard.name;		
			// 空腹血糖
			this.listData[6].info = eve.fasting_blood_glucose_standard.value;
			this.listData[6].state = eve.fasting_blood_glucose_standard.name;
			// 餐后2H血糖
			this.listData[7].info = eve.postprandial_glucose_standard.value;
			this.listData[7].state = eve.postprandial_glucose_standard.name;	
			// 糖化血红蛋白
			this.listData[8].info = eve.glycosylated_hemoglobin_standard.value;
			this.listData[8].state = eve.glycosylated_hemoglobin_standard.name;
			// 尿酸
			this.listData[9].info = eve.uric_acid_standard.value;
			this.listData[9].state = eve.uric_acid_standard.name;	
			// 血氧饱和度
			this.listData[10].info = eve.blood_oxygen_standard.value;
			this.listData[10].state = eve.blood_oxygen_standard.name;
			this.desc = eve.feedback
		},
	}
};
</script>

<style lang="scss" scoped>
.area-box {
	border: 2px solid #eee;
	border-radius: 10rpx;
}
.fot-btn {
	margin-top: 60rpx;
	.btn {
		width: 100%;
		height: 80rpx;
		background-color: #fe5e10;
		border-radius: 40rpx;
		color: #fff;
	}
}
/deep/ .u-textarea {
	background-color: #f9f9f9 !important;
}
.list-box {
	.li {
		.li-r {
			font-weight: 400;
			color: #fe5e10;
			font-size: 28rpx;
		}
		.li-l {
			.l-info {
				.info-num {
					font-weight: 400;
					color: rgba(32, 32, 32, 0.9);
					font-size: 32rpx;
				}
				.info-tit {
					font-weight: 300;
					color: #999999;
					font-size: 22rpx;
				}
				height: 80rpx;
			}
			.l-icon {
				width: 45rpx;
				height: 45rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		width: 48%;
		// height: 100rpx;
		border-radius: 10rpx;
		background-color: #fff;
		box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.25);
	}
	flex-wrap: wrap;
}
</style>
