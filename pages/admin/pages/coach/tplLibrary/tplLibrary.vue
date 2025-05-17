<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="课程内容模板列表"></head-nav>
		<view class="page">
			 <view class="page-li flex-a ju-bt" v-for="(item,index) in list" :key="index">
				 <view class="">
				 	<u-radio-group shape="circle"  activeColor="#FE5E10" v-model="templateId" placement="column" >
				 		<u-radio :label="item.title" :name="item.id"></u-radio>
				 	</u-radio-group>
				 </view>
				 <view class="icon-box">
				 	<u-icon name="arrow-right" size="40rpx" color="#999999"></u-icon>
				 </view>
			 
			 </view>
			</view>
			<view class="bottom-btn flex" @click="trainingPlanEdit">确认</view>
			<u-empty
				v-if="!list.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
			
		</view>
		
		
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { courseInfoTemplate,  setOrderTraining } from "@/api/admin.js"
export default {
	data() {
		return {
			templateId: "",
			list: [],
			planId: "", // 计划id 
		};
	},
	onLoad(e) {
		this.planId = e.id;
		this.getCourseInfoTemplate();
	},
	methods:{
		// 获取课程内容模板
		getCourseInfoTemplate() {
			courseInfoTemplate({
				id: this.planId
			}).then(res => {
				this.list = res.data
			})
		},
		/* 选中计划 设置给用户 */
		trainingPlanEdit(){
			setOrderTraining({
				oldid: this.planId,
				id: this.templateId,
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
};
</script>

<style lang="scss">
 .bottom-btn {
 	position: fixed;
 	bottom: 30rpx;
 	left: 50%;
 	width: 90%;
 	transform: translateX(-50%);
 	height: 74rpx;
 	background: #fe5e10;
 	border-radius: 48rpx;
 	color: #fff;
 	font-size: 32rpx;
 }
.page {
	padding: 26rpx 54rpx 200rpx  24rpx;
	
	.page-li {
		padding: 22rpx 0;
		margin-top: 20rpx; 
border-bottom:1rpx solid #E7E7E7;
	}
}
</style>
