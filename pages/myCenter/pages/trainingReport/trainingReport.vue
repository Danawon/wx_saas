<template>
	<view class="wrap">
		<head-nav
			title="训练报告"
			bgColor="rgba(0,0,0,0)"
			:goBack="true"
			iconC="#fff"
			titColor="#fff"
		></head-nav>
		<view class="head-bg pad20" >
			<view class="head-tab flex-row  ju-bt ">
				<view
					class="tab-li flex-col flex-a  "
					:class="{
						selectTabli: index + 1 == selectTabLiIndex
					}"
					v-for="(item, index) in tabList"
					:key="index"
					@click="tabsChange(index)"
				>
				<view class="">
					{{ item.tit || '' }}
				</view>
				<view class="tit-2-txt" v-if="item.tit2">
					{{ item.tit2 || '' }}
				</view>
				</view>
			</view>
			<view class="head-minute flex">
				<view
					class="minute-bg martb40 flex-col flex-j flex-a"
					:style="
						'background:url(' +
							baseUrl +
							'clock19.png);background-size: 100% 100%;'
					"
				>
					<view class="minute-num flex-col flex-a ">
						<view class="num">{{ reportData.aerobic_time || 0 }}</view>
						<view class="num-txt">分钟</view>
					</view>
					<view class="minute-tit">有效运动</view>
				</view>
			</view>
			<view
				class="info-box flex-row flex-a ju-bt padlr40 padtb20"
			>
				<view class=" info-li flex-col flex-a">
					<view class=" val-sty">{{ reportData.power_count || 0 }}次</view>
					<view class=" tit-sty mar-t20">
						力量训练次数
					</view>
				</view>
				<view class="info-line"></view>
				<view class=" info-li flex-col flex-a">
					<view class=" val-sty">{{ reportData.power_load || 0 }}吨</view>
					<view class=" tit-sty mar-t20">
						力量训练负荷
					</view>
				</view>
				<view class="info-line"></view>
				<view class=" info-li flex-col flex-a">
					<view class=" val-sty">{{ reportData.sport_calorie || 0 }}千卡</view>
					<view class=" tit-sty mar-t20">
						运动卡路里
					</view>
				</view>
			</view>
			<!-- 有氧评语 -->
			<view class="tit mar-t20">有氧评语</view>
			<view class="remark martb20 text-elpis3 pad20">
				{{ reportData.aerobic_evaluation || '' }}
			</view>
			<!-- 力量评语 -->
			<view class="tit mar-t20">力量评语</view>
			<view class="remark martb20 text-elpis3 pad20">
				{{ reportData.strength_evaluation || '' }}
			</view>
		</view>
		<view class="topmar"></view>
		<view class="pad-t40 padlr20" v-if="selectTabLiIndex === 0">
			<view class="tit mar-t20">运动详情</view>
			<u-empty
				v-if="!exerciseList.length"
				mode="list"
				text="暂无数据..."
			></u-empty>
			<view
				class="li-subset flex-row flex-a ju-bt "
				v-for="(subsetItem,
				subsetIndex) in exerciseList"
				:key="subsetIndex"
				@click.stop="onSelectLiChild(subsetItem)"
			>
				<view class="subset-l flex">
					<view class="img-box flex">
						<image
							:src="
								baseUrl + 'exercise.png'
							"
							mode=""
						></image>
					</view>
				</view>
				<view class="subset-r pad-l20">
					<!-- <u-line margin="10rpx  0 "></u-line> -->
					<view
						class="r-top flex-row flex-a ju-bt"
					>
						<view class="top-tit">
							第{{ subsetItem.key }}次运动({{ subsetItem.type_text }})
						</view>
						<view class="top-date">
							{{ subsetItem.createtime }}
						</view>
					</view>
					<view
						class="r-info flex-row flex-a "
					>
						<view
							class="info-km mar-r20 flex-row"
						>
							<view class="km-val">
								{{ subsetItem.calories }}
							</view>
							<view class="km-tit">
								千卡
							</view>
						</view>
						<view class="info-time mar-r20">
							{{ subsetItem.length_time }}
						</view>
						<view
							class="info-Calories mar-r20"
						>
							{{
								(
									subsetItem.distance /
									1000
								).toFixed(2)
							}}公里
							<!-- 100公里 -->
						</view>
						<view class=" mar-r20">
							{{ subsetItem.steps || 0 }}步
						</view>
						<view class="">
							燃脂{{ subsetItem.burn_fat || 0 }}克
						</view>
					</view>
					<u-line margin="20rpx  0 "></u-line>
				</view>
			</view>
		</view>
		<view class=""  v-if="selectTabLiIndex !== 0">
			<view
				v-if="reportData.whereframe.length >= 2"
				class="bodilyForm-comparison padlr20 pad-t40 "
			>
				<view class="tit ">体型对比</view>
				<!-- 时间区间 -->
				<view
					class="interval-box flex-row ju-bt mar-t40 mar-b20"
				>
					<view class="before interval flex">
						{{ reportData.whereframe[0] }}
					</view>
					<view class="after interval flex">
						{{ reportData.whereframe[1] }}
					</view>
				</view>
			</view>
			<!-- 体型对比图 -->
			<view class="unfilled-box flex-row ju-bt padlr20" v-if="!Array.isArray(reportData.bodytest) && reportData.bodytest.old_shape_upper_images && reportData.bodytest.new_shape_upper_images">
				<view
					class="unfilled1 unfilled option"
					:style="
						'background:url('+ reportData.bodytest.old_shape_upper_images +');background-size: 100% 100%;'
					"
				></view>
				<view class="vs flex">vs</view>
				<view
					class="unfilled2 unfilled option"
					:style="
						'background:url('+ reportData.bodytest.new_shape_upper_images +');background-size: 100% 100%;'
					"
				></view>
			</view>
			<!-- 体型评语 -->
			<view class="pad20" v-if="!Array.isArray(reportData.bodytest)">
				<view
					class="remark remark2 martb20 text-elpis3 pad20"
				>
					{{  reportData.shape_evaluation }}
				</view>
			</view>

			<view class="core-contrast padlr20 " v-if="!Array.isArray(reportData.bodytest)">
				<view class="tit ">核心数据对比</view>
				<view
					class="core-img-box flex mar-t40 mar-b20 padlr20"
				>
					<view
						class="core-img"
						:style="
							'background:url(' +
								baseUrl +
								'core4.png);background-size: 100% 100%;'
						"
					></view>
					<!-- 左上臂 -->
					<view class="left-arm posi1 posi flex-row">
						<text class="unitLable">左上臂围</text> 
						{{ reportData.bodytest.test_differ.left_boom_dimension.test_differ }}cm
						<view class="posi-img">
							<u--image
								v-if="reportData.bodytest.test_differ.left_boom_dimension.test_differ < 0"
								:showLoading="true"
								:src="baseUrl + 'godown.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
							<u--image
								v-if="reportData.bodytest.test_differ.left_boom_dimension.test_differ > 0"
								:showLoading="true"
								:src="baseUrl + 'goUp.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
						</view>
					</view>
					<!-- 右上臂 -->
					<view class="right-arm posi2 posi flex-row">
						<text class="unitLable">右上臂围</text>
						{{ reportData.bodytest.test_differ.right_boom_dimension.test_differ }}cm
						<view class="posi-img">
							<u--image
								v-if="reportData.bodytest.test_differ.right_boom_dimension.test_differ < 0"
								:showLoading="true"
								:src="baseUrl + 'godown.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
							<u--image
								v-if="reportData.bodytest.test_differ.right_boom_dimension.test_differ > 0"
								:showLoading="true"
								:src="baseUrl + 'goUp.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
						</view>
					</view>
					<!-- 腰围 -->
					<view class="waistline posi3 posi flex-row">
						<text class="unitLable">腰围</text>
						{{ reportData.bodytest.test_differ.waist.test_differ }}
						cm
						<view class="posi-img">
							<u--image
								v-if="reportData.bodytest.test_differ.waist.test_differ < 0"
								:showLoading="true"
								:src="baseUrl + 'godown.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
							<u--image
								v-if="reportData.bodytest.test_differ.waist.test_differ > 0"
								:showLoading="true"
								:src="baseUrl + 'goUp.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
						</view>
					</view>
					<!-- 左大腿围  -->
					<view class="left-thigh posi4 posi flex-row">
						
						<text class="unitLable">左大腿围</text>
						{{ reportData.bodytest.test_differ.left_thigh_dimension.test_differ }}cm
						<view class="posi-img">
							<u--image
								v-if="reportData.bodytest.test_differ.left_thigh_dimension.test_differ < 0"
								:showLoading="true"
								:src="baseUrl + 'godown.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
							<u--image
								v-if="reportData.bodytest.test_differ.left_thigh_dimension.test_differ > 0"
								:showLoading="true"
								:src="baseUrl + 'goUp.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
						</view>
					</view>
					<!-- 右大腿围  -->
					<view class="left-thigh posi5 posi flex-row">
						<text class="unitLable">右大腿围</text>
						{{ reportData.bodytest.test_differ.right_thigh_dimension.test_differ }}cm
						<view class="posi-img">
							<u--image
								v-if="reportData.bodytest.test_differ.right_thigh_dimension.test_differ < 0"
								:showLoading="true"
								:src="baseUrl + 'godown.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
							<u--image
								v-if="reportData.bodytest.test_differ.right_thigh_dimension.test_differ > 0"
								:showLoading="true"
								:src="baseUrl + 'goUp.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
						</view>
					</view>
					<!-- 左小腿围  -->
					<view class="left-thigh posi6 posi flex-row">
						<text class="unitLable">左小腿围</text>
						{{ reportData.bodytest.test_differ.left_lower_dimension.test_differ }}cm
						<view class="posi-img">
							<u--image
								v-if="reportData.bodytest.test_differ.left_lower_dimension.test_differ < 0"
								:showLoading="true"
								:src="baseUrl + 'godown.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
							<u--image
								v-if="reportData.bodytest.test_differ.left_lower_dimension.test_differ > 0"
								:showLoading="true"
								:src="baseUrl + 'goUp.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
						</view>
					</view>
					<!-- 右小腿围  -->
					<view class="left-thigh posi7 posi flex-row">
						<text class="unitLable">右小腿围</text>
						{{ reportData.bodytest.test_differ.right_lower_dimension.test_differ }}cm
						<view class="posi-img">
							<u--image
								v-if="reportData.bodytest.test_differ.right_lower_dimension.test_differ < 0"
								:showLoading="true"
								:src="baseUrl + 'godown.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
							<u--image
								v-if="reportData.bodytest.test_differ.right_lower_dimension.test_differ > 0"
								:showLoading="true"
								:src="baseUrl + 'goUp.png'"
								width="26rpx"
								height="30rpx"
							></u--image>
						</view>
					</view>
				</view>
			</view>
			<view class="pad20" v-if="!Array.isArray(reportData.bodytest)">
				<view class="list-box mar-t40 flex-row ju-bt">
					<view
						class="li martb20 pad20 flex-row flex-a ju-bt"
						v-for="(item, index) in listData"
						:key="index"
					>
						<view class="li-l flex-row flex-a">
							<view class="l-icon">
								<image
									:src="item.icon"
									mode=""
								></image>
							</view>
							<view
								class="l-info flex-col ju-bt mar-l40"
							>
								<view class="info-tit">
									 {{ item.tit }}
								</view>
								<view
									class="info-num flex-row flex-a"
								>
									{{ item.info }}
									<view class="posi-img">
										<u--image
											v-if="item.state < 0"
											:showLoading="true"
											:src="
												baseUrl +
													'godown.png'
											"
											width="26rpx"
											height="30rpx"
										></u--image>
										<u--image
											v-if="item.state > 0"
											:showLoading="true"
											:src="
												baseUrl + 'goUp.png'
											"
											width="26rpx"
											height="30rpx"
										></u--image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 查看更多 -->
				<view class="more flex martb20">
					<view class="more-icon">
						<u-icon
							name="arrow-left-double"
							color="#939393"
							size="25rpx"
						></u-icon>
					</view>
					<text @click="toggleMore">{{ moreState ? '收起更多' : '展开更多' }}</text>
				</view>
			</view>
			<view class="table-box pad20" >
				<view class="tit ">饮食数据</view>
				<view
					class="table mar-t20"
					v-for="(tbItem, tbIndex) in tableArr"
					:key="index"
				>
					<view
						class="table-tr tab-tr1 flex-row flex-a padlr20"
					>
						<view
							class="tr1 tr1 tr flex-a flex-j"
						></view>
						<view class="tr2 tr1 tr flex-a flex-j">
							达标
						</view>
						<view class="tr3 tr1 tr flex-a flex-j">
							超标
						</view>
						<view class="tr4 tr1 tr flex-a flex-j">
							未达标
						</view>
					</view>
					<view
						class="table-tr flex-row flex-a padlr20"
						v-for="(item, index) in tbItem"
						:key="index"
					>
						<view class="tr2-1 tr flex-a flex-j">
							{{ item.tit }}
						</view>
						<view class="tr2-2 tr flex-a flex-j">
							{{ item.standardsVal }}次
						</view>
						<view class="tr2-3 tr flex-a flex-j">
							{{ item.overproofVal }}次
						</view>
						<view class="tr2-4 tr flex-a flex-j">
							{{ item.notQualifiedVal }}次
						</view>
					</view>
				</view>
			</view>
			<view class="fot-btn pad20 mar-t40">
				<view class="btn flex" @click="generatePosterFun">
					生成图片并分享
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { generateImg, downLoadImg } from "@/common/common.js"
import { 
	getTrainingReport, 
	generatePoster
} from "@/api/myCenter.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			tabList: [
				{ tit: '周报',tit2: '', id:  'weekly', value: ''},
				{ tit: '月报',tit2: '', id:  'monthly', value: ''},
				{ tit: '季报',tit2: '', id:  'quarterly', value: '' },
				{ tit: '年报',tit2: '', id:  'annual', value: ''  }
			],
			// 当前选中tab index
			selectTabLiIndex: 0,
			listData: [
				{
					icon: `${baseUrl}stamina1.png`,
					tit: '体重',
					info: '',
					state: 0,
				},
				{
					icon: `${baseUrl}stamina2.png`,
					tit: '体脂',
					info: '',
					state: 1,
				},
				{
					icon: `${baseUrl}health2.png`,
					tit: '收缩压  ',
					info: '',
					state: 0,
				},
				{
					icon: `${baseUrl}health3.png`,
					tit: '舒张压',
					info: '',
					state: 0,
				},
				{
					icon: `${baseUrl}stamina12.png`,
					tit: '静息心率',
					info: '',
					state: 1,
				},
				{
					icon: `${baseUrl}stamina3.png`,
					tit: 'BMI',
					info: '',
					state: 0,
				},
				{
					icon: `${baseUrl}stamina9.png`,
					tit: '体水分',
					info: '',
					state: 1,
				},
				{
					icon: `${baseUrl}yaoT.png`,
					tit: '腰臀比',
					info: '',
					state: 1,
				},
			],
			// table数据
			tableArr: [
				[
					{
						tit: '食物种类',
						standardsVal: 'x',
						overproofVal: 'x',
						notQualifiedVal: 'x'
					},
					{
						tit: '蔬菜水果',
						standardsVal: 'x',
						overproofVal: 'x',
						notQualifiedVal: 'x'
					},
					{
						tit: '粗粮',
						standardsVal: 'x',
						overproofVal: 'x',
						notQualifiedVal: 'x'
					}
				],
				[
					{
						tit: '油脂',
						standardsVal: 'x',
						overproofVal: 'x',
						notQualifiedVal: 'x'
					},
					{
						tit: '盐',
						standardsVal: 'x',
						overproofVal: 'x',
						notQualifiedVal: 'x'
					},
					{
						tit: '热量',
						standardsVal: 'x',
						overproofVal: 'x',
						notQualifiedVal: 'x'
					}
				]
			],
			tableList1: [],
			// uid
			uid: "",
			reportData: {}, // 报告数据
			moreState: false,
			exerciseList: [], // 周报 运动记录
		};
	},
	onLoad(e) {
		this.uid = e.id;
		if(e.wheretime) {
			this.selectTabLiIndex = 0;
			this.tabList[this.selectTabLiIndex].value = e.wheretime;
			this.tabList[this.selectTabLiIndex].id = "weekly"
		}
		this.getTrainingReportFun();
	},
	onShow() {
		uni.$off("childSelect");
		/* 监听筛选页数据 */
		uni.$on("childSelect", eve => {
			this.selectTabLiIndex = Number(eve.type);
			this.tabList[this.selectTabLiIndex].tit = `${eve.name}`
			this.tabList[this.selectTabLiIndex].value = eve.value
			this.tabList[this.selectTabLiIndex].tit2 = eve.val
			this.getTrainingReportFun();
		})
	},
	methods: {
		/* 选中li child node 跳转查看图表页 */
		onSelectLiChild(e) {
			exerciseChartData({
				id: e.id
			}).then(res => {
				uni.navigateTo({
					url: `/pages/admin/pages/sportsTeacherUser/heartRate/heartRate?data=${encodeURIComponent(
						JSON.stringify(
							{
								aerobic_cylinder: res.data.aerobic_cylinder,
								aerobic_diagram: res.data.aerobic_diagram,
								...res.data.data
							}
						)
					)}`
				});
			})
			
		},
		/* 展开 收起 更多*/
		toggleMore() {
			this.moreState = !this.moreState;
			if(!this.moreState) {
				this.listData.splice(this.listData.length - 7)
			}else {
				this.listData.push(
				...[
					{
						icon: `${baseUrl}stamina11.png`,
						tit: '基础代谢',
						info: Math.abs(this.reportData.bodytest.test_differ.bmr.test_differ),
						state: this.reportData.bodytest.test_differ.bmr.test_differ,
					},	
					{
						icon: `${baseUrl}stamina7.png`,
						tit: '肌肉率',
						info: Math.abs(this.reportData.bodytest.test_differ.muscle.test_differ),
						state: this.reportData.bodytest.test_differ.muscle.test_differ,
					},
					{
						icon: `${baseUrl}yaoW.png`,
						tit: '腰围',
						info: Math.abs(this.reportData.bodytest.test_differ.waist.test_differ),
						state: this.reportData.bodytest.test_differ.waist.test_differ,
					},
					{
						icon: `${baseUrl}stamina5.png`,
						tit: '骨量',
						info: Math.abs(this.reportData.bodytest.test_differ.bone.test_differ),
						state: this.reportData.bodytest.test_differ.bone.test_differ,
					},
					{
						icon: `${baseUrl}guG.png`,
						tit: '骨骼肌',
						info: Math.abs(this.reportData.bodytest.test_differ.skeletal_muscle.test_differ),
						state: this.reportData.bodytest.test_differ.skeletal_muscle.test_differ,
					},
					{
						icon: `${baseUrl}stamina8.png`,
						tit: '蛋白质',
						info: Math.abs(this.reportData.bodytest.test_differ.protein.test_differ),
						state: this.reportData.bodytest.test_differ.protein.test_differ,
					},{
						icon: `${baseUrl}stamina10.png`,
						tit: '内脏脂肪',
						info: Math.abs(this.reportData.bodytest.test_differ.inFat.test_differ),
						state: this.reportData.bodytest.test_differ.inFat.test_differ,
					},
				]
			)
			}
		},
		
		generatePosterFun() {
			generateImg().then(res => {
				generatePoster({
					type: this.selectTabLiIndex ? this.tabList[this.selectTabLiIndex].id : 'monthly',
					wheretime: this.selectTabLiIndex ? this.tabList[this.selectTabLiIndex].value : ''
				}).then(res => {
					downLoadImg(res.data.image)
				})
			})
		},
		
		
		
		/* 获取训练报告 */
		getTrainingReportFun() {
			let status = this.selectTabLiIndex != undefined &&  this.selectTabLiIndex != null
			getTrainingReport({
				type: status ? this.tabList[this.selectTabLiIndex].id : 'monthly',
				wheretime: status ? this.tabList[this.selectTabLiIndex].value : '',
				uid: this.uid || ''
			}).then(res => {
				this.reportData = res.data;
				this.exerciseList = res.data.obvious;
				if(!Array.isArray(res.data.bodytest)) {
					
					/* 体重 */
					this.listData[0].info = Math.abs(res.data.bodytest.test_differ.weight.test_differ);
					this.listData[0].state = res.data.bodytest.test_differ.weight.test_differ;	
					/* 体脂 */
					this.listData[1].info = Math.abs(res.data.bodytest.test_differ.fat.test_differ);
					this.listData[1].state = res.data.bodytest.test_differ.fat.test_differ;
					/* 收缩压   */
					this.listData[2].info = Math.abs(res.data.bodytest.test_differ.systolic_pressure.test_differ);
					this.listData[2].state = res.data.bodytest.test_differ.systolic_pressure.test_differ;
					/* 舒张压 */
					this.listData[3].info = Math.abs(res.data.bodytest.test_differ.diastolic_pressure.test_differ);
					this.listData[3].state = res.data.bodytest.test_differ.diastolic_pressure.test_differ;
					/* 血压 */
					// this.listData[2].info = Math.abs(res.data.bodytest.test_differ.fat.test_differ);
					// this.listData[2].state = res.data.bodytest.test_differ.fat.test_differ;
					/* 心率 */
					this.listData[4].info = Math.abs(res.data.bodytest.test_differ.restingHeartRate.test_differ);
					this.listData[4].state = res.data.bodytest.test_differ.restingHeartRate.test_differ;
					/* BMI */
					this.listData[5].info = Math.abs(res.data.bodytest.test_differ.bmi.test_differ);
					this.listData[5].state = res.data.bodytest.test_differ.bmi.test_differ;	
					/* 体水分 */
					this.listData[6].info = Math.abs(res.data.bodytest.test_differ.water.test_differ);
					this.listData[6].state = res.data.bodytest.test_differ.water.test_differ;	
					/* 腰臀比 */
					this.listData[7].info = Math.abs(res.data.bodytest.test_differ.wc.test_differ);
					this.listData[7].state = res.data.bodytest.test_differ.wc.test_differ;	
				}
				/* 身体年龄 */
				// this.listData[8].info = Math.abs(res.data.bodytest.test_differ.bodyAge.test_differ);
				// this.listData[8].state = res.data.bodytest.test_differ.bodyAge.test_differ;
				
				/* 饮食数据 */
				/* 食物种类 */
				this.tableArr[0][0].standardsVal = res.data.dietary_data.food_type_statistics.standard - 1
				this.tableArr[0][0].overproofVal = res.data.dietary_data.food_type_statistics.exceed_quota - 1 
				this.tableArr[0][0].notQualifiedVal = res.data.dietary_data.food_type_statistics.up_standard - 1
				 /* 蔬菜水果 */
				this.tableArr[0][1].standardsVal = res.data.dietary_data.vegetable_statistics.standard - 1
				this.tableArr[0][1].overproofVal = res.data.dietary_data.vegetable_statistics.exceed_quota - 1 
				this.tableArr[0][1].notQualifiedVal = res.data.dietary_data.vegetable_statistics.up_standard - 1 
				/* 粗粮 */
				this.tableArr[0][2].standardsVal = res.data.dietary_data.coarse_grain_statistics.standard - 1
				this.tableArr[0][2].overproofVal = res.data.dietary_data.coarse_grain_statistics.exceed_quota - 1 
				this.tableArr[0][2].notQualifiedVal = res.data.dietary_data.coarse_grain_statistics.up_standard - 1 	
				/* 油脂 */
				this.tableArr[1][0].standardsVal = res.data.dietary_data.grease_statistics.standard - 1
				this.tableArr[1][0].overproofVal = res.data.dietary_data.grease_statistics.exceed_quota - 1
				this.tableArr[1][0].notQualifiedVal = res.data.dietary_data.grease_statistics.up_standard - 1
				/* 盐 */
				this.tableArr[1][1].standardsVal = res.data.dietary_data.salt_statistics.standard - 1;
				this.tableArr[1][1].overproofVal = res.data.dietary_data.salt_statistics.exceed_quota - 1
				this.tableArr[1][1].notQualifiedVal = res.data.dietary_data.salt_statistics.up_standard - 1
				 /* 热量 */
				this.tableArr[1][2].standardsVal = res.data.dietary_data.calorie_statistics.standard - 1
				this.tableArr[1][2].overproofVal = res.data.dietary_data.calorie_statistics.exceed_quota - 1 
				this.tableArr[1][2].notQualifiedVal = res.data.dietary_data.calorie_statistics.up_standard - 1 
			})
		},
		/* tabs 改变 */
		tabsChange(e) {
			uni.navigateTo({
				url: `/pages/myCenter/pages/trainingReportFilter/trainingReportFilter?type=${e}&uid=${this.uid}`
			})
		},
	},
};
</script>

