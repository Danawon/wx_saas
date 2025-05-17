<template>
	<view>
		<head-nav
			title="训练计划"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		  <u-tabs :list="tabsList" @click="click"></u-tabs>
		<view class="box pad20">
			<view 
				class="li mar-t20" 
				v-for="(itemA, indexB) in list" 
				:key="indexB"
				:class="{'shadow-sty': itemA.prescription_title}"
			>
				<view 
					class="li-block flex flex-a ju-bt pad20"
					v-if="itemA.prescription_title"
					@click="clickRecipe(itemA)"
				>
					<view class="lable-txt flex flex-a">
						<u--image
							:showLoading="true" 
							:src="baseUrl +'recipe-img1.png'"
							width="45px" 
							height="45px" 
						></u--image>
						<view class="mar-l20">
							{{ itemA.prescription_title }}
						</view>
					</view>
					<u-icon 
						name="arrow-down" 
						color="#333" 
						size="23"
					></u-icon>
				</view>
				<u-line v-if="itemA.prescription_title"></u-line>
				<view 
					class="li-block-child "
				>
					<view 
						class="flex-row flex-a ju-bt pad-l20 " 
						v-for="(item, index) in itemA.item"
						@click.stop="goRoute(item)"
						:class="{'pad-t20': !itemA.prescription_title}"
					>
						<view class="li-l">
							<u--image 
								v-if="item.status === 1"
								:showLoading="true" 
								:src="baseUrl +'planSuccess.png'"
								width="65px" 
								height="65px" 
							></u--image>
							<u--image 
								v-if="item.status === 3"
								:showLoading="true" 
								:src="baseUrl +'planUnderway.png'"
								width="70px" 
								height="70px" 
							></u--image>
						</view>
						<view class="li-r">
							<view class="name-box flex-row flex-a">
								<view class="name">
									{{ item.title }}
								</view>
								<view class="type-box mar-l20">
									<view class="type1 flex">
										{{ item.typename }}
									</view>
								</view>
							</view>
							<view class="time-box flex-row flex-a">
								<view class="">进度：</view>
								<view >
									已完成<text class="currentNum">{{ item.unifiedcount.status1 }}</text>节
								</view>
								<view class="">
									/总共<text class="totalNum">{{ item.unifiedcount.count }}</text>节
								</view>

							</view>
						</view>
					</view>
					<u-line margin="20rpx 0" v-if="itemA.prescription_title"></u-line>
				</view>
				
				
			</view>
			<u-empty
				v-if="!list.length"
				mode="list"
				text="暂无计划..."
			></u-empty>
		</view>
	</view>
</template>

<script>
	import { baseUrl } from '@/utils/baseUrl.js';
	import { trainingProgram } from "@/api/myCenter.js"
	export default {
		data() {
			return {
				baseUrl: baseUrl,
				current: 1, // 当前页
				list: [],
				enterInto: "", // 进入页面的类型
				uid: '', // 用户id
			};
		},
		onLoad(e) {
			this.uid = e.uid ?? ''
			this.enterInto = e.enterInto ?? ''
		},
		onShow() {
			this.reset();
			this.getTrainingProgram();
		},
		onReachBottom() {
			this.current ++
			this.getTrainingProgram();
		},
		methods: {
			/* 点击处方 */
			clickRecipe(item) {
				uni.navigateTo({
					url: `/pages/doctor/recipeAdmin/recipeAdmin?type=user&recipeId=${item.prescription_id}`
				})
			},
			reset() {
				this.current = 1;
				this.list = [];
			},
			// 获取训练计划
			getTrainingProgram() {
				trainingProgram({
					page: this.current,
					list_rows:20,
					uid: this.uid,
					type: this.enterInto ? 'home_training' : 'personal_trainers'
				}).then(res => {
					this.list = [...this.list, ...res.data]
				})
			},
			// 跳转
			goRoute(eve) {
				uni.navigateTo({
					url: `/pages/myCenter/pages/trainingDetail/trainingDetail?id=${eve.id}&type=${this.uid ? 'other' : ''}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.shadow-sty {
	box-shadow: 1px 1rpx 10rpx 10rpx #ccc;
	border-radius: 15rpx;
}
.li {
	
	.li-block {
		border-radius: 15rpx;
	}
	.li-block-child {
		.li-l {
			width: 20%;
		}
		.li-r {
			width: 80%;
		}
	}
	.time-box {
		.currentNum {
			color: #fe5e10;
			font-weight: bold;
		}
		.totalNum{
			color: #3c9cff;
			font-weight: bold;
		}
		font-size: 24rpx;
		margin-top: 15rpx;
	}

	.name-box {
		.type-box {
			.type1 {
				display: inline-block;
				padding: 5rpx 10rpx;
				border: 1px solid #FFA376;
				border-radius: 8rpx;
				color: #FFA376;
			}
			font-size: 22rpx;
			
		}
		.name {
			color: #202020;
			font-size: 27rpx;
		}

	}
}
</style>
