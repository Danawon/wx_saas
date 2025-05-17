<template>
	<view class="wrap-min">
		<head-nav
			title="用户详情"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="list-box padlr20 pad-t20">
			<view class="li ">
				<view class="flex-row flex-a">
					<view class="li-avatar">
						<u-avatar
							:src="userInfo.avatar"
							size="150rpx"
						></u-avatar>
					</view>
					<view class="li-info flex-col  ju-bt">
						<view
							class="info-name flex-row flex-a ju-bt"
						>
							<view class="name flex-row flex-a">
								<view class="name-txt text-elpis">
									{{ userInfo.nickname || '' }}
								</view>
								<view class="id-box mar-l20">
									ID: {{ userInfo.id || '' }}
								</view>
							</view>
							<view
								class="btn-detail"
								@click="goRouter(1)"
								v-if="
									(tabsCurrent === 1 ||
										tabsCurrent === 2) &&
										privacyAuth == 1
								"
							>
								历史记录
							</view>
						</view>
						<view class="tel flex-row flex-a">
							<view class="tel-num" @click="callUpFun">
								手机号：{{
									userInfo.authorize_mobile ||
										''
								}}
							</view>
							<view
								class="tel-copy"
								@click="copyFun"
							>
								复制
							</view>
							<view
								class="dial-tel"
								@click="goRouter(3)"
								v-if="roleType === 'shopowner' || roleType === 'coach' || roleType === 'sporty'|| roleType === 'nutrition'"
							>
								查看训练计划
							</view>
						</view>
						<view
							class="balance flex-row flex-a ju-bt"
						>
							<view class="flex-a">
								<view class="balance-num mar-r10">
									余额：{{
										userInfo.money || ''
									}}元
								</view>
								<u-switch 
									v-model="userInfo.face_open"
									@change="switchChange" 
									size="15"
									:inactiveValue="0"
									:activeValue="1"
								></u-switch>
							</view>
							<view
								class="balance-btn"
								@click="goRouter(2)"
								v-if="privacyAuth == 1"
								:class="{
									absenceSty: !questionnaire
								}"
							>
								健康问卷
								<text v-if="questionnaire">
									已填写
								</text>
								<text v-else>未填写</text>
								<view
									class="tips-icon"
									v-if="
										userInfo.questionnaire_danger
									"
								>
									<image
										:src="
											baseUrl +
												'tips-icon.png'
										"
										mode=""
									></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<u-line margin="20rpx 0"></u-line>
			</view>
			<!-- tabs模块 -->
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
		</view>
		<!-- 列表模块 -->
		<view class="info-list pad20" v-if="tabsCurrent == 0">
			<view
				class="li padlr20 padtb40"
				v-for="(item, index) in cardList"
				:key="index"
			>
				<view class="card-tit">
					{{ item.membercard.name }}
				</view>
				<view
					class="card-info flex-row flex-a ju-bt mar-t20"
				>
					<view class="info-l">
						<view class="shop">
							所属门店：{{ item.storename }}
						</view>
						<view class="">
							购买时间：{{ item.createtime }}
						</view>
						<view class="" @click="showModal(item, 'count')">
							当前剩余：{{ item.used_number }}/{{
								item.total_times
							}}次
						</view>
						
						<view class="" @click="showModal(item, 'days')">
							剩余天数：{{ item.shenday }}天
						</view>
						<view class="" >
							停卡次数：{{
								item.stopusing_count
							}}次
						</view>
						<view class="">
							激活时间：{{ item.activation_time }}
						</view>
					</view>
					<view class="info-r">
						<view
							class="state state1"
							v-if="item.status === 1"
						>
							已激活
						</view>
						<view
							class="state state2"
							v-if="item.status === 0"
						>
							未激活
						</view>
						<view
							class="state state2"
							v-if="item.status === -1"
						>
							已过期
						</view>
						<view
							class="state state2"
							v-if="item.status === 2"
						>
							已停卡
						</view>
						<view
							class="state state2"
							v-if="item.status === 3"
						>
							退卡
						</view>
						<view
							class="state state2"
							v-if="item.status === 4"
						>
							转卡
						</view>
					</view>
				</view>
			</view>

			<u-empty
				v-if="!cardList.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
		</view>

		<!-- 体适健康评估 -->
		<view
			class="health pad20"
			v-if="tabsCurrent === 1 || tabsCurrent === 2"
		>
			<!-- stamina => 体能 -->
			<stamina-fillin
				v-if="tabsCurrent === 1 && privacyAuth == 1"
				:healthData="healthData"
				:user_id="userId"
				:userInfo="userInfo"
				parentType="roleLook"
				ref="staminaFillinRef"
			></stamina-fillin>
			
			<!-- 医疗 -->
			<medical-fillin
				v-if="tabsCurrent === 2 && privacyAuth == 1"
				:user_id="userId"
				ref="medicalFillinRef"
				@parentGetInfo="getUserInfoFun"
			></medical-fillin>
		</view>
		<u-empty
			marginTop="100rpx"
			v-if="
				privacyAuth === 0 &&
					(tabsCurrent === 1 || tabsCurrent === 2)
			"
			iconSize="140rpx"
			textSize="28rpx"
			mode="page"
			text="无权查看会员隐私信息!"
		></u-empty>

		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			title="编辑会员卡"
			confirmText="确定"
			cancelText="取消"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentCancel="modalCancel"
			@parentConfirm="modalConfirm"
		>
			<view class="modalTxt pad-b40 ">
				<view class="block flex-row flex-a">
					<view class="lable">
						{{ editType === 'count' ? '剩余次数' : '剩余天数' }}: 
					</view>
					<u--input
						placeholder="请输入"
						border="surround"
						v-model="modalVal"
					></u--input>
				</view>
			</view>
		</modal-tips>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
