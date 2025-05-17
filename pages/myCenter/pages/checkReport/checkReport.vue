<template>
	<view class="warp pad-b40">
		<head-nav
			title="健康数据结果"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="pad20">
			<view class="tabs martb20 flex-row flex-a">
				<view class="tabs-item flex" :class="{'selectTabItem' : tabCurrent === 0}"  @click="tabChange(0)">
					体适能评估数据
				</view>
				<view class="tabs-item flex" :class="{'selectTabItem' : tabCurrent === 1}" @click="tabChange(1)">
					医疗数据
				</view>
			</view>
			<!-- stamina => 体能 -->
			<stamina v-if="tabCurrent === 0" ref="staminaRef"></stamina>
			<!-- 医疗 -->
			<medical v-if="tabCurrent === 1" ref="medicalRef"></medical>
			
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import stamina from "../components/stamina/stamina.vue"
import medical from "../components/medical/medical.vue"
import { healthHistoryDetailFitness, getMedicalInfo } from "@/api/admin.js"
import { getBodytestApikey } from "@/api/myCenter.js"
export default {
	components: {
		medical,
		stamina,
	},
	data() {
		return {
			baseUrl: baseUrl,
			// tabs 当前选中
			tabCurrent: 0,
			recordId: "", // 记录id
			infoData: {}, // 
			phone: ""
		};
	},
	onLoad(e) {
		this.phone = e.phone;
		this.recordId = e.id;
		this.getData();
	},
	methods: {
		async getData() {
			if(this.tabCurrent == 0) {
				await this.getBodytestApikey();
				await this.getHealthHistoryDetailFitness();
			}else if(this.tabCurrent == 1) {
				this.getMedicalInfoFun();
			}
		},
		getBodytestApikey() {
			return getBodytestApikey({
				phone: this.phone
			}).then(res => {
				if(Object.prototype.toString.call(res.data) !== '[object Array]') {
					this.apiKey = res.data.apiKey
				}
			})
		},
		/* 获取医疗数据 */
		getMedicalInfoFun() {
			getMedicalInfo({
				id: this.recordId,
			}).then(res => {
				this.$refs.medicalRef.getData(res.data);
			})
		},
		// 获取体适能历史数据
		getHealthHistoryDetailFitness() {
			return healthHistoryDetailFitness({
				id: this.recordId,
			}).then(res => {
				this.$refs.staminaRef.getData(res.data, this.apiKey);
			})
		},
		// tabschange
		tabChange(eve) {
			this.tabCurrent = eve;
			this.getData();
		}
	}
};
</script>

<style lang="scss" scoped>
	/deep/ .u-album__row {
		justify-content: center;
	}
.tabs {
	.selectTabItem {
		background-color: #FE5E10 !important;
		color: #fff !important;
		font-size: 30rpx !important;
	}
	.tabs-item {
		width: 50%;
		height: 70rpx;
		background-color: #F5F5F5;
		color: #C9CACA;
		border-radius: 10rpx;
		font-size: 28rpx;
	}
	width: 100%;
}
.setInfo {
	.set-icon {
		font-weight: 400;
		color: rgba(32, 32, 32, 0.9);
	}
	.set-tit {
		font-weight: 400;
		color: #999999;
	}
	font-size: 28rpx;
}
.head-info {
	.lookRecordSty {
		position: absolute;
		top: 5rpx;
		right: 20rpx;
		font-weight: 400;
		color: #fe5e10;
		font-size: 28rpx;
	}
	.info-name {
		.tips {
			font-weight: 300;
			color: #999999;
			font-size: 24rpx;
		}
		.name {
			font-weight: 550;
			color: #202020;
			font-size: 32rpx;
		}
		width: 80%;
		height: 120rpx;
	}
	.avatar {
		width: 20%;
	}
	position: relative;
}
</style>
