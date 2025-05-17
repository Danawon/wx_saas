<template>
	<view class="">
		<head-nav
			title="心电仪数据采集"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="box pad20">
			<view class="content pad20 flex-col flex-a">
				<view class="title mar-t20 mar-b40">
					心肺功能测试心电仪数据采集
				</view>
				<u-line margin="10rpx 0 20rpx 0"></u-line>
				<!-- 安静 -->
				<view class="li-box">
					<view class="li" v-for="(item, index) in list" :key="index">
						<view class=" flex-row flex-a" >
							<view class="li-tit lable flex" >
								<view :class="{'serial_sty' : index && index != list.length - 1, 'flex': index && index != list.length - 1,}">
									{{ item.title }}
								</view>
							</view>
							<view class="li-mmhg flex-col flex-a">
								<view class="title">
									收缩压/舒张压
								</view>
								<view class="ipt-box flex-row flex-a">
									<view class="input_sty flex-row flex-a">
										<u--input
										   v-model="item.shrink"
										   fontSize="26rpx"
										   inputAlign="center"
										   type="number"
										   :disabled="item.disabled"
										 ></u--input>
										 <text>/</text>
										 <u--input
										    v-model="item.diastole"
											fontSize="26rpx"
											inputAlign="center"
											type="number"
											:disabled="item.disabled"
										  ></u--input>
									</view>
									<view class="unit">
										mmHg
									</view>
								</view>
							</view>
							<view class="li-oxygen flex-col flex-a pad-r20">
								<view class="title">
									血氧饱和度
								</view>
								<view class="ipt-box flex-row flex-a">
									<view class="input_sty">
										<u--input
										   v-model="item.oxygen"
										   fontSize="26rpx"
										   inputAlign="center"
										   type="number"
										   :disabled="item.disabled"
										 ></u--input>
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
								<view class="ipt-box flex-row flex-a">
									<view class="input_sty" @click="selectStep(index, item.disabled)">
										<u--input
										   v-model="item.ecg"
										   fontSize="26rpx"
										   disabled
										   :disabledColor="!item.disabled ? '#fff' : '#f5f7fa'"
										   inputAlign="center"
										 ></u--input>
									</view>
									
								</view>
							</view>
						</view>
						<u-line margin="10rpx 0 20rpx 0" v-if="index != list.length-1"></u-line>
					</view>
				</view>
				
				<view class="fot-box flex-col flex-a mar-t20">
					<view class="fot-btn flex martb40" @click="confirm">
						提交
					</view>
					<view class="for-tips">
						说明:每一步数据填写完成，提交一次;测试做到第几步，则提交数据到第几步。
					</view>
				</view>
				<view class="flex mar-t20">
					<view class="w-150">
						<u-button type="primary" text="手动测量" @click="send_blood_pressure_test(0)"></u-button>
					</view>
					<!-- <view class="w-150 mar-l20">
						<u-button type="error" text="结束" @click="send_blood_pressure_test(99)"></u-button>
					</view> -->
				</view>
			</view>
			
		</view>
		<u-action-sheet
			:actions="ecgArr"
			title="心电图类型"
			:show="ecgShow"
			cancelText="关闭"
			@close="ecgShow = false"
			@select="selectEcg"
		></u-action-sheet>
	</view>
</template>

