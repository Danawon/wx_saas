<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="修改资料"></head-nav>
		<view class="list">
			<view class="li padtb40 pad-r20 pad-l20 ju-bt flex-a">
				<text>头像</text>
				<view class="flex">
					<u-upload
						:fileList="avatar"
						@afterRead="afterReadAvatar"
						@delete="deleteAvatar"
						name="1"
						multiple
						:maxCount="1"
						width="150rpx"
						height="150rpx"
					></u-upload>
					<u-icon
						name="arrow-right"
						color="#ccc"
						size="32rpx"
					></u-icon>
				</view>
			</view>
			<view class="li padtb40 pad-r20 pad-l20 ju-bt flex-a" @click.stop="show">
				<text>昵称</text>
				<view class="flex">
					<text>{{shopName || '请填写'}}</text>
					<u-icon name="arrow-right" color="#ccc" size="32rpx"></u-icon>
				</view>
			</view> 
		</view>
		
		<view class="fot-box ">
			<view class="btn flex" @click="confirmFun">
				确定
			</view>
		</view>
		<modal-tips ref="modalTipsRef" :modalShow="modalShow" :title="' '" confirmText="确定" cancelText="取消"
			confirmColor="#FE5E10" cancelColor="#e5e5e5" @parentConfirm="modalConfirm" @parentCancel="modalCancel">
			<view class="modalTxt pad-b40 flex">
				<u-input placeholder="请输入昵称" border="surround" v-model="shopName"></u-input>
			</view>
		</modal-tips>
		
	</view>
</template>

<script>
	import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
	import modalTips from '@/components/modalTips/modalTips.vue'; 
	import {getInfo,editInfo} from '@/api/sales.js'
	export default {
		components: {
			modalTips, 
		},
		data() {
			return {
				baseUrl: baseUrl,
				modalShow: false, //修改昵称弹框true显示false隐藏
				shopName: '', //店铺昵称 
				salesData:{}, //基本信息
				avatar: [] ,// 头像
			};
		},
		onShow() {
			this.getInfo()
		},
		methods: {
			confirmFun() {
				editInfo({
					name:this.shopName,
					avatar: this.avatar[0].url,
				}).then(res=>{
					if(res.code==200){
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
						this.modalCancel()
					}
				})
			},
			//修改昵称弹框---确认框  
			modalConfirm() {
				if(!this.shopName){
					uni.showToast({
						title: '请填写昵称',
						icon: 'none'
					})
					return
				}
				this.modalCancel();
			},
			//修改昵称弹框---取消
			modalCancel() { 
				this.modalShow = false
			},
			//修改昵称弹框---展示
			show() {
				this.modalShow = true
			},
			 //获取基本信息
			 getInfo(){
			 	getInfo().then(res=>{ 
			 		if(res.code==200){
			 			this.salesData = res.data
						this.shopName = res.data.name
						this.avatar = [{ url: res.data.avatar }];
			 		}
			 	})
			 },
			 //跳转页面
			 jump(url) {
			 	uni.navigateTo({
			 		url: url
			 	})
			 },
			 // 删除 图片
			 deleteAvatar(eve) {
			 	this.avatar.splice(eve.index, 1);
			 },
			 // 新增 图片
			 async afterReadAvatar(eve) {
			 	// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			 	eve.file.forEach(item => {
			 		this.uploadFilePromise(item.url);
			 	});
			 },
			 // 上传
			 uploadFilePromise(url, type) {
			 	uni.uploadFile({
			 		url: `${baseUrlApi}upload/file`, // 仅为示例，非真实的接口地址
			 		filePath: url,
			 		name: 'image',
			 		header: {
			 			'Authori-zation':
			 				'Bearer' +
			 				' ' +
			 				uni.getStorageSync('token')
			 		},
			 		formData: {
			 			image: url,
			 			type: 'clockin'
			 		},
			 		success: res => {
			 			let data = JSON.parse(res.data);
						if(data.code == 200) {
							this.avatar = [{ url: data.data }];
						}else {
							uni.showToast({
								title: data.msg,
								icon: "none"
							})
						}
			 		},
			 		fail: err => {
			 		}
			 	});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fot-box {
		.btn {
			width: 100%;
			height: 80rpx;
			color: #fff;
			border-radius: 40rpx;
			background-color: #fe5e10;
		}
		padding: 20rpx 20rpx 50rpx;
		position: fixed;
		bottom: 0rpx;
		left: 0;
		width: 100%;
		// background-color: #fff;
	}
	.list {
		background-color: #F5F5F5;
		height: 100vh;

		.li {
			width: 100%;
			background-color: #fff;
			margin-bottom: 10rpx;
			font-size: 28rpx;
		}

	}
</style>
