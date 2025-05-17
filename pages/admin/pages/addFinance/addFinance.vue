<template>
	<view>
		<head-nav
			:title="title"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="pad40">
			<view class="tel-box">
				<view class="ipt-box flex-row flex-a">
					<view class="lable ">
						手机号：
					</view>
					<view class="ipt">
						<u--input
						    placeholder="请输入手机号"
						    border="none"
						    v-model="tel"
							:disabled="operateType == 'edit'"
							:customStyle="{height: '70rpx', 'padding-left': '30rpx'}"
						  ></u--input>
					</view>
				</view>
				<u-line margin=" 50rpx 0 30rpx"></u-line>
			</view>
			<view class="permission-box">
				<view class="" v-if="type != 3">
					<view class="tit martb40">负责门店</view>
					<u-checkbox-group
						v-model="selectCheck1"
						placement="row"
					>
						<view class="li-box flex-row flex-a ju-bt">
							<view
								class="li mar-b40 flex"
								v-for="(item, index) in shopList"
								:key="index"
							>
								<u-checkbox
									:checked="
										selectCheck1.includes(
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
				<view class="tit martb40" v-if="type == 3">
					功能权限配置
				</view>
				<u-checkbox-group
					v-if="type == 3"
					v-model="selectCheck2"
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
									selectCheck2.includes(
										item.id
									)
								"
								:label="item.tit"
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
import { 
	addShopManager, 
	shopList, 
	addFinance, 
	addInvestor, 
	roleInfoDetail, 
	editRoleInfo,
	editStoreJurisdiction,
	addDoctor,
} from '@/api/admin.js';
export default {
	data() {
		return {
			// 权限门店列表
			shopList: [],
			// 权限配置
			permissionList: [
				{
					tit: '发放优惠卷',
					id: 1
				}
			],
			// 选中的check 门店
			selectCheck1: [],
			// 选中的check 权限
			selectCheck2: [],
			// 电话
			tel: '',
			// 页面标题
			title: '标题',
			// 身份类型
			type: '',
			/* 编辑用户id */
			uId: "",
			/* 操作类型 */
			operateType: "",
			/* 门店id */
			storeId: "",
		};
	},
	onLoad(eve) {
		/* 门店id */
		this.storeId= eve.storeId;
		this.type = eve.type;
		/* 操作类型 */
		this.operateType = eve.operateType;
		// 获取门店列表
		this.getShopList();
		let operateArr = [
			{
				type: 1,
				tit1: '新增分区财务',
				tit2: '编辑分区财务',
			},{
				type: 2,
				tit1: '新增投资人',
				tit2: '编辑投资人',
			},{
				type: 3,
				tit1: '新增店长',
				tit2: '编辑店长',
			},{
				type: 4,
				tit1: '新增医生',
				tit2: '编辑医生',
			},
		]
		operateArr.map(item => {
			if(item.type == eve.type) {
				this.title = this.operateType == 'add' ? item.tit1 : item.tit2
			}
		})
		if(this.operateType == 'edit') {
			this.uId = eve.id;
			this.getRoleInfoDetail();
		}
	},
	methods: {
		/* 获取角色详细信息 */
		getRoleInfoDetail() {
			roleInfoDetail({
				id: this.uId,
			}).then(res => {
				this.tel = res.data.mobile
				if(this.type == 3) {
					this.selectCheck2 = [res.data.coupon_permission];
					return
				}
				/* 负责门店 */
				this.selectCheck1.push(...res.data.manage_store.split(",").map(Number));
				
			})
		},
		/* 编辑权限信息 */
		editRole() {
			if(this.type == 3) {
				editStoreJurisdiction({
					id: this.uId,
					coupon_permission: this.selectCheck2.join(",")
				}).then(res => {
					this.requestOver(res);
				})
			}else{
				editRoleInfo({
					id: this.uId,
					manage_store: this.selectCheck1.join(","),
				}).then(res => {
					this.requestOver(res);
				})
			}
		},
		// 新增区域财务
		addFinanceFun() {
			if(this.operateType == 'edit') {
				this.editRole();
			}else {
				addFinance({
					mobile: this.tel,
					manage_store: this.selectCheck1.join(','),
				}).then(res => {
					this.requestOver(res);
				});
			}
		},
		// 新增投资人
		addInvestorFun() {
			if(this.operateType == 'edit') {
				this.editRole();
			}else {
				addInvestor({
					mobile: this.tel,
					manage_store: this.selectCheck1.join(','),
				}).then(res => {
					this.requestOver(res);
				});
			}
		},
		// 新增店长
		addShopManagerFun() {
			if(this.operateType == 'edit') {
				this.editRole();
			}else {
				addShopManager({
					mobile: this.tel,
					store_id: this.storeId,
					coupon_permission: this.selectCheck2.join(",")
				}).then(res => {
					this.requestOver(res);
				});
			}
		},
		// 新增医生
		addDoctorFun() {
			if(this.operateType == 'edit') {
				this.editRole();
			}else {
				addDoctor({
					mobile: this.tel,
					manage_store: this.selectCheck1.join(",")
				}).then(res => {
					this.requestOver(res);
				});
			}
		},
		requestOver(res) {
			uni.showToast({
				title: res.msg
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		},
		// 点击确定
		confirmFun() {
			let arr = [
				{
					callBack: this.addDoctorFun,
					type: 4,
				},
				{
					callBack: this.addShopManagerFun,
					type: 3,
				},
				{
					callBack: this.addInvestorFun,
					type: 2,
				},
				{
					callBack: this.addFinanceFun,
					type: 1,
				},
			]
			arr.forEach(item => {
				if(item.type == this.type) {
					item.callBack();
				}
			})
		},
		
		// 获取门店列表
		getShopList() {
			shopList().then(res => {
				this.shopList = res.data;
			});
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
		margin-right: 30rpx;
	}
	flex-wrap: wrap;
}
.tit {
	font-weight: 400;
	color: rgba(0, 0, 0, 0.9);
	font-size: 35rpx;
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
