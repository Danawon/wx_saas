<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="会员卡消课记录"
		></head-nav>
		<view class="page">
			<view class="calendar-box flex-a">
				<uni-datetime-picker
					v-model="dateRange"
					@change="dateChange"
					type="daterange"
					return-type=""
					rangeSeparator="至"
				/>
			</view>
			<view class="coach-box flex-a" v-if="roleType !== 'store'">
				<text>选择门店</text>
				<view class="ipt-box" @click="showPicker('store')">
					<u-input
						disabled
						placeholder="选择门店"
						border="none"
						suffixIcon="arrow-down"
						suffixIconStyle="color: #000"
						v-model="storeTxt"
					></u-input>
				</view>
			</view>
			<view class="coach-box flex-a mar-t40">
				<text>门店教练</text>
				<view class="ipt-box" @click="showPicker('coach')">
					<u-input
						disabled
						placeholder="选择教练"
						border="none"
						suffixIcon="arrow-down"
						suffixIconStyle="color: #000"
						v-model="coachTxt"
					></u-input>
				</view>
			</view>
			<view class="statistical-box flex-col mar-t20">
				<text>数据总计</text>
				<view class="flex-a ju-bt">
					<view class="flex-col w50 flex">
						<view class="">
							<text class="num">{{ statistics.count || 0 }}</text>
							次
						</view>
						<view class="txt">消课总计</view>
					</view>
					<view class="flex-col w50 flex">
						<view class="">
							￥
							<text class="num">{{ statistics.total_course_fee || 0 }}</text>
						</view>
						<view class="txt">消课金额</view>
					</view>
				</view>
			</view>
			<view class="page-nav flex-a">
				<view
					class="flex flex-col top-li"
					v-for="(item, index) in nav"
					:key="index"
					:class="{ on: index == navIndex }"
					@click="navClick(index)"
				>
					<text>{{ item.name }}</text>
					<text class="bor"></text>
				</view>
			</view>

			<view class="page-list ">
				<view
					v-for="(item, index) in list"
					:key="index"
				>
					<view class="page-li padtb40 flex-a" v-if="item.class_count !== 0">
						<view class="img-box">
							<u--image
								:src="item.user.avatar"
								width="128rpx"
								height="128rpx"
								shape="circle"
							></u--image>
						</view>
						<view class="msg-box pad-l40">
							<view class="name flex-row">
								<view class="">
									{{ item.user.nickname }}
								</view>
								<view class="idSty">
									(id:{{ item.uid }})
								</view>
							</view>
							<view class="time">
								会员卡名称：{{ item.membercard_name || '' }}
							</view>
							<view class="time">
								已消课/总消课：{{ item.class_count }}/{{ item.total_class_count }}
							</view>
							<view class="time">剩余天数：{{ item.shenday }}</view>
							<view class="time">激活时间：{{ item.activation_time }}</view>
							<view class="time">销售金额：{{ item.sale_price }}</view>
							<view class="time">停卡次数：{{ item.stopusing_count }}</view>
						</view>
						<view class="flex-col ju-bt li-right">
							<text class="text">
								销售：{{ item.sale_name || '无' }}
							</text>
							<view class="look flex" @click="jump(item)">
								查看详情
							</view>
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
		<u-picker
			title="请选择教练"
			:show="coachShow" 
			:columns="pickerList" 
			@confirm="selectPicker"
			@close="coachShow = false"
			@cancel="coachShow = false"
			keyName="name"
			:closeOnClickOverlay="true"
		></u-picker>
		<u-picker
			title="请选择门店"
			:show="storeShow" 
			:columns="pickerList" 
			@confirm="selectPicker"
			@close="storeShow = false"
			@cancel="storeShow = false"
			keyName="name"
			:closeOnClickOverlay="true"
		></u-picker>
	</view>
</template>

