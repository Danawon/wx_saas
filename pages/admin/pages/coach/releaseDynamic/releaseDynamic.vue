<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="发布动态"
		></head-nav>
		<view class="page">
			<view class="textarea-box">
				<u-textarea
					placeholder="写写东西吧~"
					maxlength="-1"
					v-model="info"
					height="300"
				></u-textarea>
			</view>
			<view class="upload pad20">
				<u-upload
					:fileList="infoImg"
					@afterRead="afterReadAvatar"
					@delete="deleteAvatar"
					name="1"
					:maxCount="16"
					multiple
					width="200rpx"
					height="200rpx"
				></u-upload>
			</view>
		</view>
		<view class="fot-box ">
			<view class="btn flex" @click="confirmFun">
				确定
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import { coachInfo, editCoachInfo } from '@/api/admin.js';
import { editStr, editArr } from "@/common/common.js"
export default {
	data() {
		return {
			info: "", // 介绍
			infoImg: [],
		};
	},
	onLoad() {
		this.getCoachInfo();
	},
	methods: {
		// 获取教练信息
		getCoachInfo() {
			coachInfo().then(res => {
				this.info = res.data.info;
				this.infoImg = editArr(res.data.info_image);
			});
		},
		confirmFun() {
			editCoachInfo({
				info: this.info,
				info_image: editStr(this.infoImg)
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			});
		},
		// 删除 图片
		deleteAvatar(eve) {
			this.infoImg.splice(eve.index, 1);
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
						this.infoImg.push({ url: data.data });
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
};
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
/deep/ .up-icon,
.up-icon {
	background: #f9f9f9;
	height: 200rpx;
	border-radius: 24rpx;
	width: 200rpx;
}
.page {
	padding: 26rpx 24rpx;
}
</style>