// 体能组件
import staminaFillin from '@/components/staminaFillin/staminaFillin.vue';
// 医疗组件
import medicalFillin from '@/components/medicalFillin/medicalFillin.vue';
import { getUserinfo, editMembercard, setFaceOpen } from '@/api/admin.js';
import { getBodytestApikey } from "@/api/myCenter.js"
// 引入modal组件
import modalTips from '@/components/modalTips/modalTips.vue';
export default {
	components: {
		medicalFillin,
		staminaFillin,
		modalTips
	},
	data() {
		return {
			baseUrl: baseUrl,
			tabsArr: [
				{
					name: '会员卡'
				},
				{
					name: '体适健康'
				},
				{
					name: '医疗'
				},
				{
					name: "运动报告"
				}
			],
			// tabs当前选中
			tabsCurrent: 1,
			// 用户id
			userId: '',
			// 用户信息
			userInfo: {},
			// 卡信息列表
			cardList: [],
			// 体适能数据
			healthData: {},
			questionnaire: '', // 健康问卷
			// 是否有权限查看会员信息
			privacyAuth: '',
			/* 医疗数据 */
			edicaltestData: '',
			// modalshow
			modalShow: false,
			modalVal: '',
			// 编辑类型
			editType: '',
			// 选中会员卡id
			cardId: "",
			// 角色身份
			roleType: "",
		};
	},
	onLoad(e) {
		/* shopowner 店长  coach 教练  sporty 运动管理师  nutrition 营养师 */
		this.roleType = uni.getStorageSync("role")
		this.userId = e.id;
		this.getUserInfoFun();
	},
	onShow() {
	},
	methods: {
		switchChange() {
			setFaceOpen({
				uid: this.userId,
				status: this.userInfo.face_open
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
			})
		},
		/* 显示 modal组间 */
		showModal(item, type) {
			/* 超级管理员操作 */
			if(uni.getStorageSync("role") === 'administrator') {
				this.editType = type;
				this.cardId = item.id;
				this.modalVal= type === 'count' ? item.total_times : item.shenday;
				this.modalShow = true;
			}
		},
		/* 点击modal确定 */
		modalConfirm() {
			if(!this.modalVal) {
				uni.showToast({
					title: "请输入后保存！",
					icon: "error"
				})
				return
			}
			this.modalCancel();
			let editObj = 
			this.editType === 'count' ? 
			{
				'total_times': this.modalVal
			} : 
			{
				day: this.modalVal
			}
			this.memberCardEditFun(editObj);
		},
		/* 编辑会员卡 */
		memberCardEditFun(data) {
			editMembercard({
				id: this.cardId,
				...data
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.getUserInfoFun();
				},1500)
			})
		},
		/* modalCancel */
		modalCancel() {
			this.modalShow = false;
		},
		getBodytestApikey() {
			getBodytestApikey({
				phone: this.userInfo.authorize_mobile
			}).then(res => {
				if(Object.prototype.toString.call(res.data) !== '[object Array]') {
					this.$refs.staminaFillinRef.getApiKey(res.data.apiKey)
				}
			})
		},
		// 获取用户信息
		getUserInfoFun() {
			getUserinfo({
				id: this.userId
			}).then(res => {
				this.userInfo = res.data.userinfo;
				this.cardList = res.data.cardlist;
				this.healthData = res.data.health_data;
				this.questionnaire = res.data.questionnaire;
				this.privacyAuth = res.data.privacy_auth;
				this.edicaltestData = res.data.edicaltest_data;
				this.getBodytestApikey();
				if(this.tabsCurrent == 2) {
					if (this.edicaltestData) {
						this.$refs.medicalFillinRef.getMedicalData(
							this.edicaltestData
						);
					}
				}
			});
		},
		// 拨打电话
		callUpFun() {
			uni.makePhoneCall({
				phoneNumber: this.userInfo.authorize_mobile,
				success: function() {},
				fail() {}
			});
		},
		// 复制
		copyFun() {
			uni.setClipboardData({
				data: this.userInfo.authorize_mobile,
				success: function(res) {
					uni.getClipboardData({
						success: function(res) {
							uni.showToast({
								title: '复制成功'
							});
						}
					});
				}
			});
		},
		// tabschange改变
		tabsChange(eve) {
			this.tabsCurrent = eve.index;
			if(eve.index == 3) {
				uni.navigateTo({
					url: `/pages/myCenter/pages/trainingReport/trainingReport?id=${this.userId}`
				})
				return
			}
			if (this.tabsCurrent == 2) {
				// setTimeout(() => {
					this.$nextTick(() => {
						if (this.edicaltestData) {
							this.$refs.medicalFillinRef.getMedicalData(
								this.edicaltestData
							);
						}
					})
					
				// }, 300);
			}
		},
		// 跳转
		goRouter(eve) {
			let url = ""
			if (eve == 1) {
				url= `/pages/myCenter/pages/historyInfo/historyInfo?uid=${
					this.userInfo.id
				}&phone=${this.userInfo.authorize_mobile}`
			} else if (eve == 2) {
				if (this.questionnaire) {
					url = `/pages/myCenter/pages/healthQuestionnaire/healthQuestionnaire?uid=${
						this.userInfo.id
					}`
				}
			}else if(eve == 3) {
				url = `/pages/myCenter/pages/trainingPlan/trainingPlan?uid=${this.userInfo.id}`
			}
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss" scoped>

.modalTxt {
	.block {
		width: 100%;
	}
}
.id-box {
	font-size: 26rpx;
}
.absenceSty {
	border: 1px solid #f00 !important;
	color: #f00 !important;
}
.btn-detail {
	font-weight: 400;
	color: rgba(13, 188, 20, 0.9);
	font-size: 26rpx;
}
.health {
	background-color: #fff;
}
.info-list {
	.li {
		.card-info {
			.info-r {
				.state2 {
					border: 1px solid #999999;
					color: #999999;
				}
				.state1 {
					border: 1px solid #fe5e10;
					color: #fe5e10;
				}
				.state {
					padding: 10rpx;
					border-radius: 10rpx;
					font-weight: 400;
					font-size: 22rpx;
				}
			}
			.info-l {
				font-weight: 300;
				color: rgba(0, 0, 0, 0.6);
				font-size: 24rpx;
				view {
					margin-bottom: 8rpx;
				}
			}
		}
		.card-tit {
			font-weight: 550;
			color: #202020;
			font-size: 32rpx;
		}
		border-radius: 20rpx;
		background-color: #fff;
		margin-bottom: 30rpx;
	}
}
.tabs-box {
	width: 100%;
}
.tips-icon {
	position: absolute;
	width: 35rpx;
	height: 35rpx;
	top: -20rpx;
	right: -20rpx;
	image {
		width: 100%;
		height: 100%;
	}
}
.list-box {
	background-color: #fff;
	.li {
		.li-info {
			.balance {
				width: 85%;
				position: relative;

				.balance-btn {
					font-weight: 400;
					color: rgba(13, 188, 20, 0.9);
					font-size: 20rpx;
					border-radius: 6rpx;
					border: 1px solid rgba(13, 188, 20, 0.9);
					padding: 4rpx 30rpx;
					margin-left: 30rpx;
				}
			}
			.tel {
				.dial-tel {
					color: #fff;
					padding: 2rpx 10rpx;
					margin-left: 10rpx;
					background: rgba(13, 188, 20, 0.9);
					border-radius: 6rpx;
				}
				.tel-copy {
					font-weight: 400;
					color: rgba(0, 0, 0, 0.4);
					font-size: 20rpx;
					padding: 2rpx 10rpx;
					margin: 0 15rpx;
					border: 1px solid rgba(0, 0, 0, 0.4);
					border-radius: 6rpx;
				}
			}
			.info-name {
				font-weight: 400;
				color: #202020;
				font-size: 32rpx;
				.name-txt {
					width: 210rpx;
				}
			}
			font-weight: 300;
			color: rgba(0, 0, 0, 0.6);
			font-size: 24rpx;
			height: 100%;
			width: 75%;
			height: 150rpx;
		}
		.li-avatar {
			width: 25%;
		}
	}
}
</style>
