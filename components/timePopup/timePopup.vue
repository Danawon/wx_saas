<template>
	<view>
		<u-popup :show="show" type="bottom">
			<view class="popup-box">
				<view class="flex-a ju-bt popup-top padlr20">
					<text class="cancel" @click="close">
						取消
					</text>
					<text class="title">选择时间</text>
					<text class="determine" @click="determine">
						确定
					</text>
				</view>
				<view class="">
					<scroll-view scroll-y class="popup-list">
						<view
							class="popup-li pad20"
							v-for="(item, index) in timeList"
							:key="index"
							@click="liClick(item)"
							:class="{
								on: popupItem.name == item.name
							}"
						>
							{{ item.name }}
						</view>
					</scroll-view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	name: 'timePopup',
	props: {
		show: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			popupItem: {}, //弹框选中的值
			timeList: [
				{
					name: '最近七天',
					value: "7day"
				},
				{
					name: '最近一个月',
					value: "1month"
				},
				{
					name: '最近三个月',
					value: "3month"
				},
				{
					name: '最近半年',
					value: "6month"
				},
				{
					name: '最近一年',
					value: "1year"
				},
				{
					name: '最近三年',
					value: "3year"
				}
			]
		};
	},
	methods: {
		//关闭弹框
		close() {
			this.$emit('close');
		},
		//选择时间
		liClick(item) {
			this.popupItem = item;
		},
		//点击确认
		determine() {
			if (!this.popupItem.name) {
				uni.showToast({
					title: '请选择时间',
					icon: 'error'
				});
				return;
			}
			this.$emit('change', this.popupItem);
		}
	}
};
</script>

<style lang="scss">
.popup-box {
	.determine {
		color: #fe5e10;
	}

	.popup-top {
		padding: 30rpx;
	}
	.popup-li {
		text-align: center;
		color: #ccc;
	}
	.popup-li.on {
		color: #000;
		border-bottom: #ccc 1rpx solid;
		border-top: #ccc 1rpx solid;
	}
}
</style>
