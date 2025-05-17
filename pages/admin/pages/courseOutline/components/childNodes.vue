<template>
	<view>
		<view class="page pad20">
			<view v-if="!actionList[currentIndex].length" class="add-btn flex martb20" @click="addActionFun">
				添加动作
			</view>
			<view 
				v-for="(actionItem, actionIndex) in actionList[currentIndex]"
				:key="actionIndex">
				<view
					class="box pad20 mar-t20"
				>
					<view class="del-icon" @click="delAction(actionIndex)">
						<u-icon name="close-circle" color="#ccc" size="20"></u-icon>
					</view>
					<view class="flex-a ju-bt pad-t20 pad-b20">
						<text>名称</text>
						<view class="ipt-box">
							<u-input
								v-model="actionItem.title"
								placeholder="请输入 "
								border="none"
							></u-input>
						</view>
					</view>
					<u-line></u-line>
					<view class="flex-row flex-a ju-bt">
						<view class="name pad-t20 pad-b20">
							注意事项
						</view>
						<view 
							class="add-group flex padlr20"
							@click="onTips(actionItem.motion_tips, actionIndex)"
							:class="{existTip : actionItem.motion_tips}"
						>
							{{ actionItem.motion_tips ? '修改注意事项' : '输入注意事项' }}
						</view>
					</view>
					<u-line></u-line>
					<view class="flex-a ju-bt pad-t20 pad-b20" @click="selectVideo(actionItem, actionIndex)">
						<text>选择视频</text>
						<view class="ipt-box flex-row flex-a" >
							<view class="mar-r20 flex-row flex-a" v-if="actionItem.video_url">
								<view class="reset-btn mar-r20" @click.stop="resetVideoUrl(actionIndex)">
									重置选择
								</view>
								<u--image
									:showLoading="true" 
									:src="baseUrl + 'selectedVideo.png'" 
									width="45rpx" 
									height="40rpx"
								></u--image>
							</view>
							<u-icon
								name="arrow-right"
								:label="actionItem.video_url ? '已选择视频': '请选择'"
								labelPos="left"
								color="#999"
								labelSize="24rpx"
							></u-icon>
						</view>
					</view>
					<u-line></u-line>
					<view class="flex-row flex-a ju-bt">
						<view class="name pad-t20 pad-b20">
							组间休息
						</view>
						<view class="flex padlr20 restBox" >
							<u--input
								fontSize="24rpx"
							    border="surround"
								type="digit"
								inputAlign="center"
							    v-model="actionItem.rest_among"
								suffixIcon="秒"
								:customStyle="{padding: '0 10rpx'}"
								:suffixIconStyle="{fontSize: '22rpx', color: '#999'}"
							  ></u--input>
						</view>
					</view>
					<u-line></u-line>
					<view class="flex-row flex-a ju-bt martb20">
						<view class="radio-box flex-row flex-a">
							<view class="radio-lable">
								动作类型：
							</view>
							<u-radio-group 
							    v-model="actionItem.group_type"
							    placement="row"
								@change="addGroup(actionIndex, actionItem.group_type)"
							>
								<u-radio  name="count"  label="个"></u-radio>
								<u-radio  name="second" :customStyle="{marginLeft: '40rpx'}"  label="秒"></u-radio>
								<u-radio  name="countAndSecond" :customStyle="{marginLeft: '40rpx'}"  label="秒*个"></u-radio>
							</u-radio-group>
						</view>
						<view class="add-groupBox">
							<view
								class="add-group flex  "
								@click="addGroup(actionIndex, actionItem.group_type)"
							>
								添加组数
							</view>
						</view>
					</view>
					<view
						class="flex-a ju-bt pad-t20 pad-b20"
						v-for="(item, index) in actionItem.action_group_json"
						:key="index"
					>
						<view class="exercise-info flex-a ">
							<view class="serial flex mar-r20">
								{{ index + 1 }}
							</view>
							<view 
								class="info-block" 
								v-if="item.load" 
								@click="editSelectedGroup(item, index, actionIndex,'load')"
							>
								重量：{{ item.load || 0 }}KG
							</view>
							<view 
								class="info-block" 
								v-if="item.type == 'second' || item.type == 'countAndSecond'"
								@click="editSelectedGroup(item, index, actionIndex,'second')"
							>
								时长：{{ item.second || 0 }} 秒
							</view>
							<view 
								class="info-block" 
								v-if="item.type == 'count'  || item.type == 'countAndSecond'"
								@click="editSelectedGroup(item, index, actionIndex,'num')"
							>
								个数：{{ item.num || 0 }}
							</view>
						</view>
						<view
							class="exercise-del ipt-box"
							@click="delGroup(actionIndex,index)"
						>
							<u-icon
								name="trash"
								color="#999"
								size="20"
							></u-icon>
						</view>
					</view>
					<view
						class="flex-a ju-bt pad-t20 pad-b20"
						v-show="addShowIndex === actionIndex"
					>
						<view class="flex-a w75">
							<view class=" input-sty mar-r20 flex">
								<u-input
									fontSize="24rpx"
									placeholder="重量"
									type="digit"
									inputAlign="center"
									v-model="groupLoad"
									color="#fe5e10"
									border="none"
									suffixIcon="kg"
									:suffixIconStyle="{fontSize: '22rpx', color: '#999'}"
								></u-input>
							</view>
							<view class=" input-sty mar-r20 flex" v-if="groupType == 'second' || groupType == 'countAndSecond'">
								<u-input
									fontSize="24rpx"
									placeholder="秒"
									inputAlign="center"
									color="#fe5e10"
									type="number"
									v-model="groupSecond"
									border="none"
									suffixIcon="秒"
									:suffixIconStyle="{fontSize: '22rpx', color: '#999'}"
								></u-input>
							</view>
							<view 
								class=" input-sty  flex" 
								:class="{'mar-r20': groupType != 'countAndSecond'}" 
								v-if="groupType == 'count' || groupType == 'countAndSecond'">
								<u-input
									fontSize="24rpx"
									placeholder="个数"
									inputAlign="center"
									color="#fe5e10"
									type="number"
									v-model="groupCount"
									border="none"
									suffixIcon="个"
									:suffixIconStyle="{fontSize: '22rpx', color: '#999'}"
								></u-input>
							</view>
						</view>
						<view class="flex-row ju-bt flex-a w25">
							<view 
								class="add-group confirmBtn flex padlr20" 
								@click="addSub"
							>
								确定
							</view>
							<view class="ipt-box" @click="closeGroupAdd">
								<u-icon
									name="trash"
									color="#999"
									size="20"
								></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view v-if="!actionIndex" class="add-btn flex martb20" @click="addActionFun">
					添加动作
				</view>
			</view>
			<u-empty
				v-if="!actionList[currentIndex].length"
				mode="list"
				text="暂无动作哦~"
			></u-empty>
		</view>
		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			:title="selectGroupType ? '编辑数据' : '注意事项'"
			confirmText="确定"
			cancelText="取消"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentCancel="modalCancel"
			@parentConfirm="modalConfirm"
		>
			<view class="modalTxt pad-b40 flex">
				<view class="block" v-if="!selectGroupType">
					<u-textarea
						v-model="modalVal"
						placeholder="请输入注意事项"
					></u-textarea>
				</view>
				<view class="block" v-if="selectGroupType">
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
import { getChildNodeInfo, addAction } from '@/api/admin.js';
// 引入modal组件
import modalTips from '@/components/modalTips/modalTips.vue';
export default {
	components: {
		modalTips
	},
	data() {
		return {
			baseUrl: baseUrl,
			addShowIndex: '', // 当前选中的动作
			groupLoad: '', //负荷
			groupCount: "", // 数量
			groupSecond: "",/* 组数时长 */
			nodeId: '', // 节点id
			actionList: [], // 动作列表
			currentIndex: 0,// 当前选中的类型下标
			data: [],
			groupType: "",/* 组数类型 */
			modalShow: false, // modal show
			modalVal: '', // Modal val
			selectGroupType: "", // 选中group组数 类型
			selectedGroupIndex: '', // 选中的组数下标
		};
	},

	methods: {
		/* 编辑选中组数 */
		editSelectedGroup(item, index,blockIndex, type) {
			/* 显示modal为 编辑组数内容 */
			let block = [
				{type: "load"},
				{type: "second"},
				{type: "num"},
			]
			let gType = block.filter(item => item.type === type);
			/* 选中的模块洗标 */
			this.tipsIndex = blockIndex;
			/* 选中编辑组数类型 */
			this.selectGroupType = gType[0].type;
			/* 选中的组数下标 */
			this.selectedGroupIndex = index;
			this.modalVal = item[gType[0].type];
			this.modalShow = true; 
		},
		/* 重置选中视频 */
		resetVideoUrl(index) {
			this.actionList[this.currentIndex][index].video_url = ''
		},
		/* 点击modal确定 */
		modalConfirm() {
			if(this.selectGroupType) {
				/* 修改组数指定类型数据 */
				this.actionList[this.currentIndex][this.tipsIndex].action_group_json[this.selectedGroupIndex][this.selectGroupType] = this.modalVal;
			}else {
				this.actionList[this.currentIndex][this.tipsIndex].motion_tips = this.modalVal;
			}
			this.modalCancel();
		},
		/* 点击modal取消 */
		modalCancel() {
			this.modalShow = false;
			this.selectGroupType = "";
		},
		/* 选中添加注意事项 */
		onTips(txt, index) {
			this.tipsIndex = index
			this.modalVal = txt;
			this.modalShow = true;
		},
		/* 获取视频url */
		onVideoUrl(e) {
			this.actionList[this.currentIndex][e.index].video_url = e.videoUrl;
		},
		/* 组件初始化 */
		initFun(e) {
			this.groupSecond = ''; // 秒
			this.groupLoad = ''; // 负荷
			this.groupCount = ''; // 数量
			this.addShowIndex = "";
			this.currentIndex = e.index;
			this.nodeId = e.nodeId;
			if(e.status) {
				this.getChildNodeInfoFun(e.data);
			}
		},
		// 删除动作
		delAction(index) {
			this.actionList[this.currentIndex].splice(index , 1);
		},
		// 选择视频
		selectVideo(e, index) {
			uni.navigateTo({
				url: `/pages/myCenter/pages/actionLibrary/actionLibrary?type=selectVideo&index=${index}`
			})
			
		},
		/* 判断数据状态 */
		ifDataState() {
			let bool = false;
			this.actionList.forEach((item, idnex) => {
				item.map(itemK => {
					if(!itemK.action_group_json.length || !itemK.title) {
						bool = true;
					}
				})
			})
			return bool
		},
		// 提交
		submitFun() {
			if(this.ifDataState()) {
				uni.showToast({
					title: "请输入完整内容后保存！",
					icon: "none"
				})
				return
			}
			/* 深拷贝 */
			let arr = JSON.parse(JSON.stringify(this.actionList));
			arr.map(item => {
				item.reverse(item)
			})
			addAction({
				course_id: this.nodeId,
				action: arr,
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				this.addShowIndex = ""; // 当前选中的动作
				setTimeout(() => {
					// this.getChildNodeInfoFun();
					uni.navigateBack()
				},1500)
			})
		},
		
		// 添加动作
		addActionFun() {
			this.addShowIndex = '';
			this.groupSecond = ''; // 秒数
			this.groupLoad = ''; // 负荷
			this.groupCount = ''; // 数量
			this.actionList[this.currentIndex].unshift({
				title: '',
				video_url: '',
				motion_tips: "",
				action_group_json: [],
				group_type: "count"
			});
		},
		// 获取大纲 子节点课程详情
		getChildNodeInfoFun(data) {
			this.actionList = [];
			data.map(item => {
				this.actionList.push(item.data)
			})
			this.actionList.map(item => {
				item.reverse()
				item.filter(itemK => {
					// itemK.groupType = 'count';
					itemK.action_group_json = JSON.parse(itemK.action_group_json)
				})
			})
		},
		// 添加组数 输入框显示
		addGroup(index, type) {
			this.groupType = type;
			this.addShowIndex = index; // 当前选中的动作
			let length = this.actionList[this.currentIndex][index].action_group_json.length;
			if(length) {
				this.groupSecond = this.actionList[this.currentIndex][index].action_group_json[length - 1].second; //秒
				this.groupLoad = this.actionList[this.currentIndex][index].action_group_json[length - 1].load; // 负荷
				this.groupCount = this.actionList[this.currentIndex][index].action_group_json[length - 1].num; // 数量
			}else {
				this.groupSecond = '';
				this.groupLoad = '';
				this.groupCount = '';
			}
		},
		showToast(tit) {
			uni.showToast({
				title: tit,
				icon: "error"
			});
		},
		//确定组数输入框
		addSub() {
			if(this.groupType == 'count' && !this.groupCount) {
				this.showToast("请输入个数");
				return;
			}
			if(this.groupType == 'second' && !this.groupSecond) {
				this.showToast("请输入秒数");
				return;
			}
			if (this.groupType == 'countAndSecond' && (!this.groupSecond || !this.groupCount)) {
				this.showToast("请输入个数和秒数");
				return;
			}
			this.actionList[this.currentIndex][this.addShowIndex].action_group_json.push({
				load: this.groupLoad,
				num: this.groupType == 'second' ? '' : this.groupCount,
				second: this.groupType == 'count' ? '' :  this.groupSecond,
				type: this.groupType,
			});
		},
		//删除组数
		delGroup(actionIndex, index) {
			this.actionList[this.currentIndex][actionIndex].action_group_json.splice(index, 1)
		},
		/* 删除指定组数 数据 */
		closeGroupAdd() {
			this.groupSecond = ''; // 秒
			this.groupLoad = ''; // 负荷
			this.groupCount = ''; // 数量
			this.addShowIndex = '';
		}
	}
};
</script>

