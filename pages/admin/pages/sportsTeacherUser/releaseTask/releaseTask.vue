<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="发布任务"></head-nav>
		<view class="list">
			<view class="li mar-b20 flex-a ju-bt" >
				<text>运动形式：</text>
				<view class="ipt" @click="modalityShow = true">
					<u--input
						placeholder="请输入运动形式"
						border="none"
						v-model="form.modality"
						:customStyle="{height: '88rpx'}"
						disabled
					></u--input>
					
				</view>
			</view>
			<view class="li mar-b20 flex-a ju-bt" >
				<text></text>
				<view class="ipt modality-tips" >
					{{ exerciseDescription }}
				</view>
			</view>
			<view class="li mar-b20 flex-a ju-bt">
				<text>训练时间：</text>
				<view class="ipt" @click="timeShow = true">
					<u--input
						placeholder="请输入训练分钟"
						suffixIcon="分钟"
						border="none"
						v-model="form.time"
						:customStyle="{height: '88rpx'}"
						:suffixIconStyle="{'font-size': '25rpx'}"
						disabled
					></u--input>
				</view>
			</view>
			<view class="li mar-b20 flex-a ju-bt" >
				<text>训练强度：</text>
				<view class="ipt" @click="strengthShow = true">
					<u--input
						placeholder="请选择训练强度"
						border="none"
						v-model="form.strength"
						:customStyle="{height: '88rpx'}"
						disabled
					></u--input>
				</view>
			</view>
		
			<view class="li mar-b20 flex-a ju-bt">
				<text>消耗热量：</text>
				<view class="ipt" @click="caloriesShow = true">
					<u--input
						placeholder="请输入消耗热量"
						border="none"
						suffixIcon="千卡"
						v-model="form.calories"
						:customStyle="{height: '88rpx'}"
						:suffixIconStyle="{'font-size': '25rpx'}"
						disabled
					></u--input>
				</view>
			</view>
			<view class="li mar-b20 flex-a ju-bt" >
				<text>训练模板：</text>
				<view class="ipt" @click="templateShow = true">
					<u--input
						placeholder="请选择训练内容模板"
						border="none"
						v-model="templateTxt"
						:customStyle="{height: '88rpx'}"
						disabled
					></u--input>
				</view>
			</view>
			<view class="parse-box" v-if="templateRichTextVal">
				<u-parse :content="templateRichTextVal"></u-parse>
			</view>
			
			<view class="btn flex mar-t40" @click="confirmFun">保存</view>
		</view>
		
		<!-- 选择强度 -->
		<u-action-sheet
			:actions="strengthList"
			:safeAreaInsetBottom="true"
			:closeOnClickAction="true"
			:closeOnClickOverlay="true"
			cancelText="取消"
			title="选择强度"
			@close="strengthShow = false"
			@select="selectStrength"
			:show="strengthShow"
			round="20rpx"
		></u-action-sheet>	
		<!-- 选择训练模板 -->
	<!-- 	<u-action-sheet
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
		></u-action-sheet> -->
		<u-picker
			title="选择训练模板"
			:show="templateShow" 
			:columns="[templateList]" 
			@confirm="selectTemplate"
			@close="templateShow = false"
			@cancel="templateShow = false"
			keyName="name"
			:closeOnClickOverlay="true"
		></u-picker>
		<!-- 选择训练形式 -->
		 <u-picker 
			title="运动形式"
			:show="modalityShow" 
			:columns="modalityColumns" 
			@confirm="selectmodality"
			@close="modalityShow = false"
			@cancel="modalityShow = false"
			keyName="name"
		></u-picker>
		<!-- 选择训练时间 -->
		<u-action-sheet
			:actions="timeList"
			:safeAreaInsetBottom="true"
			:closeOnClickAction="true"
			:closeOnClickOverlay="true"
			cancelText="取消"
			title="选择训练时间"
			@close="timeShow = false"
			@select="selectTime"
			:show="timeShow"
			round="20rpx"
		></u-action-sheet>
		<!-- 选择热量 -->
		<u-action-sheet
			:actions="caloriesList"
			:safeAreaInsetBottom="true"
			:closeOnClickAction="true"
			:closeOnClickOverlay="true"
			cancelText="取消"
			title="选择消耗热量(大卡)"
			@close="caloriesShow = false"
			@select="selectCalories"
			:show="caloriesShow"
			round="20rpx"
		></u-action-sheet>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { addTask, releaseTask, planDetail, getModalityAction } from "@/api/sportsTeacher.js"
