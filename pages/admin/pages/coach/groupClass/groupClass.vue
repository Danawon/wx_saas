<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="团课管理"
		></head-nav>
		<view class="page">
			<view class="list-box pad20">
				<view
					class="li "
					v-for="(item, index) in list"
					:key="index"
					@click="goRouter(item)"
				>
					<view class=" flex-row">
						<view class="li-img flex">
							<u--image 
								:showLoading="true" 
								shape="circle" 
								:src="item.image" 
								width="80px" 
								height="80px" 
							></u--image>
						</view>
						<view
							class="li-info flex-row flex-a ju-bt padlr20"
						>
							<view class="info-l">
								<view class="card-name">
									{{ item.name }}
								</view>
								<view class="txt">
									单次约课金额：{{
										item.price
									}}
								</view>
								<view class="txt">
									最少人数：{{ item.min }}
								</view>
								<view class="txt">
									最多人数：{{ item.max }}
								</view>
							</view>
							<view
								class="info-r"
								@click.stop="goRouter(item)"
							>
								<view class="btn btn2">
									发布
								</view>
							</view>
						</view>
					</view>
					<u-line margin="20rpx 0"></u-line>
				</view>
				<u-empty
					v-if="!list.length"
					mode="list"
					text="暂无数据..."
				></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { LeagueClassList } from '@/api/admin.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			current: 1,
			list: []
		};
	},
	onLoad() {
		this.getLeagueClassList();
	},
	onReachBottom() {
		this.current++;
		this.getLeagueClassList();
	},
	methods: {
		// 获取团模板列表
		getLeagueClassList() {
			LeagueClassList({
				page: this.current,
				list_rows: 20
			}).then(res => {
				this.list = [...this.list, ...res.data.data];
			});
		},
		// 跳转详情
		goRouter(eve) {
			uni.navigateTo({
				url: `/pages/admin/pages/coach/release/release?id=${
					eve.id
				}`
			});
		}
	}
};
</script>

<style lang="scss">
.page {
	padding: 26rpx 24rpx;

	.list-box {
		.li {
			.li-info {
				.info-r {
					.btn1 {
						color: #fe5e10;
						border: 1px solid #fe5e10;
						margin-bottom: 15rpx;
					}
					.btn2 {
						background-color: #fe5e10;
						color: #fff;
					}
					.btn3 {
						background-color: #ff0d0e;
						color: #fff;
					}
					.btn {
						padding: 12rpx 35rpx;
						border-radius: 35rpx;
						font-weight: 400;
						font-size: 28rpx;
						margin-bottom: 10rpx;
					}
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
				width: 22%;
				height: 200rpx;
			}
		}
	}
}
</style>
