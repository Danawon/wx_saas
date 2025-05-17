<template>
	<view>
		<view class="list-box ">
			<view
				class="list-item "
				v-for="(item, index) in listData"
				:key="index"
			>
				<view class="item-li ">
					<view
						class="tit-box flex-row flex-a ju-bt martb40"
					>
						<view class="tit-txt flex-row flex-a">
							<view class="">
								{{ item.tit.titTxt }}
							</view>
							
							<view
								class="showQr marlr20"
								v-if="index == 0 && parentType == 'roleLook'"
								@click="goRouter"
							>
								心电仪器数据采集
							</view>
							
							<view
								class="showQr marlr20"
								v-if="index == 1"
								@click="showModal"
							>
								评估仪二维码
							</view>
							<!-- <view
								class="pdfBtn "
								v-if="index == 1 && healthData.is_examination && apiKey"
							> -->
							<view
								class="pdfBtn "
								v-if="index == 1 && apiKey"
							>
								<navigator id="report" :url="navigatorUrl">
								查看体测报告
								</navigator>
							</view>
							
							
						</view>
						<view class="tit-score">
							{{ item.tit.num }}
						</view>
					</view>
					<view
						v-for="(liItem, liIndex) in item.list"
						:key="liIndex"
						class="li-item "
					>
						<view
							class="gather-box martb20 pad20 flex-a ju-bt"
							v-if="liItem.arr"
						>
							<!-- 左侧信息 -->
							<view
								class="gather-l padtb10 flex-col ju-bt"
							>
								<view
									class="l-topBox flex-row felx-a"
									v-for="(arrItem,arrIndex) in liItem.arr"
									:key="arrIndex"
								>
									<view
										class="top-icon l-icon"
									>
										<image
											:src="
												arrItem.icon
											"
											mode=""
										></image>
									</view>
									<view
										class="top-txt mar-l20"
									>
										{{ arrItem.tit }}
									</view>
								</view>

							</view>
							<!-- 中间上传 -->
							<view >
								<u-upload
									v-if="typesArr.includes(liItem.type)"
									:fileList="getFile(`${liItem.type}File`)"
									@afterRead="afterReadFile"
									@delete="deleteFile"
									:name="liItem.type"
									multiple
									:maxCount="1"
									width="180rpx"
									height="180rpx"
								>
									<view class="up-icon flex">
										<u-icon
											name="plus"
											color="#999999"
											size="45rpx"
										></u-icon>
									</view>
								</u-upload>
							</view>
							
							<!-- 右边输入框 -->
							<view
								class="gather-r flex-col ju-bt flex-a"
							>
								<view
									class="r-bom   "
									v-for="(arrItem,arrIndex) in liItem.arr"
									:key="arrIndex"
									:class="{'select-sty': !arrItem.type}"
								>
									<view 
										class="flex-row flex-a ju-bt" 
										@click="selectAssess(arrItem)" 
										v-if="!arrItem.type"
									>
										<view class="select-txt">
											<text>
												{{ arrItem.val || '请选择'}}
											</text>
										</view>
										<u-icon
											name="arrow-down"
											color="rgba(0,0,0,0.4)"
											size="28rpx"
										></u-icon>
									</view>
									<view v-else class="ipt-box">
										<u-input
											placeholder="手动输入"
											border="none"
											v-model="arrItem.iptVal"
											:customStyle="{
												'background-color': '#F5F5F5',
												height: '60rpx',
											}"
											fontSize="26rpx"
											placeholderStyle="font-size: 22rpx"
											inputAlign="center"
										>
											<template slot="suffix">
												<view class="unit-sty">
													{{ arrItem.unit }}
												</view>
											</template>
										</u-input>
									</view>
								</view>
							</view>
						</view>
						
						<view
							class=" li-item martb20 pad20   flex-row ju-bt flex-a"
							v-else
						>
							<view class="li-l flex-row flex-a" @click="goUserRecord(liIndex)">
								<view class="l-icon">
									<image
										:src="liItem.icon"
										mode=""
									></image>
								</view>
								<view
									class="l-info flex-col ju-bt mar-l20"
								>
									<view class="info-tit">
										{{ liItem.tit }}
									</view>
									<view class="info-num">
										{{ liItem.info }}
									</view>
								</view>
							</view>
							<view class="" v-if="liItem.mode">
								<u-upload
									:fileList="getFile(`${liItem.mode}File`)"
									@afterRead="afterReadFile"
									@delete="deleteFile"
									:name="liItem.mode"
									multiple
									:maxCount="1"
									width="180rpx"
									height="180rpx"
								>
									<view class="up-icon flex">
										<u-icon
											name="plus"
											color="#999999"
											size="45rpx"
										></u-icon>
									</view>
								</u-upload>
							</view>
							<view class="li-r flex">
								<view class="ipt-box">
									<u-input
										placeholder="手动输入"
										border="none"
										v-model="liItem.iptVal"
										:customStyle="{
											'background-color': '#F5F5F5',
											height: '60rpx',
										}"
										fontSize="26rpx"
										placeholderStyle="font-size: 22rpx"
										inputAlign="center"
									>
										<template slot="suffix">
											<view class="unit-sty">
												{{ liItem.unit }}
											</view>
										</template>
									</u-input>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
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

		<view class="fot-btn " v-if="btnState">
			<view class="btn flex" @click="submit">保存</view>
		</view>

		<u-action-sheet
			:actions="assessArr"
			title="评语选择"
			:show="assessShow"
			cancelText="关闭"
			@close="assessShow = false"
			@select="selectAssessItem"
		></u-action-sheet>

		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			title="体测仪二维码"
			confirmText="确定"
			:showCancelButton="false"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentConfirm="modalConfirm"
		>
			<view class="modalTxt pad-b40 flex">
				<u--image
					:showLoading="true"
					:src="qrSrc"
					width="600rpx"
					height="600rpx"
					@click="click"
				></u--image>
			</view>
		</modal-tips>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import { editKeepBody, bodytestQRcode } from '@/api/admin.js';
