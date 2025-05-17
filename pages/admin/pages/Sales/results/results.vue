<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="销售业绩"></head-nav>
		<view class="page-top flex flex-col">
			<view class="">
				<text class="num">{{ totalPrice }}</text>
				元
			</view>
			<view class="">销售总和</view>
		</view>
		<view class="page-date pad40 pad-t20">
			<uni-datetime-picker
				v-model="dateRange"
				@change="dateChange"
				type="daterange"
				return-type=""
				rangeSeparator="至"
			/>
		</view>

		<view class="pad-t40 pad-l20 pad-r20 pad-b40">
			<view class="box-li mar-b20" v-for="(item, index) in list" :key="index">
					<view class="flex-a ju-bt">
						<text class="gray">下单时间：{{ item.membercardoreder.paidtime }}</text>
						<text class="pass" v-if="item.status == 0">未审核</text>
						<text class="pass" v-if="item.status == 1">已通过</text>
						<text class="pass" v-if="item.status == -1">已拒绝</text>
					</view>
					<view class="flex-a martb20">
						<view class="">
							<u--image :src="item.membercardoreder.membercard_image" radius="20rpx" width="150rpx" height="150rpx" ></u--image>
						</view>
						<view class="pad-l20">
							<view class=" flex-a ju-bt">
								<text class="title">{{ item.membercardoreder.membercard_name }}</text>
								
								<view class="">
									￥ <text class="title">{{ item.membercardoreder.membercard_price }}</text>
								</view>
							</view>
							<view class="gray text-elpis2">
								{{ item.membercardoreder.membercard_info }}
							</view>
						</view>
					</view>
					
					<view class="flex-a ju-bt pad-b20">
						<view  >订单原金额 ￥ <text class="title">{{  item.membercardoreder.order_price }}</text> </view>
						<view >使用优惠券面额 ￥ <text class="title">{{  item.membercardoreder.total_price }}</text> </view> 
					</view>
					<view class="flex-a ju-bt pass1 pad-b20">
						<view  >线下补录金额 ￥ <text class="title">{{ item.additional_recording }}</text> </view>
						<view>通过后订单金额 ￥ <text class="title">{{ Number(item.membercardoreder.total_price) + Number(item.additional_recording) }}</text> </view> 
					</view>
					
					<view class="flex-a ju-bt pad-b20">
						<text>姓名：</text>
						<text class="gray">{{ item.userinfo.nickname }}</text>
					</view>
					<view class="flex-a ju-bt pad-b20">
						<text>电话：</text>
						<text class="gray">{{ item.userinfo.mobile }}</text>
					</view>
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
import { baseUrl } from '@/utils/baseUrl.js';
import modalTips from '@/components/modalTips/modalTips.vue';
import { salePerformance } from "@/api/sales.js"
export default {
	components: {
		modalTips
	},
	data() {
		return {
			baseUrl: baseUrl,
			dateRange: [],
			current: 1,
			list: [],
			totalPrice: 0, // 总金额
		};
	},
	onLoad() {
		this.getSalePerformance();
	},
	onReachBottom() {
		this.current ++ 
		this.getSalePerformance();
	},
	methods: {
		// 选中日期
		dateChange(eve) {
			this.dateRange = eve;
			this.current = 1;
			this.list = [];
			this.getSalePerformance();
		},
		// 获取销售业绩
		getSalePerformance() {
			salePerformance({
				page: this.current,
				list_rows: 20,
				createtime: this.dateRange ? this.dateRange.join(",") : ''
			}).then(res => {
				this.totalPrice = res.data.total
				this.list = [...this.list, ...res.data.list.data]
			})
		},
		//跳转页面
		jump(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss">
.page-top {
	height: 216rpx;
	color: #fff;
	font-size: 22rpx;
	line-height: 48rpx;
	background: linear-gradient(180deg, #fe5e10 0%, #ffa376 100%);

	.num {
		font-weight: 600;
		font-size: 40rpx;
	}
}
.box-li {
	padding: 24rpx 26rpx 28rpx;
	background: #f5f5f5;
	border-radius: 32rpx;
	font-size: 26rpx;

	.pass {
		color: #fe5e10;
	}
	.pass1 {
		color: #EF0708;
	}
	.gray {
		color: rgba(0, 0, 0, 0.4);
	}
	
	.title {
		font-weight: bold;
	}
}
</style>
