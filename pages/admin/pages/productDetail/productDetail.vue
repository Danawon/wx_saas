<template>
	<view class="wrap-min">
		<head-nav
			title="产品管理"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="pad20 li-box">
			<view class="li ">
				<view
					class="li-info flex-row flex-a ju-bt padlr20"
				>
					<view class="lable">卡的类别</view>
					<view class="lable-val">
						{{ productInfo.card_type_text || 0 }}
					</view>
				</view>
				<u-line margin="40rpx 0"></u-line>
			</view>
			<view class="li ">
				<view
					class="li-info flex-row flex-a ju-bt padlr20"
				>
					<view class="lable">约课人数</view>
					<view class="lable-val">
						{{ productInfo.number || 0 }}人
					</view>
				</view>
				<u-line margin="40rpx 0"></u-line>
			</view>
			<view class="li ">
				<view
					class="li-info flex-row flex-a ju-bt padlr20"
				>
					<view class="lable">产品类别</view>
					<view class="lable-val lable-val2">
						{{ productInfo.product_type_text || 0 }}
					</view>
				</view>
				<u-line margin="40rpx 0 20rpx 0"></u-line>
			</view>
			<view class="li ">
				<view
					class="li-info flex-row flex-a ju-bt padlr20"
				>
					<view class="lable">备注</view>
					<view class="lable-val">
						{{ productInfo.remark || "" }}
					</view>
				</view>
				<u-line margin="40rpx 0"></u-line>
			</view>
		</view>
		<view class="info-1 pad20 mar-t20">
			<view class="tit martb20">扩展信息</view>
			<view class="blcok padlr20 padtb40">
				<view
					class="li-info flex-row flex-a ju-bt "
					v-if="
						productInfo.product_type == 'fixed_card'
					"
				>
					<view class="lable">约课次数</view>
					<view class="lable-val flex-row flex-a">
						<text class="mar-r20">
							{{ productInfo.times || 0 }}
						</text>

						<u-switch
							disabled
							v-model="productInfo.times_show"
							:activeValue="1"
							:inactiveValue="0"
							size="20"
						></u-switch>
					</view>
				</view>
				<view
					class="li-info flex-row flex-a ju-bt "
					v-if="
						productInfo.product_type == 'fixed_card'
					"
				>
					<view class="lable">有效天数</view>
					<view class="lable-val ">
						{{ productInfo.days || 0 }}
					</view>
				</view>
				<view class="li-info flex-row flex-a ju-bt ">
					<view class="lable">单人限购次数</view>
					<view class="lable-val ">
						{{ productInfo.single_quota || 0 }}次
					</view>
				</view>
				<view class="li-info flex-row flex-a ju-bt ">
					<view class="lable">总共限购天数</view>
					<view class="lable-val ">
						{{ productInfo.total_quota || 0 }}天
					</view>
				</view>
			</view>

			<view class="tit mar-t40 mar-b20">封面图片</view>
			<u-image
				:showLoading="true"
				:src="productInfo.image"
				width="180rpx"
				height="180rpx"
				radius="20rpx"
			></u-image>
			<view class="tit mar-t40 mar-b20">基础信息</view>
			<view class="blcok padlr20 padtb40">
				<view class="li-info flex-row flex-a ju-bt ">
					<view class="lable">会员卡名称</view>
					<view class="lable-val ">
						{{ productInfo.name || 0 }}
					</view>
				</view>
				<view class="li-info flex-row flex-a ju-bt ">
					<view class="lable">现价</view>
					<view class="lable-val ">
						{{ productInfo.price || 0 }}
					</view>
				</view>
				<view class="li-info flex-row flex-a ju-bt ">
					<view class="lable">划线价</view>
					<view class="lable-val ">
						{{ productInfo.ot_price || 0 }}
					</view>
				</view>
				<view class="li-info flex-row flex-a ju-bt ">
					<view class="lable">自动激活</view>
					<view class="lable-val ">
						{{ productInfo.activation || 0 }}
					</view>
				</view>
				<view class="li-info flex-row flex-a ju-bt ">
					<view class="lable">简介</view>
					<view class="lable-val ">
						{{ productInfo.info || 0 }}
					</view>
				</view>
			</view>
			<view class="tit mar-t40 mar-b20">购买须知</view>
			<view class="lable martb20 white-space-pre_wrap">
				{{ productInfo.instructions || 0 }}
			</view>
			<view class="tit mar-t40 mar-b20">产品介绍</view>
			<view class="lable martb20 white-space-pre_wrap">
				{{ productInfo.content || 0 }}
			</view>
			<u-image
				:showLoading="true"
				:src="productInfo.product_image"
				width="180rpx"
				height="180rpx"
				radius="20rpx"
			></u-image>
			<view class="pad20"></view>
		</view>
	</view>
</template>

<script>
import { getProductDetail } from '@/api/admin.js';
export default {
	data() {
		return {
			productId: '', // 产品id
			productInfo: {} // 产品内容
		};
	},
	onLoad(eve) {
		this.productId = eve.id;
		this.getProductDetailFun();
	},
	methods: {
		getProductDetailFun() {
			getProductDetail({
				id: this.productId
			}).then(res => {
				this.productInfo = res.data;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.white-space-pre_wrap {
		white-space: pre-wrap;
	}
.blcok {
	& .li-info:not(:last-child) {
		margin-bottom: 60rpx;
	}
	background: #f9f9f9;
	border-radius: 24rpx;
}
.tit {
	font-weight: 550;
	color: rgba(0, 0, 0, 0.9);
	font-size: 32rpx;
}
.info-1 {
	background-color: #fff;
}
.li-info {
	.lable-val2 {
		color: rgba(0, 0, 0, 0.9) !important;
	}
	.lable-val {
		color: rgba(0, 0, 0, 0.4);
	}
	.lable {
		color: rgba(0, 0, 0, 0.9);
	}
	font-weight: 400;
	font-size: 28rpx;
}
.li-box {
	background-color: #fff;
	.li {
	}
}
</style>
