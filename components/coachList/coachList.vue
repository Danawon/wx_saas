<template>
	<view>
		<!-- 教练模列表 -->
		<view class="coach-list flex-a pad-l20">
			<view
				class="coach-item flex-col flex-a"
				v-for="(item, index) in coachList"
				:key="index"
				:class="{
					selectCoachSty:
						selectCoachId == item.coach_id
				}"
				@click="selectCoach(item)"
			>
				<view class="border-circle" >
					<u-avatar
						:src="item.avatar || item.coath.avatar"
						size="100rpx"
					></u-avatar>
				</view>

				<view
					class="coach-name text-elpis"
				>
					{{ item.name || item.coath.name }}
				</view>
			</view>
			<view class="sty">
				<u-empty
					v-if="!coachList.length"
					iconSize="100rpx"
					textSize="28rpx"
					mode="list"
					text="暂无教练..."
				></u-empty>
			</view>
			
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
export default {
	name: 'coachList',
	props: {
		coachList: {
			type: Array,
			default: []
		},
		clockIn: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			// ftp地址
			baseUrl: baseUrl,
			// 选中教练id
			selectCoachId: '',
			/* 双击 */
			touchStartTime: 0
		};
	},
	onReady() {
	},
	methods: {
		/* 选中教练 */
		selectCoach(eve) {
			if(!this.clockIn) {
				uni.navigateTo({
					url: `/pages/store/pages/coachDetail/coachDetail?coachId=${
						eve.id
					}`
				});
				return
			}
			if (this.touchStartTime === 0) {
				if (this.clockIn) {
					this.selectCoachId = eve.coach_id; // 教练id
					this.$emit('selectCoach', eve.id, eve.coach_id);
				}
				this.touchStartTime = new Date().getTime()
				setTimeout(() => {
					this.touchStartTime = 0
				}, 300)
			} else {
				if (new Date().getTime() - this.touchStartTime <= 300) {
					uni.navigateTo({
						url: `/pages/store/pages/coachDetail/coachDetail?coachId=${
							eve.coach_id
						}`
					});
				}
				this.touchStartTime = 0
			}
		},
	}
};
</script>

<style lang="scss" scoped>
	.sty {
		margin: 0 auto;
	}
.coach-list {
	.selectCoachSty {
		border-radius: 16rpx;
		border: 1px solid #fe5e10;
	}
	.coach-item {
		.coach-name {
			margin-top: 15rpx;
			text-align: center;
			font-size: 24rpx;
		}
		.border-circle {
			border-radius: 50%;
			border: 2px solid #1296db;
		}
		width: 19%;
		padding: 20rpx 5rpx;
		margin-right: 30rpx;
		flex-shrink: 0;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(32, 32, 32, 0.9);
	}
	white-space: nowrap;
	width: 100%;
	overflow-x: auto;
	margin: 20rpx 0;
	background-color: rgba(255,255,255,.7);
	border-radius: 20rpx;
}
</style>
