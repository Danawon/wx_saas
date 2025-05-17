<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="发布会员卡"
		></head-nav>
		<view class="page pad20">
			<view
				class="page-li  flex-a ju-bt right"
				@click="cardTypeShow = true"
			>
				<text>卡的类别</text>
				<text>{{ cardTypeTxt }}</text>
			</view>

			<view
				class="page-li flex-a ju-bt "
				v-if="cardTypeTxt == '私教课'"
			>
				<text>约课人数</text>
				<view class="input-box">
					<u-input
						v-model="population"
						placeholder="请输入内容"
						border="surround"
						type="number"
					></u-input>
				</view>
			</view>
			<view
				class="page-li flex-a ju-bt right"
				style="border: none;"
				@click="productTypeShow = true"
			>
				<text>产品类别</text>
				<text>{{ productTypeTxt }}</text>
			</view>
			<view
				class="page-li flex-a ju-bt right"
				style="border: none;"
				v-if="productTypeId != 'custom_card'"
			>
				<text>产品种类</text>
				<view class="">
					  <u-radio-group
					    v-model="cardKind"
					    placement="row"
					  >
					    <u-radio
					      label="周期卡"
					      name="cycle_card"
					    >
					    </u-radio>
						<u-radio
						  label="非周期卡"
						  name="aperiodic_card"
						>
						</u-radio>
					  </u-radio-group>
				</view>
			</view>

			<view
				class="page-li flex-a ju-bt "
			>
				<text>备注</text>
				<view class="input-box" style="width: 550rpx;">
					<u-input
						v-model="remark"
						placeholder="请输入内容"
						border="surround"
					></u-input>
				</view>
			</view>
			<u-gap height="14rpx" bgColor="#F5F5F5"></u-gap>
			<view class="title pad-l20 pad-b20">扩展信息</view>
			<!-- 固定次数 -->
			<template v-if="productTypeTxt == '固定次数卡'">
				<view class="bg mar-r20">
					<view class="page-li flex-a ju-bt ">
						<text>约课次数</text>
						<view class="input-box flex-row flex-a">
							<view class="ipt-w mar-r20">
								<u-input
									v-model="courseTimes"
									placeholder="单位：次"
									border="surround"
									type="number"
								></u-input>
							</view>
							<view class="flex-col flex-a">
								<u-switch
									v-model="courseTimesShow"
									:activeValue="1"
									:inactiveValue="0"
									size="20"
								></u-switch>
								<view class="tip-txt">
									(开启显示总次数)
								</view>
							</view>
							
						</view>
					</view>
					<view class="page-li flex-a ju-bt ">
						<text>有效天数</text>
						<view class="input-box">
							<u-input
								v-model="courseDays"
								placeholder="单位：天"
								border="surround"
								type="number"
							></u-input>
						</view>
					</view>
				</view>
			</template>
			<!-- 无限次数 -->
			<template v-if="productTypeTxt == '自定义次数卡'">
				<view class="bg mar-b20">
					<u-gap
						height="28rpx"
						bgColor="#F5F5F5"
					></u-gap>
					<view
						class="msg-box flex-a mar-b20"
						v-for="(item, index) in customArr"
						:key="index"
					>
						次数：{{ item.min }}-{{ item.max }}次
						{{ item.day }}天 {{ item.discount }}折
						<view
							class="icon-box"
							@click="delCustom(index)"
						>
							<u-icon
								name="close-circle-fill"
								size="40rpx"
								color="#999999"
							></u-icon>
						</view>
					</view>
					<view class="page-li flex-a ju-bt ">
						<text>最小次数</text>
						<view class="input-box">
							<u-input
								v-model="customObj.min"
								placeholder="单位：次"
								border="surround"
								type="digit"
							></u-input>
						</view>
					</view>
					<view class="page-li flex-a ju-bt ">
						<text>最高次数</text>
						<view class="input-box">
							<u-input
								v-model="customObj.max"
								placeholder="单位：次"
								border="surround"
								type="digit"
							></u-input>
						</view>
					</view>
					<view class="page-li flex-a ju-bt ">
						<text>天数</text>
						<view class="input-box">
							<u-input
								v-model="customObj.day"
								placeholder="单位：天"
								border="surround"
								type="digit"
							></u-input>
						</view>
					</view>
					<view class="page-li flex-a ju-bt ">
						<text>折扣</text>
						<view class="input-box">
							<u-input
								v-model="customObj.discount"
								placeholder="单位：折"
								border="surround"
								type="digit"
							></u-input>
						</view>
					</view>

					<view class="add flex" @click="addCustom">
						添加
					</view>
					<u-gap
						height="28rpx"
						bgColor="#F5F5F5"
					></u-gap>
				</view>
			</template>
			<view class="title pad-l20 pad-b20">封面图片</view>
			<view class="upload pad20">
				<u-upload
					:fileList="coverImg"
					@afterRead="afterReadCover"
					@delete="deleteCover"
					name="6"
					multiple
					:maxCount="1"
					width="180rpx"
					height="180rpx"
				>
					<view class="up-icon flex">
						<u-icon
							name="plus"
							color="#999999"
							size="45rpx"
						></u-icon>
					</view>
				</u-upload>
			</view>
			<view class="title pad-l20 pad-b20">基础信息</view>
			<view class="bg mar-r20">
				<view class="page-li flex-a ju-bt ">
					<text>单人限购次数</text>
					<view class="input-box">
						<u-input
							v-model="quotaTimes"
							placeholder="0=不限购"
							border="surround"
						></u-input>
					</view>
				</view>
				<view class="page-li flex-a ju-bt ">
					<text>总共限购次数</text>
					<view class="input-box">
						<u-input
							v-model="quotaDays"
							placeholder="请输入"
							border="surround"
							type="number"
						></u-input>
					</view>
				</view>
				<view class="page-li flex-a ju-bt ">
					<text>会员卡名称</text>
					<view class="input-box">
						<u-input
							v-model="cardName"
							placeholder="请输入"
							border="surround"
						></u-input>
					</view>
				</view>
				<view class="page-li flex-a ju-bt ">
					<text>现价</text>
					<view class="input-box">
						<u-input
							v-model="goingPrice"
							placeholder="请输入"
							border="surround"
							type="number"
						></u-input>
					</view>
				</view>
				<view class="page-li flex-a ju-bt ">
					<text>划线价</text>
					<view class="input-box">
						<u-input
							v-model="originalCost"
							placeholder="请输入"
							border="surround"
							type="number"
						></u-input>
					</view>
				</view>
				<view
					class="page-li flex-a ju-bt "
					v-if="cardTypeId != 'autonomous_class'"
				>
					<text>课时费</text>
					<view class="input-box">
						<u-input
							v-model="course_fee"
							placeholder="请输入"
							border="surround"
							type="number"
						></u-input>
					</view>
				</view>
				<view class="page-li flex-a ju-bt ">
					<text>自动激活</text>
					<view class="input-box">
						<u-input
							v-model="autoDay"
							placeholder="请输入"
							border="surround"
						></u-input>
					</view>
				</view>
				<view class="page-li flex-a ju-bt ">
					<text>简介</text>
					<view class="input-box">
						<u-input
							v-model="synopsis"
							placeholder="20字以内"
							border="surround"
						></u-input>
					</view>
				</view>
			</view>
			<view class="title">购买须知</view>
			<view class="textarea-box mar-t20">
				<u--textarea
					v-model="notice"
					autoHeight
					placeholder="请输入内容"
					maxlength="-1"
				></u--textarea>
			</view>
			<view class="title ">产品介绍</view>
			<view class="introduce mar-t20 pad20">
				<view class="textarea-box">
					<u--textarea
						v-model="introduceTxt"
						placeholder="请输入内容"
						border="none"
						maxlength="-1"
						autoHeight
					></u--textarea>
				</view>
				<view class="upload  ">
					<u-upload
						:fileList="introduceImg"
						@afterRead="afterReadIntroduce"
						@delete="deleteIntroduce"
						name="6"
						multiple
						:maxCount="1"
						width="180rpx"
						height="180rpx"
					>
						<view class="up-icon flex">
							<u-icon
								name="plus"
								color="#999999"
								size="45rpx"
							></u-icon>
						</view>
					</u-upload>
				</view>
			</view>
			<view class="btn mar40 flex" @click="confirmFun">
				确定
			</view>
		</view>

		<!-- 选择产品类别 -->
		<u-action-sheet
			:actions="productTypeList"
			@select="selectProductType"
			title="请选择产品类别"
			:show="productTypeShow"
			cancelText="关闭"
			@close="productTypeShow = false"
		></u-action-sheet>
		<!-- 选择卡类别 -->
		<u-action-sheet
			:actions="cardTypeList"
			@select="selectCardType"
			title="请选择卡类别"
			:show="cardTypeShow"
			cancelText="关闭"
			@close="cardTypeShow = false"
		></u-action-sheet>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import {
	getCardSelectInfo,
	addCardFixedAndCustom,
	getProductDetail,
	editProduct
} from '@/api/admin.js';
import { editStr } from '@/common/common.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			productTypeId: '', //产品类别id
			productTypeTxt: '', //产品类别文本
			productTypeShow: false, // 产品类别modal
			productTypeList: [], // 产品类别 数据
			cardTypeTxt: '', // 卡的类别文本
			cardTypeId: '', // 卡的类别id
			cardTypeShow: '', // 卡的类别 modal 状态、
			cardTypeList: [], // 卡的类别 数据
			population: '', // 约课人数
			courseTimes: '', // 约课次数
			courseTimesShow: 0, // 是否显示约课次数
			courseDays: '', // 有效天数
			quotaTimes: '', // 限购次数
			quotaDays: '', // 总共限购天数
			coverImg: [], // 封面图片
			cardName: '', // 会员卡名称
			goingPrice: '', // 现价
			originalCost: '', // 原价 划线价
			autoDay: '', // 自动激活 天数
			synopsis: '', // 简介
			introduceTxt: '', // 介绍文本
			introduceImg: [], // 介绍 图片
			customArr: [], // 自定义卡 添加折扣数据
			course_fee: '', // 课时费
			remark: "",
			// 自定义卡对象
			customObj: {
				min: '', // 最小次数
				max: '', // 最大次数
				day: '', // 天数
				discount: '' // 折扣
			},
			// 父级页面类型
			jumpType: '',
			// 产品id
			productId: '',
			/* 购买须知 */
			notice: '',
			cardKind: "", // 产品种类
		};
	},
	onLoad(eve) {
		this.jumpType = eve.type;
		this.productId = eve.id;

		this.getCardSelectInfoFun();
		if (eve.type == 'edit') {
			this.getProductDetailFun();
		}
	},
	methods: {
		// 产品编辑
		editProductFun() {
			if (this.filterVal()) {
				return;
			}
			editProduct(this.getOBJ()).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			});
		},
		// 获取产品信息
		getProductDetailFun() {
			getProductDetail({
				id: this.productId
			}).then(res => {
				let data = res.data;
				this.productTypeId = data.product_type; //产品类别id
				this.productTypeTxt = data.product_type_text; //产品类别文本
				this.cardTypeId = data.card_type; // 卡的类别id
				this.cardTypeTxt = data.card_type_text; // 卡的类别文本
				this.notice = data.instructions; //购买须知

				this.population = data.number; // 约课人数
				this.customArr = data.discount;
				this.courseTimes = data.times; // 约课次数
				this.courseTimesShow = data.times_show; // 是否显示约课次数
				this.courseDays = data.days; // 有效天数
				this.course_fee = data.course_fee;
				// 封面图
				this.coverImg = [
					{
						url: data.image
					}
				];
				this.quotaTimes = data.single_quota; // 限购次数
				this.quotaDays = data.total_quota; // 总共限购天数
				this.cardName = data.name; // 会员卡名称
				this.goingPrice = data.price; // 现价
				this.originalCost = data.ot_price; // 原价 划线价
				this.autoDay = data.activation; // 自动激活 天数
				this.synopsis = data.info; // 简介
				this.cardKind = data.type_tag; // 产品种类
				// 产品介绍图片
				this.introduceImg = data.product_image && [
					{ url: data.product_image }
				];
				this.introduceTxt = data.content; //  介绍文本
				this.remark = data.remark;
			});
		},
		// 删除自定义折扣信息
		delCustom(index) {
			this.customArr.splice(index, 1);
		},
		// 增加自定义卡折扣信息
		addCustom() {
			let obj = {};
			for (var key in this.customObj) {
				if (!this.customObj[key]) {
					uni.showToast({
						title: '请输入完整内容后添加！',
						icon: 'none'
					});
					return;
				} else {
					obj[key] = this.customObj[key];
				}
			}
			this.customArr.push(obj);
			for (var key in this.customObj) {
				this.customObj[key] = '';
			}
		},
		// 点击确定
		confirmFun() {
			if (this.jumpType == 'edit') {
				this.editProductFun();
			} else {
				this.submitConfirm();
			}
		},
		/* 过滤筛选条件 */
		filterVal() {
			if (this.cardTypeTxt == '私教课') {
				if (!this.population) {
					uni.showToast({
						title: '请输入约课人数',
						icon: 'none',
						duration: 3500
					});
					return true;
				}
			}
			if (
				this.cardTypeId != 'autonomous_class' &&
				!this.course_fee
			) {
				uni.showToast({
					title: '请输入课时费！',
					icon: 'none'
				});
				return true;
			}
			if (
				!this.productTypeId ||
				!this.cardTypeId ||
				this.quotaTimes == undefined ||
				this.quotaTimes == null ||
				this.quotaTimes == '' ||
				!this.quotaDays ||
				!this.coverImg.length ||
				!this.cardName ||
				!this.goingPrice ||
				!this.originalCost ||
				!this.synopsis ||
				this.autoDay === undefined ||
				this.autoDay === null ||
				this.autoDay === '' ||
				!this.cardKind
			) {
				
				uni.showToast({
					title: '请输入完整或选择完整内容！',
					icon: 'none'
				});
				return true;
			}
			if (this.productTypeId == 'fixed_card') {
				if (!this.courseTimes || !this.courseDays) {
					uni.showToast({
						title: '请输入约课次数和有效天数！',
						icon: 'none'
					});
					return true;
				}
			}
		},
		/* 获取输入数据 */
		getOBJ() {
			return {
				id: this.productId || '',
				card_type: this.cardTypeId, // 卡的类别id

				product_type: this.productTypeId, //产品类别id
				number: this.population, // 约课人数
				times:
					this.productTypeId == 'fixed_card'
						? this.courseTimes
						: '', // 约课次数
				times_show: this.courseTimesShow, // 是否显示约课次数
				days:
					this.productTypeId == 'fixed_card'
						? this.courseDays
						: '', // 有效天数
				single_quota: this.quotaTimes, // 限购次数
				total_quota: this.quotaDays, // 总共限购天数
				image: this.coverImg[0].url, // 封面图片
				name: this.cardName, // 会员卡名称
				price: this.goingPrice, // 现价
				ot_price: this.originalCost, // 原价 划线价
				activation: this.autoDay, // 自动激活 天数

				info: this.synopsis, // 简介
				product_image: this.introduceImg.length ? this.introduceImg[0].url : '', // 介绍 图片
				content: this.introduceTxt, // 介绍文本
				discount_json:
					this.productTypeId == 'custom_card'
						? JSON.stringify(this.customArr)
						: '', // 折扣
				course_fee: this.course_fee, // 课时费
				instructions: this.notice ,//购买须知
				type_tag: this.cardKind, // 产品种类
				remark: this.remark,
			};
		},
		// 提交
		submitConfirm() {
			if (this.filterVal()) {
				return;
			}
			addCardFixedAndCustom(this.getOBJ()).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			});
		},
		// 选中产品类别
		selectProductType(eve) {
			this.productTypeTxt = eve.name;
			this.productTypeId = eve.field;
			if(this.productTypeId == 'custom_card') {
				this.cardKind = "aperiodic_card"
			}else {
				this.cardKind = ""
			}
		},
		// 选中卡的类别
		selectCardType(eve) {
			this.cardTypeTxt = eve.name;
			this.cardTypeId = eve.field;
			/* 清空课时费 */
			this.course_fee = '';
		},

		// 获取会员卡所需数据
		getCardSelectInfoFun() {
			getCardSelectInfo().then(res => {
				this.productTypeList = res.data.product_type;
				if (this.jumpType == 'add') {
					this.productTypeTxt = this.productTypeList[0].name;
					this.productTypeId = this.productTypeList[0].field;
				}
				this.cardTypeList = res.data.card_type;
			});
		},
		// 新增会员卡
		addCard() {},
		// 删除 产品介绍图片
		deleteIntroduce(eve) {
			this.introduceImg.splice(eve.index, 1);
		},
		// 新增 产品介绍图片
		async afterReadIntroduce(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'introduce');
			});
		},

		// 删除 封面图片
		deleteCover(eve) {
			this.coverImg.splice(eve.index, 1);
		},
		// 新增 封面图片
		async afterReadCover(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'cover');
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
					type: 'card'
				},
				success: res => {
					let data = JSON.parse(res.data);
					if (data.code == 200) {
						if (type == 'cover') {
							this.coverImg.push({
								url: data.data
							});
						} else if (type == 'introduce') {
							this.introduceImg.push({
								url: data.data
							});
						}
					} else {
						uni.showToast({
							title: data.msg,
							icon: 'none'
						});
					}
				},
				fail: err => {}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	/deep/ .u-radio {
		margin-left: 20rpx;
	}
	.tip-txt {
		font-size: 20rpx;
		color: #999;
	}
