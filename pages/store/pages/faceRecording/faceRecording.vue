<template>
	<view>
		<view class="head-box flex flex-col">
			<view class="head-tit mar-t40">
				开通刷脸服务
			</view>
			<view class="tit-tips mar-t20">
				获得更加便捷的进门体验
			</view>
		</view>
		<view class="face-box mar-t20 flex flex-col">
			<view class="face-item">
				<u--image
					v-if="!if_face"
					:showLoading="true" 
					:src="baseUrl + 'face-icon.png'" 
					width="300rpx" 
					height="300rpx" 
				></u--image>
				<view class="img-box" v-if="if_face">
					<image :src="faceImg"  mode=""></image>
				</view>
			</view>
			<view 
				class="del-btn mar-t40" 
				@click="onDel"
				v-if="if_face"
			>
				删除重拍
			</view>
		</view>
		
		
		<view class='tips-box'>
			<view class="tip-tit">
				注意事项
			</view>
			<view class="tips-txt mar-t20">
				1、需上传至少1张照片;
			</view>
			<view class="tips-txt">
				2、不要遮挡脸部，五官 (耳、眉、眼、鼻、口)必须清晰可见。
			</view>
			<view class="tips-txt">
				3、采集的人脸信息将加密存储，主要用于进出场馆时进行信息比对。
			</view>
		</view>
		<view class="btn-box padlr40 flex flex-col">
			<view class="btn" @click="uplaodFace" >
				拍摄照片
			</view>
			<view class="btn-tips mar-t20">
				拍照时，请在光线充足的环境下，正对手机
			</view>
		</view>
	</view>
</template>

<script>
import { 
	delete_face_image,
	get_update_face_image,
	update_face_image
} from '@/api/storeApis.js';
import { uploadFilePromise } from "@/common/common.js"
import { baseUrl } from '@/utils/baseUrl.js';
	export default {
		data() {
			return {
				baseUrl: baseUrl,
				if_face: 0,
				faceInfo: {
				},
				faceImg: "",
			};
		},
		onLoad() {
			this.get_update_face_image();
		},
		methods: {
			onDel() {
				if(!this.faceInfo.id) return
				if(this.faceInfo.face_open) {
					uni.showModal({
						title: "提示",
						content: "确认删除吗？",
						success: (res) => {
							if(res.confirm) {
								this.delete_face_image();
							}
						}
					})
				}else {
					uni.showModal({
						title: "提示",
						content: "请联系店长，到店面申请重新录入人脸。",
						showCancel: false,
						success: (res) => {
							// if(res.confirm) {
							// 	this.delete_face_image();
							// }
						}
					})
				}
			},
			// del
			delete_face_image() {
				delete_face_image({
					facial_id: this.faceInfo.id
				}).then(res => {
					uni.showToast({
						title: "删除成功"
					})
					setTimeout(() => {
						this.get_update_face_image();
					},1500)
				})
			},
			/* 更细人脸 */
			update_face_image() {
				uni.hideLoading()
				update_face_image({
					face_image: this.faceImg
				}).then(res => {
					uni.showToast({
						title: "上传成功"
					})
					setTimeout(() => {
						this.get_update_face_image();
					},1500)
				})
			},
			/* 获取人脸 */
			get_update_face_image() {
				get_update_face_image().then(res => {
					if(res.data?.face_image ) {
						this.if_face = 1;
						this.faceInfo = res.data;
						this.faceImg = res.data.face_image;
					}else {
						this.if_face = 0;
						this.faceInfo = {};
						this.faceImg = "";
					}
				})
			},
			uplaodFace() {
				if(this.faceImg) {
					uni.showToast({
						title: "请点击删除按钮后重新拍摄！",
						icon: "none"
					})
					return
				}
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: res => {
						uni.showLoading({
							title: "上传中"
						})
						this.uploadFilePromise(res.tempFilePaths[0]);
					}
				})
			},
			uploadFilePromise(url) {
				uploadFilePromise(url).then(res => {
					this.faceImg = res.data;
					
					this.update_face_image();
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.btn-box {
		margin-top: 100rpx;
		.btn {
			width: 100%;
			height: 80rpx;
			background: #F08422;
			border-radius: 42rpx 42rpx 42rpx 42rpx;
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			text-align: center;
			line-height: 80rpx;
			color: #FFFFFF;
		}
		.btn-tips {
			font-size: 28rpx;
			color: #999;
		}
	}
	.tips-box {
		margin-top: 80rpx;
		padding: 0 40rpx;
		.tips-txt {
			font-size: 28rpx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #666666;
			line-height: 42rpx;
		}
		.tip-tit {
			font-size: 32rpx;
			font-weight: bold;
			color: #FB6807;
		}
	}
	.face-box {
		margin-top: 60rpx;
		.del-btn {
			font-size: 36rpx;
			font-weight: bold;
			color: #FB6807;
			text-decoration: underline;
		}
		.face-item {
			width: 300rpx;
			height: 300rpx;
			.img-box {
				max-width: 300rpx;
				height: 300rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	
.tit-tips {
	color: #999;
}
.head-tit {
	font-size: 38rpx;
	font-family: Source Han Sans CN;
	font-weight: bold;
	color: #00000F;
}
</style>
