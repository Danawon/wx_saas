<template>
	<view class="modal-box">
		<u-modal
			:show="modalShow"
			:cancelText="cancelText"
			:confirmText="confirmText"
			:confirmColor="confirmColor"
			:cancelColor="cancelColor"
			:closeOnClickOverlay="maskClose"
			:showCancelButton="showCancelButton"
			:showConfirmButton="showConfirmButton"
			@confirm="modalConfirm"
			@cancel="modalCancel"
		>
			<view class="slot-content ">
				<view
					class="title flex"
					:style="
						'background: url(' +
							baseUrl +
							'jb.png' +
							'); background-size: 100% 100%;background-repeat: no-repeat;'
					"
				>
					{{ title }}
				</view>
				<view class="pad-l40 pad-r40" :style="{background: slotContentBg}">
					<slot></slot>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
export default {
	name: 'modalTips',
	props: {
		modalShow: {
			type: Boolean,
			default: false
		},
		// 弹框标题
		title: {
			type: String,
			default: '提示'
		},
		// 确定按钮文字
		confirmText: {
			type: String,
			default: '确定'
		},
		// 确定按钮文字颜色
		confirmColor: {
			type: String,
			default: '#2979ff'
		},
		// 是否显示确定按钮
		showConfirmButton: {
			type: Boolean,
			default: true
		},
		// 取消按钮文字
		cancelText: {
			type: String,
			default: '取消'
		},
		// 取消按钮文字颜色
		cancelColor: {
			type: String,
			default: '#606266'
		},
		// 是否允许点击遮罩层关闭
		maskClose: {
			type: Boolean,
			default: false
		},
		// 是否显示取消按钮
		showCancelButton: {
			type: Boolean,
			default: true
		},
		slotContentBg: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			baseUrl: baseUrl
		};
	},
	options: { styleIsolation: 'shared' },
	methods: {
		// 确定
		modalConfirm() {
			this.$emit('parentConfirm');
		},
		// 取消
		modalCancel() {
			this.$emit('parentCancel');
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep .u-modal__content {
	padding: 0;
	padding-top: 0 !important;
}
::v-deep .u-popup__content {
	border-radius: 30rpx !important;
}
.slot-content {
	width: 100%;
}
.title {
	width: 100%;
	height: 140rpx;
	font-weight: 600;
	color: rgba(0, 0, 0, 0.9);
	font-size: 33rpx;
	background-repeat: no-repeat;
	// padding-top: 40rpx;
}
</style>
