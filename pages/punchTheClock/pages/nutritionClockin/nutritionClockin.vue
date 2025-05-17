<template>
	<view>
		<head-nav title="营养打卡" :goBack="true"></head-nav>
		<u-line></u-line>
		<view class="feel-box " v-for="(boxItem, boxIndex) in fileList" :key="boxIndex">
			<view class="feel-tit">请选择{{ boxItem.tit }}感受</view>
			<view class="feel-imgs flex-row ju-bt">
				<view class="feel-sty flex-a flex-row mar-t20">
					<view
						class="img-li flex-a flex-col"
						v-for="(item, index) in feelImgs"
						:key="index"
						:class="{
							'select-feel': index === boxItem.feelIndex
						}"
						@click="selectFeelChange(boxIndex,index)"
					>
						<image :src="index === boxItem.feelIndex ? item.imgSelected : item.img" mode=""></image>
						<text class="mar-t20 img-txt">{{ item.txt }}</text>
					</view>
				</view>
				<view class="up-box">
					<u-upload
						:fileList="boxItem.url"
						@afterRead="afterRead"
						@delete="deletePic"
						name="1"
						:maxCount="1"
						:multiple="true"
						height="150rpx"
						width="150rpx"
						:name="boxIndex"
					>
					<view class="up-icon flex">
						上传{{ boxItem.tit }}
					</view>
					</u-upload>
				</view>
			</view>
			<u-line margin="20rpx 0"></u-line>
		</view>
		<view class="fot-btn flex mar-t40">
			<view class="btn flex" @click="goRouter">
				提交打卡
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import { upLoadImg, nutritionTask } from '@/api/clockIn.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 感受icons
			feelImgs: [
				{
					img: `${baseUrl}strenuous.png`,
					imgSelected: `${baseUrl}strenuous-selected.png`,
					txt: '有点撑'
				},
				{
					img: `${baseUrl}challenging.png`,
					imgSelected: `${baseUrl}challenging-selected.png`,
					txt: '口味重'
				},
				{
					img: `${baseUrl}just.png`,
					imgSelected: `${baseUrl}just-selected.png`,
					txt: '七分饱'
				},
				{
					img: `${baseUrl}easy.png`,
					imgSelected: `${baseUrl}easy-selected.png`,
					txt: '清淡'
				}
			],
			fileList: [
				{
					tit: '早餐',
					clock_record: "",
					experience: "",
					meal_time: 'breakfast',
					feelIndex: '', // 感受下标
					url: [],
				},
				{
					tit: '中餐',
					clock_record: "",
					experience: "",
					meal_time: 'lunch',
					feelIndex: '', // 感受下标
					url: [],
				},
				{
					tit: '晚餐',
					clock_record: "",
					experience: "",
					meal_time: 'dinner',
					feelIndex: '', // 感受下标
					url: [],
				},
				{
					tit: '加餐',
					clock_record: "",
					experience: "",
					meal_time: 'extra_meal',
					feelIndex: '', // 感受下标
					url: [],
				},
			],
			/* 选中上传的下标 */
			fileIndex: 0,
			// 任务id
			taskId: "",
		};
	},
	onLoad(eve) {
		this.taskId = eve.id;
	},
	methods: {
		// 选择感受发生改变
		selectFeelChange(boxIndex,index) {
			this.fileList[boxIndex].feelIndex = index;
			this.fileList[boxIndex].experience = this.feelImgs[index].txt;
		},
		// 提交打卡
		goRouter() {
			nutritionTask({
				data: this.fileList,
				task_id: this.taskId
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					uni.navigateBack({
						delta: 2
					})
				},1500)
			})
		},
		// 删除图片
		deletePic(eve) {
			this.fileList[eve.name].url.splice(eve.index, 1)
			this.fileList[eve.name].clock_record = ''
		},
		// 新增图片
		async afterRead(eve) {
			this.fileIndex = eve.name;
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url);
			});
		},
		uploadFilePromise(url) {
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
						this.fileList[this.fileIndex].url = [{ url: data.data }]
						this.fileList[this.fileIndex].clock_record = data.data;
					}else {
						uni.showToast({
							title: data.msg,
							icon: "none"
						})
					}
				},
				fail: err => {
					console.log(err, '--err');
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	/deep/ .u-upload__wrap__preview {
		margin: 0 !important;
	}
	.up-icon {
		width: 150rpx;
		height: 150rpx;
		background-color: #f5f5f5;
		border: #e7e7e7 1rpx dashed;
		font-size: 26rpx;
	}
.fot-btn {
	.btn {
		width: 100%;
		height: 80rpx;
		background-color: #fe5e10;
		border-radius: 40rpx;
		color: #fff;
		font-size: 27rpx;
	}
	width: 100%;
	padding: 20rpx 20rpx 40rpx 20rpx;
}
.feel-box {
	.feel-imgs {
		.up-box {
			width: 25%;
		}
		.feel-sty {
			width: 70%;
		}
		.img-li {
			width: 25%;
			.img-txt {
				font-size: 26rpx;
			}
			image {
				width: 48%;
				height: 55rpx;
			}
		}
		.select-feel {
			color: #fe5e10;
		}
	}
	padding: 20rpx 40rpx 0rpx ;
}
.feel-tit {
	color: rgba(0, 0, 0, 0.9);
	font-size: 28rpx;
}
</style>
