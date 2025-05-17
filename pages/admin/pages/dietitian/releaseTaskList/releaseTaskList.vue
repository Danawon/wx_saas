<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="发布任务"></head-nav>
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
		<release-task ref="releaseTaskRef" ></release-task>
		<view class="padlr20 pad-b40 mar-t40 fot-btn">
			<view class="btn flex  " @click="submitFun">
				保存
			</view>
		</view>
		
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import {release_tast} from '@/api/dietician.js'
import releaseTask from "./components/releaseTask.vue"
export default {
	components: {
		releaseTask
	},
	data() {
		return {
			baseUrl: baseUrl,
			task_id:'',
			tabsArr: [],
			/* tabs index */
			tabsCurrent: 0,
		};
	},
	onLoad(op) {
		this.task_id = op.id
	},
	onShow() {
		this.init()
	},
	methods: {
		/* 保存 */
		submitFun() {
			this.$refs.releaseTaskRef.sub();
		},
		/* tabs改变 */
		tabsChange(e) {
			this.tabsCurrent = e.index
			this.initChild(false);
		},
		init(){
			release_tast(
				{
					task_id: this.task_id,
				}
			).then(res=>{
				this.tabsArr = res.data;
				this.initChild(true);
			})
		},
		/* 初始化组件内容 */
		initChild(e) {
			this.$refs.releaseTaskRef.initFun({
				task_id: this.task_id,
				taskIndex: this.tabsCurrent,
				tabsArr: this.tabsArr,
				state: e
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	.btn {
		font-size: 32rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #ffffff;
		height: 74rpx;
		background: #fe5e10;
		border-radius: 60rpx;
	}
.list {
	padding: 0 26rpx 26rpx;

	.list-li {
		font-size: 28rpx;
		padding: 40rpx 0 22rpx;
		border-bottom: 1rpx solid #ccc;
	}

	.icon-box {
		color: #999;
		font-size: 28rpx;
	}
}
</style>
