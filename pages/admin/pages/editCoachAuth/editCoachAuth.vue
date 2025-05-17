<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="教练权限设置"
		></head-nav>
		<view class="pad20">
			<view
				class="page-li flex-a ju-bt right"
				@click="levelModal = true"
			>
				<text>级别选择</text>
				<text v-if="levelTxt">{{ levelTxt }}</text>
				<text v-else class="admin-txt">请选择级别</text>
			</view>
			<view class="page-li flex-a ju-bt right">
				<text>教练资格</text>
				<view class="input-box">
					<u-radio-group
						placement="row"
						v-model="coachQualification"
						@change="coachQualificationChange"
					>
						<view
							class="mar-l40"
							v-for="(item,
							index) in coachQualificationSelect"
							:key="index"
						>
							<u-radio
								activeColor="#FE5E10"
								:name="item.field"
								shape="circle"
								:label="item.name"
							></u-radio>
						</view>
					</u-radio-group>
				</view>
			</view>

			<view
				class="page-li flex-a ju-bt right"
				v-if="coachQualification == 'job'"
			>
				<text>是否允许设置</text>
				<view class="input-box">
					<u-radio-group
						placement="row"
						v-model="radioVal"
						@change="isSetChange"
					>
						<view class="mar-r40">
							<u-radio
								activeColor="#FE5E10"
								:name="1"
								shape="circle"
								label="允许"
							></u-radio>
						</view>
						<u-radio
							activeColor="#FE5E10"
							:name="2"
							shape="circle"
							label="禁止"
						></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view
				class="page-li flex-a ju-bt right"
				@click="jump"
				v-if="
					coachQualification == 'job' && radioVal == 2
				"
			>
				<text>教练时段</text>
				<text class="admin-txt">去管理</text>
			</view>
			<view class="page-li flex-a ju-bt right">
				<text>课提比例</text>
				<view class="input-box">
					<u--input
						placeholder="请输入课提比例"
						border="none"
						type="number"
						v-model="proportion"
						suffixIcon="%"
						inputAlign="right"
					></u--input>
				</view>
			</view>
			<view class="fot-btn ">
				<view class="btn flex" @click="editProportion">
					保存课提比例
				</view>
			</view>
		</view>
		<!-- 选择教练级别 -->
		<u-action-sheet
			:actions="levelSelectArr"
			@select="selectLevel"
			title="请选择卡级别"
			:show="levelModal"
			cancelText="关闭"
			@close="levelModal = false"
		></u-action-sheet>
	</view>
</template>

<script>
import { selectCoachDetail, editCoach } from '@/api/admin.js';
export default {
	data() {
		return {
			levelSelectArr: [], // 级别选择数据
			levelModal: false, // 等级show
			coachId: '', // 教练id
			coachQualification: '', // 教练资格
			coachQualificationSelect: [], // 教练资格选择
			radioVal: '', // 是否允许设置
			levelTxt: '', // 级别文本
			levelId: '', // 级别id
			proportion: '' // 课提比例
		};
	},
	onLoad(eve) {
		this.coachId = eve.id;
		this.getSelectCoachDetail(); // 获取教练详情
	},
	methods: {
		// 编辑课提费
		editProportion() {
			if(!this.proportion) {
				uni.showToast({
					title: "请输入正确的课题费",
					icon: "none"
				})
				return
			}
			this.editCoachFun({ class_fee_ratio: this.proportion });
		},
		/* 是否允许设置 */
		isSetChange(e) {
			this.editCoachFun({ is_set: this.radioVal });
		},
		/* 教练资格cange */
		coachQualificationChange(e) {
			this.editCoachFun({
				status: this.coachQualification
			});
		},
		// 选中级别
		selectLevel(eve) {
			this.levelTxt = eve.name;
			this.levelId = eve.field;
			this.editCoachFun({ level: this.levelId });
		},
		// 获取教练详情
		getSelectCoachDetail() {
			selectCoachDetail({
				id: this.coachId
			}).then(res => {
				this.coachQualification = res.data.info.status;
				this.coachQualificationSelect = res.data.status;
				this.levelSelectArr = res.data.level;
				this.radioVal = Number(res.data.info.is_set);
				this.levelTxt = res.data.info.level_text;
				this.proportion = res.data.info.class_fee_ratio;
			});
		},
		// 编辑教练信息
		editCoachFun(eve) {
			editCoach({
				id: this.coachId,
				...eve
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			});
		},
		jump() {
			uni.navigateTo({
				url: `/pages/admin/pages/coach/periodTime/periodTime?id=${
					this.coachId
				}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.fot-btn {
	margin-top: 60rpx;
	.btn {
		width: 100%;
		height: 80rpx;
		background-color: #fe5e10;
		border-radius: 40rpx;
		color: #fff;
	}
}
.admin-txt {
	font-weight: 500;
	color: #999999;
	font-size: 26rpx;
}
.right {
	padding-right: 70rpx;
	background-position: 97% center;

}
.page-li {
	padding: 36rpx 26rpx 32rpx 0;
	border-bottom: #e7e7e7 1rpx solid;
	font-size: 28rpx;
	font-weight: 400;
	color: rgba(32, 32, 32, 0.9);
}
</style>
