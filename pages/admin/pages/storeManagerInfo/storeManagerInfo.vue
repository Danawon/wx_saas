<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="教练管理"></head-nav>
		<u-tabs :list="tabsArr" lineColor="#FE5E10" :activeStyle="{
				color: '#FE5E10',
				fontWeight: 'bold',
				transform: 'scale(1.05)'
			}" :inactiveStyle="{
				color: '#606266',
				transform: 'scale(1)'
			}" lineWidth="55rpx" lineHeight="4rpx" :current="tabsCurrent" @change="tabsChange" :scrollable="false"></u-tabs>
		<u-line></u-line>
		<view class="page-list">
			<view class="" v-for="(item, index) in list">
				<view class="flex-a pad-t20">
					<view class="img-box pad-r40">
						<u-image :src="item.avatar" width="128rpx" height="128rpx"
							shape="circle"></u-image>
					</view>
					<view class="flex-col li-center">
						<text class="name">{{ item.name }}</text>
						<text>授课次数：{{ item.Numberofclasses }}次</text>
						<text>手机号：{{ item.mobile }}</text>
					</view>
					<view class="btn-box ">
						<view class="btn btn1 flex padlr20" @click="jump(item, 1)">
							编辑信息
						</view>
						<view class="btn flex padlr20 mar-t20" @click="jump(item, 2)">
							编辑权限
						</view>
					</view>
				
				</view>

				<u-line></u-line>
			</view>
			
			<u-empty
				v-if="!list.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>

	</view>
</template>

<script>
	import { coachList } from "@/api/admin.js"
	export default {
		data() {
			return {
				tabsArr: [{
						name: '有资格',
						status: "job"
					},
					{
						name: '无资格',
						status: "quit"
					},

				],
				tabsCurrent: 0, // tabs 下标
				current: 1, // 当前页
				list: [],
				
			};
		},
		onLoad() {
			
		},
		onReachBottom() {
			this.current ++ ;
			this.getCoachList();
		},
		onShow() {
			this.current = 1;
			this.list = [];
			this.getCoachList();
		},
		methods: {
			// 获取教练列表
			getCoachList() {
				coachList({
					page: this.current,
					status: this.tabsArr[this.tabsCurrent].status,
					list_rows: 20,
				}).then(res => {
					this.list = [...this.list, ...res.data.data]
				})
			},
			// tabschange改变
			tabsChange(eve) {
				this.current = 1;
				this.list = [];
				this.tabsCurrent = eve.index;
				this.getCoachList();
			},
			//教练信息设置
			jump(eve, type){
				let url = ''
				if(type == 1) {
					url = `/pages/admin/pages/storeManagerInfoSet/storeManagerInfoSet?id=${eve.id}`
				}else {
					url = `/pages/admin/pages/editCoachAuth/editCoachAuth?id=${eve.id}`
				}
				uni.navigateTo({
					url: url
				})
			},
		
		}
	}
</script>

<style lang="scss">
	.page-list {
		padding: 0 32rpx 30rpx;

		.img-box {
			margin-bottom: 50rpx;
			width: 22%;
		}

		.name {

			font-size: 32rpx;
			color: #202020;
		}

		.li-center {
			width: 56%;
			font-size: 24rpx;
			color: rgba(0, 0, 0, 0.6);
			line-height: 48rpx;
		}
		.btn-box {
			width: 22%;
			.btn {
				border-radius: 42rpx;
				font-size: 24rpx;
				height: 50rpx;
				border: 1rpx solid #FE5E10;
				color: #FE5E10;
			}
			.btn1 {
				border: 1px solid #3c9cff !important;
				color: #3c9cff !important;
			}
		}

		
	}
</style>
