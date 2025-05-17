<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			:title="title"
		></head-nav>
		<view class="page pad-b20">
			<view class="title pad-l20 pad-b20">封面图片</view>
			<view class="upload pad20">
				<u-upload
					:fileList="coverImgs"
					@afterRead="afterReadCover"
					@delete="deleteCover"
					name="6"
					multiple
					:maxCount="1"
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
			<view class="title pad-l20 pad-b20">基础信息</view>
			<view class="bg mar-r20">
				<view class="page-li flex-a ju-bt ">
					<text>产品名称</text>
					<view class="input-box">
						<u-input
							v-model="productName"
							placeholder="请输入"
							border="surround"
						></u-input>
					</view>
				</view>
				<view class="page-li flex-a ju-bt ">
					<text>约课单价</text>
					<view class="input-box">
						<u-input
							v-model="unitPrice"
							placeholder="请输入"
							border="surround"
							type="digit"
						></u-input>
					</view>
				</view>
				<view class="page-li flex-a ju-bt ">
					<text>最少人数</text>
					<view class="input-box">
						<u-input
							v-model="min"
							placeholder="请输入"
							border="surround"
							type="number"
						></u-input>
					</view>
				</view>
				<view class="page-li flex-a ju-bt ">
					<text>最大人数</text>
					<view class="input-box">
						<u-input
							v-model="max"
							placeholder="请输入"
							border="surround"
							type="number"
						></u-input>
					</view>
				</view>
				<view class="page-li flex-a ju-bt ">
					<text>简介</text>
					<view class="input-box">
						<u-input
							v-model="introduction"
							placeholder="请输入"
						></u-input>
					</view>
				</view>
			</view>
			<view class="title pad-l20 pad-b20">轮播图片</view>
			<view class="upload pad20">
				<u-upload
					:fileList="bannerImgs"
					@afterRead="afterReadBanner"
					@delete="deleteBanner"
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
			<view class="title pad-l20 pad-b20">产品介绍</view>
			<view class="introduce mar-r20 pad20">
				<u-textarea
					placeholder="请输入内容"
					v-model="introduce"
				></u-textarea>

				<view class="upload  ">
					<u-upload
						:fileList="introduceImgs"
						@afterRead="afterReadIntroduce"
						@delete="deleteIntroduce"
						name="6"
						multiple
						:maxCount="1"
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
			</view>
			<view class="btn mar40 flex" @click="addLeagueClassFun">确定</view>
		</view>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import { addLeagueClass, leagueClassDetail, editLeagueClass } from '@/api/admin.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			categoryType: 2, //产品类别1固定次数  2不固定
			coverImgs: [], // 封面图片
			productName: '', // 产品名称
			unitPrice: '', // 单价
			min: '', // 最少人数
			max: '', // 最大人数
			introduction: '', // 简介
			bannerImgs: [], // 轮播图
			introduce: '', // 介绍
			introduceImgs: [], // 介绍图片
			// 页面标题
			title: "新增团课模板",
			groupClassId: "", // 团课id
			type: "",
		};
	},
	onLoad(e) {
		if(e.type == 'edit') {
			this.title = "编辑团课模板"
			this.groupClassId = e.id;
			this.type = e.type;
			this.getLeagueClassDetail();
		}
	},
	methods: {
		// 获取模板详情
		getLeagueClassDetail() {
			leagueClassDetail({
				id: this.groupClassId
			}).then(res => {
				let data = res.data;
				this.coverImgs = this.editArr(data.image)
				this.productName = data.name;
				this.unitPrice = data.price;
				this.min = data.min;
				this.max = data.max;
				this.introduction = data.info;
				this.bannerImgs = this.editArr(data.banner);
				this.introduce = data.content;
				this.introduceImgs = this.editArr(data.content_image);
			})
		},
		add() {
			addLeagueClass({
				image: this.editStr(this.coverImgs),
				name: this.productName,
				price: this.unitPrice,
				min: this.min,
				max: this.max,
				info: this.introduction,
				banner: this.editStr(this.bannerImgs),
				content: this.introduce,
				content_image: this.editStr(this.introduceImgs),
			}).then(res => {
				uni.showToast({
					title: res.msg,
					
				})
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			});
		},
		edit () {
			editLeagueClass({
					id: this.groupClassId,
					image: this.editStr(this.coverImgs),
					name: this.productName,
					price: this.unitPrice,
					min: this.min,
					max: this.max,
					info: this.introduction,
					banner: this.editStr(this.bannerImgs),
					content: this.introduce,
					content_image: this.editStr(this.introduceImgs),
				}).then(res => {
					uni.showToast({
						title: res.msg,
						
					})
					setTimeout(() => {
						uni.navigateBack()
					},1500)
				});
		},
		// 增加团课模板
		addLeagueClassFun() {
			if (
				!this.coverImgs.length ||
				!this.productName ||
				!this.unitPrice ||
				!this.min ||
				!this.max ||
				!this.introduction ||
				!this.bannerImgs.length ||
				!this.introduce ||
				!this.introduceImgs.length
			) {
				uni.showToast({
					title: '请输入完整内容！',
					icon: 'none'
				});
				return;
			}
			if(this.type == 'edit') {
				this.edit();
			}else {
				this.add();
			}
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
		// 删除 介绍图片
		deleteIntroduce(eve) {
			this.introduceImgs.splice(eve.index, 1);
		},
		// 新增 介绍图片
		async afterReadIntroduce(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'introduce');
			});
		},
		// 删除 轮播图片
		deleteBanner(eve) {
			this.bannerImgs.splice(eve.index, 1);
		},
		// 新增 轮播图片
		async afterReadBanner(eve) {
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'banner');
			});
		},
		// 删除 封面图片
		deleteCover(eve) {
			this.coverImgs.splice(eve.index, 1);
		},
		// 新增 封面图片
		async afterReadCover(eve) {
			
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'cover');
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
						if (type == 'cover') {
							this.coverImgs.push({ url: data.data });
						} else if (type == 'banner') {
							this.bannerImgs.push({
								url: data.data
							});
						} else if (type == 'introduce') {
							this.introduceImgs.push({
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

<style lang="scss">
/deep/ .u-textarea {
	border: none;
}
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

	.introduce {
		margin-bottom: 60rpx;
		height: 388rpx;
		border-radius: 20rpx;
		border: 2rpx solid #dadada;
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
