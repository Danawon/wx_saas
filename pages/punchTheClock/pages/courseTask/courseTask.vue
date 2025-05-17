<template>
	<view>
		<head-nav
			title="课程任务"
			:goBack="!type"
			:goIndex="type"
		></head-nav>
		<view class="content pad20">
			<view class="task-info flex-row flex-a">
				<view class="bom-img">
					<u--image
						:showLoading="true"
						:src="courseInfo.info.product.image"
						width="100%"
						height="210rpx"
						radius="20rpx"
					></u--image>
				</view>
				<view class="bom-rInfo  flex-col">
					<view class="card-title text-elpis">
						{{ courseInfo.info.product.title || '' }}
					</view>
					<view class="card-residueDays text-elpis ">
						课程剩余天数：{{
							courseInfo.info.shenday || '0'
						}}天
					</view>
					<!-- 进度 -->
					<view class="card-schedule text-elpis">
						<text>当前进度：</text>
						<text>
							已上课{{
								courseInfo.progress.status1 || '0'
							}}次
						</text>
						<text class="residue-days">
							剩余{{
								courseInfo.progress.status0 || '0'
							}}次
						</text>
					</view>
					<!-- 激活课程按钮 -->
					<view
						class="activate-btn flex"
						@click="activateFun"
						v-if="courseInfo.info.status == 1"
					>
						激活课程
					</view>
				</view>
			</view>
			<!-- 完成进度 -->
			<view class="progress">
				<view class="progress-tit mar-t40 mar-b40">
					完成进度 {{ courseInfo.progress.status1 || '0' }}/{{
						courseInfo.progress.total || '0'
					}}
				</view>
				<!-- 进度列表 -->
				<view
					class="progress-list "
					v-for="(item, index) in list"
					:key="index"
				>
					<!-- 状态提醒 -->
					<view
						class="stateTips flex"
						v-if="item.lock == 0 && item.status == 0" 
					>
						<view
							class="tips-txt"
							:style="{
								background:
									'url(' +
									baseUrl +
									'clock11.png)',
								'background-size': '100% 100%'
							}"
						></view>
					</view>
					<view class="li-box  ju-bt flex-row flex-a">
						<view class="li-l flex-row flex-a ">
							<view class="l-serial">
								{{ index + 1 }}
							</view>
							<!-- 打卡类型 -->
							<view class="l-type mar-l40">
								<view class="type-tit">
									{{ item.title }}
								</view>
								<view class="type-tips">
									{{ item.abstract || "" }}
								</view>
							</view>
						</view>
						<view class="li-r flex-row flex-a ">
							<view class="r-icon mar-r40">
								<u--image
									v-if="
										item.lock == 0 && 
										item.status != 1
									"
									:showLoading="true"
									:src="baseUrl + 'clock6.png'"
									width="100%"
									height="50rpx"
								></u--image>
								<u--image
									v-if="item.lock == 1"
									:showLoading="true"
									:src="baseUrl + 'clock7.png'"
									width="100%"
									height="50rpx"
								></u--image>
								<u--image
									v-if="item.status == 1"
									:showLoading="true"
									:src="
										baseUrl + 'clock10.png'
									"
									width="100%"
									height="50rpx"
								></u--image>
							</view>
							<view class="r-btn">
								<!-- 打卡分以下两种： -->
								<!-- 饮食打卡 -->
								<!-- 运动课程打卡 -->
								<view
									class="btn-1 btn flex"
									v-if="
										item.lock == 0 &&
										item.status != 1
									"
									@click="
										goRouter(item)
									"
								>
									去打卡
								</view>

								<view
									class="btn-2 btn flex"
									v-if="item.lock == 1"
								>
									待解锁
								</view>
								<view
									class="btn-4 btn-3 btn flex mar-t20"
									v-if="item.status == 1"
									@click="goResult(item)"
								>
									已打卡
									<!-- 是否达标按钮 -->
									<view
										class="if-standards flex"
										v-if="item.scoretime "
									>
										<view
											class="standards-txt txt1"
											v-if="item.score == 'standard'"
										>
											已达标
										</view>
										<view
											class="standards-txt txt2"
											v-if="item.score == 'up_standard'"
										>
											未达标
										</view>
										<view
											class="standards-txt txt2"
											v-if="item.score == 'exceed_quota'"
										>
											超标
										</view>
									</view>
									<view
										class="if-standards flex"
										:class="{'bg-cor': item.score == 'no_score'}"
										v-if="item.score == 'no_score'"
									>
										<view
											class="standards-txt txt2 text3"
										>
											未评分
										</view>

									</view>
								</view>
							</view>
						</view>
					</view>
					<u-line margin="40rpx 0"></u-line>
				</view>
			</view>
		</view>

		<modalTips
			:modalShow="modalShow"
			@parentConfirm="parentConfirm"
			@parentCancel="parentCancel"
			cancelColor="color: rgba(0,0,0,0.9000);"
			confirmColor="#FE5E10"
			confirmText="激活"
			cancelText="我再想想"
		>
			<view class="slot-content pad-b40">
				激活课程后，即可开始上课，并计算课程时间，该课程时间为{{ courseInfo.info.shenday }}天
			</view>
		</modalTips>
	</view>
