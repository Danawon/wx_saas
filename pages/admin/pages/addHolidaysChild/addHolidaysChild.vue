<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			:title="editState ? '编辑节假日' : '新增节假日'"
		></head-nav>
		<view class="list">
			<view class="li mar-b20 flex-a ju-bt">
				<view class="title">标题：</view>
				<view class="ipt li-r">
					<u--input
						placeholder="请输入训练标题"
						border="none"
						v-model="title"
						:customStyle="{ height: '88rpx' }"
						:suffixIconStyle="{
							'font-size': '25rpx'
						}"
					></u--input>
				</view>
			</view>
			<view class="li mar-b20 flex-a ju-bt">
				<view class="title">选择日期：</view>
				<view class="flex-a ju-bt li-r">
					<view class="ipt date-l" @click="timeShow = true">
						<u--input
							placeholder="请选择时间"
							border="none"
							v-model="selectTime"
							:customStyle="{ height: '88rpx' }"
							disabled
						></u--input>
					</view>
					<view class="ipt date-r">
						<u--input
							placeholder="请输入"
							border="none"
							v-model="dayNum"
							:customStyle="{ height: '88rpx' }"
							:suffixIconStyle="{
								'font-size': '25rpx'
							}"
							suffixIcon="天"
						></u--input>
					</view>
				</view>
			</view>
			<view class="li mar-b20 flex-a ">
				<view class="title">内容图片：</view>
				<view class="li-r">
					
				<view class="upload-sty">
					<u-upload
						:fileList="contentImg"
						@afterRead="afterReadImg"
						@delete="deleteImg"
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
			</view>
			<view class="title mar-t40">内容</view>
			<view class="">
				<u--textarea
					placeholder="请输入"
					v-model="content"
					maxlength="-1"
					height="500rpx"
				></u--textarea>
			</view>

			<view class="btn flex" @click="confirmFun">
				保存
			</view>
		</view>
		<u-datetime-picker
			:show="timeShow"
			v-model="timeVal"
			mode="date"
			@close="timeShow = false"
			@confirm="confirmTime"
			@cancel="timeShow = false"
		></u-datetime-picker>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import { timestampToTime } from '@/utils/util.js';
import { addHoliday, editHolidays } from '@/api/admin.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 训练内容
			content: '',
			timeShow: false,
			// 日期默认时间
			timeVal: Number(new Date()),
			/* 选中日期 */
			selectTime: '',
			/* 标题 */
			title: '',
			editState: false,
			data: {},
			/* 内容图片 */
			contentImg: [],

			/* 时间天数 */
			dayNum: "",
		};
	},
	onLoad(e) {
		if (e.data) {
			this.editState = true;
			this.data = JSON.parse(e.data);
			this.content = this.data.content;
			this.selectTime = this.data.date;
			this.title = this.data.title;
			this.contentImg = [{url: this.data.image}]
			this.dayNum = this.data.day;
		}
	},
	methods: {
		/* 选中日期 */
		confirmTime(eve) {
			this.selectTime = timestampToTime(
				eve.value / 1000
			).split(' ')[0];
			this.timeShow = false;
		},
		confirmFun() {
			if (
				!this.selectTime ||
				!this.title ||
				!this.title ||
				!this.content ||
				!this.contentImg.length || 
				!this.dayNum
			) {
				uni.showToast({
					title: '请输入完整内容！',
					icon: 'none'
				});
				return;
			}
			if (this.editState) {
				editHolidays({
					id: this.data.id,
					date: this.selectTime,
					title: this.title,
					content: this.content,
					image: this.contentImg[0].url,
					day: this.dayNum
				}).then(res => {
					uni.showToast({
						title: res.msg
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				});
			} else {
				addHoliday({
					date: this.selectTime,
					title: this.title,
					content: this.content,
					image: this.contentImg[0].url,
					day: this.dayNum
				}).then(res => {
					uni.showToast({
						title: res.msg
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				});
			}
		},
		// 删除 封面图片
		deleteImg(eve) {
			this.contentImg.splice(eve.index, 1);
		},
		// 新增 封面图片
		async afterReadImg(eve) {
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
					type: 'card'
				},
				success: res => {
					let data = JSON.parse(res.data);
					if(data.code == 200) {
						this.contentImg.push({ url: data.data });
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
	.date-l {
		width: 60% !important;
	}
	.date-r {
		width: 35% !important;
	}
	.calendar-box {
		height: 76rpx;
		border-radius: 8rpx;
		font-size: 26rpx;
		margin-bottom: 36rpx;
	}
	.upload-sty {
		// margin-left: 60rpx;
	}
.up-icon {
	width: 180rpx;
	height: 180rpx;
	background-color: #f5f5f5;
	border: #e7e7e7 1rpx dashed;
}
.list {
	padding: 30rpx;

	.li {
		font-size: 28rpx;
		.title {
			width: 25%;
		}
		.li-r {
			width: 75%;
		}
		.ipt {
			// width: 502rpx;
			height: 88rpx;
			background: #f5f5f5;
			border-radius: 20rpx;
			box-sizing: border-box;
			padding: 0 20rpx;
		}
	}

	/deep/ .u-textarea  {
		margin: 20rpx 0 88rpx;
		// height: 500rpx;
		background: #f5f5f5;
		border-radius: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
		width: 100%;
	}

	.btn {
		font-size: 32rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #ffffff;
		height: 74rpx;
		background: #fe5e10;
		border-radius: 60rpx;
	}
}
</style>
