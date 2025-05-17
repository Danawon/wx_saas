<template>
	<view>
		<head-nav
			title="区域经理"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<u-line></u-line>
		<view class="pad20 list-box flex-row">
			<view
				class="li flex-col flex-a mar-t40"
				v-for="(item, index) in list"
				:key="index"
				@click="goRoute(item)"
			>
				<view class="img">
					<image :src="item.image" mode=""></image>
				</view>
				<view class="li-txt mar-t20">
					{{ item.name }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { healthKind } from "@/api/admin.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			list: [],
			userId: "", // 用户id
			type: "", // 查看类型 2 => 查看个人 1 =》 查看分组
			storeId: "", // 门店id
		};
	},
	onLoad(e) {
		this.userId = e.id ?? '';
		this.type = e.type;
		this.storeId = e.storeId ?? ''
		this.getHealthKind();
	},
	methods: {
		// 获取健康种类列表
		getHealthKind() {
			healthKind().then(res => {
				this.list = res.data;
			})
		},
		goRoute(item) {
			uni.navigateTo({
				url: `/pages/admin/pages/fitnessData/fitnessData?field=${item.field}&uid=${this.userId}&type=${this.type}&storeId=${this.storeId}`
			})
		},
	},
};
</script>

<style lang="scss" scoped>
.list-box {
	.li {
		.img {
			width: 65rpx;
			height: 60rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.li-txt {
			font-weight: 500;
			color: rgba(0, 0, 0, 0.4);
			font-size: 24rpx;
		}
		width: 25%;
	}
	flex-wrap: wrap;
}
</style>