</template>


<script >
import { baseUrl } from '@/utils/baseUrl.js';
// modal提示组件
import modalTips from '@/components/modalTips/modalTips.vue';
import { getCourseInfo, activateCourses, getCoursePageList } from '@/api/clockIn.js';
export default {
	components: {
		modalTips
	},
	data() {
		return {
			baseUrl: baseUrl,
			// modal组件状态
			modalShow: false,
			type: '', // 是否是支付成功跳转
			courseId: '', // 课程id
			// 课程信息
			courseInfo: {},
			// 当前页
			current: 1,
			list: [], // 任务列表
		};
	},
	onLoad(eve) {
		this.type = eve.type ?? '';
		this.courseId = eve.id;
	},
	onShow() {
		this.getCourseInfo();
		this.current = 1;
		this.list = [];
		this.getCoursePageListFun();
	},
	onReachBottom() {
		this.current ++ 
		this.getCoursePageListFun();
	},
	methods: {
		/* 获取任务列表 */
		getCoursePageListFun() {
			getCoursePageList({
				id: this.courseId,
				list_rows: 20,
				page: this.current,
			}).then(res => {
				this.list = [...this.list, ...res.data.data]
			})
		},
		// 查看分析结果
		goResult(eve) {
			if(this.courseInfo.info.product_type == "nutrition_punch") { // 饮食打卡 查看分析
				uni.navigateTo({
					url: `/pages/punchTheClock/pages/nutritionResults/nutritionResults?taskId=${eve.task_id}`
				})
			}else{
				uni.navigateTo({
					url: `/pages/punchTheClock/pages/punchCardResult/punchCardResult?id=${eve.task_id}`
				})
			}
		},
		// 获取课程内容
		getCourseInfo() {
			getCourseInfo({
				id: this.courseId
			}).then(res => {
				this.courseInfo = res.data;
			});
		},
		// 跳转页面
		goRouter(item) {
			if(item.lock == 0 && item.status == 0 ) {
				uni.showToast({
					title: "教练正在为您制定计划请耐心等待~",
					icon: "none"
				})
				return
			}
			if (this.courseInfo.info.product_type == "nutrition_punch") { // 饮食打卡
				uni.navigateTo({
					url:
						`/pages/punchTheClock/pages/dietCourseDetail/dietCourseDetail?id=${item.task_id}`
				});
			} else if(this.courseInfo.info.product_type == 'aerobic_punch'){ // 有氧打卡
				uni.navigateTo({
					url:
						`/pages/punchTheClock/pages/courseDetails/courseDetails?id=${item.task_id}`
				});
			}
		},
		// modal组件触发确定
		parentConfirm() {
			activateCourses({
				id: this.courseId
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				this.getCourseInfo();
				this.current = 1;
				this.list = [];
				this.getCoursePageListFun();
			})
			this.modalShow = !this.modalShow;
		},
		// modal组件触发取消
		parentCancel() {
			this.modalShow = !this.modalShow;
		},
		// 点击激活课程
		activateFun() {
			this.modalShow = !this.modalShow;
		}
	}
};
</script>

