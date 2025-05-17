<template>
	<view class="wrap-min">
		<head-nav title="地址管理" :goBack="true"></head-nav>
		<view class="info-box  mar-t20">
			<u--form
				:model="formData"
				ref="uForm"
				:labelStyle="{
					'font-weight': 'bold'
				}"
			>
				<u-form-item
					label="收货人"
					labelWidth="180rpx"
					prop="consigneeVla"
					borderBottom
				>
					<u-input
						v-model="formData.consigneeVla"
						border="none"
						placeholder="请输入收货人姓名"
					/>
				</u-form-item>
				<u-form-item
					class="mar-t40"
					label="手机号码"
					labelWidth="180rpx"
					prop="phone"
					borderBottom
				>
					<u-input
						v-model="formData.phone"
						border="none"
						placeholder="请输入手机号码"
						type="number"
					/>
				</u-form-item>
				<u-form-item
					class="mar-t40"
					label="所在地区"
					labelWidth="180rpx"
					prop="region"
					borderBottom
				>
					<u-cell-group :border="false">
						<u-cell
							:border="false"
							:title="formData.region"
							@click="regionVisible = true"
						>
							<view class="" slot="right-icon">
								<u-icon
									name="arrow-right"
								></u-icon>
							</view>
						</u-cell>
					</u-cell-group>
				</u-form-item>
				<u-form-item
					class="mar-t40"
					label="详细地址"
					labelWidth="180rpx"
					prop="inDetail"
				>
					<u-input
						v-model="formData.inDetail"
						border="none"
						placeholder="请输入详细地址"
					/>
				</u-form-item>
			</u--form>
		</view>
		<view class="fot-btn flex ">
			<view class="btn flex" @click="submit">
				保存
			</view>
		</view>
		<!-- 地址选择插件 -->
		<cityPicker
			:defaultValue="defaultValue"
			:mask-close-able="true"
			@confirm="confirm"
			@cancel="cancel"
			:visible="regionVisible"
		/>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import cityPicker from '@/components/piaoyi-cityPicker/pioayi-cityPicker.vue';
import { addAddress, addressDetail, editAddress } from '@/api/mall.js';
export default {
	components: {
		cityPicker
	},
	data() {
		return {
			formData: {
				// 收货人
				consigneeVla: '',
				// 电话
				phone: '',
				// 详细地址
				inDetail: '',
				// 所在地区
				region: ""
			},
			// 表单验证
			rules: {
				consigneeVla: [
					{
						required: true,
						message: '请输入收获人姓名',
						trigger: ['blur', 'change']
					}
				],
				phone: [
					{
						required: true,
						message: '请输入手机号码',
						trigger: 'blur'
					}
				],
				inDetail: [
					{
						required: true,
						message: '请输入详细地址',
						trigger: 'blur'
					}
				],
				region: [
					{
						required: true,
						message: '请选所在地区',
						trigger: 'blur'
					}
				]
			},
			// 选择地区插件state
			regionVisible: false,
			// 回显使用的地址编码
			defaultValue: '',
			addressId: "", // 地址id
		};
	},
	onLoad(e) {
		this.addressId = e.id;
		if(this.addressId){
			this.getAddressDetail()
		}
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		// 获取地址详情
		getAddressDetail() {
			addressDetail({
				id: this.addressId
			}).then(res => {
				this.formData.consigneeVla = res.data.name
				this.formData.phone = res.data.mobile
				this.formData.region = `${res.data.province},${res.data.city},${res.data.area}`
				this.formData.inDetail = res.data.address
				this.formData.consigneeVla = res.data.name
			})
		},
		// 地址确定
		confirm(val) {
			// 地址编码
			this.addressCode = val.code;
			this.formData.region = val.name;
			this.regionVisible = false;
		},
		// close 地址选择
		cancel() {
			this.regionVisible = false;
		},
		// 编辑地址
		editAddressFun() {
			editAddress({
				id: this.addressId,
				name: this.formData.consigneeVla,
				mobile: this.formData.phone,
				address: this.formData.inDetail,
				province: this.formData.region.split(",")[0],
				city: this.formData.region.split(",")[1],
				area: this.formData.region.split(",")[2],
				is_use: 2
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					title: '成功主题(带图标)',
					message: res.msg
				});
				
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			});
		},
		// 新增地址
		addAddressFun() {
			addAddress({
				name: this.formData.consigneeVla,
				mobile: this.formData.phone,
				address: this.formData.inDetail,
				province: this.formData.region.split(",")[0],
				city: this.formData.region.split(",")[1],
				area: this.formData.region.split(",")[2],
				is_use: 2
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					title: '成功主题(带图标)',
					message: res.msg
				});
				
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			});
		},
		// 验证表单
		submit() {
			this.$refs.uForm
				.validate()
				.then(res => {
					if(this.addressId) {
						this.editAddressFun();
					}else {
						this.addAddressFun();
					}
				})
				.catch(errors => {
					uni.$u.toast('校验失败');
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.fot-btn {
	.btn {
		width: 100%;
		height: 80rpx;
		background-color: #fe5e10;
		color: #fff;
		border-radius: 40rpx;
	}
	padding: 0 40rpx;
	margin-top: 50rpx;
}
::v-deep .u-form-item:not(:first-child) {
	margin: 30rpx 0 20rpx;
}
.mar-t40 {
	margin-top: 40rpx;
}
.info-box {
	background-color: #fff;
	padding: 30rpx 40rpx 10rpx;
}
</style>
