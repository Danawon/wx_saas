<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="标签"></head-nav>
		<view class="page pad40">
			<view class="title mar-b20">当前标签</view>
			<view class="flex-a lable-btn-box">
				<view class=" flex-a" v-for="(item, index) in coachInfo.label" :key="index">
					<u-tag :text="item"  closable  @close="deleLable(index)"></u-tag>
				</view>
			</view>
			<view class="title">添加新标签</view>
			<view class="mar40 flex-row flex-a ju-bt">
				<view class="ipt-box">
					<u-input placeholder="请输入" border="surround" maxlength="6" v-model="lableVal">
					</u-input>
				</view>
				
				<view class="add-btn" @click="addLable">
					<u-button type="primary" :customStyle="{height: '73rpx'}"  text="确定"></u-button>
				</view>
			</view>
			<view class="txt">注:最多添加3个标签,每个标签最多5字</view>

			<view class="btn flex" @click="submitFun">保存</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { addLable } from "@/api/admin.js"
export default {
	data() {
		return {
			coachInfo: {}, // 教练信息
			lableVal: "",
		};
	},
	onLoad(e) {
		this.coachInfo = JSON.parse(e.data)
	},
	methods: {
		/* 添加标签 */
		addLable() {
			if(this.coachInfo.label.length >= 3) {
				uni.showToast({
					title: "最多三个标签！",
					icon: "error"
				})
				return
			}
			if(!this.lableVal) {
				uni.showToast({
					title: "请输入标签后点击确定！",
					icon: "none"
				})
				return
			}
			this.coachInfo.label.push(this.lableVal);
			this.lableVal = '';
		},
		/* 删除标签 */
		deleLable(index) {
			this.coachInfo.label.splice(index, 1)
		},
		/* 保存 */
		submitFun() {
			addLable({
				coach_id: this.coachInfo.id,
				label: this.coachInfo.label.join()
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			})
		},
	}
};
</script>

<style lang="scss">
	.ipt-box {
		width: 80%;
	}
	.add-btn {
		width: 15%rpx;
	}
.page {
	padding: 26rpx 24rpx;

	.title {
		font-size: 32rpx;
		font-weight: 550;
		color: rgba(0, 0, 0, 0.9);
	}
	.lable-btn-box {
		flex-wrap: wrap;
		margin-bottom: 40rpx;

	}
	.txt {
		font-size: 24rpx;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.26);
	}

	.btn {
		height: 74rpx;
		width: 95%;
		background: #fe5e10;
		border-radius: 48rpx;
		font-size: 32rpx;
		color: #fff;
		position: absolute;
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
	}
}
</style>