<style lang="scss" scoped>
	.mar-t10 {
		margin-top: 10rpx;
	}
.slot-content {
	line-height: 50rpx;
	font-size: 33rpx;
	color: rgba(0, 0, 0, 0.6);
	text-align: center;
}
.activate-btn {
	background-color: #fe5e10;
	font-size: 30rpx;
	color: #fff;
	border-radius: 40rpx;
	// width: 150rpx;
	height: 60rpx;
	margin-top: 10rpx;
}
.progress {
	.progress-list {
		.stateTips {
			.tips-txt {
				width: 80%;
				height: 100%;
			}
			width: 100%;
			height: 50rpx;
			position: absolute;
			bottom: -23rpx;
			left: 0;
		}
		.li-r {
		
			.r-btn {
				.btn-4 {
					border: 1px solid #fe5e10;
					color: #fe5e10;
					position: relative;
					.bg-cor {
						background-color:  #f9c021 !important;
					}
					.if-standards {
						
						.txt2 {
							color: #f43333;
						}
						.txt1 {
							color: #0dbc14;
						}
						.text3 {
							color: #fff,
						}
						.standards-txt {
							font-size: 22rpx;
						}
						position: absolute;
						bottom: -35rpx;
						left: 50%;
						transform: translateX(-50%);
						width: 85rpx;
						height: 35rpx;
						background-color: #fff;
						box-shadow: 0px 8rpx 8rpx 1px
							rgba(0, 0, 0, 0.25);
					}
				}
				.btn-2 {
					color: #fff;
					background-color: #0dbc14;
				}
				.btn-1 {
					color: #fff;
					background-color: #fe5e10;
				}
				.btn {
					font-size: 28rpx;
					width: 160rpx;
					height: 65rpx;
					border-radius: 40rpx;
				}
			}
			.r-icon {
				width: 50rpx;
			}

			// position: relative;
			width: 40%;
			// background-color: #eee;
		}
		.li-l {
			.type-tips {
				font-weight: 400;
				color: rgba(0, 0, 0, 0.41);
				font-size: 27rpx;
				margin-top: 15rpx;
			}
			.l-type {
				font-weight: 600;
				color: rgba(0, 0, 0, 0.9);
				font-size: 33rpx;
			}
			.l-serial {
				font-size: 40rpx;
				font-family: YouSheBiaoTiHei-Regular,
					YouSheBiaoTiHei;
				font-weight: bold;
				color: rgba(0, 0, 0, 0.6);
			}
			width: 45%;
			// background-color: #f99;
		}
		width: 100%;
		position: relative;
	}
	.progress-tit {
		font-weight: bold;
		font-size: 35rpx;
		color: rgba(32, 32, 32, 0.9);
	}
}
.task-info {
	.bom-rInfo {
		.card-schedule {
			.residue-days {
				color: #fe5e10;
				margin-left: 10rpx;
			}
		}
		.card-residueDays {
			margin-top: 15rpx;
		}
		.card-activateTime,
		.card-residueDays,
		.card-schedule {
			width: 100%;
			font-weight: 300;
			color: rgba(0, 0, 0, 0.6);
		}
		.card-title {
			font-size: 33rpx;
			font-weight: 600;
			color: rgba(0, 0, 0, 0.9);
		}
		padding: 10rpx 20rpx;
		width: 60%;
		height: 210rpx;
		font-size: 26rpx;
		justify-content: space-between;
	}
	.bom-img {
		width: 40%;
	}
	width: 100%;
	justify-content: space-between;
}
</style>
