<template>
	<view>
		<head-nav
			title="运动管理师申请"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="pad20">
			<view class="tit martb20">申请理由</view>
			<view class="area-box ">
				<u--textarea
					v-model="reason"
					border="none"
					placeholder="其他反馈"
					height="180rpx"
					maxlength="-1"
				></u--textarea>
			</view>
			<u-line margin="40rpx 0 "></u-line>

			<view class="tit tit-2 mar-b40">资质证明</view>
			<view class="code-box flex-row flex-a ju-bt">
				<!-- 身份证 正面 -->
				<view class="code-front upload mar-b40">
					<u-upload
						:fileList="frontList"
						@afterRead="afterReadFront"
						@delete="deleteFront"
						name="1"
						multiple
						:maxCount="1"
						width="300rpx"
						height="200rpx"
					>
						<view
							class="up-box flex-col flex-a"
							v-if="!frontList.length"
						>
							<view class="load-icon flex">
								<image
									class="img"
									:src="
										baseUrl + 'upLoad1.png'
									"
									mode=""
								></image>
							</view>
							<view class="up-txt flex">
								上传身份证正面
							</view>
						</view>
					</u-upload>
				</view>
				<!-- 身份证 反面 -->
				<view class="code-reverse upload mar-b40">
					<u-upload
						:fileList="reverseList"
						@afterRead="afterReadReverse"
						@delete="deleteReverse"
						name="1"
						multiple
						:maxCount="1"
						width="300rpx"
						height="200rpx"
					>
						<view class="up-box flex-col flex-a">
							<view class="load-icon flex">
								<image
									class="img"
									:src="
										baseUrl + 'upLoad1.png'
									"
									mode=""
								></image>
							</view>
							<view class="up-txt flex">
								上传身份证反面
							</view>
						</view>
					</u-upload>
				</view>
				<!-- 身份证 手持 -->
				<view class="code-handheld upload mar-b40">
					<u-upload
						:fileList="handheldList"
						@afterRead="afterReadHandheld"
						@delete="deleteHandheld"
						name="1"
						multiple
						:maxCount="1"
						width="300rpx"
						height="200rpx"
					>
						<view class="up-box flex-col flex-a">
							<view class="load-icon flex">
								<image
									class="img"
									:src="
										baseUrl + 'upLoad1.png'
									"
									mode=""
								></image>
							</view>
							<view class="up-txt flex">
								上传手持身份证
							</view>
						</view>
					</u-upload>
				</view>
			</view>
			<u-line margin="40rpx 0 "></u-line>
			<view class="tit tit-2 mar-b40">其他证书</view>
			<view class="othre-load">
				<u-upload
					:fileList="othreList"
					@afterRead="afterReadOther"
					@delete="deleteOthre"
					name="1"
					multiple
					:maxCount="1"
					width="250rpx"
					height="250rpx"
				>
					<view class="other-lo flex">
						<u-icon
							name="plus"
							color="rgba(0,0,0,0.4)"
							size="60rpx"
							:bold="true"
						></u-icon>
					</view>
				</u-upload>
			</view>
			<view class="pad-b40">
				<view
					class="fot-btn flex mar-t40"
					@click="confirmApply"
				>
					提交申请
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import { sportManagementApply, } from '@/api/admin.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 身份证 正面
			frontList: [],
			// 身份证 反面
			reverseList: [],
			// 身份证 手持
			handheldList: [],
			// 其他证书
			othreList: [],
			// 申请理由
			reason: '',
			// 类型
			type: ''
		};
	},
	onLoad(eve) {
		this.type = eve.type;
	},
	methods: {
		// 申请营养师
		confirmApply() {
			if (
				!this.reason ||
				!this.othreList.length ||
				!this.handheldList.length ||
				!this.reverseList.length ||
				!this.frontList.length
			) {
				uni.showToast({
					title: '请输入完整信息',
					icon: 'error'
				});
				return;
			}

			sportManagementApply({
				reason: this.reason,
				aptitude_photo: `${this.handheldList[0].url},${
					this.reverseList[0].url
				},${this.frontList[0].url}`,
				certificate_photo: `${this.othreList[0].url}`
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			});
		},
		// 删除 其他证书
		deleteOthre(eve) {
			this.othreList.splice(eve.index, 1);
		},
		// 新增 其他证书
		async afterReadOther(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'other');
			});
		},
		// 删除 身份证 手持图片
		deleteHandheld(eve) {
			this.handheldList.splice(eve.index, 1);
		},
		// 新增 身份证 手持图片
		async afterReadHandheld(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'handheld');
			});
		},
		// 删除 身份证 反面图片
		deleteReverse(eve) {
			this.reverseList.splice(eve.index, 1);
		},
		// 新增 身份证 反面图片
		async afterReadReverse(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'reverse');
			});
		},
		// 删除 身份证 正面图片
		deleteFront(eve) {
			this.frontList.splice(eve.index, 1);
		},
		// 新增 身份证 正面图片
		async afterReadFront(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'front');
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
						if (type == 'front') {
							this.frontList.push({ url: data.data });
						} else if (type == 'reverse') {
							this.reverseList.push({
								url: data.data
							});
						} else if (type == 'handheld') {
							this.handheldList.push({
								url: data.data
							});
						} else if (type == 'other') {
							this.othreList.push({ url: data.data });
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

<style lang="scss" scoped>
.fot-btn {
	height: 80rpx;
	background-color: #fe5e10;
	font-weight: 400;
	color: #ffffff;
	font-size: 32rpx;
	border-radius: 40rpx;
}
.other-lo {
	width: 250rpx;
	height: 250rpx;
	background-color: #f9f9f9;
}
.code-box {
	.upload {
		.up-box {
			.up-txt {
				font-weight: 500;
				color: #babfcb;
				font-size: 26rpx;
			}
			.load-icon {
				.img {
					width: 60rpx;
					height: 60rpx;
				}
				background-color: #dadde3;
				border-radius: 50%;
				width: 100rpx;
				height: 100rpx;
				margin-bottom: 20rpx;
			}
			justify-content: center;
			width: 100%;
			height: 100%;
			border: 2px dashed #babfcb;
			border-radius: 20rpx;
			width: 300rpx;
			height: 200rpx;
		}
		width: 300rpx;
		height: 200rpx;
	}
	width: 100%;
	flex-wrap: wrap;
}

.tit-2 {
	margin-top: 60rpx;
}
/deep/ .u-textarea {
	// border-radius: 20rpx !important;
	background: #f9f9f9 !important;
	// padding: 30rpx !important;
}
.area-box {
	background-color: #f9f9f9;
	border-radius: 10rpx;
}
.tit {
	font-weight: 600;
	color: rgba(0, 0, 0, 0.9);
	font-size: 32rpx;
}
</style>
