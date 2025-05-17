<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="节假日管理"
		></head-nav>
		<view class="page ">
			<view class="page-top" @click="goRoute('add')">
				<view>添加节假日</view>
			</view>
			<view class="list">
				<u-cell-group>
					<view
						class=""
						v-for="(item, index) in list"
						@click="goRoute('edit', item)"
					>
						<u-cell :isLink="true">
							<view slot="title">
								<view class="">
									{{ item.title }}
								</view>
								<view class="date-sty">
									{{ item.starttime_text }} ~ {{ item.endtime_text }}
								</view>
							</view>
							<view
								class=""
								slot="right-icon"
								@click.stop="delFun(item)"
							>
								<u-icon
									name="trash"
									size="23"
								></u-icon>
							</view>
						</u-cell>
					</view>
				</u-cell-group>
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
import { holidayList, delHoliday } from '@/api/admin.js';
export default {
	data() {
		return {
			list: []
		};
	},
	onLoad() {
	},
	onShow() {
		this.getHolidayList();
	},
	methods: {
		// 删除节假日
		delFun(eve) {
			delHoliday({
				id: eve.id
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					this.getHolidayList();
				}, 1000);
			});
		},
		// 获取节假日
		getHolidayList() {
			holidayList().then(res => {
				this.list = res.data;
			});
		},
		/* 跳转页面 */
		goRoute(type, item) {
			if (type == 'add') {
				uni.navigateTo({
					url:
						'/pages/admin/pages/addHolidaysChild/addHolidaysChild'
				});
			} else {
				uni.navigateTo({
					url: `/pages/admin/pages/addHolidaysChild/addHolidaysChild?data=${JSON.stringify(
						item
					)}`
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	.date-sty {
		color: #afb0b1;
		font-size: 26rpx;
		margin-top: 10rpx;
	}
/deep/ .u-cell__body {
	height: 120rpx;
}
.page {
	padding: 20rpx 26rpx;
	.page-top {
		width: 100%;
		padding-top: 82rpx;
		background: url(https://jp.csxclxs.cn/20220707/manager/add_bg.png)
			no-repeat;
		background-size: 100% 174rpx;
		height: 174rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		font-weight: 400;
		color: #c9caca;
		text-align: center;
	}
}
</style>
