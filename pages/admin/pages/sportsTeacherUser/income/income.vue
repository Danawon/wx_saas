<template>
	<view>
		<head-nav title="我的收入" bgColor="#fff" :goBack="true"></head-nav>
		<!-- tabs模块 -->
		<view class="page-top-btn flex" @click="time">{{timeTxt.name}}</view> 
		<view class="list-box pad20">
			<view class="li mar-b40" v-for="(item, index) in list" :key="index">
				<view class=" flex-row">
					<view class="li-img flex"><u-image :src="item.user.avatar" shape="circle" width="128rpx" height="128rpx"></u-image></view>
					<view class="li-info flex-row flex-a ju-bt padlr20">
						<view class="info-l">
							<view class="card-name">{{ item.body }}</view>
							<view class="txt">购买时间：{{ item.paidtime }}</view>
							<view class="txt">用户ID：{{ item.uid }}</view>
						</view>
						<view class="info-r" > + {{ item.total_price }}元</view>
					</view>
				</view>
				<u-line margin="40rpx 0"></u-line>
			</view>
			<u-empty
				v-if="!list.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>

		<timePopup :show="show" @change="determine" @close="close"></timePopup>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import timePopup from '@/components/timePopup/timePopup.vue';
import { revenueList } from "@/api/sportsTeacher.js"
export default {
	components: {
		timePopup
	},
	data() {
		return {
			baseUrl: baseUrl, 
			show:false,
			// tabs当前选中
			tabsCurrent: 0,
			timeTxt:{
				name: "最近七天",
				value: "7day",
			}, //时间
			current: 1,
			list: [],
		};
	},
	onLoad(op) {
		this.getRevenueList();
	},
	onReachBottom() {
		this.current ++ 
		this.getRevenueList();
	},
	methods: {
		resetFun() {
			this.current = 1;
			this.list = [];
		},
		// 获取收入列表
		getRevenueList() {
			revenueList({
				list_rows: 20,
				page: this.current,
				data: this.timeTxt.value
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			})
		},
		//时间弹框打开
		time() {
			this.show = true
		},
		//关闭
		close() {
			this.show = false
		},
		//确定
		determine(item) {
			this.timeTxt = item;
			this.resetFun();
			this.getRevenueList();
			this.close()
		}, 
	}
};
</script>

<style lang="scss" scoped>
.page-top-btn {
	height: 80rpx;
	background: #fe5e10;
	border-radius: 8rpx;
	margin: 32rpx 32rpx 0;
	color: #ffffff;
	font-size: 28rpx;
}

.list-box {
	.li {
		.li-info {
			position: relative;
			.info-r {
				position: absolute;
				bottom: 50%;
				transform: translateY(50%);
				right: 34rpx;
				color: #fe5e10; 
			}

			.info-l {
				.txt {
					font-weight: 400;
					color: rgba(0, 0, 0, 0.6);
					font-size: 24rpx;
					margin: 10rpx 0;
				}

				.card-name {
					font-weight: 550;
					color: #202020;
					font-size: 28rpx;
				}
			}

			width: 78%;
		}

		.li-img {
			image {
				width: 100%;
				height: 80rpx;
			}

			width: 22%;
			height: 200rpx;
		}
	}
}
</style>
