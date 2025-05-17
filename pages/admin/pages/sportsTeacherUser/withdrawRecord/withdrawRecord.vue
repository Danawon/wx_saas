<template>
	<view>
		<head-nav title="提现申请记录" bgColor="#fff" :goBack="true"></head-nav>
		<view class="list-box pad20">
			<view class="li mar-b40" v-for="(item, index) in list" :key="index">
				<view class=" flex-row">
					<view class="li-img flex"><u-image :src="item.avatar" shape="circle" width="128rpx" height="128rpx"></u-image></view>
					<view class="li-info flex-row flex-a ju-bt padlr20">
						<view class="info-l">
							<view class="card-name">{{ item.rule_name }}</view>
							<view class="txt">提现金额：{{ item.money }}</view>
							<view class="txt">购买时间：{{ item.createtime }}</view>
						</view>
						<view class="info-r flex-col flex-a" > 
							<view class="r-price">
								￥<text class="proce-num">{{ item.money }}</text>
							</view>
							<view class="r-tips">
								{{ item.status_text }}
							</view>
						</view>
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

	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { withdrawRecord } from "@/api/sportsTeacher.js"
export default {
	components: {
	},
	data() {
		return {
			baseUrl: baseUrl, 
			current: 1,
			list: [],
		};
	},
	onLoad(op) {
		this.getWithdrawRecord();
	},
	onReachBottom() {
		this.current ++ 
		this.getWithdrawRecord();
	},
	methods: {
		// 获取收入列表
		getWithdrawRecord() {
			withdrawRecord({
				page: this.current,
				list_rows: 20,
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			})
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
				.r-price {
					.proce-num {
						font-weight: bold;
						font-size: 40rpx;
					}
					color: #fe5e10;
				}
				position: absolute;
				bottom: 50%;
				transform: translateY(50%);
				right: 34rpx;
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
