<template>
	<view>
		<head-nav
			title="门禁权限"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="pad40">
			<view class="ipt-box flex-row flex-a">
				<view class="lable ">
					开始时间：
				</view>
				<view class="ipt" @click="() => {show = true; onType = 'start'}">
					<u--input
						placeholder="请选择开始时间"
						border="none"
						v-model="startTime"
						disabled
						:customStyle="{height: '70rpx', 'padding-left': '30rpx'}"
					  ></u--input>
				</view>
			</view>
			<u-line margin=" 30rpx 0 30rpx">
			</u-line>
			<view class="ipt-box flex-row flex-a">
				<view class="lable ">
					结束时间：
				</view>
				<view class="ipt" @click="() => {show = true; onType = 'end'}">
					<u--input
						placeholder="请选择结束时间"
						border="none"
						v-model="endTime"
						disabled
						:customStyle="{height: '70rpx', 'padding-left': '30rpx'}"
					  ></u--input>
				</view>
			</view>
			<u-line margin=" 30rpx 0 30rpx"></u-line>
		</view>	
		<view class="fot-box" v-if="type !== 'detail'">
			<view class="btn flex" @click="confirmFun">确定</view>
		</view>
		
		   <u-datetime-picker
				:show="show"
				v-model="pickerDate"
				mode="date"
				@close="show = false"
				@cancel="show = false"
				@confirm="pickerConfirm"
			></u-datetime-picker>
	</view>
</template>

<script>
	import { timestampToTime } from "@/utils/util.js"
	import { 
		entrance_authorize_details, 
		entrance_authorize_edit, 
		entrance_authorize_add ,
	} from "@/api/storeApis.js"
	export default {
		data() {
			return {
				endTime: "", 
				startTime: "",
				type: "",
				id: '',
				pickerDate: Number(new Date()),
				show: false,
				onType: "", // 触发按钮
				ids: '', // 新增选中 ids
			};
		},
		onLoad(e) {
			this.id = e.id ?? "";
			this.type = e.type ?? "";
			this.ids = e.ids ?? "";
			if(this.type !== "add") {
				this.getEntranceAuthorizeDetails();
			}
		},
		methods: {
			/* 提交 */
			confirmFun() {
				if(this.type === "edit") {
					this.editFun();
				}else if(this.type === "add") {
					this.addFun();
				}
			},
			/* add */
			addFun() {
				if(!this.startTime || !this.endTime) {
					uni.showToast({
						title: "请选择开始和结束时间！",
						icon: "none",
						mask: true
					})
					return
				}
				entrance_authorize_add({
					uid: this.ids,
					start_time: this.startTime,
					end_time: this.endTime,
				}).then(res => {
					uni.showToast({
						title: res.msg,
						mask: true,
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 2
						})
					},1500)
				})
			},
			/* edit  */
			editFun() {
				entrance_authorize_edit({
					id: this.id,
					start_time: this.startTime,
					end_time: this.endTime,
				}).then(res => {
					uni.showToast({
						title: res.msg,
						mask: true,
					})
				})
			},
			/* 选中日期确定 */
			pickerConfirm(e) {
				let date = timestampToTime(e.value / 1000, 'Y-M-D')
				if(this.onType === "end") {
					this.endTime = date;
				}else {
					this.startTime = date;
				}
				this.show = false;
			},
			/* 获取门禁详情 */
			getEntranceAuthorizeDetails() {
				entrance_authorize_details({
					id: this.id
				}).then(res => {
					this.endTime = res.data.end_time;
					this.startTime = res.data.start_time;
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
.fot-box {
	.btn {
		width: 100%;
		height: 80rpx;
		color: #fff;
		border-radius: 40rpx;
		background-color: #fe5e10;
	}
	padding: 20rpx 20rpx 50rpx;
	position: fixed;
	bottom: 0rpx;
	left: 0;
	width: 100%;
	background-color: #fff;
}
.ipt-box {
		.ipt {
			width: 85%;
			border-radius: 30rpx;
			background: #F5F5F5;
		}
		.lable {
			width: 25%;
		}
	}
</style>
