<template>
	<view>
		<view class="list padlr20 pad-t20 pad-b40">
			<view class="li  flex-a ju-bt">
				<view class="tit">食物种类:</view>
				<view class="ipt flex-row flex-a ju-ar">
					<view class="ipt-l ">
						<u-input
							border="none"
							inputAlign="right"
							type="number"
							class="ipt"
							v-model="param[taskIndex].food_type"
							:suffixIconStyle="{
								'font-size': '26rpx'
							}"
							suffixIcon="种"
						/>
					</view>
					<view class="line"></view>
					<view
						class="ipt-r flex-a"
						@click="onDescribeFun(0,'food_type_description')"
					>
						{{
							param[taskIndex].food_type_description || '请选择描述'
						}}
					</view>
				</view>
			</view>
			<view class="li  flex-a ju-bt">
				<view class="tit">蔬菜水果:</view>
				<view class="ipt flex-row flex-a ju-bt">
					<view class="ipt-l ">
						<u-input
							border="none"
							inputAlign="right"
							type="number"
							v-model="param[taskIndex].vegetable"
							:suffixIconStyle="{
								'font-size': '26rpx'
							}"
							suffixIcon="克"
						/>
					</view>
					<view class="line"></view>
					<view
						class="ipt-r flex-a"
						@click="onDescribeFun(1,'vegetable_description')"
					>
						{{
							param[taskIndex].vegetable_description || '请选择描述'
						}}
					</view>
				</view>
			</view>
			<view class="li  flex-a ju-bt">
				<view class="tit">粗粮:</view>
				<view class="ipt flex-row flex-a ju-bt">
					<view class="ipt-l ">
						<u-input
							border="none"
							inputAlign="right"
							type="number"
							v-model="param[taskIndex].coarse_grain"
							:suffixIconStyle="{
								'font-size': '26rpx'
							}"
							suffixIcon="克"
						/>
					</view>
					<view class="line"></view>
					<view
						class="ipt-r flex-a"
						@click="onDescribeFun(2,'coarse_grain_description')"
					>
						{{
							param[taskIndex].coarse_grain_description || '请选择描述'
						}}
					</view>
				</view>
			</view>
			<view class="li  flex-a ju-bt">
				<view class="tit">油脂:</view>
				<view class="ipt flex-row flex-a ju-bt">
					<view class="ipt-l ">
						<u-input
							border="none"
							inputAlign="right"
							type="number"
							v-model="param[taskIndex].grease"
							:suffixIconStyle="{
								'font-size': '26rpx'
							}"
							suffixIcon="克"
						/>
					</view>
					<view class="line"></view>
					<view
						class="ipt-r flex-a"
						@click="onDescribeFun(3,'grease_description')"
					>
						{{
							param[taskIndex].grease_description || '请选择描述'
						}}
					</view>
				</view>
			</view>
			<view class="li  flex-a ju-bt">
				<view class="tit">盐:</view>
				<view class="ipt flex-row flex-a ju-bt">
					<view class="ipt-l ">
						<u-input
							border="none"
							inputAlign="right"
							type="number"
							v-model="param[taskIndex].salt"
							:suffixIconStyle="{
								'font-size': '26rpx'
							}"
							suffixIcon="克"
						/>
					</view>
					<view class="line"></view>
					<view
						class="ipt-r flex-a"
						@click="onDescribeFun(4,'salt_description')"
					>
						{{
							param[taskIndex].salt_description || '请选择描述'
						}}
					</view>
				</view>
			</view>
			<view class="li  flex-a ju-bt">
				<view class="tit tit-exception">热量:</view>
				<view
					class="ipt ipt-exception flex-row flex-a ju-bt"
				>
					<view class="ipt-l ">
						<u-input
							border="none"
							inputAlign="right"
							type="number"
							v-model="param[taskIndex].calorie"
							:suffixIconStyle="{
								'font-size': '26rpx'
							}"
							suffixIcon="千卡"
						/>
					</view>
					<view class="line"></view>
					<view
						class="ipt-r flex-a"
						@click="onDescribeFun(5,'calorie_description')"
					>
						{{
							param[taskIndex].calorie_description || '请选择描述'
						}}
					</view>
				</view>
			</view>
			<view class="li  flex-a ju-bt">
				<view class="tit">其他:</view>
				<view class="ipt flex-row flex-a ju-bt">
					<view class="ipt-l ">
						<u-input
							border="none"
							inputAlign="right"
							type="number"
							v-model="param[taskIndex].other"
							:suffixIconStyle="{
								'font-size': '26rpx'
							}"
							suffixIcon="克"
						/>
					</view>
					<view class="line"></view>
					<view
						class="ipt-r flex-a"
						@click="onDescribeFun(6,'other_description')"
					>
						{{
							param[taskIndex].other_description || '请选择描述'
						}}
					</view>
				</view>
			</view>
			<view class="psd-li mar-b20 flex-a ju-bt mar-t40">
				<text>饮食模板：</text>
				<view class="ipt" @click="templateShow = true">
					<u--input
						placeholder="请选择饮食模板"
						border="none"
						v-model="param[taskIndex].templateTxt"
						:customStyle="{ height: '88rpx' }"
						disabled
					></u--input>
				</view>
			</view>
			<view class="parse-box" v-if="param[taskIndex].templateRichTextVal">
				<u-parse
					:content="param[taskIndex].templateRichTextVal"
				></u-parse>
			</view>
			
		</view>
		<!-- 选择描述 -->
		<u-action-sheet
			:actions="describeArr"
			title="请选择描述"
			:show="describeShow"
			cancelText="关闭"
			@close="describeShow = false"
			@select="selectDescribe"
		></u-action-sheet>
		<!-- 选择训练模板 -->
		<u-action-sheet
			:actions="templateList"
			:safeAreaInsetBottom="true"
			:closeOnClickAction="true"
			:closeOnClickOverlay="true"
			cancelText="取消"
			title="选择训练模板"
			@close="templateShow = false"
			@select="selectTemplate"
			:show="templateShow"
			round="20rpx"
		></u-action-sheet>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { release_tasK, taskInfo, describeList } from '@/api/dietician.js';