<script>
import { ecgInfoSet } from "@/api/admin.js"
import { send_blood_pressure_test } from '@/api/myCenter.js';
	export default {
		data() {
			return {
				list: [
					{
						step: 0,
						title: '安静:',
						shrink: '', // 收缩压
						diastole: '', // 舒张压
						oxygen: '', // 血氧饱和度
						ecg: '未测试', // 心电图
						ecg_id: "not_tested", // 心电图选中id
						disabled: false,
						index: 0,
					},
					{
						step: 1,
						title: '1',
						shrink: '', // 收缩压
						diastole: '', // 舒张压
						oxygen: '', // 血氧饱和度
						ecg: '未测试', // 心电图
						ecg_id: "not_tested", // 心电图选中id
						disabled: false,
						index: 1,
					},
					{
						step: 2,
						title: '2',
						shrink: '', // 收缩压
						diastole: '', // 舒张压
						oxygen: '', // 血氧饱和度
						ecg: '未测试', // 心电图
						ecg_id: "not_tested", // 心电图选中id
						disabled: false,
						index: 2,
					},
					{
						step: 3,
						title: '3',
						shrink: '', // 收缩压
						diastole: '', // 舒张压
						oxygen: '', // 血氧饱和度
						ecg: '未测试', // 心电图
						ecg_id: "not_tested", // 心电图选中id
						disabled: false,
						index: 3,
					},
					{
						step: 4,
						title: '4',
						shrink: '', // 收缩压
						diastole: '', // 舒张压
						oxygen: '', // 血氧饱和度
						ecg: '未测试', // 心电图
						ecg_id: "not_tested", // 心电图选中id
						disabled: false,
						index: 4,
					},
					{
						step: 99,
						title: '结束后:',
						shrink: '', // 收缩压
						diastole: '', // 舒张压
						oxygen: '', // 血氧饱和度
						ecg: '未测试', // 心电图
						ecg_id: "not_tested", // 心电图选中id
						disabled: false,
						index: 5,
					},
				],
				/* 选中步骤下标 */
				onIndex: "",
				/*  心电图 sheet列表 */
				ecgArr: [
					{
						name:'正常',
						id: 'normal'
					},
					{
						name:'ST段压低',
						id: 'st_below'
					},
					{
						name:'ST段抬高',
						id: 'st_raise'
					},
					{
						name:'心电异常',
						id: 'other_exceptions'
					},
				],
				/* 心电图 sheet 状态 */
				ecgShow: false,
				
			};
		},
		onLoad(e) {
			this.uId = e.uId;
		},
		methods: {
			send_blood_pressure_test(step) {
				send_blood_pressure_test({
					device_id: "",
					step: "",
					uid: this.uId
				}).then(res => {
					uni.showToast({
						title: res.msg,
					})
				})
			},
			/* 选中心电图 */
			selectEcg(e) {
				this.list[this.onIndex].ecg_id = e.id;
				this.list[this.onIndex].ecg = e.name;
			},
			/* 选中心电图 获取选中下标 */
			selectStep(e, disabled) {
				if(disabled) {
					return
				}
				this.ecgShow = true;
				this.onIndex = e;
			},
			/* 点击提交 */
			confirm() {
				let setData = [];
				this.list.map((item, index) => {
					if(!item.disabled) {
						for(let key in item) { 
							// shrink: '', // 收缩压
							// diastole: '', // 舒张压
							// oxygen: '', // 血氧饱和度
							if((item['shrink'] != '' || item['diastole'] != '' || item['oxygen'] != '') && !setData.length) {
								setData = [item]
								return true
							}
							
						}
					}
				})
				if(this.list[this.list.length-1].disabled) {
					uni.showToast({
						title: "已结束！",
						icon: "none",
						duration: 2000
					})
					return
				}
				if(!setData.length) {
					uni.showToast({
						title: "请输入完整的数据！",
						icon: "none",
						duration: 2000
					})
					return
				}
				ecgInfoSet({
					step: setData[0].step,
					systolic_pressure: setData[0].shrink,
					diastolic_pressure: setData[0].diastole,
					ecg: setData[0].ecg_id,
					blood_oxygen: setData[0].oxygen,
					uid: this.uId
				}).then(res => {
					uni.showToast({
						title: res.msg
					})
					this.list[setData[0].index].disabled = true;
					let data  = this.list[setData[0].index];
					for(let key in data) {
						if(data[key] == "" || data[key] == undefined) {
							data[key] = "--"
						}
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
.content {
	.fot-box {
		width: 80%;
		.for-tips {
			line-height: 40rpx;
			color: #565455;
			font-size: 26rpx;
		}
		.fot-btn {
			color: #fff;
			width: 200rpx;
			height: 70rpx;
			font-size: 26rpx;
			border-radius: 15rpx;
			background-color: #eb6100;
		}
	}
	.li-box {
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
		}
		.ipt-box {
			.input_sty {
				margin-top: 10rpx;
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
			width: 40%;
			padding-left: 15rpx;
			.input_sty {
				width: 65%;
			}
		}
		.li-oxygen {
			width: 25%;
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
	.title {
		font-size: 26rpx;
	}
	height: calc(100vh - 130px);
	border-radius: 20rpx;
	box-shadow: 1px 1px 10rpx 10rpx #f1f1f1;
}
</style>
