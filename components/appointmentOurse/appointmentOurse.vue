<template>
	<view class="wrap">
		<view class="course-select-box">
			<view
				class="course-tabs flex-a"
				:style="{
					background: 'url(' + baseUrl + 'jb.png)',
					'background-size': '100% 100%'
				}"
			>
				<view
					class="tabs-item flex"
					v-for="(courseItem,
					courseIndex) in courseTabs"
					:key="courseIndex"
					:class="{
						selectTabs: selectCourse == courseIndex
					}"
					@click="changeCourse(courseIndex)"
				>
					{{ courseItem.name }}
				</view>
			</view>
			<!-- 选择天 -->
			<view class="daySelect-box ju-ar">
				<view
					class="day-item flex-col flex-a"
					v-for="(dayItem, dayIndex) in dayArr"
					:key="dayIndex"
					:class="{
						'select-item':
							selectDateIndex == dayIndex
					}"
					@click="changeDate(dayIndex)"
				>
					<view class="item-tit">
						{{ dayItem.name }}
					</view>
					<view class="item-date">
						{{ dayItem.date }}
					</view>
					<view
						class="line"
						v-if="selectDateIndex == dayIndex"
					></view>
				</view>
			</view>
			<!-- 选择教练 box -->
			<view class="selectCoach ">
				<view
					class="coach-list martb20"
					v-for="(coacItem, coacIndex) in list"
					:key="coacIndex"
					@click="selectAutonomous(coacIndex)"
				>
					<view class="list-item flex-a pad-l40" :class="[selectCourse != 1 ? 'pad-r20' : 'pad-r40']">
						<view class="item-l" @click="onCoach(coacItem)" v-if="selectCourse != 1" >
							<view class="item-img " >
								<u-avatar
									:src="selectCourse ? coacItem.template.image : coacItem.avatar"
									:size="selectCourse ? '100rpx': '120rpx'"
								></u-avatar>
							</view>

						</view>

						<view 
							class="item-r flex-col ju-bt " 
							:class="{'selectSelf': selectCourse == 1 && autonomouslyIndex === coacIndex}" 
							:style="{'width': selectCourse == 1 ? '100%': '82%'}"
						>
							<view class="r-top flex-row flex-a ju-bt " :class="{'mar-b20' : selectCourse != 1}">
								<!-- 自主练样式 -->
								<view class="periods-time flex-row flex-a ju-bt padtb20" v-if="selectCourse == 1">
									<view class="txt-size">
										{{ coacItem.period_text || '' }}
									</view>
									<view class="tit-txt">
										已约<text class="fontCor">{{ coacItem.ordercount || '0' }}</text>人/限{{ coacItem.number || '0' }}人
									</view>
								</view>
								<!-- 私教课数据 -->
								<view class="itme-name flex-col ju-ar" v-if="selectCourse == 0">
									<view class="name"  @click.stop="onCoach(coacItem)">
										{{ coacItem.name || '' }}
										<text class="levelText">({{ coacItem.level_text }})</text>
									</view>
									<view class="course-time mar-t20">
										课程时间: {{ coacItem.course_time || '' }}
									</view>
									<!-- 教练标签 -->
									<view class="strength-tag  ">
										<view class="tag-box flex-row flex-a">
											<text class="newHand" v-for="(item, index) in coacItem.label" :key="index">
												{{
													item 
												}}
											</text>
										</view>
										
									</view>
									
								</view>
								
								<!-- 团课数据 -->
								<view class="leagueClass flex-col ju-bt" v-if="selectCourse == 2">
									<view class="course-tit flex-row ju-bt">
										<view class="txt1 text-elpis">
											{{ coacItem.template.name || '' }}
											
										</view>
										<view class="txt2 mar-l20 flex">
											{{ coacItem.template.min || '' }}人开团
										</view>
									</view>
									<!-- 教练信息和约课时间段 -->
									<view class="coach-box flex-row flex-a mar-t10">
										<view class="name">
											{{ coacItem.coachname || '' }}
											<text class="levelText">({{ coacItem.level_text }})</text>
										</view>
										<view class="line"></view>
										<view class="time">
											{{ coacItem.period_text || '' }}
										</view>
									</view>
									<view class="coach-box">
										已约 <text class="fontCor">{{ coacItem.ordercount || '0' }}</text> 人/ 限{{ coacItem.template.max || '0' }}人
									</view>
								</view>

								<!-- 可约时间段 -->
								<view class="item-tips flex-col flex-a" v-if="selectCourse == 0">
									<view class="tips-txt">
										待约课时
									</view>
									<view class="tips-num flex">
										{{
											coacItem.period_count || '0'
										}}
									</view>
								</view>
								
								<!-- 私教课按钮 -->
								<view class="item-btn" :class="{'oneselfBtn' : selectCourse == 1}">
									<view
										class="btn-appointment flex"
										v-if="
											coacItem.appointment_status_code == 2
										"
										@click="
											appointmentFun(
												coacItem
											)
										"
									>
										预约
									</view>
									<view
										class="btn-sufficient flex "
										v-if="
											coacItem.appointment_status_code == 1
										"
									>
										已约满
									</view>
									<view
										class="btn-sufficient flex btn-not"
										v-if="
											coacItem.appointment_status_code == 3
										"
									>
										已预约
									</view>
									<view
										class="btn-sufficient flex btn-not"
										v-if="
											coacItem.appointment_status_code == 4
										"
									>
										不可约
									</view>
								</view>
							</view>
							<u-line margin="0rpx 0 0"></u-line>
						</view>
					</view>
				</view>
				<u-empty
					v-if="!list.length"
					mode="list"
					text="暂无课程..."
				></u-empty>
			</view>
		</view>
		<select-time ref="selectTimeRef" type="store"></select-time>
		

	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
