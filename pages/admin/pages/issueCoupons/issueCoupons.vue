<template>
	<view>
		<head-nav
			title="发送优惠劵"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<u-line></u-line>
		<view class="pad20 mar-t">
			<view class="li pad-t20">
				<view class="li-form flex-row flex-a ju-bt">
					<view class="li-lable">卡券金额</view>
					<view class="li-val">
						<u--input
							inputAlign="right"
							placeholder="单行输入"
							border="none"
							type="digit"
							v-model="cardPrice"
						></u--input>
					</view>
				</view>
				<view class="li-line">
					<u-line margin="40rpx 0"></u-line>
				</view>
			</view>	
			<view class="li " @click="startTimeShow = true">
				<view class="li-form flex-row flex-a ju-bt" >
					<view class="li-lable">起始时间</view>
					<view class="li-val flex-row flex-a">
						<text class="mar-r20">{{ startDate }}</text>
						<u-icon
							name="arrow-right"
							color="#999999"
							size="28rpx"
						></u-icon>
					</view>
				</view>
				<view class="li-line">
					<u-line margin="40rpx 0"></u-line>
				</view>
			</view>
			<view class="li " @click="endTimeShow = true">
				<view class="li-form flex-row flex-a ju-bt">
					<view class="li-lable">失效时间</view>
					<view class="li-val flex-row flex-a">
						<text class="mar-r20">{{ endDate }}</text>
						<u-icon
							name="arrow-right"
							color="#999999"
							size="28rpx"
						></u-icon>
					</view>
				</view>
				<view class="li-line">
					<u-line margin="40rpx 0"></u-line>
				</view>
			</view>
			<view class="li " @click="scopeModal = true" >
				<view class="li-form flex-row flex-a ju-bt">
					<view class="li-lable">发放范围</view>
					<view class="li-val flex-row flex-a">
						<text class="mar-r20">{{ scopeTxt }}</text>
						<u-icon
							name="arrow-right"
							color="#999999"
							size="28rpx"
						></u-icon>
					</view>
				</view>
				<view class="li-line">
					<u-line margin="40rpx 0"></u-line>
				</view>
			</view>	
		
			<view class="li " @click="productModal = true" v-if="scopeId == 'store_special' || scopeId == 'platform_special'">
				<view class="li-form flex-row flex-a ju-bt">
					<view class="li-lable">选择产品类型</view>
					<view class="li-val flex-row flex-a">
						<text class="mar-r20">{{ productTypeTxt }}</text>
						<u-icon
							name="arrow-right"
							color="#999999"
							size="28rpx"
						></u-icon>
					</view>
				</view>
				<view class="li-line">
					<u-line margin="40rpx 0"></u-line>
				</view>
			</view>
			
			<view class="li " @click="relationModal = true" v-if="productTypeId && productTypeId != 'lockers'">
				<view class="li-form flex-row flex-a ju-bt">
					<view class="li-lable prod-sty">选择产品</view>
					<view class="li-val prod-val flex-row flex-a">
						<text class="mar-r20">{{ relationTxt }}</text>
						<u-icon
							name="arrow-right"
							color="#999999"
							size="28rpx"
						></u-icon>
					</view>
				</view>
				<view class="li-line">
					<u-line margin="40rpx 0"></u-line>
				</view>
			</view>
		</view>
		
		<view class="fot-btn pad20">
				<view class="btn flex" @click="confirmFun">确定发放</view>
		</view>
		
		<!-- 请选择产品 -->
		<u-action-sheet
			class="productSheetBox"
			:actions="relationArr"
			@select="selectRelation"
			title="请选择产品"
			:show="relationModal"
			cancelText="关闭"
			@close="relationModal = false"
		></u-action-sheet>	
		<!-- 选择产品类型 -->
		<u-action-sheet
			:actions="productTypeArr"
			@select="selectProduct"
			title="请选择产品类型"
			:show="productModal"
			cancelText="关闭"
			@close="productModal = false"
		></u-action-sheet>
		<!-- 选择优惠卷发放范围 -->
		<u-action-sheet
			:actions="scopeArr"
			@select="selectScope"
			title="请选择范围"
			:show="scopeModal"
			cancelText="关闭"
			@close="scopeModal = false"
		></u-action-sheet>
		<!-- 失效日期选择 -->
		<u-datetime-picker
			:show="endTimeShow"
			v-model="endTime"
			mode="date"
			@close="endTimeShow = false"
			@confirm="selectEndTime"
			@cancel="endTimeShow = false"
			:minDate="new Date().getTime()"
		></u-datetime-picker>	
		<!-- 起始日期选择 -->
		<u-datetime-picker
			:show="startTimeShow"
			v-model="startTime"
			mode="date"
			@close="startTimeShow = false"
			@confirm="selectStartTime"
			@cancel="startTimeShow = false"
			:minDate="new Date().getTime()"
		></u-datetime-picker>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { timestampToTime } from "@/utils/util.js";
