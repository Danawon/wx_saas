<template>
	<view >
		<view class="info-box pad20 ">
			<view class="info flex-row flex-a padlr20">
				<view class="avatar">
					<u-avatar
						:src="userInfo.avatar"
						size="100rpx"
					></u-avatar>
				</view>
				<view class="name-tel flex-col ju-bt mar-l20">
					<view class="name">
						{{ userInfo.nickname || '' }}
					</view>
					<view class="tel">
						手机号：{{ userInfo.mobile || ''}}
					</view>
				</view>
			</view>
			<u-line margin="40rpx 0"></u-line>
		</view>
		<view class="echarts-box pad20" v-if="!Array.isArray(echartsData)">
			<echarts-chart :chartObj="echartsData"></echarts-chart>
		</view>
	</view>
</template>

<script>
// eacharts图表
import echartsChart from '@/pages/admin/pages/components/echartsChart/echartsChart.vue';
import { userDataDisplay } from '@/api/admin.js';
export default {
	components: {
		echartsChart
	},
	data() {
		return {
			userInfo: {}, 
			echartsData: {}, 
		}
	},
	methods: {
		/* 获取个人信息 */
		getServerData(filed, userId) {
			userDataDisplay({
				id: userId,
				type: filed
			}).then(res => {
				this.userInfo = res.data.info;
				this.echartsData = res.data.aerobic_diagram
			});
		},
	}
}
</script>

<style lang="scss" scoped>
	.info-box {
		.info {
			.name-tel {
				.name {
					font-weight: 400;
					color: #202020;
					font-size: 32rpx;
				}
				.tel {
					font-weight: 400;
					color: rgba(0, 0, 0, 0.6);
					font-size: 22rpx;
				}
				height: 80rpx;
			}
		}
	}
</style>