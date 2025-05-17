<template>
	<view>
		<head-nav
			title="我的客服"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<u-line></u-line>
		<view class="box pad20">
			<view class="li mar-b40 flex-a ju-bt">
				<text>标题：</text>
				<view class="ipt">
					<u--input
						placeholder="请输入标题"
						border="none"
						v-model="title"
						:customStyle="{ height: '88rpx' }"
					></u--input>
				</view>
			</view>
			<view class="li mar-b40 flex-row ju-bt">
				<text>内容：</text>
				<view class="ipt area-box">
					<u--textarea
						v-model="content"
						placeholder="多行输入..."
						height="230rpx"
						maxlength="-1"
					></u--textarea>
				</view>
			</view>
			<view class="li mar-b40 flex-row ju-bt">
				<text>图片：</text>
				<view class="ipt uploadBox">
					<u-upload
						:fileList="fileList1"
						@afterRead="afterRead"
						@delete="deletePic"
						name="1"
						multiple
						:maxCount="10"
						width="160rpx"
						height="160rpx"
					></u-upload>
				</view>
			</view>
			<view class="fot-btn pad-b40">
				<view class="btn flex" @click="submit">提交反馈</view>
			</view>

			<!-- 历史记录 -->
			<!-- 历史记录 -->
			<view class="record-box mar-t40 ">
				<view class="record-tit flex-row flex-a">
					<u-avatar
						:src="baseUrl + 'record.png'"
						size="30"
					></u-avatar>
					<view class="tit-txt">历史记录</view>
				</view>
				<view class="record-li">
					<view
						class="li pad20 mar-t40"
						v-for="(item, index) in recordList"
						:key="index"
						@click="goRoute(item.id)"
					>
						<view class="flex-row flex-a ju-bt">
							<view class="li-tit">
								<view class="time">
									{{ item.createtime }}
								</view>
								<view class="title">
									{{ item.title }}
								</view>
							</view>
							<view class="icon-box">
								<u-icon
									name="arrow-right"
									size="16"
								></u-icon>
							</view>
						</view>
						<view class="time-tips felx-row flex-a" v-if="item.customer_num > 0">
							<view class="tips-circle"></view>
							<view class="tips-txt">有新的回复</view>
						</view>
					</view>
				</view>
			</view>
			<u-empty
					v-if="!recordList.length"
					mode="list"
					text="暂无历史数据..."
				></u-empty>
			</view>	
		</view>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import {
	getList,
	getListAdmin,
	getSub,
	add_feedback
} from '@/api/customer_service.js';
import { editStr } from "@/common/common.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			type: 'user', //user从用户端进， admin 从管理端进
			fileList1: [],
			recordList: [], // 历史记录
			title: "", // 标题
			content: "", // 内容
			current: 1,
			is_upLoad: false, // 是否 upLoad 触发onshow
		};
	},
	onLoad() {
		this.init();
	},
	onShow() {
		if(this.is_upLoad) {
			this.current = 1;
			this.recordList = [];
			this.init();
		}
		
	},
	onReachBottom() {
		this.current ++;
		this.init();
	},
	methods: {
		/* 提交反馈 */
		submit() {
			if (!this.title || !this.content) {
				uni.showToast({
					title: '请填写反馈内容',
					icon: 'none'
				});
				return;
			}
			add_feedback({ 
				title: this.title,
				content: this.content, 
				images: editStr(this.fileList1)
			}).then(res => {
				uni.showToast({
					title: res.msg,
				});
				setTimeout(() => {
					this.reset()
				}, 1500);
			});
		},
		reset() {
			this.title = "";
			this.content = "";
			this.fileList1 = [];
			this.current = 1;
			this.recordList = [];
			this.init();
		},
		// 跳转页面
		goRoute(id) {
			this.is_upLoad = true;
			uni.navigateTo({
				url:
					'/pages/myCenter/pages/serviceDetail/serviceDetail?type=' +
					this.type +
					'&id=' +
					id
			});
		},
		//初始化页面---用户
		init() {
			getList({
				page: this.current,
				list_rows: 10
			}).then(res => {
				this.is_upLoad = false;
				this.recordList = [...this.recordList ,...res.data.data];
			});
		},

		// 删除图片
		deletePic(event) {
			this[`fileList${event.name}`].splice(event.index, 1);
		},
		// 新增图片
		async afterRead(event) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			event.file.forEach(item => {
				this.uploadFilePromise(item.url);
			});
		},
		/* 上传图片 */
		uploadFilePromise(url) {
			uni.showLoading({
				title: '上传中...'
			});
			let _this = this;

			uni.uploadFile({
				url: baseUrlApi + 'upload/file',
				filePath: url,
				name: 'image',
				header: {
					'Authori-zation':
						'Bearer' +
						' ' +
						uni.getStorageSync('token')
				},
				formData: {
					type: 'customerService'
				},
				success: uploadFileRes => {
					var data = JSON.parse(uploadFileRes.data);
					if(data.code == 200) {
						let img = data.data;
						_this.fileList1.push({
							url: img
						});
					}else {
						uni.showToast({
							title: data.msg,
							icon: "none"
						})
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>

.box {
	.record-box {
		.record-li {
			.li {
				.time {
					font-size: 24rpx;
					color: #999;
				}
				.icon-box {
					width: 5%;
				}
				.li-tit {
					.title {
						margin-top: 10rpx;
					}
					width: 90%;
				}
				.time-tips {
					.tips-txt {
						font-weight: 400;
						color: #e6102e;
						font-size: 24rpx;
					}
					.tips-circle {
						width: 15rpx;
						height: 15rpx;
						border-radius: 50%;
						background-color: #e6102e;
						margin-right: 10rpx;
					}
					position: absolute;
					right: 25rpx;
					top: -15rpx;
				}
				position: relative;
				border-radius: 20rpx;
				box-shadow: 1px 1px 10rpx 5rpx #ccc;
				font-size: 26rpx;
			}
		}
		.record-tit {
			.tit-txt {
				margin-left: 10rpx;
			}
			padding: 10rpx;
			border-radius: 20rpx 20rpx 0 0;
			background-color: #fafafa;
			font-size: 35rpx;
		}
	}
	.li {
		font-size: 28rpx;
		.ipt {
			width: 87%;
			height: 88rpx;
			background: #f5f5f5;
			border-radius: 20rpx;
			box-sizing: border-box;
			padding: 0 20rpx;
		}
		.uploadBox {
			padding: 0;
			background: #fff;
			height: auto;
		}
	}

	.btn {
		height: 80rpx;
		font-weight: 400;
		color: #ffffff;
		font-size: 32rpx;
		background-color: #fe5e10;
		border-radius: 40rpx;
	}
	.area-box {
		height: auto !important;
		padding: 0 !important;
	}
}
</style>