<style lang="scss" scoped>
	.li-subset {
		// box-shadow: 1px 1px 10rpx 5rpx #eee;
		.subset-l {
			width: 15%;
			height: 100rpx;
			.img-box {
				width: 70rpx;
				height: 70rpx;
				background-color: #fa6626;
				border-radius: 50%;
				image {
					width: 80%;
					height: 80%;
				}
			}
		}
		.subset-r {
			.r-info {
				font-size: 24rpx;
				color: #181818;
				margin-top: 10rpx;
				.info-km {
					.km-val {
						font-size: 30rpx;
						font-weight: bold;
					}
					.km-tit {
						margin-bottom: 3rpx;
						margin-left: 5rpx;
					}
					align-items: flex-end;
				}
			}
	
			.r-top {
				font-size: 24rpx;
				color: #656565;
			}
			width: 85%;
			// height: 100rpx;
		}
	}
	.text-elpis3 {
		overflow: hidden;
			
		text-overflow: ellipsis;
			
		display: -webkit-box;
			
		-webkit-line-clamp: 2;
			
		-webkit-box-orient: vertical;
		width: 100%;
	}
	.topmar {
		margin-top: 1110rpx;
	}

	.unitLable {
		margin-right: 10rpx;
	}
	.fot-btn {
		.btn {
			width: 100%;
			height: 80rpx;
			color: #fff;
			background: #FE5E10;
			border-radius: 40rpx;
			font-size: 32rpx;
		}
	}
