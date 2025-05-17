<template>
	<!-- 心率检测竖屏 -->
	<view class="box padtb20">
		<view class="head-strength flex-row">
			<view class="strength-1 w25"  v-for="(item, index) in strengthArr" :key="index">
				<view class="strength-child pad-l20 flex-row flex-a" :class="[stageIndex % 3 != 0 ? 'mar-t10' : '']" v-for="(stageItem, stageIndex) in item" :key="stageIndex">
					<view class="strength-img  flex" :class="[stageItem.classN]">
						<image :src="baseUrl + 'exercise.png'" mode=""></image>
					</view>
					<view class="strength-tit  flex" :class="stageItem.classN">
						{{ stageItem.tit }}
					</view>
				</view>
			</view>
			<view class="strength-3 w25 flex-col flex-a" >
				<view class="time martb20">
					{{ newDate }}
				</view>
				<view class="toggle-btn " @click="toggleFun">
					<u-button size="mini" type="primary" text="切换"></u-button>
				</view>
			</view>
			<view class="strength-qr w25 padlr20" >
				<view class="img-box">
					<image :src="qrurl" mode=""></image>
				</view>
			</view>
		</view>
		
		<!-- 实时心率 用户列表 -->
		<view class="user-box flex-row ">
			<view 
				class="li  "
				v-for="(item, index) in userList" 
				:key="index"
				:class="{
					li4: userList.length <= 4, 
					li9: userList.length <= 9 && userList.length > 4,
					li16: userList.length > 9,
				}"
			>
				<view 
					class="li-bg"
					:class="{
						col1: item.background === 'low',
						col2: item.background === 'm_low',
						col3: item.background === 'medium',
						col4: item.background === 'm_high',
						col5: item.background === 'm_high+',
						col6: item.background === 'high',
					}"
				>
					<!-- 用户头像 -->
					<view class="avatar-box flex-col flex-a flex-j h38">
						<view class="avatar flex"
							
						>
							<image 
								class="" 
								:class="{
									img4: userList.length <= 4, 
									img9: userList.length <= 9 && userList.length > 4,
									img16: userList.length > 9,
								}" 
								:src="item.avatar" 
								mode=""
							></image>
						</view>
						<view 
							class="text-elpis"
							:class="{
								'mar-t20': userList.length <= 4,
								'user-name': userList.length <= 9, 
								'userName16': userList.length > 9,
							}" 
						>
							{{ item.nickname }}
						</view>
					</view>
					<!-- 运动数据 -->
					<view 
						class="info-box h33 flex-row"
						:class="{
							size4: userList.length <= 4, 
							size9: userList.length <= 9 && userList.length > 4,
							size16: userList.length > 9,
						}" 
					>
						<view class="info-block flex-row flex-a flex-j" >
							<view 
								class="icon-box"
								:class="{
									infoIcon4: userList.length <= 4, 
									infoIcon9: userList.length <= 9 && userList.length > 4,
									infoIcon16: userList.length > 9,
								}" 
							>
								<image :src="baseUrl + 'calorieIcon.png'" mode=""></image>
							</view>
							<view class="flex-row flex-a">
								<text>{{ item.calorie }}</text>
								<view 
									class=""
									:class="{
										unit4: userList.length <= 4,
										unit9: userList.length <= 9 && userList.length > 4,
										unit16: userList.length > 9,
									}"
								>
									千卡
								</view>
							</view>
						</view>
						<view class="info-block  flex-a flex-j flex-row" >
							<view 
								class="icon-box"
								:class="{
									infoIcon4: userList.length <= 4, 
									infoIcon9: userList.length <= 9 && userList.length > 4,
									infoIcon16: userList.length > 9,
								}" 
							>
								<image :src="baseUrl + 'fatBurningIcon.png'" mode=""></image>
							</view>
							<view class="flex-row flex-a">
								<text>{{ item.burn_fat }}</text>
								<view 
									class=""
									:class="{
										unit4: userList.length <= 4,
										unit9: userList.length <= 9 && userList.length > 4,
										unit16: userList.length > 9,
									}"
								>
									克
								</view>
							</view>
						</view>
						<view class="info-block  flex-a flex-j flex-row" >
							<view 
								class="icon-box"
								:class="{
									infoIcon4: userList.length <= 4, 
									infoIcon9: userList.length <= 9 && userList.length > 4,
									infoIcon16: userList.length > 9,
								}" 
							>
								<image :src="baseUrl + 'timeIcon.png'" mode=""></image>
							</view>
							<view class="">
								{{ item.time }}
							</view>
						</view>
						<view class="info-block  flex-a flex-j flex-row">
							<view 
								class="icon-box"
								:class="{
									infoIcon4: userList.length <= 4, 
									infoIcon9: userList.length <= 9 && userList.length > 4,
									infoIcon16: userList.length > 9,
								}" 
							>
								<image :src="baseUrl + 'proportionIcon.png'" mode=""></image>
							</view>
							<view class="">
								{{ item.heart_rate_strength }}%
							</view>
						</view>
					</view>
					<!-- 实时心率 -->
					<view class="heart-box h28  flex-a flex-j flex-row" >
						<view 
							class="icon-box"
							:class="{
								icon4: userList.length <= 4, 
								icon9: userList.length <= 9 && userList.length > 4,
								icon16: userList.length > 9,
							}" 
						>
							<image :src="baseUrl + 'heartRateIconAdmin.png'" mode=""></image>
						</view>
						<view 
							class=""
							:class="{
								heart4: userList.length <= 4, 
								heart9: userList.length <= 9 && userList.length > 4,
								heart16: userList.length > 9,
							}" 
						>
							{{ item.heart_rate }}
						</view>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
	export default {
		props: {
			qrurl: { // 房间二维码 
				type: String,
				default: ''
			}
		},
		data() {
			return {
				baseUrl: baseUrl,
				/* 强度列表 */
				strengthArr: [
					[
						{
							tit: '低强度',
							classN: 'col1'
						},
						{
							tit: '中低强度',
							classN: 'col2'
						},
						{
							tit: '中强度',
							classN: 'col3'
						},
					],
					[
						{
							tit: '中高强度',
							classN: 'col4'
						},
						{
							tit: '中高+',
							classN: 'col5'
						},
						{
							tit: '高强度',
							classN: 'col6'
						},
					],
				],
				/* 用户列表 */
				userList: [],
				/* 当前时间 */
				newDate: "",
			};
		},
		methods: {
			toggleFun() {
				this.$emit("toggleStatus")
			},
			/* 获取父级数据 */
			getParentData(e) {
				this.userList = e;
			},
			/* getDate */
			getDate(date) {
				this.newDate = date;
			},
		}
	}
</script>

<style lang="scss" scoped>
.box{
	color: #fff;
}
.text-elpis{
	text-align: center;
}
.user-box {
	.li {
		.h33 {
			height: 33.33%;
		}
		.h38 {
			height: 38%;
		}
		.h28 {
			height: 28%;
		}
	}
	flex-wrap: wrap;
	height: calc(100vh - 380rpx);
	padding: 10rpx;
}
</style>