<script>
import { cardCancelClasses, getCoachList } from '@/api/storeApis.js';
import { shopList } from "@/api/admin.js";
export default {
	data() {
		return {
			show: false, //日历弹框
			nav: [
				{
					name: '私教卡',
					id: 'private_teaching'
				},
				{
					name: '团课卡',
					id: 'league_class'
				}
			], //导航栏
			navIndex: 0, //选中的导航
			current: 1, // 当前页
			dateRange: [],
			list: [],
			statistics: {}, // 统计数据
			storeShow: false,
			storeId: "", // 门店id
			storeTxt: "",
			/* 选中类型 */
			pickerType: '',
			coachShow: false,
			coachTxt: '全部',
			coachId: '',
			pickerList: [],
			roleType: "", // 角色类型
		};
	},
	async onLoad(e) {
		var now = new Date();
		var fd = new Date(now.getFullYear(), now.getMonth()-1 ,1).toLocaleDateString();
		var ed = new Date(now.getFullYear(), now.getMonth(), 0).toLocaleDateString();
		this.dateRange = [fd, ed]
		this.roleType = e.type ?? '';
		this.storeId = e.storeId
		if(!this.storeId) {
			await this.getShopList();
			await this.getCoachListFun();
			await this.getCardCancelClasses();
		}else {
			await this.getCoachListFun();
			await this.getCardCancelClasses();
		}
	},
	onReachBottom() {
		this.current ++ ;
		this.getCardCancelClasses();
	},
	onShow() {
		// this.onReset();
	},
	methods: {
		/* 显示 picker */
		showPicker(type) {
			if(type == 'coach') {
				this.coachShow = true
				this.getCoachListFun();
			}else {
				this.storeShow = true
				this.getShopList();
			}
			this.pickerType = type;
		},
		// 选中picker
		selectPicker(e) {
			if(this.pickerType == 'coach') {
				this.coachId = e.value[0].id;
				this.coachTxt = e.value[0].name;
				this.coachShow = false;
			}else {
				this.coachId = '';
				this.coachTxt = '全部';
				this.storeId = e.value[0].id;
				this.storeTxt = e.value[0].name;
				this.storeShow = false;
			}	
			this.onReset();
		},
		/* 获取门店列表 */
		getShopList() {
			return shopList().then(res => {
				this.pickerList = [res.data];
				if(this.roleType !== 'store') {
					this.storeId = res.data[0].id;
					this.storeTxt = res.data[0].name;
				}
			})
		},
		// 获取教练列表
		getCoachListFun() {
			let _this = this;
			return getCoachList({
				store_id: this.storeId
			}).then(res => {
				res.data.unshift({name: '全部', id: ''})
				_this.pickerList = [res.data];
			});
		},
		onReset() {
			this.current = 1;
			this.list = [];
			this.getCardCancelClasses();
		},
		// 选中日期
		dateChange(eve) {
			this.dateRange = eve;
			this.onReset();
		},
		/* 获取数据 */
		getCardCancelClasses() {
			cardCancelClasses({
				page: this.current,
				list_rows: 10,
				product: this.nav[this.navIndex].id,
				date: this.dateRange.join(','),
				coach_id: this.coachId,
				store_id: this.storeId
			}).then(res => {
				this.list = [...this.list, ...res.data.list.data];
				this.statistics = res.data.statistics;
			});
		},
		//导航栏
		navClick(index) {
			this.navIndex = index;
			this.onReset();
		},
		//查看详情
		jump(item) {
			uni.navigateTo({
				url: `/pages/admin/pages/classRecordDetail/classRecordDetail?card_id=${item.id}&coachId=${this.coachId || ''}&date=${this.dateRange.join(',') || ''}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.idSty {
		font-size: 24rpx;
		color: #999;
		margin-left: 10rpx;
	}
.page {
	padding: 28rpx;

	.calendar-box {
		height: 76rpx;
		border-radius: 8rpx;
		border: 2rpx solid #999999;
		margin: 0 10rpx;
		font-size: 26rpx;
		margin-bottom: 36rpx;
		.txt {
			color: #999999;
			margin: 0 15rpx;
			text-align: center;
			width: 240rpx;
		}
		text {
			margin: 0 15rpx;
		}
	}
	.coach-box {
		text {
			margin-right: 30rpx;
		}
		.ipt-box {
			border-radius: 8rpx;
			background: #f9f9f9;
			width: 75%;
			flex-shrink: 0;
			padding: 14rpx 0 14rpx 34rpx;
		}
	}

	.btn {
		font-size: 32rpx;
		color: #ffffff;
		height: 74rpx;
		background: #fe5e10;
		border-radius: 58rpx;
	}

	.statistical-box {
		background-color: #ffe6da;
		border-radius: 24rpx;
		padding-bottom: 26rpx;
		text {
			padding: 26rpx;
			margin-bottom: 10rpx;
			font-size: 32rpx;
			text-align: center;
			color: #202020;
		}

		.txt {
			font-size: 22rpx;
			color: #999999;
		}
		.num {
			font-weight: 600;
			padding: 0;
			font-size: 40rpx;
		}
	}

	.page-nav {
		height: 92rpx;
		border-bottom: 1rpx solid #e7e7e7;

		.top-li {
			height: 92rpx;
			font-size: 28rpx;
			color: rgba(0, 0, 0, 0.6);
			width: 50%;
			position: relative;

			.bor {
				width: 112rpx;
				height: 3rpx;
				background: #e7e7e7;
				position: absolute;
				bottom: 0;
				transform: translateX(-50%);
				left: 50%;
			}
		}

		.top-li.on {
			color: #fe5e10;
			font-weight: 600;

			.bor {
				background: #fe5e10;
			}
		}
	}

	.page-list {
		.page-li {
			border-bottom: 1rpx solid #e7e7e7;
			// align-items: flex-start;

			.name {
				font-size: 28rpx;
				font-weight: 500;
				color: #202020;
			}

			.time {
				margin-bottom: 10rpx;
				font-weight: 400;
				font-size: 22rpx;
				color: #999999;
			}
			.li-right {
				margin-left: auto;
				height: 230rpx;
			}
			.text {
				color: #fe5e10;
				font-size: 24rpx;
			}
			.look {
				border: #999999 1rpx solid;
				border-radius: 8rpx;
				color: #999999;
				width: 176rpx;
				height: 58rpx;
				font-size: 28rpx;
			}
		}
	}
}
</style>
