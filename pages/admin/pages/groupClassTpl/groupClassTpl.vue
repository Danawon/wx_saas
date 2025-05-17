<template>
	<view>
		<head-nav
			title="团课模板"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<!-- tabs模块 -->
		<view class="page-top" @click="jump">
			<text>添加模板</text>
		</view>

		<view class="list-box pad20">
			<view
				class="li mar-b40"
				v-for="(item, index) in list"
				:key="index"
			>
				<view class=" flex-row">
					<view class="li-img flex">
						<image
							:src="item.image"
							mode=""
						></image>
					</view>
					<view
						class="li-info flex-row flex-a ju-bt padlr40"
					>
						<view class="info-l">
							<view class="card-name">{{ item.name }}</view>
							<view class="txt">价格：{{ item.price }}</view>
						</view>
						<view
							class="info-r"
						>
							<view class="btn btn2" @click="jump('edit', item)">编辑</view>
							<view class="btn btn3" @click="delLeagueClassFun(item)">删除</view>
						</view>
					</view>
				</view>
				<u-line margin="40rpx 0"></u-line>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { LeagueClassList, delLeagueClass } from '@/api/admin.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 当前页
			 current: 1,
			 // 数据列表
			 list: [],
		};
	},
	onShow() {
		this.current = 1;
		this.list = [];
		this.getLeagueClassList();
	},
	onReachBottom() {
		this.current ++
		this.getLeagueClassList();
	},
	methods: {
		// 删除团课模板
		delLeagueClassFun(e) {
			delLeagueClass({
				id: e.id
			}).then(res => {
				uni.showToast({
					title: res.msg,
				})
				setTimeout(() => {
					this.current = 1;
					this.list = [];
					this.getLeagueClassList();
				},1000)
			})
		},
		// 获取团课列表
		getLeagueClassList() {
			LeagueClassList({
				page: this.current,
				list_rows: 20,
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			})
		},
		//跳转添加模板
		jump(type, item) {
			if(type == "edit") {
				uni.navigateTo({
					url:
						`/pages/admin/pages/groupClassTplAdd/groupClassTplAdd?type=${type}&id=${item.id}`
				});
			}else {
				uni.navigateTo({
					url:
						`/pages/admin/pages/groupClassTplAdd/groupClassTplAdd`
				});
			}
			
		}
	}
};
</script>

<style lang="scss" scoped>
.page-top {
	height: 174rpx;
	background: url(https://jp.csxclxs.cn/20220707/manager/add_bg.png)
		no-repeat;
	background-position: center;
	background-size: 95% 174rpx;
	padding-top: 82rpx;
	text-align: center;
	font-size: 28rpx;
	color: #c9caca;
	margin-bottom: 30rpx;
}

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
			image {
				width: 100%;
				height: 120rpx;
			}

			width: 22%;
			height: 200rpx;
		}
	}
}
</style>