import { productData, addCoupon, couponScope, couponProductTypeList, couponProductList } from "@/api/admin.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 卡卷金额
			cardPrice: '',
			// 用户ids
			userIds: "",
			// 起始时间选择modal
			startTimeShow: false,
			// 选中起始时间
			startTime: "",
			// 选中起始时间日期
			startDate: "",
			// 选择范围modal
			scopeModal: false,
			// 产品范围数据
			scopeArr: [
			
			],
			// 范围文本
			scopeTxt: "",
			// 范围id
			scopeId: "",
			// 失效时间选择modal
			endTimeShow: false,
			// 选中失效时间
			endTime: "",
			// 选中失效时间日期
			endDate: "",
			// 产品选择modal
			productModal: false,
			// 产品数据
			productTypeArr: [],
			// 选中的产品id
			productTypeId: "",
			// 产品名称
			productTypeTxt: "",
			// 门店选择modal
			relationModal: false,
			/* 产品关联列表 */
			relationArr: [],
			/* 产品关联ID */
			relationId: "",
			/* 产品关联文本 */
			relationTxt: "",
			// 门店名称
			storeTxt: "",
			// 父级页面类型
			type: "",
		};
	},
	onLoad(e) {
		this.type = e.type
		// 起始时间戳 当前
		this.startTime = new Date().getTime();
		this.startDate = timestampToTime(new Date().getTime() / 1000).split(" ")[0]
		this.userIds = e.userIds
		/* 获取优惠卷范围 */
		this.getCouponScope();
	},
	onReachBottom() {

	},
	methods: {
		/* 获取优惠卷范围 */
		getCouponScope() {
			couponScope().then(res => {
				this.scopeArr = res.data;
			})
		},
		/* 获取产品列表数据 */
		getCouponProductList() {
			couponProductList({
				product: this.productTypeId
			}).then(res => {
				this.relationArr = res.data
			})
		},
		// 选中 优惠卷指定产品id
		selectRelation(e) {
			this.relationId = e.id;
			this.relationTxt = e.name;
		},
		// 选中产品类型
		selectProduct(e) {
			this.productTypeTxt = e.name;
			this.productTypeId = e.field;
			this.relationId = '';
			this.relationTxt = '';
			if(e.field != 'lockers') {
				this.getCouponProductList();
			}
		},
		// 获取产品类型数据
		getProductData() {
			couponProductTypeList().then(res => {
				this.productTypeArr = res.data;
			})
		},
		// 选中范围
		selectScope(e) {
			this.scopeTxt = e.name;
			this.scopeId = e.field;
			this.productTypeTxt = '';
			this.productTypeId = '';
			this.relationId = '';
			this.relationTxt = '';
			if(e.field == "store_special" || e.field == 'platform_special') {
				// 获取产品数据
				this.getProductData();
			}
		},
		// 选中失效日期
		selectEndTime(e) {
			this.endTime = e.value;
			this.endDate  = timestampToTime(e.value / 1000).split(" ")[0]
			this.endTimeShow = false;
		},
		// 选中起始日期
		selectStartTime(e) {
			this.startTime = e.value;
			this.startDate  = timestampToTime(e.value / 1000).split(" ")[0]
			this.startTimeShow = false;
		},
		// 确定发放
		confirmFun() {
			if(
				!this.endDate || 
				!this.startDate || 
				!this.cardPrice  ||
				!this.scopeId
			) {
				uni.showToast({
					title: "请选择或输入完整内容！",
					icon: "none"
				})
				return
			}
			if(this.scopeId == 'store_special' || this.scopeId == 'platform_special') {
				if(!this.productTypeId ) {
					uni.showToast({
						title: "请选择或输入完整内容！",
						icon: "none"
					})
					return
				}else {
					if(this.productTypeId && this.productTypeId != 'lockers') {
						if(!this.relationId) {
							uni.showToast({
								title: "请选择或输入完整内容！",
								icon: "none"
							})
							return
						}
					}
				}
			}

			addCoupon({
				uid: this.userIds,
				bond_price: this.cardPrice,
				usetime: this.startDate,
				deadtime: this.endDate,
				grant_range: this.scopeId,
				product: this.productTypeId,
				relation_id: this.relationId ?? ''
			}).then(res => {
				uni.showToast({
					title:res.msg,
				})
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	.productSheetBox {
		/deep/ .u-action-sheet__item-wrap__item {
			padding: 18rpx 0;
		}
	}
	.prod-val {
		width: 80%;
		justify-content: flex-end;
	}
	.prod-sty {
		width: 20%;
	}
	.fot-btn {
		.btn {
			width: 100%;
			height: 80rpx;
			color: #fff;
			border-radius: 40rpx;
			background-color: #fe5e10;
		}
		margin-top: 100rpx;
	}
	.li-lable {
		font-weight: 400;
		color: rgba(0,0,0,0.9);
		font-size: 28rpx;
	}
</style>
