<template>
	<view>
		<head-nav title="储物柜管理" bgColor="#fff" :goBack="true"></head-nav>
		<view class="page">
		<!-- 	<view class="flex-a ju-bt page-li   padtb20">
				<text>智能柜地址：</text>
				<view class="ipt-box flex-j"><u-input placeholder="单行输入" border="none"></u-input></view>
			</view> -->
			<!-- <view class="flex-a ju-bt page-li   padtb20" v-if="type == 'add'"> -->
			<view class="flex-a ju-bt page-li   padtb20" v-if="type == 'add'">
				<text>门箱编号：</text>
				<view class="ipt-box flex-j"><u-input placeholder="单行输入" v-model="boxNo" type="digit" border="none"></u-input></view>
			</view>
			<view class="flex-a ju-bt page-li  padtb20">
				<text>每天收费：</text>
				<view class="ipt-box flex-j"><u-input placeholder="￥5/天" v-model="price" type="digit" border="none"></u-input></view>
			</view>
			
			<view class="btn flex" @click="confirm">
				保存
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import { setLockerInfo, getLockerInfo, addLocker } from "@/api/admin.js"
export default {
	data() {
		return {
			type: "", // 父级页面 传递类型
			id: "", // 储物柜id
			// 储物柜价格
			price: "",
			// 储物柜信息
			lockerInfo: {}, 
			boxNo: "", // 门箱编号
			
			
		};
	},
	onLoad(eve) {
		this.type = eve.type;
		this.id = eve.id;
		if(this.type == 'set') {
			this.getLockerInfoFun();
		}
	},
	methods: {
		
		confirm() {
			if(this.type == "add") {
				if(!this.lockerInfo || !this.boxNo) {
					uni.showToast({
						title: "请输入设备编号和门箱编号",
						icon: "none"
					})
					return
				}
			}
			if(!this.price) {
				uni.showToast({
					title: "请输入每天租赁的价格",
					icon: "none"
				})
				return
			}
			if(this.type == 'set') {
				this.setLockerInfoFun();
			}else if(this.type == 'add') {
				this.addLockerFun();
			}
		},
		// 获取储物柜价格
		getLockerInfoFun() {
			getLockerInfo({
				id: this.id
			}).then(res => {
				this.price = res.data.day_price
			})
		},
		// 新增储物柜
		addLockerFun() {
			addLocker({
				cabinetId: this.id,
				boxNo: this.boxNo,
				day_price: this.price,
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			})
		},
		// 设置储物柜价格
		setLockerInfoFun() {
			setLockerInfo({
				id: this.id ,
				day_price: this.price,
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			})
		},
	}
};
</script>

<style lang="scss">
.page {
	padding:0 30rpx 30rpx;
	font-size: 28rpx;
	.ipt-box {
		height: 88rpx;
		width: 514rpx;
		background: #f5f5f5;
		border-radius: 24rpx;
		padding-left: 30rpx;
	}
	
	.btn {
		height: 82rpx;
		color: #fff;
		background: #FE5E10;
		border-radius: 54rpx;
		margin-top: 90rpx;
		font-size:  32rpx;
                  
	}
}
</style>