import { trainingTemplateList, templateRichText } from '@/api/admin.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			task_id: '', //任务id
			param: [
				{
					meal_time: "", // 餐时
					food_type: null, //食物类型
					vegetable: null, // 蔬果
					coarse_grain: null, //粗粮
					grease: null, //油脂
					salt: null, //盐
					other: null, //	其他
					calorie: null ,//热量

					/* 选中模板标题 */
					templateTxt: "",
					/* 模板富文本 */
					templateRichTextVal: "",
				},
				{
					meal_time: "", // 餐时
					food_type: null, //食物类型
					vegetable: null, // 蔬果
					coarse_grain: null, //粗粮
					grease: null, //油脂
					salt: null, //盐
					other: null, //	其他
					calorie: null ,//热量

					/* 选中模板标题 */
					templateTxt: "",
					/* 模板富文本 */
					templateRichTextVal: "",
				},
				{
					meal_time: "", // 餐时
					food_type: null, //食物类型
					vegetable: null, // 蔬果
					coarse_grain: null, //粗粮
					grease: null, //油脂
					salt: null, //盐
					other: null, //	其他
					calorie: null ,//热量

					/* 选中模板标题 */
					templateTxt: "",
					/* 模板富文本 */
					templateRichTextVal: "",
				},
				{
					meal_time: "", // 餐时
					food_type: null, //食物类型
					vegetable: null, // 蔬果
					coarse_grain: null, //粗粮
					grease: null, //油脂
					salt: null, //盐
					other: null, //	其他
					calorie: null ,//热量

					/* 选中模板标题 */
					templateTxt: "",
					/* 模板富文本 */
					templateRichTextVal: "",
				}
			],
			
			/* 选中的描述下标 */
			describeIndex: 0,
			/* 描述选择列表 */
			describeArr: [],
			describeShow: false,
			/* 训练模板列表 */
			templateList: [],
			/* 选中模板id */
			templateId: "",
			
			templateShow: false,
		
			/* 选中的任务下标 */
			taskIndex: 0,
			/* 选中描述类型 */
			describeType: "",
		};
	},
	onReady() {
		/* 获取训练模板列表 */
		this.getTrainingTemplateList();
	},
	methods: {
		/* 初始化组件 */
		initFun(e) {
			/* 当前选中的任务 */
			this.taskIndex = e.taskIndex;
			/* 任务id */
			this.task_id = e.task_id;
			/* 判断是否提交过 */
			if (e.state) {
				this.init(e.tabsArr);
			}
		},
		/* 获取描述列表 */
		getDescribeList(selectType) {
			describeList({
				type: selectType
			}).then(res => {
				if(res.data.length) {
					this.describeShow = true;
				}else {
					uni.showToast({
						title: "暂无描述",
						icon: "error"
					})
				}
				/* 描述列表 */
				this.describeArr = res.data;
			})
		},
		/* 获取模板对应富文本 */
		getTemplateRichText() {
			templateRichText({
				id: this.templateId,
				meal_time: this.param[this.taskIndex].meal_time,
				task_id: this.task_id
			}).then(res => {
				this.param[this.taskIndex].templateRichTextVal = res.data.template.content;
				this.param[this.taskIndex].food_type = res.data.data.food_type; 	// food_type: null, //食物类型
				this.param[this.taskIndex].vegetable = res.data.data.vegetable; // vegetable: null, // 蔬果
				this.param[this.taskIndex].coarse_grain = res.data.data.coarse_grain;// coarse_grain: null, //粗粮
				this.param[this.taskIndex].grease = res.data.data.grease;  /// grease: null, //油脂
				this.param[this.taskIndex].salt = res.data.data.salt; // salt: null, //盐
				this.param[this.taskIndex].other = res.data.data.other; // other: null, //	其他
				this.param[this.taskIndex].calorie = res.data.data.calorie; // calorie: null //热量
			})
		},
		/* 选中模板 */
		selectTemplate(e) {
			this.templateId = e.id;
			this.param[this.taskIndex].templateTxt = e.name;
		
			this.getTemplateRichText();
		},
		/* 获取训练模板列表 */
		getTrainingTemplateList() {
			trainingTemplateList({
				punch_type: 'nutrition_punch'
			}).then(res => {
				this.templateList = res.data;
			})
		},
		/* 选中描述文本 */
		onDescribeFun(index, type) {
			/* 选中描述下标 */
			this.describeIndex = index;
			/* 选中的描述类型 */
			this.describeType = type;
			/* 选中类型 */
			let selectType = "";
			switch(index)
			{
			    case 0:
			        selectType = 'food_type'
			        break;
			    case 1:
			        selectType = 'vegetable'
			        break;
				case 2:
			        selectType = 'coarse_grain'
			        break;
			    case 3:
			        selectType = 'grease'
			        break;
				case 4:
			        selectType = 'salt'
			        break;
			    case 5:
			        selectType = 'calorie'
			        break;
				case 6:
			        selectType = 'other'
			        break;
			}
			/* 获取描述列表 */
			this.getDescribeList(selectType);
		},
		/* 选中描述列表 */
		selectDescribe(e) {
			this.param[this.taskIndex][this.describeType] = e.name
		},
		//保存
		sub() {
			//发布餐饮
			release_tasK({
				data: this.param,
				task_id: this.task_id
			}).then(res => {
				uni.showToast({
					title: res.msg,
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 2000);
			});

		},
		//初始化
		init(data) {
			data.forEach((item, index) => {
				this.param[index].meal_time = item.field
				this.param[index].food_type = item.food_type; 	// food_type: null, //食物类型
				this.param[index].vegetable = item.vegetable; // vegetable: null, // 蔬果
				this.param[index].coarse_grain = item.coarse_grain;// coarse_grain: null, //粗粮
				this.param[index].grease = item.grease;  /// grease: null, //油脂
				this.param[index].salt = item.salt; // salt: null, //盐
				this.param[index].other = item.other; // other: null, //	其他

				this.param[index].calorie = item.calorie; // calorie: null //热量
				/* 富文本 */
				this.param[index].templateRichTextVal = item.instructions;
				/* 以下描述数据赋值 */
				/* 食物种类 */
				this.param[index].food_type_description = item.food_type_description;
				/* 蔬菜水果 */
				this.param[index].vegetable_description = item.vegetable_description;
				/* 粗粮 */
				this.param[index].coarse_grain_description = item.coarse_grain_description;
				/* 油脂 */
				this.param[index].grease_description = item.grease_description;
				/* 盐 */
				this.param[index].salt_description = item.salt_description;
				/* 热量 */
				this.param[index].calorie_description = item.calorie_description;
				/* 其他 */
				this.param[index].other_description = item.other_description;
			})
		}
	}
};
</script>

