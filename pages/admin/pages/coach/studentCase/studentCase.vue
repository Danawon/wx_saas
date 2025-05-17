<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="学员案例"></head-nav>
		<view class="page">
			<view class="" style="min-height: 500rpx;">
				<!-- <jinEdit placeholder="请输入内容" @editOk="editOk" uploadFileUrl="/#"></jinEdit> -->
				<u-textarea
					placeholder="写写东西吧~"
					height="200"
					maxlength="-1"
					v-model="caseTxt"
				></u-textarea>
			</view>
			<view class="upload pad20">
				<u-upload
					:fileList="caseImgs"
					@afterRead="afterReadAvatar"
					@delete="deleteAvatar"
					name="1"
					:maxCount="16"
					multiple
					width="200rpx"
					height="200rpx"
				>
					<view class="up-icon flex"><u-icon name="plus" color="#999999" size="45rpx"></u-icon></view>
				</u-upload>
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
	components: {
	// jinEdit
	},
	data() {
		return {
			caseTxt: "",
			caseImgs: [],
		};
	},
	onLoad() {
		this.getCoachInfo();
	},
	methods: {
		confirmFun() {
			editCoachInfo({
				case: this.caseTxt,
				case_image: editStr(this.caseImgs)
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			});
		},
		// 获取教练信息
		getCoachInfo() {
			coachInfo().then(res => {
				this.caseTxt = res.data.case;
				this.caseImgs = editArr(res.data.case_image);
			});
		},
		// 删除 图片
		deleteAvatar(eve) {
			this.caseImgs.splice(eve.index, 1);
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
						this.caseImgs.push({ url: data.data });
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
