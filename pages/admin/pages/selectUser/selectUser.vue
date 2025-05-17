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
			<u-checkbox-group
				v-model="checkboxValue"
				placement="column"
			>
				<view
					class="li mar-b20"
					v-for="(item, index) in userList"
					:key="index"
					@click="goRoute(item)"
				>
					<view class="li-info flex-row flex-a ">
						<view
							class="info-check flex-row flex-a ju-bt"
						>
							<u-checkbox
								:customStyle="{
									marginBottom: '8px'
								}"
								:name="item.id"
							></u-checkbox>
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
							<view class="name-icon" v-if="type !== 'addGrouping' && type !== 'addEntranceAuthorize'">
								<u-icon
									name="arrow-right"
									color="rgba(0,0,0,0.6)"
									size="32rpx"
									:bold="true"
								></u-icon>
							</view>
						</view>
					</view>

					<view class="li-line">
						<u-line margin="20rpx 0"></u-line>
					</view>
				</view>
			</u-checkbox-group>
			
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
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 选中的check值
			checkboxValue: [],
			// 用户列表
			userList: [],
			// 当期页
			current: 1,
			// 搜索val
			searUserVal: "",
			// 反选状态
			allState: false,
			// 父级页面状态
			type: "",
			is_doctor: 0,

		};
	},
	onReachBottom() {
		this.current ++ 
		this.searchUserGetFun();
	},
	onLoad(e) {
		this.storeId = e.storeId ?? "";
		this.type = e.type;
		this.is_doctor = e.doctor;
	},
	onShow() {
		this.current = 1;
		this.userList = [];
		this.searchUserGetFun();
	},
	methods: {
		// 全选
		checkAllFun() {
			this.allState = !this.allState
			if(this.allState) {
				this.userList.forEach(item => {
					if(!this.checkboxValue.includes(item.id)) {
						this.checkboxValue.push(item.id)
					}
				})
			}else {
				this.checkboxValue = [];
			}
		},
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
				condition: this.type || '',
				store_id: this.storeId
			}).then(res => {
				this.userList = [...this.userList, ...res.data.data];
			})
		},
		/* 单个发放 */
		goRoute(e) {
			if(this.type === "addGrouping" || this.type === "addEntranceAuthorize") {
				return
			}
			uni.navigateTo({
				url: `/pages/admin/pages/issueCoupons/issueCoupons?userIds=${e.id}&type=${this.type}`
			})
		},
		// 确定 批量发放
		confirmFun() {
			if(!this.checkboxValue.length) {
				uni.showToast({
					title: "请勾选中用户",
					icon: "error"
				})
				return
			}
			if(this.type === "addGrouping" || this.is_doctor) {
				uni.navigateBack()
				uni.$emit("selectedAddgroupingUsers", this.checkboxValue.join(","))
			}else if(this.type === "addEntranceAuthorize") {
				uni.navigateTo({
					url: `/pages/admin/pages/addEntranceAuthorize/addEntranceAuthorize?ids=${this.checkboxValue.join(",")}&type=add`
				})	
			} else {
				uni.navigateTo({
					url: `/pages/admin/pages/issueCoupons/issueCoupons?userIds=${this.checkboxValue.join(",")}&type=${this.type}`
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
