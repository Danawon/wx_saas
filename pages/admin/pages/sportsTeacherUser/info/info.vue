<template>
	<view class="wrap-min">
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="修改资料"></head-nav>
		<view class="list">
			<view class="li padtb40 pad-r20 pad-l20 ju-bt flex-a">
				<text>头像</text>
				<view class="flex">
					<!-- <u--image  width="66rpx" height="66rpx"></u--image> -->
					<!-- <u-avatar :src="baseUrl + 'manager/yhj.png'" shape="circle" size="66rpx"></u-avatar>
					<u-icon name="arrow-right" color="#ccc" size="32rpx"></u-icon> -->
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
			<view class="li padtb40 pad-r20 pad-l20 ju-bt flex-a"@click.stop="show(1)">
				<text>名称</text>
				<view class="flex">
					<text>{{ infoData.name || "请输入" }}</text>
					<u-icon name="arrow-right" color="#ccc" size="32rpx"></u-icon>
				</view>
			</view>
			<view
				class="li padtb40 pad-r20 pad-l20 ju-bt flex-a"
				@click.stop="show(2)"
			>
				<text>电话</text>
				<view class="flex">
					<text>{{ infoData.mobile || '请填写' }}</text>
					<u-icon
						name="arrow-right"
						color="#ccc"
						size="32rpx"
					></u-icon>
				</view>
			</view>
			 
			<view class="li padtb40 pad-r20 pad-l20 ju-bt flex-a" @click="jump('/pages/admin/pages/coach/releaseDynamic/releaseDynamic')" >
				<text>个人介绍</text>
				<view class="flex">
					<u-icon name="arrow-right" color="#ccc" size="32rpx"></u-icon>
				</view>
			</view>
			
			<view class="li padtb40 pad-r20 pad-l20 ju-bt flex-a"  @click="jump('/pages/admin/pages/coach/studentCase/studentCase')">
				<text>学员案例</text>
				<view class="flex">
					<u-icon name="arrow-right" color="#ccc" size="32rpx"></u-icon>
				</view>
			</view>
			<view
				class="li padtb40 pad-r20 pad-l20 ju-bt flex-a"
				@click="
					jump('/pages/admin/pages/coach/label/label')
				"
			>
				<text>标签</text>
				<view class="flex">
					<u-icon
						name="arrow-right"
						color="#ccc"
						size="32rpx"
					></u-icon>
				</view>
			</view>
		 
		</view>
		
		<view class="fot-box ">
			<view class="btn flex" @click="confirmFun">
				确定
			</view>
		</view>
		
		<modal-tips ref="modalTipsRef" :modalShow="modalShow" :title="onType== '1' ? '编辑名称' : '编辑电话'" confirmText="确定" cancelText="取消"
			confirmColor="#FE5E10" cancelColor="#e5e5e5" @parentConfirm="modalConfirm" @parentCancel="modalCancel">
			<view class="modalTxt pad-b40 flex">
				<u-input placeholder="请输入昵称" border="surround" v-model="infoData.name" v-if="onType == 1"></u-input>
				<u-input
					v-if="onType == 2"
					placeholder="请输入电话"
					border="surround"
					type="number"
					v-model="infoData.mobile"
				></u-input>
			</view>
		</modal-tips>
		
	</view>
</template>

<script>
	import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
	import modalTips from '@/components/modalTips/modalTips.vue'; 
	import { sportsTeacherInfo, sportsTeacherEdit } from "@/api/sportsTeacher.js"
	export default {
		components: {
			modalTips, 
		},
		data() {
			return {
				baseUrl: baseUrl,
				modalShow: false, //修改昵称弹框true显示false隐藏
				avatar: [] ,// 头像
				infoData: {},
				/* 点击类型 */
				onType: "",
			};
		},
		onLoad() {
		},
		onShow() {
			this.getSportsTeacherInfo();
		},
		methods: {
			confirmFun() {
				sportsTeacherEdit({
					name: this.infoData.name,
					avatar: this.avatar[0].url,
					mobile: this.infoData.mobile
				}).then(res => {
					uni.showToast({
						title: res.msg
					})
					setTimeout(() => {
						this.getSportsTeacherInfo();
					}, 1000)
				})
			},
			// 获取信息
			getSportsTeacherInfo() {
				sportsTeacherInfo().then(res => {
					this.infoData = res.data;
					this.avatar = [{url: res.data.avatar}]
				})
			},
			//修改昵称弹框---确认框  
			modalConfirm() {
				this.modalCancel()
			},
			//修改昵称弹框---取消
			modalCancel() {
				this.modalShow = false
			},
			//修改昵称弹框---展示
			show(type) {
				this.onType = type;
				this.modalShow = true;
			},
			 
			 //跳转页面
			 jump(url) {
			 	uni.navigateTo({
			 		url: `${url}?data=${JSON.stringify(this.infoData)}`
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
		// background-color: #F5F5F5;
		// height: 100vh;

		.li {
			width: 100%;
			background-color: #fff;
			margin-bottom: 10rpx;
			font-size: 28rpx;
		}

	}
</style>