<style lang="scss" scope>
	.modalTxt {
		.block {
			width: 100%;
		}
	}
.reset-btn {
	font-size: 22rpx;
	background-color: #3c9cff;
	border-radius: 6rpx;
	padding: 6rpx 15rpx;
	color: #fff;
}
.exercise-info {
	.serial {
		font-size: 22rpx;
		width: 37rpx;
		height: 37rpx;
		border-radius: 50%;
		border: 1px solid #ccc;
	}
	.info-block {
		width: 28%;
	}
	width: 95%;
	flex-wrap: wrap;
}
.exercise-del {
	width: 5%;
}

.page {
	padding-bottom: 150rpx;
	.btn-box {
		position: fixed;
		bottom: 0rpx;
		left: 0%;
		width: 100%;
		background-color: #fff;
		padding: 10rpx 20rpx 50rpx;
		z-index: 999;
		.bottom-btn {
			width: 100%;
			height: 74rpx;
			color: #fe5e10;
			border-radius: 48rpx;
			border: 1rpx solid #fe5e10;
			font-size: 32rpx;
		}
	}
	.add-btn {
		height: 80rpx;
		background: #fe5e10;
		border-radius: 8rpx;
		color: #fff;
		font-size: 28rpx;
	}

	.box {
		.restBox {
			width: 180rpx;
		}
		font-size: 26rpx;
		.del-icon {
			z-index: 99;
			position: absolute;
			right: 10rpx;
			top: 10rpx;
		}
		box-shadow: 1px 1px 15rpx 1rpx #eee;
		font-size: 28rpx;
		border-radius: 20rpx;
		position: relative;
		.radio-box {
			width: 80%;
		} 
		.add-groupBox {
			width: 20%;
			
		}
		.add-group {
			height: 50rpx;
			color: #fff;
			font-size: 22rpx;
			border-radius: 8rpx;
			background-color: #3c9cff;
		}
		.existTip {
			background-color: #fe5e10 ;
		}
		.input-sty {
			font-size: 24rpx;
			border-radius: 8rpx;
			width: 150rpx;
			flex-shrink: 0;
			padding: 0 10rpx;
			box-sizing: border-box;
			border: 1px solid #fe5e10;
		}
		.w75 {
			width: 75%;
			flex-wrap: wrap;
		}
		.w25 {
			width: 25%;
			.confirmBtn {
				height: 45rpx;
			}
		}
		
	}
}
</style>
