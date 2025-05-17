<template>
	<view class="wrap-min">
		<head-nav
			title="NFC绑定管理"
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

		<view class="user-list pad20">
			<view
				class="li Info2 pad20 mar-b20"
				v-for="(item, index) in list"
				:key="index"
			>
				<view class="li-info flex-row flex-a">
					<view class="info-l flex-row flex-a">
						<view class="ifno-img">
							<u-avatar
								:src="item.user.avatar"
								size="110rpx"
							></u-avatar>
						</view>
						<view
							class="info-name mar-l20 flex-col ju-bt"
						>
							<view class="name">
								{{ item.user.nickname }}
							</view>
							<view class="id-sty">
								uid：{{ item.uid }}
							</view>
							<view class="id-sty">
								NFC卡号：{{ item.nfc_number }}
							</view>
						</view>
					</view>
					<view
						class="li-btns flex-row flex-a mar-t20"
					>
						<view
							class="btn btn1 "
							@click.stop="goRouter(item, 'edit')"
						>
							编辑
						</view>

						<view
							class="btn btn2 mar-l20"
							@click.stop="goRouter(item, 'del')"
						>
							删除
						</view>
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
import { getNfcList, delNfc } from '@/api/storeApis.js';
export default {
	components: {},
	data() {
		return {
			baseUrl: baseUrl,
			searchVal: '',
			current: 1,
			list: [],
		};
	},
	onLoad(e) {
	},
	onShow() {
		this.resetFun();
	},
	onReachBottom() {
		this.current++;
		this.getNfcListFun();
		
	},
	methods: {
		/* 获取门禁授权列表 */
		getNfcListFun() {
			getNfcList({
				list_rows: 20,
				page: this.current,
				keyword: this.searchVal
			}).then(res => {
				this.list = [...this.list, ...res.data.data];
			});
		},
		// 删除
		deleteFun(item) {
			uni.showModal({
				title: '提示',
				content: '确定删除当前用户吗',
				success: res => {
					if (res.confirm) {
						delNfc({id: item.id}).then(res => {
							uni.showToast({
								title: res.msg,
								mask: true,
							})
							setTimeout(() => {
								this.resetFun();
							},1500)
						})
					}
				}
			});
		},
		resetFun() {
			this.current = 1;
			this.list = [];
			this.getNfcListFun();
		},

		// 跳转
		goRouter(item, type) {
			let url = '';
			if(type === "del"){
				this.deleteFun(item);
			}else if(type === "edit") {
				url = `/pages/admin/pages/userRadioList/userRadioList?type=editNfc&nfcId=${item.id}`
			}
			uni.navigateTo({
				url: url
			});
		},
		// 点击搜索
		searchFun() {
			this.resetFun();
		}
	}
};
</script>

<style lang="scss" scoped>
.user-list {
	.li {
		.li-btns {
			.btn1 {
				background-color: #3c9cff;
			}
			.btn2 {
				background-color: #f56c6c;
			}
			.btn {
				border-radius: 8rpx;
				padding: 8rpx 20rpx;
				font-weight: 400;
				color: #fff;
				font-size: 22rpx;
			}
			justify-content: flex-end;
			width: 40%;
		}
		.li-info {
			.info-name {
				.id-sty {
					font-size: 24rpx;
					color: #999;
				}
				.name {
					font-weight: 400;
					color: #202020;
					font-size: 32rpx;
				}
				height: 85rpx;
			}
			.info-l {
				width: 60%;
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
