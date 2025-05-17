<template>
	<view>
		<head-nav
			title="超级管理员"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="pad20 list-box flex-row flex-a">
			<view
				class="li flex"
				v-for="(item, index) in list"
				:key="index"
				@click="goRoute(item)"
			>
			<view class="flex-col flex-a flex-j">
				<image
					class="img"
					:src="item.img"
					mode=""
				></image>
				
				<view class="li-txt mar-t20">
					{{ item.txt }}
				</view>
			</view>
				
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			list: [
				{
					img: `${baseUrl}adminIcon1.png`,
					txt: '分区经理管理'
				},
				// {
				// 	img: `${baseUrl}admin2.png`,
				// 	txt: '运营专员管理'
				// },
				{
					img: `${baseUrl}searchUserAll.png`,
					txt: '用户查询'
				},
				{
					img: `${baseUrl}couponGrant.png`,
					txt: '发放优惠券'
				},
				{
					img: `${baseUrl}inquireCoupon.png`,
					txt: '优惠券发放记录'
				},
				{
					img: `${baseUrl}searchUserAll.png`,
					txt: '用户运动列表'
				},
			]
		};
	},
	methods: {
		goRoute(eve) {
			let arr = [
				// {
				// 	key: "运营专员管理",
				// 	url: "/pages/admin/pages/sportsCommissioner/sportsCommissioner"
				// },
				{
					key: "分区经理管理",
					url: "/pages/admin/pages/areaManager/areaManager"
				},
				{
					key: "用户查询",
					url: "/pages/admin/pages/searchUser/searchUser"
				},
				{
					key: "发放优惠券",
					url: "/pages/admin/pages/selectUser/selectUser"
				},
				{
					key: "优惠券发放记录",
					url: "/pages/admin/pages/couponRecord/couponRecord"
				},
				{
					key: "用户运动列表",
					url: "/pages/admin/pages/userExerciseList/userExerciseList"
				},
			]
			let url = arr.filter(item => item.key == eve.txt)[0].url
			uni.navigateTo({
				url: url
			})
		},
	}
};
</script>

<style lang="scss" scoped>
.list-box {
	.li {
		.li-txt {
			font-size: 24rpx;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.4);
		}
		.img {
			width: 80rpx;
			height: 80rpx;
		}
		width: 33.33%;
		height: 200rpx;
	}
	flex-wrap: wrap;
	width: 100%;
}
</style>
