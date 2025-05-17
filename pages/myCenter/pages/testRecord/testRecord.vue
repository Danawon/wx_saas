<template>
	<view>
		<head-nav
			title="测试记录"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<!-- 		<view class="head-tab flex-row">
			<view @click="tabChange(0)" class="tab flex" :class="{'selectTab': !currentTab}">
				跑步机
			</view>
			<view @click="tabChange(1)"  class="tab flex" :class="{'selectTab': currentTab}">
				功率车
			</view>
		</view> -->
		<view class="list-box pad20 mar-b20">
			<!-- 跑步机 -->
			<view
				class=""
				v-for="(item, index) in list"
				:key="index"
			>
				<view class="li padtb20 padlr40 mar-b40">
					<view class="date1">
						测试时间： {{ item.datetext }}
					</view>
					<!-- 评估结果 -->
					<view class="result-box record-box flex-row martb20">
						<view class="record-l flex">
							结果分析
						</view>
						<view class="result-r record-r">
							<view
								class="r-result flex-row flex-a"
							>
								<view class="result-val marlr20">
									{{ item.vmax }}
								</view>
								<view class="result-unit">
									ml/kg/min， 等级为：
								</view>
								<view class="result-grade">
									{{ item.level_name }}
								</view>
							</view>
							<view class="remark mar-t20 pad20">
								{{ item.evaluate }}
							</view>
						</view>
					</view>
					<!-- 展开收起模块 -->
					<view class="info-detail" v-if="item.state">
						<!-- 评估记录 -->
						<view
							class="record-box martb20 flex-row ju-bt"
						>
							<view class="record-l flex">
								评估记录
							</view>
							<view class="record-r ">
								<view class="flex-a ju-bt mar-b20">
									<view class="age">
										年龄：{{ item.age }}
									</view>
									<view class="height">
										身高：{{ item.height }}cm
									</view>
									<view class="weight">
										体重：{{ item.weight }}
									</view>
								</view>
								<view
									class="heart mar-b20 flex-a ju-bt"
									v-if="item.type != 'powercar'"
								>
									<view class="">
										结束心率： {{ item.end_heart_rate }}
									</view>
									<view class="">
										平均心率： {{ item.heart_rate }}
									</view>
								</view>
								<view
									class="time flex-a ju-bt"
									v-if="item.type != 'powercar'"
								>
								<view class="">
									运动时间：{{ item.length_time }}分钟
								</view>
								<view class="">
									平均速度： {{ item.avg_speed }}km/h
								</view>
								</view>
							</view>
						</view>

						<!-- 测试数据列表 -->
						<view
							class="record-list"
							v-if="item.type == 'powercar'"
						>
							<view
								class="list-li martb20 flex-row flex-a"
								v-for="(reItem,
								reIndex) in item.list"
								:key="reIndex"
							>
								<view class="serial-box flex">
									<view class="serial flex">
										{{ reIndex + 1 }}
									</view>
								</view>
								<view
									class="record-val flex-row flex-a pad-l20"
								>
									<view class="heart-num val-item">
										心率：{{
											reItem.avg_heart_rate
										}}
									</view>
									<view class="power val-item">
										功率：{{ reItem.power }}
									</view>
									<view class="oxygen val-item">
										摄氧量：{{
											reItem.oxygen_uptake
										}}
									</view>
								</view>
							</view>
						</view>
						<!-- 心电仪数据 收缩压 舒张压等等数据列表 -->
						<u-line></u-line>
						<view class="li-box">
							<view class="li martb20" v-for="(itemE, indexE) in item.e_list" :key="indexE">
								<view class=" flex-row flex-a" >
									<view class="li-tit lable flex" >
										<view class="flex" :class="{'serial_sty' : Number.isInteger(itemE.step_text)}">
											{{ itemE.step_text }}
										</view>
									</view>
									<view class="li-mmhg flex-col flex-a">
										<view class="title">
											收缩压/舒张压
										</view>
										<view class="ipt-box flex-row flex-a">
											<view class="input_sty flex-row flex-a">
												{{ itemE.systolic_pressure }}/{{ itemE.diastolic_pressure }}
											</view>
											<view class="unit">
												mmHg
											</view>
										</view>
									</view>
									<view class="li-oxygen flex-col flex-a ">
										<view class="title">
											血氧饱和度
										</view>
										<view class="ipt-box flex-row flex-a" :class="{colorR: Number(itemE.blood_oxygen) < 95}">
											<view class="input_sty">
												{{ itemE.blood_oxygen }}
											</view>
											<view class="unit">
												%
											</view>
										</view>
									</view>
									<view class="li-ECG flex-col flex-a">
										<view class="title">
											心电图
										</view>
										<view class="ipt-box flex-row flex-a" :class="{colorR: itemE.ecg_text != '正常'}">
											<view class="input_sty" >
												{{ itemE.ecg_text }}
											</view>
											
										</view>
									</view>
								</view>
								<u-line margin="10rpx 0 20rpx 0" v-if="index != list.length-1"></u-line>
							</view>
						</view>
					
						<view class="tips1 martb20">
							看看我在哪里
						</view>
						<view class="tips2">
							心肺能力标准参考图
						</view>
						<!-- 图表模块 -->
						<view class="chart-box mar-b20">
							
							<view class="img-box">
								<image
									v-if="item.sex == 'M'"
									:src="baseUrl + 'man.png'"
									mode=""
								></image>
								<image
									v-if="item.sex == 'F'"
									:src="baseUrl + 'woman.png'"
									mode=""
								></image>
								<view class="coord" :style="{left: 'calc('+ item.coordX +'% - 65rpx)', bottom: 'calc('+ item.coordY +'% - 60rpx)'}">
									<image :src="baseUrl + 'manCoord.png'" mode="" v-if="item.sex == 'M'"></image>
									<image :src="baseUrl + 'womanCoord.png'" mode="" v-if="item.sex == 'F'"></image>
								</view>
							</view>
							<view class="age-box flex-row">
								<view class="age-item">
									29岁以下
								</view>	
								<view class="age-item">
									30-39
								</view>	
								<view class="age-item">
									40-49
								</view>
								<view class="age-item">
									50-59
								</view>	
								<view class="age-item">
									60岁以上
								</view>
							</view>
						</view>
					</view>
					
					<view class="class-btn-box">
						<view
							class="class-unfold flex"
							@click="toggle(item, index)"
						>
							<u-icon
								:name="!item.state ? 'arrow-up' : 'arrow-down'"
								size="28rpx"
							></u-icon>
							<text style="margin-left: 10rpx;">
								{{ !item.state ? '展开' : '收起'}}
							</text>
						</view>
					</view>
				</view>
				<!-- </view> -->
				<!-- 功率车 -->
				<!-- <view class="" v-if="currentTab == 1"> -->
				<view
					class="li padtb20 padlr40 mar-b40"
					v-if="false"
				>
					<view class="date1">
						测试时间： {{ item.datetext }}
					</view>
					<!-- 评估记录 -->
					<view
						class="record-box martb20 flex-row ju-bt"
					>
						<view class="record-l flex">
							评估记录
						</view>
						<view class="record-r ">
							<view class="flex-a ju-bt mar-b20">
								<view class="age">
									年龄：{{ item.age }}
								</view>
								<view class="height">
									身高：{{ item.height }}
								</view>
								<view class="weight">
									体重：{{ item.weight }}
								</view>
							</view>
						</view>
					</view>
					<!-- 测试数据列表 -->
					<view class="record-list">
						<view
							class="list-li martb20 flex-row flex-a"
							v-for="(reItem,
							reIndex) in item.list"
							:key="reIndex"
						>
							<view class="serial-box flex">
								<view class="serial flex">
									{{ reIndex + 1 }}
								</view>
							</view>
							<view
								class="record-val flex-row flex-a pad-l20"
							>
								<view class="heart-num val-item">
									心率：{{
										reItem.avg_heart_rate
									}}
								</view>
								<view class="power val-item">
									功率：{{ reItem.power }}
								</view>
								<view class="oxygen val-item">
									摄氧量：{{
										reItem.oxygen_uptake
									}}
								</view>
							</view>
						</view>
					</view>
					<!-- 评估结果 -->
					<view class="result-box record-box flex-row">
						<view class="record-l flex">
							评估结果
						</view>
						<view class="result-r record-r">
							<view
								class="r-result flex-row flex-a"
							>
								<view class="result-val marlr20">
									{{ item.vmax }}
								</view>
								<view class="result-unit">
									ml/kg/min， 等级为：
								</view>
								<view class="result-grade">
									{{ item.level_name }}
								</view>
							</view>
							<view class="remark mar-t20 pad20">
								{{ item.evaluate }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
	</view>
</template>

<script>
import { testHistoryRecord } from '@/api/myCenter.js';
import { baseUrl } from '@/utils/baseUrl.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			currentTab: 0,
			list: [],
			curent: 1,
			userId: "", // 用户id
		};
	},
	onLoad(e) {
		this.userId = e.userId ?? '';
		this.getTestHistoryRecord();
	},
	onReachBottom() {
		this.curent++;
		this.getTestHistoryRecord();
	},
	methods: {
		// 切换状态
		toggle(item, index) {
			let data = item;
			data.state = !item.state;
			this.$set(this.list, index, data);
		},
		/* 获取记录 */
		getTestHistoryRecord() {
			testHistoryRecord({
				page: this.curent,
				list_rows: 20,
				uid: this.userId
			}).then(res => {
				this.list = [...this.list, ...res.data.data];
				this.list.forEach((item, index) => {
					if(!item.state) {
						item.state = false;
					}
					this.getCoord(item);
				})
			});
		},
		/* x 坐标 */
		// coordX: 0,
		/* y坐标 */
		// coordY: 0,
		/* 获取坐标 */
		getCoord(item, type) {
			/* x 坐标 :coordX */
			/* y坐标: coordY*/
			/* 获取x轴坐标 */
			if(item.age <= 29) {
				item.coordX = 20
				if(item.sex == 'M') {
					/* 男性 */
					if(item.vmax <= 38.1) {
						
						item.coordY = 16.66
					}else if(item.vmax <= 44.9) {
						
						item.coordY = 16.66 * 2
					}else if(item.vmax <= 50.2) {
						
						item.coordY = 16.66 * 3
					}else if(item.vmax <= 57.1) {
						
						item.coordY = 16.66 * 4
					}else if(item.vmax <= 66.3) {
						
						item.coordY = 16.66 * 5
					}else if(item.vmax > 66.3) {
						
						item.coordY = 16.66 * 6
					}
				}else if(item.sex == 'F') {
					/* 女性 */
					if(item.vmax <= 28.6) {
						
						item.coordY = 16.66
					}else if(item.vmax <= 34.6) {
						
						item.coordY = 16.66 * 2
					}else if(item.vmax <= 40.6) {
						
						item.coordY = 16.66 * 3
					}else if(item.vmax <= 46.5) {
						
						item.coordY = 16.66 * 4
					}else if(item.vmax <= 56) {
						
						item.coordY = 16.66 * 5
					}else if(item.vmax > 56) {
						
						item.coordY = 16.66 * 6
					}
				}
			}else if(item.age >= 30 && item.age <= 39) {
				item.coordX = 40
				if(item.sex == 'M') {
					/* 男性 */
					if(item.vmax <= 34.1) {
						
						item.coordY = 16.66
					}else if(item.vmax <= 39.6) {
						
						item.coordY = 16.66 * 2
					}else if(item.vmax <= 45.2) {
						
						item.coordY = 16.66 * 3
					}else if(item.vmax <= 51.6) {
						
						item.coordY = 16.66 * 4
					}else if(item.vmax <= 59.8) {
						
						item.coordY = 16.66 * 5
					}else if(item.vmax > 59.8) {
						
						item.coordY = 16.66 * 6
					}
				}else if(item.sex == 'F') {
					/* 女性 */
					if(item.vmax <= 24.1) {
						
						item.coordY = 16.66
					}else if(item.vmax <= 28.2) {
						
						item.coordY = 16.66 * 2
					}else if(item.vmax <= 32.2) {
						
						item.coordY = 16.66 * 3
					}else if(item.vmax <= 37.5) {
						
						item.coordY = 16.66 * 4
					}else if(item.vmax <= 45.8) {
						
						item.coordY = 16.66 * 5
					}else if(item.vmax > 45.8) {
						
						item.coordY = 16.66 * 6
					}
				}
			}else if(item.age >= 40 && item.age <= 49) {
				item.coordX = 60
				if(item.sex == 'M') {
					/* 男性 */
					if(item.vmax <= 30.5) {
						
						item.coordY = 16.66
					}else if(item.vmax <= 35.7) {
						
						item.coordY = 16.66 * 2
					}else if(item.vmax <= 40.3) {
						
						item.coordY = 16.66 * 3
					}else if(item.vmax <= 46.7) {
						
						item.coordY = 16.66 * 4
					}else if(item.vmax <= 55.6) {
						
						item.coordY = 16.66 * 5
					}else if(item.vmax > 55.6) {
						
						item.coordY = 16.66 * 6
					}
				}else if(item.sex == 'F') {
					/* 女性 */
					if(item.vmax <= 21.3) {
						
						item.coordY = 16.66
					}else if(item.vmax <= 24.9) {
						
						item.coordY = 16.66 * 2
					}else if(item.vmax <= 28.7) {
						
						item.coordY = 16.66 * 3
					}else if(item.vmax <= 34) {
						
						item.coordY = 16.66 * 4
					}else if(item.vmax <= 41.7) {
						
						item.coordY = 16.66 * 5
					}else if(item.vmax > 41.7) {
						
						item.coordY = 16.66 * 6
					}
				}
			}else if(item.age >= 50 && item.age <= 59) {
				item.coordX = 80;
				if(item.sex == 'M') {
					/* 男性 */
					if(item.vmax <= 26.1) {
						
						item.coordY = 16.66
					}else if(item.vmax <= 30.7) {
						
						item.coordY = 16.66 * 2
					}else if(item.vmax <= 35.1) {
						
						item.coordY = 16.66 * 3
					}else if(item.vmax <= 41.2) {
						
						item.coordY = 16.66 * 4
					}else if(item.vmax <= 50.7) {
						
						item.coordY = 16.66 * 5
					}else if(item.vmax > 50.7) {
						
						item.coordY = 16.66 * 6
					}
				}else if(item.sex == 'F') {
					/* 女性 */
					if(item.vmax <= 19.1) {
						
						item.coordY = 16.66
					}else if(item.vmax <= 21.8) {
						
						item.coordY = 16.66 * 2
					}else if(item.vmax <= 25.2) {
						
						item.coordY = 16.66 * 3
					}else if(item.vmax <= 28.6) {
						
						item.coordY = 16.66 * 4
					}else if(item.vmax <= 35.5) {
						
						item.coordY = 16.66 * 5
					}else if(item.vmax > 35.5) {
						
						item.coordY = 16.66 * 6
					}
				}
			}else if(item.age >= 60) {
				item.coordX = 100
				if(item.sex == 'M') {
					/* 男性 */
					if(item.vmax <= 22.4) {
						
						item.coordY = 16.66
					}else if(item.vmax <= 26.6) {
						
						item.coordY = 16.66 * 2
					}else if(item.vmax <= 30.5) {
						
						item.coordY = 16.66 * 3
					}else if(item.vmax <= 36.1) {
						
						item.coordY = 16.66 * 4
					}else if(item.vmax <= 43) {
						
						item.coordY = 16.66 * 5
					}else if(item.vmax > 43) {
						
						item.coordY = 16.66 * 6
					}
				}else if(item.sex == 'F') {
					/* 女性 */
					if(item.vmax <= 16.5) {
						
						item.coordY = 16.66
					}else if(item.vmax <= 19.6) {
						
						item.coordY = 16.66 * 2
					}else if(item.vmax <= 21.2) {
						
						item.coordY = 16.66 * 3
					}else if(item.vmax <= 24.6) {
						
						item.coordY = 16.66 * 4
					}else if(item.vmax <= 29.4) {
						
						item.coordY = 16.66 * 5
					}else if(item.vmax > 29.4) {
						
						item.coordY = 16.66 * 6
					}
				}
			}
		},
		tabChange(e) {
			this.currentTab = e;
			this.current = 1;
			this.list = [];
			this.getTestHistoryRecord();
		}
	}
};
</script>

