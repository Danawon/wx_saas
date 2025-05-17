<template>
	<view>
		<view class="">
			<u-upload
				:fileList="medicalTreatmentImgs"
				@afterRead="afterReadImg"
				@delete="deleteImg"
				name="1"
				multiple
				:maxCount="3"
				width="200rpx"
				height="200rpx"
			></u-upload>
		</view>
		<view class="list-box mar-t40">
			<view
				class="li martb20 pad20 flex-row ju-bt"
				v-for="(item, index) in listData"
				:key="index"
			>
				<view class="li-l flex-row flex-a">
					<view class="l-icon">
						<image :src="item.icon" mode=""></image>
					</view>
					<view class="l-info flex-col ju-bt mar-l40">
						<view class="info-tit">
							{{ item.tit }}
						</view>
						<view class="info-num">
							{{ item.info }}
						</view>
					</view>
				</view>
				
				<view class="li-r flex">
					<view class="ipt-box">
						<u-input
							placeholder="手动输入"
							border="none"
							v-model="item.iptVal"
							:customStyle="{
								'background-color': '#F5F5F5',
								height: '60rpx'
							}"
							type="digit"
							inputAlign="center"
							fontSize="26rpx"
							placeholderStyle="font-size: 22rpx"
						></u-input>
					</view>
				</view>
			</view>
		</view>
		<view class="tips martb40">
			<view class="">
				本医疗数据仅做记录使用！
			</view>
			<view class="mar-t20">
				不做为诊断参考，如需诊断请到专业医疗机构
			</view>
		</view>
		<view class="line"></view>
		<!-- area -->
		<view class="area-box">
			<u-textarea
				v-model="desc"
				border="none"
				placeholder="其他反馈"
				height="140rpx"
				maxlength="-1"
			></u-textarea>
		</view>
		<view class="fot-btn ">
			<view class="btn flex" @click="onSelectShow">提交</view>
		</view>
		<u-popup :show="selectShow" @close="selectShow = false" :round="10">
			<view class="pad20">
				<view class="flex f-bold">
					选择保存信息
				</view>
				<view class="mar-t20">
					<u--form :model="form" ref="uForm" :labelStyle="{fontSize: '24rpx'}" labelWidth="100">
						<u-form-item label="体检时间" prop="time">
							<view class="" @click="timeShow = true">
								<u-input v-model="form.time" readonly placeholder="请选择" />
							</view>
						</u-form-item>
						<u-form-item label="体侧记录日期" prop="locationTxt">
							<view class="" @click="pickerShow = true">
								<u-input v-model="form.locationTxt" readonly  placeholder="请选择" />
							</view>
						</u-form-item>
					</u--form>
				</view>
			</view>
			<view class="fot-btn pad20">
				<view class="btn flex" @click="formSubmit">
					保存
				</view>
			</view>
		</u-popup>
		<u-datetime-picker
			:show="timeShow"
			v-model="form.time"
			mode="date"
			title="体检时间"
			@close="timeShow = false"
			@confirm="timeConfirm"
			@cancel="timeShow = false"
		></u-datetime-picker>
		<u-picker
			title="选择记录" 
			:show="pickerShow" 
			:columns="columns"
			keyName="name"
			@close="pickerShow = false"
			@cancel="pickerShow = false"
			@confirm="pickerConfirm"
		></u-picker>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import { editUserMedical, bodytest_record } from "@/api/admin.js"
