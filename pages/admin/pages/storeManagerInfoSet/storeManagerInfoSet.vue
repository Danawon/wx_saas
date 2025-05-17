<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="教练信息设置"
		></head-nav>
		<view class="page pad-b20">
			<view class="page-li  flex-a ju-bt right">
				<text>教练名称</text>
				<view class="input-box">
					<u-input
						placeholder="请输入内容"
						border="none"
						v-model="coachName"
					></u-input>
				</view>
			</view>
			<view class="page-li flex-a ju-bt right">
				<text>联系方式</text>
				<view class="input-box">
					<u-input
						placeholder="请输入内容"
						border="none"
						v-model="tel"
						type="number"
					></u-input>
				</view>
			</view>
			<u-gap height="14rpx" bgColor="#F5F5F5"></u-gap>
			<view class="title pad-l20 pad-b20">轮播图片</view>
			<view class="upload pad20">
				<u-upload
					:fileList="bannerImgs"
					@afterRead="afterReadBanner"
					@delete="deleteBanner"
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
			<view class="title pad-l20 pad-b20">关于TA</view>
			<view class="  mar-r20 pad20">
				<u-textarea placeholder="多行输入" v-model="aboutTaText"></u-textarea>
			</view>
			<view class="upload  pad-l20">
				<u-upload
					:fileList="aboutTa"
					@afterRead="afterReadAboutTa"
					@delete="deleteAboutTa"
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
			<view class="title pad-l20 pad-b20">学员案例</view>
			<view class="  mar-r20 pad20">
				<u-textarea placeholder="多行输入" v-model="studentCaseText"></u-textarea>
			</view>
			<view class="upload  pad-l20">
				<u-upload
					:fileList="studentCase"
					@afterRead="afterReadStudentCase"
					@delete="deleteStudentCase"
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
			<view class="btn mar40 flex" @click="confirmFun">
				确定
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import { selectCoachDetail, editCoach } from "@/api/admin.js"
import { editArr, editStr } from "@/common/common.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			categoryType: 2, //产品类别1固定次数  2不固定
			// 教练id
			coachId: '',
			coachName: '', // 教练名称
			tel: '', // 联系方式
			studentCase: [], // 学员案例
			studentCaseText: "", // 学员案例文本
			aboutTa: [], // 关于ta
			aboutTaText: "", // 关于ta文本
			bannerImgs: [], // 轮播图
	
		};
	},
	onLoad(eve) {
		this.coachId = eve.id;
		this.getSelectCoachDetail(); // 获取教练详情
	},
	methods: {
		// 确定
		confirmFun() {
			this.editCoachFun();
		},
		// 编辑教练信息
		editCoachFun() {
			editCoach({
				id: this.coachId,
				name: this.coachName,
				mobile: this.tel,
				info: this.aboutTaText,
				info_image: editStr(this.aboutTa), // 关于ta照片
				case: this.studentCaseText, // 学员案例
				case_image: editStr(this.studentCase), // 学员案例img
				banner: editStr(this.bannerImgs),
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			})
		},
		// 获取教练详情
		getSelectCoachDetail() {
			selectCoachDetail({
				id: this.coachId,
			}).then(res => {
				let info = res.data.info;
				this.coachName = info.name;
				this.tel = info.mobile;
				this.aboutTaText = info.info;
				this.aboutTa =info.info_image ? editArr(info.info_image) : [];
				this.studentCaseText = info.case
				this.studentCase = info.case_image ? editArr(info.case_image) : []
				this.bannerImgs = info.banner ? editArr(info.banner) : []
				this.coachQualification = info.status
			})
		},
		// 删除 轮播图图片
		deleteBanner(eve) {
			this.bannerImgs.splice(eve.index, 1);
		},
		// 新增 轮播图图片
		async afterReadBanner(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'banner');
			});
		},
		// 删除 关于ta图片
		deleteAboutTa(eve) {
			this.aboutTa.splice(eve.index, 1);
		},
		// 新增 关于ta图片
		async afterReadAboutTa(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'about');
			});
		},
		// 删除 学员案例图片
		deleteStudentCase(eve) {
			this.studentCase.splice(eve.index, 1);
		},
		// 新增 学员案例图片
		async afterReadStudentCase(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'coach');
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
					type: 'coach'
				},
				success: res => {
					let data = JSON.parse(res.data);
					if(data.code == 200) {
						if (type == 'coach') {
							this.studentCase.push({ url: data.data });
						} else if (type == 'about') {
							this.aboutTa.push({ url: data.data });
						} else if (type == 'banner') {
							this.bannerImgs.push({
								url: data.data
							});
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
.page {
	padding-left: 26rpx;

	.btn {
		color: #ffffff;
		font-size: 32rpx;
		height: 74rpx;
		background: #fe5e10;
		border-radius: 70rpx;
	}

	.add {
		height: 70rpx;
		color: #fe5e10;
		font-size: 32rpx;
		border-radius: 8rpx;
		opacity: 1;
		border: 2rpx solid #fe5e10;
		margin: 0 26rpx 28rpx;
	}

	.msg-box {
		height: 58rpx;
		margin: 0 20rpx 0;
		font-size: 26rpx;
		border-radius: 10rpx;
		opacity: 1;
		border: 2rpx solid #999999;
		color: #999999;
		padding: 5rpx 32rpx;

		.icon-box {
			margin-left: auto;
		}
	}

	.page-li {
		padding: 36rpx 26rpx 32rpx 0;
		border-bottom: #e7e7e7 1rpx solid;
		font-size: 28rpx;
		font-weight: 400;
		color: rgba(32, 32, 32, 0.9);
	}

	.up-icon {
		width: 180rpx;
		height: 180rpx;
		background-color: #f5f5f5;
		border: #e7e7e7 1rpx dashed;
	}

	.title {
		padding-top: 26rpx;
		font-size: 32rpx;
		font-weight: 550;
		color: rgba(32, 32, 32, 0.9);
	}

	.bg {
		border-radius: 24rpx;
		background: #f9f9f9;

		.page-li {
			border: none;
			margin-left: 28rpx;
		}
	}

	.right {
		padding-right: 70rpx;
		background: url(https://jp.csxclxs.cn/20220707/manager/arrow-right.png)
			no-repeat;
		background-position: 97% center;
		background-size: 24rpx 24rpx;
	}
}
</style>
