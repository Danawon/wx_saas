<template>
	<view>
		<head-nav bgColor="#fff" :goBack="true" titColor="#000" title="会员打卡数据"></head-nav>

		<view class=" flex-a pad20">
			<u-avatar :src="initObj.user.avatar" size="128rpx"></u-avatar>
			<view class="top-right">
				<view class="title">{{ initObj.user.nickname || ''}}</view>
				<view class="gray">账号ID：{{ initObj.user.uid || ''}}</view>
				<view class="gray">手机号：{{ initObj.user.mobile || '无'}}</view>
			</view>
		</view>
		<!-- 饮食感受 -->
		<view class="feel-box pad20">
			<view class="li-box mar-b40" v-for="(item, index) in nutritionObj" :key="index">
				<view class="feel-li  flex-row ju-bt flex-a">
					<view class="flex-row flex-a">
						<view class="li-tit">
							<text v-if="item.meal_time == 'breakfast'">早餐</text>
							<text v-if="item.meal_time == 'lunch'">午餐</text>
							<text v-if="item.meal_time == 'dinner'">晚餐</text>
							<text v-if="item.meal_time == 'extra_meal'">加餐</text>
							感受:</view>
						<view class="feel-imgbox flex-row flex-a  mar-l20">
							<view class="feel-txt ">{{ item.experience }}</view>
							<view class="feel-img mar-l20">
								<image
									:src="item.feelImg"
								></image>
							</view>
						</view>
					</view>
					<view class="result-box">
						 <u-radio-group
						    v-model="item.score"
						    placement="row"
						  >
						    <u-radio
						      label="达标"
						      name="standard"
						    >
						    </u-radio>
							<u-radio
							 :customStyle="{marginLeft: '16rpx'}"
							  label="未达标"
							  name="up_standard"
							>
							</u-radio>
						  </u-radio-group>
					</view>
				</view>
				<view class=" diet-img padlr20 pad-b20" v-if="item.clock_record">
					<image 
						:src="item.clock_record"
					></image>
				</view>
			</view>
		</view>
		<!-- 快捷语选择 -->
		<view class="shortcut-box mar-b20 flex" @click="showChildNode">
			<view>
				<u-button text="选择快捷语" icon="chat" type="success" ></u-button>
			</view>
		</view>
		<view class="fot-box padlr20 pad-t2 pad-b40">
			<view class="title mar-b20">营养师点评</view>
			<textarea
				v-model="assessVal"
				placeholder="多行输入"
				class="txt pad20"
			/>
			<view class="btn flex mar-t40" @click="submitFun">提交</view>
		</view>
		
		<shortcut-modal ref="shortcutModalRef" @selectedShortcut="selectedShortcut"></shortcut-modal>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getDetail, feedbackSubmit } from '@/api/dietician.js';
/* 快捷语弹框 */
import shortcutModal from "@/components/shortcutModal/shortcutModal.vue"
export default {
	components: {
		shortcutModal
	},
	data() {
		return {
			baseUrl: baseUrl,
			// 感受icons
			feelImgs: [
				{
					img: `${baseUrl}strenuous-selected.png`,
					txt: '有点撑'
				},
				{
					img: `${baseUrl}challenging-selected.png`,
					txt: '口味重'
				},
				{
					img: `${baseUrl}just-selected.png`,
					txt: '七分饱'
				},
				{
					img: `${baseUrl}easy-selected.png`,
					txt: '清淡'
				}
			],
			task_id:"", //任务ID 
			initObj:{},
			// 用户营养营养数据
			nutritionObj: [],
			//评估报告
			assessVal: '', 
		};
	},
	onLoad(op) {
		this.task_id = op.id
	},
	onShow() {
		this.init()
	},
	methods: {
		/* 调用快捷语组件组件  */
		showChildNode() {
			let state = true
			this.nutritionObj.filter(item => {
				if(item.score == 'up_standard' || item.score == 'no_score') {
					state = false;
				}
			})
			this.$refs.shortcutModalRef.toggleShow({
				radiovalue: state ? 'standard' : 'up_standard',
				type: 'nutrition_punch'
			})
		},
		/* 选中快捷语句 */
		selectedShortcut(item) {
			let str = ''
			if(this.assessVal) {
				str = this.assessVal + ',' + item
			}else {
				str = item
			}
			this.assessVal = str
		},
		//获取餐食数据
		init(){
			this.nutritionObj = [];
			getDetail(
				{
					task_id: this.task_id,
				}
			).then(res=>{
				this.initObj = res.data;
				this.assessVal = res.data.analysis;
				for( let k in res.data.info) {
					/* 设置 选中感受*/
					res.data.info[k].score = res.data.info[k].score
					/* 设置餐时字段 */
					res.data.info[k].meal_time = k;
					this.nutritionObj.push(res.data.info[k])
					this.feelImgs.forEach((item, index) => {
						if(res.data.info[k].experience == item.txt) {
							res.data.info[k].feelImg = item.img
						}
					})
				}
			})
		},
		// 提交 发布餐食评价
		submitFun() {
			let _this = this;
			feedbackSubmit({
				task_id: this.task_id,
				assess: this.assessVal,
				assess_data: this.nutritionObj
			}).then(res => {				
				if(!res.data.next_id) {
					uni.showToast({
						title: res.msg
					});
					setTimeout(() => {
						_this.init();
					}, 1500);
				}else {
					uni.showModal({
						title: "发布任务提示",
						content: "是否去发布下一个任务",
						confirmText: "去发布",
						cancelText: "点评完成",
						success(e) {
							if(e.confirm) {
								uni.redirectTo({
									url: '/pages/admin/pages/dietitian/releaseTaskList/releaseTaskList?id='+res.data.next_id
								})
							}else {
								
								uni.navigateBack()
								
							}
						}
					})
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	/deep/ .u-button__text{
		margin-left: 10rpx;
	}
	.fot-box {
		.title {
			color: #202020;
		}
		.txt {
			width: 698rpx;
			height: 308rpx;
			background: #f5f5f5;
			box-sizing: border-box;
			border-radius: 20rpx;
		}
		.btn {
			
			height: 74rpx;
			background: #fe5e10;
			border-radius: 60rpx;
			
			color: #fff;
		}
	}
	
.feel-box {
	.li-box {
		box-shadow: 1px 1px 15rpx 0rpx #ccc;
		border-radius: 20rpx;
		.diet-img {
			width: 100%;
			image {
				width: 100%;
			}
		}
		.feel-li {
			.feel-txt {
				font-size: 28rpx;
				margin-left: 10rpx;
			}
			.feel-img {
				width: 60rpx;
				height: 60rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.result-box {
				font-size: 27rpx;
			}
			padding: 20rpx 30rpx;
		}
		
	}
}

.top-right {
	margin-left: 54rpx;
	line-height: 48rpx;
}


.title {
	font-size: 32rpx;
	font-weight: 600;
}
.gray {
	font-size: 22rpx;
	color: rgba(0, 0, 0, 0.6);
}

</style>
