<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="店铺详情"
		></head-nav>
		<view class="page padtb40 padlr40">
			<view class="title padtb20">门店介绍</view>
			<view class="">
				<u-textarea
					v-model="value"
					autoHeight
					height="288"
					placeholder="请输入内容"
					maxlength="-1"
				></u-textarea>
			</view>
			<view class="title padtb20">门店介绍图片</view>
			<view class="">
				<u-upload
					:fileList="equipmentImg"
					@afterRead="afterReadeQuipment"
					@delete="deleteeQuipment"
					name="6"
					multiple
					
					width="180rpx"
					height="180rpx"
				>
					<view class="up-icon flex">
						<u-icon
							name="plus"
							color="#999999"
							size="45rpx"
						></u-icon>
					</view>
				</u-upload>
			</view>
			<view class="title padtb20">运动器械说明</view>
			<view class="">
				<u-textarea
					v-model="value2"
					autoHeight
					height="288"
					placeholder="请输入内容"
					maxlength="-1"
				></u-textarea>
			</view>
			
			<view class="title padtb20">运动器材图片</view>
			<view class="">
				<u-upload
					:fileList="sportsImg"  
					@afterRead="afterReadeSports"
					@delete="deleteeSports"
					name="6"
					multiple
					
					width="180rpx"
					height="180rpx"
				>
					<view class="up-icon flex">
						<u-icon
							name="plus"
							color="#999999"
							size="45rpx"
						></u-icon>
					</view>
				</u-upload>
			</view>
			<view class="title padtb20">轮播图</view>
			<view class="">
				<u-upload
					:fileList="bannerArr"
					@afterRead="afterReadImg"
					@delete="deleteImg"
					name="6"
					multiple
					:maxCount="2"
					width="180rpx"
					height="180rpx"
				>
					<view class="up-icon flex">
						<u-icon
							name="plus"
							color="#999999"
							size="45rpx"
						></u-icon>
					</view>
				</u-upload>
			</view>
			
			<view class="fot-btn pad20">
				<view class="btn" @click="confirmFun">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrlApi } from '@/utils/baseUrl.js';
import { storeInfo, editStoreInfo } from '@/api/admin.js';
export default {
	data() {
		return {
			value: '', //门店介绍
			value2: '',
			bannerArr: [], // 轮播图图片
			equipmentImg: [], // 门店介绍图片
			sportsImg: [], // 运动器材图片
		};
	},
	onLoad() {
		this.getStoreInfo();
	},
	methods: {
		// 保存信息
		confirmFun() {
			editStoreInfo({
				content: this.value,
				sports_content: this.value2,
				images: this.editStr(this.bannerArr),
				content_images: this.editStr(this.equipmentImg),
				sports_content_images: this.editStr(this.sportsImg),
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			});
		},
		// 获取门店信息
		getStoreInfo() {
			storeInfo().then(res => {
				let data = res.data;
				this.value = data.content
				this.value2 = data.sports_content
				this.bannerArr = this.editArr(data.images)
				this.equipmentImg = this.editArr(data.content_images)
				this.sportsImg = this.editArr(data.sports_content_images )
			});
		},
		editArr(e) {
			let arr = [];
			if(Array.isArray(e)) {
				e.forEach(item => {
					arr.push({url: item})
				})
			}else {
				e.split(",").forEach(item => {
					arr.push({url: item})
				})
			}
			return arr
			
		},
		editStr(e) {
			let str = '';
			e.forEach((item, index) => {
				if (index == e.length - 1) {
					str = str + item.url;
				} else {
					str = str + item.url + ',';
				}
			});
			return str
		},
		// 删除 运动器材图片
		deleteeQuipment(eve) {
			this.equipmentImg.splice(eve.index, 1);
		},
		// 新增 运动器材图片
		async afterReadeQuipment(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'equipment');
			});
		},	
		// 删除 运动器材图片
		deleteeSports(eve) {
			this.sportsImg.splice(eve.index, 1);
		},
		// 新增 运动器材图片
		async afterReadeSports(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'sports');
			});
		},	
		
		// 删除轮播 图片
		deleteImg(eve) {
			this.bannerArr.splice(eve.index, 1);
		},
		// 新增轮播 图片
		async afterReadImg(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'banner');
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
						if(type == 'banner') {
							this.bannerArr.push({ url: data.data });
						}else if(type == 'sports') {
							this.sportsImg.push({ url: data.data });
						}else if(type == 'equipment') {
							this.equipmentImg.push({ url: data.data });
						}
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

<style lang="scss">
/deep/ .u-textarea {
	min-height: 288rpx;
	background: #f5f5f5 !important;
}

.page {
	padding-bottom: 120rpx;
	.title {
		font-size: 32rpx;
		color: #202020;
		font-weight: 600;
	}

	.up-icon {
		width: 180rpx;
		height: 180rpx;
		background-color: #f5f5f5;
	}
	.fot-btn {
		background-color: #fff;
		height: 120rpx;
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		left: 0;
		z-index: 99;
		.btn {
			height: 74rpx;
			width: 100%;
			line-height: 74rpx;
			text-align: center;
			background: #fe5e10;
			border-radius: 66rpx;
			color: #ffffff;
			font-size: 32rpx;
		}
	}

}
</style>
