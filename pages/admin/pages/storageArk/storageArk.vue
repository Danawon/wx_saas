<template>
	<view>
		<head-nav
			title="储物柜管理"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view
			class="list-box felx-row flex-a  mar-t20 mar-l20 mar-r20 mar-b20"
			:class="{'pad-b100': lockerList.length}"
		>
			<view
				class="li flex-col ju-bt flex-a mar-b40"
				v-for="(item, index) in lockerList"
				:key="index"
				@click="onLocker(item)"
			>
				<!-- @click="selectFun(item)" -->
				<view class="li-tit">{{ item.boxNo }}号柜</view>
				<view class="li-img martb20">
					<u--image
						:showLoading="true"
						:src="baseUrl + 'locker1.png'"
						width="100rpx"
						height="75rpx"
						mode="scaleToFill"
					></u--image>
				</view>
				<view class="icon-box" >
					<u-icon
						name="setting"
						color="#fff"
						size="28rpx"
					></u-icon>
				</view>
				<view class="btn-state flex">
					<view
						class="stat1 btn"
						v-if="item.status == 1"
					>
						已租
					</view>
					<!-- <view class="stat2 btn" v-else @click.stop="jump('set',item)">修改</view> -->
				</view>
			</view>
		</view>
		<view class="fot-btn pad20" >
			<view class="btn flex" @click="jump('add')">新增</view>
		</view>
		<u-empty
			v-if="!lockerList.length"
			mode="list"
			text="暂无储物柜哦~..."
		></u-empty>


		
		<u-action-sheet
			:actions="sheetList"
			title="选择设备"
			@close="sheetShow = false"
			@select="selectOptions"
			round="20rpx"
			:closeOnClickOverlay="true"
			:safeAreaInsetBottom="true"
			:closeOnClickAction="true"
			:show="sheetShow"
			cancelText="取消"
		></u-action-sheet>	
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { storeLockerList, delLockerStore, openLockerStore, releaseLocker } from '@/api/admin.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			searchVal: '', // 搜索val
			// 柜子列表
			lockerList: [],
			cabinetId: "", // 设备id
			current: 1, // 当前页
			sheetShow: false, // 操作 show
			/* 操作列表 */
			sheetList: [],
			/* 选中柜子id */
			loackerId: "",
		};
	},
	onLoad(eve) {
		this.cabinetId = eve.cabinetId;
	},
	onShow() {
		this.current = 1;
		this.lockerList = [];
		this.getStoreLockerList(); // 门店储物柜列表
	},
	onReachBottom() {
		this.current ++ 
		this.getStoreLockerList(); // 门店储物柜列表
	},
	methods: {
		/* 释放柜子 */
		releaseLockerFun() {
			releaseLocker({
				id: this.loackerId
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.current = 1;
					this.lockerList = [];
					this.getStoreLockerList(); // 门店储物柜列表
				},1500)
			})
		},
		/* 开启柜子 */
		openLockerFun() {
			openLockerStore({
				id: this.loackerId
			}).then(res => {
				uni.showToast({
					title: res.msg
				})
			})
		},
		/* 删除柜子 */
		delLockerFun() {
			delLockerStore({
				id: this.loackerId
			}).then(res =>{
				uni.showToast({
					title: res.msg
				})
				setTimeout(() => {
					this.current = 1;
					this.lockerList = [];
					this.getStoreLockerList(); // 门店储物柜列表
				}, 1500)
			})
		},
		/* 选中柜子 */
		onLocker(e) {
			this.loackerId = e.id;
			this.sheetShow = true;
			if(e.status == '1') {
				this.sheetList = [
					{
						name: "编辑",
						id: 1,
					},	{
						name: "删除",
						id: 2,
					},	{
						name: "开箱",
						id: 3,
					},{
						name: "释放",
						id: 4,
					},
				]
			}else {
				this.sheetList = [
					{
						name: "编辑",
						id: 1,
					},	{
						name: "删除",
						id: 2,
					},	{
						name: "开箱",
						id: 3,
					}
				]
			}
		},
		/* 选中操作 */
		selectOptions(e) {
			if(e.id == 1) {
				/* 编辑 */
				this.jump('set');
			}else if(e.id == 2) {
				/* 删除 */
				this.delLockerFun();
			}else if(e.id == 3) {
				/* 开箱 */
				this.openLockerFun();
			}else if(e.id == 4) {
				/* 释放*/
				this.releaseLockerFun();
			}
		},
		//跳转设置
		jump(type,item) {
			if(type == 'add') {
				uni.navigateTo({
					url:
						`/pages/admin/pages/storageArkSet/storageArkSet?type=add&id=${this.cabinetId}`
				});
			}else if(type == 'set') {
				uni.navigateTo({
					url:
						`/pages/admin/pages/storageArkSet/storageArkSet?type=set&id=${this.loackerId}`
				});
			}
			
		},

		// 获取门店柜子列表
		getStoreLockerList() {
			storeLockerList({
				cabinetId: this.cabinetId,
				list_rows:20,
				page: this.current,
			}).then(res => {
				this.lockerList = [...this.lockerList, ...res.data.data];
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.fot-btn {
	margin-top: 60rpx;
	position: fixed;
	padding: 0 20rpx 40rpx;
	bottom: 0rpx;
	left: 0;
	width: 100%;
	background-color: #fff;
	.btn {
		width: 100%;
		height: 80rpx;
		background-color: #fe5e10;
		border-radius: 40rpx;
		color: #fff;
	}
}
.pad-b100 {
	padding-bottom: 100rpx;
}
.list-box {
	
	.li {
		position: relative;

		.icon-box {
			position: absolute;
			background-color: #fe5e10;
			border-radius: 50%;
			padding: 8rpx 8rpx;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		.btn-state {
			.stat2 {
				background: linear-gradient(
					272deg,
					#fe5e10 0%,
					rgba(254, 94, 16, 0.5) 100%
				);
			}
			.stat1 {
				background-color: #c9caca;
			}
			.btn {
				font-weight: 400;
				font-size: 24rpx;
				color: #fff;
				width: 75%;
				padding: 7rpx 0;
				text-align: center;
				display: inline-block;
				border-radius: 40rpx;
			}
			width: 100%;
		}
		.li-tit {
			font-weight: 400;
			color: #202020;
			font-size: 28rpx;
		}
		width: 20%;
	}
	padding-bottom: 100rpx;
	flex-wrap: wrap;
}
</style>
