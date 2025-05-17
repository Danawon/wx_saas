<template>
	<view >
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="课程内容大纲"
		></head-nav>
		<view class="padlr20 adTtemplateBox">
			<view  class="add-btn padlr20 flex mar-b20" @click="showPricker">
				选择课程模板
			</view>
		</view>
		
		<u-tabs
			:list="tabsArr"
			lineColor="#FE5E10"
			:activeStyle="{
				color: '#FE5E10',
				fontWeight: 'bold',
				transform: 'scale(1.05)'
			}"
			:inactiveStyle="{
				color: '#606266',
				transform: 'scale(1)'
			}"
			lineWidth="55rpx"
			lineHeight="4rpx"
			:current="tabsCurrent"
			@change="tabsChange"
			:scrollable="false"
		></u-tabs>
		<!-- 合成内容组件 -->
		<child-nodes ref="childNodesRef"></child-nodes>
		<view class="btn-box">
				<view class="bottom-btn flex" @click="submitFun">保存</view>
		</view> 
		<u-picker
			title="选择模板"
			:show="templateShow" 
			:columns="templateList" 
			@confirm="selectTemplate"
			@close="templateShow = false"
			@cancel="templateShow = false"
			keyName="name"
			:closeOnClickOverlay="true"
			@change="changeHandler"
			 ref="uPicker"
		></u-picker>
	</view>
</template>

<script>
import { courseOutlineList, getTemplateList, templateClassify } from '@/api/admin.js';
import { childNodes } from "./components/childNodes.vue"
export default {
	 components: {
		 childNodes
	 },
	data() {
		return {
			nodeId: '' ,// 子节点id
			tabsArr: [], // tabs
			tabsCurrent: 0, // tabs 下标
			templateShow: false, // 模板show
			templateList: [], // 模板列表
			templateId: "", // 模板id
			templateClassifyId: '',
			templateClassifyList: [],
		};
	},
	async onLoad(e) {
		this.nodeId = e.id;
		this.getCourseOutlineList();
	},
	onShow() {
		uni.$off("selectVideo");
		// 监听选中视频
		uni.$on("selectVideo", data => {
			this.$refs.childNodesRef.onVideoUrl(data)
		})
	},
	methods: {
		changeHandler(e) {
			const {
				columnIndex,
				value,
			} = e
			this.templateClassifyId = value[0].id;
			// 当第一列值发生变化时，变化第二列(后一列)对应的选项
			if (columnIndex === 0) {
				this.getTemplateListFun()
			}
		},
		/* 显示模板列表 */
		async showPricker() {
			this.templateShow = true;
			if(!this.templateClassifyId) {
				await this.getTemplateClassify();
				await this.getTemplateListFun();
			}
			
		},
		/* 获取模板分类 */
		getTemplateClassify() {
			return templateClassify().then(res => {
				this.templateClassifyId = res.data[0].id
				this.templateClassifyList = res.data
			})
		},
		/* 获取模板列表 */
		getTemplateListFun() {
			return getTemplateList({
				cid: this.templateClassifyId
			}).then(res => {
				this.templateList = [this.templateClassifyList, res.data]
			})
		},
		/* 选中课程模板 */
		selectTemplate(e)  {
			this.templateId = e.value[1].id;
			this.templateShow = false;
			this.getCourseOutlineList();
			
		},
		/* 提交 */
		submitFun() {
			this.$refs.childNodesRef.submitFun();
		},
		/* tabs改变 */
		tabsChange(e) {
			this.tabsCurrent = e.index
			this.$refs.childNodesRef.initFun({
				nodeId: this.nodeId,
				index: this.tabsCurrent,
				status: false,
			})
		},
		// 获取大纲
		getCourseOutlineList() {
			courseOutlineList({
				id: this.nodeId,
				template_id: this.templateId
			}).then(res => {
				this.tabsArr= res.data;
				this.$refs.childNodesRef.initFun({
					nodeId: this.nodeId,
					data: this.tabsArr,
					index: this.tabsCurrent,
					status: true,
				})
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	/deep/ picker-view{
		.u-picker__view__column {
			&:first-child {
				flex: 1 !important;
			}
			&:last-child {
				flex: 5 !important;
			}
		}
	}
	.adTtemplateBox{
		display: flex;
		justify-content: flex-end;
		.add-btn {
			height: 50rpx;
			background: #3c9cff;
			border-radius: 4rpx;
			color: #fff;
			font-size: 22rpx;
		}
	}

.btn-box {
	position: fixed;
	bottom: 0rpx;
	left: 0%;
	width: 100%;
	background-color: #fff;
	padding: 10rpx 20rpx 50rpx;
	z-index: 999;
	.bottom-btn {
		width: 100%;
		height: 74rpx;
		color: #fe5e10;
		border-radius: 48rpx;
		border: 1rpx solid #fe5e10;
		font-size: 32rpx;
	}
}
</style>
