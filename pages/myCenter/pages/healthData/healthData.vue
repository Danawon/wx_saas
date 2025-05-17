<template>
	<view class="warp pad-b40">
		<head-nav
			title="健康数据"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="pad20">
			<view class="head-info flex-row flex-a ju-bt ">
				<view class="avatar">
					<u-avatar
						:src="userInfo.avatar"
						size="120rpx"
					></u-avatar>
				</view>
				<view
					class="info-name mar-l20 flex-col ju-bt padtb20"
				>
					<view class="name">{{ userInfo.nickname }}</view>
					<view class="tips">
						时刻关注自身数据健康变化，快乐每一天
					</view>
				</view>
				<view class="lookRecordSty" @click="goRouter(2)">
					查看历史记录
				</view>
			</view>
			<view class="setInfo flex-row flex-a ju-bt martb40">
				<view class="set-tit">数据隐私授权</view>
				<view class="set-icon flex-row flex-a" @click="goRouter('1')">
					<view class="icon-txt">设置不可见人员</view>
					<u-icon
						name="arrow-right"
						color="#202020"
						size="25rpx"
						top="3rpx"
					></u-icon>
				</view>
			</view>
			
			
			
			<view class="tabs martb20 flex-row flex-a">
				<view class="tabs-item flex" :class="{'selectTabItem' : tabCurrent === 0}"  @click="tabChange(0)">
					体适能评估数据
				</view>
				<view class="tabs-item flex" :class="{'selectTabItem' : tabCurrent === 1}" @click="tabChange(1)">
					医疗数据
				</view>
			</view>
			<!-- stamina => 体能 -->
			<stamina-fillin
				v-if="tabCurrent === 0"
				:healthData="healthData"
				:user_id="userId"
				:userInfo="userInfo"
				ref="staminaFillinRef"
			></stamina-fillin>
			<!-- 医疗 -->
			<medical-fillin
				v-if="tabCurrent === 1"
				:user_id="userId"
				:medicalData="edicaltestData"
			></medical-fillin>
			
		</view>
		
		
		
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
// 体能组件
import staminaFillin from "@/components/staminaFillin/staminaFillin.vue"
// 医疗组件
import medicalFillin from "@/components/medicalFillin/medicalFillin.vue"
import { getUserinfo, } from '@/api/admin.js';
import { getBodytestApikey } from "@/api/myCenter.js"
export default {
	components: {
		medicalFillin,
		staminaFillin,
		
	},
	data() {
		return {
			baseUrl: baseUrl,
			// tabs 当前选中
			tabCurrent: 0,
			// 体适能数据
			healthData: {},
			userId: "",
			userInfo: {}, // 用户信息
			edicaltestData: {}, // 医疗数据
		};
	},
	onLoad(e) {
		this.userId = e.id;
	},
	onShow() {
		/* 删除传递给设备页面的标识 */
		if(uni.getStorageSync("fromType")) {
			uni.removeStorageSync("fromType")
		}
		this.getUserInfoFun();
	},
	methods: {
		getBodytestApikey() {
			getBodytestApikey({
				phone: this.userInfo.authorize_mobile
			}).then(res => {
				if(Object.prototype.toString.call(res.data) !== '[object Array]') {
					this.$refs.staminaFillinRef.getApiKey(res.data.apiKey)
				}
			})
		},
		// 获取用户信息
		getUserInfoFun() {
			getUserinfo({
				id: this.userId
			}).then(res => {
				this.edicaltestData = res.data.edicaltest_data
				this.userInfo = res.data.userinfo;
				this.cardList = res.data.cardlist;
				this.healthData = res.data.health_data;
				this.questionnaire = res.data.questionnaire;
				this.getBodytestApikey();
			});
		},
		// 跳转
		goRouter(eve) {
			if(eve == 1) {
				uni.navigateTo({
					url: '/pages/myCenter/pages/setInvisible/setInvisible'
				})
			}else if(eve == 2) {
				uni.navigateTo({
					url: `/pages/myCenter/pages/historyInfo/historyInfo?uid=${
					this.userInfo.id
				}&phone=${this.userInfo.authorize_mobile}`
				})
			}
			
		},
		// tabschange
		tabChange(eve) {
			this.tabCurrent = eve;
		}
	}
};
</script>

<style lang="scss" scoped>
	
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
