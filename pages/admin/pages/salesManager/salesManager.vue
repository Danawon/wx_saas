<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="门店销售审核"></head-nav>
		<view class="page">
			<view class="page-top flex-a">
				<view class="flex flex-col top-li" v-for="(item,index) in nav" :key="index"
					:class="{on :index == navIndex}" @click="navClick(index)">
					<text>{{item.tit}}</text>
					<text class="bor"></text>
				</view>
			</view>
			<view class="page-list padtb40 padlr40">
				<view class="page-li flex-a mar-b40" v-for="(item,index) in list" :key="index">
					<view class="img-box">
						<u-avatar :src="item.avatar" size="128rpx"></u-avatar>
					</view>
					<view class="msg-box pad-l20 flex-col">
						<text>{{ item.name }}</text>
						<text class="time">申请时间：{{ item.createtime }}</text>
						<text>申请角色：{{ item.position }}</text>
					</view>

					<view class="flex-col btn-box" v-if="navIndex==0">
						<view class="btn pass flex" @click="passFun(item, 'pass')"> 通过 </view>
						<view class="btn nopass flex" @click="passFun(item, 'refuse')"> 拒绝 </view>
					</view>
					<view class="flex-col btn-box" v-if="navIndex==1">
						<view class="btn pass flex"> 已通过 </view>
					</view>
					<view class="flex-col btn-box" v-if="navIndex==2">
						<view class="btn nopass flex"> 已拒绝 </view>
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
	import { baseUrl } from '@/utils/baseUrl.js';
	import { saleAuditList, passCoachAudit } from "@/api/admin.js"
	export default {
		data() {
			return {
				//导航栏
				nav: [
					{
						tit: "审核中",
						state: 0
					},{
						tit: "通过",
						state: 1
					},{
						tit: "驳回",
						state: -1
					},
				], 
				navIndex: 0, //选中的导航
				baseUrl: baseUrl,
				// 当前页
				current: 1,
				// 列表
				list: [],
			};
		},
		onLoad() {
			this.getSaleAuditList();
		},
		onReachBottom() {
			this.current ++;
			this.getSaleAuditList();
		},
		methods: {
			// 通过
			passFun(eve,type) {
				passCoachAudit({
					id: eve.id,
					status: type
				}).then(res => {
					uni.showToast({
						title: res.msg
					})
					setTimeout(() => {
						this.resetFun();
						this.getSaleAuditList();
					},600)
				})
				
			},
			// 数据重置
			resetFun() {
				this.list = [];
				this.current = 1;
				this.navIndex = 0;
				
			},
			//导航栏
			navClick(index) {
				this.resetFun();
				this.navIndex = index
				this.getSaleAuditList();
			},
			// 获取教练审核列表
			getSaleAuditList() {
				saleAuditList({
					examine_status: this.nav[this.navIndex].state,
					page: this.current,
					list_rows: 20
				}).then(res => {
					this.list = [...this.list,...res.data.data]
				})
			},
		}
	}
</script>

<style lang="scss">
	.page {
		.page-top {
			height: 92rpx;

			.top-li {
				height: 92rpx;
				font-size: 28rpx;
				color: rgba(0, 0, 0, 0.6);
				width: 33%;
				position: relative;

				.bor {
					width: 112rpx;
					height: 3rpx;
					background: #E7E7E7;
					position: absolute;
					bottom: 0;
					transform: translateX(-50%);
					left: 50%;
				}
			}

			.top-li.on {
				color: #FE5E10;
				font-weight: 600;

				.bor {
					background: #FE5E10;
				}
			}
		}

		.page-list {

			.msg-box {
				font-size: 32rpx;

				.time {
					font-size: 22rpx;
					color: rgba(0, 0, 0, 0.6);
				}
			}

			.btn-box {
				margin-left: auto;

				.btn {
					width: 104rpx;
					height: 58rpx;
					font-size: 28rpx;
					background: rgba(255, 255, 255, 0);
					border-radius: 10rpx;
				}

				.btn.pass {
					border: 1px solid rgba(13, 188, 20, 0.9);
					color: #0DBC14;
					margin-bottom: 20rpx;
				}

				.btn.nopass {
					border: 1px solid #FE5E10;
					color: #FE5E10;
				}
			}
		}

	}
</style>