// 选择预约时间组件
import selectTime from '@/components/selectTime/selectTime.vue';
import { getCourseList, payForCourses } from '@/api/storeApis.js';
export default {
	// 约课选择时间 天 组件
	name: 'appointmentOurse',
	components: {
		selectTime,
	},
	props: {
		storeId: {
			type: Number,
			default: ''
		},
		status: {
			type: Boolean,
			default: false
		},
	},

	data() {
		return {
			// ftp地址
			baseUrl: baseUrl,
			// 课程选择 tbas
			courseTabs: [
				{
					name: '私教课',
					type: 'private_teaching'
				},
				{
					name: '自主练',
					type: 'autonomous_class'
				},
				{
					name: '团课',
					type: 'league_class'
				}
			],
			// 选中的课程类型
			selectCourse: 0,
			// selectDayArr 选择天
			dayArr: [],
			// 选中时间下标
			selectDateIndex: 0,
			// 选中日期
			selectDate: '',
			list: [],
			// 选中 教练id
			selectCoachId: "",
			/* 选中的自主练下标 */
			autonomouslyIndex: "",
		};
	},
	// onReady() {
	// 	this.getCourseList();
	// },
	options: {
	    styleIsolation: 'shared'
	},
	watch:{
		status: {
			handler(newV, oldV) {
				this.getCourseList();
			},
			immediate: true,
			deep: true
		}
	},
	methods: {

		/* 点击modal确定 预约自主课  */
		payForCoursesFun(data) {
			payForCourses(data).then(res => {
				uni.showToast({
					title: "预约成功",
					icon: 'success'
				});
				setTimeout(() => {
					this.getCourseList();
				},1500)
			})
		},
		/* 选中自习课 */
		selectAutonomous(index) {
			this.autonomouslyIndex = index;
		},
		/* 点击教练头像 */
		onCoach(item) {
			uni.navigateTo({
				url: `/pages/store/pages/coachDetail/coachDetail?coachId=${item.id}`
			});
		},
		// 选中日期change
		changeDate(eve) {
			this.list = [];
			this.selectDateIndex = eve;
			this.selectDate = this.dayArr[eve].new_date;
			this.getCourseList();
		},
		// 选中课程类型change
		changeCourse(eve) {
			this.list = [];
			this.selectDateIndex = 0;
			this.autonomouslyIndex = ""
			this.selectCourse = eve;
			this.getCourseList();
		},
		// 获取课程列表
		getCourseList() {
			let _this = this;
			getCourseList({
				card_type:
					_this.courseTabs[this.selectCourse].type,
				date: _this.selectDate,
				store_id: _this.storeId
			}).then(res => {
				_this.dayArr = res.data.date;
				_this.list = res.data.module_list;
			});
		},

		// 点击预约
		appointmentFun(item, index) {

			if(this.courseTabs[this.selectCourse].type == "league_class") { // 团课预约
				let obj = {
					groupclass_id: item.id, // 课程id
					coach_id: item.coach_id, // 教练id
					period: item.period, // 时间段id
					card_type: "league_class",
					date: this.dayArr[this.selectDateIndex].new_date, // 选中日期
					storeId: this.storeId, // 门店id
				}
				uni.navigateTo({
					url: `/pages/store/pages/buyCourseDetail/buyCourseDetail?parentData=${JSON.stringify(obj)}&type=course`
				})
			}else if(this.courseTabs[this.selectCourse].type == "private_teaching") { // 私教课
				// 打开时间选择组件
				this.$refs.selectTimeRef.openSelectTime({
					selectDate: this.dayArr[this.selectDateIndex].new_date, // 选中日期
					courseType: this.courseTabs[this.selectCourse].type, // 选中课程类型
					coachId: item.id, // 教练id
					storeId: this.storeId, // 门店id
				});
			}else if(this.courseTabs[this.selectCourse].type == "autonomous_class") {// 自主练
				let _this = this;
				uni.showModal({
					title: "预约提示",
					content: "确定预约当前选中自主课吗?",
					confirmText: "确定预约",
					success: eve => {
						if(eve.confirm) {
							this.payForCoursesFun({
								period: item.period, // 时间段id
								card_type: "autonomous_class", // 课程类型
								date: this.dayArr[this.selectDateIndex].new_date, // 选中日期
								pay_type: 'mbcard', // 支付方式
								card_id: "", // 会员卡id
								store_id: this.storeId, // 门店id
								autonomous_id: item.id,// 自主练 课程id
								coupon_id: "", // 优惠卷id
							})
						}
					}
				})
			}
			
		}
	}
};
</script>

