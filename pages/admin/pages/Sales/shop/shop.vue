<template>
	<view>
		<!-- 教练查询用户 -->
		<head-nav title="店面申请" bgColor="#fff" :goBack="true"></head-nav>

		<view class="search-box  pad20">
			<view class="search-ipt">
				<u-search
					borderColor="#FE5E10"
					shape="round"
					bgColor="#fff"
					height="70rpx"
					placeholder="搜索关键词"
					:showAction="false"
					:inputStyle="{
						'padding-right': '95rpx'
					}" 
					v-model="keyword"
					@search="init"
					@change="init"
				></u-search>
			</view>
			<view class="search-btn flex" >搜索</view>
		</view>
		<view class=" pad-b20 pad-t20">
			<u-tabs
				:list="list1"
				lineColor="#FE5E10"
				:activeStyle="{
					color: '#FE5E10',
					fontWeight: 'bold'
				}"
				:inactiveStyle="{
					color: '#999'
				}"
				:itemStyle="{
					width: '50%',
					paddingBottom: ' 20rpx'
				}"
				 @click="tabClick"
			></u-tabs>
		</view>
		<u-line></u-line>
		<view class="list-box pad20 mar-t20">
			<view class="li " v-for="(item, index) in list" :key="index">
				<view class="flex-row flex-a ju-bt">
					<view class="li-avatar flex-row flex-a">
						<u-avatar :src="item.avatar" size="128rpx"></u-avatar>
						<view class=" mar-l20">
							<view class="name">{{item.name}}</view>
							<view class="msg">地址：{{item.province_name+item.city_name+item.area_name}}</view>
							<view class="msg">手机号：{{item.phone}}</view>
						</view>
					</view>
					<view class="li-r"> <view class="btn flex" v-if="tabIndex==0" @click="shop(item)">申请</view>  
					<view class="btn  flex" :class="{btn1: tabIndex==1 && item.status_text=='申请失败'}"  v-if="tabIndex==1">{{item.status_text}}</view> </view>
				</view>
				<u-line margin="40rpx 0"></u-line>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
	import {getShop,putShop} from '@/api/sales.js'
export default {
	data() {
		return {
			baseUrl: baseUrl,
			keyword:'',
			tabIndex:0,
			list:[],
			allData:{},
			list1: [
				{
					name: '未申请'
				},
				{
					name: '已申请'
				}
			],
			roleType: "", // 身份类型
		};
	},
	onLoad(op) {
		this.roleType = op.type; 
		this.init()
	},
	methods: {
		// 选中tabs
		clickTabs(eve) {
			this.currentTabs = eve;
		},
		// 获取页面列表数据
		init(){
			getShop({
				keyword:this.keyword,
				type: this.roleType
			}).then(res=>{
				this.allData = res.data
				if(this.tabIndex==0){
					this.list = this.allData.unapplication
				}else {
					this.list =  this.allData.application
				} 
			}) 
		},
		//点击申请
		shop(item){
			putShop({store_id: item.id,type: this.roleType}).then(res=>{
				 uni.showToast({
				 	title: res.msg,
					icon: 'none'
				 })
				 setTimeout(() => {
					 this.init()
				 },1500)
			}) 
		},
		//点击切换
		tabClick(item){
			this.tabIndex = item.index
			if(this.tabIndex==0){
				this.list = this.allData.unapplication
			}else {
				this.list =  this.allData.application
			} 
		}
	}
};
</script>

<style lang="scss" scope>
.list-box {
	.li {
		.li-r {
			.btn {
				font-weight: 400;
				color: #fe5e10;
				font-size: 28rpx;
				width: 120rpx;
				height: 60rpx;
				border-radius: 15rpx;
				border: 1px solid #fe5e10;
			}
			.btn1 {
				border: 1rpx solid #FF0D0E;
				color: #FF0D0E;
			}
		}
		.li-avatar {
			.name {
				font-weight: 400;
				color: #202020;
				font-size: 32rpx;
			}

			.msg {
				font-size: 28rpx;
				color: #999999;
			}
		}
	}
}
.search-box {
	.search-btn {
		width: 150rpx;
		height: 75rpx;
		color: #fff;
		font-size: 28rpx;
		margin-left: -20rpx;
		background: linear-gradient(102deg, #ff7c3c 0%, #fe5e10 100%);
		border-radius: 50rpx;
		position: absolute;
		top: 20rpx;
		right: 20rpx;
	}
	.search-ipt {
		width: 95%;
	}
	width: 100%;
	position: relative;
	// margin: 40rpx 0;
}
.selectTabs {
	font-weight: 500 !important;
	color: #fe5e10 !important;
}
.tab-li {
	.li-tit {
		margin-right: 6rpx;
	}
	font-size: 28rpx;
	font-weight: 400;
	color: #999999;
}
</style>