import { timestampToTime } from "@/utils/util.js"
export default {
	props: {
		user_id: {
			type: Number,
			default: ""
		},
		medicalData: {
			type: Object,
			default: {}
		},
	},
	data() {
		return {
			timeShow: false,
			pickerShow: false,
			columns: [
			],
			form: {
				time: timestampToTime(+new Date() / 1000, 1),
				location: "",
				locationTxt: "",
			},
			rules: {
				time: [
					{
						required: true,
						message: '请选择体检时间',
						trigger: ['blur', 'change']
					}
				],
				locationTxt: [
					{
						required: true,
						message: '请选择体侧记录日期',
						trigger: ['blur', 'change']
					}
				]
			},
			selectShow: false,
			baseUrl: baseUrl,
			listData: [
				{
					icon: `${baseUrl}health2.png`,
					tit: '收缩压',
					info: '90 - 139mmHg',
					iptVal: ''
				},
				{
					icon: `${baseUrl}health3.png`,
					tit: '舒张压',
					info: '60 - 89mmHg',
					iptVal: ''
				},
				{
					icon: `${baseUrl}health4.png`,
					tit: '总胆固醇',
					info: '≦5.17 mmol/L',
					iptVal: ''
				},
				{
					icon: `${baseUrl}health5.png`,
					tit: '甘油三酯',
					info: '≦1.69 mmol/L',
					iptVal: ''
				},
				{
					icon: `${baseUrl}health6.png`,
					tit: '低密度脂蛋白',
					info: '≦3.36 mmol/L',
					iptVal: ''
				},
				{
					icon: `${baseUrl}health6.png`,
					tit: '高密度脂蛋白',
					info: '≧1.04  mmol/L',
					iptVal: ''
				},
				{
					icon: `${baseUrl}health7.png`,
					tit: '空腹血糖',
					info: '3.9-6.0 mmol/L',
					iptVal: ''
				},
				{
					icon: `${baseUrl}health7.png`,
					tit: '餐后2H血糖',
					info: '≦7.7 mmol/L',
					iptVal: ''
				},
				{
					icon: `${baseUrl}health8.png`,
					tit: '糖化血红蛋白',
					info: '≦5.6%',
					iptVal: ''
				},
				{
					icon: `${baseUrl}health9.png`,
					tit: '尿酸',
					info: '≦420 umol/L',
					iptVal: ''
				},
				{
					icon: `${baseUrl}health9.png`,
					tit: '血氧饱和度',
					info: '90 ~ 99%',
					iptVal: ''
				}
			],
			desc: "", // 反馈
			/* 医疗图片 */
			medicalTreatmentImgs: [],
			
		};
	},
	onReady() {
		//onReady 为uni-app支持的生命周期之一
		this.$refs.uForm.setRules(this.rules)
	},
	watch: {
		medicalData: {
			handler(newV, oldV) {
				this.getMedicalData(newV);
			},
			immediate: true,
			deep: true,
		},
	},
	methods: {
		get_bodytest_record() {
			bodytest_record({
				uid: this.user_id,
			}).then(res => {
				this.columns = [res.data]
			})
		},
		onSelectShow() {
			for(let key in this.form) {
				this.form[key] = ""
			}
			this.form.time = timestampToTime(+new Date() / 1000, 1)
			this.selectShow = true;
		},
		timeConfirm(eve) {
			setTimeout(() => {
				this.form.time = timestampToTime(+new Date(eve.value) / 1000, 1)
			},0)
			this.timeShow = false;
		},
		pickerConfirm(eve) {
			this.form.locationTxt = eve.value[0].name;
			this.form.location = eve.value[0].date;
			this.pickerShow = false;
		},
		formSubmit() {
			this.$refs.uForm.validate().then(res => {
				this.selectShow = false;
				this.confirmFun();
			}).catch(errors => {
				uni.$u.toast('请选择完整数据')
			})
		},
		// 删除 图片
		 deleteImg(eve) {
		 	this.medicalTreatmentImgs.splice(eve.index, 1);
		 },
		 // 新增 图片
		 async afterReadImg(eve) {
		 	// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		 	eve.file.forEach(item => {
		 		this.uploadFilePromise(item.url);
		 	});
		 },
		 // 上传
		 uploadFilePromise(url) {
		 	uni.uploadFile({
		 		url: `${baseUrlApi}upload/file`, // 仅为示例，非真实的接口地址
		 		filePath: url,
		 		name: 'image',
		 		header: {
		 			'Authori-zation':
		 				'Bearer' +
		 				' ' +
		 				uni.getStorageSync('token')
		 		},
		 		formData: {
		 			// image: url,
		 			type: 'clockin'
		 		},
		 		success: res => {
		 			let data = JSON.parse(res.data);
					if(data.code == 200) {
						this.medicalTreatmentImgs.push({ url: data.data });
					}else {
						uni.showToast({
							title: data.msg,
							icon: "none"
						})
					}
		 		},
		 		fail: err => {
		 		}
		 	});
		},
		/* 从父级页面 获取医疗数据 */
		getMedicalData(eve) {
			this.medicalTreatmentImgs = [];
			// 医疗图片
			if(eve.images && eve.images.length) {
				eve.images.forEach(item => {
					this.medicalTreatmentImgs.push({url: item})
				})
			}
			
			this.listData[0].iptVal = eve.systolic_pressure // 收缩压
			this.listData[1].iptVal = eve.diastolic_pressure // 舒张压
			this.listData[2].iptVal = eve.cholesterol // 总胆固醇
			this.listData[3].iptVal = eve.triglyceride // 甘油三酯
			this.listData[4].iptVal = eve.low_density_lipoprotein // 低密度脂蛋白
			this.listData[5].iptVal = eve.high_density_lipoprotein // 高密度脂蛋白
			this.listData[6].iptVal = eve.fasting_blood_glucose // 空腹血糖
			this.listData[7].iptVal = eve.postprandial_glucose // 餐后2H血糖
			this.listData[8].iptVal = eve.glycosylated_hemoglobin // 糖化血红蛋白
			this.listData[9].iptVal = eve.uric_acid // 尿酸
			this.listData[10].iptVal = eve.blood_oxygen // 血氧饱和度
			this.desc = eve.feedback;
			this.get_bodytest_record();
		},
		// 保存 编辑医疗数据
		confirmFun() {
			let imgs = [];
			this.medicalTreatmentImgs.forEach(item => {
				imgs.push(item.url)
			})
			editUserMedical({
				feedback: this.desc,
				systolic_pressure: this.listData[0].iptVal,
				diastolic_pressure: this.listData[1].iptVal,
				cholesterol: this.listData[2].iptVal,
				triglyceride: this.listData[3].iptVal,
				low_density_lipoprotein: this.listData[4].iptVal,
				high_density_lipoprotein: this.listData[5].iptVal,
				fasting_blood_glucose: this.listData[6].iptVal,
				postprandial_glucose: this.listData[7].iptVal,
				glycosylated_hemoglobin: this.listData[8].iptVal,
				uric_acid: this.listData[9].iptVal,
				uid: this.user_id,
				blood_oxygen: this.listData[10].iptVal,
				images: imgs.join(","),
				supplemental_time: this.form.time,
				test_date: this.form.location,
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.$emit("parentGetInfo")
					uni.navigateTo({
						url:
							`/pages/myCenter/pages/historyInfo/historyInfo?uid=${this.user_id}`
					});
				}, 1500);
			})
		},
	},
	options: {
		styleIsolation: 'shared', // 解除样式隔离
	}

};
</script>

<style lang="scss" scoped>
	/deep/ .u-upload__wrap {
		justify-content: center;
	}
	.line {
		background-color: #F9F9F9;
		margin: 20rpx 0 50rpx;
		width: 100%;
		height: 8rpx;
	}
	.tips {
		text-align: center;
		font-weight: 400;
		color: #999999;
		font-size: 26rpx;
	}
.area-box {
	border: 2px solid #eee;
	border-radius: 10rpx;
}
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
/deep/ .u-textarea {
	background-color: #f9f9f9 !important;
}
.list-box {
	.li {
		.li-r {
			.ipt-box {
				width: 180rpx;
				height: 60rpx;
			}
		}
		.li-l {
			.l-info {
				.info-num {
					font-weight: 400;
					color: #999999;
					font-size: 22rpx;
				}
				.info-tit {
					font-weight: 300;
					color: #999999;
					font-size: 22rpx;
				}
				height: 80rpx;
			}
			.l-icon {
				width: 45rpx;
				height: 45rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		width: 100%;
		// height: 100rpx;
		border-radius: 10rpx;
		background-color: #fff;
		box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.25);
	}
}
</style>
