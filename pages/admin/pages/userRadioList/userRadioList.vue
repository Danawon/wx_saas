<template>
	<view>
		<head-nav
			title="选择用户"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="search-box  pad20">
			<view class="search-ipt">
				<u-search
					borderColor="#FE5E10"
					shape="round"
					bgColor="#fff"
					height="70rpx"
					placeholder="搜索关键词"
					:showAction="false"
					:inputStyle="{
						'padding-right': '95rpx'
					}"
					v-model="searUserVal"
				></u-search>
			</view>
			<view class="search-btn flex" @click="searchUserFun">
				搜索
			</view>
		</view>
		<view class="list-box padlr20 pad-t20 mar-t20">
			<view class="checkAll martb20" @click="checkAllFun">
				全选/反选
			</view>
			<u-radio-group
				v-model="radioValue"
				placement="column"
			>
				<view
					class="li mar-b20"
					v-for="(item, index) in userList"
					:key="index"
				>
					<view class="li-info flex-row flex-a ">
						<view
							class="info-check flex-row flex-a ju-bt"
						>
							 <u-radio
								shape="square"
							    :customStyle="{marginBottom: '8px'}"
							    :name="item.id"
							>
							</u-radio>
							<view class="avatar">
								<u-avatar
									:src="item.avatar"
									size="150rpx"
								></u-avatar>
							</view>
						</view>

						<view
							class="info-name felx-row flex-a ju-bt pad-l20"
						>
							<view
								class="name-tel flex-col ju-bt"
							>
								<view class="name">
									{{ item.nickname }}
								</view>
								<view class="tel mar-t">
									手机号：{{ item.mobile }}
								</view>
								<view class="tel">
									ID：{{ item.id }}
								</view>
							</view>
						</view>
					</view>

					<view class="li-line">
						<u-line margin="20rpx 0"></u-line>
					</view>
				</view>
			</u-radio-group>
			
			<u-empty
				v-if="!userList.length"
				mode="list"
				text="暂无用户..."
			></u-empty>
		</view>
		<view class="fot-box ">
			<view class="btn flex" @click="confirmFun">确定</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { searchUserGet } from "@/api/admin.js"
import { editBindingNfc } from '@/api/storeApis.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 用户列表
			userList: [],
			// 当期页
			current: 1,
			// 搜索val
			searUserVal: "",
			// 父级页面状态
			type: "",
			radioValue: "", // 选中的会员
		};
	},
	onReachBottom() {
		this.current ++ 
		this.searchUserGetFun();
	},
	onLoad(e) {
		this.storeId = e.storeId ?? "";
		this.type = e.type;
		this.nfcId = e.nfcId;
	},
	onShow() {
		this.current = 1;
		this.userList = [];
		this.searchUserGetFun();
	},
	methods: {
		// 搜索用户
		searchUserFun() {
			this.current = 1;
			this.userList = [];
			this.searchUserGetFun();
		},
		// 搜索用户
		searchUserGetFun() {
			searchUserGet({
				page: this.current,
				list_rows: 20,
				keyword: this.searUserVal,
				condition: '',
				store_id: this.storeId
			}).then(res => {
				this.userList = [...this.userList, ...res.data.data];
			})
		},
		// 确定 选中用户
		confirmFun() {
			if(!this.radioValue) {
				uni.showToast({
					title: "请勾选中用户",
					icon: "error"
				})
				return
			}
			/* 编辑NFC */
			if(this.type === "editNfc") {
				editBindingNfc({
					id: this.nfcId,
					uid: this.radioValue
				}).then(res => {
					uni.showToast({
						title: res.msg
					})
					setTimeout(() => {
						uni.navigateBack()
					},1500)
				})
			}
			
		},
	}
};
</script>

<style lang="scss" scoped>
.list-box {
	padding-bottom: 110rpx;
}
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
.li {
	.li-info {
		.info-check {
			width: 38%;
			padding: 0 20rpx;
		}
		.info-name {
			.name-tel {
				.tel {
					font-weight: 400;
					color: rgba(0, 0, 0, 0.6);
					font-size: 22rpx;
				}
				.mar-t {
					margin: 12rpx 0;
				}
				.name {
					font-weight: 400;
					color: #202020;
					font-size: 32rpx;
				}
				
			}
			width: 62%;
		}
	}
}
.search-box {
	.search-btn {
		width: 150rpx;
		height: 75rpx;
		color: #fff;
		font-size: 28rpx;
		margin-left: -20rpx;
		background: linear-gradient(
			102deg,
			#ff7c3c 0%,
			#fe5e10 100%
		);
		border-radius: 50rpx;
		position: absolute;
		top: 20rpx;
		right: 20rpx;
	}
	.search-ipt {
		width: 95%;
	}
	width: 100%;
	position: relative;
	// margin: 40rpx 0;
}
</style>