import modalTips from '@/components/modalTips/modalTips.vue';
export default {
	components: {
		modalTips
	},
	props: {
		healthData: {
			type: Object,
			default: {}
		},
		user_id: {
			type: Number,
			default: ''
		},
		userInfo: {
			type: Object,
			default: {}
		},
		parentType: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			baseUrl: baseUrl,
			modalShow: false,
			qrSrc: '',
			listData: [
				{
					tit: {
						titTxt: '心肺能力数据',
						num: '50分'
					},
					list: [
						{
							icon: `${baseUrl}oxygenation.png`,
							tit: '心肺耐力值',
							info: '',
							iptVal: '',
							unit: ""
						},
						{
							icon: `${baseUrl}vitalCapacity.png`,
							tit: '肺活量',
							info: '2500~5000ml',
							iptVal: '',
							unit: "ml"
						}
					]
				},
				{
					tit: {
						titTxt: '体成分及体态',
						num: '30分'
					},
					list: [
						{
							icon: `${baseUrl}stamina1.png`,
							tit: '体重',
							info: 'KG',
							iptVal: '',
							unit: "KG"
						},
						{
							icon: `${baseUrl}stamina2.png`,
							tit: '体脂',
							info: '%',
							iptVal: '',
							unit: "%"
						},
						{
							icon: `${baseUrl}stamina3.png`,
							tit: 'BMI',
							info: '18.5 ~ 23.9 kg/㎡',
							iptVal: '',
							unit: "kg/㎡"
						},
						{
							icon: `${baseUrl}yaoW.png`,
							tit: '腰围',
							info: '85CM',
							iptVal: '',
							unit: "CM"
						},
						{
							icon: `${baseUrl}stamina5.png`,
							tit: '骨量',
							info: '',
							iptVal: '',
							unit: "KG"
						},
						{
							icon: `${baseUrl}yaoT.png`,
							tit: '腰臀比',
							info: '',
							iptVal: '',
							unit: ""
						},
						{
							icon: `${baseUrl}guG.png`,
							tit: '骨骼肌',
							info: 'KG',
							iptVal: '',
							unit: "KG"
						},
						{
							icon: `${baseUrl}stamina7.png`,
							tit: '肌肉率',
							info: '',
							iptVal: '',
							unit: "%"
						},
						{
							icon: `${baseUrl}stamina8.png`,
							tit: '蛋白质',
							info: '16 ~ 20%',
							iptVal: '',
							unit: "%"
						},
						{
							icon: `${baseUrl}stamina9.png`,
							tit: '体水分',
							info: '<=5.6%',
							iptVal: '',
							unit: "%"
						},
						{
							icon: `${baseUrl}stamina10.png`,
							tit: '内脏脂肪',
							info: '1 ~ 9级',
							iptVal: '',
							unit: "级"
						},
						{
							icon: `${baseUrl}stamina11.png`,
							tit: '基础代谢',
							info: '',
							iptVal: '',
							unit: "kcal"
						},
						{
							icon: `${baseUrl}stamina12.png`,
							tit: '静息心率',
							info: '60 - 100次/分钟',
							iptVal: '',
							unit: "次/分钟"
						},
						{
							icon: `${baseUrl}stamina13.png`,
							tit: '',
							info: '<=420 umol/L',
							type: 'gaodi',
							arr: [
								{
									icon: `${baseUrl}gaoD.png`,
									tit: '高低肩风险',
									val: '低风险',
									id: "low",
								},
								{
									icon: `${baseUrl}oXing.png`,
									tit: 'O型腿风险',
									val: '低风险',
									id: "low",
								}
							]
						},
						{
							icon: `${baseUrl}stamina13.png`,
							tit: '',
							info: '<=420 umol/L',
							type: 'gupen',
							arr: [
								{
									icon: `${baseUrl}stamina16.png`,
									tit: '骨盆前倾',
									val: '低风险',
									id: "low"
								},
								{
									icon: `${baseUrl}stamina17.png`,
									tit: '驼背风险',
									val: '低风险',
									id: "low",
								}
							]
						},
						{
							icon: `${baseUrl}stamina20.png`,
							tit: '左大臂维度',
							info: 'CM',
							iptVal: '',
							unit: "CM"
						},
						{
							icon: `${baseUrl}stamina21.png`,
							tit: '右大臂维度',
							info: 'CM',
							iptVal: '',
							unit: "CM"
						},
						{
							icon: `${baseUrl}stamina22.png`,
							tit: '左大腿维度',
							info: 'CM',
							iptVal: '',
							unit: "CM"
						},
						{
							icon: `${baseUrl}stamina23.png`,
							tit: '右大腿维度',
							info: 'CM',
							iptVal: '',
							unit: "CM"
						},
						{
							icon: `${baseUrl}zuoTuiW.png`,
							tit: '左小腿维度',
							info: 'CM',
							iptVal: '',
							unit: "CM"
						},
						{
							icon: `${baseUrl}youW.png`,
							tit: '右小腿维度',
							info: 'CM',
							iptVal: '',
							unit: "CM"
						},
					]
				},

				{
					tit: {
						titTxt: '肌耐力数据',
						num: '10分'
					},
					list: [
						{
							icon: `${baseUrl}stamina25.png`,
							tit: '俯卧撑',
							level: 0,
							info: '',
							iptVal: '',
							unit: "个"
						},
						{
							icon: `${baseUrl}stamina26.png`,
							tit: '深蹲',
							level: 0,
							info: '',
							iptVal: '',
							unit: "个"
						},
						{
							icon: `${baseUrl}stamina27.png`,
							tit: '卷腹',
							info: '',
							iptVal: '',
							unit: "个"
						}
					]
				},
				{
					tit: {
						titTxt: '平衡 / 敏捷 / 柔韧性',
						num: '10分'
					},
					list: [
						{
							icon: `${baseUrl}healthBalance.png`,
							tit: '平衡能力',
							info: '1-5级',
							iptVal: '',
							unit: "级"
						},
						{
							icon: `${baseUrl}agility.png`,
							tit: '敏捷性',
							info: '200-300ms',
							iptVal: '',
							unit: "ms"
						},
						{
							icon: `${baseUrl}LorRQu.png`,
							tit: '左右肩屈',
							info: '120°~180°',
							mode: "LorRQu",
							level: 0,
							iptVal: '',
							unit: "度"
						},
						{
							icon: `${baseUrl}LorRShen.png`,
							tit: '左右肩伸',
							info: '39°~50°',
							mode: "LorRShen",
							level: 0,
							iptVal: '',
							unit: "度"
						},
						{
							icon: `${baseUrl}leftZhiTai.png`,
							tit: '左直腿抬高',
							info: '70°~90°',
							mode: "leftZhiTai",
							level: 0,
							iptVal: '',
							unit: "度"
						},
						{
							icon: `${baseUrl}rightZhiTai.png`,
							tit: '右直腿抬高',
							info: '70°~90°',
							mode: "rightZhiTai",
							level: 0,
							iptVal: '',
							unit: "度"
						},
						{
							tit: '',
							info: '<=420 umol/L',
							type: 'tmsL',
							arr: [
								{
									icon: `${baseUrl}tms-left.png`,
									tit: '托马斯.左大腿',
									iptVal: '',
									level: 0,
									type: "typeIpt",
									unit: "度"
								},
								{
									icon: `${baseUrl}tms-left.png`,
									tit: '托马斯.左小腿',
									iptVal: '',
									level: 0,
									type: "typeIpt",
									unit: "度"
								}
							]
						},
						{
							tit: '',
							info: '<=420 umol/L',
							type: 'tmsR',
							arr: [
								{
									icon: `${baseUrl}tms-right.png`,
									tit: '托马斯.右大腿',
									iptVal: '',
									level: 0,
									type: "typeIpt",
									unit: "度"
								},
								{
									icon: `${baseUrl}tms-right.png`,
									tit: '托马斯.右小腿',
									iptVal: '',
									level: 0,
									type: "typeIpt",
									unit: "度"
								}
							]
						},
					]
				}
			],
			gaodiFile: [],
			gupenFile: [],
			tmsLFile: [],
			tmsRFile: [],
			LorRQuFile: [],
			LorRShenFile: [],
			leftZhiTaiFile: [],
			rightZhiTaiFile: [],
			
			desc: '', // 反馈
			btnState: true,
			age: '',
			height: '',
			sex: '',
			phone: '',

			selectItem: '', // 选中的评估项
			assessShow: false, // 评估 select show
			assessArr: [
				{
					name: '低风险',
					id: 'low'
				},
				{
					name: '中风险',
					id: 'medium'
				},
				{
					name: '高风险',
					id: 'high'
				}
			],
			navigatorUrl: "",
			// 体测仪 userapikey
			apiKey: "",
			typesArr: ['gaodi','gupen','tmsL', 'tmsR'],
		};
	},
	watch: {
		healthData: {
			handler(newV, oldV) {
				if (this.userInfo.gender == 1) {
					this.listData[1].list[0].info =
						(
							(this.userInfo.height - 80) *
							0.7 *
							0.9
						).toFixed(1) +
						'~' +
						(
							(this.userInfo.height - 80) *
							0.7 *
							1.1
						).toFixed(1) +
						'KG';
					this.listData[1].list[1].info = '13 ~ 17%';
					this.listData[1].list[3].info = '<90CM';
					this.listData[1].list[4].info = '2.5 ~ 3.2kg';
					this.listData[1].list[5].info = '<0.95';
					this.listData[1].list[6].info =  (((this.userInfo.height - 80) * 0.7) * 0.3).toFixed(1) + ' ~ ' +(((this.userInfo.height - 80) * 0.7) * 0.5).toFixed(1) + 'KG'; // 骨骼肌
					this.listData[1].list[7].info = '30 ~ 50%';
					this.listData[1].list[9].info = '50 ~ 65%';
					this.listData[1].list[11].info = 
						parseInt(((9.9 * ((this.userInfo.height - 80) * 0.7)) + (6.25 * this.userInfo.height) - (5 * this.userInfo.age) + 5) * 0.9) + 
					'~' + parseInt(((9.9 * ((this.userInfo.height - 80) * 0.7)) + (6.25 * this.userInfo.height) - (5 * this.userInfo.age) + 5) * 1.1) + 'kcal'; // 基础代谢
					/* 肌耐力数据 */
					this.listData[2].list[0].info = '4 ~ 29个'; // 俯卧撑
					this.listData[2].list[1].info = '7 ~ 49个'; // 深蹲
					this.listData[2].list[2].info = '16 ~ 77'; // 卷腹
					this.listData[0].list[0].info = '17.4-66.3 ml/kg/min'; // 最大摄氧量
				} else {
					this.listData[1].list[0].info =
						(
							(this.userInfo.height - 70) *
							0.6 *
							0.9
						).toFixed(1) +
						'~' +
						(
							(this.userInfo.height - 70) *
							0.6 *
							1.1
						).toFixed(1) +
						'KG';
					this.listData[1].list[1].info = '21 ~ 24%';
					this.listData[1].list[3].info = '<85CM';
					this.listData[1].list[4].info = '1.8 ~ 2.5kg';
					this.listData[1].list[5].info = '<0.83';
					this.listData[1].list[6].info = (((this.userInfo.height - 70) * 0.6) * 0.25).toFixed(1) + ' ~ ' +(((this.userInfo.height - 70) * 0.6) * 0.4).toFixed(1) + 'KG';; // 骨骼肌
					this.listData[1].list[7].info = '25 ~ 40%';
					this.listData[1].list[9].info = '45 ~ 60%';
					this.listData[1].list[11].info = 
						parseInt(((9.9 * ((this.userInfo.height - 70) * 0.6)) + (6.25 * this.userInfo.height) - (5 * this.userInfo.age) - 161) * 0.9) + 
						'~' + parseInt(((9.9 * ((this.userInfo.height - 70) * 0.6)) + (6.25 * this.userInfo.height) - (5 * this.userInfo.age) - 161) * 1.1) + 'kcal'; // 基础代谢
					/* 肌耐力数据 */
					this.listData[2].list[0].info = '1 ~ 21个'; // 俯卧撑
					this.listData[2].list[1].info = '7 ~ 43个'; // 深蹲
					this.listData[2].list[2].info = '8 ~ 68个'; // 卷腹
					this.listData[0].list[0].info = '13.4-56 ml/kg/min'; // 最大摄氧量
				}
				this.getData(this.healthData);
			},
			immediate: true,
			deep: true
		}
	},
	onReady() {
	},
	methods: {
		/* 查看用户心肺功能测试记录 */
		goUserRecord(index) {
			if(!index && this.parentType == 'roleLook') {
				uni.navigateTo({
					url: `/pages/myCenter/pages/testRecord/testRecord?userId=${this.user_id}`
				})
			}
		},
		/* 跳转心电仪数据采集页面 */
		goRouter() {
			uni.navigateTo({
				url: '/pages/admin/pages/cardiopulmonaryDataCollection/cardiopulmonaryDataCollection?uId=' + this.user_id
			})
		},
		/* 获取提测试仪二维码 */
		getBodytestQRcode() {
			bodytestQRcode({
				uid: this.userInfo.id
			}).then(res => {
				this.qrSrc = res.data.url;
			});
		},
		/* 显示modal框 */
		showModal() {
			this.getBodytestQRcode();
			this.modalShow = true;
		},
		/* 点击modal确定 */
		modalConfirm() {
			this.modalShow = false;
		},
		// 选中评估
		selectAssessItem(eve) {
			this.selectItem.val = eve.name;
			this.selectItem.id = eve.id;
		},
		// 选择评估
		selectAssess(item) {
			this.assessShow = true;
			this.selectItem = item;
		},
		editTxt(str) {
			let val = null;
			this.assessArr.map(item => {
				if (item.id == str) {
					val = item.name;
				}
			});
			return val;
		},
		getApiKey(key) {
			this.apiKey = key;
			// this.navigatorUrl = `plugin://hello-plugin/health-report?no=${this.userInfo.authorize_mobile}&apiKey=${encodeURIComponent(this.apiKey || '')}`
		},
		// 获取数据
		getData(eve, gender) {
			let data = Array.isArray(eve) ? {} : eve;
			// 高低肩
			if(data.gd_assess) {
				this.listData[1].list[13].arr[0].val = data.gd_assess
				this.listData[1].list[13].arr[0].id = this.editTxt(data.gd_assess) ?? ''
			}
			// O型腿
			if(data.typeo_assess) {
			this.listData[1].list[13].arr[1].val = data.typeo_assess
			this.listData[1].list[13].arr[1].id = this.editTxt(data.typeo_assess) ?? '';
			}
			// 骨盆前倾
			if(data.pelvis_assess) {
			this.listData[1].list[14].arr[0].val = data.pelvis_assess
			this.listData[1].list[14].arr[0].id = this.editTxt(data.pelvis_assess) ?? '';
			}
			// 驼背风险
			if(data.hunchback_assess) {
			this.listData[1].list[14].arr[1].val = data.hunchback_assess;
			this.listData[1].list[14].arr[1].id = this.editTxt(data.hunchback_assess) ?? '';
			}

			this.btnState = !Array.isArray(eve);
			this.age = data.age;
			this.height = data.height;
			this.sex = data.sex;

			this.phone = data.phone;
			
			this.listData[0].list[0].iptVal = data.oxygen_uptake; // 最大摄氧量
			this.listData[0].list[1].iptVal = data.vitalCapacity; // 肺活量
			this.listData[1].list[0].iptVal = data.weight; // 体重
			this.listData[1].list[1].iptVal = data.fat; // 体脂
			this.listData[1].list[2].iptVal = data.bmi; // BMI
			this.listData[1].list[3].iptVal = data.waist; // 腰围
			this.listData[1].list[4].iptVal = data.bone; // 骨量
			this.listData[1].list[5].iptVal = data.wc; // 腰臀比
			this.listData[1].list[6].iptVal = data.skeletal_muscle; // 骨骼肌
			
			this.listData[1].list[7].iptVal = data.muscle; // 肌肉率
			this.listData[1].list[8].iptVal = data.protein; // 蛋白质
			this.listData[1].list[9].iptVal = data.water; // 体水分
			this.listData[1].list[10].iptVal = data.inFat; // 内脏脂肪
			this.listData[1].list[11].iptVal = data.bmr; // 基础代谢
			this.listData[1].list[12].iptVal = data.restingHeartRate; // 静息心率
			
			this.listData[1].list[13].arr[0].id = data.gd_assess // 高低肩风险
			this.listData[1].list[13].arr[1].id = data.typeo_assess // O型腿风险
			this.listData[1].list[14].arr[0].id = data.pelvis_assess // 骨盆前倾
			this.listData[1].list[14].arr[1].id = data.hunchback_assess // 驼背风险
			// val
			this.listData[1].list[13].arr[0].val = data.gd_assess_text // 高低肩风险
			this.listData[1].list[13].arr[1].val = data.typeo_assess_text // O型腿风险
			this.listData[1].list[14].arr[0].val = data.pelvis_assess_text // 骨盆前倾
			this.listData[1].list[14].arr[1].val = data.hunchback_assess_text // 驼背风险
			this.listData[1].list[15].iptVal = data.left_boom_dimension; // 左大臂维度
			this.listData[1].list[16].iptVal = data.right_boom_dimension; // 右大臂维度
			this.listData[1].list[17].iptVal = data.left_thigh_dimension; // 左大腿维度
			this.listData[1].list[18].iptVal = data.right_thigh_dimension; // 右大腿维度
			this.listData[1].list[19].iptVal = data.left_lower_dimension; // 左小腿维度
			this.listData[1].list[20].iptVal = data.right_lower_dimension; // 右小腿维度
			// 俯卧撑
			this.listData[2].list[0].iptVal = data.push_up_count; 
			this.listData[2].list[0].level = data.push_up_level;
			// 深蹲次数
			this.listData[2].list[1].iptVal = data.squat_count;
			this.listData[2].list[1].level = data.squat_level;
			this.listData[2].list[2].iptVal = data.rolled_abdomen; // 卷腹次数
			this.listData[3].list[0].iptVal = data.balanceAngle; // 平衡能力
			this.listData[3].list[1].iptVal = data.agility; // 敏捷性
			// 左右肩屈
			this.listData[3].list[2].iptVal = data.flexion; 
			this.listData[3].list[2].level = data.flexion_level; 
			this.LorRQuFile = this.transitionStr(data.flexion_image);
			// 左右肩伸
			this.listData[3].list[3].iptVal = data.stretch;
			this.listData[3].list[3].level = data.stretch_level;
			this.LorRShenFile = this.transitionStr(data.stretch_image);
			// 左直腿抬高
			this.listData[3].list[4].iptVal = data.leftLegRaise; 
			this.listData[3].list[4].level = data.leftLegRaise_level; 
			this.leftZhiTaiFile = this.transitionStr(data.leftLegRaise_image);
			// 右直腿抬高
			this.listData[3].list[5].iptVal = data.rightLegRaise; 
			this.listData[3].list[5].level = data.rightLegRaise_level; 
			this.rightZhiTaiFile = this.transitionStr(data.rightLegRaise_image);
			// 托马斯左
			this.listData[3].list[6].arr[0].iptVal = data.thomasLeftThigh; 
			this.listData[3].list[6].arr[0].level = data.thomasLeftThigh_level; 
			this.listData[3].list[6].arr[1].iptVal = data.thomasLeftShank; 
			this.listData[3].list[6].arr[1].level = data.thomasLeftShank_level; 
			this.tmsLFile = this.transitionStr(data.thomasLeftThigh_image);
			// 托马斯右
			this.listData[3].list[7].arr[0].iptVal = data.thomasRightThigh; 
			this.listData[3].list[7].arr[0].level = data.thomasRightThigh_level; 
			this.listData[3].list[7].arr[1].iptVal = data.thomasRightShank; 
			this.listData[3].list[7].arr[1].level = data.thomasRightShank_level; 
			this.tmsRFile = this.transitionStr(data.thomasRightThigh_image);
			this.desc = data.feedback;
			// 高低肩和O型风险图
			this.gaodiFile = this.transitionStr(data.shape_upper_images);
			// 骨盆驼背 风险图
			this.gupenFile = this.transitionStr(data.shape_lower_images); 
			uni.hideLoading();
		},
		transitionStr(data) {
			let arr = [];
			if(data) {
				arr = [{ url: data }]
			}
			return arr;
		},
		// 校验
		verifyFun() {
			let state = false;
			this.listData.forEach((item, index) => {
				item.list.forEach((liItem, liIndex) => {
					if (!liItem.arr) {
						if (
							liItem.iptVal == '' ||
							liItem.iptVal == undefined ||
							liItem.iptVal == null
						) {
							state = true;
						}
					}
				});
			});
			return state;
		},
		// 校验
		submit() {
			editKeepBody({
				gd_assess: this.listData[1].list[13].arr[0].id, // 高低肩风险
				typeo_assess: this.listData[1].list[13].arr[1].id, // O型腿风险
				pelvis_assess: this.listData[1].list[14].arr[0].id, // 骨盆前倾
				hunchback_assess: this.listData[1].list[14].arr[1].id, // 驼背风险
				uid: this.user_id,
				age: this.age,
				height: this.height,
				phone: this.phone,
				sex: this.sex,
				weight: this.listData[1].list[0].iptVal, //  体重
				fat: this.listData[1].list[1].iptVal, // 体质
				bmi: this.listData[1].list[2].iptVal, // BMI
				waist: this.listData[1].list[3].iptVal, // 腰围
				bone: this.listData[1].list[4].iptVal, // 骨量
				wc: this.listData[1].list[5].iptVal, // 腰臀比
				skeletal_muscle: this.listData[1].list[6].iptVal, // 骨骼肌
				muscle: this.listData[1].list[7].iptVal, // 肌肉率
				protein: this.listData[1].list[8].iptVal, // 蛋白质
				water: this.listData[1].list[9].iptVal, // 体水分
				inFat: this.listData[1].list[10].iptVal, // 内脏脂肪
				bmr: this.listData[1].list[11].iptVal, // 基础代谢
				restingHeartRate: this.listData[1].list[12].iptVal, // 静息心率
				left_boom_dimension: this.listData[1].list[15].iptVal, //  左大臂维度
				right_boom_dimension: this.listData[1].list[16].iptVal, // 右大臂维度
				left_thigh_dimension: this.listData[1].list[17].iptVal, // 左大腿维度
				right_thigh_dimension: this.listData[1].list[18].iptVal, // 右大腿维度
				// 左小腿维度
				left_lower_dimension: this.listData[1].list[19].iptVal,
				// 左小腿维度
				right_lower_dimension: this.listData[1].list[20].iptVal,
				maximum_oxygen_uptake: this.listData[0].list[0].iptVal, // 最大摄氧量
				vitalCapacity: this.listData[0].list[1].iptVal, // 肺活量
				push_up_count: this.listData[2].list[0].iptVal, // 俯卧撑
				squat_count: this.listData[2].list[1].iptVal, // 深蹲次数
				rolled_abdomen: this.listData[2].list[2].iptVal, // 卷腹次数
				balanceAngle: this.listData[3].list[0].iptVal, // 平衡能力
				agility: this.listData[3].list[1].iptVal, // 敏捷性

				flexion: this.listData[3].list[2].iptVal, // 左右肩屈
				flexion_image: this.getUrl('LorRQuFile'),
				stretch: this.listData[3].list[3].iptVal, // 左右肩伸
				stretch_image: this.getUrl('LorRShenFile'),
				leftLegRaise: this.listData[3].list[4].iptVal, // 左直腿抬高
				leftLegRaise_image: this.getUrl('leftZhiTaiFile'),
				rightLegRaise: this.listData[3].list[5].iptVal, // 右直腿抬高
				rightLegRaise_image: this.getUrl('rightZhiTaiFile'),
				// 托马斯左
				thomasLeftThigh: this.listData[3].list[6].arr[0].iptVal,
				thomasLeftThigh_image: this.getUrl('tmsLFile'),
				thomasLeftShank: this.listData[3].list[6].arr[1].iptVal,
				thomasLeftShank_image: this.getUrl('tmsLFile'),
				// 托马斯右
				thomasRightThigh: this.listData[3].list[7].arr[0].iptVal,
				thomasRightThigh_image: this.getUrl('tmsRFile'),
				thomasRightShank: this.listData[3].list[7].arr[1].iptVal,
				thomasRightShank_image: this.getUrl('tmsRFile'),
				
				push_up_level: this.listData[2].list[0].level, // 俯卧撑等级
				squat_level: this.listData[2].list[1].level, // 深蹲等级
				flexion_level: this.listData[3].list[2].level, // 左右屈曲等级
				stretch_level: this.listData[3].list[3].level, // 左右伸展等级
				leftLegRaise_level: this.listData[3].list[4].level, // 左直腿抬高等级
				rightLegRaise_level: this.listData[3].list[5].level, // 右直腿抬高等级
				thomasLeftThigh_level: this.listData[3].list[6].arr[0].level, //托马斯左大腿等级
				thomasLeftShank_level: this.listData[3].list[6].arr[1].level, //托马斯左小腿等级
				thomasRightThigh_level: this.listData[3].list[7].arr[0].level, // 托马斯右大腿等级
				thomasRightShank_level: this.listData[3].list[7].arr[1].level, // 托马斯右小腿等级
				feedback: this.desc, // 其他反馈
				shape_upper_images: this.getUrl('gaodiFile'), // 高低肩
				shape_lower_images: this.getUrl('gupenFile') // 骨盆前倾
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					uni.navigateTo({
						url:
							`/pages/myCenter/pages/historyInfo/historyInfo?uid=${this.user_id}`
					});
				}, 1500);
			});
		},
		getUrl(key) {
			let str = ""
			if(this[key].length) {
				str = this[key][0].url
			}
			return str
		},
		//  删除骨盆图片
		deleteGupen(eve) {
			this.gupenFile.splice(eve.index, 1);
		},
		// 新增骨盆图片
		async afterReadGupen(eve) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, 'gupen');
			});
		},
		// 删除高低图片
		deleteFile(eve) {
			this[`${eve.name}File`].splice(eve.index, 1);
		},
		getFile(file) {
			return this[file]
		},
		// 新增高低图片
		async afterReadFile(eve) {
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url, eve.name);
			});
		},
		uploadFilePromise(url, key) {
			let _this = this;
			uni.showLoading({
				title: "上传中..."
			})
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
					image: url,
					type: 'clockin'
				},
				success: res => {
					let data = JSON.parse(res.data);
					if(data.code == 200) {
						_this[`${key}File`].push({
							url: data.data
						});
					}else {
						uni.showToast({
							title: data.msg,
							icon: "none"
						})
					}
				},
				fail: err => {
				},
				complete() {
					uni.hideLoading()
				}
			});
		},
		
	}
};
</script>

