<template>
	<view>
		<head-nav
			bgColor="rgba(0,0,0,0)"
			:goBack="true"
			title="申请提现"
		></head-nav>
		<view class="page pad20">
			<view class="box mar-b20">
				<view class="label">提现金额</view>
				<view class="ipt-box flex-a pad-b20">
					<text class="txt">￥</text>
					<input
						placeholder="请输入提现金额"
						v-model="money"
					/>
				</view>
				<u-line></u-line>
				<view class="msg">
					可用余额{{ balance }}元,
					<text
						style="color: #FE5E10;"
						@click="allFun"
					>
						全部提现
					</text>
				</view>
			</view>
			<view class="box mar-b20 tips">
				温馨提示：选中提现方式只需输入对应支付方式的内容哦~
			</view>
			<view class="box mar-b20 flex-row flex-a">
				<view class="lable mar-r40">提现方式:</view>
				<view class="radio-box">
					<u-radio-group v-model="radioVal">
						<u-radio
							:customStyle="{
								marginRight: '20rpx'
							}"
							label="银行卡"
							name="card"
						></u-radio>
						<u-radio
							:customStyle="{
								marginRight: '20rpx'
							}"
							label="支付宝"
							name="alipay"
						></u-radio>
						<u-radio
							:customStyle="{
								marginRight: '20rpx'
							}"
							label="微信"
							name="wechat"
						></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="box ">
				<view class="title mar-b20">银行卡账号</view>
				<view
					class="box-li flex-a ju-bt mar-b20 mar-t40"
				>
					<text class="label">开户行：</text>
					<view class="input-box w450">
						<u-input
							placeholder="请输入内容"
							border="surround"
							v-model="cardKhh"
						></u-input>
					</view>
				</view>
				<view
					class="box-li flex-a ju-bt mar-b20 mar-t40"
				>
					<text class="label">银行卡号：</text>
					<view class="input-box w450">
						<u-input
							placeholder="请输入内容"
							border="surround"
							v-model="cardNum"
						></u-input>
					</view>
				</view>
				<view
					class="box-li flex-a ju-bt mar-b20 mar-t40"
				>
					<text class="label">持卡人姓名：</text>
					<view class="input-box w450">
						<u-input
							placeholder="请输入内容"
							border="surround"
							v-model="cardName"
						></u-input>
					</view>
				</view>
				<u-line></u-line>
				<view class="title  mar-t20 mar-b20">
					填写支付宝账号
				</view>
				<view
					class="box-li flex-a ju-bt mar-b20 mar-t40"
				>
					<text class="label">姓名：</text>
					<view class="input-box w450">
						<u-input
							placeholder="请输入内容"
							border="surround"
							v-model="zfbName"
						></u-input>
					</view>
				</view>
				<view
					class="box-li flex-a ju-bt mar-b20 mar-t40"
				>
					<text class="label">支付宝账号：</text>
					<view class="input-box w450">
						<u-input
							placeholder="请输入内容"
							border="surround"
							v-model="zfbAccount"
						></u-input>
					</view>
				</view>
				<u-line></u-line>
				<view class="title mar-b20 mar-t40">
					上传微信收款码
				</view>
				<view
					class="box-li flex-a ju-bt mar-b20 mar-t40"
				>
					<u-upload
						:fileList="wxqr"
						@afterRead="afterReadwx"
						@delete="deletewx"
						name="1"
						multiple
						:maxCount="1"
						width="200rpx"
						height="200rpx"
					>
						<view class="upload-box flex">
							<u-icon
								name="plus"
								size="60rpx"
								label="上传照片"
								labelPos="bottom"
							></u-icon>
						</view>
					</u-upload>
				</view>
				<view class="tip">
					提现说明：需要填写一个提现账号，提现申请后，平台会在每月固定时间审核提现申请，审核通过会发放提成，请耐心等待。
				</view>
			</view>
			<view class="btn flex" @click="submit">
				确认提交
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrlApi } from '@/utils/baseUrl.js';
import { withdraw } from '@/api/sportsTeacher.js';
export default {
	data() {
		return {
			radioVal: '', // radio值
			money: '', // 提现金额
			cardKhh: '', // 银行开户行
			cardNum: '', // 银行卡号
			cardName: '', // 银行持卡人姓名
			zfbName: '', // 支付宝姓名
			zfbAccount: '', // 支付宝账号、
			wxqr: [],
			balance: 0, // 余额
			btnState: true,
		};
	},
	onLoad(e) {
		this.balance = e.balance;
	},
	methods: {
		// 全部提现
		allFun() {
			this.money = this.balance;
		},
		// 提交
		submit() {
			if (!this.money || this.money > this.balance) {
				uni.showToast({
					title:
						'请输入提现余额同时提现金额不能大于可用金额！',
					icon: 'none'
				});
				return;
			}
			if (!this.radioVal) {
				uni.showToast({
					title: '请选择提现方式！',
					icon: 'none'
				});
				return;
			}
			// card银行 alipay支付宝 wechat微信
			if (this.radioVal == "card") {
				if (
					!this.cardKhh ||
					!this.cardNum ||
					!this.cardName
				) {
					uni.showToast({
						title: '请输入完整银行信息！',
						icon: 'none'
					});
					return;
				}
			} else if (this.radioVal == "alipay") {
				if (!this.zfbName || !this.zfbAccount) {
					uni.showToast({
						title: '请输入完整支付宝信息！',
						icon: 'none'
					});
					return;
				}
			} else if (this.radioVal == "wechat") {
				if (!this.wxqr.length) {
					uni.showToast({
						title: '请上传微信收款码！',
						icon: 'none'
					});
					return;
				}
			}
			this.withdrawfun();
		},
		// 提现
		withdrawfun() {
			if(!this.btnState) {
				return
			}
			this.btnState = false;
			let account = "";
			let name = ""
			if(this.radioVal == 'alipay') {
				account = this.zfbAccount;
				name = this.zfbName
			}else if(this.radioVal == 'card') {
				account = this.cardNum
				name = this.cardName
			}
			withdraw({
				bankname: this.cardKhh,
				type: this.radioVal,
				account: account,
				name: name,
				wechat_img: this.wxqr.length ? this.wxqr[0].url : "",
				money: this.money
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			});
		},

		// 删除 图片
		deletewx(eve) {
			this.wxqr.splice(eve.index, 1);
		},
		// 新增 图片
		async afterReadwx(eve) {
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
						this.wxqr = [{ url: data.data }];
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
.tips {
	color: #999999;
	font-size: 24rpx;
}
.page {
	background-color: #f5f5f5;
	.btn {
		height: 74rpx;
		width: 686rpx;
		margin: 62rpx auto;
		background: #fe5e10;
		border-radius: 98rpx;
		color: #ffffff;
		font-size: 32rpx;
	}
	.box {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx 22rpx 20rpx 26rpx;

		.tip {
			font-size: 24rpx;
			font-weight: 400;
			color: #202020;
			line-height: 48rpx;
		}

		.label {
			color: #202020;
			font-size: 28rpx;
		}
		.msg {
			color: #999999;
			margin-top: 10rpx;
			font-size: 28rpx;
		}
		.ipt-box {
			margin-top: 50rpx;
			.txt {
				font-weight: 600;
				color: #202020;
				font-size: 64rpx;
				margin-right: 40rpx;
			}
		}

		.w450 {
			width: 450rpx;
		}

		.upload-box {
			width: 240rpx;
			height: 243rpx;
			background: #eeeeee;
			border: 2rpx solid #dcdcdc;
		}

		.title {
			font-weight: 500;
			color: #202020;
			font-weight: bold;
			font-size: 32rpx;
		}
	}
}
</style>
