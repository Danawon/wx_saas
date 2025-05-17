<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="修改资料"></head-nav>
		<view class="list">
			<view class="li padtb40 pad-r20 pad-l20 ju-bt flex-a">
				<text>头像</text>
				<view class="flex">
					<u--image :src="userInfo.avatar" width="66rpx" height="66rpx"></u--image>
					<u-icon name="arrow-right" color="#ccc" size="32rpx"></u-icon>
				</view>
			</view>
			<view class="li padtb40 pad-r20 pad-l20 ju-bt flex-a" @click.stop="show">
				<text>名称</text>
				<view class="flex">
					<text>{{ userInfo.name }}</text>
					<u-icon name="arrow-right" color="#ccc" size="32rpx"></u-icon>
				</view>
			</view>

			 
		</view>
		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			:title="' '"
			confirmText="确定"
			cancelText="取消"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentConfirm="modalConfirm"
			@parentCancel="modalCancel"
		>
			<view class="modalTxt pad-b40 flex"><u-input placeholder="请输入昵称" border="surround" v-model="userInfo.name"></u-input></view>
		</modal-tips>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import modalTips from '@/components/modalTips/modalTips.vue';
import { getInfo ,editInfo} from '@/api/dietician.js';
export default {
	components: {
		modalTips
	},
	data() {
		return {
			baseUrl: baseUrl,
			userInfo: {}, //个人信息
			modalShow: false, //修改昵称弹框true显示false隐藏
			shopName: '请填写' //店铺昵称
		};
	},
	onShow() {
		this.init();
	},
	methods: {
		//修改昵称弹框---确认框
		modalConfirm() {
			if (!this.userInfo.name) {
				uni.showToast({
					title: '请填写名称',
					icon: 'none'
				});
				return;
			}
			editInfo({name: this.userInfo.name}).then(res=>{
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
				this.modalCancel();
			})
		},
		//修改昵称弹框---取消
		modalCancel() {
			this.modalShow = false;
		},
		//修改昵称弹框---展示
		show() {
			this.modalShow = true;
		},

		//个人信息
		init() {
			getInfo().then(res => {
				this.userInfo = res.data;
			});
		},

		//跳转页面
		jump(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss">
.list {
	background-color: #f5f5f5;
	height: 100vh;

	.li {
		width: 100%;
		background-color: #fff;
		margin-bottom: 10rpx;
		font-size: 28rpx;
	}
}
</style>
