<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="会员打卡数据"
		></head-nav>

		<view class="page-top flex-a pad20">
			<u-avatar
				:src="userInfo.avatar"
				size="128rpx"
			></u-avatar>
			<view class="top-right">
				<view class="title">
					{{ userInfo.nickname || '' }}
				</view>
				<view class="gray">
					账号ID：{{ userInfo.uid || '' }}
				</view>
				<view class="gray">
					手机号：{{ userInfo.mobile ||'' }}
				</view>
			</view>
		</view>
		<view class="page">
			<view class="title pad-b40 mar-t20">打卡数据</view>
			<view class="pad-t20 pad-b20 li flex-a ju-bt">
				<text class="txt color99">训练时间：</text>
				<text>
					{{ infoData.length_time || '' }}
				</text>
			</view>
			<view
				class="pad-t20 pad-b20 li  flex-a ju-bt"
				@click="
					jump(
						'/pages/admin/pages/sportsTeacherUser/heartRate/heartRate'
					)
				"
			>
				<text class="txt color99">训练强度：</text>
				<view class="flex-a">
					<text>
						{{ infoData.motion_strength.name || '' }}
					</text>
					<text class="tip mar-l20">查看</text>
				</view>
			</view>
			<view class="pad-t20 pad-b20 li  flex-a ju-bt">
				<text class="txt color99">运动形式：</text>
				<text>{{ infoData.training_form_text || '' }}</text>
			</view>
			<view class="pad-t20 pad-b20 li  flex-a ju-bt">
				<text class="txt color99">消耗热量：</text>
				<text>{{ infoData.calories || '' }}千卡</text>
			</view>
			<view class="pad-t20 pad-b20 li  flex-a ju-bt">
				<text class="txt color99">打卡感受：</text>
				<text>{{ infoData.experience || '' }}</text>
			</view>
			<view class="title mar-t40">打卡完成情况</view>
			<view class="martb20 flex-a ju-bt">
				<u-radio-group
					v-model="radiovalue"
					placement="row"
					shape="square"
					activeColor="#FE5E10"
				>
					<u-radio
						:customStyle="{ marginBottom: '8px' }"
						v-for="(item, index) in radiolist"
						:key="index"
						:label="item.tit"
						:name="item.name"
					></u-radio>
				</u-radio-group>
			</view>
			<!-- 快捷语选择 -->
			<view class="shortcut-box martb20 flex" @click="showChildNode">
				<view >
					<u-button text="选择快捷语" icon="chat" type="success" ></u-button>
				</view>
			</view>
			<view class="title">教练点评</view>
			<view class="">
				<textarea
					v-model="feedback"
					placeholder="多行输入"
					class="textarea pad20"
				/>
			</view>
			<view class="btn flex" @click="submit">提交</view>
		</view>
		
		<shortcut-modal ref="shortcutModalRef" @selectedShortcut="selectedShortcut"></shortcut-modal>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import {
	planDetail,
	planFeedback,
} from '@/api/sportsTeacher.js';
/* 快捷语弹框 */
import shortcutModal from "@/components/shortcutModal/shortcutModal.vue"
export default {
	components: {
		shortcutModal
	},
	data() {
		return {
			baseUrl: baseUrl,
			taskId: '', // 任务id
			userInfo: {}, // 用户信息
			infoData: {}, // 任务信息
			radiolist: [
				{
					tit: '未达标',
					name: 'up_standard'
				},
				{
					tit: '达标',
					name: 'standard'
				},
				{
					tit: '超标',
					name: 'exceed_quota'
				}
			],
			/* 选中 状态 */
			radiovalue: 'up_standard',
			/* 返回文本 */
			feedback: '',

		};
	},
	onLoad(e) {
		this.taskId = e.id;
	},
	onShow() {
		this.getPlanDetail();
	},
	watch: {

	},
	methods: {
		/* 调用快捷语组件组件  */
		showChildNode() {
			this.$refs.shortcutModalRef.toggleShow({
				radiovalue: this.radiovalue,
				type: 'aerobic_punch'
			})
		},
		/* 选中快捷语句 */
		selectedShortcut(item) {
			let str = ''
			if(this.feedback) {
				str = this.feedback + ',' + item
			}else {
				str = item
			}
			this.feedback = str
		},
		/* 提交反馈 */
		submit() {
			let _this = this;
			planFeedback({
				score: this.radiovalue,
				task_id: this.taskId,
				analysis: this.feedback
			}).then(res => {
				if(!res.data.next_id) {
					uni.showToast({
						title: res.msg
					});
					setTimeout(() => {
						_this.getPlanDetail();
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
									url: '/pages/admin/pages/sportsTeacherUser/releaseTask/releaseTask?id='+res.data.next_id
								})
							}else {
								
								uni.navigateBack()
								
							}
						}
					})
				}
				
			});
		},
		// 获取课程强请
		getPlanDetail() {
			planDetail({
				task_id: this.taskId
			}).then(res => {
				this.userInfo = res.data.user;
				this.infoData = res.data.info;
				this.radiovalue = this.infoData.score;
				this.feedback = this.infoData.analysis
			});
		},
		//跳转页面
		jump(url) {
			uni.navigateTo({
				url: `${url}?data=${encodeURIComponent(
					JSON.stringify(this.infoData)
				)}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
/deep/ .u-button__text{
	margin-left: 10rpx;
}
.textarea {
	width: 698rpx;
	height: 308rpx;
	background: #f5f5f5;
	margin: 32rpx;
	box-sizing: border-box;
	border-radius: 20rpx;
}
/deep/ .u-radio {
	width: 33%;
	justify-content: center;
}
.btn {
	width: 686rpx;
	height: 74rpx;
	background: #fe5e10;
	border-radius: 60rpx;
	margin: 60rpx auto;
	color: #fff;
}
.page-top {
	.top-right {
		margin-left: 54rpx;
		line-height: 48rpx;
	}
}
.color99 {
	color: #999;
}
.title {
	font-size: 32rpx;
	font-weight: 600;
}
.gray {
	font-size: 22rpx;
	color: rgba(0, 0, 0, 0.6);
}
.page {
	padding: 0rpx 20rpx 30rpx;

	.li {
		font-size: 28rpx;
	}
	.tip {
		border-radius: 8rpx;
		border: 2rpx solid #fe5e10;
		font-size: 22rpx;
		font-weight: 400;
		color: #fe5e10;
		padding: 3rpx 20rpx;
	}
}
</style>
