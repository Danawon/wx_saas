<template>
	<view>
		<head-nav
			title="会员卡"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<u-sticky bgColor="#fff">
			<u-tabs
				:scrollable="false"
				:list="tabList"
				lineColor="#FE5E10"
				:activeStyle="{
					color: '#FE5E10',
					fontWeight: 'bold',
					transform: 'scale(1.05)'
				}"
				:inactiveStyle="{
					color: '#606266',
					transform: 'scale(1)'
				}"
				@change="tabsChange"
				:current="tabsCurrent"
			></u-tabs>
		</u-sticky>
		<view class="list-box pad20">
			<view
				class="li mar-t20 pad40 "
				v-for="(item, index) in cardList"
				:key="index"
			>
				<image :src="item.membercard.card_image" width="100%" height="100%" :lazy-load="true" :webp="true"></image>
				<view class="li-t flex-row ">
					<view class="avatar-box">
						<u-avatar
							:src="item.avatar"
							size="140rpx"
						></u-avatar>
					</view>
					<view class="card-name">
						<view class="name">
							{{ item.membercard.name }}
						</view>
						<view class=" martb20 " >
							<view
								class="state1 state flex"
								@click="activateCard(item)"
								v-if="item.status == 0"
							>
								去激活
							</view>
							<view
								class="state1 state flex"
								v-if="item.status == 1"
							>
								{{ item.origin_name }}
							</view>
							<view
								class="state2 state flex"
								v-if="item.status !== 0 && item.status !== 1"
							>
								{{ item.status_text }}
							</view>
						</view>
					</view>
				</view>

				<view class="tips mar-t40">
					<view class="tips-txt flex-row ju-bt">
						<view class="">
							{{ item.store_name || '居家' }}
							<text class="mar-l20" v-if="item.stopusing_count">(已停卡：{{ item.stopusing_count }} 次)</text>
						</view>
						
						<view class="flex-row" v-if="item.status == 1">
							<view class="">
								已约次数：{{ item.total_times - item.number }}
							</view>
							<view class="mar-l20" v-if="item.membercard.times_show">
								总次数：{{ item.total_times}}
							</view>
						</view>
					</view>
					
					<view
						class=""
						
					>
						<view class="slider "v-if="item.status == 1">
							<u-line-progress
								height="12rpx"
								:percentage="((item.expirationday - item.shenday ) / item.expirationday) * 100"
								:showText="false"
								activeColor="#fe5e10"
							></u-line-progress>
						</view>
						<view
							class="tips-time flex-a flex-row ju-bt"
						>
							<!-- 有效期 -->
							<view class="time-l" v-if="item.status === 1">
								有效期：{{ item.expirationtime }}
							</view>
							<view class="time-l cancellation mar-t20" v-if="item.status === 5">
								作废日期：{{ item.nullifytime }}
							</view>
							<view class="operateSty" v-if="item.status != 1 && item.operate ">
								{{ item.operate.type_name }}日期: {{ item.operate.createtime }}
							</view>
							<!-- 剩余次数 -->
							<view class="time-r" v-if="item.status == 1">
								剩余天数：{{ item.shenday }}
							</view>
						</view>
					</view>
				</view>
			</view>

			<u-empty
				v-if="!cardList.length"
				mode="list"
				text="暂无会员卡..."
			></u-empty>
		</view>

		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			@parentConfirm="modalConfirm"
			@parentCancel="modalCancel"
			title="温馨提示"
		>
			<view class="modalTxt pad-b40 flex">
				自激活之日起，有效期为{{ cardTime }}天，是否立即激活？
			</view>
		</modal-tips>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import modalTips from '@/components/modalTips/modalTips.vue';
import { vipCardlist, activationCard } from '@/api/myCenter.js';
export default {
	components: {
		modalTips
	},
	data() {
		return {
			baseUrl: baseUrl,
			tabList: [
				{
					name: '全部',
					state: ''
				},
				{
					name: '未激活',
					state: '0'
				},
				{
					name: '已激活',
					state: '1'
				},
				{
					name: '已过期',
					state: '-1'
				}
			],
			cardList: [],
			// 组件modal状态
			modalShow: false,
			// tabs当前选中
			tabsCurrent: 0,
			// 会员卡id
			cardId: "",
			// 当前页
			current: 1,
			// 用户信息
			userInfo: {},
			// 卡的有效天数
			cardTime: "",
		};
	},
	onLoad(e) {
		if(e.index) {
			this.tabsCurrent = e.index
		}
		this.userInfo = this.$store.getters.getUserInfo;
		this.getVipCard(); // 获取会员卡列表
	},
	onReachBottom() {
		this.current ++ 
		this.getVipCard();
	},
	methods: {
		// 获取会员卡列表
		getVipCard() {
			vipCardlist({
				status: this.tabList[this.tabsCurrent].state,
				list_rows: 10,
				page: this.current
			}).then(res => {
				this.cardList = [...this.cardList, ...res.data.data];
			});
		},
		// 激活会员卡
		activationCardFun() {
			activationCard({
				id: this.cardId
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				this.reset();
				this.getVipCard();
			})
		},
		// tabs选中改变
		tabsChange(eve) {
			this.tabsCurrent = eve.index;
			this.reset();
			this.getVipCard();
		},
		// modal取消
		modalCancel() {
			this.modalShow = false;
		},
		// 重置
		reset() {
			this.current  = 1;
			this.cardList = [];
		},
		// modal确定
		modalConfirm() {
			this.modalShow = false;
			this.reset();
			this.activationCardFun();
		},
		// 激活卡
		activateCard(eve) {
			this.cardTime = eve.expirationday;
			this.cardId = eve.id;
			this.modalShow = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.cancellation{
	color: #808080;
}
.modalTxt {
	font-weight: 400;
	color: rgba(32, 32, 32, 0.6);
	font-size: 32rpx;
	text-align: center;
}
.tips {
	.slider {
		margin: 10rpx 0;
	}
	font-weight: 300;
	color: rgba(206, 170, 126, 0.6);
	font-size: 20rpx;
}
.card-name {
	.state1 {
		background-color: #af8550;
		// width: 120rpx;
	}
	.state2 {
		background-color: #C9CACA;
	}
	.state {
		padding: 0 20rpx;
		color: #fff;
		font-size: 20rpx;
		display: inline-block;
		padding: 8rpx 20rpx;
		border-radius: 30rpx;
	}
	.name {
		font-weight: 500;
		color: #ceaa7e;
		font-size: 30rpx;
	}
	margin-left: 40rpx;
}
.list-box {
	.li {
		width: 100%;
		height: 360rpx;
		position: relative;
		image {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
	}
	width: 100%;
}
</style>
