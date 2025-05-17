<template>
	<view>
		<view class="list mar-b40 flex-row flex-a" v-for="(item, index) in list" :key="index">
			<view class="li-img">
				<image :src="item.template.image" mode=""></image>
			</view>
			<view class="li-info pad-l20 padtb20">
				<view class="name flex-row flex-a mar-b10">
					<view class="name-txt">
						{{ item.template.name }}
					</view>
					<view class="checkQr mar-l20 flex" @click="previewImage(item)">
						二维码
					</view>
				</view>
				<view class="state mar-b10">
					状态：{{ item.status_text }}
				</view>
				<view class="start-time mar-b10">
					开始时间: {{ item.starttime_text }}
				</view>
				<view class="end-time mar-b10">
					开始时间: {{ item.endtime_text }}
				</view>
				<view class="rule mar-b10">
					最少{{ item.template.min }}人，最多{{ item.template.max }}人，已预约{{ item.member.length }}人
				</view>
				<view class="address mar-b10">
					地址： {{ item.store_name }}
				</view>
				<view class=" mar-t20 user-imgs flex-row flex-a">
					<view class="imgs" @click="onUserImg(imgItem)" v-for="(imgItem, imgIndex) in item.member" :key="imgIndex">
						<image class="img-user" :src="imgItem.uidavatar" mode=""></image>
						<image v-if="imgItem.status == 5" class="img-state" :src="baseUrl + 'selectIcon.png'" mode=""></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { getLeagueClassQr } from "@/api/storeApis.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			list: [],
		};
	},
	methods: {
		/* 获取数据 */
		getData(e) {
			this.list = e;
		},
		/* 查看用户信息 */
		onUserImg(e) {
			uni.navigateTo({
				url: `/pages/myCenter/pages/myInfo/myInfo?type=look&uId=${e.uid}`
			})
		},
		/* 预览图片 */
		previewImage(e) {
			getLeagueClassQr({
				id: e.id
			}).then(res => {
				uni.previewImage({
					urls: [res.data.url],
				});
			})
			
		},
	}
};
</script>

<style lang="scss" scoped>
	.mar-b10 {
		margin-bottom: 10rpx;
	}
.list {
	.li-info {
		.imgs {
			width: 70rpx;
			height: 70rpx;
			margin-right: 10rpx;
			position: relative;
			.img-state {
				position: absolute;
				width: 40rpx;
				height: 40rpx;
				top: -14rpx;
				right: -4px;
			}
			.img-user {
				border-radius: 50%;
				width: 100%;
				height: 100%;
			}
		}
		.name {
			font-size: 34rpx;
			color: #c29870;
		}
		.start-time,
		.end-time {
			
		}
		color: rgba(0,0,0,0.41);
		font-size: 26rpx;
		.checkQr {
			// background-color: #d9b44e;
			background-image: linear-gradient(to right, #fdbab6, #641492);
			// background-image: linear-gradient(to right, red , yellow);
			width: 130rpx;
			height: 50rpx;
			border-radius: 20rpx;
			color: #fff;
			font-size: 24rpx;
		}
		width: 65%;
	}
	.li-img {
		image {
			width: 100%;
			height: 200rpx;
		}
		width: 35%;
	}
	// background-color: #eee;
	// height: 200rpx;
	box-shadow: 1px 1px 10rpx 5rpx #eee;
	border-radius: 10rpx;
}
</style>
