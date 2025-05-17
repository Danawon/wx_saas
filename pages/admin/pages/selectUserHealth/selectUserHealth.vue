<template>
	<view class="wrap-min">
		<head-nav
			title="选择用户"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="search-box  padlr20 pad-b20">
			<view class="search-ipt">
				<u-search
					borderColor="#FE5E10"
					shape="round"
					bgColor="#fff"
					height="70rpx"
					placeholder="输入用户ID"
					:showAction="false"
					:inputStyle="{
						'padding-right': '95rpx'
					}"
					type="number"
					v-model="searchVal"
				></u-search>
			</view>
			<view class="search-btn flex" @click="searchFun">
				搜索
			</view>
		</view>
		<view class="btn-box pad20 flex-row ju-bt">
			<view class="btn btn-l flex" @click="goRouter(3)">
				
				{{ is_patient ? '添加患者' : '添加分组会员' }}
			</view>
			<view class="btn btn-r flex" @click="goRouter(1)" v-if="!is_patient">
				查看分组数据
			</view>
		</view>
		<view class="user-list pad20">
			<view class="li Info2 pad20 mar-b20" v-for="(item, index) in list" :key="index" >
				<view class="li-info flex-row flex-a">
					<view class="ifno-img" @click="goDetail(item)">
						<u-avatar
							:src="item.user.avatar"
							size="110rpx"
						></u-avatar>
					</view>
					<view
						class="info-name mar-l20 flex-col ju-bt"
					>
						<view class="name">{{ item.user.nickname }}</view>
						<view class="name mobile-txt mar-b10" >
							电话：{{ item.user.authorize_mobile || '' }}
						</view>
						<view class="their" v-if="!is_patient">
							所属分组：{{ item.group_name || '' }}
						</view>
						<view class="their" v-if="is_patient">
							UID：{{ item.uid || '' }}
						</view>
					</view>
				</view>
				<view class="li-btns flex-row flex-a mar-t20">
					<view class="btn mar-l20" @click.stop="removeFun(item)">
						
						{{ is_patient ? '移除患者' : '从改分组移除' }}
					</view>

					<view class="btn mar-l20" @click.stop="goRouter(2, item)" v-if="!is_patient">
						查看该用户数据
					</view>
				</view>
			</view>
		</view>
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
		
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { storeUserList, removeUser, addGroupingUser } from "@/api/admin.js"
import modalTips from '@/components/modalTips/modalTips.vue';
export default {
	components: {
		modalTips,
	},
	data() {
		return {
			baseUrl: baseUrl,
			searchVal: "",
			current: 1,
			list: [],
			storeId: "", // 门店id
			is_patient: "", // 是否是患者列表进入
			doctorId: "", // 医生id
		};
	},
	onLoad(e) {
		this.is_patient = e.type ?? ''
		this.storeId = e.storeId;
		this.doctorId = e.doctorId ?? ""
		this.getStoreUserList();
	},
	onShow() {
		uni.$off("selectedAddgroupingUsers")
		uni.$on("selectedAddgroupingUsers", e => {
			this.addConfirm(e);
		})
	},
	onReachBottom() {
		this.current ++;
		this.getStoreUserList();
	},
	methods: {
		goDetail(item) {
			console.log(item, "--eve");
			uni.navigateTo({
				url: `/pages/admin/pages/userDetail/userDetail?id=${item.uid}`
			})
		},
		// modal确定 添加用户到分组
		addConfirm(ids) {
			addGroupingUser({
				store_id: this.storeId || '',
				uids: ids,
				group_type: this.is_patient,
				leader_id: this.doctorId
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.resetFun();
				},1500)
			})
		},

		// 从当前项目移除
		removeFun(item) {
			uni.showModal({
				title: "提示",
				content: "确定从分组移除吗！",
				success:res => {
					if(res.confirm) { 
						removeUser({
							uid: item.id
						}).then(res =>{
							uni.showToast({
								title: res.msg
							})
							setTimeout(() => {
								this.resetFun();
							},1500)
						})
					}
				}
			})
		},
		resetFun() {
			this.current = 1;
			this.list = [];
			this.getStoreUserList();
		},
		// 获取用户列表
		getStoreUserList() {
			storeUserList({
				list_rows: 20,
				page: this.current,
				store_id: this.storeId || '',
				uid: this.searchVal,
				group_type: this.is_patient,
				leader_id: this.doctorId
			}).then(res => {
				this.list = [...this.list, ...res.data.data];
			})
		},
		// 跳转
		goRouter(type, item) {
			/* 
				type -> 1 分组数据
				type -> 2个人用户数据
				type -> 3 添加分组会员 
				
			 */
			let url = ""
			if(type == 1) {
				url = `/pages/admin/pages/bodyDataComparison/bodyDataComparison?type=${type}&storeId=${this.storeId}`
			}else if(type == 2) {
				url = `/pages/admin/pages/bodyDataComparison/bodyDataComparison?id=${item.id}&type=${type}`
			}else if(type == 3){
				url = `/pages/admin/pages/selectUser/selectUser?type=${this.doctorId ? 'manager': 'addGrouping'}&doctor=doctor`
			}
			uni.navigateTo({
				url: url
			})
		},
		// 点击搜索
		searchFun() {
			this.resetFun();
		},
	}
};
</script>

<style lang="scss" scoped>
	.mobile-txt {
		font-size: 26rpx !important;
	}
.btn-box {
	.btn {
		width: 47%;
		height: 60rpx;
		border-radius: 10rpx;
		background-color: #fe5e10;
		font-size: 22rpx;
		color: #fff;
	}
}
.user-list {
	.li {
		.li-btns {
			.btn {
				border-radius: 8rpx;
				padding: 5rpx 20rpx;
				font-weight: 400;
				color: #999999;
				font-size: 22rpx;
				border: 1px solid #999999;
			}
			justify-content: flex-end;
		}
		.li-info {
			.info-name {
				.name {
					font-weight: 400;
					color: #202020;
					font-size: 32rpx;
				}
				.their {
					font-weight: 300;
					color: rgba(0, 0, 0, 0.6);
					font-size: 22rpx;
				}
				height: 85rpx;
			}
		}
		background-color: #fff;
		border-radius: 30rpx;
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
		top: -1rpx;
		right: 20rpx;
	}
	.search-ipt {
		width: 95%;
	}
	width: 100%;
	position: relative;
	    background: #fff;
}
</style>