<style lang="scss" scoped>
/deep/ video {
	width: 100% !important;
}
.parse-box {
	width: 100%;
}
.psd-li {
	font-size: 28rpx;
	.ipt {
		width: 502rpx;
		height: 88rpx;
		background: #f5f5f5;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
	}
}

.list {
	.line {
		height: 60%;
		width: 1px;
		background-color: #dadbde;
	}
	.li:nth-child(odd) {
		background-color: #f5f5f5;
		border-radius: 20rpx;
	}
	.li {
		padding: 10rpx 20rpx;
		font-size: 28rpx;
		.tit-exception {
			width: 15% !important;
		}
		.ipt-exception {
			width: 85% !important;
			.ipt-l {
				width: 24% !important;
			}
			.ipt-r {
				width: 67% !important;
			}
		}
		.tit {
			width: 20%;
		}
		.ipt {
			.ipt-l {
				width: 18%;
			}
			.ipt-r {
				width: 70%;
				color: #999;
				height: 100%;
			}
			width: 80%;
			height: 88rpx;
			border-radius: 20rpx;
			box-sizing: border-box;
		}
	}

	.txt {
		margin: 20rpx 0 88rpx;
		height: 288rpx;
		background: #f5f5f5;
		border-radius: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
		width: 100%;
	}

	
}
</style>
