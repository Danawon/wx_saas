<template>
	<view>
		<head-nav
			bgColor="#fff"
			:goBack="true"
			titColor="#000"
			title="智能灯光控制"
		></head-nav>
		<view class="page pad20">
			<view class="page-top-btn flex" @click="goAddLamplight">
				新增灯光
			</view>
			<view
				class="li pad-t40 mar-t20 padlr20"
				v-for="(item, index) in list"
				:key="index"
				@click="editFun(item)"
			>
				<view class="name">
					设备名称：{{ item.device_name}}
				</view>
				<view class="name mar-t20">
					灯控名称：{{ item.name }}
				</view>
				<view class=" flex-row ju-bt">
					<view class="address">
						设备地址：{{ item.address }}
					</view>
					<view class="line">
						继电器：DO {{ item.line + 1 }}
					</view>
				</view>
				<view class="flex-a ju-bt page-li   padtb20">
					<text>灯控状态：</text>
					<view class="pad-r20" @click.stop="()=>{}">
						<u-switch
							v-model="item.status"
							:activeValue="1"
							:inactiveValue="0"
							activeColor="#0DBC14"
							@change.stop="switchChange(item)"
						></u-switch>
					</view>
				</view>
				<view
					class="delsty"
					@click.stop="deleteLightFun(item)"
				>
					<u-icon
						name="close-circle"
						color="#f56c6c"
						size="23"
					></u-icon>
				</view>
			</view>
		</view>
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import { lightingList, deleteLight, lightingSwitch } from '@/api/storeApis.js';
import { ellipticals_connect } from '@/api/myCenter.js';
import { ws } from '@/common/ws.js';

export default {
	data() {
		return {
			switchIndex: 0,
			current: 1,
			list: [],
			// 设备状态
			deviceState: 0,
			wsConnectState: false,
			existConnectSocketS: false,
			client_id: "",
			linkNums: 1,
			device_id: ""
		};
	},
	onLoad(e) {
	},
	onShow() {
		this.resetList();
	},
	onHide() {},
	onUnload() {
		if(this.wsConnectState || this.existConnectSocketS || this.deviceState) {
			ws.stop();
		}
	},
	methods: {
		
		/* 链接socket */
		connectSocket() {
			/* 存在socket实例 */
			this.existConnectSocketS = true;
			// 链接socket
			ws.socket(
				eve => {
					uni.showLoading({
						title: '连接设备中,请稍等...'
					});
					/* socket已断开 */
					this.wsConnectState = false;
				},
				() => {
					uni.hideLoading();
					this.wsConnectState = true;
				},
				this.wsMessageFun
			);
		},
		wsMessageFun(e) {
			/* ws服务链接成功 */
			this.wsConnectState = true;
			this.socketData = JSON.parse(e);
			if (!this.client_id && this.socketData.client_id) {
				this.client_id = this.socketData.client_id ?? '';
			}
			if(this.socketData.status == 5) {
				// 收到灯光指令刷新列表
				this.resetList();
			}
			// 设备id 和 客户id存在 加入分组
			if (
				this.device_id &&
				this.client_id &&
				this.linkNums <= 1 
			) {
				this.ellipticals_connectFun();
				this.linkNums += 1;
			}
		},
		/* socket服务 设备加入分组 */
		ellipticals_connectFun() {
			ellipticals_connect({
				device_id: this.device_id,
				client_id: this.client_id
			}).then(res => {
				this.deviceState = 1; // 加入分组代表链接设备成功
			});
		},
		// 开关改变
		switchChange(e) {
			lightingSwitch({
				id: e.id,
			}).then(res => {
				this.$refs.uToast.show({
					type: 'success',
					title: '成功主题(带图标)',
					message: res.msg
				});
			})
		},
		/* 删除灯光 */
		deleteLightFun(e) {
			uni.showModal({
				title: "提示",
				content: "确定删除吗？",
				success: eve => {
					if(eve.confirm) {
						deleteLight({
							id: e.id
						}).then(res => {
							this.$refs.uToast.show({
								type: 'success',
								title: '成功主题(带图标)',
								message: res.msg
							});
							setTimeout(() => {
								this.resetList();
							}, 1500);
						});
					}
				}
			})
			
		},
		resetList() {
			this.current = 1;
			this.getLightingList();
		},
		/* 新增灯光 */
		goAddLamplight() {
			uni.navigateTo({
				url: `/pages/admin/pages/addLamplight/addLamplight`
			});
		},
		// 灯控列表
		getLightingList() {
			lightingList({
				page: this.current,
				list_rows: 99,
			}).then(res => {
				this.list.splice(0);
				// this.list = [...this.list, ...res.data.data];
				res.data.map(item => {
					this.list.push(item)
				})
				if(this.list.length && !this.deviceState) {
					this.device_id = this.list[0].device_id;
					// this.device_id = "treadmill#A71BF17A71090C443DF94ED5875B1ACC#";
					this.connectSocket();
				}
			});
		},
		editFun(e) {
			uni.navigateTo({
				url: `/pages/admin/pages/lightControlEdit/lightControlEdit?id=${
					e.id
				}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.address,
.line {
	width: 50%;
}
.li {
	border-radius: 20rpx;
	box-shadow: 1px 1px 10rpx 5rpx #ccc;
	position: relative;
	font-size: 24rpx;
	.delsty {
		position: absolute;
		right: 20rpx;
		top: 15rpx;
	}
}
.page-top-btn {
	height: 80rpx;
	background: #fe5e10;
	color: #ffffff;
	font-size: 28rpx;
	border-radius: 10rpx;
}

.page {
	.btn {
		height: 80rpx;
		background: #fe5e10;
		font-weight: 500;
		color: #ffffff;
		font-size: 28rpx;
		border-radius: 8rpx;
	}

	.page-list {
		.page-li {
			padding: 36rpx 26rpx 32rpx 0;
			border-bottom: #e7e7e7 1rpx solid;
			font-size: 28rpx;
			font-weight: 400;
			color: rgba(32, 32, 32, 0.9);
			margin-bottom: 30rpx;
		}
	}
}
</style>
