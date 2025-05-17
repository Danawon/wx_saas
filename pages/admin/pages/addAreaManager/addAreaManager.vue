<template>
	<view>
		<head-nav
			:title="title"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="pad40">
			<view class="ipt-box flex-row flex-a">
				<view class="lable ">
					手机号：
				</view>
				<view class="ipt">
					<u--input
					    placeholder="请输入手机号"
					    border="none"
					    v-model="tel"
						:disabled="goInState == 'edit'"
						:customStyle="{height: '70rpx', 'padding-left': '30rpx'}"
					  ></u--input>
				</view>
			</view>
			<u-line margin=" 50rpx 0 30rpx"></u-line>
			<view class="permission-box">
				<view class="tit martb40">功能权限配置</view>
				<u-checkbox-group
					v-model="selectCheck"
					placement="row"
				>
					<view class="li-box flex-row flex-a ju-bt">
						<view
							class="li mar-b40 flex"
							v-for="(item,
							index) in permissionList"
							:key="index"
						>
							<u-checkbox
								:checked="
									selectCheck.includes(
										item.id
									)
								"
								:label="item.name"
								:name="item.id"
							></u-checkbox>
						</view>
					</view>
				</u-checkbox-group>
			</view>
		</view>
		<view class="fot-btn pad20">
			<view class="btn flex" @click="confirmFun">
				保存
			</view>
		</view>
	</view>
</template>
<script>
import { shopList, addManager, roleInfoDetail, editRoleInfo } from "@/api/admin.js"
export default {
	data() {
		return {
			// 权限门店列表
			permissionList: [],
			// 选中的check
			selectCheck: [],
			// 手机号
			tel: "",
			/* 页面标题 */
			title: "添加分区经理",
			/* 进入页面状态 */
			goInState: '',
			uId: "",
		};
	},
	onLoad(e) {
		this.goInState = e.type;
		if(e.type == 'edit') {
			this.uId = e.id;
			this.getRoleInfoDetail();
			this.title = "编辑分区经理"
		}
		this.getShopList();
	},
	methods: {
		/* 获取角色详细信息 */
		getRoleInfoDetail() {
			roleInfoDetail({
				id: this.uId,
			}).then(res => {
				this.tel = res.data.mobile
				this.selectCheck.push(...res.data.manage_store.split(",").map(Number));
				
			})
		},
		// 获取门店列表
		getShopList() {
			shopList().then(res => {
				this.permissionList = res.data;
			})
		},
		confirmFun() {
			if(!this.tel || !this.selectCheck.length) {
				uni.showToast({
					title: "请输入手机号和选择权限",
					icon: "none"
				})
			}
			if(this.goInState == 'edit') {
				editRoleInfo({
					id: this.uId,
					manage_store: this.selectCheck.join(",")
				}).then(res => {
					uni.showToast({
						title: res.msg
					})
					setTimeout(() => {
						uni.navigateBack()
					},1500)
				})
			}else {
				addManager({
					mobile: this.tel,
					manage_store: this.selectCheck.join(",")
				}).then(res => {
					uni.showToast({
						title: res.msg
					})
					setTimeout(() => {
						uni.navigateBack()
					},1500)
				})
			}
			
		}
	}
};
</script>

<style lang="scss" scoped>
	.ipt-box {
		.ipt {
			width: 85%;
			border-radius: 30rpx;
			background: #F5F5F5;
		}
		.lable {
			width: 25%;
		}
	}
.li-box {
	.li {
		// min-width: 33.33%;
		margin-right: 30rpx;
	}
	flex-wrap: wrap;
}
.tit {
	font-weight: 400;
	color: rgba(0, 0, 0, 0.9);
	font-size: 36rpx;
}
.fot-btn {
	.btn {
		height: 80rpx;
		border-radius: 40rpx;
		color: #fff;
		background: #fe5e10;
		font-weight: 400;
		font-size: 32rpx;
	}
	position: fixed;
	bottom: 20rpx;
	width: 100%;
	left: 0;
	background-color: #fff;
}

</style>
