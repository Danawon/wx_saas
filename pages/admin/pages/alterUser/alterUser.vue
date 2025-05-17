<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="修改资料"
		></head-nav>
		<view class="list">
			<view
				class="li padtb40 pad-r20 pad-l20 ju-bt flex-a"
			>
				<text>头像</text>
				<view class="flex">
					<!-- <u--image :src="baseUrl + 'manager/yhj.png'" width="66rpx" height="66rpx"></u--image> -->
					<u-upload
						:fileList="avatar"
						@afterRead="afterReadAvatar"
						@delete="deleteAvatar"
						name="1"
						multiple
						:maxCount="1"
						width="150rpx"
						height="150rpx"
					></u-upload>
					<u-icon
						name="arrow-right"
						color="#ccc"
						size="32rpx"
					></u-icon>
				</view>
			</view>
			<view
				class="li padtb40 pad-r20 pad-l20 ju-bt flex-a"
				@click.stop="show(1)"
			>
				<text>店铺昵称</text>
				<view class="flex">
					<text>{{ shopName || '请填写' }}</text>
					<u-icon
						name="arrow-right"
						color="#ccc"
						size="32rpx"
					></u-icon>
				</view>
			</view>
			<view
				class="li padtb40 pad-r20 pad-l20 ju-bt flex-a"
				@click.stop="show(2)"
			>
				<text>联系人</text>
				<view class="flex">
					<text>{{ userName || '请填写' }}</text>
					<u-icon
						name="arrow-right"
						color="#ccc"
						size="32rpx"
					></u-icon>
				</view>
			</view>
			<view
				class="li padtb40 pad-r20 pad-l20 ju-bt flex-a"
				@click.stop="show(3)"
			>
				<text>联系人电话</text>
				<view class="flex">
					<text>{{ mobile || '请填写' }}</text>
					<u-icon
						name="arrow-right"
						color="#ccc"
						size="32rpx"
					></u-icon>
				</view>
			</view>
			<view
				class="li padtb40 pad-r20 pad-l20 ju-bt flex-a"
				@click="btnClick"
			>
				<text>地址</text>
				<view class="flex">
					<view class="uni-input">
						{{ areaText || '请选择' }}
					</view>
					<u-icon
						name="arrow-right"
						color="#ccc"
						size="32rpx"
					></u-icon>
				</view>
			</view>
			<view
				class="li padtb40 pad-r20 pad-l20 ju-bt flex-a"
				@click="jump"
			>
				<text>店铺详情</text>
				<view class="flex">
					<u-icon
						name="arrow-right"
						color="#ccc"
						size="32rpx"
					></u-icon>
				</view>
			</view>
			<view
				class="li padtb40 pad-r40 pad-l20 ju-bt flex-a"
			>
				<text>新用户销售比例</text>
				<view class="flex">
					<u--input
					    placeholder="请输入内容"
					    border="none"
						inputAlign="right"
					    v-model="new_customers"
						suffixIcon="%"
						type="number"
					  ></u--input>
				</view>
			</view>
			<view
				class="li padtb40 pad-r40 pad-l20 ju-bt flex-a"
			>
				<text>老用户销售比例</text>
				<view class="flex">
					<u--input
					    placeholder="请输入内容"
					    border="none"
						inputAlign="right"
					    v-model="old_customers"
						suffixIcon="%"
						type="number"
					  ></u--input>
				</view>
			</view>
			<view class="fot-btn pad20">
				<view class="btn flex" @click="confirmFun">
					保存
				</view>
			</view>
		</view>

		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			title="编辑信息"
			confirmText="确定"
			cancelText="取消"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentConfirm="modalConfirm"
			@parentCancel="modalCancel"
		>
			<view class="modalTxt pad-b40 flex">
				<u-input
					v-if="onType == 1"
					placeholder="请输入昵称"
					border="surround"
					v-model="shopName"
				></u-input>
				<u-input
					v-if="onType == 3"
					placeholder="请输入联系人电话"
					border="surround"
					v-model="mobile"
				></u-input>
				<u-input
					v-if="onType == 2"
					placeholder="请输入联系人名称"
					border="surround"
					v-model="userName"
				></u-input>
			</view>
		</modal-tips>

		<selectAddress
			ref="selectAddress"
			@selectAddress="successSelectAddress"
		></selectAddress>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import modalTips from '@/components/modalTips/modalTips.vue';
import { storeInfo, editStoreInfo } from '@/api/admin.js';
import selectAddress from '@/components/yixuan-selectAddress/yixuan-selectAddress.vue'
export default {
	components: {
		modalTips,
		selectAddress
	},
	data() {
		return {
			baseUrl: baseUrl,
			modalShow: false, //修改昵称弹框true显示false隐藏
			shopName: '', //店铺昵称
			areaText: '', // 地址
			avatar: [] ,// 头像
			mobile: "", // 联系人电话
			userName: "", // 联系人
			/* 点击类型 */
			onType: "",
			new_customers: "",
			old_customers: "",
		};
	},
	onLoad() {
		this.getStoreInfo();
	},
	methods: {
		btnClick() {
			this.$refs.selectAddress.show()
		},
		successSelectAddress(address){ //选择成功回调
			this.areaText = address
		},
		// 保存信息
		confirmFun() {
			editStoreInfo({
				name: this.shopName,
				avatar: this.avatar[0].url,
				province_name: this.areaText.split(',')[0],
				city_name: this.areaText.split(',')[1],
				area_name: this.areaText.split(',')[2],
				realname: this.userName,
				phone: this.mobile,
				new_customers: this.new_customers,
				old_customers: this.old_customers,
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
			});
		},
		// 获取门店信息
		getStoreInfo() {
			storeInfo().then(res => {
				let data = res.data;
				this.areaText = `${data.province_name},${
					data.city_name
				},${data.area_name}`;
				this.avatar = [{ url: data.avatar }];
				this.shopName = data.name;
				this.userName = data.realname;
				this.mobile = data.phone;
				this.old_customers = data.old_customers;
				this.new_customers = data.new_customers;
			});
		},
		//修改昵称弹框---确认框
		modalConfirm() {
			this.modalCancel();
		},
		//修改昵称弹框---取消
		modalCancel() {
			this.modalShow = false;
		},
		//修改昵称弹框---展示
		show(type) {
			this.onType = type;
			this.modalShow = true;
		},
		//去店铺详情
		jump() {
			uni.navigateTo({
				url: '/pages/admin/pages/shopDetail/shopDetail'
			});
		},
		// 删除 图片
		deleteAvatar(eve) {
			this.avatar.splice(eve.index, 1);
		},
		// 新增 图片
		async afterReadAvatar(eve) {
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
						this.avatar = [{ url: data.data }];
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
.fot-btn {
	margin-top: 100rpx;
	.btn {
		width: 100%;
		height: 80rpx;
		background-color: #fe5e10;
		border-radius: 40rpx;
		color: #fff;
	}
}
.list {
	background-color: #f5f5f5;
	// height: 100vh;

	.li {
		width: 100%;
		background-color: #fff;
		margin-bottom: 10rpx;
		font-size: 28rpx;
	}
}
</style>