<style lang="scss" scoped>
.download-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 0 5px;
}

.download-btn:hover {
  background-color: #45a049;
}

.download-btn:active {
  background-color: #3d8b40;
}
.showQr {
	color: #fff;
	padding: 8rpx 20rpx;
	background-color: #fe5e10;
	font-size: 24rpx;
	border-radius: 14rpx;
}
.pdfBtn {
	border-radius: 14rpx;
	padding: 8rpx 20rpx;
	background-color: #3c9cff;
	font-weight: 400;
	font-size: 24rpx;
	color: #fff;
}
.bluetooth {
	width: 140rpx;
	height: 50rpx;
	background-color: #00b36a;
	border-radius: 30rpx;
	color: #fff;
	font-size: 22rpx;
}
.area-box {
	border: 2px solid #eee;
	border-radius: 10rpx;
}
.tit-box {
	.tit-score {
		font-weight: 400;
		color: #fe5e10;
	}
	.tit-txt {
		font-weight: 500;
		color: rgba(32, 32, 32, 0.9);
		font-weight: 600;
	}
	font-size: 28rpx;
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
.padtb10 {
	padding: 10rpx 0;
}
.list-box {
	.gather-box {
		.gather-l {
			.top-txt {
				font-weight: 400;
				color: #999999;
				font-size: 22rpx;
			}
			.top-icon {
				width: 35rpx;
				height: 40rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			width: 40%;
			height: 180rpx;
		}
		.gather-r {
			.select-sty {
				width: 85%;
				height: 50rpx;
				border: 1px solid #dcdcdc;
				border-radius: 6rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.4);
				font-size: 21rpx;
				padding: 10rpx;
			}
			align-items: flex-end;
			width: 30%;
			height: 180rpx;
		}
		width: 100%;
		box-shadow: 0px 0px 15rpx 0px rgba(0, 0, 0, 0.25);
		border-radius: 10rpx;
	}
	.up-icon {
		width: 180rpx;
		height: 180rpx;
		background-color: #f5f5f5;
	}
	.ipt-box {
		.unit-sty {
			font-size: 22rpx;
			color: #999;
		}
		width: 180rpx;
		height: 60rpx;
	}
	.li-item {
		
		.li-r {
			
			width: 30%;
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
			width: 40%;
		}
		width: 100%;
		border-radius: 10rpx;
		background-color: #fff;
		box-shadow: 0px 0px 15rpx 0px rgba(0, 0, 0, 0.25);
	}
}
</style>