import { getStrength, trainingTemplateList, templateRichText } from '@/api/admin.js'; 
export default {
	data() {
		return {
			baseUrl: baseUrl,
			orderId: "", 
			uId: "",
			form: {
				time: "30", //  训练时间
				strength: "低强度", //  训练强度
				modality: "", //  运动形式
				calories: "300", //  消耗热量
				modalityField: "", // 运动形式
			},
			// 运动强度列表
			strengthList: [],
			strengthShow: false,
			// 选中	强度id
			strengthId: "low", 
			/* 训练模板列表 */
			templateList: [],
			/* 选中模板id */
			templateId: "",
			/* 选中模板标题 */
			templateTxt: "",
			/* 模板show */
			templateShow: false,
			/* 模板富文本 */
			templateRichTextVal: "",
			/* 运动形式 */
			modalityColumns: [],
			/* 形式show */
			modalityShow: false,
			/* 训练时间 show */
			timeShow: false,
			/* 训练时间 列表*/
			timeList: [
				{
					name: "10"
				},
				{
					name: "15"
				},
				{
					name: "20"
				},
				{
					name: "30"
				},
				{
					name: "45"
				},
				{
					name: "60"
				},
			],
			/* 热量show */
			caloriesShow: false,
			/* 热量列表 */
			caloriesList: [
				{
					name: '100'
				},{
					name: '200'
				},{
					name: '300'
				},{
					name: '400'
				},{
					name: '500'
				},{
					name: '600'
				},{
					name: '800'
				},
			],
			/* 运动形式描述 */
			exerciseDescription: '',
			
		};
	}, 
	onLoad(e) {
		this.orderId = e.id;
		this.uId = e.uId;
		/* 获取任务强度 */
		this.getStrengthFun();
		/* 获取任务详情 */
		this.getPlanDetail();
		
		/* 获取运动形式 */
		this.getModalityActionFun();
	},
	watch: {
		'form.modalityField': {
		  	handler(newV, oldV) {
				/* 获取训练模板列表 */
				this.getTrainingTemplateList();
			},
			immediate: false,
			deep: true,
		}
	},
	methods: {
		/* 选中热量 */
		selectCalories(e) {
			this.form.calories = e.name;
		},
		/* 选中训练时间 */
		selectTime(e) {
			this.form.time = e.name;
		},
		/* 获取运动形式 */
		getModalityActionFun() {
			getModalityAction().then(res => {
				this.modalityColumns = [res.data];
				this.form.modalityField =res.data[0].field;
				this.form.modality = res.data[0].name;
				this.exerciseDescription = res.data[0].description
			})
		},
		/* 选中形式 */
		selectmodality(e) {
			this.form.modalityField =e.value[0].field;
			this.form.modality = e.value[0].name; // 运动形式
			this.exerciseDescription = e.value[0].description
			this.modalityShow = false;
		},
		/* 获取模板对应富文本 */
		getTemplateRichText() {
			templateRichText({
				id: this.templateId
			}).then(res => {
				this.templateRichTextVal = res.data.template.content; // 训练模板富文本
				this.form.modalityField =  res.data.data.training_form; // 运动形式 id
				this.form.modality =  res.data.data.training_form_text; // 运动形式文本
				this.exerciseDescription = res.data.data.training_form_description; // 运动形式描述 
				this.form.time =  res.data.data.training_time; // 运动时间
				this.strengthId = res.data.data.training_intensity; // 运动强度 id
				this.form.strength = res.data.data.training_intensity_text; // 运动强度 中文
				this.form.calories = res.data.data.calories; // 运动热量
			})
		},
		/* 选中模板 */
		selectTemplate(e) {
			this.templateId = e.value[0].id;
			this.templateTxt = e.value[0].name;
		
			this.templateShow = false;
			this.getTemplateRichText();
		},
		/* 获取训练模板列表 */
		getTrainingTemplateList() {
			trainingTemplateList({
				punch_type: 'aerobic_punch',
				class: this.form.modalityField,
				task_id: this.orderId 
			}).then(res => {
				this.templateList = res.data;
			})
		},
		// 获取课程强请
		getPlanDetail() {
			planDetail({
				task_id: this.orderId
			}).then(res => {
				if(!res.data.info.training_form) {
					return
				}
				this.form.time = res.data.info.training_time;
				this.strengthId = res.data.info.training_intensity;
				this.form.strength = res.data.info.motion_strength.name;
				this.form.calories = res.data.info.calories;
				this.templateRichTextVal = res.data.info.training_content;
				this.form.modalityField = res.data.info.training_form;
				this.form.modality = res.data.info.training_form_text;
				this.exerciseDescription = res.data.info.training_form_description
			})
		},
		/* 选中强度 */
		selectStrength(e) {
			this.strengthId = e.value;
			this.form.strength = e.name;
		},
		/* 获取运动强度 */
		getStrengthFun() {
			getStrength({
				id: this.nodeId
			}).then(res => {
				this.strengthList = res.data
			});
		},
		confirmFun() {
			let state = true;
			for(let key in this.form) {
				if(!this.form[key]) {
					state = false
				}
			}
			if(!state) {
				uni.showToast({
					title: "请输入完整内容后提交！",
					icon: "none"
				})
				return
			}
			// if(!this.templateRichTextVal) {
			// 	uni.showToast({
			// 		title: "请选择训练模板后提交！",
			// 		icon: "none"
			// 	})
			// 	return
			// }
			this.releaseTaskFun()
		},
		// 发布任务
		releaseTaskFun() {
			releaseTask({
				task_id: this.orderId,
				training_time: this.form.time,
				training_intensity: this.strengthId,
				training_form: this.form.modalityField,
				calories: this.form.calories,
				training_content: this.templateRichTextVal,
				title: this.templateTxt ? this.templateTxt.split(".")[1] : ''
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					uni.navigateBack()
				},1500)
			})
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

<style lang="scss" scoped>
	.modality-tips {
		font-size: 22rpx;
		color: #999;
		background-color: #fff !important;
		height: auto !important;
		line-height: 40rpx;
	}
	/deep/ video {
		width: 100% !important;
	}
	.parse-box {
		width: 100%;
	}
.list {
	padding: 30rpx;

	.li {
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

	.txt {
		margin: 20rpx 0 88rpx;
		height: 288rpx;
		background: #f5f5f5;
		border-radius: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
		width: 100%;
	}

	.btn {
		font-size: 32rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #ffffff;
		height: 74rpx;
		background: #fe5e10;
		border-radius: 60rpx;
	}
}
</style>