.table-box {
	.table {
		.tab-tr1 {
			background: #ffc8ad;
		}
		.table-tr {
			.tr2-1 {
				width: 25%;
				color: rgba(32, 32, 32, 0.9);
			}
			.tr2-2 {
				width: 25%;
				color: rgba(13, 188, 20, 0.9);
			}
			.tr2-3 {
				width: 25%;
				color: #ef0708;
			}
			.tr2-4 {
				width: 25%;
				color: #999999;
			}
			.tr1 {
				color: #fe5e10;
				font-weight: 600;
			}
			.tr {
				width: 25%;
				height: 100%;
				font-size: 28rpx;
			}
			overflow: hidden;
			height: 80rpx;
		}
		box-shadow: 0px 0px 20rpx 0px #c9caca;
		border-radius: 10rpx;
		overflow: hidden;
	}
}
.more {
	.more-icon {
		transform: rotate(-90deg);
		margin-right: 6rpx;
		margin-top: 5rpx;
	}
	font-weight: 400;
	color: #939393;
	font-size: 26rpx;
}
.list-box {
	.li {
		.li-r {
			font-weight: 400;
			color: #fe5e10;
			font-size: 28rpx;
		}
		.li-l {
			.l-info {
				.info-num {
					font-weight: 400;
					color: rgba(32, 32, 32, 0.9);
					font-size: 32rpx;
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
		width: 48%;
		// height: 100rpx;
		border-radius: 10rpx;
		background-color: #fff;
		box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.25);
	}
	flex-wrap: wrap;
}
.posi-img {
	margin-left: 10rpx;
	margin-top: 6rpx;
}
.core-contrast {
	.core-img-box {
		.posi7 {
			right: 40rpx;
			top: 387rpx;
		}
		.posi6 {
			left: 35rpx;
			top: 386rpx;
		}
		.posi5 {
			right: 55rpx;
			top: 323rpx;
		}
		.posi4 {
			left: 35rpx;
			top: 323rpx;
		}
		.posi3 {
			left: 35rpx;
			top: 197rpx;
		}
		.posi2 {
			right: 55rpx;
			top: 106rpx;
		}
		.posi1 {
			left: 35rpx;
			top: 74rpx;
		}
		.posi {
			position: absolute;
			font-weight: 600;
			color: #999;
			font-size: 28rpx;
		}
		.core-img {
			width: 100%;
			height: 530rpx;
		}
		position: relative;
	}

	width: 100%;
}
.remark2 {
	background-color: #f5f5f5 !important;
}
.unfilled-box {
	height: 380rpx;
	position: relative;
	.vs {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		border-radius: 50%;
		width: 80rpx;
		height: 80rpx;
		font-weight: 500;
		color: rgba(32, 32, 32, 0.9);
		font-size: 36rpx;
	}
	.unfilled {
		width: 49%;
		height: 100%;
	}
	.unfilled1 {
		background-color: #8ac43f;
	}
	.unfilled2 {
		background-color: #f99;
	}
}

.wrap {
	padding-bottom: 40rpx;
}

.bodilyForm-comparison {
	.interval-box {
		.interval {
			width: 40%;
			height: 70rpx;
			background: linear-gradient(
				271deg,
				rgba(13, 188, 20, 0.8) 0%,
				#8ac43f 70%
			);
			border-radius: 60rpx 0;
			color: #fff;
		}
	}
}
.tit {
	font-weight: 600;
	color: rgba(32, 32, 32, 0.9);
	font-size: 32rpx;
}
.remark {
	// background: rgba(194, 238, 196, 0.2);
	background: rgba(13, 188, 20, 0.15);
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
	height: 150rpx;
	font-weight: 400;
	color: #999999;
	font-size: 24rpx;
	line-height: 40rpx;
	border-radius: 10rpx;
}
.info-box {
	.tit-sty {
		font-weight: 300;
		color: #202020;
		font-size: 20rpx;
	}
	.val-sty {
		font-weight: 600;
		color: rgba(13, 188, 20, 0.9);
		font-size: 32rpx;
	}
	.info-line {
		background: linear-gradient(
			180deg,
			rgba(13, 188, 20, 0) 0%,
			rgba(13, 188, 20, 0.8) 52%,
			rgba(13, 188, 20, 0) 100%
		);
		border-radius: 45rpx;
		width: 1rpx;
		height: 60rpx;
	}
	.info-li {
		width: 25%;
	}
	width: 100%;
	// height: 200rpx;
	background: rgba(13, 188, 20, 0.15);
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
	border-radius: 10rpx;
	position: relative;
}
.head-minute {
	.minute-bg {
		.minute-tit {
			font-weight: 300;
			color: #ffffff;
			font-size: 20rpx;
		}
		.minute-num {
			.num-txt {
				font-weight: 300;
				color: #fff;
				font-size: 20rpx;
			}
			.num {
				font-weight: bold;
				color: #ffffff;
				font-size: 45rpx;
			}
			margin-bottom: 10rpx;
			margin: 10rpx;
		}
		width: 340rpx;
		height: 340rpx;
	}
}
.head-tab {
	.selectTabli {
		background: rgba(13, 188, 20, 0.9) !important;
		box-shadow: 0px 0px 10px 0px rgba(5, 190, 12, 0.9);
		color: #fff !important;
	}
	.tab-li {
		width: 23%;
		padding: 10rpx 0;
		// height: 62rpx;
		border-radius: 12rpx;
		color: rgba(255, 255, 255, 0.6);
		font-weight: 600;
		font-size: 24rpx;
		background: rgba(13, 188, 20, 0.3);
		border: 1px solid #fff;
		.tit-2-txt {
			margin-top: 10rpx;
		}
	}
	margin-top: 180rpx;
}
/deep/ .u-navbar__content {
	z-index: 99;
}
.head-bg {
	width: 100%;
	// height: 900rpx;
	background: linear-gradient(
		180deg,
		rgba(13, 188, 20, 0.9) 0%,
		rgba(255, 255, 255, 0) 100%
	);
	position: absolute;
	top: 0;
	left: 0;
}
</style>
