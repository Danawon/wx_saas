<template>
	<view class="">
		
		<view
			class="li-subset flex-row flex-a ju-bt pad20"
			v-for="(item,index) in list"
			:key="index"
			@click.stop="onSelectLiChild(item)"
			:class="{isSign: item.is_sign}"
		>
			<view class="subset-l flex">
				<view class="img-box flex">
					<image
						:src="
							baseUrl + 'exercise.png'
						"
						mode=""
					></image>
				</view>
			</view>
			<view class="subset-r pad-l20">
				<view
					class="r-top flex-row flex-a ju-bt"
				>
					<view class="top-tit">
						第{{ item.key || '' }}次运动({{ item.type_text || '' }})
					</view>
					<view class="top-date">
						{{ item.createtime|| '' }}
					</view>
				</view>
				<view
					class="r-info flex-row flex-a "
				>
					<view
						class="info-km mar-r20 flex-row"
					>
						<view class="km-val">
							{{ item.calories || '' }}
						</view>
						<view class="km-tit">
							千卡
						</view>
					</view>
					<view class="info-time mar-r20">
						{{ item.length_time ||'' }}
					</view>
					<view
						class="info-Calories mar-r20"
					>
						{{
							(
								item.distance /
								1000
							).toFixed(2)
						}}公里
						<!-- 100公里 -->
					</view>
					<view class=" mar-r20">
						{{ item.steps || 0 }}步
					</view>
					<view class="">
						燃脂{{ item.burn_fat || 0 }}克
					</view>
				</view>
				<u-line margin="20rpx  0 "></u-line>
			</view>
		</view>
		
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
	</view>
</template>

<script>
	import { exerciseChartData } from '@/api/myCenter.js';
	import { getUserExerciseList } from "@/api/admin.js";
	import { baseUrl } from "@/utils/baseUrl.js"
	export default {
		data() {
			return {
				baseUrl: baseUrl,
				list: [],
				current: 1,
				total: 0,
			};
		},
		onLoad() {
		},
		onShow() {
			this.list = [];
			this.current = 1;
			this.getList();
		},
		onReachBottom() {
			this.current++;
			this.getList()
		},
		methods: {
			/* 选中li child node 跳转查看图表页 */
			onSelectLiChild(e) {
				exerciseChartData({
					id: e.id
				}).then(res => {
					uni.navigateTo({
						url: `/pages/admin/pages/sportsTeacherUser/heartRate/heartRate?data=${encodeURIComponent(
							JSON.stringify(
								{
									aerobic_cylinder: res.data.aerobic_cylinder,
									aerobic_diagram: res.data.aerobic_diagram,
									...res.data.data
								}
							)
						)}`
					});
				})
			},
			getList() {
				getUserExerciseList({
					page: this.current,
					list_rows: 20
				}).then(res => {
					let { total, data } = res.data;
					this.total = total;
					this.list = [...this.list, ...data];
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.isSign {
		background: #bfbfbf;
	}
.li-subset {
	// box-shadow: 1px 1px 10rpx 5rpx #eee;
	.subset-l {
		width: 15%;
		height: 100rpx;
		.img-box {
			width: 70rpx;
			height: 70rpx;
			background-color: #fa6626;
			border-radius: 50%;
			image {
				width: 80%;
				height: 80%;
			}
		}
	}
	.subset-r {
		.r-info {
			font-size: 24rpx;
			color: #181818;
			margin-top: 10rpx;
			.info-km {
				.km-val {
					font-size: 30rpx;
					font-weight: bold;
				}
				.km-tit {
					margin-bottom: 3rpx;
					margin-left: 5rpx;
				}
				align-items: flex-end;
			}
		}

		.r-top {
			font-size: 24rpx;
			color: #656565;
		}
		width: 85%;
		// height: 100rpx;
	}
}
</style>