<style lang="scss" scoped>
	/deep/ .u-avatar{
		border: 2px solid #1296db;
		overflow: hidden;
	}
	.fontCor {
		color: #25c32b;
	}
	.selectSelf {
		background: linear-gradient(100deg, #FFA376 0%, rgba(255, 163, 118, 0) 100%);
		border-radius: 10rpx;
	}
	.tit-txt {
		font-size: 25rpx;
	}
	.oneselfBtn {
		display: flex;
		justify-content: flex-end;
	}
	.btn-not {
		color: #999 !important;
		border: none !important;
	}
	.mar-t10 {
		margin-top: 10rpx;
	}
	//  团课样式 
	.leagueClass {
		height: 120rpx;
		.coach-box {
			.line {
				width: 1px;
				height: 17rpx;
				background-color: #D9D9D9;
				margin: 4rpx 13rpx 0;
			}
			font-weight: 500;
			color: rgba(0,0,0,0.4);
			font-size: 24rpx;
			width: 100%;
		}
		.course-tit {
			width: 100%;
			.txt2 {
				padding: 5rpx 15rpx;
				font-weight: 500;
				color: #FE5E10;
				font-size: 20rpx;
				background: #FFF3ED;
				border-radius: 30rpx;
				width: 37%;
			}
			.txt1 {
				font-weight: 400;
				color: rgba(32,32,32,0.9);
				font-size: 28rpx;
				width: 60%;
			}
		}
	}
.selectCoach {
	.coach-list {
		.list-item {
			.item-l {
				width: 18%;
			}
			.item-r {
				.r-top {
					.periods-time {
						width: 72%;
						.txt-size {
							font-size: 24rpx;
						}
					}
					.item-btn {
						width: 18%;
					}
					.leagueClass  {
						width: 72%;
					}
					width: 100%;
				}
				// height: 90rpx;
				width: 82%;
				
				// padding-top: 66rpx;
			}
			.item-btn {
				.btn-appointment {
					font-size: 26rpx;
					color: rgba(13, 188, 20, 0.9);
				}
				.btn-sufficient {
					color: #fe5e10;
					font-size: 26rpx;
				}
			
			}
			.item-tips {
				width: 18%;
				margin-top: -35rpx;
				.tips-txt {
					font-size: 24rpx;
					margin-bottom: 15rpx;
					color: #7d7d7d;
				}
				.tips-num {
					width: 75rpx;
					height: 50rpx;
					background-color: #f7f7f7;
					font-weight: bold;
					border-radius: 10rpx;
					font-size: 27rpx;
					border: 1px solid rgba(32,32,32,0.3);
				}
			}
			.itme-name {
				.course-time {
					font-size: 23rpx;
					color: #8b8b8b;
				}
				.strength-tag {
					.tag-box {
						position: absolute;
						left: 0;
						top: 26rpx;
						width: 145%;
					}
					.newHand {
						font-size: 23rpx;
						background: #f8f8f8;
						border-radius: 6rpx;
						padding: 4rpx 9rpx;
						color: #a6a6a6;
						margin-right: 6rpx;
					}
					// display: flex;
					// flex-wrap: wrap;
					position: relative;
					height: 60rpx;
					
				}
				.name {
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #202020;
					.levelText {
						font-size: 22rpx;
						color: #999;
					}
				}
				justify-content: space-around;
				margin-left: 20rpx;
				height: 100%;
				width: 60%;
			}
			height: 100%;
		}
	}
	width: 100%;
	background-color: eee;
}
.daySelect-box {
	.select-item .item-tit {
		color: #202020;
		font-weight: 600;
		font-family: PingFang SC-Semibold, Ping;
	}
	.select-item .item-date {
		font-family: PingFang SC-Medium, PingFang SC;
		font-weight: 500;
		color: #202020;
	}
	.item-tit {
		font-size: 27rpx;
	}
	.item-date {
		font-size: 18rpx;
		margin: 15rpx 0;
	}
	.day-item {
		.line {
			width: 25%;
			height: 5rpx;
			background-color: #202020;
			border-radius: 20rpx;
		}
		width: 14%;
		// margin-right: 10rpx;
		font-family: PingFang SC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.26);
		flex-shrink: 0;
	}
	display: flex;
	width: 100%;
	height: 100rpx;
	// overflow-x: scroll;
	margin-top: 30rpx;
	// padding-left: 20rpx;
}
.course-select-box {
	.course-tabs {
		.tabs-item {
			background-color: #ffc8ad;
			border-radius: 20rpx;
			color: #fff;
			padding: 10rpx 30rpx;
			font-size: 27rpx;
		}
		.selectTabs {
			background-color: #fe5e10;
		}
		width: 100%;
		height: 100rpx;
		justify-content: space-around;
	}

	width: 100%;
	min-height: 400rpx;
	background-color: #fff;
	overflow-x: hidden;
	border-radius: 30rpx;
	box-shadow: 0px 0px 15rpx 15rpx #eee;
	overflow: hidden;
}
</style>
