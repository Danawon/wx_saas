<template>
	<view>
		<head-nav title="客服详情" bgColor="#fff" :goBack="true"></head-nav>
		<u-line></u-line>
		<view class="pad20">
			<view class="time-box flex-row flex-a ju-bt" v-if="detail.createtime">
				<view class="time">提交时间：{{ detail.createtime }}</view>
			</view>
			<view class="li-tit martb20" v-if="detail.content">{{ detail.content }}</view>
			<view class="li-imgs  flex-row flex-a" v-if="detail.images.length">
				<u-album :urls="detail.images" :rowCount="4"></u-album>
			</view>
			<u-line margin="50rpx 0" v-if="detail.createtime ||  detail.content || detail.images.length"></u-line>
			<view class="message-list" v-for="(item, index) in list" :key="index">
				<!-- 别人消息 -->
				<view class="message-head other pad20 martb20" v-if="item.direction == 'left'">
					<view class="avatat flex-row flex-a">
						<u-avatar size="80rpx" :src="item.user.avatar"></u-avatar>
						<view class="name-box mar-l20 flex-col ju-bt">
							<view class="name">{{ item.user.nickname }}</view>
							<view class="name-time">回复时间：{{ item.createtime }}</view>
						</view>
					</view>

					<view class="topics-box flex-row flex-a ">
						<view class="topics-txt ">{{ item.content }}</view>
					</view>
				</view>
				<!-- 自己的消息 -->
				<view class="my message-head  pad20 martb20" v-if="item.direction == 'right'">
					<view class="avatat flex-row flex-a">
						<view class="name-box mar-r20 flex-col ju-bt">
							<view class="name">{{ item.user.nickname }}</view>
							<view class="name-time">回复时间：{{ item.createtime }}</view>
						</view>
						<u-avatar size="80rpx" :src="item.user.avatar"></u-avatar>
					</view>

					<view class="topics-box flex-row flex-a ">
						<view class="topics-txt ">{{ item.content }}</view>
					</view>
				</view>
			</view>
			
			<view class="area-box pad20"><u--textarea v-model="desc" border="none" placeholder="多行输入..." height="230rpx" maxlength="-1"></u--textarea></view>
			<view class="mar-t20" v-if="type == 'user' && !detailId">
				<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="10"></u-upload>
			</view>
			<view class="fot-btn pad-b40"><view class="btn flex" @click="sub">发送</view></view>
		</view>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import { getSub, reply_feedback, getDetail, add_feedback } from '@/api/customer_service.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			desc: '', //反馈内容
			fileList1: [],
			detailId: '',
			type: 'user', //user 用户端  admin 客服端
			detail: {
				images: []
			},
			list: []
		};
	},
	onLoad(op) {
		this.type = op.type;
		if (op.id) {
			this.detailId = op.id;
			this.detailInit();
		}
	},
	methods: {
		//详情初始化
		detailInit() {
			getDetail({ id: this.detailId }).then(res => {
				this.detail = res.data.data;
				this.list = res.data.list;
			});
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
			return str;
		},
		//提交反馈
		sub() {
			let imgs = '';
			if (!this.desc) {
				uni.showToast({
					title: '请填写反馈内容',
					icon: 'none'
				});
				return;
			}
			//用户反馈
			if (this.type == 'user') { 
				//提交新发反馈
				if (!this.detailId) {
					imgs = this.editStr(this.fileList1);
					if (!imgs) {
						uni.showToast({
							title: '请上传图片',
							icon: 'none'
						});
						return;
					}
					add_feedback({ content: this.desc, images: imgs }).then(res => {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						setTimeout(() => {
							this.desc = "";
							uni.navigateBack();
						}, 2000);
					});
				} else {
					getSub({ content: this.desc, reply_id: this.detail.id }).then(res => {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						setTimeout(() => {
							this.desc = "";
							this.detailInit();
						}, 2000);
					});
				}
			}

			//客服回复
			if (this.type == 'admin') {
				reply_feedback({ reply_id: this.detail.id, content: this.desc }).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					setTimeout(() => {
						this.desc = "";
						this.detailInit();
					}, 2000);
				});
			}
			
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
		uploadFilePromise(url) {
			uni.showLoading({
				title: '上传中...'
			});
			let _this = this;
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: baseUrlApi + 'upload/file',
					filePath: url,
					name: 'image',
					header: {
						'Authori-zation': 'Bearer' + ' ' + uni.getStorageSync('token')
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
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.fot-btn {
	.btn {
		height: 80rpx;
		font-weight: 400;
		color: #ffffff;
		font-size: 32rpx;
		background-color: #fe5e10;
		border-radius: 40rpx;
	}
	margin-top: 60rpx;
}
.area-box {
	border: 1px solid #dadada;
}
.my {
	.topics-box {
		justify-content: flex-end;
	}
	.avatat {
		.name-box {
			align-items: flex-end !important;
		}
		justify-content: flex-end !important;
	}
}
.message-head {
	.topics-box {
		.topics-txt {
			font-weight: 400;
			color: #202020;
			font-size: 28rpx;
		}
		margin-top: 30rpx;
		margin-bottom: 10rpx;
	}

	.avatat {
		.name-box {
			.name-time {
				font-weight: 400;
				color: #999999;
				font-size: 20rpx;
			}
			.name {
				font-weight: 600;
				color: #202020;
				font-size: 28rpx;
			}
			height: 80rpx;
		}
	}
	background: #f5f5f5;
	border-radius: 20rpx;
}
.time-box {
	margin-top: 10rpx;
}
.li-imgs {
	margin-top: 50rpx;
}
.li-tit {
	font-weight: 400;
	color: #202020;
	font-size: 28rpx;
}
.time-box {
	.time {
		font-weight: 300;
		color: #999999;
		font-size: 24rpx;
	}
}
</style>