.ipt-w {
	width: 250rpx;
}
/deep/ .u-textarea__field {
	min-height: 288rpx;
}
/deep/ .u-textarea {
	min-height: 288rpx;
}
.page {
	padding-left: 26rpx;

	.btn {
		color: #ffffff;
		font-size: 32rpx;
		height: 74rpx;
		background: #fe5e10;
		border-radius: 70rpx;
	}

	.add {
		height: 70rpx;
		color: #fe5e10;
		font-size: 32rpx;
		border-radius: 8rpx;
		opacity: 1;
		border: 2rpx solid #fe5e10;
		margin: 0 26rpx 28rpx;
	}

	.msg-box {
		height: 58rpx;
		// margin: 0 20rpx 0;
		margin: 0 20rpx 20rpx;
		font-size: 26rpx;
		border-radius: 10rpx;
		opacity: 1;
		border: 2rpx solid #999999;
		color: #999999;
		padding: 5rpx 32rpx;
		.icon-box {
			margin-left: auto;
		}
	}

	.page-li {
		padding: 36rpx 26rpx 32rpx 0;
		border-bottom: #e7e7e7 1rpx solid;
		font-size: 28rpx;
		font-weight: 400;
		color: rgba(32, 32, 32, 0.9);
	}
	.textarea-box {
		min-height: 200rpx;
	}
	.introduce {
		margin-bottom: 60rpx;
		border-radius: 20rpx;
		border: 2rpx solid #dadada;
	}

	.up-icon {
		width: 180rpx;
		height: 180rpx;
		background-color: #f5f5f5;
		border: #e7e7e7 1rpx dashed;
	}

	.title {
		padding-top: 26rpx;
		font-size: 32rpx;
		font-weight: 550;
		color: rgba(32, 32, 32, 0.9);
	}

	.bg {
		border-radius: 24rpx;
		background: #f9f9f9;

		.page-li {
			border: none;
			margin-left: 28rpx;
		}
	}

	.right {
		padding-right: 70rpx;
		background: url(https://jp.csxclxs.cn/20220707/manager/arrow-right.png)
			no-repeat;
		background-position: 97% center;
		background-size: 24rpx 24rpx;
	}
}
</style>
