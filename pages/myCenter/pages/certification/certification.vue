<template>
	<view class="wrap-min">
		<head-nav
			title="实名认证"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="content mar-t20 pad-t40 pad-r20 pad-l20 pad-b20">
			<view class="avatar flex-a flex-row">
				<view class="lable">
					姓名
				</view>
				<view class="lable-val">
					<u--input
					    placeholder="请输入"
					    border="surround"
					    v-model="form.name"
					  ></u--input>
				</view>
			</view>	
			<view class="code flex-a flex-row mar-t40">
				<view class="lable">
					身份证
				</view>
				<view class="lable-val">
					<u--input
					    placeholder="请输入"
					    border="surround"
					    v-model="form.code"
					  ></u--input>
				</view>
			</view>
			<view class="tips mar-t40 flex">
				填写并保存即可提交认证审核
			</view>
		</view>
		<view class="fot-btn pad20">
			<view class="btn flex" @click="certificationFun">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	import { certification } from "@/api/myCenter.js"
export default {
	data() {
		return {
			form: {
				name: "",
				code: ""
			}
		};
	},
	onLoad() {
		
	},
	methods: {
		certificationFun() {
			if(!this.form.name || !this.form.code ) {
				uni.showToast({
					title: "请输入完整信息",
					icon: "error"
				})
				return
			}
			certification({
				idcard: this.form.code,
				idname: this.form.name,
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					uni.navigateBack();
				}, 1500)
			})
		},
	},
};
</script>

<style lang="scss" scoped>
	.fot-btn {
		.btn {
			width: 100%;
			height: 80rpx;
			color: #fff;
			font-size: 30rpx;
			border-radius: 40rpx;
			background-color: #FE5E10;
		}
		margin-top: 100rpx;
	}
	.tips {
		font-weight: 400;
		color: #202020;
		font-size: 28rpx;
	}
	.avatar {
		width: 100%;
	}
	.lable {
		width: 15%;
		color: #202020;
		font-weight: 600;
		font-size: 28rpx;
	}
	.lable-val {
		width: 85%;
	}
.content {
	background-color: #fff;
}
</style>
