<template>
	<view class="wrap-min">
		<head-nav
			title="历史信息"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="content pad20">
			<view class="list-box">
				<view class="li  mar-t20 " v-for="(item, index) in list" :key="index">
					<!-- 时间 -->
					<view class="li-head flex-row flex-a ju-bt ">
						<view class="hea-l">{{ item.createtime }}</view>
						<view class="hea-r">第{{ item.key }}次</view>
					</view>
					<!-- 状态 -->
					<view class="state-box flex-row flex-a">
						<view class="state-l flex-col ju-ar">
							<view class="l-top flex-row flex-a">
								<view
									class="tag-box flex-row flex-a"
								>
									<view
										class="color-box color1"
									></view>
									<view
										class="color-txt mar-l20"
									>
										较差
									</view>
								</view>
								<view
									class="tag-box flex-row flex-a"
								>
									<view
										class="color-box color2"
									></view>
									<view
										class="color-txt mar-l20"
									>
										合格
									</view>
								</view>
								<view
									class="tag-box flex-row flex-a"
								>
									<view
										class="color-box color3"
									></view>
									<view
										class="color-txt mar-l20"
									>
										良好
									</view>
								</view>
								<view
									class="tag-box flex-row flex-a"
								>
									<view
										class="color-box color4"
									></view>
									<view
										class="color-txt mar-l20"
									>
										优秀
									</view>
								</view>
							</view>
							<view class="l-cen">
								<view
									class="error-box felx-a flex-row"
								>
									<u-icon
										name="error-circle"
										color="#fa130f"
										size="33rpx"
										top="3rpx"
									></u-icon>
									<view
										class="err-info state-txt"
									>
										<!-- {{ item.abnormal_count != null && item.abnormal_count != undefined ? item.abnormal_count : '未知' }}项异常 -->
										{{ !!item.abnormal_count ? item.abnormal_count : '未知' }}项异常
									</view>
								</view>
								<view
									class="normal felx-a flex-row mar-t20"
								>
									<u-icon
										name="checkmark-circle"
										color="#0dbc14"
										size="33rpx"
										top="3rpx"
									></u-icon>
									<view class="state-txt">
										<!-- {{ item.normal_count || '未知' }}项正常 -->
										{{ item.normal_count != null && item.normal_count != undefined ? item.normal_count : '未知' }}项正常
									</view>
								</view>
							</view>
							<view class="r-bom" @click="goRouter(item)">
								<view class="bom-txt" >
									点击查看报告 >
								</view>
							</view>
						</view>
						<view class="state-r flex">
							<ucharts :numberVal="item.calculate_score"></ucharts>
						</view>
					</view>
					
					<!-- 底部提示 -->
					<view class="tips-box pad20 mar-t20">
						{{ item.text }}
					</view>
				</view>
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
import ucharts from './components/ucharts';
import { getHistoryFitness } from "@/api/admin.js"
export default {
	components: {
		ucharts
	},
	data() {
		return {
			current: 1,
			list: [],
			uid: "", // 用户id
			phone: ""
		};
	},
	onLoad(e) {
		this.uid = e.uid ?? '';
		this.phone = e.phone;
		this.getHistoryData();
	},
	
	onReachBottom() {
		this.current ++;
		this.getHistoryData();
	},
	methods: {
		// 获取历史shuju
		getHistoryData() {
			getHistoryFitness({
				page: this.current,
				list_rows:20,
				uid: this.uid
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			})
		},
		goRouter(eve) {
			uni.navigateTo({
				url: `/pages/myCenter/pages/checkReport/checkReport?id=${eve.id}&phone=${this.phone}`
			})
		},
	},
};
</script>

<style lang="scss" scoped>
	.tips-box {
		// background-color: #F5F5F5;
		border-radius: 15rpx;
		font-size: 26rpx;
		text-indent: 2em;
		box-shadow: 0px 0px 15rpx 10rpx #ccc;
	}
.state-box {
	.state-txt {
		margin-left: 10rpx;
		font-weight: 400;
		color: rgba(32, 32, 32, 0.9);
		font-size: 28rpx;
	}
	.state-l {
		.r-bom {
			font-weight: 400;
			color: #999999;
			font-size: 28rpx;
		}
		.l-top {
			.tag-box {
				.color-txt {
					font-size: 20rpx;
					font-weight: 300;
					color: #000000;
				}
				.color1 {
					background-color: #f4433c;
				}
				.color2 {
					background-color: #29cb29;
				}
				.color3 {
					background-color: #9b92ef;
				}
				.color4 {
					background-color: #1179ff;
				}
				.color-box {
					width: 25rpx;
					height: 25rpx;
				}
				margin-bottom: 20rpx;
				width: 50%;
			}
			flex-wrap: wrap;
			width: 100%;
		}
		width: 30%;
		height: 400rpx;
	}
	.state-r {
		width: 70%;
		height: 400rpx;
		padding-top: 15rpx;
	}
	flex-wrap: wrap;
}
.list-box {
	.li {
		.li-head {
			.hea-r {
				font-weight: 500;
				color: #fe5e10;
				font-size: 28rpx;
			}
			.hea-l {
				font-weight: 300;
				color: #999999;
				font-size: 24rpx;
			}
			margin: 10rpx 0;
		}
		width: 100%;
		// height: 300rpx;
		background-color: #fff;
		border-radius: 15rpx;
		padding: 20rpx 30rpx 35rpx;
	}
}
</style>
