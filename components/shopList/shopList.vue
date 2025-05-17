<template>
	<view class="wrap">
		<!-- 内容模块 -->
		<view
			class="content"
			v-for="(item, index) in shopList"
			:key="index"
		>
			<view class="img-box flex" @click="goStoreDetail(item)">
				<image :src="item.images[0]" mode=""></image>
				<image :src="item.images[1]" mode=""></image>
			</view>
			<view
				class="stadium-name flex"
				@click="goStoreDetail(item)"
			>
				<view class="name">{{ item.name }}</view>
				<view class="distance">
					距离{{ (item.store_distance / 1000).toFixed(2) }}公里
				</view>
			</view>
			<view class="content-line">
				<u-line margin="20rpx 0"></u-line>
			</view>
			<!-- 展开收起模块 -->
			<view class="arrange-class flex">
				<view class="txt flex-a">
					<view class="">
						约课
					</view>
					<view class="hol-tit mar-l20" v-if="item.is_holiday">
						{{ item.holiday.title }}
					</view>
				</view>
				<view class="class-btn-box padtb20" @click="toggle(item, index)">
					<view
						class="class-unfold flex"
					>
						<u-icon
							color=""
							:name="!item.state ? 'arrow-up' : 'arrow-down'"
							size="26rpx"
						></u-icon>
						<text style="margin-left: 10rpx;">
							
							{{ !item.state ? '展开' : '收起' }}
						</text>
					</view>
				</view>
			</view>
			<!-- 约课组件 模块 -->
			<appointment-ourse
				v-if="item.state && !item.is_holiday"
				:storeId="item.id"
				:status="changeStatus"
			></appointment-ourse>
			<view class="holiday-box flex-col flex-a pad20" v-if="item.state && item.is_holiday">
				<view class="content mar-t20">
					{{ item.holiday.content }}
				</view>
				<view class="img-box">
					<image :src="item.holiday.image" mode=""></image>
				</view>
			</view>
		</view>

		<view class="" v-if="!shopList.length">
			<u-empty
				mode="list"
				text="暂无搜索门店..."
			></u-empty>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
// 门店约课组件
import appointmentOurse from '@/components/appointmentOurse/appointmentOurse.vue';
export default {
	components: {
		appointmentOurse
	},
	props: {
		locatingObj:{
			type: Object,
			default: {},
		}
	},
	data() {
		return {
			// ftp地址
			baseUrl: baseUrl,
			shopList: [],
			changeStatus: false,
			//
		};
	},
	methods: {
		// 切换状态
		toggle(item, index, type) {
			let data = item;
			data.state = !item.state;
			this.$set(this.shopList, index, data);
		},
		// 获取列表数据
		getParentList(eve) {
			eve.forEach((item, index) => {
				if(index) {
					item.state = false;
				}else {
					item.state = true;
				}
			});
			this.shopList = eve;
			this.changeStatus = !this.changeStatus;
			
		},
		// 跳转门店详情
		goStoreDetail(eve) {
			uni.navigateTo({
				url: `/pages/store/pages/storeDetail/storeDetail?store_id=${
					eve.id
				}&latitude=${this.locatingObj.latitude}&longitude=${this.locatingObj.longitude}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.hol-tit {
		background-color: #fe5e10;
		color: #fff;
		padding: 10rpx 20rpx;
		font-size: 26rpx;
		display: inline-block;
		border-radius: 10rpx;
	}
.holiday-box {
	width: 100%; 
	box-shadow: 1px 1px 10rpx 5rpx #ccc;
	border-radius: 10rpx;
	.img-box{
		width: 100%;
		image {
			width: 100% !important;
		}
	}
	.content {
		font-size: 28rpx;
		color: #646464;
		line-height: 45rpx;
	}
}
.content {
	.content-line {
		padding: 0 30rpx;
	}
	.arrange-class {
		.txt {
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #545163;
			font-size: 28rpx;
		}
		.class-unfold,
		.class-close {
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.4);
			font-size: 22rpx;
		}
		justify-content: space-between;
		padding: 0rpx 30rpx;
	}
	.img-box {
		image {
			width: 49.5%;
			height: 250rpx;
		}
		justify-content: space-between;
	}
	.stadium-name {
		justify-content: space-between;
		padding: 0 30rpx;
		margin-top: 30rpx;
		.distance {
			font-size: 24rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.4);
		}
		.name {
			color: #202020;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: bold;
			font-weight: 30rpx;
		}
	}
	width: 100%;
	background-color: #fff;
	border-radius: 24rpx;
	margin-bottom: 20rpx;
	padding-bottom: 10rpx;
}
.wrap {
	padding: 0 20rpx;
}
view {
	box-sizing: border-box;
}
</style>