<style lang="scss" scoped>
	.colorR {
		color: #be2523 !important;
	}
	.li-box {
		.li {
			box-shadow: none !important;
		}
		/deep/ .u-input {
			padding: 0 !important;
		}
		.serial_sty {
			border: 1px solid #ccc;
			width: 35rpx;
			height: 35rpx;
			border-radius: 50%;
			font-size: 22rpx;
		}
		.unit {
			font-size: 22rpx;
			margin-top: 10rpx;
		}
		.ipt-box {
			.input_sty {
				margin-top: 10rpx;
				font-size: 26rpx;
			}
		}
		.title {
			font-size: 24rpx;
		}
		.lable {
			font-size: 26rpx;
			color: #0e0e0e;
		}
		.li-tit {
			width: 15%;
		}
		.li-mmhg{
			width: 35%;
			padding-left: 15rpx;
			.input_sty {
				width: 65%;
			}
		}
		.li-oxygen {
			width: 28%;
			.input_sty {
				width: 80%;
			}
		}
		.li-ECG {
			.input_sty {
				width: 100%;
			}
			width: 18%;
		}
		width: 100%;
	}
	.class-btn-box {
		.class-unfold,
		.class-close {
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.4);
			font-size: 24rpx;
			justify-content: flex-end;
			height: 40rpx;
		}
	}
	.tips1{
		font-size: 30rpx;
		text-align: center;
	}
	.tips2 {
		font-size: 26rpx;
	}
