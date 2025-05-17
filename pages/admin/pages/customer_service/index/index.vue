<template>
	<view>
		<!-- 客服页 -->
		<view class="page">
			<img
				:src="baseUrl + 'manager/topBg.png'"
				class="img-bg"
			/>
			<head-nav
				bgColor="rgba(0,0,0,0)"
				:goBack="true"
				titColor="#fff"
				title=" "
			></head-nav>
			<view style="position: relative;">
				<!-- 头部 -->
				<view
					class="page-top"
					@click="
						jump(
							'/pages/admin/pages/dietitian/info/info'
						)
					"
				>
					<view class="img-box">
						<u--image
							:src="userInfo.avatar"
							width="96rpx"
							height="96rpx"
							shape="circle"
						></u--image>
					</view>
					<text class="head-txt">
						{{ userInfo.name }}
					</text>
					<view class="icon-right">
						<u-icon
							name="arrow-right"
							color="#fff"
							size="40rpx"
						></u-icon>
					</view>
				</view>
				<view
					class="padlr20 martb20"
					@click="show = true"
				>
					<u-input
						placeholder="选择时间（默认展示全部时间）"
						prefixIcon="clock"
						v-model="timeObj.name"
						:disabled="true"
						disabledColor="#fff"
					></u-input>
				</view>
				<view class="record-li padlr20 pad-b40">
					<view
						class="li pad20 mar-t40"
						v-for="(item, index) in list"
						:key="index"
						@click="goRoute(item.id)"
					>
						<view class="flex-row flex-a ju-bt">
							<view class="li-tit">
								<view class="time">
									{{ item.createtime }}
								</view>
								<view class="title">
									{{ item.title }}
								</view>
							</view>
							<view class="icon-box">
								<u-icon
									name="arrow-right"
									size="16"
								></u-icon>
							</view>
						</view>
						<view
							class="time-tips felx-row flex-a"
							v-if="item.user_num > 0"
						>
							<view class="tips-circle"></view>
							<view class="tips-txt">
								有新的回复
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
		</view>
		<timePopup
			:show="show"
			@change="determine"
			@close="close"
		></timePopup>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getInfo } from '@/api/dietician.js';
import {
	getList,
	getListAdmin
} from '@/api/customer_service.js';
import timePopup from '@/components/timePopup/timePopup.vue';
export default {
	components: {
		timePopup
	},
	data() {
		return {
			baseUrl: baseUrl,
			userInfo: {}, //个人信息
			list: [], //页面数据
			type: 'admin', // admin 从管理端进
			current: 1,
			timeObj: { // 选中日期
				name: "最近七天",
				value: "7day",
			}, 
			show: false //时间弹框显示隐藏
		};
	},
	onLoad() {
		this.init();
	},
	onShow() {
		this.current = 1;
		this.list = [];
		this.getMessageList();
	},
	onReachBottom() {
		this.current++;
		this.getMessageList();
	},
	methods: {
		// 跳转页面
		goRoute(id) {
			uni.navigateTo({
				url:
					'/pages/myCenter/pages/serviceDetail/serviceDetail?type=' +
					this.type +
					'&id=' +
					id
			});
		},
		//初始化页面 ---管理员
		getMessageList() {
			getListAdmin({
				page: this.current,
				list_rows: 10,
				date: this.timeObj.value ?? ''
			}).then(res => {
				this.list = [...this.list, ...res.data.data];
			});
		},
		init() {
			getInfo().then(res => {
				this.userInfo = res.data;
			});
		},
		//时间弹框打开
		time() {
			this.show = true;
		},
		//关闭
		close() {
			this.show = false;
		},
		//确定
		determine(item) {
			this.timeObj = item;
			this.close();
			this.current = 1;
			this.list = [];
			this.getMessageList();
		}
	}
};
</script>

<style lang="scss" scoped>
.record-li {
	.li {
		.time {
			font-size: 24rpx;
			color: #999;
		}
		.icon-box {
			width: 5%;
		}
		.li-tit {
			.title {
				margin-top: 10rpx;
			}
			width: 90%;
		}
		.time-tips {
			.tips-txt {
				font-weight: 400;
				color: #e6102e;
				font-size: 24rpx;
			}
			.tips-circle {
				width: 15rpx;
				height: 15rpx;
				border-radius: 50%;
				background-color: #e6102e;
				margin-right: 10rpx;
			}
			position: absolute;
			right: 25rpx;
			top: -15rpx;
		}
		position: relative;
		border-radius: 20rpx;
		box-shadow: 1px 1px 10rpx 5rpx #ccc;
		font-size: 26rpx;
	}
}

.page {
	// background-color: #FF925D;

	.img-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 352rpx;
	}

	.page-top {
		width: 100%;
		padding: 38rpx 34rpx 50rpx 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;

		.head-txt {
			font-size: 36rpx;
			font-family: PingFang SC-Semibold, PingFang SC;
			font-weight: 600;
			color: #ffffff;
			margin-left: 32rpx;
		}

		.icon-right {
			margin-left: auto;
		}
	}

	.pad-t80 {
		padding-top: 80rpx;
	}
}
</style>
