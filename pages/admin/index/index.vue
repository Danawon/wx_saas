<template>
	<view>
		<head-nav title="管理员入口" bgColor="#fff" :goBack="true"></head-nav>
		<view class="list-box pad20 flex-row ju-bt">
			<view class="li mar-t20 " v-for="(item, index) in list" :key="index" @click="clickLi(item)">
				<view
					class="li-item pad40"
				>
					<view class="name">
						{{ item.name }}
					</view>
					<image :src="item.image" width="100%" height="100%" :lazy-load="true" :webp="true"></image>
				</view>
			</view>
		</view>
		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			:confirmText="
				 roleArr.includes(roleId)
					? '确定'
					: '去申请'
			"
			cancelText="知道了"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentConfirm="modalConfirm"
			@parentCancel="modalCancel"
			title="提示"
		>
			<view class="modalTxt pad-b40 flex">当前暂无此权限，此入口仅限{{ roleTxt }}进入</view>
		</modal-tips>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
// modal弹框组件
import modalTips from '@/components/modalTips/modalTips.vue';
import { getAdminList, ifExistRole } from '@/api/admin.js';
export default {
	components: {
		modalTips
	},
	data() {
		return {
			baseUrl: baseUrl,
			list: [],
			// modal state
			modalShow: false,
			clickItem: '',
			// 身份名字
			roleTxt: '',
			// 身份标识
			roleId: '',
			urlList: [
				{
					type: "administrator",
					url: "/pages/admin/pages/superAdmin/superAdmin",
					name: "超级管理员",
				},
				{
					type: "manager",
					url: "/pages/admin/pages/regionalManager/regionalManager?type=manager",
					name: "区域经理",
				},
				{
					type: "sporty",
					url: "/pages/admin/pages/sportsTeacherUser/sportsTeacherUser",
					name: "运动管理师",
				},
				{
					type: "investor",
					url: "/pages/admin/pages/areaInvestor/areaInvestor",
					name: "区域投资人",
				},
				{
					type: "shopowner",
					url: "/pages/admin/pages/regionalManager/regionalManager?type=store",
					name: "店长身份",
				},
				{
					type: "coach",
					url: "/pages/admin/pages/regionalManager/regionalManager?type=coach",
					name: "教练身份",
				},
				{
					type: "sale",
					url: "/pages/admin/pages/regionalManager/regionalManager?type=sale",
					name: "销售身份",
				},
				{
					type: "nutrition",
					url: "/pages/admin/pages/dietitian/index/index",
					name: "营养师",
				},
				{
					type: "finance",
					url: "/pages/admin/pages/regionalManager/regionalManager?type=finance",
					name: "区域财务",
				},
				{
					type: "customer_service",
					url: "/pages/admin/pages/customer_service/index/index",
					name: "客服",
				},
				{
					type: "doctor",
					url: "/pages/admin/pages/regionalManager/regionalManager?type=doctor",
					name: "医生",
				},
			],
			roleArr: [
				"administrator",
				"manager",
				"investor",
				"customer_service",
				"shopowner",
				"finance",
				"doctor",
			]
		};
	},
	onLoad() {
		this.getAdminListFun();
	},
	methods: {
		// 判断是或存在该身份
		ifExistRoleFun(eve, name) {
			ifExistRole({
				role_id: eve
			}).then(res => {
				let data = res.data;
				if (data.jurisdiction) { 
					uni.setStorageSync(
						'relation_id',
						res.data.relation_id
					); 
					uni.setStorageSync('role', res.data.role);
					this.modalShow = false;
					this.urlList.forEach(item => {
						if(eve == item.type) {
							this.goRoute(item.url)
						}
					})
				} else {
					this.roleId = eve;
					this.roleTxt = name;
					this.modalShow = true;
				}
			});
		},
		// 获取管理员列表
		getAdminListFun() {
			getAdminList().then(res => {
				this.list = res.data;
			});
		},
		// 点击modal取消
		modalCancel() {
			this.modalShow = false;
		},
		// modal点击确定
		modalConfirm() {
			let url = '';
			let list = [
				{
					type: "coach",
					name: "教练",
					url: "/pages/admin/pages/coachApply/coachApply"
				},
				{
					type: "sale",
					name: "销售",
					url: "/pages/admin/pages/coachApply/coachApply?type=sale"
				},
				{
					type: "sporty",
					name: "运动管理师",
					url: "/pages/admin/pages/sportsTeacher/sportsTeacher?type=sports"
				},
				{
					type: "nutrition",
					name: "营养师",
					url: "/pages/admin/pages/dietitianApply/dietitianApply"
				},
			]
			list.forEach(item => {
				if(item.type == this.roleId) {
					url = item.url
				}
			})
			this.goRoute(url);
			this.modalShow = false; 
		},
		// 选中li
		clickLi(eve) {
			this.ifExistRoleFun(eve.field, eve.name);
		},
		// 跳转对应页面
		goRoute(eve) {
			uni.navigateTo({
				url: eve
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.list-box {
	.li {
		.li-item {
			height: 100%;
			width: 100%;
			font-weight: 500;
			color: #ffffff;
			font-size: 32rpx;
			position: relative;
			image {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
			}
		}
		width: 49%;
		height: 200rpx;
		border-radius: 20rpx;
	}
	flex-wrap: wrap;
}
</style>