.chart-box {
	
	box-shadow: 1px 1px 15rpx 10rpx #eee;
	border-radius: 10rpx;
	.age-box {
		padding-left: 40rpx;
		.age-item {
			width: 20%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			margin: 10rpx 0;
		}
	}
	.img-box {
		width: 100%;
		background-color: #ccc;
		height: 400rpx;
		position: relative;
		.coord {
			width: 50rpx;
			height: 50rpx;
			position: absolute;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		image {
			width: 100%;
			height: 100%;
		}
	}
}
.record-list {
	.list-li {
		.serial-box {
			.serial {
				width: 35rpx;
				height: 35rpx;
				border-radius: 50%;
				font-size: 24rpx;
				border: 1px solid #ccc;
				color: #333;
			}
			justify-content: flex-end;
			width: 10%;
		}
		.record-val {
			.val-item {
				width: 33.33%;
				font-size: 28rpx;
			}
			width: 90%;
		}
	}
}
.head-tab {
	.selectTab {
		background-color: #fe5e10 !important;
		color: #fff !important;
	}
	.tab {
		width: 50%;
		height: 70rpx;
		font-size: 24rpx;
		background-color: #ffe6da;
		color: #ffb692;
	}
}
.list-box {
	.li {
		.result-box {
			.result-r {
				.remark {
					font-size: 26rpx;
					background-color: #f2f2f2;
					border-radius: 10rpx;
					padding: 15rpx;
					min-height: 150rpx;
				}
				.result-unit {
					font-size: 26rpx;
				}
				.result-grade {
					color: #06717d;
					font-size: 26rpx;
				}
				.result-val {
					color: #14cc68;
					font-weight: bold;
					font-size: 30rpx;
				}
			}
		}
		.record-box {
			.record-l {
				width: 22%;
				height: 50rpx;
				border-radius: 10rpx;
				background-image: linear-gradient(
					to right,
					#eeb486,
					#e58e4b
				);
				font-size: 26rpx;
				color: #fff;
			}
			.record-r {
				padding-top: 10rpx;
				width: 75%;
				font-size: 26rpx;
			}
		}
		border-radius: 20rpx;
		box-shadow: 1px 1px 10rpx 5rpx #eee;
	}
}
</style>
